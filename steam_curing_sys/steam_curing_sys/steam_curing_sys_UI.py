import sys
from PyQt5.QtWidgets import (QApplication, QWidget, QGridLayout, QLabel, QPushButton,
QVBoxLayout, QHBoxLayout, QFrame, QSizePolicy, QGroupBox, QScrollArea, QDesktopWidget)
from PyQt5.QtGui import QFont, QPixmap, QPalette, QColor
from PyQt5.QtCore import Qt, QEvent, QTimer
from PyQt5.QtWidgets import QButtonGroup
import random
from PyQt5.QtWidgets import QMessageBox
from PyQt5.QtWidgets import QDialog

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
        self.title_label.setStyleSheet("font-weight: bold; color: #333333; font-size: 18px;") # 增大标题字体大小
        
        self.value_label = QLabel(self.value)
        self.value_label.setAlignment(Qt.AlignCenter)
        self.value_label.setStyleSheet("font-size: 24px; font-weight: bold; color: #4CAF50;")  # 增大数值字体大小
        
        layout.addWidget(self.title_label)
        layout.addWidget(self.value_label)
        
        self.setLayout(layout)
        self.setFrameStyle(QFrame.Box | QFrame.Plain)
        self.setLineWidth(2)
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        self.setMinimumSize(150, 120)  # 增大传感器框的最小尺寸
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
                    return
            elif self == main_window.temp_limit_frame.lower_control:
                if self.value >= main_window.temp_limit_frame.upper_control.value:
                    return
            elif self == main_window.humidity_limit_frame.upper_control:
                if self.value <= main_window.humidity_limit_frame.lower_control.value:
                    return
            elif self == main_window.humidity_limit_frame.lower_control:
                if self.value >= main_window.humidity_limit_frame.upper_control.value:
                    return

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

class ControlButtons(QFrame):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        layout = QVBoxLayout()
        layout.setContentsMargins(10, 10, 10, 10) # 布局内的部件(在这个例子中是按钮)与布局边缘之间的空间
        layout.setSpacing(10) # 增加按钮之间的间距

        self.mode_group = QButtonGroup(self)

        self.mode1_button = self.create_mode_button("模式一")
        self.mode2_button = self.create_mode_button("模式二")
        self.export_button = self.create_export_button("导出数据")  # 使用新的方法创建导出数据按钮

        self.mode_group.addButton(self.mode1_button)
        self.mode_group.addButton(self.mode2_button)

        layout.addWidget(self.mode1_button)
        layout.addWidget(self.mode2_button)
        layout.addWidget(self.export_button)

        self.setLayout(layout)
        # QFrame 的内容(在这个例子中是布局和按钮)与 QFrame 边缘之间的空间
        self.setStyleSheet("""
            QFrame {
                background-color: #e0e0e0;
                border-radius: 5px;
                padding: 10px;
            }
        """)
        self.setMinimumHeight(150)

    def create_mode_button(self, text):
        btn = QPushButton(text)
        btn.setCheckable(True)
        # 减少按钮的内边距
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
        return btn

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
    
class IndustrialControlPanel(QWidget):
    def __init__(self, sensor_thread):
        super().__init__()
        self.sensor_thread = sensor_thread
        self.initUI()

    def initUI(self):
        self.setWindowTitle('工业控制面板')
        main_layout = QVBoxLayout()
        main_layout.setSpacing(10)

        sensor_grid = QHBoxLayout()
        sensor_grid.setSpacing(10)

        left_group_box = QGroupBox()
        left_layout = QGridLayout()
        left_layout.setSpacing(10)  # 减小左侧网格的间距

        right_group_box = QGroupBox()  
        right_layout = QGridLayout()
        right_layout.setSpacing(10)  # 减小右侧网格的间距

        self.left_status_label = QLabel("左蒸汽机: 未工作")
        self.left_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")
        left_layout.addWidget(self.left_status_label, 0, 0, 1, 2, Qt.AlignLeft | Qt.AlignTop)

        self.right_status_label = QLabel("右蒸汽机: 未工作")
        self.right_status_label.setStyleSheet("font-weight: bold; color: red; font-size: 20px;")
        right_layout.addWidget(self.right_status_label, 0, 0, 1, 2, Qt.AlignLeft | Qt.AlignTop)

        self.sensor_frames = []
        for i in range(2):
            sensor_frame = SensorFrame(f"温度传感器{i+1}", "未知")
            self.sensor_frames.append(sensor_frame)
            left_layout.addWidget(sensor_frame, 1, i)

        for i in range(2, 4):
            sensor_frame = SensorFrame(f"温度传感器{i+1}", "未知")
            self.sensor_frames.append(sensor_frame)
            right_layout.addWidget(sensor_frame, 1, i-2)
        
        for i in range(2):
            sensor_frame = SensorFrame(f"湿度传感器{i+1}", "未知")
            self.sensor_frames.append(sensor_frame)
            left_layout.addWidget(sensor_frame, 2, i)
        
        for i in range(2, 4):
            sensor_frame = SensorFrame(f"湿度传感器{i+1}", "未知")
            self.sensor_frames.append(sensor_frame)
            right_layout.addWidget(sensor_frame, 2, i-2)

        left_group_box.setLayout(left_layout)
        right_group_box.setLayout(right_layout)

        sensor_grid.addWidget(left_group_box)
        sensor_grid.addWidget(right_group_box)

        sensor_widget = QWidget()
        sensor_widget.setLayout(sensor_grid)
        sensor_widget.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Preferred)
        
        main_layout.addWidget(sensor_widget, 3)

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

        # 连接按钮事件
        self.control_buttons.mode1_button.clicked.connect(self.on_mode1_clicked)
        self.control_buttons.mode2_button.clicked.connect(self.on_mode2_clicked)
        self.control_buttons.export_button.clicked.connect(self.on_export_clicked)

        # 设置模式一按钮为初始选中状态
        self.control_buttons.mode1_button.setChecked(True)

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

    def show_export_completed_dialog(self, success):
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
        elif success == -1:
            message_label = QLabel("数字继电器模块未插入，系统故障")
        message_label.setAlignment(Qt.AlignCenter)
        message_label.setFont(QFont("Arial", 18, QFont.Bold))  # 消息字体大小
        message_label.setStyleSheet("color: #4CAF50;")  # 绿色文本

        # 创建确定按钮
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