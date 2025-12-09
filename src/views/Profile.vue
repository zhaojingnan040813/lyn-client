<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2>个人信息</h2>
      <p>管理您的账户信息和偏好设置</p>
    </div>

    <div class="profile-content">
      <!-- 用户基本信息 -->
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <el-tag :type="userStore.isRegisteredUser ? 'success' : 'info'">
              {{ getUserTypeText(userStore.userInfo?.userType) }}
            </el-tag>
          </div>
        </template>

        <div class="user-info">
          <div class="info-item">
            <label>用户名：</label>
            <span>{{ userStore.userInfo?.username || '游客' }}</span>
          </div>
          <div class="info-item">
            <label>用户ID：</label>
            <span>{{ userStore.userInfo?.id || '-' }}</span>
          </div>
          <div class="info-item">
            <label>用户类型：</label>
            <span>{{ getUserTypeText(userStore.userInfo?.userType) }}</span>
          </div>
          <div class="info-item">
            <label>角色：</label>
            <span>{{ userStore.userInfo?.role === 'admin' ? '管理员' : '普通用户' }}</span>
          </div>
          <div class="info-item">
            <label>注册时间：</label>
            <span>{{ formatDate(userStore.userInfo?.createdAt) }}</span>
          </div>
          <div class="info-item">
            <label>最后登录：</label>
            <span>{{ formatDate(userStore.userInfo?.lastLoginAt) }}</span>
          </div>
          <div class="info-item">
            <label>登录次数：</label>
            <span>{{ userStore.userInfo?.loginCount || 0 }} 次</span>
          </div>
        </div>
      </el-card>

      <!-- 体质信息 -->
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>体质信息</span>
            <el-tag v-if="userStore.hasConstitution" type="success">已诊断</el-tag>
            <el-tag v-else type="warning">未诊断</el-tag>
          </div>
        </template>

        <div class="constitution-info">
          <div v-if="userStore.hasConstitution" class="info-item">
            <label>体质类型：</label>
            <span>{{ getConstitutionTypeText(userStore.constitution?.type) }}</span>
          </div>
          <div v-if="userStore.hasConstitution" class="info-item">
            <label>诊断方式：</label>
            <span>
              {{ userStore.constitution?.diagnosisMethod === 'ai' ? 'AI智能诊断' : '手动诊断' }}
            </span>
          </div>
          <div v-if="userStore.hasConstitution" class="info-item">
            <label>诊断时间：</label>
            <span>{{ formatDate(userStore.constitution?.diagnosedAt) }}</span>
          </div>
          <div v-else class="no-constitution">
            <p>您还没有进行体质诊断</p>
            <el-button type="primary" @click="goToDiagnosis">立即诊断</el-button>
          </div>
        </div>
      </el-card>

      <!-- 密码修改 -->
      <el-card v-if="userStore.isRegisteredUser" class="profile-card">
        <template #header>
          <span>修改密码</span>
        </template>

        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="100px"
          size="default"
        >
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="请输入当前密码"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码（至少6位）"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="userStore.loading" @click="handleChangePassword">
              修改密码
            </el-button>
            <el-button @click="resetPasswordForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 账户操作 -->
      <el-card class="profile-card">
        <template #header>
          <span>账户操作</span>
        </template>

        <div class="account-actions">
          <el-button v-if="!userStore.isRegisteredUser" type="primary" @click="goToRegister">
            注册账号
          </el-button>
          <el-button v-if="userStore.isLoggedIn" type="danger" @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const passwordFormRef = ref()

// 密码修改表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码确认验证器
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 密码修改表单验证规则
const passwordRules = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 获取用户类型文本
const getUserTypeText = userType => {
  const typeMap = {
    anonymous: '游客',
    registered: '注册用户',
    admin: '管理员'
  }
  return typeMap[userType] || '未知'
}

// 获取体质类型文本
const getConstitutionTypeText = type => {
  const typeMap = {
    balanced: '平和质',
    qi_deficiency: '气虚质',
    yang_deficiency: '阳虚质',
    yin_deficiency: '阴虚质',
    phlegm_dampness: '痰湿质',
    damp_heat: '湿热质',
    blood_stasis: '血瘀质',
    qi_stagnation: '气郁质',
    special: '特禀质'
  }
  return typeMap[type] || '未知'
}

// 格式化日期
const formatDate = dateString => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 处理修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    const valid = await passwordFormRef.value.validate()
    if (!valid) return

    const result = await userStore.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    )

    if (result.success) {
      ElMessage.success(result.message)
      resetPasswordForm()
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('Change password error:', error)
    ElMessage.error('修改密码过程中发生错误')
  }
}

// 重置密码表单
const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Logout error:', error)
      ElMessage.error('退出登录过程中发生错误')
    }
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}

// 跳转到体质诊断页面
const goToDiagnosis = () => {
  router.push('/constitution-diagnosis')
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.profile-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info,
.constitution-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  font-weight: 500;
  color: #666;
  width: 120px;
  flex-shrink: 0;
}

.info-item span {
  color: #333;
  flex: 1;
}

.no-constitution {
  text-align: center;
  padding: 20px;
  color: #666;
}

.no-constitution p {
  margin-bottom: 16px;
}

.account-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 10px 0;
}

:deep(.el-card__header) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--danger:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-item label {
    width: auto;
  }

  .account-actions {
    flex-direction: column;
  }
}
</style>
