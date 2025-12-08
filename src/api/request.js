import axios from 'axios'

// 创建通用axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60秒超时，适用于普通接口
  headers: {
    'Content-Type': 'application/json'
  }
})

// 创建AI专用axios实例
const aiRequest = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5分钟超时（300秒），适用于AI接口
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加sessionId到请求头
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      config.headers['X-Session-Id'] = sessionId
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// AI请求拦截器
aiRequest.interceptors.request.use(
  config => {
    // 添加sessionId到请求头
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      config.headers['X-Session-Id'] = sessionId
    }
    return config
  },
  error => {
    console.error('AI Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 处理响应错误
    if (error.response) {
      const { status, data } = error.response
      console.error(`API Error [${status}]:`, data?.message || error.message)

      // 可以根据状态码进行不同处理
      switch (status) {
        case 401:
          // 未授权，清除本地存储
          localStorage.removeItem('sessionId')
          break
        case 404:
          console.warn('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          break
      }

      return Promise.reject(data || error)
    }

    // 网络错误
    if (error.message === 'Network Error') {
      console.error('Network error - please check your connection')
    }

    return Promise.reject(error)
  }
)

// AI响应拦截器
aiRequest.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 处理响应错误
    if (error.response) {
      const { status, data } = error.response
      console.error(`AI API Error [${status}]:`, data?.message || error.message)

      // 可以根据状态码进行不同处理
      switch (status) {
        case 401:
          // 未授权，清除本地存储
          localStorage.removeItem('sessionId')
          break
        case 404:
          console.warn('AI Resource not found')
          break
        case 500:
          console.error('AI Server error')
          break
        default:
          break
      }

      return Promise.reject(data || error)
    }

    // 网络错误
    if (error.message === 'Network Error') {
      console.error('AI Network error - please check your connection')
    }

    return Promise.reject(error)
  }
)

export default request

// 导出AI专用请求实例
export { aiRequest }
