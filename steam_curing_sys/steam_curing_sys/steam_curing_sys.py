import sys
from PyQt5.QtCore import QTimer
from PyQt5.QtWidgets import QApplication
from .steam_curing_sys_UI_test import MainWindow
import signal
import logging
from .qtsignal_handler import QtSignalHandler
from .control_utils import ControlUtils, ModbusControlException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    app = QApplication(sys.argv)
    qtSignalHandler = QtSignalHandler()
    
    # ex = IndustrialControlPanel(ros2_thread)
    ex = MainWindow()
    qtSignalHandler.data_updated.connect(ex.update_sensor_data)
    ex.bridge.limitSettingsUpdated.connect(qtSignalHandler.process_limit_settings)
    qtSignalHandler.load_limit_settings.connect(ex.update_limit_settings)
    
    ex.bridge.steamEngineState.connect(qtSignalHandler.manual_steam_engine_state)
    
    qtSignalHandler.load_sprinkler_settings.connect(ex.update_sprinkler_settings)
    
    ex.bridge.dollyControl.connect(qtSignalHandler.dolly_control)
    qtSignalHandler.load_dolly_settings.connect(ex.update_dolly_settings)
    ex.bridge.sprinklerSystemControl.connect(qtSignalHandler.sprinkler_control)
    # ros2_thread.mode_chosen.connect(ros2_thread.process_mode_chosen)
    qtSignalHandler.export_completed.connect(ex.show_export_completed_dialog)
    qtSignalHandler.export_started.connect(ex.show_export_progress)
    qtSignalHandler.left_steam_status_updated.connect(ex.update_left_steam_status)
    qtSignalHandler.right_steam_status_updated.connect(ex.update_right_steam_status)

    qtSignalHandler.update_dolly_state.connect(ex.update_dolly_state)
    qtSignalHandler.update_water_tank_status.connect(ex.update_water_tank_status)
    ex.bridge.dataExport.connect(qtSignalHandler.export_data)
    ex.bridge.lockPasswordCheck.connect(qtSignalHandler.check_password)

    qtSignalHandler.confirm_lock_password.connect(ex.confirm_lock_password)
    ex.bridge.activateDevice.connect(qtSignalHandler.activate_device)

    qtSignalHandler.update_device_info.connect(ex.update_device_info)
    qtSignalHandler.device_activated.connect(ex.device_activated)
    ex.bridge.updataBaseTime.connect(qtSignalHandler.update_baseTime)

    try:
        qtSignalHandler.control_utils = ControlUtils()
    except ModbusControlException as e:
        qtSignalHandler.export_completed.emit(-1)  # 发送错误信号

    # 信号连接完成后进行初始加载
    qtSignalHandler.load_limits()
    qtSignalHandler.load_sprinkler()
    qtSignalHandler.load_dolly()

    # 第一次调用load_device_info会因为随机码生成后还没完全保存到数据库中而失败
    qtSignalHandler.load_device_info()

    qtSignalHandler.ros2_thread.start()

    # 创建一个计时器来定期处理事件
    timer = QTimer()
    timer.start(500)  # 每500毫秒触发一次
    timer.timeout.connect(lambda: None)  # 保持事件循环活跃

    # 使用Qt的方式来处理UNIX信号
    def qt_signal_handler():
        logger.info("收到主程序关闭信号")
        qtSignalHandler.ros2_thread.stop()
        qtSignalHandler.ros2_thread.wait()
        qtSignalHandler.config_manager.conn.close()
        ex.close()
        app.quit()

    # 设置信号处理器
    signal.signal(signal.SIGINT, lambda *args: QTimer.singleShot(0, qt_signal_handler))

    ex.showFullScreen()
    
    # 使用 app.exec() 替代 app.exec_()
    exit_code = app.exec()

    # 清理操作
    logger.info("主程序退出")
    qtSignalHandler.ros2_thread.stop()
    qtSignalHandler.ros2_thread.wait()
    qtSignalHandler.config_manager.conn.close()

    sys.exit(exit_code)

if __name__ == '__main__':
    main()