<template>
  <div class="steam-engine-control">
    <!-- <h2>蒸汽机控制系统</h2> -->
    <div class="control-panel">
      <div class="engine-status">
        <div class="engines">
          <div class="engine left">
            <h3>左蒸汽机</h3>
            <div class="status" :class="{ 'on': leftEngineOn }">
              <div class="status-indicator"></div>
              {{ leftEngineOn ? '开' : '关' }}
            </div>
            <button @click="toggleLeftEngine" :disabled="isAutoMode" class="control-btn">
              {{ leftEngineOn ? '关闭' : '开启' }}
            </button>
          </div>
          <div class="engine right">
            <h3>右蒸汽机</h3>
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
      <div class="mode-controls">
        <button @click="setMode('auto')" :class="{ active: isAutoMode }" class="mode-btn">自动模式</button>
        <button @click="setMode('manual')" :class="{ active: !isAutoMode }" class="mode-btn">手动模式</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useWebChannel } from './useWebChannel';

const isAutoMode = ref(true);
const leftEngineOn = ref(false);
const rightEngineOn = ref(false);

const { sendToPyQt } = useWebChannel();

const setMode = (mode) => {
  isAutoMode.value = mode === 'auto';
  if (environment.isPyQtWebEngine) {
    sendToPyQt('setSteamEngineMode', { mode: isAutoMode.value ? 'auto' : 'manual' });
  }
};

const toggleLeftEngine = () => {
  if (!isAutoMode.value && environment.isPyQtWebEngine) {
    sendToPyQt('setEngineState', { engine: 'left', state: !leftEngineOn.value });
    leftEngineOn.value = !leftEngineOn.value;
  }
};

const toggleRightEngine = () => {
  if (!isAutoMode.value && environment.isPyQtWebEngine) {
    sendToPyQt('setEngineState', { engine: 'right', state: !rightEngineOn.value });
    rightEngineOn.value = !rightEngineOn.value;
  }
};

const environment = {
  isPyQtWebEngine: false
};

onMounted(() => {
  // 检查是否在PyQt的QWebEngine环境中
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;

  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行蒸汽机控制');
    const { message } = useWebChannel();

    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'update_left_steam_status') {
        leftEngineOn.value = newMessage.content
      }
      else if (newMessage && newMessage.type === 'update_right_steam_status') {
        rightEngineOn.value = newMessage.content
      }
    });

    // // 初始化时请求当前状态
    // sendToPyQt('requestStatus', {});
  } else {
    console.log('在普通网页环境中运行蒸汽机控制');
    // 可以在这里添加模拟数据或其他适合普通网页环境的逻辑
  }
});
</script>

<style scoped>
/* body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f0f4f8;
} */
.steam-engine-control {
  background-color: white;
  padding: 10px;
  border-radius: 15px;
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); */
  width: 100%;
}
h2 {
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 20px;
}
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.engine-status {
  display: flex;
  flex-direction: column;
  width: 70%;
}
.engines {
  display: flex;
  justify-content: space-between;
}
.mode-controls {
  display: flex;
  flex-direction: column;
  width: 25%;
  align-self: center;
}
.mode-btn {
  margin: 5px 0;
  padding: 15px;
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
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}
.mode-btn:hover:not(.active) {
  background-color: #bdc3c7;
}
.engine {
  text-align: center;
  width: 45%;
}
.engine h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}
.status {
  font-size: 20px;
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
  transition: all 0.3s ease;
}
.status.on .status-indicator {
  box-shadow: 0 0 10px white;
}
.control-btn {
  padding: 10px 20px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-top: 10px;
}
.control-btn:hover:not(:disabled) {
  background-color: #2980b9;
}
.control-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #95a5a6;
}
</style>