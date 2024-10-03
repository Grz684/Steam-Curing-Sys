import rclpy
from PyQt5.QtCore import QThread
from .ros2_handler_node import SensorSubscriberNode
from .control_utils import ModbusControlException
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ROS2Thread(QThread):
    def __init__(self, qtSignalHandler):
        super().__init__()
        self.running = True
        # self.node = None
        self.qtSignalHandler = qtSignalHandler
        self.node = None
        
    def run(self):
        try:
            rclpy.init()
            self.node = SensorSubscriberNode(self.qtSignalHandler)
            
            while self.running and rclpy.ok():
                rclpy.spin_once(self.node, timeout_sec=0.1)
            
        except ModbusControlException as e:
            self.qtSignalHandler.export_completed.emit(-1)  # 发送错误信号
        except Exception as e:
            logger.error(f"ros2节点运行故障: {e}")
            
        finally:
            # 关闭所有输出
            self.node.control_utils.turn_all_off()
            
            # 在子线程中关闭数据库连接
            self.node.conn.close()
            self.node.destroy_node()
            rclpy.shutdown()

            self.running = False
        
    def stop(self):
        self.running = False