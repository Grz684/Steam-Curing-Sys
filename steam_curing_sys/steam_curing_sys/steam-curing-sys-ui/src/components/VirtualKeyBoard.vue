<template>
    <!-- keyboard 只识别带有 data-mode 标识的输入框 -->
    <input data-mode value="hello" />
    <KeyBoard :color="'#2c3e50'" :showHandleBar="false" :closeOnClickModal="false" @change='change' class="scaled-keyboard"/>
  </template>
  
  <script lang="ts">
  import "vue-keyboard-virtual-next/keyboard.min.css";
  import KeyBoard from "vue-keyboard-virtual-next";
  import { defineComponent } from "vue";
  export default defineComponent({
    components: { KeyBoard },
    setup() {
      // 第一个参数为当前focus的输入框的value值变化
      // 第二个参数为当前foucs的输入框
      function change(value, inputEl) {
        console.log('change value ---->', value)
        console.log('change input dom ---->', inputEl)
      }
  
      return {
        change
      };
    },
  });
  </script>
  