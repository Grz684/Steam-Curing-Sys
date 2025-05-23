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

class TempHumidityPublisher(Node):

    def __init__(self):
        super().__init__('temp_humidity_publisher')
          
        self.srv = self.create_service(Trigger, 'get_sensor_data', self.get_sensor_data_callback)

        # self.ip_address = '192.168.3.7'  # 请替换为您的实际IP地址
        # self.base_port = 8001  # COM1 对应的起始端口号
        
        # # 创建16个ModbusTcpClient，每个对应一个传感器
        # self.modbus_clients = [
        #     ModbusTcpClient(self.ip_address, port=self.base_port + i, timeout=0.1)
        #     for i in range(16)
        # ]
        self.sensor_num = 4

        self.get_logger().info('Temperature and Humidity Publisher node has been started')

    def read_temperature_humidity(self, client_index):
        temperature = round(random.uniform(38.0, 40.0), 2)
        humidity = round(random.uniform(58.0, 60.0), 2)
        return temperature, humidity

    def read_all_sensors(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.sensor_num) as executor:
            future_to_index = {executor.submit(self.read_temperature_humidity, i): i for i in range(self.sensor_num)}
            
            temperatures = {}
            humidities = {}
            for future in concurrent.futures.as_completed(future_to_index):
                index = future_to_index[future]
                try:
                    temp, humi = future.result()
                    if temp is not None and humi is not None:
                        temperatures[f'temperature_sensor_{index+1}'] = round(temp, 2)
                        humidities[f'humidity_sensor_{index+1}'] = round(humi, 2)
                    else:
                        temperatures[f'temperature_sensor_{index+1}'] = -1
                        humidities[f'humidity_sensor_{index+1}'] = -1
                except Exception as exc:
                    # self.get_logger().error(f'设备 {index+1} 生成了异常: {exc}')
                    temperatures[f'temperature_sensor_{index+1}'] = -1
                    humidities[f'humidity_sensor_{index+1}'] = -1

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
        logger.info("关闭所有连接")

def main(args=None):
    rclpy.init(args=args)
    temp_humidity_publisher = TempHumidityPublisher()

    try:
        rclpy.spin(temp_humidity_publisher)
    except KeyboardInterrupt:
        logger.info("传感器节点已终止")
    except Exception as e:
        logger.error("传感器节点错误: %s", e)
    finally:
        temp_humidity_publisher.close_all_connections()
        temp_humidity_publisher.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()