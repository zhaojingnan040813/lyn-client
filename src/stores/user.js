import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sessionApi, constitutionApi, authApi } from '../api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const sessionId = ref(localStorage.getItem('sessionId') || null)
  const userInfo = ref(null)
  const constitution = ref(null)
  const constitutionInfo = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const isLoggedIn = computed(() => !!sessionId.value && userInfo.value?.userType !== 'anonymous')
  const isRegisteredUser = computed(() => userInfo.value?.userType === 'registered')
  const isAdmin = computed(() => userInfo.value?.role === 'admin')
  const hasConstitution = computed(() => !!constitution.value?.type)
  const username = computed(() => userInfo.value?.username || '游客')

  // 初始化会话
  const initSession = async () => {
    try {
      // 如果已有sessionId，尝试获取会话信息
      if (sessionId.value) {
        try {
          loading.value = true
          const response = await sessionApi.getSession(sessionId.value)
          if (response.code === 0) {
            userInfo.value = response.data.user
            constitution.value = response.data.user.constitution
            // 如果有体质，获取体质详情
            if (constitution.value?.type) {
              await fetchConstitutionInfo(constitution.value.type)
            }
            return
          }
        } catch (err) {
          console.warn('Session not found, creating new one')
        }
      }

      // 创建新会话
      await createSession()
    } finally {
      loading.value = false
    }
  }

  // 创建新会话
  const createSession = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await sessionApi.createSession()
      if (response.code === 0) {
        sessionId.value = response.data.sessionId
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution
        localStorage.setItem('sessionId', sessionId.value)
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to create session:', err)
    } finally {
      loading.value = false
    }
  }

  // 用户注册
  const register = async (username, password) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.register(username, password)
      if (response.code === 0) {
        // 注册成功后自动登录
        sessionId.value = response.data.sessionId
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution
        localStorage.setItem('sessionId', sessionId.value)
        return { success: true, message: '注册成功' }
      } else {
        return { success: false, message: response.message || '注册失败' }
      }
    } catch (err) {
      error.value = err.message || err.data?.message || '注册失败'
      console.error('Failed to register:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 用户登录
  const login = async (username, password) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.login(username, password)
      if (response.code === 0) {
        sessionId.value = response.data.sessionId
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution
        localStorage.setItem('sessionId', sessionId.value)
        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: response.message || '登录失败' }
      }
    } catch (err) {
      error.value = err.message || err.data?.message || '登录失败'
      console.error('Failed to login:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 用户登出
  const logout = async () => {
    try {
      if (sessionId.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Failed to logout:', err)
    } finally {
      // 无论请求是否成功，都清除本地状态
      clearSession()
    }
  }

  // 获取当前用户信息
  const fetchUserInfo = async () => {
    if (!sessionId.value) return null

    try {
      const response = await authApi.getCurrentUser()
      if (response.code === 0) {
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution
        return response.data.user
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err)
      return null
    }
  }

  // 修改密码
  const changePassword = async (currentPassword, newPassword) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.changePassword(currentPassword, newPassword)
      if (response.code === 0) {
        return { success: true, message: '密码修改成功' }
      } else {
        return { success: false, message: response.message || '密码修改失败' }
      }
    } catch (err) {
      error.value = err.message || err.data?.message || '密码修改失败'
      console.error('Failed to change password:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 刷新会话
  const refreshSession = async () => {
    if (!sessionId.value) return false

    try {
      const response = await authApi.refreshSession()
      return response.code === 0
    } catch (err) {
      console.error('Failed to refresh session:', err)
      return false
    }
  }

  // 检查登录状态
  const checkAuthStatus = async () => {
    if (!sessionId.value) return false

    try {
      const response = await authApi.checkAuthStatus()
      if (response.code === 0) {
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution
        return response.data.authenticated
      }
      return false
    } catch (err) {
      console.error('Failed to check auth status:', err)
      return false
    }
  }

  // 设置体质
  const setConstitution = async (constitutionType, method = 'manual') => {
    if (!sessionId.value) {
      console.warn('No session found, cannot set constitution')
      return false
    }

    try {
      loading.value = true
      error.value = null
      const response = await constitutionApi.setUserConstitution(
        sessionId.value,
        constitutionType,
        method
      )
      if (response.code === 0) {
        constitution.value = response.data.constitution
        constitutionInfo.value = response.data.constitutionInfo
        return true
      }
      return false
    } catch (err) {
      error.value = err.message
      console.error('Failed to set constitution:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // 获取体质详情
  const fetchConstitutionInfo = async type => {
    try {
      const response = await constitutionApi.getConstitutionByType(type)
      if (response.code === 0) {
        constitutionInfo.value = response.data
      }
    } catch (err) {
      console.error('Failed to fetch constitution info:', err)
    }
  }

  // 清除会话
  const clearSession = () => {
    sessionId.value = null
    userInfo.value = null
    constitution.value = null
    constitutionInfo.value = null
    localStorage.removeItem('sessionId')
  }

  return {
    // 状态
    sessionId,
    userInfo,
    constitution,
    constitutionInfo,
    loading,
    error,
    // 计算属性
    isLoggedIn,
    isRegisteredUser,
    isAdmin,
    hasConstitution,
    username,
    // 方法
    initSession,
    createSession,
    register,
    login,
    logout,
    fetchUserInfo,
    changePassword,
    refreshSession,
    checkAuthStatus,
    setConstitution,
    fetchConstitutionInfo,
    clearSession
  }
})
