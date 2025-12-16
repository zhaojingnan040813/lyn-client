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

// 直接挂载应用，不在启动时初始化会话
// 会话将在用户登录/注册/游客登录时创建，或在访问需要认证的页面时尝试恢复
app.mount('#app')
