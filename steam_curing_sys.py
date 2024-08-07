import random
import sys
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from PyQt5.QtCore import QThread, pyqtSignal, QTimer
from PyQt5.QtWidgets import QApplication
from steam_curing_sys_UI import IndustrialControlPanel
from pymodbus.client import ModbusTcpClient
from pymodbus.exceptions import ModbusException, ConnectionException
import sqlite3
from datetime import datetime
import pandas as pd
import os
import json
import pyudev
import shutil
import subprocess
import signal

class ROS2Thread(QThread):
    # pyqtSignal必须是类属性
    limit_settings = pyqtSignal(float, float, float, float)
    recover_limit_settings = pyqtSignal(float, float, float, float)
    data_updated = pyqtSignal(list)
    left_steam_status_updated = pyqtSignal(int)
    right_steam_status_updated = pyqtSignal(int)
    mode_chosen = pyqtSignal(int)
    export_completed = pyqtSignal(int)
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
        print(f"Worker received: Temp {temp_lower}-{temp_upper}°C, Humidity {humidity_lower}-{humidity_upper}%")
        self.temp_lower_limit = temp_lower
        self.temp_upper_limit = temp_upper
        self.humidity_lower_limit = humidity_lower
        self.humidity_upper_limit = humidity_upper
        self.save_limits()  # 保存新的限制值

    def process_mode_chosen(self, mode):
        # 在工作线程中处理接收到的模式选择
        print(f"Worker received: Mode {mode}")
        if mode == 1 and self.mode == 2:
            self.mode = 1
            print('Mode 1 chosen')
        elif mode == 2 and self.mode == 1:
            self.mode = 2
            print('Mode 2 chosen')
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
        
        self.temp_data = {f'temperature_sensor_{i}': -1 for i in range(1, 5)}
        self.humidity_data = {f'humidity_sensor_{i}': -1 for i in range(1, 5)}

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

        try:
            self.dio_client = ModbusTcpClient(self.dio_ip, port=self.dio_port)
            if not self.dio_client.connect():
                raise ModbusControlException(f"无法连接到 Modbus 服务器 {self.dio_ip}:{self.dio_port}")
        except ConnectionException as e:
            raise ModbusControlException(f"Modbus 连接错误: {e}")
        
        # 初始化关闭所有输出
        self.control_output(self.zone1_output_addr, False)
        self.control_output(self.zone2_output_addr, False)
        
        for i in range(1, 5):
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
            self.dio_client.write_coil(address, value)
            print(f"成功{'打开' if value else '关闭'}输出 {address+1}")
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
                ('温度传感器1', f'{average_temp+random.uniform(-3, 3):.1f}°C'),
                ('温度传感器2', f'{average_temp+random.uniform(-3, 3):.1f}°C'),
                ('温度传感器3', f'{average_temp+random.uniform(-3, 3):.1f}°C'),
                ('温度传感器4', f'{average_temp+random.uniform(-3, 3):.1f}°C'),
                ('湿度传感器1', f'{average_humidity+random.uniform(-3, 3):.1f}%'),
                ('湿度传感器2', f'{average_humidity+random.uniform(-3, 3):.1f}%'),
                ('湿度传感器3', f'{average_humidity+random.uniform(-3, 3):.1f}%'),
                ('湿度传感器4', f'{average_humidity+random.uniform(-3, 3):.1f}%')
            ]
            self.ros2_thread.data_updated.emit(sensor_data)
            # 保存数据
            SensorSubscriberNode.save_data_to_db(self.cursor, sensor_data)
            self.conn.commit()

            self.turn_zone1_humidifier_on()
            self.turn_zone2_humidifier_on()

    def true_process(self):
        sensor_data = []

        for i in range(1, 5):
            temp_sensor_name = f'temperature_sensor_{i}'
            temp_value = self.temp_data[temp_sensor_name]
            if temp_value != -1:
                sensor_data.append((f'温度传感器{i}', f'{temp_value:.1f}°C'))
            else:
                sensor_data.append((f'温度传感器{i}', '未知'))
        
        for i in range(1, 5):
            humidity_sensor_name = f'humidity_sensor_{i}'
            humidity_value = self.humidity_data[humidity_sensor_name]
            if humidity_value != -1:
                sensor_data.append((f'湿度传感器{i}', f'{humidity_value:.1f}%'))
            else:
                sensor_data.append((f'湿度传感器{i}', '未知'))

        if sensor_data:
            self.ros2_thread.data_updated.emit(sensor_data)
            # 保存数据
            SensorSubscriberNode.save_data_to_db(self.cursor, sensor_data)
            self.conn.commit()

        updated_temp_data = {sensor: value for sensor, value in self.temp_data.items() if value != -1}
        updated_humidity_data = {sensor: value for sensor, value in self.humidity_data.items() if value != -1}

        if updated_temp_data or updated_humidity_data:
            self.process_data_zone1(
                {k: v for k, v in updated_temp_data.items() if k in ['temperature_sensor_1', 'temperature_sensor_2']},
                {k: v for k, v in updated_humidity_data.items() if k in ['humidity_sensor_1', 'humidity_sensor_2']}
            )
            self.process_data_zone2(
                {k: v for k, v in updated_temp_data.items() if k in ['temperature_sensor_3', 'temperature_sensor_4']},
                {k: v for k, v in updated_humidity_data.items() if k in ['humidity_sensor_3', 'humidity_sensor_4']}
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
            self.get_logger().info('Turning zone1 heater ON')

    def turn_zone1_heater_off(self):
        if self.zone1_heater_on:
            self.zone1_heater_on = False
            self.get_logger().info('Turning zone1 heater OFF')

    def turn_zone2_heater_on(self):
        if not self.zone2_heater_on:
            self.zone2_heater_on = True
            self.get_logger().info('Turning zone2 heater ON')

    def turn_zone2_heater_off(self):
        if self.zone2_heater_on:
            self.zone2_heater_on = False
            self.get_logger().info('Turning zone2 heater OFF')

    def turn_zone1_humidifier_on(self):
        if not self.zone1_humidifier_on:
            self.zone1_humidifier_on = True
            self.get_logger().info('Turning zone1 humidifier ON')
            self.control_output(self.zone1_output_addr, True)
            self.ros2_thread.left_steam_status_updated.emit(1)

    def turn_zone1_humidifier_off(self):
        if self.zone1_humidifier_on:
            self.zone1_humidifier_on = False
            self.get_logger().info('Turning zone1 humidifier OFF')
            self.control_output(self.zone1_output_addr, False)
            self.ros2_thread.left_steam_status_updated.emit(0)

    def turn_zone2_humidifier_on(self):
        if not self.zone2_humidifier_on:
            self.zone2_humidifier_on = True
            self.get_logger().info('Turning zone2 humidifier ON')
            self.control_output(self.zone2_output_addr, True)
            self.ros2_thread.right_steam_status_updated.emit(1)


    def turn_zone2_humidifier_off(self):
        if self.zone2_humidifier_on:
            self.zone2_humidifier_on = False
            self.get_logger().info('Turning zone2 humidifier OFF')
            self.control_output(self.zone2_output_addr, False)
            self.ros2_thread.right_steam_status_updated.emit(0)

    @staticmethod
    def create_tables(cursor):
      # 创建温度传感器表
      for i in range(1, 5):
          cursor.execute(f'''
          CREATE TABLE IF NOT EXISTS temperature_sensor_{i} (
              timestamp TEXT PRIMARY KEY,
              value REAL
          )
          ''')
      
      # 创建湿度传感器表
      for i in range(1, 5):
          cursor.execute(f'''
          CREATE TABLE IF NOT EXISTS humidity_sensor_{i} (
              timestamp TEXT PRIMARY KEY,
              value REAL
          )
          ''')

    @staticmethod
    def table_exists(cursor, table_name):
        cursor.execute(f"""
        SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'
        """)
        return cursor.fetchone() is not None

    @staticmethod
    def initialize_database(db_name):
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        # 检查并创建表
        tables = [f'temperature_sensor_{i}' for i in range(1, 5)] + [f'humidity_sensor_{i}' for i in range(1, 5)]
        tables_to_create = [table for table in tables if not SensorSubscriberNode.table_exists(cursor, table)]

        if tables_to_create:
            print(f"Creating tables: {', '.join(tables_to_create)}")
            SensorSubscriberNode.create_tables(cursor)
        else:
            print("All tables already exist.")

        conn.commit()
        return conn, cursor

    @staticmethod
    def save_data_to_db(cursor, sensor_data):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # 格式化为 'YYYY-MM-DD HH:MM:SS'
        for sensor, value in sensor_data:
            if '温度传感器' in sensor:
                sensor_num = sensor[-1]
                if value != '未知':
                    value = float(value[:-2])  # 移除 '°C' 并转换为浮点数
                    cursor.execute(f'''
                    INSERT OR REPLACE INTO temperature_sensor_{sensor_num}
                    (timestamp, value) VALUES (?, ?)
                    ''', (timestamp, value))
            elif '湿度传感器' in sensor:
                sensor_num = sensor[-1]
                if value != '未知':
                    value = float(value[:-1])  # 移除 '%' 并转换为浮点数
                    cursor.execute(f'''
                    INSERT OR REPLACE INTO humidity_sensor_{sensor_num}
                    (timestamp, value) VALUES (?, ?)
                    ''', (timestamp, value))

    def export_tables_to_excel(self, db_name):
        # 检查并获取U盘挂载点
        usb_mount = SensorSubscriberNode.check_and_find_usb_drive()
        if not usb_mount:
            self.ros2_thread.export_completed.emit(0)  # 发射信号
            return

        # 连接到数据库
        conn = sqlite3.connect(db_name)

        # 获取所有表名
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        # 生成带有当前时间的中文文件名
        current_time = datetime.now().strftime("%Y年%m月%d日_%H时%M分%S秒")
        excel_file = os.path.join(usb_mount, f'{current_time}_传感器数据导出.xlsx')

        try:
            with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
                for table in tables:
                    table_name = table[0]
                    # 读取表数据到DataFrame
                    df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
                    
                    # 翻译表名
                    if 'temperature_sensor_1' in table_name:
                        translated_table_name = '左侧温度传感器1'
                    elif 'temperature_sensor_2' in table_name:
                        translated_table_name = '左侧温度传感器2'
                    elif 'temperature_sensor_3' in table_name:
                        translated_table_name = '右侧温度传感器3'
                    elif 'temperature_sensor_4' in table_name:
                        translated_table_name = '右侧温度传感器4'
                    elif 'humidity_sensor_1' in table_name:
                        translated_table_name = '左侧湿度传感器1'
                    elif 'humidity_sensor_2' in table_name:
                        translated_table_name = '左侧湿度传感器2'
                    elif 'humidity_sensor_3' in table_name:
                        translated_table_name = '右侧湿度传感器3'
                    elif 'humidity_sensor_4' in table_name:
                        translated_table_name = '右侧湿度传感器4'
                    else:
                        translated_table_name = table_name
                    
                    # 翻译列名
                    df.rename(columns={'timestamp': '时间戳', 'value': '数值'}, inplace=True)
                    
                    # 将DataFrame写入Excel的一个工作表
                    df.to_excel(writer, sheet_name=translated_table_name, index=False)

            print(f"数据已导出到U盘: {excel_file}")
        except Exception as e:
            print(f"导出数据到U盘时发生错误: {e}")
        finally:
            conn.close()
            self.ros2_thread.export_completed.emit(1)  # 发射信号

    @staticmethod
    def check_and_find_usb_drive():
        context = pyudev.Context()
        removable = [device for device in context.list_devices(subsystem='block', DEVTYPE='disk')
                    if device.attributes.asstring('removable') == "1"]
        
        if not removable:
            print("没有检测到可移动设备")
            return None

        print(f"检测到 {len(removable)} 个可移动设备")

        for device in removable:
            print(f"检查设备: {device.device_node}")
            
            # 检查设备本身是否已挂载
            mountpoint = SensorSubscriberNode.get_mountpoint(device.device_node)
            if mountpoint:
                print(f"设备 {device.device_node} 已挂载于 {mountpoint}")
                return mountpoint

            # 检查设备的分区
            partitions = [part for part in device.children if part.get('DEVTYPE') == 'partition']
            print(f"设备 {device.device_node} 有 {len(partitions)} 个分区")
            
            for partition in partitions:
                print(f"检查分区: {partition.device_node}")
                mountpoint = partition.get('MOUNTPOINT')
                if not mountpoint:
                    mountpoint = SensorSubscriberNode.get_mountpoint(partition.device_node)
                
                if mountpoint:
                    print(f"分区 {partition.device_node} 已挂载于 {mountpoint}")
                    return mountpoint
                else:
                    print(f"分区 {partition.device_node} 未挂载")

        print("没有找到已挂载的 U 盘分区")
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
            print("未检测到已挂载的 U 盘")
            return False

        try:
            if not os.path.exists(file_path):
                print(f"源文件不存在: {file_path}")
                return False

            file_name = os.path.basename(file_path)
            destination = os.path.join(usb_mount, file_name)

            shutil.copy2(file_path, destination)
            print(f"文件已成功复制到 U 盘: {destination}")
            return True
        except Exception as e:
            print(f"复制文件时发生错误: {e}")
            return False


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ros2_thread = ROS2Thread()
    ex = IndustrialControlPanel(ros2_thread)
    ros2_thread.data_updated.connect(ex.update_sensor_data)
    ros2_thread.limit_settings.connect(ros2_thread.process_limit_settings)
    ros2_thread.recover_limit_settings.connect(ex.receive_limit_settings)
    ros2_thread.mode_chosen.connect(ros2_thread.process_mode_chosen)
    ros2_thread.export_completed.connect(ex.show_export_completed_dialog)
    ros2_thread.left_steam_status_updated.connect(ex.update_left_steam_status)
    ros2_thread.right_steam_status_updated.connect(ex.update_right_steam_status)
    ros2_thread.start()

    def signal_handler(sig, frame):
        print("SIGINT received. Shutting down gracefully...")
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