import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from pymodbus.client import ModbusTcpClient
import time
import argparse

class TempHumidityPublisher(Node):

    def __init__(self, sensor_number):
        super().__init__('temp_humidity_publisher')
        
        # RS485转网口模块的设置
        self.ip_address = '192.168.166.8'  # 请替换为您的实际IP地址
        self.base_port = 1024  # COM1 对应的起始端口号
        
        # 创建ModbusTcpClient，对应指定的传感器
        self.sensor_number = sensor_number
        self.modbus_client = ModbusTcpClient(self.ip_address, port=self.base_port + sensor_number - 1, timeout=5, retries=3)
            
        # 创建发布者，一个温度传感器和一个湿度传感器
        self.temp_publisher = self.create_publisher(Float32, f'temperature_sensor_{sensor_number}', 10)
        self.humidity_publisher = self.create_publisher(Float32, f'humidity_sensor_{sensor_number}', 10)

        # 创建定时器,每5秒调用一次回调函数
        self.timer = self.create_timer(5.0, self.timer_callback)

        self.get_logger().info(f'Temperature and Humidity Publisher node for sensor {sensor_number} has been started')

    def read_temperature_humidity(self):
        try:
            # 读取两个寄存器，起始地址为0x0001
            result = self.modbus_client.read_holding_registers(address=0x0001, count=2, slave=1)
            
            if not result.isError():
                temp_raw = result.registers[0]
                humi_raw = result.registers[1]
                
                temperature = temp_raw / 10.0
                humidity = humi_raw / 10.0
                
                return temperature, humidity
            else:
                self.get_logger().error(f"读取错误: {result}")
                return None, None
        except Exception as e:
            self.get_logger().error(f"通信异常: {e}")
            return None, None

    def timer_callback(self):
        if not self.modbus_client.is_socket_open():
            if not self.modbus_client.connect():
                self.get_logger().error(f"无法连接到设备 {self.sensor_number}")
                return

        temp, humi = self.read_temperature_humidity()
        if temp is not None and humi is not None:
            temp_msg = Float32()
            temp_msg.data = temp
            self.temp_publisher.publish(temp_msg)
            
            humidity_msg = Float32()
            humidity_msg.data = humi
            self.humidity_publisher.publish(humidity_msg)
            
            self.get_logger().info(f'Published: Temp{self.sensor_number}={temp:.1f}°C, Humidity{self.sensor_number}={humi:.1f}%')
        else:
            self.get_logger().warn(f'Failed to read sensor {self.sensor_number}')

    def __del__(self):
        if self.modbus_client.is_socket_open():
            self.modbus_client.close()

def main(args=None):
    parser = argparse.ArgumentParser(description='Temperature and Humidity Publisher')
    parser.add_argument('sensor_number', type=int, choices=range(1, 9), help='Sensor number (1-8)')
    
    rclpy.init(args=args)
    
    args = parser.parse_args()
    temp_humidity_publisher = TempHumidityPublisher(args.sensor_number)
    
    rclpy.spin(temp_humidity_publisher)
    temp_humidity_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()