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
            </div>
          </template>

          <div class="chat-messages">
            <div class="message ai-message">
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

            <div class="message user-message">
              <el-avatar :size="32">我</el-avatar>
              <div class="message-content">
                <p>最近总是感觉很疲劳，睡眠质量也不太好...</p>
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
            />
            <div class="input-actions">
              <el-button type="primary">发送</el-button>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChatDotRound, User, Document } from '@element-plus/icons-vue'

const messageInput = ref('')
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
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.message {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: flex-start;
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
}

.ai-message .message-content {
  background-color: #e3f2fd;
}

.chat-input {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
