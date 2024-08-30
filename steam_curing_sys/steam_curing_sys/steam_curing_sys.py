import random
import sys
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from PyQt5.QtCore import QThread, pyqtSignal, QTimer
from PyQt5.QtWidgets import QApplication
from .steam_curing_sys_UI import IndustrialControlPanel
from pymodbus.client import ModbusTcpClient
from pymodbus.exceptions import ModbusException, ConnectionException
from pymodbus.pdu import ExceptionResponse
from PyQt5.QtCore import QEventLoop
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
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExportThread(Thread):
    def __init__(self, db_name, usb_mount, result_queue, timeout=30):
        Thread.__init__(self)
        self.db_name = db_name
        self.usb_mount = usb_mount
        self.result_queue = result_queue
        self.timeout = timeout

    def run(self):
        conn = None
        try:
            conn = sqlite3.connect(self.db_name)
            df = pd.read_sql_query("SELECT * FROM sensor_data", conn)

            column_mapping = {
                'timestamp': '时间戳',
                **{f'temp_{i}': f'温感{i}' for i in range(1, 17)},
                **{f'hum_{i}': f'湿感{i}' for i in range(1, 17)}
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

class ROS2Thread(QThread):
    # pyqtSignal必须是类属性
    limit_settings = pyqtSignal(float, float, float, float)
    recover_limit_settings = pyqtSignal(float, float, float, float)
    data_updated = pyqtSignal(list)
    left_steam_status_updated = pyqtSignal(int)
    right_steam_status_updated = pyqtSignal(int)
    mode_chosen = pyqtSignal(int)
    export_completed = pyqtSignal(int)
    export_started = pyqtSignal()
    # error_occurred = pyqtSignal(str)  # 添加错误信号
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.running = True
        self.mode = 1
        self.temp_lower_limit = 70.0
        self.temp_upper_limit = 80.0
        self.humidity_lower_limit = 80.0
        self.humidity_upper_limit = 90.0
        self.node = None  # 初始化为 None
        self.config_file = 'sensor_limits.json'
        self.load_limits()
        
    def run(self):
        try:
            rclpy.init()
            self.node = SensorSubscriberNode(self)
            while self.running and rclpy.ok():
                rclpy.spin_once(self.node, timeout_sec=0.1)
            # 关闭输出
            self.node.control_output(self.node.zone1_output_addr, False)
            self.node.control_output(self.node.zone2_output_addr, False)
            # 在子线程中关闭数据库连接
            self.node.conn.close()
            self.node.destroy_node()
            rclpy.shutdown()
        except ModbusControlException as e:
            self.export_completed.emit(-1)  # 发送错误信号
        finally:
            self.running = False
        
    def stop(self):
        self.running = False

    def process_limit_settings(self, temp_upper, temp_lower, humidity_upper, humidity_lower):
        # 在工作线程中处理接收到的限制设置
        logger.info(f"Worker received: Temp {temp_lower}-{temp_upper}°C, Humidity {humidity_lower}-{humidity_upper}%")
        self.temp_lower_limit = temp_lower
        self.temp_upper_limit = temp_upper
        self.humidity_lower_limit = humidity_lower
        self.humidity_upper_limit = humidity_upper
        self.save_limits()  # 保存新的限制值

    def process_mode_chosen(self, mode):
        # 在工作线程中处理接收到的模式选择
        logger.info(f"Worker received: Mode {mode}")
        if mode == 1 and self.mode == 2:
            self.node.turn_zone1_humidifier_off()
            self.node.turn_zone2_humidifier_off()
            self.mode = 1
            logger.info('Mode 1 chosen')
        elif mode == 2 and self.mode == 1:
            self.mode = 2
            logger.info('Mode 2 chosen')
        elif mode == 3:
            self.node.export_tables_to_excel(self.node.db_name)

    def load_limits(self):
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                limits = json.load(f)
            self.temp_lower_limit = limits['temp_lower']
            self.temp_upper_limit = limits['temp_upper']
            self.humidity_lower_limit = limits['humidity_lower']
            self.humidity_upper_limit = limits['humidity_upper']
            self.recover_limit_settings.emit(self.temp_upper_limit, self.temp_lower_limit, self.humidity_upper_limit, self.humidity_lower_limit)

    def save_limits(self):
        limits = {
            'temp_lower': self.temp_lower_limit,
            'temp_upper': self.temp_upper_limit,
            'humidity_lower': self.humidity_lower_limit,
            'humidity_upper': self.humidity_upper_limit
        }
        with open(self.config_file, 'w') as f:
            json.dump(limits, f)

class ModbusControlException(Exception):
    pass

class SensorSubscriberNode(Node):
    def __init__(self, ros2_thread):
        super().__init__('sensor_subscriber')
        self.ros2_thread = ros2_thread
        
        self.temp_data = {f'temperature_sensor_{i}': -1 for i in range(1, 17)}  # 修改为 16 个传感器
        self.humidity_data = {f'humidity_sensor_{i}': -1 for i in range(1, 17)}  # 修改为 16 个传感器

        self.zone1_heater_on = False
        self.zone2_heater_on = False

        self.zone1_humidifier_on = False
        self.zone2_humidifier_on = False

        self.db_name = 'sensor_data.db'
        self.conn, self.cursor = SensorSubscriberNode.initialize_database(self.db_name)

        self.dio_ip = "192.168.0.7"  # 替换为您设备的实际IP地址
        self.dio_port = 8234  # Modbus TCP默认端口

        self.zone1_output_addr = 0
        self.zone2_output_addr = 1

        self.save_to_db_count = 0

        try:
            self.dio_client = ModbusTcpClient(self.dio_ip, port=self.dio_port)
            if not self.dio_client.connect():
                raise ModbusControlException(f"无法连接到 Modbus 服务器 {self.dio_ip}:{self.dio_port}")
            else:
                try:
                    initial_data = self.dio_client.socket.recv(1024)
                    if initial_data:
                        logger.info(f"初始响应: {initial_data.hex()}")
                        logger.info(f"初始响应 (ASCII): {initial_data.decode('ascii', errors='ignore')}")
                except Exception as e:
                    logger.error(f"读取初始响应时出错: {e}")
        except ConnectionException as e:
            raise ModbusControlException(f"Modbus 连接错误: {e}")
        
        # 初始化关闭所有输出
        # self.control_output(self.zone1_output_addr, False)
        # self.control_output(self.zone2_output_addr, False)
        
        for i in range(1, 17):  # 修改为 16 个传感器
            self.create_subscription(
                Float32,
                f'temperature_sensor_{i}',
                lambda msg, sensor=f'temperature_sensor_{i}': self.temp_callback(msg, sensor),
                10)
            self.create_subscription(
                Float32,
                f'humidity_sensor_{i}',
                lambda msg, sensor=f'humidity_sensor_{i}': self.humidity_callback(msg, sensor),
                10)

        self.timer = self.create_timer(5.0, self.timer_callback)

    def control_output(self, address, value):
        try:
            result = self.dio_client.write_coil(address, value, slave=1)
            logger.info("写入操作返回值:")
            logger.info(f"  类型: {type(result)}")
            logger.info(f"  内容: {result}")
            if hasattr(result, 'function_code'):
                logger.info(f"  功能码: {result.function_code}")
            if hasattr(result, 'address'):
                logger.info(f"  地址: {result.address}")
            if hasattr(result, 'value'):
                logger.info(f"  值: {result.value}")
            if isinstance(result, ExceptionResponse):
                logger.info(f"Modbus异常: {result}")
            else:
                logger.info(f"成功{'打开' if value else '关闭'}输出 {address}")
        except ModbusException as e:
            raise ModbusControlException(f"Modbus错误: {e}")

    def temp_callback(self, msg, sensor_name):
        self.temp_data[sensor_name] = msg.data

    def humidity_callback(self, msg, sensor_name):
        self.humidity_data[sensor_name] = msg.data

    def timer_callback(self):
        if self.ros2_thread.mode == 1:
            self.true_process()
        else:
            average_temp = (self.ros2_thread.temp_lower_limit + self.ros2_thread.temp_upper_limit)/2
            average_humidity = (self.ros2_thread.humidity_lower_limit + self.ros2_thread.humidity_upper_limit)/2
            sensor_data = [
                (f'温感{i}', f'{average_temp+random.uniform(-3, 3):.1f}°C') for i in range(1, 17)  # 修改为 16 个传感器
            ] + [
                (f'湿感{i}', f'{average_humidity+random.uniform(-3, 3):.1f}%') for i in range(1, 17)  # 修改为 16 个传感器
            ]
            self.ros2_thread.data_updated.emit(sensor_data)
            # 保存数据
            self.save_data_to_db(self.cursor, sensor_data)
            self.conn.commit()

            self.turn_zone1_humidifier_on()
            self.turn_zone2_humidifier_on()

    def true_process(self):
        sensor_data = []

        for i in range(1, 17):  # 修改为 16 个传感器
            temp_sensor_name = f'temperature_sensor_{i}'
            temp_value = self.temp_data[temp_sensor_name]
            if temp_value != -1:
                sensor_data.append((f'温感{i}', f'{temp_value:.1f}°C'))
            else:
                sensor_data.append((f'温感{i}', '未知'))
        
        for i in range(1, 17):  # 修改为 16 个传感器
            humidity_sensor_name = f'humidity_sensor_{i}'
            humidity_value = self.humidity_data[humidity_sensor_name]
            if humidity_value != -1:
                sensor_data.append((f'湿感{i}', f'{humidity_value:.1f}%'))
            else:
                sensor_data.append((f'湿感{i}', '未知'))

        if sensor_data:
            self.ros2_thread.data_updated.emit(sensor_data)
            # 保存数据
            self.save_data_to_db(self.cursor, sensor_data)
            self.conn.commit()

        updated_temp_data = {sensor: value for sensor, value in self.temp_data.items() if value != -1}
        updated_humidity_data = {sensor: value for sensor, value in self.humidity_data.items() if value != -1}

        if updated_temp_data or updated_humidity_data:
            self.process_data_zone1(
                {k: v for k, v in updated_temp_data.items() if k in [f'temperature_sensor_{i}' for i in range(1, 9)]},  # 修改为前 8 个传感器
                {k: v for k, v in updated_humidity_data.items() if k in [f'humidity_sensor_{i}' for i in range(1, 9)]}  # 修改为前 8 个传感器
            )
            self.process_data_zone2(
                {k: v for k, v in updated_temp_data.items() if k in [f'temperature_sensor_{i}' for i in range(9, 17)]},  # 修改为后 8 个传感器
                {k: v for k, v in updated_humidity_data.items() if k in [f'humidity_sensor_{i}' for i in range(9, 17)]}  # 修改为后 8 个传感器
            )

        self.temp_data = {sensor: -1 for sensor in self.temp_data}
        self.humidity_data = {sensor: -1 for sensor in self.humidity_data}

    def process_data_zone1(self, temp_data, humidity_data):
        if temp_data:
            if any(temp < self.ros2_thread.temp_lower_limit for temp in temp_data.values()):
                self.turn_zone1_heater_on()
            elif all(temp > self.ros2_thread.temp_upper_limit for temp in temp_data.values()):
                self.turn_zone1_heater_off()

        if humidity_data:
            if any(humidity < self.ros2_thread.humidity_lower_limit for humidity in humidity_data.values()):
                self.turn_zone1_humidifier_on()
            elif all(humidity > self.ros2_thread.humidity_upper_limit for humidity in humidity_data.values()):
                self.turn_zone1_humidifier_off()

    def process_data_zone2(self, temp_data, humidity_data):
        if temp_data:
            if any(temp < self.ros2_thread.temp_lower_limit for temp in temp_data.values()):
                self.turn_zone2_heater_on()
            elif all(temp > self.ros2_thread.temp_upper_limit for temp in temp_data.values()):
                self.turn_zone2_heater_off()

        if humidity_data:
            if any(humidity < self.ros2_thread.humidity_lower_limit for humidity in humidity_data.values()):
                self.turn_zone2_humidifier_on()
            elif all(humidity > self.ros2_thread.humidity_upper_limit for humidity in humidity_data.values()):
                self.turn_zone2_humidifier_off()

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
            self.ros2_thread.left_steam_status_updated.emit(1)

    def turn_zone1_humidifier_off(self):
        if self.zone1_humidifier_on:
            self.zone1_humidifier_on = False
            logger.info('Turning zone1 humidifier OFF')
            self.control_output(self.zone1_output_addr, False)
            self.ros2_thread.left_steam_status_updated.emit(0)

    def turn_zone2_humidifier_on(self):
        if not self.zone2_humidifier_on:
            self.zone2_humidifier_on = True
            logger.info('Turning zone2 humidifier ON')
            self.control_output(self.zone2_output_addr, True)
            self.ros2_thread.right_steam_status_updated.emit(1)


    def turn_zone2_humidifier_off(self):
        if self.zone2_humidifier_on:
            self.zone2_humidifier_on = False
            logger.info('Turning zone2 humidifier OFF')
            self.control_output(self.zone2_output_addr, False)
            self.ros2_thread.right_steam_status_updated.emit(0)

    @staticmethod
    def create_table(cursor):
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

    @staticmethod
    def table_exists(cursor, table_name):
        cursor.execute(f"""
        SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'
        """)
        return cursor.fetchone() is not None

    @staticmethod
    def initialize_database(db_name, days_to_keep=14):
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        if not SensorSubscriberNode.table_exists(cursor, 'sensor_data'):
            logger.info("Creating sensor_data table")
            SensorSubscriberNode.create_table(cursor)
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
            data = {f"temp_{i}": None for i in range(1, 17)}
            data.update({f"hum_{i}": None for i in range(1, 17)})
            
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

    def export_tables_to_excel(self, db_name):
        # 检查并获取U盘挂载点
        usb_mount = SensorSubscriberNode.check_and_find_usb_drive()
        if not usb_mount:
            self.ros2_thread.export_completed.emit(0)  # 发射信号
            return

        # 发射导出开始信号
        self.ros2_thread.export_started.emit()

        result_queue = Queue()
        export_thread = ExportThread(db_name, usb_mount, result_queue)
        export_thread.start()

        def check_export_finished():
            if not export_thread.is_alive():
                success, message = result_queue.get()
                logger.info(message)
                if success:
                    self.ros2_thread.export_completed.emit(1)
                else:
                    self.ros2_thread.export_completed.emit(-2)
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
            mountpoint = SensorSubscriberNode.get_mountpoint(device.device_node)
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
                    mountpoint = SensorSubscriberNode.get_mountpoint(partition.device_node)
                
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

    @staticmethod
    def copy_file_to_usb(file_path):
        usb_mount = SensorSubscriberNode.check_and_find_usb_drive()
        if not usb_mount:
            logger.info("未检测到已挂载的 U 盘")
            return False

        try:
            if not os.path.exists(file_path):
                logger.info(f"源文件不存在: {file_path}")
                return False

            file_name = os.path.basename(file_path)
            destination = os.path.join(usb_mount, file_name)

            shutil.copy2(file_path, destination)
            logger.info(f"文件已成功复制到 U 盘: {destination}")
            return True
        except Exception as e:
            logger.info(f"复制文件时发生错误: {e}")
            return False

def main():
    app = QApplication(sys.argv)
    ros2_thread = ROS2Thread()
    ex = IndustrialControlPanel(ros2_thread)
    ros2_thread.data_updated.connect(ex.update_sensor_data)
    ros2_thread.limit_settings.connect(ros2_thread.process_limit_settings)
    ros2_thread.recover_limit_settings.connect(ex.receive_limit_settings)
    ros2_thread.mode_chosen.connect(ros2_thread.process_mode_chosen)
    ros2_thread.export_completed.connect(ex.show_export_completed_dialog)

    ros2_thread.export_started.connect(ex.show_export_progress)
    ros2_thread.left_steam_status_updated.connect(ex.update_left_steam_status)
    ros2_thread.right_steam_status_updated.connect(ex.update_right_steam_status)
    ros2_thread.start()

    def signal_handler(sig, frame):
        logger.info("SIGINT received. Shutting down gracefully...")
        if 'ex' in globals():
            ex.close()
        if 'ros2_thread' in globals():
            ros2_thread.stop()
            ros2_thread.wait()
        QApplication.quit()

    # 设置信号处理器
    signal.signal(signal.SIGINT, signal_handler)

    ex.showFullScreen()
    
    # 使用 app.exec() 替代 app.exec_()
    exit_code = app.exec()

    # 清理操作
    ros2_thread.stop()
    ros2_thread.wait()

    sys.exit(exit_code)