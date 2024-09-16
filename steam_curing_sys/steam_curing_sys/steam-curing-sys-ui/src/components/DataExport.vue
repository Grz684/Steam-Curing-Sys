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
    </div>

    <!-- 自定义确认弹窗 -->
    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal-content">
        <p>确定要清空所有数据吗？此操作不可撤销。</p>
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
import { reactive, ref, onMounted } from 'vue';
import { useWebChannel } from './useWebChannel';

const { sendToPyQt } = useWebChannel();
const environment = reactive({
  isPyQtWebEngine: false
});

const showConfirm = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');

onMounted(() => {
  environment.isPyQtWebEngine = typeof window.qt !== 'undefined' && window.qt.webChannelTransport;

  if (environment.isPyQtWebEngine) {
    console.log('在PyQt QWebEngine环境中运行');
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

button {
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
  margin-top: 20px;
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