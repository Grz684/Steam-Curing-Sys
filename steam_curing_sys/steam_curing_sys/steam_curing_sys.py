import random
import sys
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from PyQt5.QtCore import QThread, pyqtSignal, QTimer
from PyQt5.QtWidgets import QApplication
from .steam_curing_sys_UI_test import MainWindow
from pymodbus.client import ModbusTcpClient
from pymodbus.exceptions import ModbusException, ConnectionException
from pymodbus.pdu import ExceptionResponse
from PyQt5.QtCore import QEventLoop, QObject
import sqlite3
from datetime import datetime
from datetime import timedelta
import pandas as pd
import os
import json
import pyudev
import shutil
import subprocess
import signal
import re
from queue import Queue
import time
from threading import Thread
import threading
import logging
from std_srvs.srv import Trigger
from std_msgs.msg import String
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import sqlite3
from datetime import datetime

class ConfigManager:
    # config_manager = ConfigManager()  # 这将默认使用 'sensor_data.db'

    # # 加载配置
    # config_manager.load_config()

    # # 更新单个配置项
    # config_manager.update_config(temp_lower_limit=18.5)

    # # 更新多个配置项
    # new_configs = {
    #     'sprinkler_single_run_time': 180,
    #     'sprinkler_run_interval_time': 3600,
    # }
    # config_manager.update_multiple_config(new_configs)

    # # 获取所有配置，包括时间戳
    # all_configs = config_manager.get_all_config()
    # print("All configs:", all_configs)

    # # 获取最后更新时间
    # last_update = config_manager.get_last_update_time()
    # print("Last update time:", last_update)

    def __init__(self, db_file='sensor_data.db'):
        self.db_file = db_file
        self.conn = None
        self.cursor = None
        self.config = {}
        self.load_config_settings = None  # Assuming this is a signal, initialize it properly
        self.config_schema = {
            'temp_lower_limit': 'REAL',
            'temp_upper_limit': 'REAL',
            'humidity_lower_limit': 'REAL',
            'humidity_upper_limit': 'REAL',
            'sprinkler_single_run_time': 'REAL',
            'sprinkler_run_interval_time': 'REAL',
            'sprinkler_loop_interval': 'REAL',
            'trolley_single_run_time': 'REAL',
            'trolley_run_interval_time': 'REAL',
            'dolly_single_run_time': 'REAL',
            'dolly_run_interval_time': 'REAL'
        }
        self.connect()
        self._create_table()

    def connect(self):
        self.conn = sqlite3.connect(self.db_file)
        self.cursor = self.conn.cursor()

    def _create_table(self):
        columns = ', '.join([f"{key} {value}" for key, value in self.config_schema.items()])
        self.cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS config (
                {columns},
                timestamp TEXT
            )
        ''')
        self.conn.commit()

    def add_config_item(self, name, data_type):
        if name not in self.config_schema:
            self.config_schema[name] = data_type
            self.cursor.execute(f"ALTER TABLE config ADD COLUMN {name} {data_type}")
            self.conn.commit()

    def load_config(self):
        self.cursor.execute('SELECT * FROM config ORDER BY timestamp DESC LIMIT 1')
        row = self.cursor.fetchone()
        if row:
            columns = [description[0] for description in self.cursor.description]
            self.config = dict(zip(columns, row))
            if self.load_config_settings:
                self.load_config_settings.emit(self.config)

    def save_config(self):
        current_time = datetime.now().isoformat()
        self.config['timestamp'] = current_time
        
        # Delete existing config
        self.cursor.execute('DELETE FROM config')
        
        # Insert new config
        columns = ', '.join(self.config.keys())
        placeholders = ', '.join('?' * len(self.config))
        query = f'INSERT INTO config ({columns}) VALUES ({placeholders})'
        self.cursor.execute(query, tuple(self.config.values()))
        
        self.conn.commit()

    def update_config(self, **kwargs):
        self.config.update(kwargs)
        self.save_config()

    def get_config(self, key, default=None):
        return self.config.get(key, default)

    def get_multiple_config(self, keys):
        return {key: value for key, value in 
                ((key, self.config.get(key)) for key in keys) 
                if value is not None}

    def update_multiple_config(self, config_dict):
        self.config.update(config_dict)
        self.save_config()

    def get_all_config(self):
        return self.config.copy()

    def get_last_update_time(self):
        return self.config.get('timestamp')

    def clear_sensor_data(self):
        """
        清空sensor_data表中的所有数据
        """
        try:
            self.cursor.execute('DELETE FROM sensor_data')
            self.conn.commit()
            logger.info("sensor_data表已清空")
        except sqlite3.Error as e:
            logger.info(f"清空sensor_data表时发生错误: {e}")

class ControlUtils():
    def __init__(self):
        self.lock = threading.Lock()
        self.zone1_heater_on = False
        self.zone2_heater_on = False

        self.zone1_humidifier_on = False
        self.zone2_humidifier_on = False

        self.dolly_on = False

        self.zone1_output_addr = 0
        self.zone2_output_addr = 1

        self.sprinkler_base_addr = 2

        self.dolly_move_addr = 2
        self.dolly_move_addr_back_up = 3

        self.dio_ip = "192.168.0.7"  # 替换为您设备的实际IP地址
        self.dio_port = 8234  # Modbus TCP默认端口

        self.tank_one_on = False
        self.tank_two_on = False

        # debug时不连接Modbus服务器
        self.debug = True

        self.output_num = 6 # 输出数量

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
            
    def control_one_tank(self, state):
        if state:
            if not self.tank_one_on:
                self.tank_one_on = True
                self.control_output(14, True)
            if not self.tank_two_on:
                self.tank_two_on = True
                self.control_output(15, True)
        else:
            if self.tank_one_on:
                self.tank_one_on = False
                self.control_output(14, False)
            if self.tank_two_on:
                self.tank_two_on = False
                self.control_output(15, False)

    def control_two_tank(self, state):
        if state:
            if not self.tank_one_on:
                self.tank_one_on = True
                self.control_output(14, True)
        else:
            if self.tank_one_on:
                self.tank_one_on = False
                self.control_output(14, False)

    def control_output(self, address, value):
        with self.lock:
            if not self.debug:
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

    def turn_zone1_heater_on(self):
        if not self.zone1_heater_on:
            self.zone1_heater_on = True
            logger.info('Turning zone1 heater ON')

    def turn_zone1_heater_off(self):
        if self.zone1_heater_on:
            self.zone1_heater_on = False
            logger.info('Turning zone1 heater OFF')

    def turn_zone2_heater_on(self):
        if not self.zone2_heater_on:
            self.zone2_heater_on = True
            logger.info('Turning zone2 heater ON')

    def turn_zone2_heater_off(self):
        if self.zone2_heater_on:
            self.zone2_heater_on = False
            logger.info('Turning zone2 heater OFF')

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
                
    def turn_dolly_on(self):
        if not self.dolly_on:
            logger.info('Turning dolly ON')
            self.dolly_on = True
            self.control_output(self.dolly_move_addr, True)
            self.control_output(self.zone2_output_addr, True)
            self.control_output(self.zone1_output_addr, True)

    def turn_dolly_off(self):
        if self.dolly_on:
            logger.info('Turning dolly OFF')
            self.dolly_on = False
            self.control_output(self.dolly_move_addr, False)
            self.control_output(self.zone2_output_addr, False)
            self.control_output(self.zone1_output_addr, False)

    def turn_all_off(self):
        for i in range(self.output_num):
            self.control_output(i, False)
        
class ExportThread(Thread):
    def __init__(self, db_name, usb_mount, result_queue, sensor_num, timeout=30):
        Thread.__init__(self)
        self.db_name = db_name
        self.usb_mount = usb_mount
        self.result_queue = result_queue
        self.timeout = timeout
        self.sensor_num = sensor_num

    def run(self):
        conn = None
        try:
            conn = sqlite3.connect(self.db_name)
            df = pd.read_sql_query("SELECT * FROM sensor_data", conn)

            column_mapping = {
                'timestamp': '时间戳',
                **{f'temp_{i}': f'温感{i}' for i in range(1, self.sensor_num + 1)},
                **{f'hum_{i}': f'湿感{i}' for i in range(1, self.sensor_num + 1)}
            }
            df.rename(columns=column_mapping, inplace=True)
            df = df.replace('unknown', '未知')

            current_time = datetime.now().strftime("%Y年%m月%d日_%H时%M分%S秒")
            excel_file = os.path.join(self.usb_mount, f'{current_time}_传感器数据导出.xlsx')

            self.export_with_verification(df, excel_file)

            self.result_queue.put((True, f"数据已成功导出到U盘: {excel_file}"))
        except Exception as e:
            self.result_queue.put((False, f"导出数据到U盘时发生错误: {e}"))
        finally:
            if conn:
                conn.close()

    def export_with_verification(self, df, excel_file, max_retries=3):
        for attempt in range(max_retries):
            try:
                with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
                    df.to_excel(writer, sheet_name='传感器数据', index=False)
                    writer.save()
                    writer.close()

                # 强制刷新到磁盘
                with open(excel_file, 'rb') as f:
                    os.fsync(f.fileno())

                # 验证文件
                if self.verify_file(excel_file, df):
                    return
            except Exception as e:
                if attempt == max_retries - 1:
                    raise Exception(f"导出失败，已重试{max_retries}次: {e}")
                time.sleep(1)

        raise Exception("验证文件失败，导出可能不完整")

    def verify_file(self, excel_file, original_df):
        start_time = time.time()
        while time.time() - start_time < self.timeout:
            if os.path.exists(excel_file) and os.path.getsize(excel_file) > 0:
                try:
                    # 尝试读取Excel文件
                    df_read = pd.read_excel(excel_file, engine='openpyxl')
                    # 比较导出的数据和原始数据
                    if df_read.equals(original_df):
                        return True
                except Exception:
                    pass
            time.sleep(0.5)
        return False

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
    
    # error_occurred = pyqtSignal(str)  # 添加错误信号

    def __init__(self):
        super().__init__() 
        self.temp_lower_limit = 70.0
        self.temp_upper_limit = 80.0
        self.humidity_lower_limit = 80.0
        self.humidity_upper_limit = 90.0
        self.sprinkler_single_run_time = 5
        self.sprinkler_run_interval_time = 2
        self.sprinkler_loop_interval = 10

        self.dolly_single_run_time = 4
        self.dolly_run_interval_time = 4

        self.dolly_auto_mode = False
        self.dolly_mode_lock = threading.Lock()

        self.sprinkler_system_on = False
        self.sprinkler_system_lock = threading.Lock()
        
        self.config_manager = ConfigManager()  # 这将默认使用 'sensor_data.db'

        # 加载配置
        self.config_manager.load_config()
        # 加载控制工具

        self.control_utils = None
        
        self.ros2_thread = ROS2Thread(self)

        self.sensor_num = 16

    def process_limit_settings(self, temp_upper, temp_lower, humidity_upper, humidity_lower):
        # 在工作线程中处理接收到的限制设置
        logger.info(f"Worker received: Temp {temp_lower}-{temp_upper}°C, Humidity {humidity_lower}-{humidity_upper}%")
        self.temp_lower_limit = temp_lower
        self.temp_upper_limit = temp_upper
        self.humidity_lower_limit = humidity_lower
        self.humidity_upper_limit = humidity_upper
        self.save_limits()  # 保存新的限制值

    def sprinkler_manual_control(self, index, state):
        # { sprinkler: n, state: 1 }
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
                self.control_utils.turn_dolly_on()
            else:
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

        elif control["target"] == "manual":
            self.sprinkler_manual_control(control["index"], control["state"])

        elif control["target"] == "twoTank":
            logger.info(f"Control twoTank: {control['state']}")
            self.control_utils.control_two_tank(control["state"])

        elif control["target"] == "oneTank":
            logger.info(f"Control oneTank: {control['state']}")
            self.control_utils.control_one_tank(control["state"])

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
            logger.info(f"Loaded limits: Temp {self.temp_lower_limit}-{self.temp_upper_limit}°C, Humidity {self.humidity_lower_limit}-{self.humidity_upper_limit}%")
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
        export_thread = ExportThread(db_name, usb_mount, result_queue, self.sensor_num)
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

            self.qtSignalHandler.load_limits()
            self.qtSignalHandler.load_sprinkler()
            self.qtSignalHandler.load_dolly()
            
            while self.running and rclpy.ok():
                rclpy.spin_once(self.node, timeout_sec=0.1)
            # 关闭所有输出
            self.node.control_utils.turn_all_off()
            
            # 在子线程中关闭数据库连接
            self.node.conn.close()
            self.node.destroy_node()
            rclpy.shutdown()
        except ModbusControlException as e:
            self.qtSignalHandler.export_completed.emit(-1)  # 发送错误信号
        finally:
            self.running = False
        
    def stop(self):
        self.running = False

class ModbusControlException(Exception):
    pass

class SensorSubscriberNode(Node):
    def __init__(self, qtSignalHandler):
        Node.__init__(self, 'sensor_subscriber')
        self.qtSignalHandler = qtSignalHandler
        self.sensor_num = qtSignalHandler.sensor_num
        
        self.temp_data = {f'temperature_sensor_{i}': -1 for i in range(1, self.sensor_num + 1)}  # 修改为 16 个传感器
        self.humidity_data = {f'humidity_sensor_{i}': -1 for i in range(1, self.sensor_num + 1)}  # 修改为 16 个传感器

        self.subscription = self.create_subscription(
            String,
            'water_protection_status',
            self.listener_callback,
            10)

        self.db_name = 'sensor_data.db'
        self.conn, self.cursor = self.initialize_database(self.db_name)

        self.save_to_db_count = 0

        self.cli = self.create_client(Trigger, 'get_sensor_data')

        self.timer = self.create_timer(5.0, self.timer_callback)

        self.dolly_timer = self.create_timer(2.0, self.dolly_timer_callback)
        self.sprinkler_timer = self.create_timer(2.0, self.sprinkler_timer_callback)

        self.control_utils = self.qtSignalHandler.control_utils

    def listener_callback(self, msg):
        self.process_water_protection_status(msg.data)

    def process_water_protection_status(self, status):
        if status == "Left side: Water shortage":
            self.get_logger().warn("Left side water shortage detected!")
            self.qtSignalHandler.update_water_tank_status.emit({"side": "left", "low_water": True})
            # Add your custom actions here
        elif status == "Left side: Water shortage resolved":
            self.get_logger().info("Left side water shortage resolved.")
            self.qtSignalHandler.update_water_tank_status.emit({"side": "left", "low_water": False})
            # Add your custom actions here
        elif status == "Right side: Water shortage":
            self.qtSignalHandler.update_water_tank_status.emit({"side": "right", "low_water": True})
            self.get_logger().warn("Right side water shortage detected!")
            # Add your custom actions here
        elif status == "Right side: Water shortage resolved":
            self.qtSignalHandler.update_water_tank_status.emit({"side": "right", "low_water": False})
            self.get_logger().info("Right side water shortage resolved.")
            # Add your custom actions here
        else:
            self.get_logger().warn(f"Received unexpected status: {status}")

    def sprinkler_timer_callback(self):
        if self.qtSignalHandler.get_sprinkler_system_state():
            updated_temp_data = {sensor: value for sensor, value in self.temp_data.items() if value != -1}
            updated_humidity_data = {sensor: value for sensor, value in self.humidity_data.items() if value != -1}

            if updated_temp_data or updated_humidity_data:
                self.process_sprinkler_data(updated_humidity_data)
                # self.process_data_zone1(
                #     {k: v for k, v in updated_temp_data.items() if k in [f'temperature_sensor_{i}' for i in range(1, 9)]},  # 修改为前 8 个传感器
                #     {k: v for k, v in updated_humidity_data.items() if k in [f'humidity_sensor_{i}' for i in range(1, 9)]}  # 修改为前 8 个传感器
                # )
                # self.process_data_zone2(
                #     {k: v for k, v in updated_temp_data.items() if k in [f'temperature_sensor_{i}' for i in range(9, 17)]},  # 修改为后 8 个传感器
                #     {k: v for k, v in updated_humidity_data.items() if k in [f'humidity_sensor_{i}' for i in range(9, 17)]}  # 修改为后 8 个传感器
                # )

    def dolly_timer_callback(self):
        if self.qtSignalHandler.get_dolly_auto_mode():
            updated_temp_data = {sensor: value for sensor, value in self.temp_data.items() if value != -1}
            updated_humidity_data = {sensor: value for sensor, value in self.humidity_data.items() if value != -1}

            if updated_temp_data or updated_humidity_data:
                self.process_data(updated_humidity_data)

    # def process_data_zone1(self, temp_data, humidity_data):
    #     if temp_data:
    #         if any(temp < self.qtSignalHandler.temp_lower_limit for temp in temp_data.values()):
    #             self.control_utils.turn_zone1_heater_on()
    #         elif all(temp > self.qtSignalHandler.temp_upper_limit for temp in temp_data.values()):
    #             self.control_utils.turn_zone1_heater_off()

    #     if humidity_data:
    #         if any(humidity < self.qtSignalHandler.humidity_lower_limit for humidity in humidity_data.values()):
    #             self.control_utils.turn_zone1_humidifier_on()
    #             self.qtSignalHandler.left_steam_status_updated.emit(True)
    #         elif all(humidity > self.qtSignalHandler.humidity_upper_limit for humidity in humidity_data.values()):
    #             self.control_utils.turn_zone1_humidifier_off()
    #             self.qtSignalHandler.left_steam_status_updated.emit(False)

    # def process_data_zone2(self, temp_data, humidity_data):
    #     if temp_data:
    #         if any(temp < self.qtSignalHandler.temp_lower_limit for temp in temp_data.values()):
    #             self.control_utils.turn_zone2_heater_on()
    #         elif all(temp > self.qtSignalHandler.temp_upper_limit for temp in temp_data.values()):
    #             self.control_utils.turn_zone2_heater_off()

    #     if humidity_data:
    #         if any(humidity < self.qtSignalHandler.humidity_lower_limit for humidity in humidity_data.values()):
    #             self.control_utils.turn_zone2_humidifier_on()
    #             self.qtSignalHandler.right_steam_status_updated.emit(True)
    #         elif all(humidity > self.qtSignalHandler.humidity_upper_limit for humidity in humidity_data.values()):
    #             self.control_utils.turn_zone2_humidifier_off()
    #             self.qtSignalHandler.right_steam_status_updated.emit(False)

    def process_sprinkler_data(self, humidity_data):
        if humidity_data:
            if any(humidity < self.qtSignalHandler.humidity_lower_limit for humidity in humidity_data.values()):
                # 开启两水泵
                self.control_utils.control_two_tank(True)
                self.control_utils.turn_zone1_humidifier_on()
                self.qtSignalHandler.left_steam_status_updated.emit(True)
                self.control_utils.turn_zone2_humidifier_on()
                self.qtSignalHandler.right_steam_status_updated.emit(True)
            elif all(humidity > self.qtSignalHandler.humidity_upper_limit for humidity in humidity_data.values()):
                # 关闭两水泵
                self.control_utils.control_two_tank(False)
                self.control_utils.turn_zone1_humidifier_off()
                self.qtSignalHandler.left_steam_status_updated.emit(False)
                self.control_utils.turn_zone2_humidifier_off()
                self.qtSignalHandler.right_steam_status_updated.emit(False)

    def process_data(self, humidity_data):
        if humidity_data:
            if any(humidity < self.qtSignalHandler.humidity_lower_limit for humidity in humidity_data.values()):
                self.control_utils.turn_dolly_on()
                self.qtSignalHandler.update_dolly_state.emit(True)
            elif all(humidity > self.qtSignalHandler.humidity_upper_limit for humidity in humidity_data.values()):
                self.control_utils.turn_dolly_off()
                self.qtSignalHandler.update_dolly_state.emit(False)

    def timer_callback(self):
        # self.get_logger().info('开始请求数据...')
        request = Trigger.Request()

        # 异步调用服务
        future = self.cli.call_async(request)
        future.add_done_callback(self.service_response_callback)

    def service_response_callback(self, future):
        try:
            response = future.result()  # 获取服务的响应
            if response.success:
                data = json.loads(response.message)
                
                self.temp_data = data["temperatures"]
                self.humidity_data = data["humidities"]
                # self.get_logger().info('接收到传感器数据:')
                # logger.info(f'温度: {data["temperatures"]}, 湿度: {data["humidities"]}')
            else:
                logger.error(f'获取传感器数据失败: {response.message}')
                
                self.temp_data = {sensor: -1 for sensor in self.temp_data}
                self.humidity_data = {sensor: -1 for sensor in self.humidity_data}
        except Exception as e:
            logger.error(f'获取传感器数据时出错: {str(e)}')
            
            self.temp_data = {sensor: -1 for sensor in self.temp_data}
            self.humidity_data = {sensor: -1 for sensor in self.humidity_data}

        self.true_process()

    def true_process(self):
        sensor_data = []

        for i in range(1, self.sensor_num + 1):  # 修改为 16 个传感器
            temp_sensor_name = f'temperature_sensor_{i}'
            temp_value = self.temp_data[temp_sensor_name]
            if temp_value != -1:
                sensor_data.append((f'温感{i}', f'{temp_value:.1f}°C'))
            else:
                sensor_data.append((f'温感{i}', '未知'))
        
        for i in range(1, self.sensor_num + 1):  # 修改为 16 个传感器
            humidity_sensor_name = f'humidity_sensor_{i}'
            humidity_value = self.humidity_data[humidity_sensor_name]
            if humidity_value != -1:
                sensor_data.append((f'湿感{i}', f'{humidity_value:.1f}%'))
            else:
                sensor_data.append((f'湿感{i}', '未知'))

        if sensor_data:
            self.qtSignalHandler.data_updated.emit(sensor_data)
            # 保存数据
            self.save_data_to_db(self.cursor, sensor_data)
            self.conn.commit()

    def create_table(self, cursor):
        if self.sensor_num == 16:
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_data (
                timestamp TEXT PRIMARY KEY,
                temp_1 REAL, temp_2 REAL, temp_3 REAL, temp_4 REAL,
                temp_5 REAL, temp_6 REAL, temp_7 REAL, temp_8 REAL,
                temp_9 REAL, temp_10 REAL, temp_11 REAL, temp_12 REAL,
                temp_13 REAL, temp_14 REAL, temp_15 REAL, temp_16 REAL,
                hum_1 REAL, hum_2 REAL, hum_3 REAL, hum_4 REAL,
                hum_5 REAL, hum_6 REAL, hum_7 REAL, hum_8 REAL,
                hum_9 REAL, hum_10 REAL, hum_11 REAL, hum_12 REAL,
                hum_13 REAL, hum_14 REAL, hum_15 REAL, hum_16 REAL
            )
            ''')
        else:
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_data (
                timestamp TEXT PRIMARY KEY,
                temp_1 REAL, temp_2 REAL, temp_3 REAL, temp_4 REAL,
                hum_1 REAL, hum_2 REAL, hum_3 REAL, hum_4 REAL
            )
            ''')

    @staticmethod
    def table_exists(cursor, table_name):
        cursor.execute(f"""
        SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'
        """)
        return cursor.fetchone() is not None

    def initialize_database(self, db_name, days_to_keep=14):
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        if not SensorSubscriberNode.table_exists(cursor, 'sensor_data'):
            logger.info("Creating sensor_data table")
            self.create_table(cursor)
        else:
            logger.info("sensor_data table already exists.")

        # 清理旧数据
        timestamp_threshold = datetime.now() - timedelta(days=days_to_keep)
        cursor.execute('''
        DELETE FROM sensor_data
        WHERE timestamp < ?
        ''', (timestamp_threshold.strftime("%Y-%m-%d %H:%M:%S"),))

        conn.commit()
        return conn, cursor

    def save_data_to_db(self, cursor, sensor_data):
        if self.save_to_db_count == 11:
            self.save_to_db_count = 0
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            data = {f"temp_{i}": None for i in range(1, self.sensor_num + 1)}
            data.update({f"hum_{i}": None for i in range(1, self.sensor_num + 1)})
            
            for sensor, value in sensor_data:
                if '温感' in sensor:
                    sensor_num = int(sensor[2:])  # 修改这里以支持两位数的传感器编号
                    if value != '未知':
                        data[f"temp_{sensor_num}"] = float(value[:-2])  # 移除 '°C' 并转换为浮点数
                    else:
                        data[f"temp_{sensor_num}"] = 'unknown'
                elif '湿感' in sensor:
                    sensor_num = int(sensor[2:])  # 修改这里以支持两位数的传感器编号
                    if value != '未知':
                        data[f"hum_{sensor_num}"] = float(value[:-1])  # 移除 '%' 并转换为浮点数
                    else:
                        data[f"hum_{sensor_num}"] = 'unknown'

            placeholders = ', '.join(['?'] * (len(data) + 1))
            columns = ', '.join(['timestamp'] + list(data.keys()))
            values = [timestamp] + list(data.values())
            
            cursor.execute(f'''
            INSERT OR REPLACE INTO sensor_data
            ({columns}) VALUES ({placeholders})
            ''', values)
        else:
            self.save_to_db_count += 1

def main():
    app = QApplication(sys.argv)
    qtSignalHandler = QtSignalHandler()
    
    # ex = IndustrialControlPanel(ros2_thread)
    ex = MainWindow()
    qtSignalHandler.data_updated.connect(ex.update_sensor_data)
    ex.bridge.limitSettingsUpdated.connect(qtSignalHandler.process_limit_settings)
    qtSignalHandler.load_limit_settings.connect(ex.update_limit_settings)
    
    ex.bridge.steamEngineState.connect(qtSignalHandler.manual_steam_engine_state)
    
    qtSignalHandler.load_sprinkler_settings.connect(ex.update_sprinkler_settings)
    
    ex.bridge.dollyControl.connect(qtSignalHandler.dolly_control)
    qtSignalHandler.load_dolly_settings.connect(ex.update_dolly_settings)
    ex.bridge.sprinklerSystemControl.connect(qtSignalHandler.sprinkler_control)
    # ros2_thread.mode_chosen.connect(ros2_thread.process_mode_chosen)
    qtSignalHandler.export_completed.connect(ex.show_export_completed_dialog)
    qtSignalHandler.export_started.connect(ex.show_export_progress)
    qtSignalHandler.left_steam_status_updated.connect(ex.update_left_steam_status)
    qtSignalHandler.right_steam_status_updated.connect(ex.update_right_steam_status)

    qtSignalHandler.update_dolly_state.connect(ex.update_dolly_state)
    qtSignalHandler.update_water_tank_status.connect(ex.update_water_tank_status)
    ex.bridge.dataExport.connect(qtSignalHandler.export_data)

    try:
        qtSignalHandler.control_utils = ControlUtils()
    except ModbusControlException as e:
        qtSignalHandler.export_completed.emit(-1)  # 发送错误信号

    qtSignalHandler.ros2_thread.start()

    # 创建一个计时器来定期处理事件
    timer = QTimer()
    timer.start(500)  # 每500毫秒触发一次
    timer.timeout.connect(lambda: None)  # 保持事件循环活跃

    # 使用Qt的方式来处理UNIX信号
    def qt_signal_handler():
        logger.info("收到主程序关闭信号")
        qtSignalHandler.ros2_thread.stop()
        qtSignalHandler.ros2_thread.wait()
        qtSignalHandler.config_manager.conn.close()
        ex.close()
        app.quit()

    # 设置信号处理器
    signal.signal(signal.SIGINT, lambda *args: QTimer.singleShot(0, qt_signal_handler))

    ex.showFullScreen()
    
    # 使用 app.exec() 替代 app.exec_()
    exit_code = app.exec()

    # 清理操作
    logger.info("主程序退出")
    qtSignalHandler.ros2_thread.stop()
    qtSignalHandler.ros2_thread.wait()
    qtSignalHandler.config_manager.conn.close()

    sys.exit(exit_code)

if __name__ == '__main__':
    main()