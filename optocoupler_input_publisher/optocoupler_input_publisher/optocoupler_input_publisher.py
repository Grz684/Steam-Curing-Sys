import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from pymodbus.client import ModbusTcpClient
from pymodbus.exceptions import ModbusException

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
        
        self.get_logger().info('Optocoupler Input Node has been started')

    def timer_callback(self):
        try:
            if not self.client.is_socket_open():
                self.client.connect()
            
            result = self.client.read_discrete_inputs(0, 2, slave=0xFE)
            
            if result.isError():
                self.get_logger().error(f"Read failed: {result}")
            else:
                current_states = result.bits[:2]
                
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
                        
                        self.get_logger().info(message)
                
                # Update states
                self.previous_states = current_states
        
        except ModbusException as e:
            self.get_logger().error(f"Modbus error: {e}")
        
        except Exception as e:
            self.get_logger().error(f"Unknown error: {e}")

    def __del__(self):
        if self.client.is_socket_open():
            self.client.close()

def main(args=None):
    rclpy.init(args=args)
    
    optocoupler_input_node = OptocouplerInputNode()
    
    try:
        rclpy.spin(optocoupler_input_node)
    except KeyboardInterrupt:
        pass
    finally:
        optocoupler_input_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()