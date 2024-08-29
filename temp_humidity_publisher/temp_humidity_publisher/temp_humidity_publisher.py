import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from pymodbus.client import ModbusTcpClient
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TempHumidityPublisher(Node):

    def __init__(self):
        super().__init__('temp_humidity_publisher')
        
        # RS485转网口模块的设置
        self.ip_address = '192.168.166.8'  # 请替换为您的实际IP地址
        self.base_port = 1024  # COM1 对应的起始端口号
        
        # 创建4个ModbusTcpClient，每个对应一个传感器
        self.modbus_clients = []
        for i in range(4):
            client = ModbusTcpClient(self.ip_address, port=self.base_port + i, timeout=1)
            self.modbus_clients.append(client)
            
        # 创建16个发布者,8个温度传感器和8个湿度传感器
        self.temp_publishers = []
        self.humidity_publishers = []
        
        for i in range(1, 5):
            temp_pub = self.create_publisher(Float32, f'temperature_sensor_{i}', 10)
            self.temp_publishers.append(temp_pub)
            
            humidity_pub = self.create_publisher(Float32, f'humidity_sensor_{i}', 10)
            self.humidity_publishers.append(humidity_pub)

        # 创建定时器,每5秒调用一次回调函数
        self.timer = self.create_timer(5.0, self.timer_callback)

        self.get_logger().info('Temperature and Humidity Publisher node has been started')

    def read_temperature_humidity(self, client):
        try:
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

    def timer_callback(self):
        for i, client in enumerate(self.modbus_clients):
            if not client.is_socket_open():
                if not client.connect():
                    self.get_logger().error(f"无法连接到设备 {i+1}")
                    continue

            temp, humi = self.read_temperature_humidity(client)
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

    def __del__(self):
        for client in self.modbus_clients:
            if client.is_socket_open():
                client.close()

def main(args=None):
    rclpy.init(args=args)
    temp_humidity_publisher = TempHumidityPublisher()
    rclpy.spin(temp_humidity_publisher)
    temp_humidity_publisher.destroy_node()
    rclpy.shutdown()

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