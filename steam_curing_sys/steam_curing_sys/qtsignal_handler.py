from datetime import datetime
import hashlib
import hmac
import json
from queue import Queue
import random
import string
import subprocess
import threading
from PyQt5.QtCore import pyqtSignal, QTimer
from PyQt5.QtCore import QObject
import pyudev
import logging
from .config_manager import ConfigManager
from .export_file import ExportThread
from .ros2_thread import ROS2Thread
from .sensor_adjustments_db import SensorAdjustmentDB

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QtSignalHandler(QObject):
    # pyqtSignal必须是类属性
    update_dolly_state = pyqtSignal(bool)
    limit_settings = pyqtSignal(float, float, float, float)
    load_limit_settings = pyqtSignal(float, float, float, float)
    load_sprinkler_settings = pyqtSignal(dict)
    load_dolly_settings = pyqtSignal(dict)
    update_water_tank_status = pyqtSignal(dict)
    
    left_steam_status_updated = pyqtSignal(bool)
    right_steam_status_updated = pyqtSignal(bool)
    mode_chosen = pyqtSignal(int)
    data_updated = pyqtSignal(list)
    export_completed = pyqtSignal(int)
    export_started = pyqtSignal()

    confirm_lock_password = pyqtSignal(dict)
    device_activated = pyqtSignal(dict)
    update_device_info = pyqtSignal(dict)
    update_adjust_settings = pyqtSignal(dict)
    
    # error_occurred = pyqtSignal(str)  # 添加错误信号

    def __init__(self):
        super().__init__() 
        self.temp_lower_limit = 25.0
        self.temp_upper_limit = 35.0
        self.humidity_lower_limit = 90.0
        self.humidity_upper_limit = 95.0
        self.sprinkler_single_run_time = 10
        self.sprinkler_run_interval_time = 0
        self.sprinkler_loop_interval = 10

        self.dolly_single_run_time = 30
        self.dolly_run_interval_time = 30

        self.dolly_auto_mode = False
        self.dolly_mode_lock = threading.Lock()

        self.sprinkler_system_on = False
        self.sprinkler_system_lock = threading.Lock()
        
        self.config_manager = ConfigManager()  # 这将默认使用 'sensor_data.db'

        # 加载控制工具

        self.control_utils = None
        
        self.ros2_thread = ROS2Thread(self)

        self.sensor_num = 15

        # 为数据作弊提供的
        self.sensor_adjust_db = SensorAdjustmentDB()
        self.temp_adjust = {}  # 温度调整值字典
        self.humidity_adjust = {}  # 湿度调整值字典
        self.adjust_sensor_data_lock = threading.Lock()

        # 水箱工作模式
        self.one_side_flag = False
        self.dolly_state = False

    def activate_device(self):
        # 将当前时间保存进数据库
        current_time = int(datetime.now().timestamp() * 1000)
        self.config_manager.update_config(device_base_time=current_time)
        device_status = "已激活"
        self.config_manager.update_config(device_status=device_status)

        dolly_configs = self.config_manager.get_multiple_config([
            'device_random_code',
            'device_base_time'
        ])
        if dolly_configs:
            self.device_activated.emit(dolly_configs)
        else:
            logger.error("激活消息返回失败")

    def load_device_info(self):
        dolly_configs = self.config_manager.get_multiple_config([
            'device_status',
            'device_random_code',
            'device_lock_count',
            'device_base_time'
        ])
        if dolly_configs:
            self.update_device_info.emit(dolly_configs)
        else:
            logger.error("未找到设备信息")

    def load_adjust_settings(self):
        all_adjustments = self.sensor_adjust_db.get_all_adjustments()
        # adjust_configs = self.config_manager.get_multiple_config([
        #     'temp_adjust',
        #     'humidity_adjust'
        # ])
        if all_adjustments:
            # self.update_adjust_settings.emit(all_adjustments)
            self.set_adjust_settings(all_adjustments)
        else:
            logger.info("尚未设置数据调整信息")
    
    def check_password(self, pak):
        if pak["password"] == self.generate_unlock_password(pak["deviceRandomCode"], "forever"):
            logger.info("永久密码验证成功")
            # 更新设备信息
            self.config_manager.update_config(device_status="永久激活")

            self.confirm_lock_password.emit({"target":pak["target"] ,"result": "forever_success"})
        elif pak["password"] == self.generate_unlock_password(pak["deviceRandomCode"], pak["lockCount"]):
            # 更新设备信息
            self.config_manager.update_config(device_lock_count=pak["lockCount"]+1)

            logger.info("临时密码验证成功")
            self.confirm_lock_password.emit({"target":pak["target"] ,"result": "success"})
        else:
            logger.info("密码验证失败")
            self.confirm_lock_password.emit({"target":pak["target"] ,"result": "fail"})

    def generate_unlock_password(self, device_random_code, lock_count):
        """
        生成解锁密码。

        Args:
            device_random_code (str): 设备随机码。
            lock_count (int): 锁定次数。

        Returns:
            str: 6位数字密码。
        """
        # 秘密密钥，请确保在实际应用中保护好这个密钥
        secret_key = 'the_secret_key_of_fute_company'

        # 组合输入
        message = f"{device_random_code}:{lock_count}"

        # 生成 HMAC-SHA256 哈希
        hash_bytes = hmac.new(
            key=secret_key.encode('utf-8'),
            msg=message.encode('utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()

        # 将哈希的前16个字符转换为整数
        hash_int = int(hash_bytes[:16], 16)

        # 映射到6位数字
        password = str(hash_int % 1000000).zfill(6)

        # print('Expected password:', password)

        return password

    def process_limit_settings(self, temp_upper, temp_lower, humidity_upper, humidity_lower):
        # 在工作线程中处理接收到的限制设置
        logger.info(f"Worker received: Temp {temp_lower}-{temp_upper}°C, Humidity {humidity_lower}-{humidity_upper}%")
        self.temp_lower_limit = temp_lower
        self.temp_upper_limit = temp_upper
        self.humidity_lower_limit = humidity_lower
        self.humidity_upper_limit = humidity_upper
        self.save_limits()  # 保存新的限制值

    def sprayer_control(self, index, state):
        # { sprinkler: n, state: 1 }
        if state == 0:
            # 使用 QTimer 来延迟执行
            QTimer.singleShot(1000, lambda: self._delayed_control(index, state))
        else:
            self.control_utils.control_output(self.control_utils.sprinkler_base_addr + index -1, state)

    def _delayed_control(self, index, state):
        self.control_utils.control_output(self.control_utils.sprinkler_base_addr + index -1, state)

    def manual_steam_engine_state(self, state):
        logger.info(f"Steam engine state: {state}")
        if state["engine"] == "left":
            self.control_utils.turn_zone1_humidifier_on() if state["state"] else self.control_utils.turn_zone1_humidifier_off()
        elif state["engine"] == "right":
            self.control_utils.turn_zone2_humidifier_on() if state["state"] else self.control_utils.turn_zone2_humidifier_off()

    def dolly_control(self, control):
        if control["target"] == "setState":
            # 半自动模式下控制dolly
            dolly_state = control["dolly_state"]
            if dolly_state:
                self.dolly_state = True
                self.control_utils.turn_dolly_on(self.one_side_flag)
            else:
                self.dolly_state = False
                self.control_utils.turn_dolly_off()

        elif control["target"] == "dolly_settings":
            self.save_dolly_settings(control["dolly_single_run_time"], control["dolly_run_interval_time"])
        elif control["target"] == "setMode":
            if control["mode"] == "auto":
                with self.dolly_mode_lock:
                    self.dolly_auto_mode = True
            else:
                with self.dolly_mode_lock:
                    self.dolly_auto_mode = False
        elif control["target"] == "setTankMode":
            if control['mode'] == "one-side":
                if not self.one_side_flag:
                    self.one_side_flag = True
                    self.control_utils.adjust_dolly_to_one_side()
            else:
                if self.one_side_flag:
                    self.one_side_flag = False
                    self.control_utils.adjust_dolly_to_both_side()
            
        logger.info(f"Control dolly: {control}")

    def sprinkler_control(self, control):
        if control["target"] == "setMode":
            mode = control["mode"]
            if mode == "auto":
                logger.info('Sprinkler Auto Mode chosen')
                
            else:
                # 自动-->手动
                logger.info('Sprinkler Manual Mode chosen')

        elif control["target"] == "setState":
            if control["state"]:
                logger.info('Sprinkler System turned ON')
                with self.sprinkler_system_lock:
                    self.sprinkler_system_on = True
            else:
                logger.info('Sprinkler System turned OFF')
                with self.sprinkler_system_lock:
                    self.sprinkler_system_on = False

        elif control["target"] == "settings":
            settings = json.loads(control["settings"])
            logger.info(f"Receive Sprinkler settings: {settings}")
            run_time = settings["sprinkler_single_run_time"]
            run_interval_time = settings["sprinkler_run_interval_time"]
            loop_time = settings["sprinkler_loop_interval"]
            self.save_sprinkler_settings(run_time, run_interval_time, loop_time)

        elif control["target"] in ["manual_control_sprayer", "auto_control_sprayer"]:
            self.sprayer_control(control["index"], control["state"])

        elif control["target"] == "tankWork":
            logger.info(f"tankWork: {control['state']}")
            self.control_utils.control_tank(control["state"])

        elif control["target"] == "switchToSprinkler":
            logger.info(f"switchToSprinkler: {control['state']}")
            self.control_utils.control_switch(control["state"])

    def get_sprinkler_system_state(self):
        with self.sprinkler_system_lock:
            return self.sprinkler_system_on

    def get_dolly_auto_mode(self):
        with self.dolly_mode_lock:
            return self.dolly_auto_mode

    def load_limits(self):
        temp_humidity_configs = self.config_manager.get_multiple_config([
            'temp_lower_limit', 
            'temp_upper_limit', 
            'humidity_lower_limit', 
            'humidity_upper_limit'
        ])
        
        if temp_humidity_configs:
            self.temp_lower_limit = temp_humidity_configs['temp_lower_limit']
            self.temp_upper_limit = temp_humidity_configs['temp_upper_limit']
            self.humidity_lower_limit = temp_humidity_configs['humidity_lower_limit']
            self.humidity_upper_limit = temp_humidity_configs['humidity_upper_limit']
            # logger.info(f"Loaded limits: Temp {self.temp_lower_limit}-{self.temp_upper_limit}°C, Humidity {self.humidity_lower_limit}-{self.humidity_upper_limit}%")
            self.load_limit_settings.emit(float(self.temp_upper_limit), float(self.temp_lower_limit), float(self.humidity_upper_limit), float(self.humidity_lower_limit))
        else:
            self.load_limit_settings.emit(float(self.temp_upper_limit), float(self.temp_lower_limit), float(self.humidity_upper_limit), float(self.humidity_lower_limit))

    def load_sprinkler(self):
        sprinkler_configs = self.config_manager.get_multiple_config([
            'sprinkler_single_run_time',
            'sprinkler_run_interval_time',
            'sprinkler_loop_interval',
        ])
        
        if sprinkler_configs:
            self.sprinkler_single_run_time = sprinkler_configs['sprinkler_single_run_time']
            self.sprinkler_run_interval_time = sprinkler_configs['sprinkler_run_interval_time']
            self.sprinkler_loop_interval = sprinkler_configs['sprinkler_loop_interval']
            logger.info(f"Loaded sprinkler settings: {sprinkler_configs}")
            self.load_sprinkler_settings.emit(sprinkler_configs)
        else:
            sprinkler_configs = {
                'sprinkler_single_run_time': self.sprinkler_single_run_time,
                'sprinkler_run_interval_time': self.sprinkler_run_interval_time,
                'sprinkler_loop_interval': self.sprinkler_loop_interval,
            }
            self.load_sprinkler_settings.emit(sprinkler_configs)

    def save_sprinkler_settings(self, sprinkler_single_run_time, sprinkler_run_interval_time, sprinkler_loop_interval):
        new_configs = {
            'sprinkler_single_run_time': sprinkler_single_run_time,
            'sprinkler_run_interval_time': sprinkler_run_interval_time,
            'sprinkler_loop_interval': sprinkler_loop_interval,
        }
        self.config_manager.update_multiple_config(new_configs)

    def save_dolly_settings(self, dolly_single_run_time, dolly_run_interval_time):
        new_configs = {
            'dolly_single_run_time': dolly_single_run_time,
            'dolly_run_interval_time': dolly_run_interval_time,
        }
        self.config_manager.update_multiple_config(new_configs)

    def load_dolly(self):
        dolly_configs = self.config_manager.get_multiple_config([
            'dolly_single_run_time',
            'dolly_run_interval_time',
        ])
        
        if dolly_configs:
            self.dolly_single_run_time = dolly_configs['dolly_single_run_time']
            self.dolly_run_interval_time = dolly_configs['dolly_run_interval_time']
            logger.info(f"Loaded dolly settings: {dolly_configs}")
            self.load_dolly_settings.emit(dolly_configs)
        else:
            dolly_configs = {
                'dolly_single_run_time': self.dolly_single_run_time,
                'dolly_run_interval_time': self.dolly_run_interval_time,
            }
            self.load_dolly_settings.emit(dolly_configs)

    def save_limits(self):
        # 更新多个配置项
        new_configs = {
            'temp_lower_limit': self.temp_lower_limit,
            'temp_upper_limit': self.temp_upper_limit,
            'humidity_lower_limit': self.humidity_lower_limit,
            'humidity_upper_limit': self.humidity_upper_limit,
        }
        self.config_manager.update_multiple_config(new_configs)

    def export_data(self, choice):
        if choice:
            self.export_tables_to_excel()
        else:
            self.config_manager.clear_sensor_data()

    def export_tables_to_excel(self, db_name="sensor_data.db"):
        # 检查并获取U盘挂载点
        usb_mount = QtSignalHandler.check_and_find_usb_drive()
        if not usb_mount:
            self.export_completed.emit(0)  # 发射信号
            return

        # 发射导出开始信号
        self.export_started.emit()

        result_queue = Queue()
        export_thread = ExportThread(db_name=db_name, result_queue=result_queue, sensor_num=self.sensor_num, usb_mount=usb_mount)
        export_thread.start()

        def check_export_finished():
            if not export_thread.is_alive():
                success, message = result_queue.get()
                logger.info(message)
                if success:
                    self.export_completed.emit(1)
                else:
                    self.export_completed.emit(-2)
            else:
                QTimer.singleShot(100, check_export_finished)

        QTimer.singleShot(100, check_export_finished)

    @staticmethod
    def check_and_find_usb_drive():
        context = pyudev.Context()
        removable = [device for device in context.list_devices(subsystem='block', DEVTYPE='disk')
                    if device.attributes.asstring('removable') == "1"]
        
        if not removable:
            logger.info("没有检测到可移动设备")
            return None

        logger.info(f"检测到 {len(removable)} 个可移动设备")

        for device in removable:
            logger.info(f"检查设备: {device.device_node}")
            
            # 检查设备本身是否已挂载
            mountpoint = QtSignalHandler.get_mountpoint(device.device_node)
            if mountpoint:
                logger.info(f"设备 {device.device_node} 已挂载于 {mountpoint}")
                return mountpoint

            # 检查设备的分区
            partitions = [part for part in device.children if part.get('DEVTYPE') == 'partition']
            logger.info(f"设备 {device.device_node} 有 {len(partitions)} 个分区")
            
            for partition in partitions:
                logger.info(f"检查分区: {partition.device_node}")
                mountpoint = partition.get('MOUNTPOINT')
                if not mountpoint:
                    mountpoint = QtSignalHandler.get_mountpoint(partition.device_node)
                
                if mountpoint:
                    logger.info(f"分区 {partition.device_node} 已挂载于 {mountpoint}")
                    return mountpoint
                else:
                    logger.info(f"分区 {partition.device_node} 未挂载")

        logger.info("没有找到已挂载的 U 盘分区")
        return None

    @staticmethod
    def get_mountpoint(device):
        try:
            result = subprocess.run(['findmnt', '-no', 'TARGET', device], capture_output=True, text=True)
            mountpoint = result.stdout.strip()
            return mountpoint if mountpoint else None
        except subprocess.CalledProcessError:
            return None
        
    def update_baseTime(self, base_time):
        # base_time为int类型
        base_time = int(base_time)
        self.config_manager.update_config(device_base_time=base_time)

    # def save_adjust_settings(self, settings):
    #     # settings为字典
    #     self.config_manager.update_multiple_config(settings)
    #     self.set_adjust_settings(settings)

    def set_adjust_settings(self, all_adjustments):
        temp_payload = {}
        humidity_payload = {}
        # settings为字典
        with self.adjust_sensor_data_lock:
            for adjustment in all_adjustments:
                sensor_id = adjustment['sensor_id']
                convert_sensor_id = self.convert_sensor_id(sensor_id)
                adjustment_type  = adjustment['adjustment_type']
                adjustment_value = adjustment['value']
                if adjustment["sensor_type"] == "temperature":
                    self.temp_adjust[convert_sensor_id] = {"type":adjustment_type, "value":adjustment_value}
                    temp_payload[sensor_id] = {"type":adjustment_type, "value":adjustment_value}
                elif adjustment["sensor_type"] == "humidity":
                    self.humidity_adjust[convert_sensor_id] = {"type":adjustment_type, "value":adjustment_value}
                    humidity_payload[sensor_id] = {"type":adjustment_type, "value":adjustment_value}
            sensor_adjustments = {"temperature":temp_payload, "humidity":humidity_payload}
            
            self.update_adjust_settings.emit(sensor_adjustments)

            # logger.info(f"设置数据调整信息: {sensor_adjustments}")
            
    # def read_adjust_settings(self):
    #     with self.adjust_sensor_data_lock:
    #         return self.temp_adjust, self.humidity_adjust
    def read_sensor_data_adjustments(self):
        with self.adjust_sensor_data_lock:
            return self.temp_adjust, self.humidity_adjust
    # 转换函数
    @staticmethod
    def convert_sensor_id(sensor_id):
        sensor_type_map = {
            '温感': 'temperature_sensor',
            '湿感': 'humidity_sensor'
        }
        
        sensor_type = sensor_id[:2]  # 取前两个字符
        number = sensor_id[2:]       # 取剩余的数字部分
        
        eng_type = sensor_type_map.get(sensor_type)
        if not eng_type:
            raise ValueError(f'未知的传感器类型: {sensor_type}')
            
        return f'{eng_type}_{number}'
        
    def sensor_data_adjustments(self, payload):
        # data为字典
        # const payload = {
        #     sensorType: sensorType.value,
        #     sensorId: selectedSensor.value,
        #     adjustmentType: adjustmentType.value,
        #     value: parseFloat(adjustmentValue.value) || 0
        # }
        # 初始化字典(如果还没初始化)
        
        sensor_id = payload['sensorId']
        sensor_id = self.convert_sensor_id(sensor_id)
        sensor_type = payload['sensorType']
        adjustment_type = payload['adjustmentType']
        adjustment_value = payload['value']
        #要把“温感1”变成“temperature_sensor_1”
        
        # 根据传感器类型存储到对应的字典中
        if sensor_type == 'temperature':
            self.temp_adjust[sensor_id] = {"type":adjustment_type, "value":adjustment_value}
        elif sensor_type == 'humidity':
            self.humidity_adjust[sensor_id] = {"type":adjustment_type, "value":adjustment_value}
        self.sensor_adjust_db.save_adjustment(payload)