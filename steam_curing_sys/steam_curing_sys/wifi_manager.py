from concurrent.futures import ThreadPoolExecutor
import json
import re
import subprocess
import requests
from wifi import Cell, Scheme
import logging
import netifaces

logger = logging.getLogger(__name__)

class WifiManager:
    def __init__(self, bridge):
        self.thread_pool = ThreadPoolExecutor(max_workers=1)
        self.bridge = bridge  # 保存 Bridge 实例的引用
        
    def __del__(self):
        self.shutdown()
        
    def shutdown(self):
        """关闭线程池"""
        if hasattr(self, 'thread_pool'):
            self.thread_pool.shutdown(wait=True)

    @staticmethod
    def get_wifi_name():
        wifi_name = "未连接"
        wifi_result = subprocess.run(['iwconfig', 'wls2'], 
                            capture_output=True, text=True)
        
        if wifi_result.returncode == 0:
            ssid_match = re.search(r'ESSID:"(.*?)"', wifi_result.stdout)
            if ssid_match:
                wifi_name = ssid_match.group(1)
        return wifi_name

    @staticmethod
    def get_zerotier_ip():
        # 获取所有网络接口
        interfaces = netifaces.interfaces()
        
        # 筛选出以zt开头的接口
        zt_interfaces = [iface for iface in interfaces if iface.startswith('zt')]
        
        if not zt_interfaces:
            return None
            
        # 获取第一个zt接口的地址信息
        addrs = netifaces.ifaddresses(zt_interfaces[0])
        
        # 获取IPv4地址
        if netifaces.AF_INET in addrs:
            return addrs[netifaces.AF_INET][0]['addr']
            
        return None

    @staticmethod
    def check_internet():
        try:
            requests.get("https://www.baidu.com", timeout=3)
            return True
        except requests.RequestException:
            return False

    @staticmethod
    def decode_ssid(ssid):
        """解码SSID的辅助函数"""
        if not ssid:
            return None
            
        try:
            # 如果是bytes类型，直接解码
            if isinstance(ssid, bytes):
                return ssid.decode('utf-8')
                
            # 如果是字符串类型
            if isinstance(ssid, str):
                # 检查是否包含转义序列
                if '\\x' in ssid:
                    # 分割普通文本和编码部分
                    parts = []
                    current_text = ''
                    i = 0
                    while i < len(ssid):
                        if ssid[i:i+2] == '\\x':
                            if current_text:
                                parts.append(current_text)
                                current_text = ''
                            # 收集所有连续的十六进制转义序列
                            hex_str = ''
                            while i < len(ssid) and ssid[i:i+2] == '\\x':
                                hex_str += ssid[i+2:i+4]
                                i += 4
                            try:
                                decoded = bytes.fromhex(hex_str).decode('utf-8')
                                parts.append(decoded)
                            except:
                                parts.append(ssid[i-len(hex_str)-2:i])
                        else:
                            current_text += ssid[i]
                            i += 1
                    if current_text:
                        parts.append(current_text)
                    return ''.join(parts)
                return ssid
        except Exception as e:
            logger.warning(f"Failed to decode SSID: {e}")
            return ssid
        return None

    def get_cell(self, ssid):
        networks = Cell.all('wls2')
        for network in networks:
            if network.ssid == ssid:
                return network
        return None

    def check_wifi_status(self):
        """检查WiFi状态"""
        future = self.thread_pool.submit(self._check_wifi_status_worker)
        future.add_done_callback(self._wifi_status_checked)

    def _check_wifi_status_worker(self):
        try:
            wifi_name = self.get_wifi_name()
            internet_result = self.check_internet()
            internet_status = "已联网" if internet_result else "无网络"
            zerotier_ip = self.get_zerotier_ip()
            zerotier_ip_status = f"{zerotier_ip}" if zerotier_ip else "未知"

                
            return {
                "success": True,
                "wifi_name": wifi_name,
                "internet_status": internet_status,
                "zerotier_ip": zerotier_ip_status
            }
            
        except Exception as e:
            return {
                "success": False, 
                "error": str(e)
            }

    def _wifi_status_checked(self, future):
        try:
            result = future.result()
            
            if result["success"]:
                self.bridge.send_message(
                    "wifi_status",
                    json.dumps({
                        "wifi_name": result["wifi_name"],
                        "internet_status": result["internet_status"], 
                        "zerotier_ip": result["zerotier_ip"]
                    })
                )
            else:
                logger.error(f"Error in wifi_status_checked callback: {result['error']}")
                
        except Exception as e:
            logger.error(f"Error in wifi_status_checked: {str(e)}")

    def search_wifi(self):
        """搜索可用WiFi"""
        future = self.thread_pool.submit(self._search_wifi_worker)
        future.add_done_callback(self._wifi_search_completed)

    def _search_wifi_worker(self):
        try:
            networks = Cell.all('wls2')
            wifi_list = []

            for network in networks:
                try:
                    decoded_ssid = self.decode_ssid(network.ssid)
                    if not decoded_ssid or decoded_ssid.strip() == '' or '\x00' in decoded_ssid:
                        continue

                    signal_strength = min(100, max(0, int(((network.signal + 100) / 60) * 100)))

                    wifi_info = {
                        'ssid': decoded_ssid,
                        'signal': f"{signal_strength}%",
                        'encrypted': network.encrypted
                    }
                    wifi_list.append(wifi_info)
                except Exception as e:
                    logger.warning(f"Skip WiFi with invalid SSID: {str(e)}")
                    continue

            seen_ssids = {}
            for wifi in wifi_list:
                ssid = wifi['ssid']
                current_signal = int(wifi['signal'].rstrip('%'))
                
                if ssid not in seen_ssids or current_signal > int(seen_ssids[ssid]['signal'].rstrip('%')):
                    seen_ssids[ssid] = wifi

            unique_wifi_list = list(seen_ssids.values())
            unique_wifi_list.sort(key=lambda x: int(x['signal'].rstrip('%')), reverse=True)

            return unique_wifi_list

        except Exception as e:
            logger.error(f"Failed to search WiFi networks: {e}")
            return []

    def _wifi_search_completed(self, future):
        try:
            wifi_list = future.result()
            logger.info(f"WiFi networks found: {wifi_list}")
            self.bridge.send_message("wifi_list", json.dumps(wifi_list))
        except Exception as e:
            logger.error(f"Error in wifi search completion: {e}")

    def connect_wifi(self, args):
        """连接WiFi"""
        future = self.thread_pool.submit(self._connect_wifi_worker, args)
        future.add_done_callback(self._wifi_connect_completed)

    def _connect_wifi_worker(self, args):
      try:
          ssid = args['ssid']
          password = args['password']
          
          # 删除已存在的连接
          subprocess.run(['nmcli', 'connection', 'delete', ssid], 
                        stderr=subprocess.DEVNULL)
          
          # 添加并连接新的 WiFi
          result = subprocess.run(
              ['nmcli', 'device', 'wifi', 'connect', ssid, 
              'password', password, 'ifname', 'wls2'],
              capture_output=True,
              text=True
          )
          
          if result.returncode != 0:
              error_msg = result.stderr.strip()
              if "Timeout" in error_msg:
                  return {
                      "success": False,
                      "error": "网络连接超时，请检查WiFi是否存在"
                  }
              elif "password" in error_msg.lower():
                  return {
                      "success": False,
                      "error": "WiFi密码错误"
                  }
              else:
                  return {
                      "success": False,
                      "error": f"连接失败: {error_msg}"
                  }
          
          internet_result = self.check_internet()
          internet_status = "已联网" if internet_result else "无网络"

          zerotier_ip = self.get_zerotier_ip()
          zerotier_ip_status = f"{zerotier_ip}" if zerotier_ip else "未知"
          
          return {
              "success": True,
              "wifi_name": ssid,
              "internet_status": internet_status,
              "zerotier_ip": zerotier_ip_status
          }
          
      except Exception as e:
          return {
              "success": False,
              "error": str(e)
          }

    def _wifi_connect_completed(self, future):
        try:
            result = future.result()
            
            if result["success"]:
                self.bridge.send_message(
                    "wifi_status",
                    json.dumps({
                        "wifi_name": result["wifi_name"],
                        "internet_status": result["internet_status"], 
                        "zerotier_ip": result["zerotier_ip"]
                    })
                )
            else:
                logger.error(f"Error in wifi connect callback: {result['error']}")
                
        except Exception as e:
            logger.error(f"Error in wifi connect: {e}")