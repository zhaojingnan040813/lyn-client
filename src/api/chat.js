import request from './request.js'

/**
 * 发送消息到 AI
 * @param {string} message - 用户消息
 * @param {Array} history - 历史对话记录
 * @returns {Promise<{reply: string}>}
 */
export const sendMessage = (message, history = []) => {
  return request.post('/chat', { message, history })
}

/**
 * 发送流式消息到 AI
 * @param {string} message - 用户消息
 * @param {Array} history - 历史对话记录
 * @param {Object} callbacks - 回调函数
 * @param {Function} callbacks.onMessage - 接收消息的回调函数
 * @param {Function} callbacks.onError - 错误处理回调
 * @param {Function} callbacks.onComplete - 完成回调
 */
export const sendMessageStream = async (
  message,
  history = [],
  { onMessage, onError, onComplete }
) => {
  const sessionId = localStorage.getItem('sessionId')

  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionId || ''
      },
      body: JSON.stringify({ message, history })
    })

    if (!response.ok) {
      throw new Error('请求失败')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            onComplete?.()
            return
          }
          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              onMessage?.(parsed.content)
            }
            if (parsed.error) {
              onError?.(new Error(parsed.error))
              return
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
    onComplete?.()
  } catch (error) {
    onError?.(error)
  }
}

export default {
  sendMessage,
  sendMessageStream
}
