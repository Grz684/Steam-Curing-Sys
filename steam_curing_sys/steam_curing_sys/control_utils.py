import threading
import time
from pymodbus.client import ModbusTcpClient
from pymodbus.exceptions import ModbusException, ConnectionException
from pymodbus.pdu import ExceptionResponse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModbusControlException(Exception):
    pass

class ControlUtils():
    def __init__(self):
        self.lock = threading.Lock()
        self.dolly_on = False

        self.zone1_output_addr = 0
        self.zone2_output_addr = 1

        self.dolly_move_addr = 2
        self.dolly_move_addr_back_up = 3
        self.pulse_addr = 4

        self.dio_ip = "192.168.0.7"  # 替换为您设备的实际IP地址
        self.dio_port = 8234  # Modbus TCP默认端口

        self.tank_is_work = False
        self.switch_to_sprinkler = False

        # debug时不连接Modbus服务器
        self.debug = False

        self.output_num = 16 # 输出数量

        # 四设备情况
        self.spray_engine_on = False
        self.left_steam_on = False
        self.right_steam_on = False
        self.sprinkler_on = False
        self.left_steam_output_addr = 0
        self.right_steam_output_addr = 1

        self.sprinkler_base_addr = 2

        self.sprinkler_car_output_addr = 3
        self.sprinkler_tank1_output_addr = 4
        self.sprinkler_tank2_output_addr = 5

        self.tank_output = 14
        self.spray_engine_output_addr = 15
        
        if not self.debug:
            try:
                self.dio_client = ModbusTcpClient(self.dio_ip, port=self.dio_port)
                if not self.dio_client.connect():
                    raise ModbusControlException(f"无法连接到 Modbus 服务器 {self.dio_ip}:{self.dio_port}")
                else:
                    logger.info(f"成功连接到 Modbus 服务器 {self.dio_ip}:{self.dio_port}")
                    # try:
                    #     initial_data = self.dio_client.socket.recv(1024)
                    #     if initial_data:
                    #         logger.info(f"初始响应: {initial_data.hex()}")
                    #         logger.info(f"初始响应 (ASCII): {initial_data.decode('ascii', errors='ignore')}")
                    # except Exception as e:
                    #     logger.error(f"读取初始响应时出错: {e}")
            except ConnectionException as e:
                raise ModbusControlException(f"Modbus 连接错误: {e}")
            
    def turn_spray_engine_on(self):
        if not self.spray_engine_on:
            logger.info('Turning spray engine ON')
            self.spray_engine_on = True
            self.control_output(self.spray_engine_output_addr, True)
            return True
        else:
            return False

    def turn_spray_engine_off(self):
        if self.spray_engine_on:
            logger.info('Turning spray engine OFF')
            self.spray_engine_on = False
            self.control_output(self.spray_engine_output_addr, False)
            return True
        else:
            return False

    def turn_left_steam_on(self):
        if not self.left_steam_on:
            logger.info('Turning left steam ON')
            self.left_steam_on = True
            self.control_output(self.left_steam_output_addr, True)
            return True
        else:
            return False

    def turn_left_steam_off(self):
        if self.left_steam_on:
            logger.info('Turning left steam OFF')
            self.left_steam_on = False
            self.control_output(self.left_steam_output_addr, False)
            return True
        else:
            return False

    def turn_right_steam_on(self):
        if not self.right_steam_on:
            logger.info('Turning right steam ON')
            self.right_steam_on = True
            self.control_output(self.right_steam_output_addr, True)
            return True
        else:
            return False

    def turn_right_steam_off(self):
        if self.right_steam_on:
            logger.info('Turning right steam OFF')
            self.right_steam_on = False
            self.control_output(self.right_steam_output_addr, False)
            return True
        else:
            return False

    def turn_sprinkler_on(self):
        if not self.sprinkler_on:
            logger.info('Turning sprinkler ON')
            self.sprinkler_on = True
            self.control_output(self.sprinkler_car_output_addr, True)
            self.control_output(self.sprinkler_tank1_output_addr, True)
            self.control_output(self.sprinkler_tank2_output_addr, True)
            return True
        else:
            return False

    def turn_sprinkler_off(self):
        if self.sprinkler_on:
            logger.info('Turning sprinkler OFF')
            self.sprinkler_on = False
            self.control_output(self.sprinkler_car_output_addr, False)
            self.control_output(self.sprinkler_tank1_output_addr, False)
            self.control_output(self.sprinkler_tank2_output_addr, False)
            return True
        else:
            return False
            
    def control_switch(self, state):
        if state:
            # if not self.tank_one_on:
            #     self.tank_one_on = True
            #     self.control_output(14, True)
            if not self.switch_to_sprinkler:
                self.switch_to_sprinkler = True
                self.control_output(15, True)
        else:
            # if self.tank_one_on:
            #     self.tank_one_on = False
            #     self.control_output(14, False)
            if self.switch_to_sprinkler:
                self.switch_to_sprinkler = False
                self.control_output(15, False)

    def control_tank(self, state):
        if state:
            if not self.tank_is_work:
                self.tank_is_work = True
                self.control_output(self.tank_output, True)
                return True
            return False
        else:
            if self.tank_is_work:
                self.tank_is_work = False
                self.control_output(self.tank_output, False)
                return True
            return False

    def control_output(self, address, value):
        with self.lock:
            if not self.debug:
                if not self.dio_client.is_socket_open():
                    if not self.dio_client.connect():
                        raise ModbusControlException("无法连接到 Modbus 服务器")
                try:
                    result = self.dio_client.write_coil(address, value, slave=1)
                    # logger.info("写入操作返回值:")
                    # logger.info(f"  类型: {type(result)}")
                    # logger.info(f"  内容: {result}")
                    # if hasattr(result, 'function_code'):
                    #     logger.info(f"  功能码: {result.function_code}")
                    # if hasattr(result, 'address'):
                    #     logger.info(f"  地址: {result.address}")
                    # if hasattr(result, 'value'):
                    #     logger.info(f"  值: {result.value}")
                    if isinstance(result, ExceptionResponse):
                        logger.info(f"Modbus异常: {result}")
                    else:
                        logger.info(f"成功{'打开' if value else '关闭'}输出 {address}")
                except ModbusException as e:
                    raise ModbusControlException(f"Modbus错误: {e}")
            else:
                logger.info(f"模拟{'打开' if value else '关闭'}输出 {address}")

    def read_input(self):
        with self.lock:
            if not self.debug:
                if not self.dio_client.is_socket_open():
                    if not self.dio_client.connect():
                        raise ModbusControlException("无法连接到 Modbus 服务器")
                try:
                    result = self.dio_client.read_discrete_inputs(0, 2, slave=0xFE)

                    if result.isError():
                        logger.error(f"Read failed: {result}")
                    else:
                        current_states = result.bits[:2]
                        return current_states
                
                except ModbusException as e:
                    raise ModbusControlException(f"Modbus错误: {e}")
                
    def turn_dolly_on(self):
        if not self.dolly_on:
            logger.info('Turning dolly ON')
            self.dolly_on = True
            self.control_output(self.dolly_move_addr, True)
            self.control_output(self.dolly_move_addr_back_up, True)
            self.control_output(self.zone2_output_addr, True)
            self.control_output(self.zone1_output_addr, True)
            self.control_output(self.pulse_addr, True)
            # 使用线程来处理延迟关闭pulse
            threading.Thread(target=self._delayed_pulse_off, daemon=True).start()

    def _delayed_pulse_off(self):
        time.sleep(0.5)
        self.control_output(self.pulse_addr, False)

    def turn_dolly_off(self):
        if self.dolly_on:
            logger.info('Turning dolly OFF')
            self.dolly_on = False
            self.control_output(self.dolly_move_addr, False)
            self.control_output(self.dolly_move_addr_back_up, False)
            self.control_output(self.zone2_output_addr, False)
            self.control_output(self.zone1_output_addr, False)

    def turn_all_off(self):
        for i in range(self.output_num):
            self.control_output(i, False)