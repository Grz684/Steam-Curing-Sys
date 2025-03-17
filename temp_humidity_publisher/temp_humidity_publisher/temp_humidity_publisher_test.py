import signal
import rclpy
from rclpy.node import Node
from std_srvs.srv import Trigger
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MockTempHumidityPublisher(Node):

    def __init__(self):
        super().__init__('temp_humidity_publisher')
          
        self.srv = self.create_service(Trigger, 'get_sensor_data', self.get_sensor_data_callback)
        
        # 模拟数据，可以手动修改
        self.mock_data = {
            "temperatures": {
                "temperature_sensor_1": 25.5,
                "temperature_sensor_2": 26.3,
                "temperature_sensor_3": 24.8,
                "temperature_sensor_4": 27.2
            },
            "humidities": {
                "humidity_sensor_1": 45.2,
                "humidity_sensor_2": 48.7
                # 后两个传感器没有湿度数据
            }
        }

        self.get_logger().info('Mock Temperature and Humidity Publisher node has been started')

    def read_all_sensors(self):
        # 直接返回模拟数据
        return self.mock_data["temperatures"], self.mock_data["humidities"]

    def get_sensor_data_callback(self, request, response):
        temperatures, humidities = self.read_all_sensors()
        
        data = {
            "temperatures": temperatures,
            "humidities": humidities
        }
        
        response.message = json.dumps(data)
        response.success = True
        return response
    
    def set_mock_data(self, temperatures=None, humidities=None):
        """
        手动设置模拟数据
        
        参数:
        temperatures: 包含温度数据的字典
        humidities: 包含湿度数据的字典
        """
        if temperatures:
            self.mock_data["temperatures"].update(temperatures)
        if humidities:
            self.mock_data["humidities"].update(humidities)
        logger.info(f"已更新模拟数据: {json.dumps(self.mock_data)}")

def main(args=None):
    rclpy.init(args=args)
    mock_publisher = MockTempHumidityPublisher()
    
    # 示例：如何手动修改测试数据
    # mock_publisher.set_mock_data(
    #     {"temperature_sensor_1": 30.0, "temperature_sensor_2": 31.5},
    #     {"humidity_sensor_1": 60.0}
    # )
    
    node_destroyed = False
    rclpy_shutdown = False

    def signal_handler(sig, frame):
        nonlocal node_destroyed, rclpy_shutdown
        if not node_destroyed:
            logger.info("收到节点关闭信号")
            mock_publisher.destroy_node()
            node_destroyed = True
        if not rclpy_shutdown:
            rclpy.shutdown()
            rclpy_shutdown = True

    signal.signal(signal.SIGINT, signal_handler)

    try:
        rclpy.spin(mock_publisher)
    except Exception as e:
        logger.error("节点错误: %s", e)
    finally:
        if not node_destroyed:
            logger.info("节点正在终止...")
            mock_publisher.destroy_node()
            node_destroyed = True
        else:
            logger.info("节点已经被信号处理器终止")
        
        if not rclpy_shutdown:
            rclpy.shutdown()
            rclpy_shutdown = True
        
        logger.info("节点已全部终止")

if __name__ == '__main__':
    main()