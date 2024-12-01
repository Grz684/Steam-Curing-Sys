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
        self.sensor_num = 9

        self.get_logger().info('Temperature and Humidity Publisher node has been started')

    def read_temperature_humidity(self, client_index):
        # 传感器1-5和11-15的数据范围
        if client_index in [0,3,6,2,5,8]:
            temperature = round(random.uniform(20.0, 21.0), 2)
            humidity = round(random.uniform(88.0, 90.0), 2)
        # 传感器6-10的数据范围
        elif client_index in [1,4,7]:
            temperature = round(random.uniform(26.0, 27.0), 2)
            humidity = round(random.uniform(88.0, 90.0), 2)
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
                    temperatures[f'temperature_sensor_{index+1}'] = -1
                    humidities[f'humidity_sensor_{index+1}'] = -1

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