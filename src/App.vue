<template>
  <div id="app">
    <el-container class="app-container">
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
import { onMounted } from 'vue'
import { Bowl, ChatDotRound, UserFilled, Operation, Star, Menu } from '@element-plus/icons-vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

// 应用启动时初始化会话
onMounted(async () => {
  try {
    await userStore.initSession()
  } catch (error) {
    console.error('Failed to initialize session:', error)
  }
})
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
</style>
