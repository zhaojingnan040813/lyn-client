<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-food-cream/30 via-amber-50/50 to-orange-50/30"
  >
    <!-- 全屏页面不显示导航栏 -->
    <template v-if="$route.meta.hideNavbar">
      <router-view />
    </template>

    <!-- 普通页面显示导航栏 -->
    <el-container v-else class="app-container min-h-screen">
      <!-- 顶部导航栏 -->
      <el-header
        class="app-header bg-white/90 backdrop-blur-md border-b border-food-cream/50 shadow-warm"
      >
        <div class="header-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Logo和品牌区域 -->
          <div class="flex items-center gap-3 mr-8">
            <div
              class="w-10 h-10 bg-gradient-to-br from-food-orange to-food-red rounded-lg flex items-center justify-center shadow-food"
            >
              <span class="text-xl">🍽️</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-food-brown font-title">智膳</h1>
              <p class="text-xs text-food-brown/60">智能美食健康顾问</p>
            </div>
          </div>

          <!-- 导航菜单 -->
          <el-menu
            :default-active="$route.path"
            mode="horizontal"
            router
            class="nav-menu flex-1 border-none bg-transparent"
            :ellipsis="false"
          >
            <el-menu-item
              index="/ai-diagnosis"
              class="group hover:bg-food-orange/10 rounded-lg mx-1 transition-all duration-200"
            >
              <el-icon class="group-hover:text-food-orange transition-colors">
                <ChatDotRound />
              </el-icon>
              <span class="ml-2">AI问诊</span>
            </el-menu-item>
            <el-menu-item
              index="/constitution-diagnosis"
              class="group hover:bg-food-orange/10 rounded-lg mx-1 transition-all duration-200"
            >
              <el-icon class="group-hover:text-food-orange transition-colors">
                <UserFilled />
              </el-icon>
              <span class="ml-2">体质诊断</span>
            </el-menu-item>
            <el-menu-item
              index="/taste-optimization"
              class="group hover:bg-food-orange/10 rounded-lg mx-1 transition-all duration-200"
            >
              <el-icon class="group-hover:text-food-orange transition-colors">
                <Operation />
              </el-icon>
              <span class="ml-2">口味调优</span>
            </el-menu-item>
            <el-menu-item
              index="/recipe-recommendation"
              class="group hover:bg-food-orange/10 rounded-lg mx-1 transition-all duration-200"
            >
              <el-icon class="group-hover:text-food-orange transition-colors"><Star /></el-icon>
              <span class="ml-2">至膳推荐</span>
            </el-menu-item>
            <el-menu-item
              index="/dish-management"
              class="group hover:bg-food-orange/10 rounded-lg mx-1 transition-all duration-200"
            >
              <el-icon class="group-hover:text-food-orange transition-colors"><Menu /></el-icon>
              <span class="ml-2">菜品管理</span>
            </el-menu-item>
          </el-menu>

          <!-- 用户信息区域 -->
          <div class="header-actions flex items-center">
            <UserProfile />
          </div>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="app-main p-6">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ChatDotRound, UserFilled, Operation, Star, Menu } from '@element-plus/icons-vue'
import UserProfile from './components/UserProfile.vue'
</script>

<style scoped>
.app-header {
  height: 64px !important;
  padding: 0;
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 覆盖Element Plus菜单样式 */
:deep(.el-menu--horizontal) {
  border-bottom: none !important;
}

:deep(.el-menu--horizontal .el-menu-item) {
  border-bottom: none !important;
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  color: var(--food-brown);
  font-weight: 500;
}

:deep(.el-menu--horizontal .el-menu-item.is-active) {
  background: var(--food-gradient) !important;
  color: white !important;
  border-radius: 8px;
}

:deep(.el-menu--horizontal .el-menu-item:hover) {
  background: rgba(255, 107, 53, 0.1) !important;
  color: var(--food-primary) !important;
}

:deep(.el-header) {
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .nav-menu {
    display: none;
  }
}
</style>
