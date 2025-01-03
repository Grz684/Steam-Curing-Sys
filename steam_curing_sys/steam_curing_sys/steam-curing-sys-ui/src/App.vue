<template>
  <div class="app-container">
    <h1>涪特智能养护台车控制系统</h1>
    <SensorDisplay />
    <DataExport />
    <SensorSettings />
    <!-- <SteamEngineControl />
    <SprinklerSystem /> -->
    <div class="control-row">
      <div class="control-item">
        <IntegratedControlSystem :message="messageForB"/>
      </div>
      <div class="control-item">
        <CartSystem :message="messageForB"/>
      </div>
    </div>
    <WiFi />
    <Lock @messageFromA="handleMessage"/>
  </div>
</template>

<script setup>
import { provideWebChannel } from './components/useWebChannel'
provideWebChannel()
import SensorSettings from './components/SensorSettings.vue'
import SensorDisplay from './components/SensorDisplay.vue';
import SprinklerSystem from './components/SprinklerSystem.vue';
import CartSystem from './components/CartSystem.vue';
import SteamEngineControl from './components/SteamEngineControl.vue';
import IntegratedControlSystem from './components/IntegratedControlSystem.vue';
import DataExport from './components/DataExport.vue';
import VirtualKeyBoard from './components/VirtualKeyBoard.vue';
import WiFi from './components/WiFi.vue';
import Lock from './components/Lock.vue';
import { ref } from 'vue'

const messageForB = ref('')

const handleMessage = (msg) => {
  messageForB.value = msg  // msg现在是一个对象，包含content和timestamp
}
</script>

<style>
html, body {
  touch-action: pan-x pan-y;
  -ms-touch-action: pan-x pan-y;
  user-zoom: fixed;
  -ms-user-zoom: fixed;
}

.app-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #2c3e50;;
  font-size: 28px;
}

.control-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 确保顶端对齐 */
  gap: 30px; /* 增加间距 */
  margin: 10px 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px; /* 可以添加左右内边距 */
}

.control-item {
  flex: 1;
  min-width: 0;
  max-width: calc(50% - 15px); /* 考虑到间距的宽度计算 */
}

.control-item > * {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
</style>