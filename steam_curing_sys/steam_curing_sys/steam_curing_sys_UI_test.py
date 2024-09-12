import sys
import os
import json
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtCore import QObject, pyqtSlot, QUrl, pyqtSignal
from PyQt5.QtWebEngineWidgets import QWebEngineSettings
from PyQt5.QtGui import QKeySequence
from PyQt5.QtWidgets import QShortcut, QSizePolicy
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Bridge(QObject):
    messageSignal = pyqtSignal(str)
    ControlAutoMode = pyqtSignal(bool)
    IsSystemStarted = pyqtSignal(bool)
    steamEngineState = pyqtSignal(dict)
    limitSettingsUpdated = pyqtSignal(float, float, float, float)  # 新增信号
    sprinkerSettingsUpdated = pyqtSignal(dict)
    def __init__(self):
        super().__init__()
        print("Bridge object initialized")
        self.is_vue_ready = False
        self.queue = []

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
        # print(f"Method name: {method_name}")
        # print(f"Arguments: {args_json}")
        
        try:
            args = json.loads(args_json)
            if method_name == "updateLimitSettings":
                self.updateLimitSettings(args)
            elif method_name == "updateSprinklerSettings":
                self.updateSprinklerSettings(args)
            elif method_name == "sendMessage":
                self.sendMessage(args)
            elif method_name == "setControlMode":
                self.setControlMode(args)
            elif method_name == "setEngineState":
                self.setSteamEngineState(args)
            elif method_name == "startSystem":
                self.startSystem(args)
            else:
                print(f"Unknown method: {method_name}")
        except json.JSONDecodeError:
            print(f"Failed to parse JSON: {args_json}")
        except Exception as e:
            print(f"Error processing method {method_name}: {str(e)}")

    def updateLimitSettings(self, settings):
        print(f"Updating settings: {settings}")
        temp_upper = settings.get('temp_upper', 0.0)
        temp_lower = settings.get('temp_lower', 0.0)
        humidity_upper = settings.get('humidity_upper', 0.0)
        humidity_lower = settings.get('humidity_lower', 0.0)
        self.limitSettingsUpdated.emit(temp_upper, temp_lower, humidity_upper, humidity_lower)  # 发射信号

    def updateSprinklerSettings(self, settings):
        print(f"Updating sprinkler settings: {settings}")
        self.sprinkerSettingsUpdated.emit(settings)

    def startSystem(self, flag):
        print(f"Start system: {flag}")
        self.IsSystemStarted.emit(flag)

    def sendMessage(self, message):
        print(f"Received message: {message}")

    def setControlMode(self, mode):
        print(f"Control mode: {mode}")
        auto_mode = (mode['mode'] == 'auto')
        if auto_mode:
            self.ControlAutoMode.emit(True)
        else:
            self.ControlAutoMode.emit(False)

    def setSteamEngineState(self, state):
        print(f"Steam engine state: {state}")
        self.steamEngineState.emit(state)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PyQt with Vue Demo")
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
        self.dev_view = QWebEngineView()
        self.web_view.page().setDevToolsPage(self.dev_view.page())
        self.web_view.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

        # 添加快捷键来切换开发者工具
        self.shortcut = QShortcut(QKeySequence("F12"), self)
        self.shortcut.activated.connect(self.toggle_dev_tools)

        # Load HTML file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        html_path = os.path.join(parent_dir, 'steam-curing-sys-ui', 'dist', 'index.html')
        self.web_view.load(QUrl.fromLocalFile(html_path))

        self.web_view.loadFinished.connect(self.onLoadFinished)

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

    def update_left_steam_status(self, status):
        msg_type = "update_left_steam_status"
        # status为bool类型
        self.bridge.send_message(msg_type, status)

    def update_right_steam_status(self, status):
        msg_type = "update_right_steam_status"
        self.bridge.send_message(msg_type, status)

    def toggle_dev_tools(self):
        if self.dev_view.isVisible():
            self.dev_view.hide()
        else:
            self.dev_view.show()

    def onLoadFinished(self, ok):
        if ok:
            print("PyQt: Page loaded successfully")
            self.web_view.page().runJavaScript("console.log('JavaScript is working'); window.pyqtReady = true;")
        else:
            print("PyQt: Failed to load page")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())