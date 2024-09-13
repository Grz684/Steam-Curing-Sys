import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from pymodbus.client import ModbusTcpClient
import time
import logging
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TempHumidityPublisher(Node):

    def __init__(self):
        super().__init__('temp_humidity_publisher')
          
        # 创建32个发布者,16个温度传感器和16个湿度传感器
        self.temp_publishers = []
        self.humidity_publishers = []
        
        for i in range(1, 17):
            temp_pub = self.create_publisher(Float32, f'temperature_sensor_{i}', 10)
            self.temp_publishers.append(temp_pub)
            
            humidity_pub = self.create_publisher(Float32, f'humidity_sensor_{i}', 10)
            self.humidity_publishers.append(humidity_pub)

        # 创建定时器,每5秒调用一次回调函数
        self.timer = self.create_timer(5.0, self.timer_callback)

        self.get_logger().info('Temperature and Humidity Publisher node has been started')

    def read_temperature_humidity_test(self):
        try:
            # 生成随机温度，范围在 -10 到 40 度之间
            temperature = round(random.uniform(38, 40), 1)
            
            # 生成随机湿度，范围在 0 到 100% 之间
            humidity = round(random.uniform(90, 92), 1)
            
            return temperature, humidity
        except Exception as e:
            print(f"生成随机数据时发生错误: {e}")
            return None, None

    def timer_callback(self):
        for i in range(16):
            temp, humi = self.read_temperature_humidity_test()
            if temp is not None and humi is not None:
                temp_msg = Float32()
                temp_msg.data = temp
                self.temp_publishers[i].publish(temp_msg)
                
                humidity_msg = Float32()
                humidity_msg.data = humi
                self.humidity_publishers[i].publish(humidity_msg)
                
                # self.get_logger().info(f'Published: Temp{i+1}={temp:.1f}°C, Humidity{i+1}={humi:.1f}%')
            else:
                # self.get_logger().warn(f'Failed to read sensor {i+1}')
                pass

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