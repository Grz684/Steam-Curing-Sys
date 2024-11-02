<template>
  <div class="cart-system">
    <!-- 新增的缺水保护功能 -->
    <div class="water-protection">
      <div class="water-tank" :class="{ 'low-water': leftTankLowWater }">
        左水箱: {{ leftTankLowWater ? '缺水' : '正常' }}
      </div>
      <div class="water-tank" :class="{ 'low-water': rightTankLowWater }">
        右水箱: {{ rightTankLowWater ? '缺水' : '正常' }}
      </div>
    </div>

    <div class="mode-group">
      <button class="mode-button" :class="{ active: mode === 'semi-auto' && !low_water}" :disabled="low_water" @click="mode === 'auto' ? setMode('semi-auto') : () => {}">半自动模式</button>
      <button class="mode-button" :class="{ active: mode === 'auto' && !low_water}" :disabled="low_water" @click="mode === 'semi-auto' ? setMode('auto') : () => {}">自动模式</button>
    </div>
    
    <div class="mode-content">
      <div v-if="mode === 'semi-auto'">
        <div class="controls">
          <div class="input-group">
            <label>单次运行时间 (秒):</label>
            <div class="input-wrapper" @click="showRunTimeKeyboard = true">
              {{ tempRunTime }}
            </div>
          </div>
          <div class="input-group">
            <label>循环间隔时间 (秒):</label>
            <div class="input-wrapper" @click="showIntervalTimeKeyboard = true">
              {{ tempIntervalTime }}
            </div>
          </div>
          <div class="button-group">
            <button @click="startSystem" :disabled="isRunning || low_water">开始</button>
            <button @click="stopSystem" :disabled="!isRunning || low_water">停止</button>
          </div>
        </div>
        
        <div class="visualization">
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
            <div class="cart" :style="{ left: progress + '%' }">
              <span class="cart-icon">🚜</span>
            </div>
          </div>
        </div>
        
        <div class="status">
          {{ statusMessage }}
        </div>
      </div>

      <div v-else class="auto-mode-container">
        <div class="auto-mode-title">自动模式受传感器湿度控制</div>
        <div class="auto-mode-status" :class="{ 'working': autoModeStatus === '小车正在运行' }">
          {{ autoModeStatus }}
        </div>
        <div class="auto-mode-placeholder"></div>
      </div>
    </div>

    <NumericKeyboard
      v-model="tempRunTime"
      v-model:showKeyboard="showRunTimeKeyboard"
      @update:modelValue="updateRunTime"
    />
    <NumericKeyboard
      v-model="tempIntervalTime"
      v-model:showKeyboard="showIntervalTimeKeyboard"
      @update:modelValue="updateIntervalTime"
    />
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, onUnmounted } from 'vue';
import { useWebChannel } from './useWebChannel';
import NumericKeyboard from './NumericKeyboard.vue';

const mode = ref('semi-auto');
const currentRunTime = ref(6);
const currentIntervalTime = ref(12);
const tempRunTime = ref(currentRunTime.value);
const tempIntervalTime = ref(currentIntervalTime.value);
const nextRunTime = ref(currentRunTime.value);
const nextIntervalTime = ref(currentIntervalTime.value);
const isRunning = ref(false);
const progress = ref(0);
const statusMessage = ref('系统就绪');
const autoModeStatus = ref('小车尚未工作');
const showRunTimeKeyboard = ref(false);
const showIntervalTimeKeyboard = ref(false);
const low_water = ref(false);
let animationFrame = null;

// 新增的缺水状态变量
const leftTankLowWater = ref(false);
const rightTankLowWater = ref(false);

const phaseStartTime = ref(0);

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
      if (newMessage && newMessage.type === 'update_dolly_settings') {
        try {
          const settings = JSON.parse(newMessage.content);
          tempRunTime.value = settings.dolly_single_run_time;
          tempIntervalTime.value = settings.dolly_run_interval_time;

          nextRunTime.value = tempRunTime.value;
          nextIntervalTime.value = tempIntervalTime.value
          console.log('dolly Settings updated:', settings);
        } catch (error) {
          console.error('Failed to parse dolly settings data:', error);
        }
      }
      else if (newMessage && newMessage.type === 'update_dolly_state') {
        if (newMessage.content) {
          updateAutoModeStatus("小车正在运行");
        }
        else {
          updateAutoModeStatus("小车尚未工作");
        }
      }
      // 新增的水箱状态更新逻辑
      else if (newMessage && newMessage.type === 'update_water_tank_status') {
        try {
          const status = JSON.parse(newMessage.content);
          if (status.side === 'left') {
            leftTankLowWater.value = status.low_water;
          } else if (status.side === 'right') {
            rightTankLowWater.value = status.low_water;
          }

          if(leftTankLowWater.value || rightTankLowWater.value) {
            low_water.value = true;
            if (mode.value === 'auto') {
              setMode('semi-auto');
            }
            else {
              stopSystem();
            }
          }
          else {
            low_water.value = false;
          }

          console.log('Water tank status updated:', status);
        } catch (error) {
          console.error('Failed to parse water tank status data:', error);
        }
      }
      else if (newMessage && newMessage.type === 'CartSystem_init') {
        console.log('Received CartSystem_init message');
        sendInitialState();
      }
      else if (newMessage && newMessage.type === 'CartSystem_set') {
        console.log('Received CartSystem_set message:', newMessage.content);
        const set_pak = JSON.parse(newMessage.content);
        if (set_pak.method === 'setMode') {
          setMode(set_pak.args.newMode);
        }
        else if (set_pak.method === 'startSystem') {
          startSystem();
        }
        else if (set_pak.method === 'stopSystem') {
          stopSystem();
        }
        else if (set_pak.method === 'updateDollySettings') {
          const settings = set_pak.args;
          tempRunTime.value = settings.dolly_single_run_time;
          tempIntervalTime.value = settings.dolly_run_interval_time;

          nextRunTime.value = tempRunTime.value;
          nextIntervalTime.value = tempIntervalTime.value
          console.log('dolly Settings received:', settings);
          updateDollySettings();
        }
      }
    });
  } else {
    console.log('在普通网页环境中运行');
  }
});

// 新增函数：收集并发送初始状态
const sendInitialState = () => {
  const initialState = {
    mode: mode.value,
    currentRunTime: currentRunTime.value,
    currentIntervalTime: currentIntervalTime.value,
    tempRunTime: tempRunTime.value,
    tempIntervalTime: tempIntervalTime.value,
    nextRunTime: nextRunTime.value,
    nextIntervalTime: nextIntervalTime.value,
    isRunning: isRunning.value,
    progress: progress.value,
    statusMessage: statusMessage.value,
    autoModeStatus: autoModeStatus.value,
    low_water: low_water.value,
    leftTankLowWater: leftTankLowWater.value,
    rightTankLowWater: rightTankLowWater.value, 
    phaseStartTime: phaseStartTime.value,
  };

  console.log('Sending initial cart system state:', initialState);
  sendToPyQt('CartSystem_init_response', initialState);
};

const props = defineProps({
  message: {
    type: Object,  // 改为Object类型
    default: () => ({})
  }
})

// 监听Lock组件发来的消息，锁生效则通过setMode来关闭系统
watch(() => props.message, (newMsg) => {
  if (newMsg?.content) {  // 检查是否有content
    if (mode.value === 'auto') {
      setMode('semi-auto');
    }
    else {
      stopSystem();
    }
  }
})

const setMode = (newMode) => {
  mode.value = newMode;
  if (environment.isPyQtWebEngine) {
    if (newMode === 'auto') {
      stopSystem();
      sendToPyQt('controlDolly', { target: 'setMode', mode: 'auto'});
    }
    else {
      stopDolly();
      updateAutoModeStatus("小车尚未工作");
      sendToPyQt('controlDolly', { target: 'setMode', mode: 'semi-auto' });
    }
  }
};

const updateRunTime = () => {
  tempRunTime.value = Math.max(1, parseInt(tempRunTime.value) || 1);
  nextRunTime.value = tempRunTime.value;
  updateDollySettings();
};

const updateIntervalTime = () => {
  tempIntervalTime.value = Math.max(0, parseInt(tempIntervalTime.value) || 0);
  nextIntervalTime.value = tempIntervalTime.value;
  updateDollySettings();
};

function updateDollySettings() {
    if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中执行更新设置');
      const settings = {
        target: 'dolly_settings',
        dolly_single_run_time: nextRunTime.value,
        dolly_run_interval_time: nextIntervalTime.value,
      };
      sendToPyQt('controlDolly', settings);
    } else {
      console.log('在普通网页环境中执行更新设置');
    }
  }

const startSystem = () => {
  isRunning.value = true;
  runCart();
};

const stopSystem = () => {
  stopDolly();
  isRunning.value = false;
  cancelAnimationFrame(animationFrame);
  progress.value = 0;
  statusMessage.value = '系统就绪';
};

function stopDolly() {
  if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中执行更新设置');
      const settings = {
        target: 'setState',
        dolly_state: false,
      };
      sendToPyQt('controlDolly', settings);
    } else {
      console.log('在普通网页环境中执行更新设置');
    }
}

function tempStopDolly() {
  if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中执行更新设置');
      const settings = {
        target: 'setState',
        dolly_state: false,
      };
      sendToPyQt('tempControlDolly', settings);
    } else {
      console.log('在普通网页环境中执行更新设置');
    }
}

function startDolly() {
  if (environment.isPyQtWebEngine) {
      console.log('在PyQt QWebEngine环境中执行更新设置');
      const settings = {
        target: 'setState',
        dolly_state: true,
      };
      sendToPyQt('controlDolly', settings);
    } else {
      console.log('在普通网页环境中执行更新设置');
    }
}

const runCart = () => {
  startDolly();
  statusMessage.value = '小车运行中';
  progress.value = 0;
  const startTime = Date.now();
  phaseStartTime.value = startTime;
  
  currentRunTime.value = nextRunTime.value;
  
  const updateProgress = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, currentRunTime.value - elapsed);
    progress.value = (elapsed / currentRunTime.value) * 100;
    statusMessage.value = `小车运行中: 剩余 ${remaining.toFixed(1)} 秒`;
    
    if (elapsed < currentRunTime.value && isRunning.value) {
      animationFrame = requestAnimationFrame(updateProgress);
    } else if (isRunning.value) {
      progress.value = 100;
      if (nextIntervalTime.value > 0) {
        tempStopDolly();
      }
      startInterval();
    }
  };
  
  animationFrame = requestAnimationFrame(updateProgress);
};

const startInterval = () => {
  statusMessage.value = '等待下次运行';
  const startTime = Date.now();
  phaseStartTime.value = startTime;
  
  currentIntervalTime.value = nextIntervalTime.value;
  
  const updateNextRun = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, currentIntervalTime.value - elapsed);
    statusMessage.value = `等待下次运行: ${remaining.toFixed(1)}秒`;
    
    if (remaining > 0 && isRunning.value) {
      animationFrame = requestAnimationFrame(updateNextRun);
    } else if (isRunning.value) {
      runCart();
    }
  };
  
  animationFrame = requestAnimationFrame(updateNextRun);
};

const updateAutoModeStatus = (status) => {
  autoModeStatus.value = status;
};

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.cart-system {
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 新增的水箱状态样式 */
.water-protection {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.water-tank {
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  background-color: #e0f2f1;
  color: #00796b;
  font-weight: bold;
}

.water-tank.low-water {
  background-color: #ffcdd2;
  color: #c62828;
}

.mode-content {
  min-height: 280px;
  display: flex;
  flex-direction: column;
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
  font-size: 18px;
}

.input-wrapper {
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  line-height: 40px;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #ecf0f1;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #34495e;
}

button:disabled {
  background-color: #d1d5d8;
  color: #7f8c8d;
  cursor: not-allowed;
  opacity: 0.7;
}

.visualization {
  margin-top: 20px;
}

.progress-bar {
  height: 30px;
  background-color: #f0f0f0;
  position: relative;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.1s linear;
}

.cart {
  position: absolute;
  top: -10px;
  transition: left 0.1s linear;
}

.status {
  margin-top: 20px;
  font-weight: bold;
  background-color: #3498db;
  font-size: 18px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.mode-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.mode-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #ecf0f1;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #34495e;
}

.mode-button.active {
  background-color: #3498db;
  color: white;
}

.auto-mode-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.auto-mode-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
}

.auto-mode-status {
  text-align: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-top: 20px;
  font-size: 18px;
}

.auto-mode-status.working {
  background-color: #4CAF50;
  color: white;
}

.auto-mode-placeholder {
  flex-grow: 1;
}

.cart-icon {
  position: relative;
  top: -15px;
  font-size: 40px; /* 增大图标尺寸 */
  color: #2196F3; 
  filter: grayscale(0); /* 移除黑白滤镜 */
}
</style>