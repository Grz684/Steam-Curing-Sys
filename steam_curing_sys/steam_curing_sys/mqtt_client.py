import paho.mqtt.client as mqtt
import time
import json
import random
import logging
import threading

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# MQTT配置
MQTT_BROKER = "8.137.17.72"
MQTT_PORT = 1883
MQTT_USER = "fute"
MQTT_PASSWORD = "zhinengxitong"
MQTT_KEEPALIVE = 10
MQTT_TOPIC_SUBSCRIBE = "machine/command"
MQTT_TOPIC_PUBLISH = "machine/data"

class MQTTClient:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.connected = False

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.connected = True
            logging.info("Connected to MQTT broker")
            client.subscribe(MQTT_TOPIC_SUBSCRIBE)
        else:
            logging.error(f"Failed to connect, return code {rc}")

    def on_message(self, client, userdata, msg):
        logging.info(f"Received message on topic {msg.topic}: {msg.payload.decode()}")

    def on_disconnect(self, client, userdata, rc):
        self.connected = False
        if rc == 0:
            print("Disconnected successfully")
            # 正常断开时，主动发送离线状态
        else:
            print(f"Unexpected disconnection, return code {rc}")
            # 意外断开时，不需要做任何事，因为遗嘱消息会自动发送

    def start(self):
        def run():
            while True:
                if not self.connected:
                    try:
                        self.client.connect(MQTT_BROKER, MQTT_PORT, MQTT_KEEPALIVE)
                        self.client.loop_start()
                    except Exception as e:
                        logging.error(f"Connection failed: {e}")
                time.sleep(5)  # 每5秒检查一次连接状态

        threading.Thread(target=run, daemon=True).start()

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

    def publish(self, topic, payload):
        if not self.connected:
            logging.warning("Not connected. Message not sent.")
            return False
        try:
            self.client.publish(topic, payload)
            return True
        except Exception as e:
            logging.error(f"Failed to publish message: {e}")
            return False

# 使用示例
mqtt_client = MQTTClient()
mqtt_client.start()

def publish_data():
    while True:
        data = {
            "temperature": round(random.uniform(20, 30), 2),
            "pressure": round(random.uniform(100, 200), 2),
            "status": random.choice(["normal", "warning", "error"])
        }
        success = mqtt_client.publish(MQTT_TOPIC_PUBLISH, json.dumps(data))
        if success:
            logging.info(f"Published data: {data}")
        else:
            logging.warning("Failed to publish data")
        time.sleep(5)  # 每5秒发送一次数据

# 启动发布和接收线程
threading.Thread(target=publish_data, daemon=True).start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    logging.info("Exiting...")
    mqtt_client.stop()