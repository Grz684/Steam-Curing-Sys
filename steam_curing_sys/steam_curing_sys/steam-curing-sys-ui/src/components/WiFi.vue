<template>
  <div class="wifi-component">
    <div class="row">
      <div class="column">
        <input v-model="ssid" placeholder="WiFi 名称" data-mode>
      </div>
      <div class="column">
        <div class="status">
          WiFi 状态: {{ wifiStatus }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <input v-model="password" placeholder="WiFi 密码" data-mode>
      </div>
      <div class="column">
        <div class="button-group">
          <button @click="validateWifi">搜索可用 WiFi</button>
          <button @click="connectWifi">连接 WiFi</button>
        </div>
      </div>
    </div>
    <KeyBoard 
      :color="'#2c3e50'" 
      :showHandleBar="false" 
      :closeOnClickModal="false" 
      @change='change' 
      class="scaled-keyboard"
    />
    
    <!-- WiFi搜索结果弹窗 -->
    <div v-if="showWifiList" class="wifi-modal">
      <div class="wifi-modal-content">
        <h2>可用的WiFi网络</h2>
        <div class="wifi-list">
          <div v-if="wifiList.length === 0" class="no-wifi">
            <div class="loading-spinner"></div>
            <div>搜索中...</div>
          </div>
          <div v-else v-for="wifi in wifiList" 
               :key="wifi.ssid" 
               class="wifi-item"
               @click="selectWifi(wifi)">
            <span class="wifi-ssid"> {{ wifi.ssid }}</span>
            <span class="signal-strength">信号强度: {{ wifi.signal }}</span>
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="searchWifi">重新搜索</button>
          <button @click="closeWifiList">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import "vue-keyboard-virtual-next/keyboard.min.css";
import KeyBoard from "vue-keyboard-virtual-next";
import { useWebChannel } from './useWebChannel';

const { sendToPyQt, message } = useWebChannel();

const wifiStatus = ref('未连接');
const ssid = ref('');
const password = ref('');
const showWifiList = ref(false);
const wifiList = ref([]);

const validateWifi = async () => {
  // 先设置显示弹窗
  showWifiList.value = true;
  // 清空列表并显示加载状态
  wifiList.value = [];

  // 禁止背景滚动
  document.body.style.overflow = 'hidden';
  
  // 发送搜索请求
  searchWifi();
};

const searchWifi = () => {
  wifiList.value = [];
  sendToPyQt('search_wifi', {});
};

const closeWifiList = () => {
  showWifiList.value = false;

  // 恢复背景滚动
  document.body.style.overflow = 'auto';
};

const selectWifi = (wifi) => {
  ssid.value = wifi.ssid;
  closeWifiList();
};

const connectWifi = () => {
  sendToPyQt('connect_wifi', {
    ssid: ssid.value,
    password: password.value
  });
};

const change = (value, inputEl) => {
  if (inputEl.placeholder === 'WiFi 名称') {
    ssid.value = value;
  } else if (inputEl.placeholder === 'WiFi 密码') {
    password.value = value;
  }
};

watch(message, (newMessage) => {
  const content = JSON.parse(newMessage?.content);
  if (newMessage?.type === 'wifi_list') {
    wifiList.value = content;
  } else if (newMessage?.type === 'wifi_connection') {
    wifiStatus.value = content.status;
  }
});
</script>

<style scoped>
.wifi-component {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  margin: 10px auto;
  box-sizing: border-box;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  padding: 0 5px;
}

.wifi-ssid {
  font-size: 14px;
}

.status {
  font-size: 18px;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  text-align: center;
}

input {
  font-size: 18px; 
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

button {
  font-size: 18px;
  width: 48%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.scaled-keyboard {
  transform: scale(0.8);
  transform-origin: bottom center;
}

.wifi-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.wifi-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
}

.wifi-list {
  max-height: 300px;
  overflow-y: auto;
  margin: 20px 0;
}

.wifi-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.wifi-item:hover {
  background-color: #f5f5f5;
}

.signal-strength {
  color: #666;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.no-wifi {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  margin: 0 auto 10px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>