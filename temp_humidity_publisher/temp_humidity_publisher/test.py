import rclpy
from rclpy.node import Node
from std_srvs.srv import Trigger
import json

class LogicNode(Node):
    def __init__(self):
        super().__init__('logic_node')
        self.cli = self.create_client(Trigger, 'get_sensor_data')
        
        # 等待服务可用
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('服务不可用，等待中...')
        self.get_logger().info('服务现在可用')

        # 每 5 秒调用一次服务
        self.timer = self.create_timer(5.0, self.call_service)  # 5 秒定时器

    def call_service(self):
        self.get_logger().info('开始请求数据...')
        request = Trigger.Request()

        # 异步调用服务
        future = self.cli.call_async(request)
        future.add_done_callback(self.service_response_callback)

    def service_response_callback(self, future):
        try:
            response = future.result()  # 获取服务的响应
            if response.success:
                data = json.loads(response.message)
                self.get_logger().info('接收到传感器数据:')
                self.get_logger().info(f'温度: {data["temperatures"]}, 湿度: {data["humidities"]}')
            else:
                self.get_logger().warn(f'获取传感器数据失败: {response.message}')
        except Exception as e:
            self.get_logger().error(f'获取传感器数据时出错: {str(e)}')

def main(args=None):
    rclpy.init(args=args)
    node = LogicNode()
    try:
        rclpy.spin(node)  # 保持节点运行
    except KeyboardInterrupt:
        pass
    except Exception as e:
        node.get_logger().error(f'未预期的错误: {str(e)}')
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()