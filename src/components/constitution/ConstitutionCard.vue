<template>
  <div
    class="constitution-card"
    :class="{
      selected: isSelected,
      recommended: isRecommended,
      disabled: disabled
    }"
    @click="handleSelect"
  >
    <!-- 体质图标和标题 -->
    <div class="card-header">
      <div class="constitution-icon">
        {{ constitution.name.charAt(0) }}
      </div>
      <h3 class="constitution-name">{{ constitution.name }}</h3>
      <div class="constitution-type" v-if="showType">
        {{ constitution.type }}
      </div>
    </div>

    <!-- 推荐标签 -->
    <div class="recommendation-badge" v-if="isRecommended">
      <span class="badge-icon">✨</span>
      <span class="badge-text">推荐</span>
    </div>

    <!-- 体质描述 -->
    <div class="card-content">
      <p class="constitution-description">{{ constitution.description }}</p>

      <!-- 主要特征 -->
      <div class="characteristics" v-if="!compact">
        <h4 class="section-title">主要特征</h4>
        <ul class="characteristics-list">
          <li v-for="(characteristic, index) in displayCharacteristics" :key="index">
            {{ characteristic }}
          </li>
        </ul>
      </div>

      <!-- 饮食建议 -->
      <div class="diet-advice" v-if="!compact && showDietAdvice">
        <h4 class="section-title">饮食建议</h4>
        <ul class="advice-list">
          <li v-for="(advice, index) in displayDietAdvice" :key="index">
            {{ advice }}
          </li>
        </ul>
      </div>

      <!-- 避免食物 -->
      <div class="avoid-foods" v-if="!compact && constitution.avoidFoods.length > 0">
        <h4 class="section-title">避免食物</h4>
        <div class="avoid-tags">
          <span v-for="(food, index) in displayAvoidFoods" :key="index" class="avoid-tag">
            {{ food }}
          </span>
        </div>
      </div>
    </div>

    <!-- 匹配度（如果有） -->
    <div class="match-score" v-if="score !== undefined">
      <div class="score-label">匹配度</div>
      <div class="score-bar">
        <div class="score-fill" :style="{ width: `${score}%` }"></div>
      </div>
      <div class="score-text">{{ score }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  constitution: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  },
  showType: {
    type: Boolean,
    default: false
  },
  showDietAdvice: {
    type: Boolean,
    default: true
  },
  score: {
    type: Number,
    default: undefined
  },
  maxCharacteristics: {
    type: Number,
    default: 3
  },
  maxDietAdvice: {
    type: Number,
    default: 2
  },
  maxAvoidFoods: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['select'])

const handleSelect = () => {
  if (!props.disabled) {
    emit('select', props.constitution)
  }
}

// 限制显示的特征数量
const displayCharacteristics = computed(() => {
  return props.constitution.characteristics?.slice(0, props.maxCharacteristics) || []
})

// 限制显示的饮食建议数量
const displayDietAdvice = computed(() => {
  return props.constitution.dietAdvice?.slice(0, props.maxDietAdvice) || []
})

// 限制显示的避免食物数量
const displayAvoidFoods = computed(() => {
  return props.constitution.avoidFoods?.slice(0, props.maxAvoidFoods) || []
})
</script>

<style scoped>
.constitution-card {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.constitution-card:hover:not(.disabled) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.constitution-card.selected {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-xl);
}

.constitution-card.recommended {
  border-color: var(--color-accent);
  background: linear-gradient(135deg, var(--color-accent-alpha) 0%, var(--color-bg-secondary) 100%);
}

.constitution-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.constitution-icon {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.constitution-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.constitution-type {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  margin-left: auto;
}

/* 推荐标签 */
.recommendation-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: var(--gradient-accent);
  color: var(--color-text-inverse);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-md);
}

.badge-icon {
  font-size: var(--text-sm);
}

.badge-text {
  font-weight: var(--font-semibold);
}

/* 卡片内容 */
.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.constitution-description {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.characteristics-list,
.advice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.characteristics-list li,
.advice-list li {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  position: relative;
  padding-left: var(--spacing-lg);
  line-height: var(--leading-relaxed);
}

.characteristics-list li::before,
.advice-list li::before {
  content: '•';
  position: absolute;
  left: var(--spacing-sm);
  color: var(--color-primary);
  font-weight: var(--font-bold);
}

/* 避免食物标签 */
.avoid-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.avoid-tag {
  background: var(--color-error-alpha);
  color: var(--color-error-dark);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 匹配度 */
.match-score {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.score-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
  min-width: 48px;
}

.score-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.score-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base) var(--ease-out);
}

.score-text {
  font-size: var(--text-xs);
  color: var(--color-primary);
  font-weight: var(--font-semibold);
  min-width: 32px;
  text-align: right;
}

/* 紧凑模式 */
.constitution-card.compact {
  padding: var(--spacing-md);
}

.constitution-card.compact .constitution-icon {
  width: 40px;
  height: 40px;
  font-size: var(--text-lg);
}

.constitution-card.compact .constitution-name {
  font-size: var(--text-base);
}

.constitution-card.compact .constitution-description {
  font-size: var(--text-xs);
  margin-bottom: var(--spacing-sm);
}

.constitution-card.compact .section-title {
  font-size: var(--text-xs);
  margin-bottom: var(--spacing-xs);
}

.constitution-card.compact .characteristics-list li,
.constitution-card.compact .advice-list li {
  font-size: var(--text-xs);
}

.constitution-card.compact .match-score {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
}

/* 响应式 */
@media (max-width: 768px) {
  .constitution-card {
    padding: var(--spacing-md);
  }

  .constitution-icon {
    width: 40px;
    height: 40px;
    font-size: var(--text-lg);
  }

  .constitution-name {
    font-size: var(--text-base);
  }

  .section-title {
    font-size: var(--text-xs);
  }

  .characteristics-list li,
  .advice-list li {
    font-size: var(--text-xs);
  }
}
</style>
