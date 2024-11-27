import sqlite3
from datetime import datetime

class SensorAdjustmentDB:
    def __init__(self, db_name="sensor_data.db"):
        self.db_name = db_name
        self.create_table()

    def get_connection(self):
        """创建数据库连接"""
        return sqlite3.connect(self.db_name)

    def create_table(self):
        """创建传感器调整数据表"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sensor_adjustments (
                    sensor_id TEXT PRIMARY KEY,
                    sensor_type TEXT NOT NULL,
                    adjustment_type TEXT NOT NULL,
                    value REAL NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
        except Exception as e:
            print(f"Error creating table: {str(e)}")
        finally:
            conn.close()

    def save_adjustment(self, payload):
        """保存或更新传感器调整数据"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            # 准备数据
            sensor_id = payload['sensorId']
            sensor_type = payload['sensorType']
            adjustment_type = payload['adjustmentType']
            value = payload['value']
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # 使用REPLACE INTO实现upsert操作
            cursor.execute('''
                REPLACE INTO sensor_adjustments 
                (sensor_id, sensor_type, adjustment_type, value, updated_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (sensor_id, sensor_type, adjustment_type, value, current_time))
            
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error saving adjustment: {str(e)}")
            return False
        finally:
            conn.close()

    def get_adjustment(self, sensor_id):
        """获取特定传感器的调整数据"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT sensor_id, sensor_type, adjustment_type, value, updated_at
                FROM sensor_adjustments
                WHERE sensor_id = ?
            ''', (sensor_id,))
            
            result = cursor.fetchone()
            if result:
                return {
                    'sensor_id': result[0],
                    'sensor_type': result[1],
                    'adjustment_type': result[2],
                    'value': result[3],
                    'updated_at': result[4]
                }
            return None
            
        except Exception as e:
            print(f"Error getting adjustment: {str(e)}")
            return None
        finally:
            conn.close()

    def get_all_adjustments(self):
        """获取所有传感器的调整数据"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT sensor_id, sensor_type, adjustment_type, value, updated_at
                FROM sensor_adjustments
            ''')
            
            results = cursor.fetchall()
            adjustments = []
            for row in results:
                adjustments.append({
                    'sensor_id': row[0],
                    'sensor_type': row[1],
                    'adjustment_type': row[2],
                    'value': row[3]
                })
            return adjustments
            
        except Exception as e:
            print(f"Error getting all adjustments: {str(e)}")
            return []
        finally:
            conn.close()