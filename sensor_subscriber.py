import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from rclpy.timer import Timer

class SensorSubscriber(Node):

    def __init__(self):
        super().__init__('sensor_subscriber')
        
        self.temp_data = {f'temperature_sensor_{i}': -1 for i in range(1, 5)}
        self.humidity_data = {f'humidity_sensor_{i}': -1 for i in range(1, 5)}

        self.temp_lower_limit = 25.0
        self.temp_upper_limit = 30.0
        self.humidity_lower_limit = 40.0
        self.humidity_upper_limit = 60.0

        self.heater_on = False
        self.humidifier_on = False
        
        # 创建4个温度传感器和4个湿度传感器的订阅者
        for i in range(1, 5):
            self.create_subscription(
                Float32,
                f'temperature_sensor_{i}',
                lambda msg, sensor=f'temperature_sensor_{i}': self.temp_callback(msg, sensor),
                10)
            self.create_subscription(
                Float32,
                f'humidity_sensor_{i}',
                lambda msg, sensor=f'humidity_sensor_{i}': self.humidity_callback(msg, sensor),
                10)

        # 创建一个定时器，每秒触发一次
        self.timer = self.create_timer(1.0, self.timer_callback)

        self.get_logger().info('Sensor Subscriber node has been started')

    def temp_callback(self, msg, sensor_name):
        self.temp_data[sensor_name] = msg.data

    def humidity_callback(self, msg, sensor_name):
        self.humidity_data[sensor_name] = msg.data

    def timer_callback(self):
        sensor_data = []
    
        for i in range(1, 5):
            sensor_name = f'temperature_sensor_{i}'
            value = self.temp_data[sensor_name]
            if value != -1:
                sensor_data.append((f'温度传感器{i}', f'{value:.1f}°C'))
            else:
                sensor_data.append((f'温度传感器{i}', '未知'))
        
        for i in range(1, 5):
            sensor_name = f'humidity_sensor_{i}'
            value = self.humidity_data[sensor_name]
            if value != -1:
                sensor_data.append((f'湿度传感器{i}', f'{value:.1f}%'))
            else:
                sensor_data.append((f'湿度传感器{i}', '未知'))

        # 如果有数据，则处理和打印
        if sensor_data:
            self.get_logger().info('Sensor Data:')
            for sensor, value in sensor_data:
                self.get_logger().info(f'{sensor}: {value}')
            self.get_logger().info('-' * 40)  # 打印一行破折号作为分隔线

        # 处理温度传感器数据
        updated_temp_data = {sensor: value for sensor, value in self.temp_data.items() if value != -1}
        if updated_temp_data:
            self.process_temperature_data(updated_temp_data)

        # 处理湿度传感器数据
        updated_humidity_data = {sensor: value for sensor, value in self.humidity_data.items() if value != -1}
        if updated_humidity_data:
            self.process_humidity_data(updated_humidity_data)

        # 重置数据为-1，为下一秒做准备
        self.temp_data = {sensor: -1 for sensor in self.temp_data}
        self.humidity_data = {sensor: -1 for sensor in self.humidity_data}

    def process_temperature_data(self, data):
        self.get_logger().info(f'Processing temperature data: {data}')
        
        # 检查是否有温度低于下限
        if any(temp < self.temp_lower_limit for temp in data.values()):
            self.turn_heater_on()
        # 检查是否所有温度都高于上限
        elif all(temp > self.temp_upper_limit for temp in data.values()):
            self.turn_heater_off()
        
        # 记录当前加热器状态
        self.get_logger().info(f'Current heater status: {"ON" if self.heater_on else "OFF"}')
        self.get_logger().info('-' * 40)  # 打印一行破折号作为分隔线

    def process_humidity_data(self, data):
        self.get_logger().info(f'Processing humidity data: {data}')
        
        # 检查是否有湿度低于下限
        if any(humidity < self.humidity_lower_limit for humidity in data.values()):
            self.turn_humidifier_on()
        # 检查是否所有湿度都高于上限
        elif all(humidity > self.humidity_upper_limit for humidity in data.values()):
            self.turn_humidifier_off()
        
        # 记录当前加湿器状态
        self.get_logger().info(f'Current humidifier status: {"ON" if self.humidifier_on else "OFF"}')
        self.get_logger().info('-' * 40)  # 打印一行破折号作为分隔线

    def turn_heater_on(self):
        if not self.heater_on:
            self.heater_on = True
            self.get_logger().info('Turning heater ON')

    def turn_heater_off(self):
        if self.heater_on:
            self.heater_on = False
            self.get_logger().info('Turning heater OFF')

    def turn_humidifier_on(self):
        if not self.humidifier_on:
            self.humidifier_on = True
            self.get_logger().info('Turning humidifier ON')

    def turn_humidifier_off(self):
        if self.humidifier_on:
            self.humidifier_on = False
            self.get_logger().info('Turning humidifier OFF')

def main(args=None):
    rclpy.init(args=args)
    sensor_subscriber = SensorSubscriber()
    rclpy.spin(sensor_subscriber)
    sensor_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()