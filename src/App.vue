<template>
  <div id="app">
    <!-- 全屏页面不显示导航栏 -->
    <template v-if="$route.meta.hideNavbar">
      <router-view />
    </template>

    <!-- 普通页面显示导航栏 -->
    <el-container v-else class="app-container">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-content">
          <el-menu
            :default-active="$route.path"
            mode="horizontal"
            router
            class="nav-menu"
            :ellipsis="false"
          >
            <el-menu-item index="/ai-diagnosis">
              <el-icon><ChatDotRound /></el-icon>
              <span>AI问诊</span>
            </el-menu-item>
            <el-menu-item index="/constitution-diagnosis">
              <el-icon><UserFilled /></el-icon>
              <span>体质诊断</span>
            </el-menu-item>
            <el-menu-item index="/taste-optimization">
              <el-icon><Operation /></el-icon>
              <span>口味调优</span>
            </el-menu-item>
            <el-menu-item index="/recipe-recommendation">
              <el-icon><Star /></el-icon>
              <span>至膳推荐</span>
            </el-menu-item>
            <el-menu-item index="/dish-management">
              <el-icon><Menu /></el-icon>
              <span>菜品管理</span>
            </el-menu-item>
          </el-menu>

          <!-- 用户信息区域 -->
          <div class="header-actions">
            <UserProfile />
          </div>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ChatDotRound, UserFilled, Operation, Star, Menu } from '@element-plus/icons-vue'
import UserProfile from './components/UserProfile.vue'
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
}

.app-header {
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0;
  /* background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%); */
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-main {
  padding: 0;
  background-color: #f5f7fa;
  height: calc(100vh - 60px);
}

/* 导航菜单样式 */
.nav-menu {
  background: transparent;
  border: none;
  flex: 1;
}

.nav-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-menu .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-bottom-color: #fff;
}

.nav-menu .el-menu-item .el-icon {
  margin-right: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
  }

  .nav-menu {
    display: none;
  }

  /* 移动端可以添加汉堡菜单 */
  .mobile-menu-btn {
    display: block;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
}

@media (min-width: 769px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* 滚动条样式 */
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
