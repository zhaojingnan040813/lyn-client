<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-food-cream via-amber-50 to-orange-50 relative overflow-hidden"
  >
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0">
      <div class="absolute top-10 left-10 text-6xl opacity-10 animate-pulse-slow">🥗</div>
      <div
        class="absolute top-20 right-20 text-4xl opacity-10 animate-pulse-slow"
        style="animation-delay: 0.5s"
      >
        🍛
      </div>
      <div
        class="absolute bottom-20 left-20 text-5xl opacity-10 animate-pulse-slow"
        style="animation-delay: 1s"
      >
        🍱
      </div>
      <div
        class="absolute bottom-10 right-10 text-7xl opacity-10 animate-pulse-slow"
        style="animation-delay: 1.5s"
      >
        🍜
      </div>
      <div
        class="absolute top-1/2 left-1/3 text-4xl opacity-10 animate-pulse-slow"
        style="animation-delay: 2s"
      >
        🍲
      </div>
      <div
        class="absolute top-1/3 right-1/3 text-3xl opacity-10 animate-pulse-slow"
        style="animation-delay: 2.5s"
      >
        🥘
      </div>
    </div>

    <!-- 注册卡片 -->
    <div class="relative z-10 w-full max-w-md mx-4">
      <div class="food-card food-decoration p-8 md:p-10">
        <!-- 头部区域 -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-food-green to-food-secondary rounded-full mb-4 shadow-food-lg"
          >
            <span class="text-4xl">🥗</span>
          </div>
          <h1 class="text-3xl font-bold text-food-brown mb-2 font-title">加入智膳</h1>
          <p class="text-food-brown/70 text-sm">开启您的个性化美食健康之旅</p>
        </div>

        <!-- 注册表单 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-width="0"
          size="large"
          @submit.prevent="handleRegister"
          class="space-y-6"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
              clearable
              class="food-input"
              @keyup.enter="handleRegister"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
              class="food-input"
              @keyup.enter="handleRegister"
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              prefix-icon="Lock"
              show-password
              clearable
              class="food-input"
              @keyup.enter="handleRegister"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="w-full h-12 text-base font-semibold shadow-food hover:shadow-food-lg transform hover:-translate-y-0.5 transition-all duration-300"
              :loading="userStore.loading"
              @click="handleRegister"
            >
              <span v-if="!userStore.loading" class="flex items-center gap-2">
                <span>🌱</span>
                创建账号
              </span>
              <span v-else>正在注册...</span>
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部链接 -->
        <div class="mt-8 text-center space-y-4">
          <div class="text-sm text-food-brown/70">
            已有账号？
            <router-link
              to="/login"
              class="text-food-orange hover:text-food-red font-semibold transition-colors duration-200 hover:underline"
            >
              立即登录
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
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单引用
const registerFormRef = ref()

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 密码确认验证器
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    // 表单验证
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    // 调用注册方法
    const result = await userStore.register(registerForm.username, registerForm.password)

    if (result.success) {
      ElMessage.success(result.message)
      // 注册成功后跳转到重定向页面或首页
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('Register error:', error)
    ElMessage.error('注册过程中发生错误')
  }
}

// 组件挂载时检查是否已登录
onMounted(() => {
  if (userStore.isLoggedIn) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  }
})
</script>

<style scoped></style>
