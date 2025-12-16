<template>
  <div class="advice-card" :class="type">
    <div class="advice-icon">{{ icon }}</div>
    <h4>{{ title }}</h4>
    <p>{{ advice }}</p>
    <div class="advice-details">
      <h5>{{ detailTitle }}：</h5>
      <span :class="tagClass">
        {{ detailItems.join(' • ') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  advice: {
    type: String,
    required: true
  },
  detailTitle: {
    type: String,
    required: true
  },
  detailItems: {
    type: Array,
    required: true
  }
})

const tagClass = computed(() => {
  const typeMap = {
    diet: 'food-tags',
    exercise: 'exercise-tags',
    lifestyle: 'lifestyle-tags'
  }
  return typeMap[props.type] || 'food-tags'
})
</script>

<style scoped>
.advice-card {
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-base) var(--ease-out);
}

.advice-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.advice-icon {
  font-size: var(--text-3xl);
  margin-bottom: var(--spacing-md);
}

.advice-card h4 {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.advice-card p {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  margin-bottom: var(--spacing-md);
}

.advice-details {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.advice-details h5 {
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.food-tags,
.exercise-tags,
.lifestyle-tags {
  display: inline-block;
  font-size: var(--text-xs);
  color: var(--color-accent);
  background: var(--color-accent-alpha);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  line-height: var(--leading-normal);
  font-weight: var(--font-medium);
}
</style>
