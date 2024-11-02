import os
import queue
import string
import paho.mqtt.client as mqtt
from paho.mqtt.properties import Properties, PacketTypes
import time
import json
import random
import logging
import threading
from .config_manager import ConfigManager
from PyQt5.QtCore import pyqtSignal
from PyQt5.QtCore import QObject
from .export_file import ExportThread

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MQTTClient:
    def __init__(self, bridge):
        # MQTT配置
        self.bridge = bridge
        self.mqtt_broker = "8.137.17.72"
        self.mqtt_port = 8883
        self.mqtt_user = "fute"
        self.mqtt_password = "zhinengxitong"
        self.mqtt_keepalive = 10
        self.mqtt_topic_publish = "device/request"

        # 证书路径配置
        CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
        CERT_PATH = os.path.join(CURRENT_DIR, "certs")
        ca_cert = f"{CERT_PATH}/ca.crt"
        client_cert = f"{CERT_PATH}/client.crt"
        client_key = f"{CERT_PATH}/client.key"

        # 加载配置
        self.config_manager = ConfigManager()

        if self.config_manager.get_config('device_random_code') is None:
            device_status = "未激活"
            self.config_manager.update_config(device_status=device_status)
            self.config_manager.update_config(device_lock_count=1)

            # 生成随机码
            device_random_code = self.generate_random_code()
            self.config_manager.update_config(device_random_code=device_random_code)
            logger.info("设备随机码初始化")

        self.device_random_code = self.config_manager.get_config("device_random_code")
        self.response_topic = f"device/response/{self.device_random_code}"

        self.client = mqtt.Client(protocol=mqtt.MQTTv5)

        # 设置遗嘱消息
        self.device_status_topic = f"device/status/{self.device_random_code}"
        will_qos = 2

        # 创建遗嘱消息的属性
        # will_properties = Properties(PacketTypes.WILLMESSAGE)
        # will_properties.MessageExpiryInterval = 3600  # 消息过期时间，单位为秒
        # SSL配置
        self.client.tls_set(ca_certs=ca_cert,
                            certfile=client_cert,
                            keyfile=client_key,
                            cert_reqs=mqtt.ssl.CERT_REQUIRED,
                            tls_version=mqtt.ssl.PROTOCOL_TLS)
        # 如果连接地址与证书CN不同，则需要设置
        self.client.tls_insecure_set(True)

        # 对于遗嘱消息，retain 确保设备的最后已知状态（例如离线状态）被保留，直到设备重新上线
        self.client.will_set(self.device_status_topic, "offline", will_qos, retain=True)

        self.client.username_pw_set(self.mqtt_user, self.mqtt_password)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.connected = False

    # 随机码生成函数，旧蒸汽开头标识为001
    @staticmethod
    def generate_random_code():
        # 生成一个8位的随机字符串，包含数字和大写字母
        characters = string.ascii_uppercase + string.digits
        return '001'+''.join(random.choices(characters, k=7))

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            self.connected = True
            logger.info("Connected to MQTT broker")
            # 发送上线消息
            client.publish(self.device_status_topic, "online", 2, retain=True)
            client.subscribe(self.response_topic)
        else:
            logger.error(f"Failed to connect, return code {rc}")

    def on_message(self, client, userdata, msg):
        payload = json.loads(msg.payload.decode())
        
        if payload.get("command") == "vue_component_init":
            logger.info(f"Received message on topic {msg.topic}: {payload}")
            msg_type = payload.get("data")
            self.bridge.send_message(msg_type, "")
        elif payload.get("command") == "vue_component_set":
            logger.info(f"Received message on topic {msg.topic}: {payload}")
            msg_type = payload.get("target")
            self.bridge.send_message(msg_type, json.dumps(payload))
        elif payload.get("command") == "get_sensor_data":
            msg_type = "get_sensor_data"
            self.bridge.send_message(msg_type, "")
        elif payload.get("command") == "exportData":
            logger.info(f"Received message on topic {msg.topic}: {payload}")
            export_thread = ExportThread(
                db_name="sensor_data.db",
                result_queue=queue.Queue(),
                sensor_num=4,
                mqtt_client=self
            )
            export_thread.start()
        elif payload.get("command") == "clearData":
            logger.info(f"Received message on topic {msg.topic}: {payload}")
            self.bridge.send_message("clearData", "")
            
    def on_disconnect(self, client, userdata, rc, properties=None):
        self.connected = False
        if rc == 0:
            logger.info("Disconnected successfully")
            # 正常断开时，主动发送离线状态
            self.client.publish(self.device_status_topic, "offline", 2, retain=True)
        else:
            logger.info(f"Unexpected disconnection, return code {rc}")
            # 意外断开时，不需要做任何事，因为遗嘱消息会自动发送

    def start(self):
        def run():
            while True:
                if not self.connected:
                    try:
                        self.client.connect(self.mqtt_broker, self.mqtt_port, self.mqtt_keepalive)
                        self.client.loop_start()
                    except Exception as e:
                        # logger.error(f"Connection failed: {e}")
                        pass
                time.sleep(5)  # 每5秒检查一次连接状态

        threading.Thread(target=run, daemon=True).start()

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

    def publish(self, payload, topic="device/request"):
        if not self.connected:
            logger.warning("Not connected. Message not sent.")
            return False
        try:
            properties = Properties(PacketTypes.PUBLISH)
            # Properties类期望先创建对象，然后通过属性赋值来设置特定的 MQTT 属性
            properties.ResponseTopic = self.response_topic
            self.client.publish(topic=topic, payload=payload, properties=properties)
            
            return True
        except Exception as e:
            logger.error(f"Failed to publish message: {e}")
            return False

# 使用示例
if __name__ == "__main__":
    mqtt_client = MQTTClient()
    mqtt_client.start()

    def publish_data():
        while True:
            data = {
                "command": "get_status",
            }
            success = mqtt_client.publish(json.dumps(data))
            if success:
                logger.info(f"Published data: {data}")
            else:
                logger.warning("Failed to publish data")
            time.sleep(5)  # 每5秒发送一次数据

    # 启动发布和接收线程
    threading.Thread(target=publish_data, daemon=True).start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Exiting...")
        mqtt_client.stop()