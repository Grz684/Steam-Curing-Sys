from rclpy.node import Node
from std_srvs.srv import Trigger  # Add this import
import sqlite3
from datetime import datetime
from datetime import timedelta
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SensorSubscriberNode(Node):
    def __init__(self, qtSignalHandler):
        Node.__init__(self, 'sensor_subscriber')
        self.qtSignalHandler = qtSignalHandler
        self.sensor_num = qtSignalHandler.sensor_num
        
        self.temp_data = {f'temperature_sensor_{i}': -1 for i in range(1, self.sensor_num + 1)}  # 修改为 16 个传感器
        self.humidity_data = {f'humidity_sensor_{i}': -1 for i in range(1, self.sensor_num + 1)}  # 修改为 16 个传感器

        self.db_name = 'sensor_data.db'
        self.conn, self.cursor = self.initialize_database(self.db_name)

        self.save_to_db_count = 0

        self.cli = self.create_client(Trigger, 'get_sensor_data')

        self.timer = self.create_timer(5.0, self.timer_callback)

        self.dolly_timer = self.create_timer(2.0, self.dolly_timer_callback)
        self.sprinkler_timer = self.create_timer(2.0, self.sprinkler_timer_callback)
        self.steam_timer = self.create_timer(2.0, self.steam_timer_callback)

        self.control_utils = self.qtSignalHandler.control_utils

        # Store previous states
        self.previous_states = [False, False]

        # Create timer, calling every 0.5 seconds
        # self.read_input_timer = self.create_timer(0.5, self.read_input_timer_callback)

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

    def steam_timer_callback(self):
        if self.qtSignalHandler.get_steam_system_state():
            updated_temp_data = {sensor: value for sensor, value in self.temp_data.items() if value != -1}
            updated_humidity_data = {sensor: value for sensor, value in self.humidity_data.items() if value != -1}

            if updated_temp_data or updated_humidity_data:
                self.process_steam_data(updated_temp_data)

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
                result = self.control_utils.control_tank(True)
                self.control_utils.turn_zone1_humidifier_on()
                if result:
                    self.qtSignalHandler.left_steam_status_updated.emit(True)
                # self.control_utils.turn_zone2_humidifier_on()
                # if result:
                #     self.qtSignalHandler.right_steam_status_updated.emit(True)
            elif all(humidity > self.qtSignalHandler.humidity_upper_limit for humidity in humidity_data.values()):
                # 关闭两水泵
                result = self.control_utils.control_tank(False)
                self.control_utils.turn_zone1_humidifier_off()
                if result:
                    self.qtSignalHandler.left_steam_status_updated.emit(False)
                # self.control_utils.turn_zone2_humidifier_off()
                # if result:
                #     self.qtSignalHandler.right_steam_status_updated.emit(False)

    def process_steam_data(self, temp_data):
        if temp_data:
            if any(temp < self.qtSignalHandler.temp_lower_limit for temp in temp_data.values()):
                self.control_utils.turn_zone2_humidifier_on()
                self.qtSignalHandler.right_steam_status_updated.emit(True)
            elif all(temp > self.qtSignalHandler.temp_upper_limit for temp in temp_data.values()):
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

    def read_input_timer_callback(self):
        current_states = self.control_utils.read_input()
        
        # Check if states have changed
        if current_states:
            for i, (prev, curr) in enumerate(zip(self.previous_states, current_states)):
                if prev != curr:
                    side = "Left" if i == 0 else "Right"
                    status = "Water shortage" if curr else "Water shortage resolved"
                    message = f"{side} side: {status}"
                    self.process_water_protection_status(message)
            
            # Update states
            self.previous_states = current_states
        else:
            # read_input raise了错误，但read_input_timer_callback会被执行一次然后节点才会停止
            # logger.error("光耦输入无返回值")
            pass

    def timer_callback(self):
        # self.get_logger().info('开始请求数据...')
        request = Trigger.Request()

        # 异步调用服务
        future = self.cli.call_async(request)
        future.add_done_callback(self.service_response_callback)

    def adjust_data(self):
        temp_adjust, humidity_adjust = self.qtSignalHandler.read_sensor_data_adjustments()
        
        # 处理温度数据
        for index, sensor in enumerate(self.temp_data):
            if sensor not in temp_adjust:
                continue
                
            adjustment = temp_adjust[sensor]
            if adjustment["type"] == "value":
                self.temp_data[sensor] = adjustment["value"]
            elif self.temp_data[sensor] != -1 and adjustment["type"] == "offset":
                self.temp_data[sensor] += adjustment["value"]
        
        # 处理湿度数据
        for index, sensor in enumerate(self.humidity_data):
            if sensor not in humidity_adjust:
                continue
                
            adjustment = humidity_adjust[sensor]
            if adjustment["type"] == "value":
                self.humidity_data[sensor] = adjustment["value"]
            elif self.humidity_data[sensor] != -1 and adjustment["type"] == "offset":
                self.humidity_data[sensor] += adjustment["value"]

    def service_response_callback(self, future):
        try:
            response = future.result()  # 获取服务的响应
            if response.success:
                data = json.loads(response.message)
                
                self.temp_data = data["temperatures"]
                self.humidity_data = data["humidities"]

                # logger.info(f'温度: {data["temperatures"]}, 湿度: {data["humidities"]}')

                self.adjust_data()
                # self.get_logger().info('接收到传感器数据:')
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
        if self.sensor_num == 15:
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_data (
                timestamp TEXT PRIMARY KEY,
                temp_1 REAL, temp_2 REAL, temp_3 REAL, temp_4 REAL,
                temp_5 REAL, temp_6 REAL, temp_7 REAL, temp_8 REAL,
                temp_9 REAL, temp_10 REAL, temp_11 REAL, temp_12 REAL,
                temp_13 REAL, temp_14 REAL, temp_15 REAL,
                hum_1 REAL, hum_2 REAL, hum_3 REAL, hum_4 REAL,
                hum_5 REAL, hum_6 REAL, hum_7 REAL, hum_8 REAL,
                hum_9 REAL, hum_10 REAL, hum_11 REAL, hum_12 REAL,
                hum_13 REAL, hum_14 REAL, hum_15 REAL
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