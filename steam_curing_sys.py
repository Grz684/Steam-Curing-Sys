import random
import sys
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from PyQt5.QtCore import QThread, pyqtSignal, QTimer
from PyQt5.QtWidgets import QApplication
from steam_curing_sys_UI import IndustrialControlPanel
import sqlite3
from datetime import datetime

class ROS2Thread(QThread):
    # pyqtSignal必须是类属性
    limit_settings = pyqtSignal(float, float, float, float)
    data_updated = pyqtSignal(list)
    mode_chosen = pyqtSignal(int)
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.running = True
        self.mode = 1
        self.temp_lower_limit = 70.0
        self.temp_upper_limit = 80.0
        self.humidity_lower_limit = 80.0
        self.humidity_upper_limit = 90.0
        self.node = None  # 初始化为 None
        
    def run(self):
        rclpy.init()
        self.node = SensorSubscriberNode(self)  # 在这里创建节点
        while self.running and rclpy.ok():
            rclpy.spin_once(self.node, timeout_sec=0.1)
        self.node.destroy_node()
        rclpy.shutdown()
        
    def stop(self):
        self.node.conn.close()
        self.running = False

    def process_limit_settings(self, temp_upper, temp_lower, humidity_upper, humidity_lower):
        # 在工作线程中处理接收到的限制设置
        print(f"Worker received: Temp {temp_lower}-{temp_upper}°C, Humidity {humidity_lower}-{humidity_upper}%")
        self.temp_lower_limit = temp_lower
        self.temp_upper_limit = temp_upper
        self.humidity_lower_limit = humidity_lower
        self.humidity_upper_limit = humidity_upper

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
            print("导出数据")

class SensorSubscriberNode(Node):
    def __init__(self, ros2_thread):
        super().__init__('sensor_subscriber')
        self.ros2_thread = ros2_thread
        
        self.temp_data = {f'temperature_sensor_{i}': -1 for i in range(1, 5)}
        self.humidity_data = {f'humidity_sensor_{i}': -1 for i in range(1, 5)}

        self.heater_on = False
        self.humidifier_on = False

        self.db_name = 'sensor_data.db'
        self.conn, self.cursor = SensorSubscriberNode.initialize_database(self.db_name)
        
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

        self.timer = self.create_timer(1.0, self.timer_callback)

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

            self.turn_heater_on()
            self.turn_humidifier_on()

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
        if updated_temp_data:
            self.process_temperature_data(updated_temp_data)

        updated_humidity_data = {sensor: value for sensor, value in self.humidity_data.items() if value != -1}
        if updated_humidity_data:
            self.process_humidity_data(updated_humidity_data)

        self.temp_data = {sensor: -1 for sensor in self.temp_data}
        self.humidity_data = {sensor: -1 for sensor in self.humidity_data}

    def process_temperature_data(self, data):
        # self.get_logger().info(f'Processing temperature data: {data}')
        if any(temp < self.ros2_thread.temp_lower_limit for temp in data.values()):
            self.turn_heater_on()
        elif all(temp > self.ros2_thread.temp_upper_limit for temp in data.values()):
            self.turn_heater_off()

    def process_humidity_data(self, data):
        # self.get_logger().info(f'Processing humidity data: {data}')
        if any(humidity < self.ros2_thread.humidity_lower_limit for humidity in data.values()):
            self.turn_humidifier_on()
        elif all(humidity > self.ros2_thread.humidity_upper_limit for humidity in data.values()):
            self.turn_humidifier_off()

    def turn_heater_on(self):
        if not self.heater_on:
            self.heater_on = True
            self.get_logger().info('Turning heater ON')

    def turn_heater_off(self):
        if self.heater_on:
            self.heater_on = False
            self.get_logger().info('Turning heater OFF')

    def turn_humidifier_on(self):
        if not self.humidifier_on:
            self.humidifier_on = True
            self.get_logger().info('Turning humidifier ON')

    def turn_humidifier_off(self):
        if self.humidifier_on:
            self.humidifier_on = False
            self.get_logger().info('Turning humidifier OFF')

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

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ros2_thread = ROS2Thread()
    ex = IndustrialControlPanel(ros2_thread)
    ros2_thread.data_updated.connect(ex.update_sensor_data)
    ros2_thread.limit_settings.connect(ros2_thread.process_limit_settings)
    ros2_thread.mode_chosen.connect(ros2_thread.process_mode_chosen)
    ros2_thread.start()

    ex.showFullScreen()
    app.exec_()

    ros2_thread.stop()
    ros2_thread.wait()

    sys.exit()