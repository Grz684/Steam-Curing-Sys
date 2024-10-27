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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import "vue-keyboard-virtual-next/keyboard.min.css";
import KeyBoard from "vue-keyboard-virtual-next";

const wifiStatus = ref('未连接');
const ssid = ref('');
const password = ref('');

const validateWifi = () => {
  alert('验证 WiFi: ' + ssid.value);
};

const connectWifi = () => {
  alert('连接到 WiFi: ' + ssid.value);
  wifiStatus.value = '已连接到 ' + ssid.value;
};

const change = (value, inputEl) => {
  if (inputEl.placeholder === 'WiFi 名称') {
    ssid.value = value;
  } else if (inputEl.placeholder === 'WiFi 密码') {
    password.value = value;
  }
};
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
</style>