import logging
from datetime import datetime
import sqlite3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
            'dolly_run_interval_time': 'REAL',
            'device_status': 'TEXT',
            'device_random_code': 'TEXT',
            'device_lock_count': 'INTEGER',
            'device_base_time': 'DATETIME'
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