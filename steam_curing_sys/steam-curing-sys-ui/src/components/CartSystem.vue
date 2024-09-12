<template>
  <div class="cart-system">
    <div class="controls">
      <div class="input-group">
        <label>单次运行时间 (秒):</label>
        <input type="number" v-model="tempRunTime" @blur="updateRunTime" min="1" />
      </div>
      <div class="input-group">
        <label>循环间隔时间 (秒):</label>
        <input type="number" v-model="tempIntervalTime" @blur="updateIntervalTime" min="0" />
      </div>
      <div class="button-group">
        <button @click="startSystem" :disabled="isRunning">开始</button>
        <button @click="stopSystem" :disabled="!isRunning">停止</button>
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
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const currentRunTime = ref(60);
const currentIntervalTime = ref(120);
const tempRunTime = ref(60);
const tempIntervalTime = ref(120);
const nextRunTime = ref(60);
const nextIntervalTime = ref(120);
const isRunning = ref(false);
const progress = ref(0);
const statusMessage = ref('系统就绪');
let animationFrame = null;

const updateRunTime = () => {
  tempRunTime.value = Math.max(1, parseInt(tempRunTime.value) || 1);
  nextRunTime.value = tempRunTime.value;
};

const updateIntervalTime = () => {
  tempIntervalTime.value = Math.max(0, parseInt(tempIntervalTime.value) || 0);
  nextIntervalTime.value = tempIntervalTime.value;
};

const startSystem = () => {
  isRunning.value = true;
  runCart();
};

const stopSystem = () => {
  isRunning.value = false;
  cancelAnimationFrame(animationFrame);
  progress.value = 0;
  statusMessage.value = '系统就绪';
};

const runCart = () => {
  statusMessage.value = '台车运行中';
  progress.value = 0;
  const startTime = Date.now();
  
  currentRunTime.value = nextRunTime.value;
  
  const updateProgress = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    progress.value = (elapsed / currentRunTime.value) * 100;
    
    if (elapsed < currentRunTime.value && isRunning.value) {
      animationFrame = requestAnimationFrame(updateProgress);
    } else if (isRunning.value) {
      progress.value = 100;
      startInterval();
    }
  };
  
  animationFrame = requestAnimationFrame(updateProgress);
};

const startInterval = () => {
  statusMessage.value = '等待下次运行';
  const startTime = Date.now();
  
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

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.cart-system {
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
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
  padding: 5px;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
button {
  padding: 5px 10px;
  margin-right: 10px;
}
.visualization {
  margin-top: 20px;
}
.progress-bar {
  height: 20px;
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
}
</style>