from datetime import datetime
import os
import sqlite3
from threading import Thread
import time
import pandas as pd


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