<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>用户登录</h2>
        <p>欢迎回到智能体质膳食推荐系统</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
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
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="userStore.loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 游客登录按钮 -->
      <div class="guest-login-section">
        <el-divider content-position="center">
          <span class="divider-text">或</span>
        </el-divider>
        <el-button
          type="info"
          size="large"
          style="width: 100%"
          :loading="guestLoading"
          @click="handleGuestLogin"
        >
          <el-icon><UserFilled /></el-icon>
          游客登录
        </el-button>
        <p class="guest-tip">无需注册，直接体验系统功能</p>
      </div>

      <div class="login-footer">
        <p>
          还没有账号？
          <router-link to="/register" class="link">立即注册</router-link>
        </p>
        <p>
          <router-link to="/" class="link">返回首页</router-link>
        </p>
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

// 游客登录加载状态
const guestLoading = ref(false)

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

// 处理游客登录
const handleGuestLogin = async () => {
  try {
    guestLoading.value = true

    // 调用创建会话方法（等价于初始化会话）
    await userStore.createSession()

    ElMessage.success('游客登录成功')
    // 游客登录成功后跳转到重定向页面或首页
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    console.error('Guest login error:', error)
    ElMessage.error('游客登录过程中发生错误')
  } finally {
    guestLoading.value = false
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

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.el-form {
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.guest-login-section {
  margin-bottom: 20px;
  text-align: center;
}

.divider-text {
  color: #999;
  font-size: 14px;
}

.guest-tip {
  margin-top: 12px;
  color: #666;
  font-size: 12px;
  margin-bottom: 0;
}

.login-footer {
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.login-footer p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.link {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s;
}

.link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #409eff inset;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--info) {
  background: linear-gradient(135deg, #909399 0%, #b1b3b8 100%);
  border: none;
}

:deep(.el-button--info:hover) {
  background: linear-gradient(135deg, #b1b3b8 0%, #909399 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(144, 147, 153, 0.3);
}

:deep(.el-divider__text) {
  background-color: white;
  padding: 0 20px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 0 15px;
  }

  .login-header h2 {
    font-size: 24px;
  }
}
</style>
