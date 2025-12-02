import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// 导入全局样式
import './assets/css/variables.css';
import './assets/css/base.css';
import './assets/css/components.css';

// 创建Vue应用
const app = createApp(App);

// 使用Pinia状态管理
const pinia = createPinia();
app.use(pinia);

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app');
