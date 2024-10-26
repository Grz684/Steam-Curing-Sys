<template>
  <div class="app-container">
    <h1>涪特智能养护台车控制系统</h1>
    <SensorDisplay />
    <DataExport />
    <SensorSettings />
    <!-- <SteamEngineControl />
    <SprinklerSystem /> -->
    <IntegratedControlSystem :message="messageForB"/>
    <!-- <CartSystem /> -->
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

</style>