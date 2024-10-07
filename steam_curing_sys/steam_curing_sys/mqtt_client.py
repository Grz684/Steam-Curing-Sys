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

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MQTTClient:
    def __init__(self, bridge):
        # MQTT配置
        self.bridge = bridge
        self.mqtt_broker = "8.137.17.72"
        self.mqtt_port = 1883
        self.mqtt_user = "fute"
        self.mqtt_password = "zhinengxitong"
        self.mqtt_keepalive = 10
        self.mqtt_topic_publish = "device/request"

        # 加载配置
        self.config_manager = ConfigManager()
        self.config_manager.load_config()
        self.device_random_code = self.config_manager.get_config("device_random_code")
        self.response_topic = f"device/response/{self.device_random_code}"

        self.client = mqtt.Client(protocol=mqtt.MQTTv5)

        # 设置遗嘱消息
        self.device_status_topic = f"device/status/{self.device_random_code}"
        will_qos = 0
        will_retain = True

        # 创建遗嘱消息的属性
        # will_properties = Properties(PacketTypes.WILLMESSAGE)
        # will_properties.MessageExpiryInterval = 3600  # 消息过期时间，单位为秒

        # 对于遗嘱消息，retain 确保设备的最后已知状态（例如离线状态）被保留，直到设备重新上线
        self.client.will_set(self.device_status_topic, "offline", will_qos, will_retain)

        self.client.username_pw_set(self.mqtt_user, self.mqtt_password)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.connected = False

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            self.connected = True
            logger.info("Connected to MQTT broker")
            # 发送上线消息
            client.publish(self.device_status_topic, "online", retain=True)
            client.subscribe(self.response_topic)
        else:
            logger.error(f"Failed to connect, return code {rc}")

    def on_message(self, client, userdata, msg):
        payload = json.loads(msg.payload.decode())
        logger.info(f"Received message on topic {msg.topic}: {payload}")
        
        if payload.get("command") == "vue_component_init":
            msg_type = payload.get("data")
            self.bridge.send_message(msg_type, "")
        elif payload.get("command") == "vue_component_set":
            msg_type = payload.get("target")
            self.bridge.send_message(msg_type, json.dumps(payload))
            
    def on_disconnect(self, client, userdata, rc, properties=None):
        self.connected = False
        if rc == 0:
            logger.info("Disconnected successfully")
            # 正常断开时，主动发送离线状态
            self.client.publish(self.device_status_topic, "offline", retain=True)
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
                        logger.error(f"Connection failed: {e}")
                time.sleep(5)  # 每5秒检查一次连接状态

        threading.Thread(target=run, daemon=True).start()

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

    def publish(self, payload):
        if not self.connected:
            logger.warning("Not connected. Message not sent.")
            return False
        try:
            properties = Properties(PacketTypes.PUBLISH)
            # Properties类期望先创建对象，然后通过属性赋值来设置特定的 MQTT 属性
            properties.ResponseTopic = self.response_topic
            self.client.publish(self.mqtt_topic_publish, payload, properties=properties)
            
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