<template>
  <div class="user-profile">
    <!-- 未登录状态 -->
    <div v-if="!userStore.isLoggedIn" class="guest-actions">
      <el-button type="primary" size="small" @click="goToLogin">登录</el-button>
      <el-button size="small" @click="goToRegister">注册</el-button>
    </div>

    <!-- 已登录状态 -->
    <div v-else class="user-info">
      <el-dropdown @command="handleCommand">
        <div class="user-avatar">
          <el-avatar :size="32" :icon="UserFilled" />
          <span class="username">{{ userStore.username }}</span>
          <el-icon class="arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item v-if="userStore.hasConstitution" command="constitution">
              <el-icon><Star /></el-icon>
              体质信息
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 用户信息对话框 -->
    <el-dialog
      v-model="userInfoDialogVisible"
      title="用户信息"
      width="400px"
      :before-close="handleCloseUserInfoDialog"
    >
      <div class="user-detail">
        <div class="detail-item">
          <label>用户名：</label>
          <span>{{ userStore.userInfo?.username }}</span>
        </div>
        <div class="detail-item">
          <label>用户类型：</label>
          <el-tag :type="userStore.isRegisteredUser ? 'success' : 'info'">
            {{ getUserTypeText(userStore.userInfo?.userType) }}
          </el-tag>
        </div>
        <div v-if="userStore.hasConstitution" class="detail-item">
          <label>体质类型：</label>
          <el-tag type="warning">
            {{ getConstitutionTypeText(userStore.constitution?.type) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <label>注册时间：</label>
          <span>{{ formatDate(userStore.userInfo?.createdAt) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="userInfoDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToProfile">查看详情</el-button>
      </template>
    </el-dialog>

    <!-- 体质信息对话框 -->
    <el-dialog
      v-model="constitutionDialogVisible"
      title="体质信息"
      width="400px"
      :before-close="handleCloseConstitutionDialog"
    >
      <div v-if="userStore.hasConstitution" class="constitution-detail">
        <div class="constitution-header">
          <el-tag size="large" type="warning">
            {{ getConstitutionTypeText(userStore.constitution?.type) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <label>诊断方式：</label>
          <span>
            {{ userStore.constitution?.diagnosisMethod === 'ai' ? 'AI智能诊断' : '手动诊断' }}
          </span>
        </div>
        <div class="detail-item">
          <label>诊断时间：</label>
          <span>{{ formatDate(userStore.constitution?.diagnosedAt) }}</span>
        </div>
        <div v-if="userStore.constitutionInfo" class="constitution-description">
          <h4>体质特点：</h4>
          <p>{{ userStore.constitutionInfo.description }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="constitutionDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToDiagnosis">重新诊断</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, User, ArrowDown, Star, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 对话框显示状态
const userInfoDialogVisible = ref(false)
const constitutionDialogVisible = ref(false)

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

// 处理下拉菜单命令
const handleCommand = command => {
  switch (command) {
    case 'profile':
      userInfoDialogVisible.value = true
      break
    case 'constitution':
      constitutionDialogVisible.value = true
      break
    case 'logout':
      handleLogout()
      break
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

// 关闭用户信息对话框
const handleCloseUserInfoDialog = () => {
  userInfoDialogVisible.value = false
}

// 关闭体质信息对话框
const handleCloseConstitutionDialog = () => {
  constitutionDialogVisible.value = false
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}

// 跳转到用户信息页面
const goToProfile = () => {
  userInfoDialogVisible.value = false
  router.push('/profile')
}

// 跳转到体质诊断页面
const goToDiagnosis = () => {
  constitutionDialogVisible.value = false
  router.push('/constitution-diagnosis')
}
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
}

.guest-actions {
  display: flex;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.2);
}

.username {
  color: #fff;
  font-weight: 500;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  color: #fff;
  font-size: 12px;
  transition: transform 0.3s;
}

.user-detail,
.constitution-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item label {
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
}

.detail-item span {
  color: #333;
  flex: 1;
  text-align: right;
}

.constitution-header {
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.constitution-description {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.constitution-description h4 {
  color: #333;
  margin-bottom: 8px;
}

.constitution-description p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-avatar) {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

@media (max-width: 768px) {
  .username {
    max-width: 60px;
  }

  .guest-actions {
    flex-direction: column;
    gap: 4px;
  }

  .guest-actions .el-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
