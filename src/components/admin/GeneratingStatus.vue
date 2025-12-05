<template>
  <div class="generating-status">
    <div class="status-content">
      <!-- 加载中状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-animation">
          <div class="ai-icon">🤖</div>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h3>AI正在生成菜谱...</h3>
        <p class="status-text">请稍候，这可能需要几秒钟时间</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <h3>生成失败</h3>
        <p class="error-message">{{ error }}</p>
        <div class="error-actions">
          <button @click="handleRetry" class="btn-retry">
            重试
          </button>
          <button @click="handleCancel" class="btn-cancel">
            取消
          </button>
        </div>
      </div>

      <!-- 完成状态（短暂显示） -->
      <div v-else class="success-state">
        <div class="success-icon">✅</div>
        <h3>生成完成</h3>
        <p class="status-text">正在跳转到预览页面...</p>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tips">
      <h4>💡 小贴士</h4>
      <ul>
        <li>AI会根据中医理论生成专业菜谱</li>
        <li>包含完整的食材清单和制作步骤</li>
        <li>生成后您可以编辑和完善内容</li>
        <li>如不满意可以重新生成</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, toRefs } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['retry', 'cancel']);

// 进度条宽度
const progressWidth = ref(0);

// 进度更新定时器
let progressTimer = null;

// 开始进度动画
const startProgress = () => {
  progressWidth.value = 0;
  let progress = 0;
  
  progressTimer = setInterval(() => {
    progress += Math.random() * 15 + 5; // 随机增长5-20%
    
    if (progress >= 90) {
      progress = 90; // 最多到90%，等待实际完成
      clearInterval(progressTimer);
    }
    
    progressWidth.value = progress;
  }, 500);
};

// 重试
const handleRetry = () => {
  progressWidth.value = 0;
  emit('retry');
};

// 取消
const handleCancel = () => {
  if (progressTimer) {
    clearInterval(progressTimer);
  }
  emit('cancel');
};

// 监听loading状态变化
const { loading } = toRefs(props);

watch(() => props.loading, (newLoading) => {
  if (newLoading) {
    startProgress();
  } else {
    if (progressTimer) {
      clearInterval(progressTimer);
    }
    if (!props.error) {
      // 成功完成，快速填充到100%
      progressWidth.value = 100;
      setTimeout(() => {
        progressWidth.value = 0;
      }, 500);
    }
  }
});

// 组件挂载时开始进度动画
onMounted(() => {
  if (props.loading) {
    startProgress();
  }
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (progressTimer) {
    clearInterval(progressTimer);
  }
});
</script>

<style scoped>
.generating-status {
  padding: 32px;
  max-width: 500px;
  text-align: center;
}

.status-content {
  margin-bottom: 32px;
}

.loading-state,
.error-state,
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-animation {
  position: relative;
  margin-bottom: 24px;
}

.ai-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce 2s infinite;
}

.loading-dots {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.error-icon,
.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-icon {
  color: #ff6b6b;
}

.success-icon {
  color: #51cf66;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: var(--color-text);
}

.status-text {
  margin: 0 0 24px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.error-message {
  margin: 0 0 24px 0;
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.error-actions {
  display: flex;
  gap: 12px;
}

.btn-retry,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry {
  background: var(--color-primary);
  color: white;
}

.btn-retry:hover {
  opacity: 0.9;
}

.btn-cancel {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-cancel:hover {
  background: var(--color-border);
}

.tips {
  background: var(--color-bg);
  border-radius: 8px;
  padding: 20px;
  text-align: left;
}

.tips h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--color-text);
}

.tips ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.tips li {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* 动画 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
