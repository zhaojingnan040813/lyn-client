import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendMessage, sendMessageStream } from '../api/chat.js'

export const useChatStore = defineStore('chat', () => {
  // 聊天消息列表
  const messages = ref([])

  // 是否正在加载
  const loading = ref(false)

  // 当前正在输入的回复（用于流式显示）
  const currentReply = ref('')

  // 计算属性：是否有消息
  const hasMessages = computed(() => messages.value.length > 0)

  // 格式化历史记录（用于发送给 API）
  const formattedHistory = computed(() => {
    return messages.value.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  })

  /**
   * 添加消息
   * @param {'user' | 'assistant'} role - 角色
   * @param {string} content - 内容
   */
  const addMessage = (role, content) => {
    messages.value.push({
      id: Date.now(),
      role,
      content,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * 发送消息（普通模式）
   * @param {string} content - 消息内容
   */
  const send = async content => {
    if (!content.trim() || loading.value) return

    // 添加用户消息
    addMessage('user', content)
    loading.value = true

    try {
      const response = await sendMessage(content, formattedHistory.value.slice(0, -1))
      addMessage('assistant', response.data.reply)
    } catch (error) {
      console.error('发送消息失败:', error)
      addMessage('assistant', '抱歉，AI 服务暂时不可用，请稍后再试。111')
    } finally {
      loading.value = false
    }
  }

  /**
   * 发送消息（流式模式）
   * @param {string} content - 消息内容
   */
  const sendStream = async content => {
    if (!content.trim() || loading.value) return

    // 添加用户消息
    addMessage('user', content)
    loading.value = true
    currentReply.value = ''

    // 添加一个空的 AI 消息占位
    const aiMessageIndex = messages.value.length
    addMessage('assistant', '')

    try {
      await sendMessageStream(content, formattedHistory.value.slice(0, -1), {
        onMessage: chunk => {
          currentReply.value += chunk
          messages.value[aiMessageIndex].content = currentReply.value
        },
        onError: error => {
          console.error('流式消息错误:', error)
          messages.value[aiMessageIndex].content = '抱歉，AI 服务暂时不可用，请稍后再试。111'
        },
        onComplete: () => {
          currentReply.value = ''
        }
      })
    } catch (error) {
      console.error('发送消息失败:', error)
      messages.value[aiMessageIndex].content = '抱歉，AI 服务暂时不可用，请稍后再试。111'
    } finally {
      loading.value = false
    }
  }

  /**
   * 清空聊天记录
   */
  const clearMessages = () => {
    messages.value = []
    currentReply.value = ''
  }

  return {
    messages,
    loading,
    currentReply,
    hasMessages,
    addMessage,
    send,
    sendStream,
    clearMessages
  }
})
