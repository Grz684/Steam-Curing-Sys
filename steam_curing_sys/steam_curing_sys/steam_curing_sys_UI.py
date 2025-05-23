import sys
from PyQt5.QtGui import QFont, QPixmap, QPalette, QColor, QPainter
from PyQt5.QtCore import Qt, QEvent, QTimer, QTime, pyqtSignal, QPropertyAnimation, QEasingCurve, pyqtProperty
from PyQt5 import QtWidgets, QtCore, QtGui
import random

from PyQt5.QtWidgets import (
    QApplication, QWidget, QGridLayout, QLabel, QPushButton,
    QVBoxLayout, QHBoxLayout, QFrame, QSizePolicy, QGroupBox, QScrollArea, QDesktopWidget,
    QButtonGroup, QTabWidget, QMessageBox, QDialog
)
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SensorFrame(QFrame):
    def __init__(self, title, value):
        super().__init__()
        self.title = title
        self.value = value
        self.initUI()

    def initUI(self):
        layout = QVBoxLayout()
        layout.setSpacing(5)

        self.title_label = QLabel(self.title)
        self.title_label.setAlignment(Qt.AlignCenter)
        self.title_label.setStyleSheet("font-weight: bold; color: #333333; font-size: 20px;") # 增大标题字体大小
        
        self.value_label = QLabel(self.value)
        self.value_label.setAlignment(Qt.AlignCenter)
        self.value_label.setStyleSheet("font-size: 22px; font-weight: bold; color: #4CAF50;")  # 增大数值字体大小
        
        layout.addWidget(self.title_label)
        layout.addWidget(self.value_label)
        
        self.setLayout(layout)
        self.setFrameStyle(QFrame.Box | QFrame.Plain)
        self.setLineWidth(2)
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        self.setMinimumSize(120, 120)  # 增大传感器框的最小尺寸
        self.setStyleSheet("""
            SensorFrame {
                background-color: white;
                border-radius: 10px;
                border: 2px solid #dcdcdc;
            }
        """)

class LimitControl(QFrame):
    def __init__(self, label_text, value, unit):
        super().__init__()
        self.label_text = label_text
        self.value = value
        self.unit = unit
        self.timer = QTimer()
        self.timer.timeout.connect(self.on_timeout)
        self.initUI()

    def initUI(self):
        layout = QHBoxLayout()
        layout.setContentsMargins(2, 2, 2, 2)
        layout.setSpacing(5)

        label = QLabel(self.label_text)
        label.setStyleSheet("color: #666666; min-width: 40px; font-size: 18px;")
        layout.addWidget(label)

        self.minus_button = QPushButton("-")
        self.minus_button.setFixedSize(40, 40)
        self.minus_button.pressed.connect(self.start_timer)
        self.minus_button.released.connect(self.stop_timer)
        self.minus_button.clicked.connect(self.decrease_value)  # 添加单击事件
        layout.addWidget(self.minus_button)

        self.value_label = QLabel(f"{self.value} {self.unit}")
        self.value_label.setAlignment(Qt.AlignCenter)
        self.value_label.setStyleSheet("""
            font-size: 20px; 
            font-weight: bold; 
            min-width: 100px; 
            background-color: white; 
            border: 1px solid #dcdcdc; 
            border-radius: 5px;
            padding: 2px 5px;
        """)
        layout.addWidget(self.value_label)

        self.plus_button = QPushButton("+")
        self.plus_button.setFixedSize(40, 40)
        self.plus_button.pressed.connect(self.start_timer)
        self.plus_button.released.connect(self.stop_timer)
        self.plus_button.clicked.connect(self.increase_value)  # 添加单击事件
        layout.addWidget(self.plus_button)

        layout.addStretch()

        self.setLayout(layout)
        self.setStyleSheet("""
            LimitControl {
                background-color: #f0f0f0;
                border-radius: 5px;
                padding: 5px;
            }
            QPushButton {
                background-color: #4CAF50;
                color: white;
                border-radius: 20px;
                font-weight: bold;
                font-size: 24px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
        """)

    def increase_value(self):
        self.value += 1
        self.update_value()

    def decrease_value(self):
        self.value -= 1
        self.update_value()

    def update_value(self):
        main_window = self.window()
        if isinstance(main_window, IndustrialControlPanel):
            if self == main_window.temp_limit_frame.upper_control:
                if self.value <= main_window.temp_limit_frame.lower_control.value:
                    self.value = main_window.temp_limit_frame.lower_control.value + 1
            elif self == main_window.temp_limit_frame.lower_control:
                if self.value >= main_window.temp_limit_frame.upper_control.value:
                    self.value = main_window.temp_limit_frame.upper_control.value - 1
            elif self == main_window.humidity_limit_frame.upper_control:
                if self.value <= main_window.humidity_limit_frame.lower_control.value:
                    self.value = main_window.humidity_limit_frame.lower_control.value + 1
            elif self == main_window.humidity_limit_frame.lower_control:
                if self.value >= main_window.humidity_limit_frame.upper_control.value:
                    self.value = main_window.humidity_limit_frame.upper_control.value - 1

        self.value_label.setText(f"{self.value} {self.unit}")
        main_window.send_limit_settings()

    def on_timeout(self):
        if self.plus_button.isDown():
            self.increase_value()
        elif self.minus_button.isDown():
            self.decrease_value()

    def start_timer(self):
        self.timer.start(200)

    def stop_timer(self):
        self.timer.stop()

class LimitControlFrame(QFrame):
    def __init__(self, title, upper_value, lower_value, unit):
        super().__init__()
        self.title = title
        self.upper_control = LimitControl("上限:", upper_value, unit)
        self.lower_control = LimitControl("下限:", lower_value, unit)
        self.initUI()

    def initUI(self):
        layout = QVBoxLayout()
        layout.setContentsMargins(5, 5, 5, 5)
        layout.setSpacing(5)

        title_label = QLabel(self.title)
        title_label.setStyleSheet("font-weight: bold; color: #333333; font-size: 18px;")
        layout.addWidget(title_label)

        layout.addWidget(self.upper_control)
        layout.addWidget(self.lower_control)

        self.setLayout(layout)
        self.setStyleSheet("""
            QFrame {
                background-color: #f0f0f0;
                border-radius: 5px;
                padding: 5px;
            }
        """)
        self.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Preferred)
        self.setMinimumHeight(150)  # 设置限制控制框的最小高度

class ModeButton(QPushButton):
    longPressFinished = pyqtSignal()

    def __init__(self, text):
        super().__init__(text)
        self.setCheckable(True)
        self._progress = 0
        self.animation = QPropertyAnimation(self, b"progress")
        self.animation.setDuration(2000)  # 2秒完成
        self.animation.setStartValue(0)
        self.animation.setEndValue(100)
        self.animation.setEasingCurve(QEasingCurve.InOutQuad)
        self.animation.finished.connect(self.on_animation_finished)
        self.is_current_mode = False

    def setProgress(self, value):
        if self._progress != value:
            self._progress = value
            self.update()

    def getProgress(self):
        return self._progress

    progress = pyqtProperty(float, getProgress, setProgress)

    def paintEvent(self, event):
        super().paintEvent(event)
        if not self.is_current_mode and self._progress > 0:
            painter = QPainter(self)
            painter.setRenderHint(QPainter.Antialiasing)
            painter.setPen(Qt.NoPen)
            painter.setBrush(QColor(76, 175, 80, 128))  # 淡绿色，半透明
            width = int(self.width() * (self._progress / 100))
            painter.drawRect(0, 0, width, self.height())

    def on_animation_finished(self):
        if self._progress >= 100 and not self.is_current_mode:
            self.longPressFinished.emit()

    def reset_progress(self):
        self.animation.stop()
        self.setProgress(0)

    def set_current_mode(self, is_current):
        self.is_current_mode = is_current
        if is_current:
            self.reset_progress()

class ControlButtons(QFrame):
    modeChanged = pyqtSignal(int)

    def __init__(self):
        super().__init__()
        self.current_mode = 1  # 默认模式1
        self.initUI()
        self.initialize_current_mode()

    def initUI(self):
        layout = QVBoxLayout()
        layout.setContentsMargins(10, 10, 10, 10)
        layout.setSpacing(10)

        self.mode_group = QButtonGroup(self)
        self.mode_group.setExclusive(False)

        self.mode1_button = self.create_mode_button("模式一")
        self.mode2_button = self.create_mode_button("模式二")
        self.export_button = self.create_export_button("导出数据")

        self.mode_group.addButton(self.mode1_button, 1)
        self.mode_group.addButton(self.mode2_button, 2)

        layout.addWidget(self.mode1_button)
        layout.addWidget(self.mode2_button)
        layout.addWidget(self.export_button)

        self.setLayout(layout)
        self.setStyleSheet("""
            QFrame {
                background-color: #e0e0e0;
                border-radius: 5px;
                padding: 10px;
            }
        """)
        self.setMinimumHeight(150)

    def create_mode_button(self, text):
        btn = ModeButton(text)
        btn.setStyleSheet("""
            QPushButton {
                background-color: #f0f0f0;
                border: 1px solid #d0d0d0;
                border-radius: 5px;
                padding: 15px;
                font-weight: bold;
                font-size: 18px;
            }
            QPushButton:checked {
                background-color: #4CAF50;
                color: white;
            }
            QPushButton:hover {
                background-color: #e0e0e0;
            }
        """)
        btn.pressed.connect(lambda: self.start_progress(btn))
        btn.released.connect(lambda: self.stop_progress(btn))
        btn.longPressFinished.connect(lambda: self.toggle_mode(btn))
        return btn

    def initialize_current_mode(self):
        self.mode1_button.setChecked(True)
        self.mode1_button.set_current_mode(True)
        self.mode2_button.set_current_mode(False)
        self.update_button_styles()

    def start_progress(self, button):
        if not button.is_current_mode:
            button.animation.start()

    def stop_progress(self, button):
        if not button.is_current_mode:
            button.reset_progress()

    def toggle_mode(self, button):
        new_mode = self.mode_group.id(button)
        if new_mode != self.current_mode:
            self.current_mode = new_mode
            self.mode1_button.setChecked(new_mode == 1)
            self.mode2_button.setChecked(new_mode == 2)
            self.mode1_button.set_current_mode(new_mode == 1)
            self.mode2_button.set_current_mode(new_mode == 2)
            self.update_button_styles()
            self.modeChanged.emit(new_mode)

    def update_button_styles(self):
        self.mode1_button.setStyleSheet(self.get_button_style(self.mode1_button.isChecked()))
        self.mode2_button.setStyleSheet(self.get_button_style(self.mode2_button.isChecked()))

    def get_button_style(self, is_checked):
        return f"""
            QPushButton {{
                background-color: {'#4CAF50' if is_checked else '#f0f0f0'};
                color: {'white' if is_checked else 'black'};
                border: 1px solid #d0d0d0;
                border-radius: 5px;
                padding: 15px;
                font-weight: bold;
                font-size: 18px;
            }}
            QPushButton:hover {{
                background-color: {'#45a049' if is_checked else '#e0e0e0'};
            }}
        """

    def create_export_button(self, text):
        btn = QPushButton(text)
        btn.setStyleSheet("""
            QPushButton {
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 15px;
                font-weight: bold;
                font-size: 18px;
            }
            QPushButton:hover {
                background-color: #1976D2;
            }
        """)
        return btn

    def set_initial_mode(self, mode):
        self.current_mode = mode
        self.mode1_button.setChecked(mode == 1)
        self.mode2_button.setChecked(mode == 2)
        self.mode1_button.set_current_mode(mode == 1)
        self.mode2_button.set_current_mode(mode == 2)
        self.update_button_styles()

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
    
class IndustrialControlPanel(QWidget):
    def __init__(self, sensor_thread):
        super().__init__()
        self.sensor_thread = sensor_thread
        self.export_progress_dialog = None
        self.initUI()

    def initUI(self):
        self.setWindowTitle('工业控制面板')
         # 设置窗口始终在最上层
        self.setWindowFlags(Qt.WindowStaysOnTopHint)
        main_layout = QVBoxLayout()
        main_layout.setSpacing(0)
        main_layout.setContentsMargins(0, 0, 0, 0)

        status_layout = QHBoxLayout()
        status_layout.setSpacing(10)
        status_layout.setContentsMargins(10, 10, 10, 10)

        left_group_box = QGroupBox()
        left_layout = QGridLayout()
        left_layout.setSpacing(10)
        left_group_box.setContentsMargins(0, 0, 0, 0)

        right_group_box = QGroupBox()
        right_layout = QGridLayout()
        right_layout.setSpacing(10)
        right_group_box.setContentsMargins(0, 0, 0, 0)

        self.left_status_label = QLabel("左蒸汽机: 未工作")
        self.left_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")
        left_layout.addWidget(self.left_status_label, 0, 0, 1, 2, Qt.AlignLeft | Qt.AlignTop)

        self.right_status_label = QLabel("右蒸汽机: 未工作")
        self.right_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")
        right_layout.addWidget(self.right_status_label, 0, 0, 1, 2, Qt.AlignLeft | Qt.AlignTop)

        left_group_box.setLayout(left_layout)
        right_group_box.setLayout(right_layout)

        status_layout.addWidget(left_group_box)
        status_layout.addWidget(right_group_box)

        main_layout.addLayout(status_layout)

        # 创建传感器数据框
        sensor_data_widget = QWidget()
        sensor_data_widget.setContentsMargins(10, 0, 10, 0)
        sensor_data_layout = QVBoxLayout()
        sensor_data_layout.setSpacing(20)
        sensor_data_layout.setContentsMargins(0, 0, 0, 0)

        temp_sensor_widget = QWidget()
        temp_sensor_layout = QHBoxLayout()
        temp_sensor_layout.setSpacing(10)
        temp_sensor_layout.setContentsMargins(0, 0, 0, 0)
        temp_sensor_widget.setContentsMargins(0, 0, 0, 0)

        temp_left_group_box = QGroupBox()
        temp_left_layout = QGridLayout()
        temp_left_layout.setSpacing(10)

        temp_right_group_box = QGroupBox()
        temp_right_layout = QGridLayout()
        temp_right_layout.setSpacing(10)

        self.sensor_frames = []
        for i in range(16):
            sensor_frame = SensorFrame(f"温感{i+1}", "未知")
            self.sensor_frames.append(sensor_frame)
            if i < 8:
                temp_left_layout.addWidget(sensor_frame, i // 4, i % 4)
            else:
                temp_right_layout.addWidget(sensor_frame, (i - 8) // 4, (i - 8) % 4)

        temp_left_group_box.setLayout(temp_left_layout)
        temp_right_group_box.setLayout(temp_right_layout)

        temp_sensor_layout.addWidget(temp_left_group_box)
        temp_sensor_layout.addWidget(temp_right_group_box)

        temp_sensor_widget.setLayout(temp_sensor_layout)

        humidity_sensor_widget = QWidget()
        humidity_sensor_layout = QHBoxLayout()
        humidity_sensor_layout.setSpacing(10)
        humidity_sensor_layout.setContentsMargins(0, 0, 0, 0)
        humidity_sensor_widget.setContentsMargins(0, 0, 0, 0)

        humidity_left_group_box = QGroupBox()
        humidity_left_layout = QGridLayout()
        humidity_left_layout.setSpacing(10)

        humidity_right_group_box = QGroupBox()
        humidity_right_layout = QGridLayout()
        humidity_right_layout.setSpacing(10)

        for i in range(16):
            sensor_frame = SensorFrame(f"湿感{i+1}", "未知")
            self.sensor_frames.append(sensor_frame)
            if i < 8:
                humidity_left_layout.addWidget(sensor_frame, i // 4, i % 4)
            else:
                humidity_right_layout.addWidget(sensor_frame, (i - 8) // 4, (i - 8) % 4)

        humidity_left_group_box.setLayout(humidity_left_layout)
        humidity_right_group_box.setLayout(humidity_right_layout)

        humidity_sensor_layout.addWidget(humidity_left_group_box)
        humidity_sensor_layout.addWidget(humidity_right_group_box)

        humidity_sensor_widget.setLayout(humidity_sensor_layout)

        # 创建标签选项卡并添加到传感器数据布局
        tab_widget = QTabWidget()
        tab_widget.setStyleSheet("""
            QTabWidget::pane {
                border: none;
                margin-top: -15px;
            }
            QTabBar::tab {
                background: #f0f0f0;
                color: black;
                padding: 10px 10px;  /* 减小水平内边距 */
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                margin-right: 2px;
                font-size: 18px;  /* 减小字体大小 */
                min-width: 140px;  /* 设置最小宽度 */
                min-height: 20px;  /* 设置最小高度 */
            }
            QTabBar::tab:selected {
                background: #4CAF50;
                color: white;
            }
        """)
        tab_widget.setContentsMargins(0, 0, 0, 0)

        tab_widget.addTab(temp_sensor_widget, "温度传感器")
        tab_widget.addTab(humidity_sensor_widget, "湿度传感器")

        sensor_data_layout.addWidget(tab_widget)
        sensor_data_widget.setLayout(sensor_data_layout)

        # 将传感器数据框添加到主布局
        main_layout.addWidget(sensor_data_widget)

        self.setLayout(main_layout)

        limits_layout = QHBoxLayout()
        limits_layout.setSpacing(10)

        self.temp_limit_frame = LimitControlFrame("温度限制", self.sensor_thread.temp_upper_limit, self.sensor_thread.temp_lower_limit, "°C")
        limits_layout.addWidget(self.temp_limit_frame)

        self.humidity_limit_frame = LimitControlFrame("湿度限制", self.sensor_thread.humidity_upper_limit, self.sensor_thread.humidity_lower_limit, "%")
        limits_layout.addWidget(self.humidity_limit_frame)

        self.control_buttons = ControlButtons()
        limits_layout.addWidget(self.control_buttons)

        # 设置1:1:1的比例
        limits_layout.setStretch(0, 1)
        limits_layout.setStretch(1, 1)
        limits_layout.setStretch(2, 1)

        self.control_buttons.modeChanged.connect(self.on_mode_changed)
        self.control_buttons.export_button.clicked.connect(self.on_export_clicked)

        # 设置初始模式
        self.control_buttons.set_initial_mode(1)

        limits_widget = QWidget()
        limits_widget.setLayout(limits_layout)
        limits_widget.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Preferred)
        
        main_layout.addWidget(limits_widget, 2)

        company_layout = QHBoxLayout()
        logo_pixmap = QPixmap('fute_logo.png')
        if not logo_pixmap.isNull():
            logo_label = QLabel()
            logo_pixmap = logo_pixmap.scaled(81, 81, Qt.KeepAspectRatio, Qt.SmoothTransformation)
            logo_label.setPixmap(logo_pixmap)
            logo_label.setFixedSize(81, 81)
        else:
            logo_label = QLabel('Logo')
            logo_label.setStyleSheet('background-color: #cccccc; padding: 5px; font-size: 14px;')
            logo_label.setFixedSize(81, 81)
            logo_label.setAlignment(Qt.AlignCenter)

        company_info = QLabel(' 涪特智能装备(重庆)有限公司')
        company_info.setFont(QFont('Arial', 16, QFont.Bold))  # 增大公司名称字体
        company_info.setStyleSheet('color: #333333;')
        company_info.setWordWrap(True)

        company_layout.addWidget(logo_label)
        company_layout.addWidget(company_info, 1)
        company_layout.addStretch()
        
        company_widget = QWidget()
        company_widget.setLayout(company_layout)
        company_widget.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Preferred)
        
        main_layout.addWidget(company_widget, 1)

        self.setLayout(main_layout)

        # 获取屏幕尺寸并设置窗口大小
        screen = QDesktopWidget().screenNumber(QDesktopWidget().cursor().pos())
        screen_size = QDesktopWidget().screenGeometry(screen).size()
        self.resize(screen_size)
        # self.setMinimumSize(1280, 720)
        self.setStyleSheet("""
            QWidget {
                background-color: #f5f5f5;
                color: #333333;
            }
        """)

    def update_sensor_data(self, sensor_data):
        for frame, (title, value) in zip(self.sensor_frames, sensor_data):
            frame.title_label.setText(title)
            frame.value_label.setText(value)

    def send_limit_settings(self):
        temp_upper = self.temp_limit_frame.upper_control.value
        temp_lower = self.temp_limit_frame.lower_control.value
        humidity_upper = self.humidity_limit_frame.upper_control.value
        humidity_lower = self.humidity_limit_frame.lower_control.value

        # print(f"Sending limit settings: Temp {temp_lower}-{temp_upper}°C, Humidity {humidity_lower}-{humidity_upper}%")
        # 发射信号，将数据传递给工作线程
        self.sensor_thread.limit_settings.emit(temp_upper, temp_lower, humidity_upper, humidity_lower)

    def receive_limit_settings(self, temp_upper, temp_lower, humidity_upper, humidity_lower):
        self.temp_limit_frame.upper_control.value = temp_upper
        self.temp_limit_frame.lower_control.value = temp_lower
        self.humidity_limit_frame.upper_control.value = humidity_upper
        self.humidity_limit_frame.lower_control.value = humidity_lower

    # def update_sensor_status(self, left_status, right_status):
    #     if left_status:
    #         self.left_status_label.setText("左蒸汽机: 工作中")
    #         self.left_status_label.setStyleSheet("font-weight: bold; color: green; font-size: 20px;")
    #     else:
    #         self.left_status_label.setText("左蒸汽机: 未工作")
    #         self.left_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")

    #     if right_status:
    #         self.right_status_label.setText("右蒸汽机: 工作中")
    #         self.right_status_label.setStyleSheet("font-weight: bold; color: green; font-size: 20px;")
    #     else:
    #         self.right_status_label.setText("右蒸汽机: 未工作")
    #         self.right_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")

    def update_left_steam_status(self, status):
        if status:
            self.left_status_label.setText("左蒸汽机: 工作中")
            self.left_status_label.setStyleSheet("font-weight: bold; color: green; font-size: 20px;")
        else:
            self.left_status_label.setText("左蒸汽机: 未工作")
            self.left_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")

    def update_right_steam_status(self, status):
        if status:
            self.right_status_label.setText("右蒸汽机: 工作中")
            self.right_status_label.setStyleSheet("font-weight: bold; color: green; font-size: 20px;")
        else:
            self.right_status_label.setText("右蒸汽机: 未工作")
            self.right_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")

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

    def closeEvent(self, event):
        # 用户关闭窗口，停止工作线程
        self.sensor_thread.stop()
        self.sensor_thread.wait()

        # 接受关闭事件，允许窗口关闭
        event.accept()

    def on_mode1_clicked(self):
        # print("模式一被选中")
        self.sensor_thread.mode_chosen.emit(1)

    def on_mode2_clicked(self):
        # print("模式二被选中")
        self.sensor_thread.mode_chosen.emit(2)

    def on_export_clicked(self):
        # print("导出数据")
        self.sensor_thread.mode_chosen.emit(3)

    def on_mode_changed(self, mode):
        if mode == 1:
            self.on_mode1_clicked()
            # 在这里添加模式一的相关操作
        elif mode == 2:
            self.on_mode2_clicked()
            # 在这里添加模式二的相关操作