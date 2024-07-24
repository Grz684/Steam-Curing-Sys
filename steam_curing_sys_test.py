from PyQt5.QtCore import QThread, pyqtSignal, QTimer
import random
from PyQt5.QtWidgets import QApplication
from steam_curing_sys_UI import IndustrialControlPanel
import sys

class SensorDataThread(QThread):
    # pyqtSignal必须是类属性
    limit_settings = pyqtSignal(float, float, float, float)
    data_updated = pyqtSignal(list)
    mode_chosen = pyqtSignal(int)
    def __init__(self, parent=None):
        super().__init__(parent)
        self.running = True

    def run(self):
        while self.running:
            sensor_data = [
                ('温度传感器1', f'{30 + random.randint(-5, 5)}°C'),
                ('温度传感器2', f'{30 + random.randint(-5, 5)}°C'),
                ('温度传感器3', f'{30 + random.randint(-5, 5)}°C'),
                ('温度传感器4', f'{30 + random.randint(-5, 5)}°C'),
                ('湿度传感器1', f'{80 + random.randint(-10, 10)}%'),
                ('湿度传感器2', f'{80 + random.randint(-10, 10)}%'),
                ('湿度传感器3', f'{80 + random.randint(-10, 10)}%'),
                ('湿度传感器4', f'{80 + random.randint(-10, 10)}%')
            ]
            self.data_updated.emit(sensor_data)
            self.msleep(1000)

    def stop(self):
        self.running = False

    def process_limit_settings(self, temp_upper, temp_lower, humidity_upper, humidity_lower):
        # 在工作线程中处理接收到的限制设置
        print(f"Worker received: Temp {temp_lower}-{temp_upper}°C, Humidity {humidity_lower}-{humidity_upper}%")

    def process_mode_chosen(self, mode):
        # 在工作线程中处理接收到的模式选择
        print(f"Worker received: Mode {mode}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    sensor_thread = SensorDataThread()
    ex = IndustrialControlPanel(sensor_thread)
    sensor_thread.data_updated.connect(ex.update_sensor_data)
    sensor_thread.limit_settings.connect(sensor_thread.process_limit_settings)
    sensor_thread.mode_chosen.connect(sensor_thread.process_mode_chosen)
    sensor_thread.start()

    ex.showFullScreen()
    app.exec_()

    sensor_thread.stop()
    sensor_thread.wait()

    sys.exit()