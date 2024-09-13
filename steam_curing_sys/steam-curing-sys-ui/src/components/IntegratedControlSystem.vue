<template>
  <div class="integrated-control-system">
    <h2>集成控制系统</h2>
    
    <div class="mode-controls">
      <button @click="setMode('auto')" :class="{ active: isAutoMode }" class="mode-btn">自动模式</button>
      <button @click="setMode('manual')" :class="{ active: !isAutoMode }" class="mode-btn">手动模式</button>
      <button @click="startSystem" :disabled="isRunning || !isAutoMode" class="control-btn">开始</button>
      <button @click="stopSystem" :disabled="!isRunning || !isAutoMode" class="control-btn">停止</button>
    </div>

    <div class="systems-container">
      <div class="steam-engine-control">
        <h3>蒸汽机控制系统</h3>
        <div class="control-panel">
          <div class="engine-status">
            <div class="engine left">
              <h4>左蒸汽机</h4>
              <div class="status" :class="{ 'on': leftEngineOn }">
                <div class="status-indicator"></div>
                {{ leftEngineOn ? '开' : '关' }}
              </div>
              <button @click="toggleLeftEngine" :disabled="isAutoMode" class="control-btn">
                {{ leftEngineOn ? '关闭' : '开启' }}
              </button>
            </div>
            <div class="engine right">
              <h4>右蒸汽机</h4>
              <div class="status" :class="{ 'on': rightEngineOn }">
                <div class="status-indicator"></div>
                {{ rightEngineOn ? '开' : '关' }}
              </div>
              <button @click="toggleRightEngine" :disabled="isAutoMode" class="control-btn">
                {{ rightEngineOn ? '关闭' : '开启' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="sprinkler-system">
        <h3>喷淋系统</h3>
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
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, watch, reactive, onMounted, computed } from 'vue';
  import { useWebChannel } from './useWebChannel';
  
  // Steam Engine Control
  const leftEngineOn = ref(false);
  const rightEngineOn = ref(false);
  
  // Sprinkler System
  const currentSingleRunTime = ref(5);
  const currentRunIntervalTime = ref(2);
  const currentLoopInterval = ref(10);
  const nextSingleRunTime = ref(currentSingleRunTime.value);
  const nextRunIntervalTime = ref(currentRunIntervalTime.value);
  const nextLoopInterval = ref(currentLoopInterval.value);
  const tempSingleRunTime = ref(currentSingleRunTime.value);
  const tempRunIntervalTime = ref(currentRunIntervalTime.value);
  const tempLoopInterval = ref(currentLoopInterval.value);
  const activeSprinkler = ref(0);
  const currentPhase = ref('');
  const waterLevels = ref(Array(10).fill(0));
  const remainingTime = ref(0);
  
  // Shared state
  const isAutoMode = ref(true);
  const isRunning = ref(false);
  
  const { sendToPyQt } = useWebChannel();
  
  const environment = reactive({
    isPyQtWebEngine: false
  });
  
  onMounted(() => {
    environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;
  
    if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中运行');
      const { message } = useWebChannel();
  
      watch(message, (newMessage) => {
        if (newMessage && newMessage.type === 'update_left_steam_status') {
          leftEngineOn.value = newMessage.content;
        }
        else if (newMessage && newMessage.type === 'update_right_steam_status') {
          rightEngineOn.value = newMessage.content;
        }
        else if (newMessage && newMessage.type === 'update_sprinkler_settings') {
          try {
            const settings = JSON.parse(newMessage.content);
            tempSingleRunTime.value = settings.sprinkler_single_run_time;
            tempRunIntervalTime.value = settings.sprinkler_run_interval_time;
            tempLoopInterval.value = settings.sprinkler_loop_interval;

            nextRunIntervalTime.value = tempRunIntervalTime.value;
            nextSingleRunTime.value = tempSingleRunTime.value;
            nextLoopInterval.value = tempLoopInterval.value;
            console.log('Sprinkler Settings updated:', settings);
          } catch (error) {
            console.error('Failed to parse sprinkler settings data:', error);
          }
        }
      });
    } else {
      console.log('在普通网页环境中运行');
    }
  });
  
  const statusMessage = computed(() => {
    if (!isAutoMode.value) return '手动模式';
    if (!isRunning.value) return '系统未运行';
    if (currentPhase.value === 'run') return `喷头 ${activeSprinkler.value} 正在运行，剩余 ${remainingTime.value+1} 秒`;
    if (currentPhase.value === 'interval') return `运行间隔中，剩余 ${remainingTime.value+1} 秒`;
    if (currentPhase.value === 'loop') return `循环间隔中，剩余 ${remainingTime.value+1} 秒`;
    return '';
  });
  
  let timer;
  let waterTimer;
  
  function setMode(mode) {
    const oldMode = isAutoMode.value;
    isAutoMode.value = mode === 'auto';
    if (environment.isPyQtWebEngine && oldMode !== isAutoMode.value) {
      sendToPyQt('setControlMode', { mode: isAutoMode.value ? 'auto' : 'manual' });
    }
    if (oldMode !== isAutoMode.value) {
      stopSystemWithoutSend();
      // leftEngineOn.value = false;
      // rightEngineOn.value = false;
      // sendToPyQt('setEngineState', { engine: 'left', state: leftEngineOn.value });
      // sendToPyQt('setEngineState', { engine: 'right', state: rightEngineOn.value });
    }
  }
  
  function toggleLeftEngine() {
    if (!isAutoMode.value && environment.isPyQtWebEngine) {
      sendToPyQt('setEngineState', { engine: 'left', state: !leftEngineOn.value });
      leftEngineOn.value = !leftEngineOn.value;
    }
  }
  
  function toggleRightEngine() {
    if (!isAutoMode.value && environment.isPyQtWebEngine) {
      sendToPyQt('setEngineState', { engine: 'right', state: !rightEngineOn.value });
      rightEngineOn.value = !rightEngineOn.value;
    }
  }
  
  function updateSingleRunTime() {
    nextSingleRunTime.value = parseInt(tempSingleRunTime.value) || 1;
    updateSprinklerSettings();
  }
  
  function updateRunIntervalTime() {
    nextRunIntervalTime.value = parseInt(tempRunIntervalTime.value) || 0;
    updateSprinklerSettings();
  }
  
  function updateLoopInterval() {
    nextLoopInterval.value = parseInt(tempLoopInterval.value) || 0;
    updateSprinklerSettings();
  }
  
  function updateSprinklerSettings() {
    if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中执行更新设置');
      const settings = {
        sprinkler_single_run_time: nextSingleRunTime.value,
        sprinkler_run_interval_time: nextRunIntervalTime.value,
        sprinkler_loop_interval: nextLoopInterval.value
      };
      sendToPyQt('updateSprinklerSettings', settings);
    } else {
      console.log('在普通网页环境中执行更新设置');
    }
  }
  
  function startSystem() {
    if (isRunning.value || !isAutoMode.value) return;
    sendToPyQt('startSystem', true);
    isRunning.value = true;
    waterLevels.value = Array(10).fill(0);
    runCycle();
  }
  
  function stopSystem() {
    sendToPyQt('startSystem', false);
    stopSystemWithoutSend()
  }

  function stopSystemWithoutSend()
    {
      isRunning.value = false;
      clearTimeout(timer);
      clearInterval(waterTimer);
      activeSprinkler.value = 0;
      currentPhase.value = '';
      waterLevels.value = Array(10).fill(0);
      remainingTime.value = 0;
    }
  
  function runCycle() {
    activeSprinkler.value = 1;
    runSprinkler();
  }
  
  function updateRemainingTime() {
    if (!isRunning.value || !isAutoMode.value) return;
    remainingTime.value--;
    if (remainingTime.value > 0) {
      setTimeout(updateRemainingTime, 1000);
    }
  }
  
  function runSprinkler() {
    if (!isRunning.value || !isAutoMode.value) return;
  
    currentPhase.value = 'run';
    currentSingleRunTime.value = nextSingleRunTime.value;
    remainingTime.value = currentSingleRunTime.value;
    updateRemainingTime();
  
    let startTime = Date.now();
    waterTimer = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let progress = Math.min(elapsedTime / (currentSingleRunTime.value * 1000), 1);
      waterLevels.value[activeSprinkler.value - 1] = progress * 100;
    }, 100);
  
    timer = setTimeout(() => {
      clearInterval(waterTimer);
      if (activeSprinkler.value < 10) {
        runInterval();
      } else {
        runLoopInterval();
      }
    }, currentSingleRunTime.value * 1000);
  }
  
  function runInterval() {
    if (!isRunning.value || !isAutoMode.value) return;
  
    currentPhase.value = 'interval';
    currentRunIntervalTime.value = nextRunIntervalTime.value;
    remainingTime.value = currentRunIntervalTime.value;
    updateRemainingTime();
  
    timer = setTimeout(() => {
      activeSprinkler.value++;
      runSprinkler();
    }, currentRunIntervalTime.value * 1000);
  }
  
  function runLoopInterval() {
    if (!isRunning.value || !isAutoMode.value) return;
  
    currentPhase.value = 'loop';
    currentLoopInterval.value = nextLoopInterval.value;
    remainingTime.value = currentLoopInterval.value;
    updateRemainingTime();
  
    activeSprinkler.value = 0;
    timer = setTimeout(() => {
      waterLevels.value = Array(10).fill(0);
      runCycle();
    }, currentLoopInterval.value * 1000);
  }
  
  function waterHeight(n) {
    return waterLevels.value[n - 1];
  }
  
  function toggleManualSprinkler(n) {
    if (isAutoMode.value) return;
    waterLevels.value[n - 1] = waterLevels.value[n - 1] > 0 ? 0 : 100;
  }
  </script>
  
  <style scoped>
.integrated-control-system {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  padding: 10px;
}

h2, h3, h4 {
  color: #2c3e50;
}

.mode-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.mode-btn, .control-btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #ecf0f1;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #34495e;
}

.mode-btn.active {
  background-color: #3498db;
  color: white;
}

.mode-btn:hover:not(.active), .control-btn:hover:not(:disabled) {
  background-color: #bdc3c7;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.systems-container {
  display: flex;
  gap: 20px;
}

.steam-engine-control, .sprinkler-system {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.engine-status {
  display: flex;
  justify-content: space-between;
}

.engine {
  text-align: center;
  width: 45%;
}

.status {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #e74c3c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.status.on {
  background-color: #2ecc71;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  margin-right: 10px;
}

.controls {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.input-group input {
  width: 60px;
}

.visualization {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sprinkler {
  width: 40px;
  height: 40px;
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
  background: rgba(33, 150, 243, 0.5);
  transition: height 0.1s linear;
}

.sprinkler-system .status {
  margin-top: 20px;
  font-weight: bold;
  background-color: #3498db;  /* 更改喷淋系统状态标签的颜色 */
  font-size: 18px;
  padding: 10px;
}
</style>