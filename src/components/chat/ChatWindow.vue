<template>
    <div class="chat-window">
        <!-- 聊天头部 -->
        <div class="chat-header">
            <div class="chat-title">
                <span class="ai-avatar">🤖</span>
                <span>AI 健康顾问</span>
            </div>
            <button class="clear-btn" @click="handleClear" v-if="chatStore.hasMessages">
                清空记录
            </button>
        </div>

        <!-- 消息列表 -->
        <div class="chat-messages" ref="messagesContainer">
            <!-- 欢迎消息 -->
            <div v-if="!chatStore.hasMessages" class="welcome-message">
                <div class="welcome-icon">🏥</div>
                <h3>您好，我是您的 AI 健康顾问</h3>
                <p>我可以帮您：</p>
                <ul>
                    <li>🔍 分析您的体质类型</li>
                    <li>💡 提供养生保健建议</li>
                    <li>🍲 推荐适合的食材和菜谱</li>
                </ul>
                <p class="hint">请描述您的症状或健康问题，我来为您分析~</p>
            </div>

            <!-- 消息列表 -->
            <div
                v-for="message in chatStore.messages"
                :key="message.id"
                :class="['message', message.role]"
            >
                <div class="message-avatar">
                    {{ message.role === 'user' ? '👤' : '🤖' }}
                </div>
                <div class="message-content">
                    <div class="message-text" v-html="formatMessage(message.content)"></div>
                    <div class="message-time">
                        {{ formatTime(message.timestamp) }}
                    </div>
                </div>
            </div>

            <!-- 加载指示器 -->
            <div v-if="chatStore.loading && !chatStore.currentReply" class="message assistant">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
            <textarea
                v-model="inputText"
                @keydown.enter.exact.prevent="handleSend"
                placeholder="请输入您的问题..."
                :disabled="chatStore.loading"
                rows="1"
            ></textarea>
            <button
                class="send-btn"
                @click="handleSend"
                :disabled="!inputText.trim() || chatStore.loading"
            >
                {{ chatStore.loading ? '发送中...' : '发送' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useChatStore } from '@/stores/chat.js';

const chatStore = useChatStore();
const inputText = ref('');
const messagesContainer = ref(null);

// 发送消息
const handleSend = () => {
    if (!inputText.value.trim() || chatStore.loading) return;

    const message = inputText.value;
    inputText.value = '';

    // 使用流式模式发送
    chatStore.sendStream(message);
};

// 清空聊天记录
const handleClear = () => {
    if (confirm('确定要清空所有聊天记录吗？')) {
        chatStore.clearMessages();
    }
};

// 格式化消息（支持简单的 Markdown）
const formatMessage = (content) => {
    if (!content) return '';
    return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 自动滚动到底部
watch(
    () => chatStore.messages.length,
    () => {
        nextTick(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            }
        });
    }
);

// 监听流式消息更新，自动滚动
watch(
    () => chatStore.currentReply,
    () => {
        nextTick(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            }
        });
    }
);
</script>

<style scoped>
.chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.chat-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
}

.ai-avatar {
    font-size: 24px;
}

.clear-btn {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
}

.clear-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f8f9fa;
}

.welcome-message {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.welcome-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.welcome-message h3 {
    margin-bottom: 12px;
    color: #333;
}

.welcome-message ul {
    list-style: none;
    padding: 0;
    margin: 16px 0;
}

.welcome-message li {
    padding: 8px 0;
}

.welcome-message .hint {
    margin-top: 20px;
    color: #999;
    font-size: 14px;
}

.message {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    animation: fadeIn 0.3s ease;
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

.message.user {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.message.user .message-avatar {
    background: #667eea;
}

.message-content {
    max-width: 70%;
}

.message-text {
    padding: 12px 16px;
    border-radius: 12px;
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    line-height: 1.6;
    word-break: break-word;
}

.message.user .message-text {
    background: #667eea;
    color: white;
}

.message-time {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
    text-align: right;
}

.message.user .message-time {
    text-align: left;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    background: white;
    border-radius: 12px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-10px);
    }
}

.chat-input {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    background: white;
    border-top: 1px solid #e9ecef;
}

.chat-input textarea {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    resize: none;
    font-size: 14px;
    line-height: 1.5;
    transition: border-color 0.2s;
    font-family: inherit;
}

.chat-input textarea:focus {
    outline: none;
    border-color: #667eea;
}

.chat-input textarea:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
}

.send-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
}

.send-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
}

.send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
