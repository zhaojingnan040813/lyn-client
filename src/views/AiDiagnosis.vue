<template>
  <div class="ai-diagnosis h-screen flex flex-col p-0">
    <!-- 页面标题区域 -->
    <div
      class="bg-white/90 backdrop-blur-md border-b border-food-cream/50 shadow-warm p-6 flex-shrink-0"
    >
      <div class="max-w-6xl mx-auto text-center">
        <div class="inline-flex items-center gap-3 mb-2">
          <div
            class="w-12 h-12 bg-gradient-to-br from-food-orange to-food-red rounded-full flex items-center justify-center shadow-food"
          >
            <span class="text-2xl">🤖</span>
          </div>
          <h1 class="text-3xl font-bold text-food-brown font-title">AI健康问诊</h1>
        </div>
        <p class="text-food-brown/70 text-lg">智能分析您的体质，提供个性化健康建议</p>
      </div>
    </div>

    <!-- 聊天容器 -->
    <div class="flex-1 p-6 overflow-hidden">
      <el-card class="chat-container food-card h-full flex flex-col">
        <template #header>
          <div class="chat-header">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-food-green to-food-secondary rounded-full flex items-center justify-center"
              >
                <span class="text-xl">👨‍⚕️</span>
              </div>
              <div>
                <span class="ai-name font-semibold text-food-brown">智膳健康助手</span>
                <div class="flex items-center gap-2 mt-1">
                  <el-tag type="success" size="small" effect="light">
                    <span class="flex items-center gap-1">
                      <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      在线
                    </span>
                  </el-tag>
                </div>
              </div>
            </div>
            <el-button
              type="danger"
              size="small"
              @click="clearChat"
              class="ml-auto hover:bg-food-red hover:transform hover:scale-105 transition-all duration-200"
            >
              <span class="flex items-center gap-1">
                <span>🗑️</span>
                清空对话
              </span>
            </el-button>
          </div>
        </template>

        <div
          class="chat-messages bg-gradient-to-b from-food-cream/20 to-white rounded-lg p-4"
          ref="messagesContainer"
        >
          <!-- 如果没有消息，显示欢迎消息 -->
          <div v-if="!hasMessages" class="message ai-message mb-6">
            <div class="flex gap-3">
              <div
                class="w-8 h-8 bg-gradient-to-br from-food-green to-food-secondary rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span class="text-sm">👨‍⚕️</span>
              </div>
              <div
                class="message-content bg-white rounded-2xl rounded-tl-none p-4 shadow-warm max-w-lg"
              >
                <p class="text-food-brown leading-relaxed">
                  👋
                  您好！我是您的智膳健康助手。请告诉我您现在的身体状况或健康问题，我会结合传统中医理论和现代营养学，为您提供专业的健康建议和饮食调理方案。
                </p>
              </div>
            </div>
          </div>

          <!-- 显示所有消息 -->
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message mb-4', message.role === 'user' ? 'user-message' : 'ai-message']"
          >
            <div class="flex gap-3" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-food-orange to-food-red'
                    : 'bg-gradient-to-br from-food-green to-food-secondary'
                "
              >
                <span class="text-sm">{{ message.role === 'user' ? '👤' : '👨‍⚕️' }}</span>
              </div>
              <div
                class="message-content rounded-2xl p-4 shadow-warm max-w-lg"
                :class="
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-food-orange to-food-red text-white rounded-tr-none'
                    : 'bg-white rounded-tl-none'
                "
              >
                <div
                  class="message-text leading-relaxed"
                  :class="message.role === 'user' ? 'text-white' : 'text-food-brown'"
                  v-html="formatMessage(message.content)"
                ></div>
                <!-- 显示打字机光标效果 -->
                <span
                  v-if="
                    message.role === 'assistant' &&
                    loading &&
                    message === messages[messages.length - 1] &&
                    currentReply !== ''
                  "
                  class="typing-cursor text-food-orange animate-pulse ml-1"
                >
                  |
                </span>
              </div>
            </div>
          </div>

          <!-- 加载指示器 -->
          <div
            v-if="loading && (!hasMessages || messages[messages.length - 1]?.role !== 'assistant')"
            class="message ai-message mb-4"
          >
            <div class="flex gap-3">
              <div
                class="w-8 h-8 bg-gradient-to-br from-food-green to-food-secondary rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span class="text-sm">👨‍⚕️</span>
              </div>
              <div class="message-content bg-white rounded-2xl rounded-tl-none p-4 shadow-warm">
                <div class="typing-indicator flex gap-1">
                  <span class="w-2 h-2 bg-food-orange rounded-full animate-bounce"></span>
                  <span
                    class="w-2 h-2 bg-food-orange rounded-full animate-bounce"
                    style="animation-delay: 0.1s"
                  ></span>
                  <span
                    class="w-2 h-2 bg-food-orange rounded-full animate-bounce"
                    style="animation-delay: 0.2s"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input border-t border-food-cream/50 pt-4">
          <div class="relative">
            <el-input
              v-model="messageInput"
              type="textarea"
              :rows="3"
              placeholder="请描述您的症状或健康问题，我会为您提供专业建议... 🍵"
              resize="none"
              :disabled="loading"
              class="food-input"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="messageInput += '\n'"
            />
            <div class="input-actions flex justify-between items-center mt-3">
              <span class="input-hint text-sm text-food-brown/60">
                💡 按 Enter 发送，Shift + Enter 换行
              </span>
              <el-button
                type="primary"
                :disabled="loading || !messageInput.trim()"
                :loading="loading"
                @click="sendMessage"
                class="shadow-food hover:shadow-food-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <span>🚀</span>
                  发送
                </span>
                <span v-else>分析中...</span>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useChatStore } from '../stores/chat.js'
import { storeToRefs } from 'pinia'

const chatStore = useChatStore()
const { messages, loading, hasMessages, currentReply } = storeToRefs(chatStore)

const messageInput = ref('')
const messagesContainer = ref(null)

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim() || loading.value) return

  const content = messageInput.value.trim()
  messageInput.value = ''

  await chatStore.sendStream(content)
  scrollToBottom()
}

// 清空对话
const clearChat = () => {
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

// 格式化消息内容（支持换行等）
const formatMessage = content => {
  return content.replace(/\n/g, '<br>')
}

// 监听消息变化，自动滚动到底部
watch(
  messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

// 监听加载状态变化，在开始加载时滚动到底部
watch(loading, newVal => {
  if (newVal) {
    scrollToBottom()
  }
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  min-height: 0; /* 重要：确保flex子元素可以收缩 */
}

.message-content {
  word-wrap: break-word;
  word-break: break-word;
}

.typing-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* 覆盖Element Plus卡片样式 */
:deep(.el-card) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.el-card__header) {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 249, 196, 0.2));
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  flex-shrink: 0;
}

:deep(.el-card__body) {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.el-textarea__inner) {
  border-radius: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner):focus {
  border-color: var(--food-primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

:deep(.el-textarea__inner):hover {
  border-color: var(--food-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-diagnosis {
    padding: 1rem;
  }

  .chat-messages {
    max-height: 400px;
  }

  .message-content {
    max-width: 85%;
  }
}

/* 消息动画 */
.message {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 聊天头部样式 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: transparent;
}

.ai-name {
  font-size: 1.1rem;
  font-weight: 600;
}

/* 输入区域样式 */
.chat-input {
  background: linear-gradient(135deg, rgba(255, 249, 196, 0.3), rgba(255, 236, 179, 0.2));
  border-radius: 0 0 12px 12px;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.input-hint {
  font-size: 0.875rem;
  color: var(--food-brown);
  opacity: 0.7;
}

/* 滚动条美化 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 249, 196, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--food-orange), var(--food-red));
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--food-red), var(--food-orange));
}
</style>
