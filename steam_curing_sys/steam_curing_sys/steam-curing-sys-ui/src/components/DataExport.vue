<template>
  <div class="data-actions">
    <div class="action-buttons">
      <div class="button-group">
        <i class="fas fa-file-excel"></i>
        <button @click="exportData" class="export-btn">导出数据</button>
      </div>
      <div class="button-group">
        <i class="fas fa-trash-alt"></i>
        <button @click="showConfirmDialog" class="clear-btn">清空数据</button>
      </div>
      <div class="button-group">
        <i class="fas fa-cog"></i>
        <button @click="showSettingsDialog" class="settings-btn">传感器设置</button>
      </div>
    </div>

    <!-- 传感器设置弹窗 -->
    <div v-if="showSettings" class="modal-overlay">
      <div class="modal-content settings-modal">
        <div class="setting-group">
          <h2>传感器数据设置（设为正/负数使数据整体上/下调）</h2>
          <div class="setting-item">
            <span class="setting-label">温度数据设置：</span>
            <div class="setting-controls">
              <button @click="adjustValue('tempAdjust', -1)">-</button>
              <span class="value-display">{{ tempTempAdjust }}</span>
              <button @click="adjustValue('tempAdjust', 1)">+</button>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">湿度数据设置：</span>
            <div class="setting-controls">
              <button @click="adjustValue('humidityAdjust', -1)">-</button>
              <span class="value-display">{{ tempHumidityAdjust }}</span>
              <button @click="adjustValue('humidityAdjust', 1)">+</button>
            </div>
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="saveAdjustSettings" class="confirm-btn">保存</button>
          <button @click="closeAdjustSettings" class="cancel-btn">取消</button>
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
        <p>{{ alertMessage }}</p>
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

const showSettings = ref(false)
const tempAdjust = ref(0)
const humidityAdjust = ref(0)
const tempTempAdjust = ref(0)
const tempHumidityAdjust = ref(0)

const showSettingsDialog = () => {
  // 打开时把显示值变成保存值
  tempTempAdjust.value = tempAdjust.value
  tempHumidityAdjust.value = humidityAdjust.value
  showSettings.value = true
}

const closeAdjustSettings = () => {
  // 重置临时值为原始值
  tempHumidityAdjust.value = humidityAdjust.value
  tempTempAdjust.value = tempAdjust.value
  showSettings.value = false
}

const saveAdjustSettings = () => {
  tempAdjust.value = tempTempAdjust.value
  humidityAdjust.value = tempHumidityAdjust.value
  showSettings.value = false
  sendToPyQt("saveAdjustSettings", { temp_adjust: tempAdjust.value, humidity_adjust: humidityAdjust.value });
}

const adjustValue = (type, change) => {
  if (type === 'tempAdjust') {
    tempTempAdjust.value = tempTempAdjust.value + change
  } else if (type === 'humidityAdjust') {
    tempHumidityAdjust.value = tempHumidityAdjust.value + change
  }
}

onMounted(() => {
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;

  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行');
    const { message } = useWebChannel();

    watch(message, (newMessage) => {
      if (newMessage && newMessage.type === 'update_adjust_settings') {
        try {
          const settings = JSON.parse(newMessage.content);
          tempAdjust.value = settings['temp_adjust'];
          humidityAdjust.value = settings['humidity_adjust'];
        } catch (error) {
          console.error('Failed to parse adjust settings:', error);
        }
      }
      else if (newMessage && newMessage.type === 'DataExport_init') {
        const initialState = {
          tempAdjust: tempAdjust.value,
          humidityAdjust: humidityAdjust.value
        };

        console.log('Sending initial DataExport state:', initialState);
        sendToPyQt('DataExport_init_response', initialState);
      }
      else if (newMessage && newMessage.type === 'DataExport_set')
      {
        const set_pak = JSON.parse(newMessage.content);
        if (set_pak.method === 'saveAdjustSettings') {
          tempTempAdjust.value = set_pak.args.tempAdjust
          tempHumidityAdjust.value = set_pak.args.humidityAdjust
          saveAdjustSettings()
        }
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
};

const cancelClearData = () => {
  showConfirm.value = false;
};

const clearData = () => {
  console.log('清空数据');
  showConfirm.value = false;
  showCustomAlert('所有数据已清空！');
  // 这里添加实际的数据清空逻辑
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
}

.settings-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.setting-group {
  flex: 1;
  padding: 10px;
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 18px;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.setting-label {
  flex: 1;
  margin-right: 10px;
  font-size: 18px;
}

.setting-controls {
  display: flex;
  align-items: center;
}

.setting-controls button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.setting-controls button:hover {
  background-color: #0056b3;
}

.value-display {
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  line-height: 40px;  /* 设置与height相同的值 */
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

.modal-buttons button {
  flex: 1;
  padding: 10px 16px;
  font-size: 16px;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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

.fas {
  font-size: 20px;
}

.fa-file-excel {
  color: #1D6F42;
}

.fa-trash-alt {
  color: #e74c3c;
}

/* 模态框样式 */
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
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.confirm-btn, .cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn {
  background-color: #4CAF50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.confirm-btn:hover, .cancel-btn:hover {
  opacity: 0.8;
}
</style>