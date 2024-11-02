import signal
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from pymodbus.client import ModbusTcpClient
from pymodbus.exceptions import ModbusException
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 废案
class OptocouplerInputNode(Node):

    def __init__(self):
        super().__init__('optocoupler_input_node')
        
        # Create publisher
        self.publisher_ = self.create_publisher(String, 'water_protection_status', 10)
        
        # Create timer, calling every 0.5 seconds
        self.timer = self.create_timer(0.5, self.timer_callback)
        
        # Modbus client
        self.ip = "192.168.0.7"
        self.port = 8234
        self.client = ModbusTcpClient(self.ip, self.port)
        
        # Store previous states
        self.previous_states = [False, False]
        
        logger.info('Optocoupler Input Node has been started')

    def timer_callback(self):
        try:
            if not self.client.is_socket_open():
                self.client.connect()
            
            result = self.client.read_discrete_inputs(0, 2, slave=0xFE)

            if result.isError():
                logger.error(f"Read failed: {result}")
            else:
                current_states = result.bits[:2]
                # logger.info(f"Read result: {current_states}")
                
                # Check if states have changed
                for i, (prev, curr) in enumerate(zip(self.previous_states, current_states)):
                    if prev != curr:
                        side = "Left" if i == 0 else "Right"
                        status = "Water shortage" if curr else "Water shortage resolved"
                        message = f"{side} side: {status}"
                        
                        # Publish message
                        msg = String()
                        msg.data = message
                        self.publisher_.publish(msg)
                        
                        logger.info(message)
                
                # Update states
                self.previous_states = current_states
        
        except ModbusException as e:
            logger.error(f"Modbus error: {e}")
        
        except Exception as e:
            logger.error(f"Unknown error: {e}")

    def __del__(self):
        if self.client.is_socket_open():
            self.client.close()

def main(args=None):
    rclpy.init(args=args)
    
    optocoupler_input_node = OptocouplerInputNode()

    # 添加标志来跟踪节点和 rclpy 是否已被关闭
    node_destroyed = False
    rclpy_shutdown = False

    def signal_handler(sig, frame):
        nonlocal node_destroyed, rclpy_shutdown
        if not node_destroyed:
            logger.info("收到输入关闭信号")
            optocoupler_input_node.destroy_node()
            node_destroyed = True
        if not rclpy_shutdown:
            rclpy.shutdown()
            rclpy_shutdown = True

    # 设置信号处理器
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        rclpy.spin(optocoupler_input_node)
    except Exception as e:
        logger.error("输入节点错误: %s", e)
    finally:
        if not node_destroyed:
            logger.info("输入节点正在终止...")
            optocoupler_input_node.destroy_node()
            node_destroyed = True
        else:
            logger.info("输入节点已经被信号处理器终止")
        
        if not rclpy_shutdown:
            rclpy.shutdown()
            rclpy_shutdown = True
        
        logger.info("输入节点已全部终止")

if __name__ == '__main__':
    main()