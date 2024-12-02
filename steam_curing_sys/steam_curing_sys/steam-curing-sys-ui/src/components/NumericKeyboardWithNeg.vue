<template>
  <div v-if="showKeyboard" class="numeric-keyboard">
    <div class="keyboard">
      <div class="current-value">{{ currentInput }}</div>
      <div v-for="row in keyboardLayout" :key="row.join()" class="row">
        <button 
          v-for="key in row" 
          :key="key" 
          @click="handleKeyPress(key)"
          :class="{
            'function-key': ['清除', '确定'].includes(key),
            'operator-key': key === '-'
          }"
        >
          {{ key }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  showKeyboard: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'update:showKeyboard']);

const keyboardLayout = ref([
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['-', '0', '.'],
  ['清除', '确定']
]);

const currentInput = ref('');

watch(() => props.showKeyboard, (newValue) => {
  if (newValue) {
    currentInput.value = props.modelValue.toString();
  }
});

const handleKeyPress = (key) => {
  if (key === '清除') {
    currentInput.value = '';
  } else if (key === '确定') {
    emit('update:modelValue', parseFloat(currentInput.value) || 0);
    emit('update:showKeyboard', false);
  } else if (key === '-') {
    // 如果已经有负号，则移除它；如果没有，则在开头添加负号
    if (currentInput.value.startsWith('-')) {
      currentInput.value = currentInput.value.slice(1);
    } else {
      currentInput.value = '-' + currentInput.value;
    }
  } else if (key === '.') {
    // 确保只能输入一个小数点
    if (!currentInput.value.includes('.')) {
      currentInput.value += key;
    }
  } else {
    currentInput.value += key;
  }
};
</script>

<style scoped>
.numeric-keyboard {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.keyboard {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}

.current-value {
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  text-align: right;
  font-size: 24px;
  border-radius: 5px;
  min-height: 30px;
}

.row {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

button {
  width: 70px;
  height: 70px;
  font-size: 24px;
  margin: 5px;
  border: none;
  background-color: #fff;
  color: #333;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e0e0e0;
}

.function-key {
  background-color: #d0d0d0;
  flex: 1;
}

.function-key:hover {
  background-color: #c0c0c0;
}

.operator-key {
  background-color: #e8e8e8;
}

.operator-key:hover {
  background-color: #d8d8d8;
}
</style>