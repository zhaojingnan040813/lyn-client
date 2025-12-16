<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card animate-scale-in">
        <div class="auth-header">
          <h1 class="auth-title">欢迎回来</h1>
          <p class="auth-subtitle">登录您的账号</p>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input
              v-model="formData.username"
              type="text"
              class="input"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <input
              v-model="formData.password"
              type="password"
              class="input"
              placeholder="请输入密码"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="divider-container">
          <div class="divider">
            <span class="divider-text">或</span>
          </div>
        </div>

        <button 
          type="button" 
          class="btn btn-ghost btn-lg" 
          @click="handleGuestLogin"
          :disabled="loading"
        >
          游客登录
        </button>

        <div class="auth-footer">
          <p class="text-secondary">
            还没有账号？
            <router-link to="/register" class="text-primary font-medium">
              立即注册
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/utils/toast'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const loading = ref(false)
const formData = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(formData.value)
    toast.success('登录成功')
    router.push('/ai-diagnosis')
  } catch (error) {
    toast.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleGuestLogin = async () => {
  loading.value = true
  try {
    await userStore.guestLogin()
    toast.success('以游客身份进入')
    router.push('/ai-diagnosis')
  } catch (error) {
    toast.error(error.message || '游客登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-mesh);
  padding: var(--spacing-xl);
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  padding: var(--spacing-3xl);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.auth-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.auth-form .btn {
  width: 100%;
  margin-top: var(--spacing-md);
}

.divider-container {
  margin: var(--spacing-lg) 0;
}

.divider {
  position: relative;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border-light);
}

.divider-text {
  position: relative;
  display: inline-block;
  padding: 0 var(--spacing-md);
  background: var(--color-bg-elevated);
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}

.auth-footer {
  margin-top: var(--spacing-xl);
  text-align: center;
}
</style>
