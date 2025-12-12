<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-food-cream via-amber-50 to-orange-50 relative overflow-hidden"
  >
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0">
      <div class="absolute top-10 left-10 text-6xl opacity-10 animate-pulse-slow">🥘</div>
      <div
        class="absolute top-20 right-20 text-4xl opacity-10 animate-pulse-slow"
        style="animation-delay: 0.5s"
      >
        🍲
      </div>
      <div
        class="absolute bottom-20 left-20 text-5xl opacity-10 animate-pulse-slow"
        style="animation-delay: 1s"
      >
        🍜
      </div>
      <div
        class="absolute bottom-10 right-10 text-7xl opacity-10 animate-pulse-slow"
        style="animation-delay: 1.5s"
      >
        🍱
      </div>
      <div
        class="absolute top-1/2 left-1/3 text-4xl opacity-10 animate-pulse-slow"
        style="animation-delay: 2s"
      >
        🥗
      </div>
      <div
        class="absolute top-1/3 right-1/3 text-3xl opacity-10 animate-pulse-slow"
        style="animation-delay: 2.5s"
      >
        🍛
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-md mx-4">
      <div class="food-card food-decoration p-8 md:p-10">
        <!-- 头部区域 -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-food-orange to-food-red rounded-full mb-4 shadow-food-lg"
          >
            <span class="text-4xl">🍽️</span>
          </div>
          <h1 class="text-3xl font-bold text-food-brown mb-2 font-title">欢迎回来</h1>
          <p class="text-food-brown/70 text-sm">登录智膳系统，开启您的美食健康之旅</p>
        </div>

        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="0"
          size="large"
          @submit.prevent="handleLogin"
          class="space-y-6"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
              clearable
              class="food-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
              class="food-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="w-full h-12 text-base font-semibold shadow-food hover:shadow-food-lg transform hover:-translate-y-0.5 transition-all duration-300"
              :loading="userStore.loading"
              @click="handleLogin"
            >
              <span v-if="!userStore.loading" class="flex items-center gap-2">
                <span>🔐</span>
                登录系统
              </span>
              <span v-else>正在登录...</span>
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部链接 -->
        <div class="mt-8 text-center space-y-4">
          <div class="text-sm text-food-brown/70">
            还没有账号？
            <router-link
              to="/register"
              class="text-food-orange hover:text-food-red font-semibold transition-colors duration-200 hover:underline"
            >
              立即注册
            </router-link>
          </div>

          <div class="pt-4 border-t border-food-cream/50">
            <p class="text-xs text-food-brown/50 flex items-center justify-center gap-1">
              <span>🍳</span>
              <span>智膳 - 您的智能美食健康顾问</span>
              <span>🥗</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref()

// 移除游客登录功能，要求必须登录

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    // 调用登录方法
    const result = await userStore.login(loginForm.username, loginForm.password)

    if (result.success) {
      ElMessage.success(result.message)
      // 登录成功后跳转到重定向页面或首页
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error('登录过程中发生错误')
  }
}

// 游客登录功能已移除，要求必须注册或登录

// 组件挂载时检查是否已登录
onMounted(() => {
  if (userStore.isLoggedIn) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  }
})
</script>

<style scoped></style>
