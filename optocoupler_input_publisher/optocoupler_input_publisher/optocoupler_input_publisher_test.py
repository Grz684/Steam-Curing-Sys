import os
import signal
import time
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import logging

# 设置与系统服务相同的环境变量
os.environ['ROS_LOCALHOST_ONLY'] = '1'


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OptocouplerInputNode(Node):

    def __init__(self):
        super().__init__('optocoupler_input_node')
        
        # Create publisher
        self.publisher_ = self.create_publisher(String, 'water_protection_status', 10)
        
        logger.info('Optocoupler Input Node has been started')
        
        # 立即执行一次发布
        self.publish_once()
        
        # 发布完成后关闭节点
        self.get_logger().info('Publishing completed, shutting down...')
        rclpy.shutdown()

    def publish_once(self):
        side = "Right" # "Right"
        status =  "Water shortage resolved" # "Water shortage resolved" "Water shortage"
        message = f"{side} side: {status}"
        
        # Publish message
        msg = String()
        msg.data = message
        self.publisher_.publish(msg)
        
        # 添加小延迟确保消息被发送
        time.sleep(0.1)
        
        logger.info(message)

def main(args=None):
    rclpy.init(args=args)
    
    optocoupler_input_node = OptocouplerInputNode()
    
    optocoupler_input_node.destroy_node()
    logger.info("输入节点已全部终止")

if __name__ == '__main__':
    main()