<template>
  <div class="settings-container">
    <div class="setting-group">
      <h2>温度设置 (°C)</h2>
      <div class="setting-item">
        <span class="setting-label">上限：</span>
        <div class="setting-controls">
          <button @click="adjustValue('tempUpper', -1)">-</button>
          <input type="number" v-model.lazy.number="tempUpper" @blur="validateTemp('upper')">
          <button @click="adjustValue('tempUpper', 1)">+</button>
        </div>
      </div>
      <div class="setting-item">
        <span class="setting-label">下限：</span>
        <div class="setting-controls">
          <button @click="adjustValue('tempLower', -1)">-</button>
          <input type="number" v-model.lazy.number="tempLower" @blur="validateTemp('lower')">
          <button @click="adjustValue('tempLower', 1)">+</button>
        </div>
      </div>
    </div>
    <div class="setting-group">
      <h2>湿度设置 (%)</h2>
      <div class="setting-item">
        <span class="setting-label">上限：</span>
        <div class="setting-controls">
          <button @click="adjustValue('humidityUpper', -1)">-</button>
          <input type="number" v-model.lazy.number="humidityUpper" @blur="validateHumidity('upper')">
          <button @click="adjustValue('humidityUpper', 1)">+</button>
        </div>
      </div>
      <div class="setting-item">
        <span class="setting-label">下限：</span>
        <div class="setting-controls">
          <button @click="adjustValue('humidityLower', -1)">-</button>
          <input type="number" v-model.lazy.number="humidityLower" @blur="validateHumidity('lower')">
          <button @click="adjustValue('humidityLower', 1)">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted} from 'vue'

import { useWebChannel } from './useWebChannel'

const { sendToPyQt } = useWebChannel()
//环境信息
const environment = reactive({
  isPyQtWebEngine: false
})

const tempUpper = ref(30)
const tempLower = ref(10)
const humidityUpper = ref(80)
const humidityLower = ref(20)

onMounted(() => {
  // 检查是否在PyQt的QWebEngine环境中
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport
  
  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行')
    // 可以在这里进行PyQt环境特定的初始化
    const { message } = useWebChannel()
    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'update_limit_settings') {
        try {
          const settings = JSON.parse(newMessage.content)
          // 更新所有的 ref
          tempUpper.value = settings['temp_upper'];
          tempLower.value = settings['temp_lower'];
          humidityUpper.value = settings['humidity_upper'];
          humidityLower.value = settings['humidity_lower'];

          console.log('Sensor Settings updated:', settings);
            } catch (error) {
              console.error('Failed to parse sensor settings data:', error)
            }
      }
    })
  } else {
    console.log('在普通网页环境中运行')
    // 可以在这里进行普通网页环境特定的初始化
  }
})

const adjustValue = (type, amount) => {
  const value = type === 'tempUpper' ? tempUpper :
                type === 'tempLower' ? tempLower :
                type === 'humidityUpper' ? humidityUpper :
                humidityLower
  value.value = (value.value || 0) + amount
  if (type.startsWith('temp')) {
    validateTemp(type === 'tempUpper' ? 'upper' : 'lower')
  } else {
    validateHumidity(type === 'humidityUpper' ? 'upper' : 'lower')
  }
}

const validateTemp = (type) => {
  if (tempUpper.value === '') {
    tempUpper.value = tempLower.value + 1
  }

  if (tempLower.value === '') {
    tempLower.value = tempUpper.value - 1
  }

  if (type === 'upper') {
    tempUpper.value = Math.max(tempLower.value + 1, tempUpper.value)
  } else {
    tempLower.value = Math.min(tempUpper.value - 1, tempLower.value)
  }
  updateSettings()
}

const validateHumidity = (type) => {
  if (humidityUpper.value === '') {
    humidityUpper.value = humidityLower.value + 1
  }

  if (humidityLower.value === '') {
    humidityLower.value = humidityUpper.value - 1
  }

  if (type === 'upper') {
    humidityUpper.value = Math.min(100, Math.max(humidityLower.value + 1, humidityUpper.value))
  } else {
    humidityLower.value = Math.max(0, Math.min(humidityUpper.value - 1, humidityLower.value))
  }
  updateSettings()
}

const updateSettings = () => {
  if (tempUpper.value !== '' && tempLower.value !== '' && 
      humidityUpper.value !== '' && humidityLower.value !== '') {
    const settings = {
      "temp_upper": tempUpper.value,
      "temp_lower": tempLower.value,
      "humidity_upper": humidityUpper.value,
      "humidity_lower": humidityLower.value
    };
    
    console.log('设置已更新:', settings);

    // 检查是否在PyQt的QWebEngine环境中
    if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中执行更新设置');
      sendToPyQt('updateLimitSettings', settings);
    } else {
      console.log('在普通网页环境中执行更新设置');
      // 这里可以添加网页端特定的逻辑，比如发送AJAX请求
    }
  }
}
</script>

<style scoped>
.settings-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.setting-group {
  flex: 1;
  padding: 10px;
  margin-bottom: 10px;
}

.setting-group h2 {
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.setting-label {
  flex: 1;
  margin-right: 10px;
  font-size: 18px;
}

.setting-controls {
  display: flex;
  align-items: center;
}

button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}

input {
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="number"]::-webkit-inner-spin-button, 
input[type="number"]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>