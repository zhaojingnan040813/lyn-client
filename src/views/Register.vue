<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>加入智能体质膳食推荐系统</p>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="0"
        size="large"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
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
            @keyup.enter="handleRegister"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="userStore.loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <p>
          已有账号？
          <router-link to="/login" class="link">立即登录</router-link>
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
