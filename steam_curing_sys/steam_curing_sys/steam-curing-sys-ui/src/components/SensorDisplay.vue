<script setup>
import { ref, onMounted, watch } from 'vue'

const sensorData = ref({ temperature: {}, humidity: {} })
// 新增传感器调整值的存储结构
const sensorAdjustments = ref({
  temperature: {},
  humidity: {}
})

const selectedSensor = ref(null)
const showDialog = ref(false)
const adjustmentType = ref('offset') // 'offset' or 'value'
const sensorType = ref('') // 'temperature' or 'humidity'
const sensor_debug_mode = ref(false)

import { useWebChannel } from './useWebChannel.js'
const { sendToPyQt } = useWebChannel();

onMounted(() => {
  if (typeof window.qt !== 'undefined' && window.qt.webChannelTransport) {
    console.log('在PyQt QWebEngine环境中执行');
    const { message } = useWebChannel()
    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'update_sensor_data') {
        try {
          sensorData.value = JSON.parse(newMessage.content)
        } catch (error) {
          console.error('Failed to parse sensor data:', error)
        }
      }
      // 新增：处理调整值数据更新
      else if (newMessage && newMessage.type === 'update_adjust_settings') {
        try {
          const adjustments = JSON.parse(newMessage.content)
          sensorAdjustments.value.temperature = adjustments.temperature
          sensorAdjustments.value.humidity = adjustments.humidity
        } catch (error) {
          console.error('Failed to parse adjustments data:', error)
        }
      }
      else if (newMessage && newMessage.type === 'get_sensor_data') {
        sendToPyQt('update_remote_sensor_data', sensorData.value)
      }
      else if (newMessage && newMessage.type === 'sensor_debug_mode') {
        sensor_debug_mode.value = JSON.parse(newMessage.content)
      }
    })
  } else {
    console.log('在普通网页环境中执行');
    fetchSensorData()
    setInterval(fetchSensorData, 5000)
  }
})

const fetchSensorData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/sensor-data/')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    sensorData.value = data
  } catch (error) {
    console.error('Error fetching sensor data:', error)
  }
}

// 添加数字键盘相关的代码
import NumericKeyboard from './NumericKeyboardWithNeg.vue'
const showNumericKeyboard = ref(false)

// 将 adjustmentValue 的类型从 number 改为 string
const adjustmentValue = ref('')

// 修改 openAdjustDialog 函数，显示当前的调整值
const openAdjustDialog = (type, sensor) => {
  selectedSensor.value = sensor
  sensorType.value = type
  
  // 从调整值存储中获取数据
  const adjustment = sensorAdjustments.value[type][sensor]
  if (adjustment) {
    adjustmentType.value = adjustment.type
    adjustmentValue.value = String(adjustment.value)
  } else {
    adjustmentType.value = 'offset'
    adjustmentValue.value = ''
  }
  
  showDialog.value = true
  showNumericKeyboard.value = false
}

// 修改 applyAdjustment 函数
const applyAdjustment = async () => {
  try {
    const payload = {
      sensorType: sensorType.value,
      sensorId: selectedSensor.value,
      adjustmentType: adjustmentType.value,
      value: parseFloat(adjustmentValue.value) || 0
    }
    
    // 更新本地调整值存储
    if (!sensorAdjustments.value[sensorType.value]) {
      sensorAdjustments.value[sensorType.value] = {}
    }
    sensorAdjustments.value[sensorType.value][selectedSensor.value] = {
      type: adjustmentType.value,
      value: parseFloat(adjustmentValue.value) || 0
    }
    
    if (typeof window.qt !== 'undefined' && window.qt.webChannelTransport) {
      sendToPyQt('adjust_sensor', payload)
    }
    
    showDialog.value = false
    adjustmentValue.value = ''
    showNumericKeyboard.value = false
  } catch (error) {
    console.error('Error applying adjustment:', error)
  }
}
</script>

<template>
  <div class="sensor-data-group">
    <div class="sensor-section">
      <h2>温度传感器【温感1与温感2为温湿度传感器温度数据，温感3与温感4分别为左侧水箱、右侧水箱温度数据】</h2>
      <div class="sensor-container">
        <div class="sensor-grid">
          <div v-for="(value, sensor) in sensorData.temperature" 
               :key="sensor" 
               class="sensor-card"
               @click="sensor_debug_mode ? openAdjustDialog('temperature', sensor) : null">
            <div class="sensor-title">{{ sensor }}</div>
            <div class="sensor-value">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="sensor-section">
      <h2>湿度传感器【湿感1与湿感2分别为左侧、右侧湿度数据】</h2>
      <div class="sensor-container">
        <div class="sensor-grid">
          <div v-for="(value, sensor) in sensorData.humidity" 
               :key="sensor" 
               class="sensor-card"
               @click="sensor_debug_mode ? openAdjustDialog('humidity', sensor) : null">
            <div class="sensor-title">{{ sensor }}</div>
            <div class="sensor-value">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>

  <!-- 修改调整对话框部分 -->
  <div v-if="showDialog" class="dialog-overlay">
    <div class="dialog">
      <h3>调整传感器: {{ selectedSensor }}</h3>
      <div class="dialog-content">
        <div class="radio-group">
          <label>
            <input type="radio" v-model="adjustmentType" value="offset">
            调整偏移值
          </label>
          <label>
            <input type="radio" v-model="adjustmentType" value="value">
            直接设置值
          </label>
        </div>
        
        <div class="input-group">
          <input 
            type="text" 
            v-model="adjustmentValue" 
            readonly
            @click="showNumericKeyboard = true"
            :placeholder="adjustmentType === 'offset' ? '输入偏移值' : '输入设定值'"
          >
        </div>
      </div>
      
      <div class="dialog-actions">
        <button @click="showDialog = false">取消</button>
        <button @click="applyAdjustment" class="primary">确定</button>
      </div>
    </div>

    <!-- 添加数字键盘组件 -->
    <NumericKeyboard
      v-model="adjustmentValue"
      v-model:showKeyboard="showNumericKeyboard"
    />
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}

.sensor-data-group {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

h2 {
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 20px;
}

.sensor-section {
  display: block;
  margin-bottom: 10px;
  clear: both;
}

.sensor-container {
  overflow-x: scroll;
  padding-bottom: 10px;
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 10px;
}

.sensor-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.sensor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.sensor-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.sensor-value {
  font-size: 16px;
  color: #007bff;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.dialog-content {
  margin-bottom: 20px;
}

.radio-group {
  margin-bottom: 15px;
  font-size: 16px;
}

.radio-group label {
  margin-right: 15px;
  cursor: pointer;
}

.input-group input {
  width: 90%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 16px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  font-size: 16px;
}

.dialog-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions button.primary {
  background-color: #007bff;
  color: white;
}

.dialog-actions button:not(.primary) {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .sensor-grid {
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(8, minmax(100px, 1fr));
  }
  
  .dialog {
    width: 95%;
    margin: 10px;
  }
}
</style>