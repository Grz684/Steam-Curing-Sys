<template>
  <h2> 喷雾系统 </h2>
  <div class="label-box" >
      <label>输出：output3控制左侧喷雾，output4控制右侧喷雾，output5/6控制小车</label><br>
      <label>自动模式下，当湿度低于设置的湿度下限时，喷雾开启；当湿度高于设置的湿度上限时，喷雾关闭【当有小车时，有一侧喷雾启动，小车即启动，两侧喷雾均关闭，小车才停止】</label><br>
    </div>
  <div class="cart-system">
    <!-- 新增的缺水保护功能 -->
    <!-- <div class="water-protection">
      <div class="water-tank" :class="{ 'low-water': leftTankLowWater }">
        左水箱: {{ leftTankLowWater ? '缺水' : '正常' }}
      </div>
      <div class="water-tank" :class="{ 'low-water': rightTankLowWater }">
        右水箱: {{ rightTankLowWater ? '缺水' : '正常' }}
      </div>
    </div> -->

    <div class="mode-group">
      <div class="mode-group-left">
        <button class="mode-button" :class="{ active: mode === 'semi-auto' && !low_water}" :disabled="low_water" @click="mode === 'auto' ? setMode('semi-auto') : () => {}">半自动模式</button>
        <button class="mode-button" :class="{ active: mode === 'auto' && !low_water}" :disabled="low_water" @click="mode === 'semi-auto' ? setMode('auto') : () => {}">自动模式</button>
      </div>
      <!-- <div class="mode-group-right">
        <button class="mode-button" :class="{ active: tankmode === 'both-side' && !low_water}" :disabled="low_water" @click="tankmode === 'one-side' ? setTankMode('both-side') : () => {}">双边养护</button>
        <button class="mode-button" :class="{ active: tankmode === 'one-side' && !low_water}" :disabled="low_water" @click="tankmode === 'both-side' ? setTankMode('one-side') : () => {}">单边交替养护</button>
      </div> -->
    </div>
    
    <div class="mode-content">
      <div v-if="mode === 'semi-auto'">
        <!-- 将控制区分为左右两个系统 -->
        <div class="spray-systems">
          <!-- 左侧喷雾系统 -->
          <div class="spray-system">
            <h3>双侧定时喷雾系统</h3>
            <div class="controls">
              <div class="input-group">
                <label>喷雾运行时间 (秒):</label>
                <div class="input-wrapper" @click="showLeftRunTimeKeyboard = true">
                  {{ tempLeftRunTime }}
                </div>
              </div>
              <div class="input-group">
                <label>喷雾暂停时间 (秒):</label>
                <div class="input-wrapper" @click="showLeftIntervalTimeKeyboard = true">
                  {{ tempLeftIntervalTime }}
                </div>
              </div>
              <div class="button-group">
                <button @click="startLeftSystem" :disabled="isLeftRunning || low_water">开始</button>
                <button @click="stopLeftSystem" :disabled="!isLeftRunning || low_water">停止</button>
              </div>
            </div>
            
            <div class="visualization">
              <div class="progress-bar">
                <div class="progress" :style="{ width: leftProgress + '%' }"></div>
                <div class="cart" :style="{ left: leftProgress + '%' }">
                  <span class="cart-icon">🚜</span>
                </div>
              </div>
            </div>
            
            <div class="status">
              {{ leftStatusMessage }}
            </div>
          </div>
          
          <!-- 右侧喷雾系统 -->
          <!-- <div class="spray-system">
            <h3>右侧喷雾系统</h3>
            <div class="controls">
              <div class="input-group">
                <label>喷雾运行时间 (秒):</label>
                <div class="input-wrapper" @click="showRightRunTimeKeyboard = true">
                  {{ tempRightRunTime }}
                </div>
              </div>
              <div class="input-group">
                <label>喷雾暂停时间 (秒):</label>
                <div class="input-wrapper" @click="showRightIntervalTimeKeyboard = true">
                  {{ tempRightIntervalTime }}
                </div>
              </div>
              <div class="button-group">
                <button @click="startRightSystem" :disabled="isRightRunning || low_water">开始</button>
                <button @click="stopRightSystem" :disabled="!isRightRunning || low_water">停止</button>
              </div>
            </div>
            
            <div class="visualization">
              <div class="progress-bar">
                <div class="progress" :style="{ width: rightProgress + '%' }"></div>
                <div class="cart" :style="{ left: rightProgress + '%' }">
                  <span class="cart-icon">🚜</span>
                </div>
              </div>
            </div>
            
            <div class="status">
              {{ rightStatusMessage }}
            </div>
          </div> -->
        </div>
      </div>

      <div v-else class="auto-mode-container">
        <div class="auto-mode-title">自动模式左侧喷雾受左侧湿度传感器控制, {{ newStatusMessage }}</div>
        <div class="auto-mode-status" :class="{ 'working': autoModeLeftStatus === '喷雾正在运行' }">
          左侧喷雾：{{ autoModeLeftStatus }}
        </div>
        <div class="auto-mode-title">自动模式右侧喷雾受右侧湿度传感器控制, {{ newStatusMessage2 }}</div>
        <div class="auto-mode-status" :class="{ 'working': autoModeRightStatus === '喷雾正在运行' }">
          右侧喷雾：{{ autoModeRightStatus }}
        </div>
        <div class="auto-mode-placeholder"></div>
      </div>
    </div>

    <!-- 左侧系统的数字键盘 -->
    <NumericKeyboard
      v-model="tempLeftRunTime"
      v-model:showKeyboard="showLeftRunTimeKeyboard"
      @update:modelValue="updateLeftRunTime"
    />
    <NumericKeyboard
      v-model="tempLeftIntervalTime"
      v-model:showKeyboard="showLeftIntervalTimeKeyboard"
      @update:modelValue="updateLeftIntervalTime"
    />

    <!-- 右侧系统的数字键盘 -->
    <NumericKeyboard
      v-model="tempRightRunTime"
      v-model:showKeyboard="showRightRunTimeKeyboard"
      @update:modelValue="updateRightRunTime"
    />
    <NumericKeyboard
      v-model="tempRightIntervalTime"
      v-model:showKeyboard="showRightIntervalTimeKeyboard"
      @update:modelValue="updateRightIntervalTime"
    />
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useWebChannel } from './useWebChannel';
import NumericKeyboard from './NumericKeyboard.vue';

const mode = ref('semi-auto');
const tankmode = ref('both-side');

// 左侧喷雾系统的变量
const currentLeftRunTime = ref(30);
const currentLeftIntervalTime = ref(30);
const tempLeftRunTime = ref(currentLeftRunTime.value);
const tempLeftIntervalTime = ref(currentLeftIntervalTime.value);
const nextLeftRunTime = ref(currentLeftRunTime.value);
const nextLeftIntervalTime = ref(currentLeftIntervalTime.value);
const isLeftRunning = ref(false);
const leftProgress = ref(0);
const leftStatusMessage = ref('喷雾系统就绪');
const showLeftRunTimeKeyboard = ref(false);
const showLeftIntervalTimeKeyboard = ref(false);
const leftPhaseStartTime = ref(0);
let leftAnimationFrame = null;

// 右侧喷雾系统的变量
const currentRightRunTime = ref(30);
const currentRightIntervalTime = ref(30);
const tempRightRunTime = ref(currentRightRunTime.value);
const tempRightIntervalTime = ref(currentRightIntervalTime.value);
const nextRightRunTime = ref(currentRightRunTime.value);
const nextRightIntervalTime = ref(currentRightIntervalTime.value);
const isRightRunning = ref(false);
const rightProgress = ref(0);
const rightStatusMessage = ref('右侧喷雾系统就绪');
const showRightRunTimeKeyboard = ref(false);
const showRightIntervalTimeKeyboard = ref(false);
const rightPhaseStartTime = ref(0);
let rightAnimationFrame = null;

// 通用变量
const autoModeLeftStatus = ref('喷雾尚未工作');
const autoModeRightStatus = ref('喷雾尚未工作');
const low_water = ref(false);

// 新增的缺水状态变量
const leftTankLowWater = ref(false);
const rightTankLowWater = ref(false);

const phaseStartTime = ref(0);

const sensor1_humidity = ref("未知");
const sensor1_error = ref(false);
const sensor2_humidity = ref("未知");
const sensor2_error = ref(false);

const { sendToPyQt } = useWebChannel();
  
const environment = reactive({
  isPyQtWebEngine: false
});

const newStatusMessage = computed(() => {
  if (mode.value === "auto" && sensor1_error.value === false) return `左侧湿度: ${sensor1_humidity.value}%`;
  if (mode.value === "auto" && sensor1_error.value === true) return `左侧湿度: ${sensor1_humidity.value}, 无法使用自动模式, 请检查异常传感器`;
  return " ";
});

const newStatusMessage2 = computed(() => {
  if (mode.value === "auto" && sensor2_error.value === false) return `右侧湿度: ${sensor2_humidity.value}%`;
  if (mode.value === "auto" && sensor2_error.value === true) return `右侧湿度: ${sensor2_humidity.value}, 无法使用自动模式, 请检查异常传感器`;
  return " ";
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
          // 更新左侧系统设置
          if (settings.side === 'left' || !settings.side) {
            tempLeftRunTime.value = settings.dolly_single_run_time;
            tempLeftIntervalTime.value = settings.dolly_run_interval_time;
            nextLeftRunTime.value = tempLeftRunTime.value;
            nextLeftIntervalTime.value = tempLeftIntervalTime.value;
          }
          // 更新右侧系统设置
          if (settings.side === 'right' || !settings.side) {
            tempRightRunTime.value = settings.dolly_single_run_time;
            tempRightIntervalTime.value = settings.dolly_run_interval_time;
            nextRightRunTime.value = tempRightRunTime.value;
            nextRightIntervalTime.value = tempRightIntervalTime.value;
          }
          console.log('dolly Settings updated:', settings);
        } catch (error) {
          console.error('Failed to parse dolly settings data:', error);
        }
      }
      else if (newMessage && newMessage.type === 'update_dolly_state') {
        if (newMessage.content) {
          updateAutoModeLeftStatus("喷雾正在运行");
        }
        else {
          updateAutoModeLeftStatus("喷雾尚未工作");
        }
      }
      else if (newMessage && newMessage.type === 'update_dolly2_state')
      {
        if (newMessage.content) {
          updateAutoModeRightStatus("喷雾正在运行");
        }
        else {
          updateAutoModeRightStatus("喷雾尚未工作");
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
            } else {
              stopLeftSystem();
              stopRightSystem();
            }
          } else {
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
          if (set_pak.args && set_pak.args.side === 'left') {
            startLeftSystem();
          } else if (set_pak.args && set_pak.args.side === 'right') {
            startRightSystem();
          } else {
            // 兼容旧版本
            startLeftSystem();
            startRightSystem();
          }
        }
        else if (set_pak.method === 'stopSystem') {
          if (set_pak.args && set_pak.args.side === 'left') {
            stopLeftSystem();
          } else if (set_pak.args && set_pak.args.side === 'right') {
            stopRightSystem();
          } else {
            // 兼容旧版本
            stopLeftSystem();
            stopRightSystem();
          }
        }
        else if (set_pak.method === 'updateDollySettings') {
          const settings = set_pak.args;
          if (settings.side === 'left') {
            tempLeftRunTime.value = settings.dolly_single_run_time;
            tempLeftIntervalTime.value = settings.dolly_run_interval_time;
            nextLeftRunTime.value = tempLeftRunTime.value;
            nextLeftIntervalTime.value = tempLeftIntervalTime.value;
            updateDollySettings('left');
          } else if (settings.side === 'right') {
            tempRightRunTime.value = settings.dolly_single_run_time;
            tempRightIntervalTime.value = settings.dolly_run_interval_time;
            nextRightRunTime.value = tempRightRunTime.value;
            nextRightIntervalTime.value = tempRightIntervalTime.value;
            updateDollySettings('right');
          } else {
            // 兼容旧版本
            tempLeftRunTime.value = tempRightRunTime.value = settings.dolly_single_run_time;
            tempLeftIntervalTime.value = tempRightIntervalTime.value = settings.dolly_run_interval_time;
            nextLeftRunTime.value = nextRightRunTime.value = tempLeftRunTime.value;
            nextLeftIntervalTime.value = nextRightIntervalTime.value = tempLeftIntervalTime.value;
            updateDollySettings();
          }
          console.log('dolly Settings received:', settings);
        }
        else if (set_pak.method === 'setTankMode') {
          setTankMode(set_pak.args.newMode);
        }
      }
      else if (newMessage && newMessage.type === 'update_sensor_avg_data') {
          console.log('Received sensor avg data:', newMessage.content);
          const data = JSON.parse(newMessage.content);
          if (data.type === 'humidity1') {
            if (data.value !== -1) {
              sensor1_humidity.value = String(data.value);
              sensor1_error.value = false;
            }
            else {
              sensor1_error.value = true;
              sensor1_humidity.value = '未知';
            }
          }
          else if (data.type === 'humidity2') {
            if (data.value !== -1) {
              sensor2_humidity.value = String(data.value);
              sensor2_error.value = false;
            }
            else {
              sensor2_error.value = true;
              sensor2_humidity.value = '未知';
            }
          }
        }
    });
  } else {
    console.log('在普通网页环境中运行');
  }
});

// // 更新左侧喷雾系统状态
// const updateLeftDollyState = (active) => {
//   if (mode.value === 'auto') {
//     if (active) {
//       updateAutoModeLeftStatus("左侧喷雾正在运行");
//     } else {
//       updateAutoModeLeftStatus("左侧喷雾未工作");
//     }
//   }
// };

// // 更新右侧喷雾系统状态
// const updateRightDollyState = (active) => {
//   if (mode.value === 'auto') {
//     if (active) {
//       updateAutoModeLeftStatus("右侧喷雾正在运行");
//     } else {
//       updateAutoModeLeftStatus("右侧喷雾未工作");
//     }
//   }
// };

// 新增函数：收集并发送初始状态
const sendInitialState = () => {
  const initialState = {
    mode: mode.value,
    // 左侧喷雾系统
    currentLeftRunTime: currentLeftRunTime.value,
    currentLeftIntervalTime: currentLeftIntervalTime.value,
    tempLeftRunTime: tempLeftRunTime.value,
    tempLeftIntervalTime: tempLeftIntervalTime.value,
    nextLeftRunTime: nextLeftRunTime.value,
    nextLeftIntervalTime: nextLeftIntervalTime.value,
    isLeftRunning: isLeftRunning.value,
    leftProgress: leftProgress.value,
    leftStatusMessage: leftStatusMessage.value,
    // 右侧喷雾系统
    currentRightRunTime: currentRightRunTime.value,
    currentRightIntervalTime: currentRightIntervalTime.value,
    tempRightRunTime: tempRightRunTime.value,
    tempRightIntervalTime: tempRightIntervalTime.value,
    nextRightRunTime: nextRightRunTime.value,
    nextRightIntervalTime: nextRightIntervalTime.value,
    isRightRunning: isRightRunning.value,
    rightProgress: rightProgress.value,
    rightStatusMessage: rightStatusMessage.value,
    // 通用状态
    autoModeStatus: autoModeLeftStatus.value,
    low_water: low_water.value,
    leftTankLowWater: leftTankLowWater.value,
    rightTankLowWater: rightTankLowWater.value, 
    phaseStartTime: phaseStartTime.value,
    tankmode: tankmode.value,
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
    } else {
      stopLeftSystem();
      stopRightSystem();
    }
  }
})

const setTankMode = (newMode) => {
  tankmode.value = newMode;
  if (newMode === 'one-side') {
    sendToPyQt('controlDolly', { target: 'setTankMode', mode: 'one-side'});
  } else {
    sendToPyQt('controlDolly', { target: 'setTankMode', mode: 'both-side' });
  }
};

const setMode = (newMode) => {
  mode.value = newMode;
  if (environment.isPyQtWebEngine) {
    if (newMode === 'auto') {
      stopLeftSystem();
      stopRightSystem();
      sendToPyQt('controlDolly', { target: 'setMode', mode: 'auto'});
    } else {
      stopDolly('left');
      stopDolly('right');
      updateAutoModeLeftStatus("喷雾尚未工作");
      updateAutoModeRightStatus("喷雾尚未工作");
      sendToPyQt('controlDolly', { target: 'setMode', mode: 'semi-auto' });
    }
  }
};

// 左侧喷雾系统的更新函数
const updateLeftRunTime = () => {
  tempLeftRunTime.value = Math.max(1, parseInt(tempLeftRunTime.value) || 1);
  nextLeftRunTime.value = tempLeftRunTime.value;
  updateDollySettings('left');
};

const updateLeftIntervalTime = () => {
  tempLeftIntervalTime.value = Math.max(0, parseInt(tempLeftIntervalTime.value) || 0);
  nextLeftIntervalTime.value = tempLeftIntervalTime.value;
  updateDollySettings('left');
};

// 右侧喷雾系统的更新函数
const updateRightRunTime = () => {
  tempRightRunTime.value = Math.max(1, parseInt(tempRightRunTime.value) || 1);
  nextRightRunTime.value = tempRightRunTime.value;
  updateDollySettings('right');
};

const updateRightIntervalTime = () => {
  tempRightIntervalTime.value = Math.max(0, parseInt(tempRightIntervalTime.value) || 0);
  nextRightIntervalTime.value = tempRightIntervalTime.value;
  updateDollySettings('right');
};

function updateDollySettings(side = null) {
  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中执行更新设置');
    if (side === 'left') {
      const settings = {
        target: 'dolly_settings',
        side: 'left',
        dolly_single_run_time: nextLeftRunTime.value,
        dolly_run_interval_time: nextLeftIntervalTime.value,
      };
      sendToPyQt('controlDolly', settings);
    } else if (side === 'right') {
      const settings = {
        target: 'dolly_settings',
        side: 'right',
        dolly_single_run_time: nextRightRunTime.value,
        dolly_run_interval_time: nextRightIntervalTime.value,
      };
      sendToPyQt('controlDolly', settings);
    } else {
      // 兼容旧版本，同时更新两边
      const settings = {
        target: 'dolly_settings',
        dolly_single_run_time: nextLeftRunTime.value,
        dolly_run_interval_time: nextLeftIntervalTime.value,
      };
      sendToPyQt('controlDolly', settings);
    }
  } else {
    console.log('在普通网页环境中执行更新设置');
  }
}

// 左侧喷雾系统控制
const startLeftSystem = () => {
  isLeftRunning.value = true;
  runLeftCart();
};

const stopLeftSystem = () => {
  stopDolly('left');
  stopDolly('right');
  isLeftRunning.value = false;
  cancelAnimationFrame(leftAnimationFrame);
  leftProgress.value = 0;
  leftStatusMessage.value = '喷雾系统就绪';
};

// 右侧喷雾系统控制
const startRightSystem = () => {
  isRightRunning.value = true;
  runRightCart();
};

const stopRightSystem = () => {
  stopDolly('right');
  isRightRunning.value = false;
  cancelAnimationFrame(rightAnimationFrame);
  rightProgress.value = 0;
  rightStatusMessage.value = '右侧喷雾系统就绪';
};

function stopDolly(side = null) {
  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中执行停止喷雾');
    const settings = {
      target: 'setState',
      dolly_state: false,
    };
    
    if (side) {
      settings.side = side;
    }
    
    sendToPyQt('controlDolly', settings);
  } else {
    console.log('在普通网页环境中执行停止喷雾');
  }
}

function tempStopDolly(side = null) {
  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中执行临时停止喷雾');
    const settings = {
      target: 'setState',
      dolly_state: false,
    };
    
    if (side) {
      settings.side = side;
    }
    
    sendToPyQt('tempControlDolly', settings);
  } else {
    console.log('在普通网页环境中执行临时停止喷雾');
  }
}

function startDolly(side = null) {
  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中执行开始喷雾');
    const settings = {
      target: 'setState',
      dolly_state: true,
    };
    
    if (side) {
      settings.side = side;
    }
    
    sendToPyQt('controlDolly', settings);
  } else {
    console.log('在普通网页环境中执行开始喷雾');
  }
}

// 左侧喷雾系统运行
const runLeftCart = () => {
  startDolly('left');
  startDolly('right');
  leftStatusMessage.value = '喷雾运行中';
  leftProgress.value = 0;
  const startTime = Date.now();
  leftPhaseStartTime.value = startTime;
  
  currentLeftRunTime.value = nextLeftRunTime.value;
  
  const updateProgress = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, currentLeftRunTime.value - elapsed);
    leftProgress.value = (elapsed / currentLeftRunTime.value) * 100;
    leftStatusMessage.value = `喷雾运行中: 剩余 ${remaining.toFixed(1)} 秒`;
    
    if (elapsed < currentLeftRunTime.value && isLeftRunning.value) {
      leftAnimationFrame = requestAnimationFrame(updateProgress);
    } else if (isLeftRunning.value) {
      leftProgress.value = 100;
      if (nextLeftIntervalTime.value > 0) {
        tempStopDolly('left');
        tempStopDolly('right');
      }
      startLeftInterval();
    }
  };
  
  leftAnimationFrame = requestAnimationFrame(updateProgress);
};

const startLeftInterval = () => {
  leftStatusMessage.value = '等待下次运行';
  const startTime = Date.now();
  leftPhaseStartTime.value = startTime;
  
  currentLeftIntervalTime.value = nextLeftIntervalTime.value;
  
  const updateNextRun = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, currentLeftIntervalTime.value - elapsed);
    leftStatusMessage.value = `等待下次运行: ${remaining.toFixed(1)}秒`;
    
    if (remaining > 0 && isLeftRunning.value) {
      leftAnimationFrame = requestAnimationFrame(updateNextRun);
    } else if (isLeftRunning.value) {
      runLeftCart();
    }
  };
  
  leftAnimationFrame = requestAnimationFrame(updateNextRun);
};

// 右侧喷雾系统运行
const runRightCart = () => {
  startDolly('right');
  rightStatusMessage.value = '右侧喷雾运行中';
  rightProgress.value = 0;
  const startTime = Date.now();
  rightPhaseStartTime.value = startTime;
  
  currentRightRunTime.value = nextRightRunTime.value;
  
  const updateProgress = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, currentRightRunTime.value - elapsed);
    rightProgress.value = (elapsed / currentRightRunTime.value) * 100;
    rightStatusMessage.value = `右侧喷雾运行中: 剩余 ${remaining.toFixed(1)} 秒`;
    
    if (elapsed < currentRightRunTime.value && isRightRunning.value) {
      rightAnimationFrame = requestAnimationFrame(updateProgress);
    } else if (isRightRunning.value) {
      rightProgress.value = 100;
      if (nextRightIntervalTime.value > 0) {
        tempStopDolly('right');
      }
      startRightInterval();
    }
  };
  
  rightAnimationFrame = requestAnimationFrame(updateProgress);
};

const startRightInterval = () => {
  rightStatusMessage.value = '等待右侧下次运行';
  const startTime = Date.now();
  rightPhaseStartTime.value = startTime;
  
  currentRightIntervalTime.value = nextRightIntervalTime.value;
  
  const updateNextRun = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, currentRightIntervalTime.value - elapsed);
    rightStatusMessage.value = `等待右侧下次运行: ${remaining.toFixed(1)}秒`;
    
    if (remaining > 0 && isRightRunning.value) {
      rightAnimationFrame = requestAnimationFrame(updateNextRun);
    } else if (isRightRunning.value) {
      runRightCart();
    }
  };
  
  rightAnimationFrame = requestAnimationFrame(updateNextRun);
};

const updateAutoModeLeftStatus = (status) => {
  autoModeLeftStatus.value = status;
};

const updateAutoModeRightStatus = (status) => {
  autoModeRightStatus.value = status;
};

onUnmounted(() => {
  cancelAnimationFrame(leftAnimationFrame);
  cancelAnimationFrame(rightAnimationFrame);
});
</script>

<style scoped>
/* 标题样式 */
h2, h3, h4, h5 {
  color: #2c3e50;
  margin-bottom: 10px;
}

h2 { font-size: 20px; }
h3 { font-size: 20px; }
h4 { font-size: 18px; }
h5 { font-size: 16px; }

.cart-system {
  margin-top: 0px;
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

/* 喷雾系统布局 */
.spray-systems {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.spray-system {
  flex: 1;
  min-width: 300px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  gap: 60px; /* 按钮组之间的间距 */
  justify-content: center;
  margin-bottom: 20px;
}

/* 创建两个子组来分隔按钮 */
.mode-group-left, .mode-group-right {
  display: flex;
  gap: 10px; /* 同组按钮之间的间距 */
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

/* 说明标签框 */
.label-box {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 0px;
}

.label-box label {
  font-size: 16px;
}
</style>