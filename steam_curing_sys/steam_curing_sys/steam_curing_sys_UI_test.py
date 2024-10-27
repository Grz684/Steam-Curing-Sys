import sys
import os
import json
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtCore import QObject, pyqtSlot, QUrl, pyqtSignal
from PyQt5.QtGui import QKeySequence
from PyQt5.QtWidgets import QShortcut, QSizePolicy
import logging

from PyQt5.QtGui import QFont
from PyQt5.QtCore import Qt

from PyQt5.QtWidgets import (
    QLabel, QPushButton, QDesktopWidget, QDialog
)
from .mqtt_client import MQTTClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Bridge(QObject):
    messageSignal = pyqtSignal(str)
    steamEngineState = pyqtSignal(dict)
    limitSettingsUpdated = pyqtSignal(float, float, float, float)  # 新增信号
    sprinklerSystemControl = pyqtSignal(dict)
    dollyControl = pyqtSignal(dict)
    dataExport = pyqtSignal(bool)
    lockPasswordCheck = pyqtSignal(dict)
    activateDevice = pyqtSignal()
    updataBaseTime = pyqtSignal(str)
    adjustSettingsSaved = pyqtSignal(dict)

    def __init__(self):
        super().__init__()
        logger.info("Bridge object initialized")
        self.is_vue_ready = False
        self.queue = []
        self.mqtt_client = MQTTClient(self)
        self.mqtt_client.start()

    @pyqtSlot()
    def vueReady(self):
        self.is_vue_ready = True
        self.sendQueuedMessages()

    def sendQueuedMessages(self):
        for message in self.queue:
            self.messageSignal.emit(message)
        self.queue.clear()
    
    @pyqtSlot(str, str)
    def send_message(self, msg_type, content):
        message = json.dumps({"type": msg_type, "content": content})
        if self.is_vue_ready:
            self.messageSignal.emit(message)
        else:
            self.queue.append(message)

    @pyqtSlot(str, str)
    def sendToPyQt(self, method_name, args_json):
        # logger.info(f"Method name: {method_name}")
        # logger.info(f"Arguments: {args_json}")
        
        try:
            args = json.loads(args_json)
            if method_name == "updateLimitSettings":
                self.updateLimitSettings(args)
            elif method_name == "sendMessage":
                self.sendMessage(args)
            elif method_name == "setEngineState":
                self.setSteamEngineState(args)
            elif method_name == "controlDolly":
                self.controlDolly(args)
            elif method_name == "tempControlDolly":
                self.tempControlDolly(args)
            elif method_name == "controlSprinkler":
                self.controlSprinkler(args)
            elif method_name == "exportData":
                self.exportData(args)
            elif method_name == "check_lock_password":
                self.check_lock_password(args)
            elif method_name == "activate_device":
                self.activate_device()
            elif method_name == "CartSystem_init_response":
                self.cartSystem_init_response(args)
            elif method_name == "SensorSettings_init_response":
                self.sensorSettings_init_response(args)
            elif method_name == "IntegratedControlSystem_init_response":
                self.integratedControlSystem_init_response(args)
            elif method_name == "Lock_init_response":
                self.lock_init_response(args)
            elif method_name == "IntegratedControlSystem_set_response":
                self.integratedControlSystem_set_response(args)
            elif method_name == "Lock_set_response":
                self.lock_set_response(args)
            elif method_name == "update_remote_sensor_data":
                self.update_remote_sensor_data(args)
            elif method_name == "update_baseTime":
                self.update_baseTime(args)
            elif method_name == "saveAdjustSettings":
                self.saveAdjustSettings(args)
            elif method_name == "DataExport_init_response":
                self.dataExport_init_response(args)
            else:
                logger.info(f"Unknown method: {method_name}")
        except json.JSONDecodeError:
            logger.info(f"Failed to parse JSON: {args_json}")
        except Exception as e:
            logger.info(f"Error processing method {method_name}: {str(e)}")

    def dataExport_init_response(self, response):
        logger.info(f"Data export init response: {response}")
        self.mqtt_client.publish(json.dumps({"command": "DataExport_init_response", "data": response}))

    def saveAdjustSettings(self, args):
        logger.info(f"Save adjust settings: {args}")
        self.adjustSettingsSaved.emit(args)
        self.mqtt_client.publish(json.dumps({"command": "saveAdjustSettings", "data": args}))

    def update_baseTime(self, baseTime):
        logger.info(f"Update baseTime: {baseTime}")
        self.updataBaseTime.emit(str(baseTime))

    def lock_set_response(self, response):
        # logger.info(f"Lock set response: {response}")
        self.mqtt_client.publish(json.dumps({"command": "Lock_set_response", "data": response}))

    def lock_init_response(self, response):
        # logger.info(f"Lock init response: {response}")
        self.mqtt_client.publish(json.dumps({"command": "Lock_init_response", "data": response}))

    def sensorSettings_init_response(self, response):
        # logger.info(f"SensorSettings init response: {response}")
        self.mqtt_client.publish(json.dumps({"command": "update_limit_settings", "data": response}))

    def integratedControlSystem_set_response(self, response):
        # logger.info(f"IntegratedControlSystem set response: {response}")
        self.mqtt_client.publish(json.dumps({"command": "IntegratedControlSystem_set_response", "data": response}))

    def cartSystem_init_response(self, response):
        # logger.info(f"CartSystem init response: {response}")
        self.mqtt_client.publish(json.dumps({"command": "CartSystem_init_response", "data": response}))

    def integratedControlSystem_init_response(self, response):
        # logger.info(f"IntegratedControlSystem init response: {response}")
        self.mqtt_client.publish(json.dumps({"command": "IntegratedControlSystem_init_response", "data": response}))

    def update_remote_sensor_data(self, sensor_data):
        # logger.info(f"Update remote sensor data: {sensor_data}")
        self.mqtt_client.publish(json.dumps({"command": "update_remote_sensor_data", "data": sensor_data}))

    def activate_device(self):
        logger.info("Activate device")
        self.activateDevice.emit()

    def check_lock_password(self, args):
        logger.info(f"Check lock password: {args}")
        self.lockPasswordCheck.emit(args)

    def exportData(self, args):
        self.dataExport.emit(args)

    def controlDolly(self, args):
        logger.info(f"Control dolly: {args}")
        self.dollyControl.emit(args)
        # 同步远程dolly控制指令
        self.mqtt_client.publish(json.dumps({"command": "control_dolly", "data": args}))

    def tempControlDolly(self, args):
        logger.info(f"Temp control dolly: {args}")
        self.dollyControl.emit(args)
        # 这里不发指令，区分于controlDolly

    def controlSprinkler(self, args):
        logger.info(f"Control sprinkler: {args}")
        self.sprinklerSystemControl.emit(args)
        # 同步远程sprinkler控制指令
        if args.get('target') == 'settings':
            self.mqtt_client.publish(json.dumps({"command": "SprinklerSettings_set_response", "data": args.get('settings')}))

    def updateLimitSettings(self, settings):
        logger.info(f"Updating settings: {settings}")
        temp_upper = settings.get('temp_upper', 0.0)
        temp_lower = settings.get('temp_lower', 0.0)
        humidity_upper = settings.get('humidity_upper', 0.0)
        humidity_lower = settings.get('humidity_lower', 0.0)
        self.limitSettingsUpdated.emit(temp_upper, temp_lower, humidity_upper, humidity_lower)  # 发射信号
        # 同步远程温湿度设置
        self.mqtt_client.publish(json.dumps({"command": "update_limit_settings", "data": settings}))

    def sendMessage(self, message):
        logger.info(f"Received message: {message}")

    def setSteamEngineState(self, state):
        logger.info(f"Steam engine state: {state}")
        self.steamEngineState.emit(state)

class ExportProgressDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("导出进行中")
        self.setFixedSize(400, 200)  # 设置对话框的固定大小

        layout = QVBoxLayout()

        self.label = QLabel("正在导出数据到U盘,请稍候...")
        self.label.setAlignment(Qt.AlignCenter)
        
        # 设置标签的字体
        font = self.label.font()
        font.setPointSize(16)  # 设置字体大小为20
        self.label.setFont(font)

        layout.addWidget(self.label)

        self.setLayout(layout)

    def closeEvent(self, event):
        event.accept()

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PyQt with Vue Demo")
        # 设置窗口始终在最上层
        self.setWindowFlags(Qt.WindowStaysOnTopHint)
        # 设置为全屏
        self.showFullScreen()
        # self.setGeometry(100, 100, 1280, 720)

        layout = QVBoxLayout()
        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.web_view = QWebEngineView()
        layout.addWidget(self.web_view)

        # 设置布局的边距为0
        layout.setContentsMargins(0, 0, 0, 0)

        self.channel = QWebChannel()
        self.bridge = Bridge()

        self.channel.registerObject("bridge", self.bridge)
        self.web_view.page().setWebChannel(self.channel)

        # 使用 setDevToolsPage 来启用开发者工具
        # self.dev_view = QWebEngineView()
        # self.web_view.page().setDevToolsPage(self.dev_view.page())
        # self.web_view.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

        # 添加快捷键来切换开发者工具
        # self.shortcut = QShortcut(QKeySequence("F12"), self)
        # self.shortcut.activated.connect(self.toggle_dev_tools)

        # Load HTML file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        html_path = os.path.join(current_dir, 'steam-curing-sys-ui', 'dist', 'index.html')
        self.web_view.load(QUrl.fromLocalFile(html_path))

        self.web_view.loadFinished.connect(self.onLoadFinished)

        self.export_progress_dialog = None

    def update_device_info(self, device_info):
        msg_type = "device_info"
        logger.info(f"Send device info: {device_info}")
        self.bridge.send_message(msg_type, json.dumps(device_info))

    def update_adjust_settings(self, settings):
        msg_type = "update_adjust_settings"
        logger.info(f"Send adjust settings: {settings}")
        self.bridge.send_message(msg_type, json.dumps(settings))

    def device_activated(self, response):
        msg_type = "device_activated"
        logger.info(f"Send device activated response: {response}")
        self.bridge.send_message(msg_type, json.dumps(response))
    
    def close_export_progress(self):
        if self.export_progress_dialog and self.export_progress_dialog.isVisible():
            self.export_progress_dialog.close()

    def show_export_progress(self):
        self.close_export_progress()  # 先关闭已有的对话框
        self.export_progress_dialog = ExportProgressDialog(self)
        self.export_progress_dialog.show()

    def show_export_completed_dialog(self, success):
        self.close_export_progress()
        dialog = QDialog(self)
        dialog.setWindowTitle("提示消息")
        
        # 获取屏幕尺寸
        screen = QDesktopWidget().screenNumber(QDesktopWidget().cursor().pos())
        screen_size = QDesktopWidget().screenGeometry(screen).size()
        
        # 设置对话框大小为屏幕的四分之一
        dialog_width = screen_size.width() // 2
        dialog_height = screen_size.height() // 2
        dialog.resize(dialog_width, dialog_height)

        layout = QVBoxLayout()

        # 创建并设置消息标签
        if success == 1:
            message_label = QLabel("数据已成功导出")
        elif success == 0:
            message_label = QLabel("未检测到U盘，请插入U盘")
        elif success == -2:
            message_label = QLabel("数据导出失败，请重试")
        elif success == -1:
            message_label = QLabel("数字继电器模块未插入，系统故障")
            dialog.setWindowFlags(Qt.Dialog | Qt.WindowStaysOnTopHint | Qt.FramelessWindowHint)
        
        message_label.setAlignment(Qt.AlignCenter)
        message_label.setFont(QFont("Arial", 18, QFont.Bold))  # 消息字体大小
        message_label.setStyleSheet("color: #4CAF50;")  # 绿色文本

        # 创建确定按钮（仅在 success 不为 -1 时显示）
        if success != -1:
            ok_button = QPushButton("确定")
            ok_button.setFont(QFont("Arial", 16))  # 增大按钮字体
            ok_button.setStyleSheet("""
                QPushButton {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 5px;
                }
                QPushButton:hover {
                    background-color: #45a049;
                }
            """)
            ok_button.clicked.connect(dialog.accept)

        # 将部件添加到布局中
        layout.addStretch(1)
        layout.addWidget(message_label)
        layout.addStretch(1)
        if success != -1:
            layout.addWidget(ok_button, alignment=Qt.AlignCenter)
            layout.addStretch(1)

        dialog.setLayout(layout)

        # 设置对话框的样式
        dialog.setStyleSheet("""
            QDialog {
                background-color: #f0f0f0;
                border: 2px solid #4CAF50;
                border-radius: 10px;
            }
        """)

        # 显示对话框
        dialog.exec_()

    def update_dolly_state(self, state):
        msg_type = "update_dolly_state"
        self.bridge.send_message(msg_type, state) 

    def update_sensor_data(self, sensor_data):
        # 将 sensor_data 转换为字典
        content = {
            "temperature": {},
            "humidity": {}
        }
        
        for sensor, value in sensor_data:
            if sensor.startswith('温感'):
                content["temperature"][sensor] = value
            elif sensor.startswith('湿感'):
                content["humidity"][sensor] = value

        # 发送消息
        msg_type = "update_sensor_data"
        self.bridge.send_message(msg_type, json.dumps(content))

    def update_water_tank_status(self, status):
        msg_type = "update_water_tank_status"
        self.bridge.send_message(msg_type, json.dumps(status))

    def update_limit_settings(self, temp_upper, temp_lower, humidity_upper, humidity_lower):
        msg_type = "update_limit_settings"
        settings = {
            "temp_upper": temp_upper,
            "temp_lower": temp_lower,
            "humidity_upper": humidity_upper,
            "humidity_lower": humidity_lower
        }
        logger.info(f"Send limit settings: {settings}")
        self.bridge.send_message(msg_type, json.dumps(settings))

    def update_sprinkler_settings(self, settings):
        msg_type = "update_sprinkler_settings"
        logger.info(f"Send sprinkler settings: {settings}")
        self.bridge.send_message(msg_type, json.dumps(settings))

    def update_dolly_settings(self, settings):
        msg_type = "update_dolly_settings"
        logger.info(f"Send dolly settings: {settings}")
        self.bridge.send_message(msg_type, json.dumps(settings))

    def update_left_steam_status(self, status):
        msg_type = "update_left_steam_status"
        # status为bool类型
        self.bridge.send_message(msg_type, status)
        self.bridge.mqtt_client.publish(json.dumps({"command": "update_steam_status", "data": status}))

    def update_right_steam_status(self, status):
        msg_type = "update_right_steam_status"
        self.bridge.send_message(msg_type, status)
        # self.bridge.mqtt_client.publish(json.dumps({"command": "update_right_steam_status", "data": status}))

    def confirm_lock_password(self, result):
        msg_type = "confirm_lock_password"
        self.bridge.send_message(msg_type, json.dumps(result))

    def toggle_dev_tools(self):
        if self.dev_view.isVisible():
            self.dev_view.hide()
        else:
            self.dev_view.show()

    def onLoadFinished(self, ok):
        if ok:
            logger.info("PyQt: Page loaded successfully")
            self.web_view.page().runJavaScript("console.log('JavaScript is working'); window.pyqtReady = true;")
        else:
            logger.info("PyQt: Failed to load page")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())