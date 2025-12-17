<template>
  <div class="constitution-question">
    <!-- 问题头部 -->
    <div class="question-header">
      <div class="question-progress">
        <span class="progress-text">{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
      </div>
      <h2 class="question-title">{{ question.question }}</h2>
    </div>

    <!-- 选项列表 -->
    <div class="options-container">
      <div
        v-for="(option, index) in question.options"
        :key="index"
        class="option-item"
        :class="{
          selected: selectedOption === index,
          disabled: disabled
        }"
        @click="selectOption(index)"
      >
        <div class="option-radio">
          <div class="radio-circle" :class="{ checked: selectedOption === index }"></div>
        </div>
        <div class="option-content">
          <div class="option-text">{{ option.text }}</div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="question-actions">
      <button
        v-if="currentQuestionIndex > 0"
        class="btn btn-ghost"
        @click="previousQuestion"
        :disabled="disabled"
      >
        上一题
      </button>

      <button
        class="btn btn-primary"
        @click="nextQuestion"
        :disabled="disabled || selectedOption === null"
      >
        {{ isLastQuestion ? '完成测评' : '下一题' }}
      </button>
    </div>

    <!-- 快速跳转 -->
    <div class="quick-navigation" v-if="showQuickNav">
      <div class="nav-title">快速跳转</div>
      <div class="nav-dots">
        <button
          v-for="(q, index) in questions"
          :key="index"
          class="nav-dot"
          :class="{
            current: index === currentQuestionIndex,
            answered: answers[index] !== undefined,
            skipped: answers[index] === undefined && index < currentQuestionIndex
          }"
          @click="jumpToQuestion(index)"
          :disabled="disabled"
        >
          {{ index + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  currentQuestionIndex: {
    type: Number,
    required: true
  },
  answers: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showQuickNav: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['answer', 'next', 'previous', 'jump'])

const selectedOption = ref(null)

// 计算属性
const totalQuestions = computed(() => props.questions.length)
const progressPercentage = computed(() => {
  return ((props.currentQuestionIndex + 1) / totalQuestions.value) * 100
})
const isLastQuestion = computed(() => props.currentQuestionIndex === totalQuestions.value - 1)

// 监听问题变化，重置选择
watch(
  () => props.currentQuestionIndex,
  () => {
    const currentAnswer = props.answers[props.currentQuestionIndex]
    selectedOption.value =
      currentAnswer && currentAnswer.optionIndex !== undefined ? currentAnswer.optionIndex : null
  },
  { immediate: true }
)

// 选择选项
const selectOption = optionIndex => {
  if (props.disabled) return

  selectedOption.value = optionIndex
  const answer = {
    questionId: props.question.id,
    optionIndex
  }
  emit('answer', answer)
}

// 下一题
const nextQuestion = () => {
  if (props.disabled || selectedOption.value === null) return
  emit('next')
}

// 上一题
const previousQuestion = () => {
  if (props.disabled) return
  emit('previous')
}

// 跳转到指定题目
const jumpToQuestion = index => {
  if (props.disabled) return
  emit('jump', index)
}
</script>

<style scoped>
.constitution-question {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* 问题头部 */
.question-header {
  margin-bottom: var(--spacing-xl);
}

.question-progress {
  margin-bottom: var(--spacing-lg);
}

.progress-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
  display: block;
  margin-bottom: var(--spacing-sm);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base) var(--ease-out);
}

.question-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
}

.option-item:hover:not(.disabled) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-medium);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.option-item.selected {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.option-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.option-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px; /* 对齐文本 */
  flex-shrink: 0;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-full);
  position: relative;
  transition: all var(--transition-base) var(--ease-out);
}

.radio-circle.checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.radio-circle.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--color-text-inverse);
  border-radius: var(--radius-full);
}

.option-content {
  flex: 1;
}

.option-text {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
}

/* 操作按钮 */
.question-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.question-actions .btn {
  min-width: 120px;
}

/* 快速导航 */
.quick-navigation {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.nav-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.nav-dots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.nav-dot {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border-light);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-dot:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-medium);
}

.nav-dot.current {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
  font-weight: var(--font-bold);
}

.nav-dot.answered {
  background: var(--color-accent-alpha);
  border-color: var(--color-accent);
  color: var(--color-accent-dark);
}

.nav-dot.skipped {
  background: var(--color-error-alpha);
  border-color: var(--color-error);
  color: var(--color-error-dark);
}

.nav-dot:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 768px) {
  .constitution-question {
    padding: var(--spacing-lg);
  }

  .question-title {
    font-size: var(--text-lg);
  }

  .option-item {
    padding: var(--spacing-md);
  }

  .option-text {
    font-size: var(--text-sm);
  }

  .question-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .question-actions .btn {
    width: 100%;
    min-width: auto;
  }

  .nav-dots {
    gap: var(--spacing-xs);
  }

  .nav-dot {
    width: 36px;
    height: 36px;
    font-size: var(--text-xs);
  }
}

/* 动画 */
.option-item {
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
</style>
