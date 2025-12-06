<template>
  <div class="ai-diagnosis">
    <el-container>
      <el-main class="custom-main">
        <el-card class="chat-container">
          <template #header>
            <div class="chat-header">
              <el-avatar
                :size="40"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="ai-name">智能健康助手</span>
              <el-tag type="success" size="small">在线</el-tag>
              <el-button type="text" size="small" @click="clearChat" style="margin-left: auto">
                清空对话
              </el-button>
            </div>
          </template>

          <div class="chat-messages" ref="messagesContainer">
            <!-- 如果没有消息，显示欢迎消息 -->
            <div v-if="!hasMessages" class="message ai-message">
              <el-avatar
                :size="32"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <div class="message-content">
                <p>
                  您好！我是您的智能健康助手。请告诉我您现在有哪些身体不适，我会根据您的描述为您提供专业的健康建议。
                </p>
              </div>
            </div>

            <!-- 显示所有消息 -->
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']"
            >
              <el-avatar
                :size="32"
                :src="
                  message.role === 'assistant'
                    ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
                    : ''
                "
              >
                {{ message.role === 'user' ? '我' : '' }}
              </el-avatar>
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <!-- 显示打字机光标效果 -->
                <span
                  v-if="
                    message.role === 'assistant' &&
                    loading &&
                    message === messages[messages.length - 1] &&
                    currentReply !== ''
                  "
                  class="typing-cursor"
                >
                  |
                </span>
              </div>
            </div>

            <!-- 加载指示器 - 只在没有AI消息正在生成时显示 -->
            <div
              v-if="
                loading && (!hasMessages || messages[messages.length - 1]?.role !== 'assistant')
              "
              class="message ai-message"
            >
              <el-avatar
                :size="32"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <el-input
              v-model="messageInput"
              type="textarea"
              :rows="3"
              placeholder="请描述您的症状或健康问题..."
              resize="none"
              :disabled="loading"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="messageInput += '\n'"
            />
            <div class="input-actions">
              <span class="input-hint">按 Enter 发送，Shift + Enter 换行</span>
              <el-button
                type="primary"
                :disabled="loading || !messageInput.trim()"
                :loading="loading"
                @click="sendMessage"
              >
                发送
              </el-button>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
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
  margin: 0 auto;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.ai-name {
  font-weight: bold;
  color: #333;
}

.chat-messages {
  height: 500px;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
  scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.message {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: flex-start;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.ai-message .message-content {
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.typing-cursor {
  color: #1976d2;
  font-weight: bold;
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

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #1976d2;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.input-hint {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    margin: 0 10px;
  }

  .message-content {
    max-width: 85%;
  }

  .chat-messages {
    height: 400px;
    padding: 15px;
  }
}
</style>
