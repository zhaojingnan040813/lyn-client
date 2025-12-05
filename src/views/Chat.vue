<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <div class="ai-info">
            <h3>AI营养师</h3>
            <p>基于中医体质理论的智能健康顾问</p>
          </div>
        </div>
        <div class="header-right">
          <el-button text @click="clearChat" :disabled="messages.length === 0">
            <el-icon><Delete /></el-icon>
            清空对话
          </el-button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="messages-container" ref="messagesContainer">
        <div class="messages">
          <!-- 欢迎消息 -->
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="ai-avatar">
              <el-icon size="32"><UserFilled /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-text">
                您好！我是您的AI营养师助手。我可以帮助您：
                <ul>
                  <li>分析您的体质状况</li>
                  <li>提供个性化饮食建议</li>
                  <li>推荐适合的养生菜谱</li>
                  <li>解答健康饮食相关问题</li>
                </ul>
                请告诉我您的健康困扰或需求，我会为您提供专业的建议。
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div 
            v-for="message in messages" 
            :key="message.id"
            :class="['message', message.role]"
          >
            <div class="avatar">
              <el-icon v-if="message.role === 'user'" size="32"><User /></el-icon>
              <el-icon v-else size="32"><UserFilled /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <!-- 当前AI回复 -->
          <div v-if="currentReply" class="message assistant">
            <div class="avatar">
              <el-icon size="32"><UserFilled /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-text">
                {{ currentReply }}
                <span class="typing-cursor" v-if="isTyping">|</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-container">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="请输入您的问题或需求..."
            :disabled="loading"
            @keydown.enter.prevent="sendMessage"
            resize="none"
          />
          <div class="input-actions">
            <el-button 
              type="primary" 
              @click="sendMessage"
              :loading="loading"
              :disabled="!inputMessage.trim()"
            >
              <el-icon><Promotion /></el-icon>
              发送
            </el-button>
          </div>
        </div>
        
        <!-- 快捷问题 -->
        <div class="quick-questions">
          <span class="quick-label">快捷提问：</span>
          <el-button 
            v-for="question in quickQuestions" 
            :key="question"
            size="small"
            text
            @click="askQuestion(question)"
            :disabled="loading"
          >
            {{ question }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useChatStore } from '../stores/chat'
import { ArrowLeft, Delete, User, UserFilled, Promotion } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()

// 消息相关
const messages = ref([])
const inputMessage = ref('')
const currentReply = ref('')
const isTyping = ref(false)
const loading = ref(false)
const messagesContainer = ref(null)

// 快捷问题
const quickQuestions = [
  '我最近总是感觉很疲劳',
  '手脚冰凉是什么体质',
  '有什么简单的养生食谱推荐',
  '如何改善失眠问题',
  '湿气重应该吃什么'
]

// 页面跳转
const goBack = () => {
  router.push('/')
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: message,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  try {
    loading.value = true
    currentReply.value = ''
    isTyping.value = true
    
    // 发送流式消息
    await chatStore.sendStream(message, messages.value.slice(0, -1), (chunk) => {
      currentReply.value += chunk
      scrollToBottom()
    })
    
    // 添加AI回复到消息列表
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: currentReply.value,
      timestamp: new Date()
    }
    messages.value.push(aiMessage)
    
  } catch (error) {
    console.error('Failed to send message:', error)
    
    // 添加错误消息
    const errorMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '抱歉，我暂时无法回复您的消息。请稍后再试。',
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
  } finally {
    loading.value = false
    currentReply.value = ''
    isTyping.value = false
    scrollToBottom()
  }
}

// 快捷提问
const askQuestion = (question) => {
  inputMessage.value = question
  sendMessage()
}

// 清空对话
const clearChat = () => {
  messages.value = []
  chatStore.clearMessages()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 格式化消息内容
const formatMessage = (content) => {
  // 简单的换行处理
  return content.replace(/\n/g, '<br>')
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

onMounted(async () => {
  // 确保用户会话已初始化
  if (!userStore.sessionId) {
    await userStore.initSession()
  }
  
  // 滚动到底部
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  background: white;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

/* 聊天头部 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-info h3 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.ai-info p {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 欢迎消息 */
.welcome-message {
  display: flex;
  gap: 12px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ai-avatar {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 消息样式 */
.message {
  display: flex;
  gap: 12px;
  max-width: 100%;
}

.message.user {
  flex-direction: row-reverse;
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.message.assistant .message-content {
  background: white;
  color: #2c3e50;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e8e8e8;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user .avatar {
  background: #667eea;
  color: white;
}

.message.assistant .avatar {
  background: #f0f0f0;
  color: #667eea;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.message-text ul {
  margin: 8px 0;
  padding-left: 20px;
}

.message-text li {
  margin: 4px 0;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
}

.typing-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 输入区域 */
.input-area {
  border-top: 1px solid #e8e8e8;
  background: white;
  padding: 16px 20px;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-container .el-textarea {
  flex: 1;
}

.input-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 快捷问题 */
.quick-questions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.quick-label {
  font-size: 14px;
  color: #6c757d;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    max-width: 100%;
  }
  
  .chat-header {
    padding: 12px 16px;
  }
  
  .messages-container {
    padding: 16px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .input-area {
    padding: 12px 16px;
  }
  
  .quick-questions {
    margin-top: 8px;
  }
  
  .quick-label {
    display: none;
  }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
