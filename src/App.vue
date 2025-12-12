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

<style></style>
