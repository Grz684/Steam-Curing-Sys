<template>
  <div class="sprinkler-system">
    <div class="controls">
      <div class="input-group">
        <label>单次运行时间 (秒):</label>
        <input id="singleRunTime" type="number" v-model="tempSingleRunTime" @blur="updateSingleRunTime" min="1" />
      </div>
      <div class="input-group">
        <label>运行时间间隔 (秒):</label>
        <input id="runIntervalTime" type="number" v-model="tempRunIntervalTime" @blur="updateRunIntervalTime" min="0" />
      </div>
      <div class="input-group">
        <label>循环时间间隔 (秒):</label>
        <input id="loopInterval" type="number" v-model="tempLoopInterval" @blur="updateLoopInterval" min="0" />
      </div>
      <div class="button-group">
        <button @click="setAutoMode" :class="{ active: isAutoMode }">自动模式</button>
        <button @click="setManualMode" :class="{ active: !isAutoMode }">手动模式</button>
        <button @click="startSystem" :disabled="isRunning || !isAutoMode">开始</button>
        <button @click="stopSystem" :disabled="!isRunning || !isAutoMode">停止</button>
      </div>
    </div>
    <div class="visualization">
      <div v-for="n in 10" :key="n" class="sprinkler" 
           :class="{ active: isAutoMode ? activeSprinkler === n : waterLevels[n-1] > 0 }"
           @click="!isAutoMode && toggleManualSprinkler(n)">
        <div class="water" :style="{ height: waterHeight(n) + '%' }"></div>
        <span>{{ n }}</span>
      </div>
    </div>
    <div class="status">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, computed} from 'vue'
import { useWebChannel } from './useWebChannel'
  
const currentSingleRunTime = ref(5)
const currentRunIntervalTime = ref(2)
const currentLoopInterval = ref(10)
const nextSingleRunTime = ref(currentSingleRunTime.value)
const nextRunIntervalTime = ref(currentRunIntervalTime.value)
const nextLoopInterval = ref(currentLoopInterval.value)
const tempSingleRunTime = ref(currentSingleRunTime.value)
const tempRunIntervalTime = ref(currentRunIntervalTime.value)
const tempLoopInterval = ref(currentLoopInterval.value)
const isRunning = ref(false)
const activeSprinkler = ref(0)
const currentPhase = ref('')
const waterLevels = ref(Array(10).fill(0))
const isAutoMode = ref(true)
const remainingTime = ref(0)

const { sendToPyQt } = useWebChannel()
  
  //环境信息
  const environment = reactive({
    isPyQtWebEngine: false
  })
  
  onMounted(() => {
    // 检查是否在PyQt的QWebEngine环境中
    environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport
    
    if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中运行')
      // 可以在这里进行PyQt环境特定的初始化
      const { message } = useWebChannel()
      watch(message, (newMessage) => {
        if (newMessage && newMessage.type === 'update_sprinkler_settings') {
          try {
            const settings = JSON.parse(newMessage.content)
            // 更新所有的 ref
            currentSingleRunTime.value = settings.singleRunTime
            currentRunIntervalTime.value = settings.runIntervalTime
            currentLoopInterval.value = settings.loopInterval
  
            console.log('Sprinkler Settings updated:', settings);
              } catch (error) {
                console.error('Failed to parse sprinkler settings data:', error)
              }
        }
      })
    } else {
      console.log('在普通网页环境中运行')
      // 可以在这里进行普通网页环境特定的初始化
    }
  })

const statusMessage = computed(() => {
  if (!isAutoMode.value) return '手动模式'
  if (!isRunning.value) return '系统未运行'
  if (currentPhase.value === 'run') return `喷头 ${activeSprinkler.value} 正在运行，剩余 ${remainingTime.value+1} 秒`
  if (currentPhase.value === 'interval') return `运行间隔中，剩余 ${remainingTime.value+1} 秒`
  if (currentPhase.value === 'loop') return `循环间隔中，剩余 ${remainingTime.value+1} 秒`
  return ''
})

let timer
let waterTimer

function updateSingleRunTime() {
  nextSingleRunTime.value = parseInt(tempSingleRunTime.value) || 1
  updateSprinklerSettings()
}

function updateRunIntervalTime() {
  nextRunIntervalTime.value = parseInt(tempRunIntervalTime.value) || 0
  updateSprinklerSettings()
}

function updateLoopInterval() {
  nextLoopInterval.value = parseInt(tempLoopInterval.value) || 0
  updateSprinklerSettings()
}

function updateSprinklerSettings() {
  // 检查是否在PyQt的QWebEngine环境中
  if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中执行更新设置');
      const settings = {
        singleRunTime: nextSingleRunTime.value,
        runIntervalTime: nextRunIntervalTime.value,
        loopInterval: nextLoopInterval.value
      }
      sendToPyQt('updateSprinklerSettings', settings);
    } else {
      console.log('在普通网页环境中执行更新设置');
      // 这里可以添加网页端特定的逻辑，比如发送AJAX请求
    }
}

function startSystem() {
  if (isRunning.value || !isAutoMode.value) return
  isRunning.value = true
  waterLevels.value = Array(10).fill(0)
  runCycle()
}

function stopSystem() {
  isRunning.value = false
  clearTimeout(timer)
  clearInterval(waterTimer)
  activeSprinkler.value = 0
  currentPhase.value = ''
  waterLevels.value = Array(10).fill(0)
  remainingTime.value = 0
}

function runCycle() {
  activeSprinkler.value = 1
  runSprinkler()
}

function updateRemainingTime() {
  if (!isRunning.value || !isAutoMode.value) return
  remainingTime.value--
  if (remainingTime.value > 0) {
    setTimeout(updateRemainingTime, 1000)
  }
}

function runSprinkler() {
  if (!isRunning.value || !isAutoMode.value) return

  currentPhase.value = 'run'
  currentSingleRunTime.value = nextSingleRunTime.value
  remainingTime.value = currentSingleRunTime.value
  updateRemainingTime()

  let startTime = Date.now()
  waterTimer = setInterval(() => {
    let elapsedTime = Date.now() - startTime
    let progress = Math.min(elapsedTime / (currentSingleRunTime.value * 1000), 1)
    waterLevels.value[activeSprinkler.value - 1] = progress * 100
  }, 100)

  timer = setTimeout(() => {
    clearInterval(waterTimer)
    if (activeSprinkler.value < 10) {
      runInterval()
    } else {
      runLoopInterval()
    }
  }, currentSingleRunTime.value * 1000)
}

function runInterval() {
  if (!isRunning.value || !isAutoMode.value) return

  currentPhase.value = 'interval'
  currentRunIntervalTime.value = nextRunIntervalTime.value
  remainingTime.value = currentRunIntervalTime.value
  updateRemainingTime()

  timer = setTimeout(() => {
    activeSprinkler.value++
    runSprinkler()
  }, currentRunIntervalTime.value * 1000)
}

function runLoopInterval() {
  if (!isRunning.value || !isAutoMode.value) return

  currentPhase.value = 'loop'
  currentLoopInterval.value = nextLoopInterval.value
  remainingTime.value = currentLoopInterval.value
  updateRemainingTime()

  activeSprinkler.value = 0
  timer = setTimeout(() => {
    waterLevels.value = Array(10).fill(0)
    runCycle()
  }, currentLoopInterval.value * 1000)
}

function waterHeight(n) {
  return waterLevels.value[n - 1]
}

function setAutoMode() {
  if (isAutoMode.value) return
  isAutoMode.value = true
  stopSystem()
}

function setManualMode() {
  if (!isAutoMode.value) return
  isAutoMode.value = false
  stopSystem()
}

function toggleManualSprinkler(n) {
  if (isAutoMode.value) return
  waterLevels.value[n - 1] = waterLevels.value[n - 1] > 0 ? 0 : 100
}
</script>

<style scoped>
.sprinkler-system {
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.input-group label {
  flex-grow: 1;
  margin-right: 10px;
}
.input-group input {
  width: 60px;
  border: 1px solid #ccc;
  outline: none;
  padding: 5px;
}
.input-group input:focus {
  border-color: #4CAF50;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
button {
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
}
button.active {
  background-color: #4CAF50;
  color: white;
}
.visualization {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
.sprinkler {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: black;
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  cursor: pointer;
}
.sprinkler.active {
  border-color: #4CAF50;
}
.water {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0%;
  background: rgba(33, 150, 243, 0.5);
  transition: height 0.1s linear;
  z-index: 1;
}
.sprinkler span {
  position: relative;
  z-index: 2;
}
.status {
  margin-top: 20px;
  font-weight: bold;
}
</style>