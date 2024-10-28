import base64
from datetime import datetime
import io
import json
import os
import sqlite3
from threading import Thread
import time
import pandas as pd
import math
import logging
# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExportThread(Thread):
    def __init__(self, db_name, result_queue, sensor_num, usb_mount=None, mqtt_client=None, timeout=30):
        Thread.__init__(self)
        self.db_name = db_name
        self.usb_mount = usb_mount
        self.result_queue = result_queue
        self.timeout = timeout
        self.sensor_num = sensor_num
        self.mqtt_client = mqtt_client
        self.chunk_size = 50000

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
            
            # 如果需要导出到U盘且提供了有效的U盘路径
            if self.usb_mount and os.path.exists(self.usb_mount):
                excel_file = os.path.join(self.usb_mount, f'{current_time}_传感器数据导出.xlsx')
                self.export_with_verification(df, excel_file)
                self.result_queue.put((True, f"数据已成功导出到U盘: {excel_file}"))
                logger.info(f"数据已成功导出到U盘: {excel_file}")

            # 如果需要通过MQTT发送
            if self.mqtt_client:
                self.send_excel_via_mqtt(df, current_time)

        except Exception as e:
            self.result_queue.put((False, f"导出数据时发生错误: {e}"))
            logger.error(f"导出数据时发生错误: {e}")
        finally:
            if conn:
                conn.close()

    def send_excel_via_mqtt(self, df, current_time):
        try:
            # 将DataFrame转换为Excel字节流
            excel_buffer = io.BytesIO()
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='传感器数据', index=False)
            
            excel_bytes = excel_buffer.getvalue()
            filename = f"{current_time}_传感器数据导出.xlsx"
            file_size = len(excel_bytes)
            base64_bytes = base64.b64encode(excel_bytes).decode('utf-8')
            base64_size = len(base64_bytes)
            total_chunks = math.ceil(base64_size / self.chunk_size)

            logger.info(f"原始文件大小: {file_size} 字节")
            logger.info(f"Base64编码后大小: {base64_size} 字节")
            logger.info(f"分片数量: {total_chunks}")

            # 发送文件信息
            file_info = {
                "command": "file_transfer_start",
                "filename": filename,
                "total_chunks": total_chunks,
                "file_size": file_size,
                "base64_size": base64_size  # 添加base64编码后的大小信息
            }
            self.mqtt_client.publish(json.dumps(file_info), "file_transfer/info")

            # 分片发送文件内容
            sent_size = 0
            for i in range(total_chunks):
                start_pos = i * self.chunk_size
                end_pos = min((i + 1) * self.chunk_size, len(base64_bytes))
                chunk = base64_bytes[start_pos:end_pos]
                chunk_size = len(chunk)
                sent_size += chunk_size

                chunk_data = {
                    "command": "file_transfer_chunk",
                    "chunk_number": i + 1,
                    "total_chunks": total_chunks,
                    "filename": filename,
                    "chunk_size": chunk_size,
                    "data": chunk
                }
                self.mqtt_client.publish(json.dumps(chunk_data), "file_transfer/chunk")
                logger.info(f"发送分片 {i+1}/{total_chunks}, 大小: {chunk_size} 字节")
                time.sleep(0.1)

            logger.info(f"总共发送的base64数据大小: {sent_size} 字节")

            complete_msg = {
                "command": "file_transfer_complete",
                "filename": filename,
                "total_sent": sent_size
            }
            self.mqtt_client.publish(json.dumps(complete_msg), "file_transfer/complete")
            
            self.result_queue.put((True, "数据已成功通过MQTT发送"))
            logger.info("数据已成功通过MQTT发送")

        except Exception as e:
            raise Exception(f"MQTT发送文件失败: {e}")

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