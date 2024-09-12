<template>
  <div class="data-actions">
    <!-- <h1>数据操作示例</h1> -->
    <div class="action-buttons">
      <div class="button-group">
        <i class="fas fa-file-excel"></i>
        <button @click="exportData" class="export-btn">导出数据</button>
      </div>
      <div class="button-group">
        <i class="fas fa-trash-alt"></i>
        <button @click="confirmClearData" class="clear-btn">清空数据</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const exportCount = ref(0);

const exportData = () => {
  console.log('导出数据');
  exportCount.value++;
  alert(`数据导出功能已触发！这是第 ${exportCount.value} 次导出。`);
};

const confirmClearData = () => {
  if (confirm('确定要清空所有数据吗？此操作不可撤销。')) {
    clearData();
  }
};

const clearData = () => {
  console.log('清空数据');
  alert('所有数据已清空！');
  // 这里添加实际的数据清空逻辑
};
</script>

<style scoped>
.data-actions {
  font-family: Arial, sans-serif;
  /* max-width: 800px; */
  /* margin: 40px auto; */
  margin: 10px;
  margin-top: 0px;
  margin-bottom: 15px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
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
}

.export-btn:hover {
  background-color: #15532F;
}

.clear-btn {
  background-color: #e74c3c;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.fas {
  font-size: 20px;
}

.fa-file-export {
  color: #1D6F42;
}

.fa-trash-alt {
  color: #e74c3c;
}
</style>