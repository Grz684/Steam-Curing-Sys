import signal
from pymodbus.exceptions import ModbusException, ConnectionException
import rclpy
from rclpy.node import Node
from std_srvs.srv import Trigger
import json
import random
import logging
from pymodbus.client import ModbusTcpClient
import concurrent.futures

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logging.getLogger('pymodbus').setLevel(logging.CRITICAL)

class TempHumidityPublisher(Node):

    def __init__(self):
        super().__init__('temp_humidity_publisher')
          
        self.srv = self.create_service(Trigger, 'get_sensor_data', self.get_sensor_data_callback)

        self.ip_address = '192.168.3.7'  # 请替换为您的实际IP地址
        self.base_port = 8001  # COM1 对应的起始端口号

        self.sensor_num = 15
        
        # 创建16个ModbusTcpClient，每个对应一个传感器
        self.modbus_clients = [
            ModbusTcpClient(self.ip_address, port=self.base_port + i, timeout=0.1)
            for i in range(self.sensor_num)
        ]

        self.get_logger().info('Temperature and Humidity Publisher node has been started')

    def read_temperature_humidity(self, client_index):
        client = self.modbus_clients[client_index]
        try:
            if not client.is_socket_open():
                if not client.connect():
                    return None, None

            # 读取两个寄存器，起始地址为0x0001
            result = client.read_holding_registers(address=0x0001, count=2, slave=1)
            
            if not result.isError():
                temp_raw = result.registers[0]
                humi_raw = result.registers[1]
                
                temperature = temp_raw / 10.0
                humidity = humi_raw / 10.0
                
                return temperature, humidity
            else:
                # self.get_logger().error(f"读取错误: {result}")
                return None, None
        except Exception as e:
            # self.get_logger().error(f"通信异常: {e}")
            return None, None

    def read_all_sensors(self):
        # 先初始化所有传感器的数据为默认值
        temperatures = {f'temperature_sensor_{i+1}': -1 for i in range(self.sensor_num)}
        humidities = {f'humidity_sensor_{i+1}': -1 for i in range(self.sensor_num)}
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.sensor_num) as executor:
            future_to_index = {executor.submit(self.read_temperature_humidity, i): i for i in range(self.sensor_num)}
            
            for future in concurrent.futures.as_completed(future_to_index):
                index = future_to_index[future]
                try:
                    temp, humi = future.result()
                    if temp is not None and humi is not None:
                        temperatures[f'temperature_sensor_{index+1}'] = round(temp, 2)
                        humidities[f'humidity_sensor_{index+1}'] = round(humi, 2)
                except Exception as exc:
                    # 异常已经被记录，字典已经有默认值，不需要再做什么
                    pass

        return temperatures, humidities

    def get_sensor_data_callback(self, request, response):
        # 模拟获取16个温度和16个湿度数据
        temperatures, humidities = self.read_all_sensors()
        
        data = {
            "temperatures": temperatures,
            "humidities": humidities
        }
        
        response.message = json.dumps(data)
        response.success = True
        return response
    
    def close_all_connections(self):
        for client in self.modbus_clients:
            if client.is_socket_open():
                client.close()

def main(args=None):
    rclpy.init(args=args)
    temp_humidity_publisher = TempHumidityPublisher()
    
    # 添加标志来跟踪节点和 rclpy 是否已被关闭
    node_destroyed = False
    rclpy_shutdown = False

    def signal_handler(sig, frame):
        nonlocal node_destroyed, rclpy_shutdown
        if not node_destroyed:
            logger.info("收到传感器关闭信号")
            temp_humidity_publisher.close_all_connections()
            temp_humidity_publisher.destroy_node()
            node_destroyed = True
        if not rclpy_shutdown:
            rclpy.shutdown()
            rclpy_shutdown = True

    # 设置信号处理器
    signal.signal(signal.SIGINT, signal_handler)

    try:
        rclpy.spin(temp_humidity_publisher)
    except Exception as e:
        logger.error("传感器节点错误: %s", e)
    finally:
        if not node_destroyed:
            logger.info("传感器节点正在终止...")
            temp_humidity_publisher.close_all_connections()
            temp_humidity_publisher.destroy_node()
            node_destroyed = True
        else:
            logger.info("传感器节点已经被信号处理器终止")
        
        if not rclpy_shutdown:
            rclpy.shutdown()
            rclpy_shutdown = True
        
        logger.info("传感器节点已全部终止")

if __name__ == '__main__':
    main()