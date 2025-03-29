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
import struct

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logging.getLogger('pymodbus').setLevel(logging.CRITICAL)

class TempHumidityPublisher(Node):

    def __init__(self):
        super().__init__('temp_humidity_publisher')
          
        self.srv = self.create_service(Trigger, 'get_sensor_data', self.get_sensor_data_callback)

        self.ip_address = '192.168.166.8'
        self.base_port = 1024

        self.sensor_num = 4
        
        # 创建4个ModbusTcpClient
        self.modbus_clients = [
            ModbusTcpClient(self.ip_address, port=self.base_port + i, timeout=0.5)
            for i in range(self.sensor_num)
        ]

        self.get_logger().info('Temperature and Humidity Publisher node has been started')

    def read_temperature_humidity(self, client_index):
        client = self.modbus_clients[client_index]
        try:
            if not client.is_socket_open():
                if not client.connect():
                    return None, None

            # 前两个传感器使用原来的方法读取温湿度
            if client_index < 2:
                result = client.read_holding_registers(address=0x0001, count=2, slave=1)
                
                if not result.isError():
                    temp_raw = result.registers[0]
                    humi_raw = result.registers[1]
                    
                    temperature = temp_raw / 10.0
                    humidity = humi_raw / 10.0
                    
                    return temperature, humidity
                else:
                    return None, None
            # 后两个传感器只读取温度，使用新协议
            else:
                # 发送查询帧
                result = client.read_holding_registers(
                    address=0x00,  # 起始寄存器地址
                    count=1,       # 读取1个寄存器
                    slave=0x01     # 设备地址
                )
                
                if not result.isError():
                    temp_raw = result.registers[0]
                    # 处理温度数据（负数采用补码形式）
                    if temp_raw > 32767:  # 负温度
                        temperature = (temp_raw - 65536) / 10.0
                    else:
                        temperature = temp_raw / 10.0
                    
                    return temperature, None  # 只返回温度，湿度为None
                else:
                    return None, None

        except Exception as e:
            logger.error(f"通信异常: {e}")
            return None, None

    def read_all_sensors(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.sensor_num) as executor:
            future_to_index = {executor.submit(self.read_temperature_humidity, i): i for i in range(self.sensor_num)}
            
            temperatures = {f'temperature_sensor_{i+1}': -1 for i in range(self.sensor_num)}
            humidities = {f'humidity_sensor_{i+1}': -1 for i in range(self.sensor_num)}
            
            for future in concurrent.futures.as_completed(future_to_index):
                index = future_to_index[future]
                try:
                    temp, humi = future.result()
                    
                    if temp is not None:
                        temperatures[f'temperature_sensor_{index+1}'] = round(temp, 2)
                    
                    if humi is not None:
                        humidities[f'humidity_sensor_{index+1}'] = round(humi, 2)
                except Exception:
                    # 异常情况下不需要做任何事，因为默认值已经设置好了
                    pass

        return temperatures, humidities

    def get_sensor_data_callback(self, request, response):
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