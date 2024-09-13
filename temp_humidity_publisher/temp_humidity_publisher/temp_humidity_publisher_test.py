import rclpy
from rclpy.node import Node
from std_srvs.srv import Trigger
import json
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TempHumidityPublisher(Node):

    def __init__(self):
        super().__init__('temp_humidity_publisher')
          
        self.srv = self.create_service(Trigger, 'get_sensor_data', self.get_sensor_data_callback)

        self.get_logger().info('Temperature and Humidity Publisher node has been started')

    def get_sensor_data_callback(self, request, response):
        # 模拟获取16个温度和16个湿度数据
        temperatures = {
            f'temperature_sensor_{i}': round(random.uniform(38.0, 40.0), 2)
            for i in range(1, 17)
        }
        
        humidities = {
            f'humidity_sensor_{i}': round(random.uniform(90.0, 92.0), 2)
            for i in range(1, 17)
        }
        
        data = {
            "temperatures": temperatures,
            "humidities": humidities
        }
        
        response.message = json.dumps(data)
        response.success = True
        return response

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
        temp_humidity_publisher.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()