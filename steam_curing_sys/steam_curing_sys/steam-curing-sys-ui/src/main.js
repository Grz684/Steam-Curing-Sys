import { createApp } from 'vue'
import App from './App.vue'

// 为开发模式提供一个默认导出
export default App

// 如果在开发模式下直接运行这个文件，就挂载应用
if (import.meta.env.DEV) {
  createApp(App).mount('#app')
}