<template>
  <!-- <div class="integrated-control-system"> -->
    <h2>水箱加热系统【数字开关output2控制】</h2>

    <div class="label-box" >
      <label>自动模式下，当平均温度低于设置的温度下限时，加热开启；当平均温度高于设置的温度上限时，加热关闭</label><br>
    </div>

    <div class="mode-controls">
      <div class="btn-group">
        <button @click="setMode('manual')" :class="{ active: !isAutoMode }" class="mode-btn">手动模式</button>
        <button @click="setMode('auto')" :class="{ active: isAutoMode }" class="mode-btn">自动模式</button>
      </div>
    </div>

            <!-- Heat Engine -->
            
    <div class="steam_engine">
      <div class="status" :class="{ 'on': heatEngineOn }">
        <div class="status-indicator"></div>
        {{ heatEngineOn ? '开' : '关' }}
      </div>
      <button @click="click_toggleEngine" :disabled="isAutoMode" class="control-btn">
        {{ heatEngineOn ? '关闭' : '开启' }}
      </button>
    </div>
           
    <div class="text_status">{{ newStatusMessage }}</div>
  <!-- </div> -->
</template>

<script setup>
import { ref, watch, reactive, onMounted, computed, onUnmounted } from 'vue';
import { useWebChannel } from './useWebChannel';

// Steam Engine Control
const heatEngineOn = ref(false);

// Shared state
const isAutoMode = ref(false);

const sensor_error = ref(false);

const { sendToPyQt } = useWebChannel();

const environment = reactive({
  isPyQtWebEngine: false
});

const props = defineProps({
  message: {
    type: Object,  // 改为Object类型
    default: () => ({})
  }
})

// 监听Lock组件发来的消息，锁生效则通过setMode来关闭系统
watch(() => props.message, (newMsg) => {
  if (newMsg?.content) {  // 检查是否有content
    if (isAutoMode.value) {
      setMode('manual');
    }
    else {
      setMode('auto');
    }
  }
})

onMounted(() => {
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;

  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行');
    const { message } = useWebChannel();

    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'update_heat_engine_status') {
        heatEngineOn.value = newMessage.content;
      }
      // else if (newMessage && newMessage.type === 'IntegratedControlSystem_init') {
      //   console.log('Received IntegratedControlSystem_init message');
      //   sendInitialState();
      // }
      else if (newMessage && newMessage.type === 'update_sensor_avg_data') {
        console.log('Received sensor avg data:', newMessage.content);
        const data = JSON.parse(newMessage.content);
        if (data.type === 'temp') {
          if (data.value !== -1) {
            avg_temp.value = String(data.value);
            sensor_error.value = false;
          }
          else {
            sensor_error.value = true;
            avg_temp.value = '未知';
          }
        }
      }
      // else if (newMessage && newMessage.type === 'IntegratedControlSystem_set') {
      //   console.log('Received IntegratedControlSystem_set message:', newMessage.content);
      //   const set_pak = JSON.parse(newMessage.content);
      //   if (set_pak.method === 'startSystem') {
      //     startSystem();
      //   }
      //   else if (set_pak.method === 'stopSystem') {
      //     stopSystem();
      //   }
      //   else if (set_pak.method === 'setMode') {
      //     setMode(set_pak.args.mode);
      //   }
      //   else if (set_pak.method === 'click_toggleEngine') {
      //     click_toggleEngine();
      //   }
      //   else if (set_pak.method === 'click_toggleSteamEngine') {
      //     click_toggleLeftSteamEngine();
      //   }
      //   else if (set_pak.method === 'toggleManualSprinkler') {
      //     toggleManualSprinkler(set_pak.args.n);
      //   }
      // }
    });
  } else {
    console.log('在普通网页环境中运行');
  }
});

// const sendInitialState = () => {
//   const initialState = {
//     leftEngineOn: sprayEngineOn.value,
//     rightEngineOn: leftSteamEngineOn.value,
//     currentSingleRunTime: currentSingleRunTime.value,
//     currentRunIntervalTime: currentRunIntervalTime.value,
//     currentLoopInterval: currentLoopInterval.value,
//     nextSingleRunTime: nextSingleRunTime.value,
//     nextRunIntervalTime: nextRunIntervalTime.value,
//     nextLoopInterval: nextLoopInterval.value,
//     tempSingleRunTime: tempSingleRunTime.value,
//     tempRunIntervalTime: tempRunIntervalTime.value,
//     tempLoopInterval: tempLoopInterval.value,
//     currentPhase: currentPhase.value,
//     remainingTime: remainingTime.value,
//     isAutoMode: isAutoMode.value,
//     isRunning: isRunning.value,
//     phaseStartTime: phaseStartTime.value,
//   };

//   sendToPyQt('IntegratedControlSystem_init_response', initialState);
// };

const avg_temp = ref("未知");
const avg_humidity = ref("未知");

const newStatusMessage = computed(() => {
  if (!isAutoMode.value) return '手动模式';
  if (sensor_error.value === false) return `自动模式受水下传感器温度控制, 水下平均温度: ${avg_temp.value}°C`;
  if (sensor_error.value === true) return `自动模式受水下传感器温度控制, 水下平均温度: ${avg_temp.value}°C, 无法使用自动模式, 请检查异常传感器`;
});

async function setMode(mode) {
  const oldMode = isAutoMode.value;
  isAutoMode.value = mode === 'auto';

  if (oldMode !== isAutoMode.value) {
    if (environment.isPyQtWebEngine) {
      // sendToPyQt('IntegratedControlSystem_set_response', { method: 'setMode', args: { mode: mode } });
      // 这里的Sprinkler实际用于Heater
      sendToPyQt('controlSprinkler', { target:'setMode', mode: isAutoMode.value ? 'auto' : 'manual' });
    }

    if (isAutoMode.value) {
      // 手动切换到自动模式时

      // 关闭所有引擎
      if (heatEngineOn.value) {
        await toggleheatEngine();
      }
    }
    else {
      // 自动切换到手动模式时，关闭所有引擎
      if (heatEngineOn.value) {
        await toggleheatEngine();
      }
    }
  }
}

async function toggleheatEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('setEngineState', { engine: 'heatEngine', state: !heatEngineOn.value });
    heatEngineOn.value = !heatEngineOn.value;
  }
}

async function click_toggleEngine() {
    // sendToPyQt('IntegratedControlSystem_set_response', { method: 'click_toggleSprayEngine', args: {} });
    // 切换到喷雾系统
    sendToPyQt('setEngineState', { engine: 'heatEngine', state: !heatEngineOn.value });
    // sendToPyQt('setEngineState', { engine: 'right', state: !rightEngineOn.value });
    heatEngineOn.value = !heatEngineOn.value;
    // rightEngineOn.value = !rightEngineOn.value;
}

</script>
  
<style scoped>
/* 基础布局 */
.integrated-control-system {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  padding: 10px;
}

/* 标题样式 */
h2, h3, h4, h5 {
  color: #2c3e50;
  margin-bottom: 10px;
}

h2 { font-size: 20px; }
h3 { font-size: 20px; }
h4 { font-size: 18px; }
h5 { font-size: 16px; }

label {
  font-size: 14px;
}

/* 说明标签框 */
.label-box {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.label-box label {
  font-size: 16px;
}

/* 模式控制按钮 */
.mode-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
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

/* 新增的按钮组样式 */
.btn-group {
  display: flex;
  gap: 10px;
}

/* 给第二个按钮组添加左边距 */
.btn-group + .btn-group {
  margin-left: 30px;
}

.mode-btn.active {
  background-color: #3498db;
  color: white;
}

.mode-btn:hover:not(.active), 
.control-btn:hover:not(:disabled) {
  background-color: #bdc3c7;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 主容器布局 */
.systems-container {
  display: flex;
  gap: 20px;
}

/* 左侧面板样式 */
.side-controls {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-box, .right-box {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 右侧主面板样式 */
.middle-box {
  flex-grow: 1;
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 添加这行 */
  max-width: 100%; /* 添加这行 */
}

/* 控制系统布局 */
.control-systems {
  margin-top: 20px;
}

.control-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.control-item {
  flex: 1;
  text-align: center;
  min-width: 200px;
}

.steam_engine {
  margin-top: 20px;
  text-align: center;
  width: 100%;
}

/* 状态显示 */
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
  min-height: 30px;
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

/* 输入控件 */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
}

.input-group label {
  font-size: 18px;
}

.input-group input {
  width: 100%;
  height: 40px;
  text-align: center;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 40px;  /* 添加右边距 */
  box-sizing: border-box;  /* 添加这行 */
}

/* 状态文本 */
.text_status {
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-height: 30px;
  margin-top: 20px;
  font-weight: bold;
  background-color: #3498db;
  font-size: 18px;
  padding: 10px;
}

/* 状态机容器样式 */
.state-machine-container {
  width: 100%;
  /* margin: auto; */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  /* padding: 20px; */
  /* 添加最小高度确保有足够空间 */
  min-height: 400px;
  overflow: hidden; /* 添加这行 */
  max-width: 100%; /* 添加这行 */
}

.state-machine {
  width: 100%;
  /* 移除max-width限制 */
  height: 100%;
  margin: 0 auto;
}

.state {
  fill: #fff;
  stroke: #2c3e50;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.state.active {
  fill: #3498db;
  stroke: #2980b9;
}

.state-text {
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 14px;
  font-family: Arial, sans-serif;
  pointer-events: none;
}

.active .state-text {
  fill: white;
}

.transition-path {
  fill: none;
  stroke: #2c3e50;
  stroke-width: 2;
  marker-end: url(#arrowhead);
}

.condition-line {
  stroke: #2c3e50;
  stroke-width: 1;
  stroke-dasharray: 4 2;
}

.condition-box {
  fill: #fff;
  stroke: #2c3e50;
  stroke-width: 1;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

.condition-text {
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 12px;
  font-family: Arial, sans-serif;
  pointer-events: none;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .systems-container {
    flex-direction: column;
  }
  
  .side-controls {
    width: 100%;
  }
  
  .control-row {
    flex-wrap: wrap;
  }
  
  .control-item {
    flex: 1 1 300px;
  }
}

@media (max-width: 768px) {
  .state-machine {
    max-width: 100%;
  }
  
  .state-text {
    font-size: 12px;
  }
  
  .condition-text {
    font-size: 10px;
  }
  
  .control-row {
    flex-direction: column;
  }
  
  .control-item {
    margin-bottom: 20px;
  }
}
</style>