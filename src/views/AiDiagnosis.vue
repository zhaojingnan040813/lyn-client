<template>
  <div class="ai-diagnosis-page">
    <div class="chat-container">
      <!-- 侧边栏 - 用户信息 -->
      <aside class="sidebar">
        <div class="user-card card">
          <div class="user-avatar">
            {{ userStore.username.charAt(0) }}
          </div>
          <h3 class="user-name">{{ userStore.username }}</h3>
          <span class="user-type-badge" :class="userStore.isLoggedIn ? 'registered' : 'guest'">
            {{ userStore.isLoggedIn ? '注册用户' : '游客' }}
          </span>

          <div class="divider"></div>

          <div class="constitution-info" v-if="userStore.hasConstitution">
            <h4 class="info-title">体质信息</h4>
            <div class="constitution-badge">
              {{ getConstitutionName(userStore.constitution.type) }}
            </div>
            <p class="info-date">诊断于 {{ formatDate(userStore.constitution.diagnosedAt) }}</p>
          </div>
          <div class="constitution-info" v-else>
            <p class="text-secondary text-sm">尚未进行体质测评</p>
            <router-link to="/constitution-diagnosis" class="btn btn-primary btn-sm">
              去测评
            </router-link>
          </div>
        </div>

        <div class="tips-card card">
          <h4 class="tips-title">💡 使用提示</h4>
          <ul class="tips-list">
            <li>详细描述您的症状和感受</li>
            <li>提供生活习惯和饮食信息</li>
            <li>如实回答 AI 的问题</li>
            <li>建议结合专业医生诊断</li>
          </ul>
        </div>
      </aside>

      <!-- 主聊天区域 -->
      <main class="chat-main">
        <div class="chat-header">
          <h2 class="chat-title">AI 智能问诊</h2>
          <p class="chat-subtitle">基于中医体质理论的智能健康咨询</p>
        </div>

        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
          <div class="messages-list">
            <!-- 欢迎消息 -->
            <div class="message assistant" v-if="messages.length === 0">
              <div class="message-avatar">AI</div>
              <div class="message-content">
                <div class="message-bubble">
                  <p>您好！我是您的中医养生助手。</p>
                  <p>请告诉我您的身体状况，我会根据中医体质理论为您提供专业的健康建议。</p>
                </div>
              </div>
            </div>

            <!-- 对话消息 -->
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="message"
              :class="message.role"
            >
              <div class="message-avatar">
                {{ message.role === 'user' ? userStore.username.charAt(0) : 'AI' }}
              </div>
              <div class="message-content">
                <div class="message-bubble">
                  <p v-html="formatMessage(message.content)"></p>
                  <span v-if="message.isStreaming" class="typing-cursor">|</span>
                </div>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
            </div>

            <!-- AI 思考中（仅在等待连接时显示） -->
            <div class="message assistant" v-if="isThinking && !hasStreamingMessage">
              <div class="message-avatar">AI</div>
              <div class="message-content">
                <div class="message-bubble thinking">
                  <div class="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-container">
          <form class="input-form" @submit.prevent="handleSend">
            <textarea
              v-model="inputMessage"
              class="input-textarea"
              placeholder="描述您的症状或健康问题..."
              rows="3"
              :disabled="isThinking"
              @keydown.enter.exact.prevent="handleSend"
            ></textarea>
            <div class="input-actions">
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                @click="handleClear"
                :disabled="messages.length === 0"
              >
                清空对话
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!inputMessage.trim() || isThinking"
              >
                {{ isThinking ? '思考中...' : '发送' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { useToast } from '@/utils/toast'

const userStore = useUserStore()
const chatStore = useChatStore()
const toast = useToast()

const messages = ref([])
const inputMessage = ref('')
const isThinking = ref(false)
const messagesContainer = ref(null)

// 检查是否有正在流式输出的消息
const hasStreamingMessage = computed(() => {
  return messages.value.some(msg => msg.isStreaming)
})

// 体质类型映射
const constitutionMap = {
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

const getConstitutionName = type => {
  return constitutionMap[type] || type
}

const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatTime = timestamp => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const formatMessage = content => {
  // 简单的 markdown 格式化
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

const scrollToBottom = (smooth = false) => {
  nextTick(() => {
    if (messagesContainer.value) {
      if (smooth) {
        messagesContainer.value.scrollTo({
          top: messagesContainer.value.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }
  })
}

const handleSend = async () => {
  const message = inputMessage.value.trim()
  if (!message || isThinking.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: Date.now()
  })

  inputMessage.value = ''
  scrollToBottom()

  // 添加一个空的 AI 消息占位
  const aiMessageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
    isStreaming: true
  })

  // 发送到 AI（流式）
  isThinking.value = true

  try {
    const history = messages.value
      .slice(0, -1) // 排除刚添加的空消息
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    await chatStore.sendStreamMessage(message, history, {
      onMessage: chunk => {
        // 追加内容到 AI 消息
        messages.value[aiMessageIndex].content += chunk
        // 流式输出时使用平滑滚动
        scrollToBottom(true)
      },
      onError: error => {
        console.error('流式消息错误:', error)
        messages.value[aiMessageIndex].content = '抱歉，AI 服务暂时不可用，请稍后再试。'
        messages.value[aiMessageIndex].isStreaming = false
        toast.error(error.message || 'AI 回复失败')
      },
      onComplete: () => {
        messages.value[aiMessageIndex].isStreaming = false
        scrollToBottom()
      }
    })
  } catch (error) {
    console.error('AI 回复错误:', error)
    toast.error(error.message || 'AI 回复失败，请重试')
    // 移除用户消息和 AI 占位消息
    messages.value.splice(aiMessageIndex - 1, 2)
  } finally {
    isThinking.value = false
  }
}

const handleClear = () => {
  if (confirm('确定要清空对话记录吗？')) {
    messages.value = []
    toast.info('对话已清空')
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.ai-diagnosis-page {
  min-height: calc(100vh - var(--header-height));
  background: var(--color-bg-secondary);
}

.chat-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: calc(100vh - var(--header-height));
  max-width: 1600px;
  margin: 0 auto;
}

/* 侧边栏 */
.sidebar {
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border-light);
  padding: var(--spacing-xl);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.user-card {
  text-align: center;
  padding: var(--spacing-xl);
}

.user-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-md);
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
}

.user-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-sm);
}

.user-type-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--text-sm);
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.user-type-badge.registered {
  background: var(--color-primary-alpha);
  color: var(--color-primary-dark);
}

.user-type-badge.guest {
  background: var(--color-bg-tertiary);
}

.constitution-info {
  text-align: center;
}

.info-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.constitution-badge {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-accent-alpha);
  color: var(--color-accent-dark);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-xs);
}

.info-date {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.tips-card {
  padding: var(--spacing-lg);
}

.tips-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-md);
}

.tips-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.tips-list li {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding-left: var(--spacing-md);
  position: relative;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

/* 主聊天区域 */
.chat-main {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-elevated);
  height: 100%;
  overflow: hidden;
}

.chat-header {
  flex-shrink: 0;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
}

.chat-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-xs);
}

.chat-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* 消息列表 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--spacing-xl);
  min-height: 0; /* 重要：允许 flex 子元素缩小 */
  scroll-behavior: smooth;
}

/* 自定义滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(--color-border-dark);
  border-radius: var(--radius-full);
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin: 0 auto;
}

.message {
  display: flex;
  gap: var(--spacing-md);
  animation: fadeInUp var(--transition-base);
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.message.assistant .message-avatar {
  background: var(--gradient-accent);
  color: var(--color-text-inverse);
}

.message.user .message-avatar {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.message.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  max-width: 80%;
  word-wrap: break-word;
}

.message.assistant .message-bubble {
  background: var(--color-bg-secondary);
  border-bottom-left-radius: var(--radius-sm);
}

.message.user .message-bubble {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-bottom-right-radius: var(--radius-sm);
}

.message-bubble.thinking {
  padding: var(--spacing-lg);
}

.thinking-dots {
  display: flex;
  gap: var(--spacing-xs);
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
  animation: thinking 1.4s infinite;
}

.thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinking {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.message-time {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  padding: 0 var(--spacing-sm);
}

.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 1s infinite;
  font-weight: var(--font-bold);
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

/* 输入区域 */
.input-container {
  flex-shrink: 0;
  border-top: 1px solid var(--color-border-light);
  padding: var(--spacing-lg);
  background: var(--color-bg-primary);
}

.input-form {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-textarea {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-lg);
  resize: vertical;
  min-height: 80px;
  max-height: 200px;
  transition: all var(--transition-base);
}

.input-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.input-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 响应式 */
@media (max-width: 1024px) {
  .chat-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .messages-container {
    padding: var(--spacing-md);
  }

  .message-bubble {
    max-width: 90%;
  }

  .input-container {
    padding: var(--spacing-md);
  }
}
</style>
