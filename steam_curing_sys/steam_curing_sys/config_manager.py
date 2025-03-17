import logging
from datetime import datetime
import sqlite3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConfigManager:
    def __init__(self, db_file='sensor_data.db'):
        self.db_file = db_file
        self.conn = None
        self.cursor = None
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
            'left_dolly_single_run_time': 'REAL',
            'left_dolly_run_interval_time': 'REAL',
            'right_dolly_single_run_time': 'REAL',
            'right_dolly_run_interval_time': 'REAL',
            'device_status': 'TEXT',
            'device_random_code': 'TEXT',
            'device_lock_count': 'INTEGER',
            'device_base_time': 'INTEGER',
            'temp_adjust': 'REAL',
            'humidity_adjust': 'REAL',
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

    def update_config(self, **kwargs):
        current_time = datetime.now().isoformat()
        kwargs['timestamp'] = current_time

        self.cursor.execute('SELECT * FROM config')
        if self.cursor.fetchone() is None:
            # If table is empty, insert a new row
            columns = ', '.join(kwargs.keys())
            placeholders = ', '.join('?' * len(kwargs))
            query = f'INSERT INTO config ({columns}) VALUES ({placeholders})'
        else:
            # If row exists, update it
            set_clause = ', '.join([f"{key} = ?" for key in kwargs.keys()])
            query = f'UPDATE config SET {set_clause}'

        self.cursor.execute(query, tuple(kwargs.values()))
        self.conn.commit()

    def get_config(self, key, default=None):
        self.cursor.execute(f'SELECT {key} FROM config')
        result = self.cursor.fetchone()
        return result[0] if result else default

    def get_multiple_config(self, keys):
        keys_str = ', '.join(keys)
        self.cursor.execute(f'SELECT {keys_str} FROM config')
        result = self.cursor.fetchone()
        if result:
            return {key: value for key, value in zip(keys, result) if value is not None}
        return {}

    def update_multiple_config(self, config_dict):
        self.update_config(**config_dict)

    def get_all_config(self):
        self.cursor.execute('SELECT * FROM config')
        result = self.cursor.fetchone()
        if result:
            columns = [description[0] for description in self.cursor.description]
            return {key: value for key, value in zip(columns, result) if value is not None}
        return {}

    def get_last_update_time(self):
        self.cursor.execute('SELECT timestamp FROM config')
        result = self.cursor.fetchone()
        return result[0] if result else None

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