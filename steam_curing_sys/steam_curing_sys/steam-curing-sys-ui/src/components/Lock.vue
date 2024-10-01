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
      <input v-model="unlockKey" placeholder="输入解锁密钥">
      <button class="unlock-button" @click="attemptUnlock">解锁</button>
    </div>
    <div v-if="isLocked" class="modal">
      <div class="modal-content">
        <h3>设备已锁定</h3>
        <h3>第 {{ lockCount }} 次锁定</h3>
        <h3>设备随机码: {{ deviceRandomCode }}</h3>
        <input v-model="modalUnlockKey" placeholder="输入解锁密钥">
        <button class="unlock-button" @click="attemptModalUnlock">解锁</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import CryptoJS from 'crypto-js';
import { watch, onMounted, reactive } from 'vue';
import { useWebChannel } from './useWebChannel';
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
const lockInterval = 10; // 10秒
let countdownInterval;
let activationTimer;
const progressWidth = ref(0);
const lockCount = ref(1);

const statusText = computed(() => {
  if (deviceStatus.value === '未激活') {
    return '设备状态: 未激活';
  } else if (deviceStatus.value === '永久激活') {
    return '设备状态: 已永久激活';
  } else {
    return `即将第 ${lockCount.value} 次锁定 - 试用时间还剩: ${formattedTimeToNextLock.value}`;
  }
});

const formattedTimeToNextLock = computed(() => {
  const minutes = Math.floor(timeToNextLock.value / 60);
  const seconds = timeToNextLock.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
      activateDevice();
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

function activateDevice() {
  deviceStatus.value = '已激活';
  deviceRandomCode.value = Math.random().toString(36).substr(2, 8).toUpperCase();
  startCountdown();
}

function startCountdown() {
  timeToNextLock.value = lockInterval;
  countdownInterval = setInterval(() => {
    if (timeToNextLock.value > 0) {
      timeToNextLock.value--;
    } else {
      lockDevice();
    }
  }, 1000);
}

function lockDevice() {
  isLocked.value = true;
  clearInterval(countdownInterval);
}

function attemptUnlock() {
  // if (unlockKey.value === '12345') {
  //   permanentUnlock();
  // } else if (validatePassword(unlockKey.value)) {
  //   lockCount.value++;
  //   extendLockTime();
  // } else {
  //   alert('密钥错误');
  // }
  sendToPyQt('check_lock_password', {target:"attemptUnlock", password: unlockKey.value, 
    lockCount: lockCount.value, deviceRandomCode: deviceRandomCode.value});
  unlockKey.value = '';
}

function attemptModalUnlock() {
  // if (modalUnlockKey.value === '12345') {
  //   permanentUnlock();
  // } else if (validatePassword(modalUnlockKey.value)) {
  //   lockCount.value++;
  //   isLocked.value = false;
  //   startCountdown();
  // } else {
  //   alert('密钥错误');
  // }
  sendToPyQt('check_lock_password', {target:"attemptModalUnlock", password: modalUnlockKey.value, 
    lockCount: lockCount.value, deviceRandomCode: deviceRandomCode.value});
  modalUnlockKey.value = '';
}

function permanentUnlock() {
  deviceStatus.value = '永久激活';
  isLocked.value = false;
  clearInterval(countdownInterval);
}

function extendLockTime() {
  timeToNextLock.value += lockInterval;
  if (!countdownInterval) {
    startCountdown();
  }
}

function generateUnlockPassword() {
  // 秘密密钥，请确保在实际应用中保护好这个密钥
  const secretKey = 'the_secret_key_of_fute_company';

  // 组合输入
  const message = `${deviceRandomCode.value}:${lockCount.value}`;

  // 生成 HMAC-SHA256 哈希
  const hash = CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Hex);

  // 使用 BigInt 解析前16个十六进制字符
  const hashInt = BigInt('0x' + hash.slice(0, 16));

  // 映射到6位数字
  const password = (hashInt % 1000000n).toString().padStart(6, '0');

  console.log('Expected password:', password);

  return password;
}

/**
 * 验证输入密码是否正确
 * @param {string} inputPassword - 用户输入的密码
 * @param {string} deviceRandomCode - 设备随机码
 * @param {number} lockCount - 锁定次数
 * @returns {boolean} 是否正确
 */
function validatePassword(inputPassword) {
  const expectedPassword = generateUnlockPassword();
  return inputPassword === expectedPassword;
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
              lockCount.value++;
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
              lockCount.value++;
              isLocked.value = false;
              startCountdown();
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