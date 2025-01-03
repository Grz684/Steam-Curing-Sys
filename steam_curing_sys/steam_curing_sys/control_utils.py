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
        # self.zone1_heater_on = False
        # self.zone2_heater_on = False
        # 配置加热和喷淋端口
        self.spray_addr = 0
        self.heater_addr = 1

        self.heater_on = False

        self.zone1_humidifier_on = False
        self.zone2_humidifier_on = False

        self.dolly_on = False

        self.zone1_output_addr = 0
        self.zone2_output_addr = 1

        self.sprinkler_base_addr = 2

        self.dolly_move_addr = 2
        self.dolly_move_addr_back_up = 3
        self.pulse_addr = 4

        self.dio_ip = "192.168.0.7"  # 替换为您设备的实际IP地址
        self.dio_port = 8234  # Modbus TCP默认端口

        self.tank_is_work = False
        self.switch_to_sprinkler = False

        # debug时不连接Modbus服务器
        self.debug = False

        self.output_num = 6 # 输出数量

        self.one_side_flag = False
        self.single_zone2_open = True

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
                self.control_output(14, True)
                return True
            return False
        else:
            if self.tank_is_work:
                self.tank_is_work = False
                self.control_output(14, False)
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
                    # 读取4个寄存器 (0-3)
                    result = self.dio_client.read_discrete_inputs(0, 4, slave=0xFE)

                    if result.isError():
                        logger.error(f"Read failed: {result}")
                    else:
                        # 获取4个bit的状态
                        all_bits = result.bits[:4]
                        # 将4个bit分成两组,每组2bit
                        value1 = [all_bits[0], all_bits[1]]  # 第1组的2bit
                        value2 = [all_bits[2], all_bits[3]]  # 第2组的2bit

                        # logger.info(f"成功读取输入: {value1}, {value2}")
                        return value1, value2
                
                except ModbusException as e:
                    raise ModbusControlException(f"Modbus错误: {e}")
        
    # def turn_zone1_heater_on(self):
    #     if not self.zone1_heater_on:
    #         self.zone1_heater_on = True
    #         logger.info('Turning zone1 heater ON')

    # def turn_zone1_heater_off(self):
    #     if self.zone1_heater_on:
    #         self.zone1_heater_on = False
    #         logger.info('Turning zone1 heater OFF')

    # def turn_zone2_heater_on(self):
    #     if not self.zone2_heater_on:
    #         self.zone2_heater_on = True
    #         logger.info('Turning zone2 heater ON')

    # def turn_zone2_heater_off(self):
    #     if self.zone2_heater_on:
    #         self.zone2_heater_on = False
    #         logger.info('Turning zone2 heater OFF')

    def turn_heat_engine_on(self):
        if not self.heater_on:
            self.heater_on = True
            logger.info('Turning heat engine ON')
            self.control_output(self.heater_addr, True)

    def turn_heat_engine_off(self):
        if self.heater_on:
            self.heater_on = False
            logger.info('Turning heat engine OFF')
            self.control_output(self.heater_addr, False)

    def turn_zone1_humidifier_on(self):
        if not self.zone1_humidifier_on:
            self.zone1_humidifier_on = True
            logger.info('Turning zone1 humidifier ON')
            self.control_output(self.zone1_output_addr, True)

    def turn_zone1_humidifier_off(self):
        if self.zone1_humidifier_on:
            self.zone1_humidifier_on = False
            logger.info('Turning zone1 humidifier OFF')
            self.control_output(self.zone1_output_addr, False)

    def turn_zone2_humidifier_on(self):
        if not self.zone2_humidifier_on:
            self.zone2_humidifier_on = True
            logger.info('Turning zone2 humidifier ON')
            self.control_output(self.zone2_output_addr, True)

    def turn_zone2_humidifier_off(self):
        if self.zone2_humidifier_on:
            self.zone2_humidifier_on = False
            logger.info('Turning zone2 humidifier OFF')
            self.control_output(self.zone2_output_addr, False)
                
    def turn_dolly_on(self, one_side_flag):
        if not self.dolly_on:
            logger.info('Turning 喷雾 ON')
            self.dolly_on = True
            self.control_output(self.spray_addr, True)

        # if not self.dolly_on:
        #     logger.info('Turning dolly ON')
        #     self.dolly_on = True
        #     if one_side_flag:
        #         self.one_side_flag = True
        #         self.control_output(self.dolly_move_addr, True)
        #         self.control_output(self.dolly_move_addr_back_up, True)
        #         # if self.single_zone2_open:
        #         #     self.control_output(self.zone2_output_addr, True)
        #         #     self.control_output(self.zone1_output_addr, False)
        #         # else:
        #         #     self.control_output(self.zone2_output_addr, False)
        #         #     self.control_output(self.zone1_output_addr, True)
        #     else:
        #         self.one_side_flag = False
        #         self.control_output(self.dolly_move_addr, True)
        #         self.control_output(self.dolly_move_addr_back_up, True)
        #         self.control_output(self.zone2_output_addr, True)
        #         self.control_output(self.zone1_output_addr, True)
            # self.control_output(self.pulse_addr, True)
            # # 使用线程来处理延迟关闭pulse
            # threading.Thread(target=self._delayed_pulse_off, daemon=True).start()
    
    def adjust_dolly_to_one_side(self):
        if not self.one_side_flag and self.dolly_on:
            self.one_side_flag = True
            if self.single_zone2_open:
                self.control_output(self.zone2_output_addr, True)
                self.control_output(self.zone1_output_addr, False)
            else:
                self.control_output(self.zone2_output_addr, False)
                self.control_output(self.zone1_output_addr, True)

    def adjust_dolly_to_both_side(self):
        if self.one_side_flag and self.dolly_on:
            self.one_side_flag = False
            self.control_output(self.zone1_output_addr, True)
            self.control_output(self.zone2_output_addr, True)

    # def exchange_dolly_side(self):
    #     if self.one_side_flag and self.dolly_on:
    #         if self.single_zone2_open:
    #             self.single_zone2_open = False
    #             self.control_output(self.zone2_output_addr, False)
    #             self.control_output(self.zone1_output_addr, True)
    #         else:
    #             self.single_zone2_open = True
    #             self.control_output(self.zone1_output_addr, False)
    #             self.control_output(self.zone2_output_addr, True)

    # def control_dolly_side(self, side):
    #     if side == "left":
    #         self.single_zone2_open = True
    #         if self.one_side_flag and self.dolly_on:
    #             self.control_output(self.zone2_output_addr, True)
    #             self.control_output(self.zone1_output_addr, False)
    #     else:
    #         self.single_zone2_open = False
    #         if self.one_side_flag and self.dolly_on:
    #             self.control_output(self.zone1_output_addr, True)
    #             self.control_output(self.zone2_output_addr, False)
        

    def _delayed_pulse_off(self):
        time.sleep(0.5)
        self.control_output(self.pulse_addr, False)

    def turn_dolly_off(self):
        if self.dolly_on:
            logger.info('Turning 喷雾 OFF')
            self.dolly_on = False
            self.control_output(self.spray_addr, False)
            # self.control_output(self.dolly_move_addr, False)
            # self.control_output(self.dolly_move_addr_back_up, False)
            # self.control_output(self.zone2_output_addr, False)
            # self.control_output(self.zone1_output_addr, False)

    def turn_all_off(self):
        for i in range(self.output_num):
            self.control_output(i, False)