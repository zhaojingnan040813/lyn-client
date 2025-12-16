<template>
  <div class="question-card">
    <div class="question-header">
      <span class="question-category">{{ question.category }}</span>
      <h2 class="question-title">{{ question.text }}</h2>
    </div>

    <div class="options-container">
      <QuestionOption
        v-for="(option, index) in question.options"
        :key="index"
        :option="option"
        :model-value="selectedOption === index"
        @update:model-value="selectOption(index)"
      />
    </div>

    <div class="question-actions">
      <button class="btn btn-secondary" @click="$emit('previous')" :disabled="isFirstQuestion">
        上一题
      </button>
      <button class="btn btn-primary" @click="$emit('next')" :disabled="selectedOption === null">
        {{ isLastQuestion ? '查看结果' : '下一题' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import QuestionOption from './QuestionOption.vue'

defineProps({
  question: {
    type: Object,
    required: true
  },
  selectedOption: {
    type: Number,
    default: null
  },
  isFirstQuestion: {
    type: Boolean,
    default: false
  },
  isLastQuestion: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:selectedOption', 'previous', 'next'])

const selectOption = index => {
  emit('update:selectedOption', index)
}
</script>

<style scoped>
.question-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
  animation: slideInUp 0.5s var(--ease-out);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-header {
  margin-bottom: var(--spacing-xl);
}

.question-category {
  display: inline-block;
  background: var(--color-accent);
  color: var(--color-text-inverse);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-md);
}

.question-title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.question-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.question-actions .btn {
  flex: 1;
  max-width: 200px;
}

@media (max-width: 768px) {
  .question-card {
    padding: var(--spacing-lg);
  }

  .question-title {
    font-size: var(--text-xl);
  }

  .question-actions {
    flex-direction: column;
  }

  .question-actions .btn {
    max-width: none;
  }
}
</style>
