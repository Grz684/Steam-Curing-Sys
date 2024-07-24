import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import random

class SensorPublisher(Node):

    def __init__(self):
        super().__init__('sensor_publisher')
        
        # 创建8个发布者,4个温度传感器和4个湿度传感器
        self.temp_publishers = []
        self.humidity_publishers = []
        
        for i in range(1, 5):
            temp_pub = self.create_publisher(Float32, f'temperature_sensor_{i}', 10)
            self.temp_publishers.append(temp_pub)
            
            humidity_pub = self.create_publisher(Float32, f'humidity_sensor_{i}', 10)
            self.humidity_publishers.append(humidity_pub)

        # 创建定时器,每秒调用一次回调函数
        self.timer = self.create_timer(1.0, self.timer_callback)

        self.get_logger().info('Sensor Publisher node has been started')

    def timer_callback(self):
        for i, (temp_pub, humidity_pub) in enumerate(zip(self.temp_publishers, self.humidity_publishers)):
            # 生成随机温度和湿度
            # temp = random.uniform(20.0, 30.0)
            # humidity = random.uniform(30.0, 70.0)
            temp = 65.0
            humidity = 75.0
            
            temp_msg = Float32()
            temp_msg.data = temp
            temp_pub.publish(temp_msg)
            
            humidity_msg = Float32()
            humidity_msg.data = humidity
            humidity_pub.publish(humidity_msg)
            
            self.get_logger().info(f'Published: Temp{i+1}={temp:.2f}°C, Humidity{i+1}={humidity:.2f}%')

def main(args=None):
    rclpy.init(args=args)
    sensor_publisher = SensorPublisher()
    rclpy.spin(sensor_publisher)
    sensor_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()