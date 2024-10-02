<template>
  <div class="container">
    <div class="column">
      <div class="status-bar">{{ statusText }}</div>
      <button
        class="activation-button"
        @pointerdown="startActivation"
        @pointerup="endActivation"
        @pointercancel="cancelActivation"
        @pointerleave="cancelActivation"
        :disabled="deviceStatus !== '未激活'"
      >
        {{ activationButtonText }}
        <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
      </button>
    </div>
    <div class="column">
      <input 
        v-model="unlockKey" 
        placeholder="输入解锁密钥"
        readonly
        @focus="showUnlockKeyboard = true"
      >
      <button class="unlock-button" @click="attemptUnlock">解锁</button>
    </div>
    <div v-if="isLocked" class="modal">
      <div class="modal-content">
        <h3>设备已锁定</h3>
        <h3>第 {{ lockCount }} 次锁定</h3>
        <h3>设备随机码: {{ deviceRandomCode }}</h3>
        <input 
          v-model="modalUnlockKey" 
          placeholder="输入解锁密钥"
          readonly
          @focus="showModalUnlockKeyboard = true"
        >
        <button class="unlock-button" @click="attemptModalUnlock">解锁</button>
      </div>
    </div>
    <StrNumericKeyboard
      v-model="unlockKey"
      v-model:showKeyboard="showUnlockKeyboard"
    />
    <StrNumericKeyboard
      v-model="modalUnlockKey"
      v-model:showKeyboard="showModalUnlockKeyboard"
    />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, watch, reactive } from 'vue';
import { useWebChannel } from './useWebChannel';
import StrNumericKeyboard from './StrNumericKeyboard.vue';

const { sendToPyQt } = useWebChannel();
const environment = reactive({
  isPyQtWebEngine: false
});

const deviceStatus = ref('未激活');
const timeToNextLock = ref(0);
const deviceRandomCode = ref('');
const unlockKey = ref('');
const modalUnlockKey = ref('');
const isLocked = ref(false);
const lockInterval = 60; // 30秒
let countdownInterval;
let activationTimer;
const progressWidth = ref(0);
const lockCount = ref(1);
const baseTime = ref(null);

// 新增的状态来控制数字键盘的显示
const showUnlockKeyboard = ref(false);
const showModalUnlockKeyboard = ref(false);

const statusText = computed(() => {
  if (deviceStatus.value === '未激活') {
    return '设备状态: 未激活';
  } else if (deviceStatus.value === '永久激活') {
    return '设备状态: 已永久激活';
  } else {
    return `即将第 ${lockCount.value} 次锁定 - 剩余时间: ${formattedTimeToNextLock.value}`;
  }
});

const formattedTimeToNextLock = computed(() => {
  const days = Math.floor(timeToNextLock.value / (24 * 60 * 60));
  const hours = Math.floor((timeToNextLock.value % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeToNextLock.value % (60 * 60)) / 60);
  const seconds = timeToNextLock.value % 60;
  return `${days}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const activationButtonText = computed(() => {
  return deviceStatus.value === '未激活' ? '按住以激活设备' : deviceRandomCode.value;
});

function startActivation(event) {
  if (deviceStatus.value !== '未激活') return;
  event.target.setPointerCapture(event.pointerId);
  progressWidth.value = 0;
  activationTimer = setInterval(() => {
    progressWidth.value += 2;
    if (progressWidth.value >= 100) {
      clearInterval(activationTimer);
      requestActivation();
    }
  }, 30);
}

function endActivation(event) {
  event.target.releasePointerCapture(event.pointerId);
  cancelActivation();
}

function cancelActivation() {
  clearInterval(activationTimer);
  progressWidth.value = 0;
}

function requestActivation() {
  sendToPyQt('activate_device', {});
}

function activateDevice(randomCode, time) {
  deviceStatus.value = '已激活';
  deviceRandomCode.value = randomCode;
  baseTime.value = new Date(time);
  startCountdown();
}

function startCountdown() {
  updateTimeToNextLock();
  countdownInterval = setInterval(() => {
    if (timeToNextLock.value > 0) {
      timeToNextLock.value--;
    } else {
      lockDevice();
    }
  }, 1000);
}

function updateTimeToNextLock() {
  const now = new Date();
  const lockTime = new Date(baseTime.value.getTime() + lockCount.value * lockInterval * 1000);
  timeToNextLock.value = Math.max(0, Math.floor((lockTime - now) / 1000));
}

function lockDevice() {
  isLocked.value = true;
  clearInterval(countdownInterval);
}

function attemptUnlock() {
  sendToPyQt('check_lock_password', {
    target: "attemptUnlock", 
    password: unlockKey.value, 
    lockCount: lockCount.value, 
    deviceRandomCode: deviceRandomCode.value
  });
  unlockKey.value = '';
}

function attemptModalUnlock() {
  sendToPyQt('check_lock_password', {
    target: "attemptModalUnlock", 
    password: modalUnlockKey.value, 
    lockCount: lockCount.value, 
    deviceRandomCode: deviceRandomCode.value
  });
  modalUnlockKey.value = '';
}

function permanentUnlock() {
  deviceStatus.value = '永久激活';
  isLocked.value = false;
  clearInterval(countdownInterval);
}

function extendLockTime() {
  lockCount.value++;
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  startCountdown();
}

onUnmounted(() => {
  clearInterval(countdownInterval);
  clearInterval(activationTimer);
});

onMounted(() => {
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;

  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行');
    const { message } = useWebChannel();

    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'confirm_lock_password') {
        try {
          const result = JSON.parse(newMessage.content);
          if (result.target === 'attemptUnlock') {
            if (result.result === 'success') {
              extendLockTime();
            }
            else if (result.result === 'forever_success') {
              permanentUnlock();
            }
            else {
              alert('密钥错误');
            }
          } else if (result.target === 'attemptModalUnlock') {
            if (result.result === 'success') {
              isLocked.value = false;
              extendLockTime();
            }
            else if (result.result === 'forever_success') {
              permanentUnlock();
            }
            else if (result.result === 'fail') {
              alert('密钥错误');
            }
          }
        } catch (error) {
          console.error('Failed to parse confirm lock password :', error);
        }
      } else if (newMessage && newMessage.type === 'device_activated') {
        try {
          const result = JSON.parse(newMessage.content);
          activateDevice(result.device_random_code, result.device_base_time);
        } catch (error) {
          console.error('Failed to parse device activation result:', error);
        }
      } else if (newMessage && newMessage.type === 'device_info') {
        try {
          const status = JSON.parse(newMessage.content);
          deviceStatus.value = status.device_status;
          deviceRandomCode.value = status.device_random_code;
          lockCount.value = status.device_lock_count;
          baseTime.value = new Date(status.device_base_time);
          
          if (status.device_status === '已激活') {
            startCountdown();
          } else if (status.device_status === '永久激活') {
            permanentUnlock();
          }
        } catch (error) {
          console.error('Failed to parse device status:', error);
        }
      }
    });

  } else {
    console.log('在普通网页环境中运行');
  }
});
</script>

<style scoped>
h3 {
  font-size: 18px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
}

.column {
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.status-bar {
  font-size: 18px;
  line-height: 1.5;
  height: 42px;
  display: flex;
  align-items: center;
}

button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.activation-button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #ecf0f1;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #34495e;
}

.unlock-button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #4CAF50;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: white;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #4CAF50;
  transition: width 0.1s linear;
}

input {
  height: 40px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}
</style>