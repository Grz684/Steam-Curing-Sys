<template>
  <div class="data-actions">
    <div class="action-buttons">
      <div class="button-group">
        <button @click="exportData" class="export-btn">导出数据</button>
      </div>
      <div class="button-group">
        <button @click="showConfirmDialog" class="clear-btn">清空数据</button>
      </div>
      <div class="button-group">
        <button @click="showSettingsDialog" class="settings-btn">传感器设置</button>
      </div>
    </div>

    <!-- 传感器设置弹窗 -->
    <div v-if="showSettings" class="modal-overlay">
      <div class="modal-content settings-modal">
        <div class="setting-group">
          <h2>传感器调试模式</h2>
          <div class="setting-item">
            <span class="setting-label">调试模式：</span>
            <div class="toggle-switch">
              <input 
                type="checkbox" 
                id="debug-toggle" 
                v-model="tempDebugMode"
              >
              <label for="debug-toggle"></label>
            </div>
          </div>
          <div class="modal-buttons">
            <button @click="saveDebugSettings" class="confirm-btn">保存</button>
            <button @click="closeDebugSettings" class="cancel-btn">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义确认弹窗 -->
    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal-content">
        <h2>确定要清空所有数据吗？此操作不可撤销。</h2>
        <div class="modal-buttons">
          <button @click="clearData" class="confirm-btn">确定</button>
          <button @click="cancelClearData" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <!-- 自定义提示弹窗 -->
    <div v-if="showAlert" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ alertMessage }}</h2>
        <div class="modal-buttons">
          <button @click="closeAlert" class="confirm-btn">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useWebChannel } from './useWebChannel';

const { sendToPyQt } = useWebChannel();
const environment = reactive({
  isPyQtWebEngine: false
});

const showConfirm = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const showSettings = ref(false);
const debugMode = ref(false);
const tempDebugMode = ref(false);

const showSettingsDialog = () => {
  tempDebugMode.value = debugMode.value;
  showSettings.value = true;
  document.body.style.overflow = 'hidden';
}

const closeDebugSettings = () => {
  tempDebugMode.value = debugMode.value;
  showSettings.value = false;
  document.body.style.overflow = 'auto';
}

const saveDebugSettings = () => {
  debugMode.value = tempDebugMode.value;
  showSettings.value = false;
  document.body.style.overflow = 'auto';
  if (environment.isPyQtWebEngine) {
    sendToPyQt("saveDebugSettings", { debug_mode: debugMode.value });
  }
}

onMounted(() => {
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;

  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行');
    const { message } = useWebChannel();

    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'update_debug_mode') {
        try {
          const settings = JSON.parse(newMessage.content);
          debugMode.value = settings['debug_mode'];
          tempDebugMode.value = settings['debug_mode'];
        } catch (error) {
          console.error('Failed to parse debug settings:', error);
        }
      }
      else if (newMessage && newMessage.type === 'DataExport_init') {
        const initialState = {
          debugMode: debugMode.value
        };
        console.log('Sending initial DataExport state:', initialState);
        sendToPyQt('DataExport_init_response', initialState);
      }
      else if (newMessage && newMessage.type === 'clearData') {
        sendToPyQt("exportData", false);
        sendToPyQt("clearData_response", "")
      }
    });
  } else {
    console.log('在普通网页环境中运行');
  }
});

const exportData = () => {
  if (environment.isPyQtWebEngine) {
    console.log('导出数据');
    sendToPyQt("exportData", true);
  }
};

const showConfirmDialog = () => {
  showConfirm.value = true;
  document.body.style.overflow = 'hidden';
};

const cancelClearData = () => {
  showConfirm.value = false;
  document.body.style.overflow = 'auto';
};

const clearData = () => {
  console.log('清空数据');
  showConfirm.value = false;
  showCustomAlert('所有数据已清空！');
  document.body.style.overflow = 'auto';
  if (environment.isPyQtWebEngine) {
    sendToPyQt("exportData", false);
  }
};

const showCustomAlert = (message) => {
  alertMessage.value = message;
  showAlert.value = true;
};

const closeAlert = () => {
  showAlert.value = false;
};
</script>

<style scoped>
.settings-btn {
  background-color: #4CAF50;
  font-size: 18px;
}

.settings-modal {
  min-width: 300px;
  padding: 30px;
}

.setting-group {
  padding: 20px;
}

.setting-group h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 24px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.setting-label {
  font-size: 18px;
  margin-right: 20px;
}

.toggle-switch {
  position: relative;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #4CAF50;
}

.toggle-switch input:checked + label:before {
  transform: translateX(26px);
}

.data-actions {
  font-family: Arial, sans-serif;
  margin: 10px;
  margin-top: 0px;
  margin-bottom: 15px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.button-group button {
  flex: 1;
  padding: 10px 16px;
  font-size: 16px;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.export-btn {
  background-color: #1D6F42;
  font-size: 18px;
}

.export-btn:hover {
  background-color: #15532F;
}

.clear-btn {
  background-color: #e74c3c;
  font-size: 18px;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.modal-buttons button {
  padding: 8px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: white;
}

.confirm-btn {
  background-color: #4CAF50;
}

.cancel-btn {
  background-color: #f44336;
}

.confirm-btn:hover, .cancel-btn:hover {
  opacity: 0.8;
}
</style>