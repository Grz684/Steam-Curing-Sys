import sys
import os
import json
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtCore import QObject, pyqtSlot, QUrl
from PyQt5.QtWebEngineWidgets import QWebEngineSettings
from PyQt5.QtGui import QKeySequence
from PyQt5.QtWidgets import QShortcut

class Bridge(QObject):
    def __init__(self):
        super().__init__()
        print("Bridge object initialized")

    @pyqtSlot(str, str)
    def sendToPyQt(self, method_name, args_json):
        print(f"Received call to sendToPyQt method")
        print(f"Method name: {method_name}")
        print(f"Arguments: {args_json}")
        
        try:
            args = json.loads(args_json)
            if method_name == "updateSettings":
                self.updateSettings(args)
            elif method_name == "sendMessage":
                self.sendMessage(args)
            else:
                print(f"Unknown method: {method_name}")
        except json.JSONDecodeError:
            print(f"Failed to parse JSON: {args_json}")
        except Exception as e:
            print(f"Error processing method {method_name}: {str(e)}")

    def updateSettings(self, settings):
        print(f"Updating settings: {settings}")

    def sendMessage(self, message):
        print(f"Received message: {message}")

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

        # 添加快捷键来切换开发者工具
        self.shortcut = QShortcut(QKeySequence("F12"), self)
        self.shortcut.activated.connect(self.toggle_dev_tools)

        # Load HTML file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        html_path = os.path.join(current_dir, 'dist', 'index.html')
        self.web_view.load(QUrl.fromLocalFile(html_path))

        self.web_view.loadFinished.connect(self.onLoadFinished)

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