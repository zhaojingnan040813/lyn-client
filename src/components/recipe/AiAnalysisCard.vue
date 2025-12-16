<template>
  <div class="ai-analysis-card" v-if="analysis">
    <div class="analysis-header">
      <div class="analysis-icon">
        <span class="ai-brain">🧠</span>
      </div>
      <div class="analysis-title">
        <h3>AI 深度分析</h3>
        <p>基于您的体质特征和偏好进行智能推荐</p>
      </div>
    </div>

    <div class="analysis-content">
      <!-- 用户画像 -->
      <div class="analysis-section">
        <div class="section-header">
          <span class="section-icon">👤</span>
          <h4>用户画像分析</h4>
        </div>
        <div class="section-content">
          <p class="analysis-text">{{ analysis.userProfile }}</p>
        </div>
      </div>

      <!-- 推荐策略 -->
      <div class="analysis-section">
        <div class="section-header">
          <span class="section-icon">🎯</span>
          <h4>推荐策略</h4>
        </div>
        <div class="section-content">
          <p class="analysis-text">{{ analysis.recommendStrategy }}</p>
          <div class="strategy-tags" v-if="strategyTags.length">
            <span v-for="tag in strategyTags" :key="tag" class="strategy-tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 营养均衡 -->
      <div class="analysis-section">
        <div class="section-header">
          <span class="section-icon">🥗</span>
          <h4>营养均衡分析</h4>
        </div>
        <div class="section-content">
          <p class="analysis-text">{{ analysis.nutritionBalance }}</p>
          <div class="nutrition-meters" v-if="nutritionData.length">
            <div v-for="item in nutritionData" :key="item.name" class="nutrition-meter">
              <div class="meter-info">
                <span class="meter-name">{{ item.name }}</span>
                <span class="meter-value">{{ item.value }}%</span>
              </div>
              <div class="meter-bar">
                <div
                  class="meter-fill"
                  :style="{ width: item.value + '%', backgroundColor: item.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐理由总结 -->
      <div class="analysis-summary" v-if="summary">
        <div class="summary-icon">✨</div>
        <div class="summary-content">
          <h4>推荐总结</h4>
          <p>{{ summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  analysis: {
    type: Object,
    default: null
  }
})

// 解析策略标签
const strategyTags = computed(() => {
  if (!props.analysis?.recommendStrategy) return []

  const strategies = [
    '体质调理',
    '营养均衡',
    '口味适配',
    '季节养生',
    '易消化',
    '低脂健康',
    '高蛋白',
    '富含纤维'
  ]

  return strategies.filter(strategy => props.analysis.recommendStrategy.includes(strategy))
})

// 营养数据（模拟，实际应从API获取）
const nutritionData = computed(() => {
  if (!props.analysis?.nutritionBalance) return []

  // 简单的营养分析，实际应该由API提供
  return [
    { name: '蛋白质', value: 75, color: '#4CAF50' },
    { name: '维生素', value: 85, color: '#2196F3' },
    { name: '膳食纤维', value: 70, color: '#FF9800' },
    { name: '矿物质', value: 80, color: '#9C27B0' }
  ]
})

// 推荐总结
const summary = computed(() => {
  if (!props.analysis?.recommendStrategy) return ''

  const strategy = props.analysis.recommendStrategy
  const highlights = []

  if (strategy.includes('清淡')) highlights.push('口感清淡')
  if (strategy.includes('营养')) highlights.push('营养均衡')
  if (strategy.includes('易消化')) highlights.push('易于消化')
  if (strategy.includes('季节')) highlights.push('应季养生')

  return highlights.length > 0
    ? `本次推荐注重${highlights.join('、')}，符合您的体质特点和健康需求。`
    : '本次推荐基于您的个人偏好和体质特征量身定制。'
})
</script>

<style scoped>
.ai-analysis-card {
  background: linear-gradient(135deg, var(--color-bg-elevated), #f8f9fa);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-light);
  position: relative;
  overflow: hidden;
}

.ai-analysis-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-primary));
}

/* 分析头部 */
.analysis-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.analysis-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.ai-brain {
  font-size: 1.5rem;
  filter: brightness(1.2);
}

.analysis-title h3 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.analysis-title p {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin: 0;
}

/* 分析内容 */
.analysis-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.analysis-section {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.analysis-section:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.section-icon {
  font-size: var(--text-lg);
  width: 32px;
  height: 32px;
  background: var(--color-accent-alpha);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-header h4 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.section-content {
  margin-left: 40px;
}

.analysis-text {
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  font-size: var(--text-sm);
  margin: 0 0 var(--spacing-md) 0;
}

/* 策略标签 */
.strategy-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.strategy-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--gradient-accent);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 营养仪表盘 */
.nutrition-meters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.nutrition-meter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.meter-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xs);
}

.meter-name {
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.meter-value {
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.meter-bar {
  width: 100%;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

/* 分析总结 */
.analysis-summary {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-accent-alpha), rgba(90, 159, 143, 0.1));
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-accent-alpha);
}

.summary-icon {
  font-size: var(--text-xl);
  flex-shrink: 0;
}

.summary-content h4 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-accent);
  margin: 0 0 var(--spacing-xs) 0;
}

.summary-content p {
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  font-size: var(--text-sm);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-analysis-card {
    padding: var(--spacing-lg);
  }

  .analysis-header {
    gap: var(--spacing-md);
  }

  .analysis-icon {
    width: 40px;
    height: 40px;
  }

  .ai-brain {
    font-size: 1.2rem;
  }

  .section-content {
    margin-left: 0;
  }

  .strategy-tags {
    margin-top: var(--spacing-sm);
  }

  .analysis-summary {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .summary-icon {
    align-self: center;
  }
}

/* 加载动画 */
.ai-analysis-card {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
