import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 创建Vue应用
const app = createApp(App)

// 使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 初始化用户会话
import { useUserStore } from './stores/user'
const userStore = useUserStore()

// 在应用挂载前初始化会话
userStore.initSession().then(() => {
  // 挂载应用
  app.mount('#app')
}).catch(err => {
  console.error('Failed to initialize session:', err)
  // 即使初始化失败也挂载应用
  app.mount('#app')
})
