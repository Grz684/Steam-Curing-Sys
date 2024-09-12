<template>
  <div class="settings-container">
    <h1>智能蒸汽养护系统</h1>
    <SensorDisplay />
    <DataExport />
    <SensorSettings />
    <!-- <SteamEngineControl />
    <SprinklerSystem /> -->
    <IntegratedControlSystem />
    <CartSystem />
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
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0px;
}

.settings-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  body {
    padding: 10px;
  }
  
  .settings-container {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  body {
    padding: 5px;
  }
  
  .settings-container {
    padding: 10px;
  }
}
</style>