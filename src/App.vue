<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-content">
          <!-- <div class="logo">
            <el-icon size="28" color="#409eff"><Bowl /></el-icon>
            <span class="logo-text">智膳</span>
          </div> -->

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

          <!-- <div class="header-actions">
            <el-avatar
              :size="35"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </div> -->
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>

      <!-- 底部 -->
      <el-footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 智膳 - 智能体质膳食推荐系统. All rights reserved.</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { Bowl, ChatDotRound, UserFilled, Operation, Star, Menu } from '@element-plus/icons-vue'
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

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.logo-text {
  color: white;
}

.nav-menu {
  background: transparent;
  border: none;
  flex: 1;
  justify-content: center;
}

.nav-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav-menu .el-menu-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-menu .el-menu-item.is-active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border-bottom-color: white;
}

.nav-menu .el-menu-item .el-icon {
  margin-right: 5px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-main {
  padding: 0;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.app-footer {
  background: #2c3e50;
  color: white;
  padding: 20px 0;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content p {
  margin: 0;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    padding: 10px;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .header-actions {
    order: 2;
  }

  .logo {
    order: 1;
    margin-bottom: 10px;
  }
}
</style>
