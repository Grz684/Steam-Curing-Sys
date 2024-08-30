import sys
if sys.prefix == '/usr':
    sys.real_prefix = sys.prefix
    sys.prefix = sys.exec_prefix = '/home/grz/Steam-Curing-Sys/install/temp_humidity_publisher'
