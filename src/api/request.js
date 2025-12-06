import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 60000, // 增加到60秒，适应AI API较长的响应时间
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

export default request
