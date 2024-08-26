from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='steam_curing_sys',
            executable='main_sys',
            name='main_sys',
            output='screen'
        ),
        Node(
            package='temp_humidity_publisher',
            executable='sensor_publisher',
            name='sensor_publisher',
            output='screen'
        )
    ])