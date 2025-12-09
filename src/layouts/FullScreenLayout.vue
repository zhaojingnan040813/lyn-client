<template>
  <div id="fullscreen-layout">
    <router-view />
  </div>
</template>

<script setup>
// 全屏布局组件，不包含导航栏，专门用于登录、注册等全屏页面
</script>

<style>
/* 全屏布局样式 */
#fullscreen-layout {
  min-height: 100vh;
  width: 100%;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}

/* 继承全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Element Plus 组件样式覆盖 */
.el-message {
  border-radius: 8px;
}

.el-notification {
  border-radius: 12px;
}

.el-dialog {
  border-radius: 12px;
}

.el-card {
  border-radius: 12px;
}

.el-button {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

.el-input__wrapper {
  border-radius: 8px;
  transition: all 0.3s;
}

.el-form-item__label {
  font-weight: 500;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
