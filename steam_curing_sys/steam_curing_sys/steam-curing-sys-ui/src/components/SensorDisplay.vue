<script setup>
import { ref, onMounted, watch } from 'vue'

// const temperatures = ref([])
// const humidities = ref([])
const sensorData = ref({ temperature: {}, humidity: {} })

import { useWebChannel } from './useWebChannel.js'

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
    })
  } else {
    console.log('在普通网页环境中执行');
    // 这里可以添加网页端特定的逻辑，比如发送AJAX请求
    fetchSensorData()
    // 每5秒更新一次数据
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
    
    // 假设返回的数据结构与 sensorData 匹配
    sensorData.value = data

  } catch (error) {
    console.error('Error fetching sensor data:', error)
    // 在这里可以添加错误处理逻辑，比如显示错误消息给用户
  }
}

</script>

<template>
  <div class="sensor-data-group">
    <div class="sensor-section">
      <h2>温度传感器</h2>
      <div class="sensor-container">
        <div class="sensor-grid">
          <div v-for="(value, sensor) in sensorData.temperature" :key="sensor" class="sensor-card">
            <div class="sensor-title">{{ sensor }}</div>
            <div class="sensor-value">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sensor-section">
      <h2>湿度传感器</h2>
      <div class="sensor-container">
        <div class="sensor-grid">
          <div v-for="(value, sensor) in sensorData.humidity" :key="sensor" class="sensor-card">
            <div class="sensor-title">{{  sensor }}</div>
            <div class="sensor-value">{{ value }}</div>
          </div>
        </div>
      </div>
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
  flex-direction: column; /* 强制子元素垂直排列 */
  max-width: 100%;
  /* margin: 0 auto; */
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
  clear: both; /* 清除浮动 */
}

.sensor-container {
  overflow-x: scroll; /* 始终显示水平滚动条 */
  padding-bottom: 10px;
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(150px, 1fr));
  gap: 10px;
}

.sensor-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sensor-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.sensor-value {
  font-size: 1.2em;
  color: #007bff;
}

@media (max-width: 768px) {
  .sensor-grid {
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(8, minmax(100px, 1fr));
  }
}
</style>