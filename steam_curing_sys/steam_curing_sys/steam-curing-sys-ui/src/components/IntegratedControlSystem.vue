<template>
  <div class="integrated-control-system">
    <h2>集成控制系统【定时喷淋->循环养护->定时喷淋按时间设置交替运行】</h2>

    <div class="label-box" >
      <label>适用于9传感器+16输出数字开关+12组喷淋+两组蒸汽机+超声波造雾机的养护系统</label><br>
      <label>在数字开关上，output1控制蒸汽机（组1）开/关，output2控制（组2）蒸汽机开/关，output3~14分别控制12组喷淋头开/闭，output15控制喷淋水泵，output16控制造雾机开/关</label>
    </div>
    
    <div class="mode-controls">
      <div class="btn-group">
        <button @click="setMode('auto')" :class="{ active: isAutoMode }" class="mode-btn">自动模式</button>
        <button @click="setMode('manual')" :class="{ active: !isAutoMode }" class="mode-btn">手动模式</button>
      </div>
      <div class="btn-group">
        <button @click="startSystem" :disabled="isRunning || !isAutoMode" class="control-btn">开始</button>
        <button @click="stopSystem" :disabled="!isRunning || !isAutoMode" class="control-btn">停止</button>
      </div>
    </div>

    <div class="systems-container">
      <!-- 左侧栏 -->
      <div class="side-controls">
        <!-- Left Box - Sprinkler -->
        <div class="left-box">
          <h3>定时喷淋系统</h3>
          <div class="visualization">
          <div v-for="n in 12" :key="n" class="sprinkler" 
               :class="{ active: isAutoMode ? activeSprinkler === n : waterLevels[n-1] > 0 }"
               @click="!isAutoMode && toggleManualSprinkler(n)">
            <div class="water" :style="{ height: waterHeight(n) + '%' }"></div>
            <span>{{ n }}</span>
          </div>
        </div>
          <div class="text_status">{{ statusMessage }}</div>
        </div>

        <!-- Right Box - Time Settings -->
        <div class="right-box">
          <h3>定时喷淋/循环养护系统时间设置</h3>
          <div class="controls">
            <div class="input-group">
              <label>单个喷淋头工作时间 (秒):</label>
              <input 
                type="text" 
                :value="tempSingleRunTime" 
                @focus="focusInput('singleRunTime')"
                readonly
              />
            </div>
            <div class="input-group">
              <label>循环养护系统工作时间 (秒):</label>
              <input 
                type="text" 
                :value="tempLoopInterval" 
                @focus="focusInput('loopInterval')"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Box -->
      <div class="middle-box">
        <h3>循环养护系统</h3>
        <!-- 状态机可视化 -->
        <div class="state-machine-container">
          <div class="state-machine">
            <svg viewBox="0 0 800 400">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#2c3e50"/>
                </marker>
              </defs>

              <!-- 转换路径和条件框 -->
              <g v-for="(transition, index) in transitions" :key="'t'+index">
                <path :d="transition.path" 
                      class="transition-path" />
                <line :x1="transition.lineStart.x" 
                      :y1="transition.lineStart.y"
                      :x2="transition.conditionX" 
                      :y2="transition.conditionY"
                      class="condition-line" />
                <rect :x="transition.conditionX - 80" 
                      :y="transition.conditionY - 25"
                      width="160" height="50" rx="4"
                      class="condition-box" />
                <text :x="transition.conditionX" 
                      :y="transition.conditionY - 8" 
                      class="condition-text">{{transition.text1}}</text>
                <text :x="transition.conditionX" 
                      :y="transition.conditionY + 8" 
                      class="condition-text">{{transition.text2}}</text>
              </g>

              <!-- 状态 -->
              <g v-for="(state, index) in states" :key="index"
                :class="{'active': currentState === state.label}">
                <ellipse :cx="state.x" :cy="state.y" 
                        rx="80" ry="40" 
                        class="state"
                        :class="{'active': currentState === state.label}"
                        />
                <text :x="state.x" 
                      :y="state.y - 8" 
                      class="state-text">{{state.text1}}</text>
                <text :x="state.x" 
                      :y="state.y + 8" 
                      class="state-text">{{state.text2}}</text>
              </g>
            </svg>
          </div>
        </div>

        <div class="control-systems">
          <div class="control-row">
            <!-- Left Steam Engine -->
            <div class="control-item">
              <h4>蒸汽机（组1）</h4>
              <div class="steam_engine">
                <div class="status" :class="{ 'on': leftSteamEngineOn }">
                  <div class="status-indicator"></div>
                  {{ leftSteamEngineOn ? '开' : '关' }}
                </div>
                <button @click="click_toggleLeftSteamEngine" :disabled="isAutoMode" class="control-btn">
                  {{ leftSteamEngineOn ? '关闭' : '开启' }}
                </button>
              </div>
            </div>

            <!-- Right Steam Engine -->
            <div class="control-item">
              <h4>蒸汽机（组2）</h4>
              <div class="steam_engine">
                <div class="status" :class="{ 'on': rightSteamEngineOn }">
                  <div class="status-indicator"></div>
                  {{ rightSteamEngineOn ? '开' : '关' }}
                </div>
                <button @click="click_toggleRightSteamEngine" :disabled="isAutoMode" class="control-btn">
                  {{ rightSteamEngineOn ? '关闭' : '开启' }}
                </button>
              </div>
            </div>

            <!-- Spray Engine -->
            <div class="control-item">
              <h4>超声波造雾机</h4>
              <div class="steam_engine">
                <div class="status" :class="{ 'on': sprayEngineOn }">
                  <div class="status-indicator"></div>
                  {{ sprayEngineOn ? '开' : '关' }}
                </div>
                <button @click="click_toggleEngine" :disabled="isAutoMode" class="control-btn">
                  {{ sprayEngineOn ? '关闭' : '开启' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="text_status">{{ newStatusMessage }}</div>
      </div>
    </div>

    <numeric-keyboard 
      :modelValue="currentValue" 
      :showKeyboard="showKeyboard"
      @update:modelValue="updateInputValue"
      @update:showKeyboard="showKeyboard = $event"
    />
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, computed, onUnmounted } from 'vue';
import { useWebChannel } from './useWebChannel';
import NumericKeyboard from './NumericKeyboard.vue';

// Steam Engine Control
const sprayEngineOn = ref(false);
const leftSteamEngineOn = ref(false);
const rightSteamEngineOn = ref(false);
const sprinklerEngineOn = ref(false);

// Sprinkler System
const currentSingleRunTime = ref(10);
const currentRunIntervalTime = ref(0);
const currentLoopInterval = ref(10);
const nextSingleRunTime = ref(currentSingleRunTime.value);
const nextRunIntervalTime = ref(currentRunIntervalTime.value);
const nextLoopInterval = ref(currentLoopInterval.value);
const tempSingleRunTime = ref(currentSingleRunTime.value);
const tempRunIntervalTime = ref(currentRunIntervalTime.value);
const tempLoopInterval = ref(currentLoopInterval.value);
const currentPhase = ref('');
const remainingTime = ref(0);

const waterLevels = ref(Array(12).fill(0));
const activeSprinkler = ref(0);
const chose_n = ref(0);

// Shared state
const isAutoMode = ref(true);
const isRunning = ref(false);

// Numeric Keyboard
const showKeyboard = ref(false);
const focusedInput = ref(null);
const currentValue = ref('');

const sensor_error = ref(false);

const { sendToPyQt } = useWebChannel();

const phaseStartTime = ref(0);

const environment = reactive({
  isPyQtWebEngine: false
});

// 用于存储定时器的数组
const timers = ref([]);
let timer;
let waterTimer;
let switchingInterval;

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

// 添加状态机相关的状态
const currentState = ref('S0');
const centerX = 400;
const centerY = 200;
const radius = 100;

const states = ref([
  { x: centerX, y: centerY - radius, label: 'S1', text1: '打开全部', text2: '蒸汽机' },
  { x: centerX, y: centerY + radius, label: 'S2', text1: '关闭全部蒸汽机', text2: '根据湿度开/关造雾机' }
]);

const transitions = ref([
  {
    path: `M ${centerX + 80} ${centerY - radius} Q ${centerX + radius} ${centerY} ${centerX + 80} ${centerY + radius}`,
    lineStart: { x: centerX + 40, y: centerY },
    conditionX: centerX + radius + 60,
    conditionY: centerY,
    condition: 'C1',
    text1: '平均温度',
    text2: '高于设定的温度上限'
  },
  {
    path: `M ${centerX - 80} ${centerY + radius} Q ${centerX - radius} ${centerY} ${centerX - 80} ${centerY - radius}`,
    lineStart: { x: centerX - 40, y: centerY },
    conditionX: centerX - radius - 60,
    conditionY: centerY,
    condition: 'C2',
    text1: '平均温度',
    text2: '低于设定的温度下限'
  }
]);

// 添加状态改变方法
const changeState = (state) => {
  if (state === 1) {
    currentState.value = 'S1';
  } else if (state === 2) {
    currentState.value = 'S2';
  }
};

onMounted(() => {
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;

  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行');
    const { message } = useWebChannel();

    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'update_spray_engine_status') {
        sprayEngineOn.value = newMessage.content;
      }
      else if (newMessage && newMessage.type === 'IntegratedControlSystem_init') {
        console.log('Received IntegratedControlSystem_init message');
        sendInitialState();
      }
      else if (newMessage && newMessage.type === 'update_left_steam_status') {
        leftSteamEngineOn.value = newMessage.content;
      }
      else if (newMessage && newMessage.type === 'update_right_steam_status') {
        rightSteamEngineOn.value = newMessage.content;
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
      else if (newMessage && newMessage.type === 'update_state_machine') {
        console.log('Received state machine update:', newMessage.content);
        changeState(newMessage.content);
      }
      else if (newMessage && newMessage.type === 'update_sensor_avg_data') {
        console.log('Received sensor avg data:', newMessage.content);
        const data = JSON.parse(newMessage.content);
        if (data.temperature !== -1 && data.humidity !== -1) {
          avg_temp.value = String(data.temperature);
          avg_humidity.value = String(data.humidity);
          sensor_error.value = false;
        }
        else {
          sensor_error.value = true;
          if (data.temperature === -1) {
            avg_temp.value = '未知';
          }
          else {
            avg_temp.value = String(data.temperature);
          }

          if (data.humidity === -1) {
            avg_humidity.value = '未知';
          }
          else {
            avg_humidity.value = String(data.humidity);
          }
        }
      }
      else if (newMessage && newMessage.type === 'SprinklerSettings_set') {
        console.log('Received SprinklerSettings_set message:', newMessage.content);
        const set_pak = JSON.parse(newMessage.content);
        const settings = set_pak.args;
        tempSingleRunTime.value = settings.sprinkler_single_run_time;
        tempRunIntervalTime.value = settings.sprinkler_run_interval_time;
        tempLoopInterval.value = settings.sprinkler_loop_interval;

        nextRunIntervalTime.value = tempRunIntervalTime.value;
        nextSingleRunTime.value = tempSingleRunTime.value;
        nextLoopInterval.value = tempLoopInterval.value;
        updateSprinklerSettings();
      }
      else if (newMessage && newMessage.type === 'IntegratedControlSystem_set') {
        console.log('Received IntegratedControlSystem_set message:', newMessage.content);
        const set_pak = JSON.parse(newMessage.content);
        if (set_pak.method === 'startSystem') {
          startSystem();
        }
        else if (set_pak.method === 'stopSystem') {
          stopSystem();
        }
        else if (set_pak.method === 'setMode') {
          setMode(set_pak.args.mode);
        }
        else if (set_pak.method === 'click_toggleEngine') {
          click_toggleEngine();
        }
        else if (set_pak.method === 'click_toggleSteamEngine') {
          click_toggleLeftSteamEngine();
        }
        else if (set_pak.method === 'toggleManualSprinkler') {
          toggleManualSprinkler(set_pak.args.n);
        }
      }
    });
  } else {
    console.log('在普通网页环境中运行');
  }
});

onUnmounted(() => {
  clearInterval(switchingInterval);
  clearInterval(waterTimer);
  clearAllTimers();
});

const clearTimer = (t) => {  // 添加参数 t
  if (t !== undefined) {     // 使用参数 t 而不是 timer
    clearTimeout(t)
  }
}

// 清理所有定时器
const clearAllTimers = () => {
  timers.value.forEach(timer => {
    clearTimer(timer)  // 现在可以正确传入 timer 参数
  })
  timers.value = []
}

const sendInitialState = () => {
  const initialState = {
    leftEngineOn: sprayEngineOn.value,
    rightEngineOn: leftSteamEngineOn.value,
    currentSingleRunTime: currentSingleRunTime.value,
    currentRunIntervalTime: currentRunIntervalTime.value,
    currentLoopInterval: currentLoopInterval.value,
    nextSingleRunTime: nextSingleRunTime.value,
    nextRunIntervalTime: nextRunIntervalTime.value,
    nextLoopInterval: nextLoopInterval.value,
    tempSingleRunTime: tempSingleRunTime.value,
    tempRunIntervalTime: tempRunIntervalTime.value,
    tempLoopInterval: tempLoopInterval.value,
    currentPhase: currentPhase.value,
    remainingTime: remainingTime.value,
    isAutoMode: isAutoMode.value,
    isRunning: isRunning.value,
    phaseStartTime: phaseStartTime.value,
    waterLevels: waterLevels.value,
    activeSprinkler: activeSprinkler.value,
    chose_n : chose_n.value
  };

  sendToPyQt('IntegratedControlSystem_init_response', initialState);
};

const statusMessage = computed(() => {
  if (!isAutoMode.value) return '手动模式';
  if (!isRunning.value) return '喷淋系统未运行';
  if (currentPhase.value === 'run') return `喷头 ${activeSprinkler.value} 正在运行，剩余 ${remainingTime.value+1} 秒`;
  if (currentPhase.value === 'interval') return `运行间隔中，剩余 ${remainingTime.value+1} 秒`;
  if (currentPhase.value === 'loop') return `循环养护系统工作中，离下次喷淋剩余 ${remainingTime.value+1} 秒`;
  return '';
});

const avg_temp = ref("未知");
const avg_humidity = ref("未知");

const newStatusMessage = computed(() => {
  if (!isAutoMode.value) return '手动模式';
  if (!isRunning.value) return '循环养护系统未运行';
  if (currentPhase.value === 'loop' && sensor_error.value === false) return `平均温度: ${avg_temp.value}°C, 平均湿度: ${avg_humidity.value}%`;
  if (currentPhase.value === 'loop' && sensor_error.value === true) return `平均温度: ${avg_temp.value}°C, 平均湿度: ${avg_humidity.value}%, 无法开启循环, 请检查异常传感器`;
  return '循环养护系统未运行';
});

async function setMode(mode) {
  const oldMode = isAutoMode.value;
  isAutoMode.value = mode === 'auto';

  if (oldMode !== isAutoMode.value) {
    if (environment.isPyQtWebEngine) {
      sendToPyQt('IntegratedControlSystem_set_response', { method: 'setMode', args: { mode: mode } });
      sendToPyQt('controlSprinkler', { target:'setMode', mode: isAutoMode.value ? 'auto' : 'manual' });
    }

    if (isAutoMode.value) {
      // 手动切换到自动模式时
      clearAllTimers();

      // 关闭所有引擎
      if (sprayEngineOn.value) {
        await toggleSprayEngine();
      }

      if (leftSteamEngineOn.value) {
        await toggleLeftSteamEngine();
      }

      if (rightSteamEngineOn.value) {
        await toggleRightSteamEngine();
      }

      // if (sprinklerEngineOn.value) {
      //   await toggleSprinklerEngine();
      // }
      // 找出当前激活的喷头（如果有）
      const activeIndex = waterLevels.value.findIndex(level => level === 100);
      if (activeIndex !== -1) {
        waterLevels.value[activeIndex] = 0;
        if (environment.isPyQtWebEngine) {
          sendToPyQt('controlSprinkler', { target: "manual_control_sprayer", index: activeIndex+1, state: 0 });
          // 水泵关闭
          sendToPyQt('controlSprinkler', { target: "tankWork" , state: 0 });
        }
      }
    }
    else {
      // 自动切换到手动模式时，关闭所有引擎
      await stopSystem();
    }
  }
}

async function toggleSprayEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('setEngineState', { engine: 'sprayEngine', state: !sprayEngineOn.value });
    sprayEngineOn.value = !sprayEngineOn.value;
  }
}

async function toggleLeftSteamEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('setEngineState', { engine: 'leftSteamEngine', state: !leftSteamEngineOn.value });
    leftSteamEngineOn.value = !leftSteamEngineOn.value;
  }
}

async function toggleRightSteamEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('setEngineState', { engine: 'rightSteamEngine', state: !rightSteamEngineOn.value });
    rightSteamEngineOn.value = !rightSteamEngineOn.value;
  }
}

async function toggleSprinklerEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('setEngineState', { engine: 'sprinklerEngine', state: !sprinklerEngineOn.value });
    sprinklerEngineOn.value = !sprinklerEngineOn.value;
  }
}

async function click_toggleEngine() {
    sendToPyQt('IntegratedControlSystem_set_response', { method: 'click_toggleSprayEngine', args: {} });
    // 切换到喷雾系统
    sendToPyQt('setEngineState', { engine: 'sprayEngine', state: !sprayEngineOn.value });
    // sendToPyQt('setEngineState', { engine: 'right', state: !rightEngineOn.value });
    sprayEngineOn.value = !sprayEngineOn.value;
    // rightEngineOn.value = !rightEngineOn.value;
}

async function click_toggleLeftSteamEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('IntegratedControlSystem_set_response', { method: 'click_toggleLeftSteamEngine', args: {} });
    sendToPyQt('setEngineState', { engine: 'leftSteamEngine', state: !leftSteamEngineOn.value });
    leftSteamEngineOn.value = !leftSteamEngineOn.value;
  }
}

async function click_toggleRightSteamEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('IntegratedControlSystem_set_response', { method: 'click_toggleRightSteamEngine', args: {} });
    sendToPyQt('setEngineState', { engine: 'rightSteamEngine', state: !rightSteamEngineOn.value });
    rightSteamEngineOn.value = !rightSteamEngineOn.value;
  }
}

async function click_toggleSprinklerEngine() {
  if (environment.isPyQtWebEngine) {
    sendToPyQt('IntegratedControlSystem_set_response', { method: 'click_toggleSprinklerEngine', args: {} });
    sendToPyQt('setEngineState', { engine: 'sprinklerEngine', state: !sprinklerEngineOn.value });
    sprinklerEngineOn.value = !sprinklerEngineOn.value;
  }
}

function focusInput(inputName) {
  focusedInput.value = inputName;
  showKeyboard.value = true;
  currentValue.value = inputName === 'singleRunTime' ? tempSingleRunTime.value.toString() :
                      inputName === 'runIntervalTime' ? tempRunIntervalTime.value.toString() :
                      tempLoopInterval.value.toString();
}

function updateInputValue(value) {
  const numValue = parseInt(value);
  if (!isNaN(numValue)) {
    if (focusedInput.value === 'singleRunTime') {
      tempSingleRunTime.value = numValue;
      updateSingleRunTime();
    } else if (focusedInput.value === 'runIntervalTime') {
      tempRunIntervalTime.value = numValue;
      updateRunIntervalTime();
    } else if (focusedInput.value === 'loopInterval') {
      tempLoopInterval.value = numValue;
      updateLoopInterval();
    }
  }
  focusedInput.value = null;
}

function updateSingleRunTime() {
  tempSingleRunTime.value = Math.max(1, tempSingleRunTime.value);
  nextSingleRunTime.value = tempSingleRunTime.value;
  updateSprinklerSettings();
}

function updateRunIntervalTime() {
  tempRunIntervalTime.value = Math.max(0, tempRunIntervalTime.value);
  nextRunIntervalTime.value = tempRunIntervalTime.value;
  updateSprinklerSettings();
}

function updateLoopInterval() {
  tempLoopInterval.value = Math.max(0, tempLoopInterval.value);
  nextLoopInterval.value = tempLoopInterval.value;
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
    sendToPyQt('controlSprinkler', { target: 'settings', settings: JSON.stringify(settings) });
  } else {
    console.log('在普通网页环境中执行更新设置');
  }
}

async function startSystem() {
  sendToPyQt('IntegratedControlSystem_set_response', { method: 'startSystem', args: {} });
  if (isRunning.value || !isAutoMode.value) return;
  isRunning.value = true;
  waterLevels.value = Array(12).fill(0);
  await runCycle();
}

async function stopSystem() {
  sendToPyQt('IntegratedControlSystem_set_response', { method: 'stopSystem', args: {} });
  // 停止自动系统时，关闭当前喷头，停止喷雾循环
  if (environment.isPyQtWebEngine) {
    if (activeSprinkler.value > 0) {
      sendToPyQt('controlSprinkler', { target: "auto_control_sprayer", index: activeSprinkler.value, state: 0 });
      // 水泵关闭
      sendToPyQt('controlSprinkler', { target: "tankWork" , state: 0 });
    }

    sendToPyQt('controlSprinkler', { target: 'setState', state: false });
  }

  // 如果有引擎被后端激活，关闭它
  if (sprayEngineOn.value) {
    await toggleSprayEngine();
  }

  if (leftSteamEngineOn.value) {
    await toggleLeftSteamEngine();
  }

  if (rightSteamEngineOn.value) {
    await toggleRightSteamEngine();
  }

  if (sprinklerEngineOn.value) {
    await toggleSprinklerEngine();
  }

  stopSystemWithoutSend();
}

function stopSystemWithoutSend() {
  isRunning.value = false;
  clearInterval(waterTimer);
  clearAllTimers();

  activeSprinkler.value = 0;
  currentPhase.value = '';
  waterLevels.value = Array(12).fill(0);
  remainingTime.value = 0;
}

async function runCycle() {
  activeSprinkler.value = 1;
  sendToPyQt('controlSprinkler', { target: "tankWork" , state: 1 });
  runSprinkler();
}

function updateRemainingTime() {
  if (!isRunning.value || !isAutoMode.value) return;
  remainingTime.value--;
  if (remainingTime.value > 0) {
    timer = setTimeout(updateRemainingTime, 1000);
    timers.value.push(timer);
  }
}

function runSprinkler() {
  if (!isRunning.value || !isAutoMode.value) return;

  currentPhase.value = 'run';
  currentSingleRunTime.value = nextSingleRunTime.value;
  remainingTime.value = currentSingleRunTime.value;
  phaseStartTime.value = Date.now();
  updateRemainingTime();

  let startTime = Date.now();
  sendToPyQt('controlSprinkler', { target: "auto_control_sprayer", index: activeSprinkler.value, state: 1 });

  waterTimer = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let progress = Math.min(elapsedTime / (currentSingleRunTime.value * 1000), 1);
    waterLevels.value[activeSprinkler.value - 1] = progress * 100;
  }, 100);

  timer = setTimeout(async () => {
    clearInterval(waterTimer);
    if (activeSprinkler.value < 12) {
      waterLevels.value[activeSprinkler.value - 1] = 0;
      sendToPyQt('controlSprinkler', { target: "auto_control_sprayer", index: activeSprinkler.value, state: 0 });
      activeSprinkler.value++;
      runSprinkler();
    } else {
      waterLevels.value[activeSprinkler.value - 1] = 0;
      sendToPyQt('controlSprinkler', { target: "auto_control_sprayer", index: activeSprinkler.value, state: 0 });
      
      sendToPyQt('controlSprinkler', { target: "tankWork" , state: 0 });
      runLoopInterval();
    }
  }, currentSingleRunTime.value * 1000);

  timers.value.push(timer);
}

async function runLoopInterval() {
  if (!isRunning.value || !isAutoMode.value) return;

  currentLoopInterval.value = nextLoopInterval.value;
  remainingTime.value = currentLoopInterval.value;

    // setState是为标识喷雾系统是否工作
    sendToPyQt('controlSprinkler', { target: 'setState', state: true });

    phaseStartTime.value = Date.now();
    currentPhase.value = 'loop';
  
    updateRemainingTime();

    timer = setTimeout(async () => {
      waterLevels.value = Array(12).fill(0);

      sendToPyQt('controlSprinkler', { target: 'setState', state: false });
      if (sprayEngineOn.value) {
        await toggleSprayEngine();
      }

      if (leftSteamEngineOn.value) {
        await toggleLeftSteamEngine();
      }

      if (rightSteamEngineOn.value) {
        await toggleRightSteamEngine();
      }

      if (sprinklerEngineOn.value) {
        await toggleSprinklerEngine();
      }

      await runCycle();
    }, currentLoopInterval.value * 1000);

    timers.value.push(timer);
}

function waterHeight(n) {
  return waterLevels.value[n - 1];
}

async function toggleManualSprinkler(n) {
  if (isAutoMode.value) return;

  sendToPyQt('IntegratedControlSystem_set_response', { method: 'toggleManualSprinkler', args: { n: n } });
  
  // 找出当前激活的喷头（如果有）
  const activeIndex = waterLevels.value.findIndex(level => level === 100);
  
  // 检查当前点击的喷头是否已经激活
  if (waterLevels.value[n - 1] > 0) {
    // 如果已激活，则关闭它
    waterLevels.value[n - 1] = 0;
    if (environment.isPyQtWebEngine) {
      // 喷淋系统关闭
      sendToPyQt('controlSprinkler', { target: "manual_control_sprayer", index: n, state: 0 });
      sendToPyQt('controlSprinkler', { target: "tankWork" , state: 0 });
    }
  } else {
    // 如果未激活，关闭当前激活的喷头（如果有），然后激活新的喷头
    if (activeIndex !== -1) {
      waterLevels.value[activeIndex] = 0;
      if (environment.isPyQtWebEngine) {
        sendToPyQt('controlSprinkler', { target: "manual_control_sprayer", index: activeIndex+1, state: 0 });
      }
      // 激活新的喷头
      waterLevels.value[n - 1] = 100;
      if (environment.isPyQtWebEngine) {
        sendToPyQt('controlSprinkler', { target: "manual_control_sprayer", index: n, state: 1 });
      }
    }
    else {
      // 激活新的喷头
      // 喷淋系统打开
      chose_n.value = n;
      sendToPyQt('controlSprinkler', { target: "tankWork" , state: 1 });
      waterLevels.value[n - 1] = 100;
      if (environment.isPyQtWebEngine) {
        sendToPyQt('controlSprinkler', { target: "manual_control_sprayer", index: n, state: 1 });
      }
    }
  }
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
</style>