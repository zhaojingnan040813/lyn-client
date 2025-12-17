<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="hero-content animate-fade-in-up">
          <h1 class="hero-title">知体质，懂养生</h1>
          <h2 class="hero-subtitle">AI 为你定制专属食谱</h2>
          <p class="hero-description">
            基于中医体质理论，结合人工智能技术，为您提供个性化的膳食推荐方案
          </p>
          <div class="hero-actions">
            <router-link to="/ai-diagnosis" class="btn btn-primary btn-lg">
              开始 AI 问诊
            </router-link>
            <router-link to="/constitution-diagnosis" class="btn btn-secondary btn-lg">
              测测我的体质
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <router-link :to="feature.link" class="feature-link">了解更多 →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div v-for="(stat, index) in stats" :key="index" class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  {
    icon: '🤖',
    title: 'AI 智能问诊',
    description: '通过对话了解您的身体状况，AI 助手为您提供专业的体质分析和调理建议',
    link: '/ai-diagnosis'
  },
  {
    icon: '🔍',
    title: '体质设置',
    description: '基于中医九种体质理论，科学评估您的体质类型，为膳食推荐提供依据',
    link: '/constitution-diagnosis'
  },
  {
    icon: '🍲',
    title: '智能推荐',
    description: '根据您的体质和口味偏好，AI 为您推荐最适合的养生食谱',
    link: '/ai-recipe-recommend'
  }
])

const stats = ref([
  { value: '10000+', label: '服务用户' },
  { value: '5000+', label: '养生食谱' },
  { value: '9', label: '体质类型' },
  { value: '98%', label: '用户满意度' }
])
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-mesh);
  opacity: 0.5;
  z-index: -1;
}

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, var(--color-primary-alpha) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, var(--color-accent-alpha) 0%, transparent 50%);
  animation: float 8s ease-in-out infinite;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  padding: var(--spacing-4xl) 0;
}

.hero-title {
  font-size: var(--text-6xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  letter-spacing: 0.02em;
}

.hero-subtitle {
  font-size: var(--text-3xl);
  font-weight: var(--font-medium);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xl);
}

.hero-description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-2xl);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Features Section */
.features {
  padding: var(--spacing-4xl) 0;
  background: var(--color-bg-secondary);
}

.section-title {
  text-align: center;
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.feature-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.feature-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-lg);
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-primary);
  transition: all var(--transition-base);
}

.feature-link:hover {
  gap: var(--spacing-sm);
  color: var(--color-primary-dark);
}

/* Stats Section */
.stats {
  padding: var(--spacing-4xl) 0;
  background: var(--gradient-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
}

.stat-item {
  text-align: center;
  color: var(--color-text-inverse);
}

.stat-value {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: var(--text-lg);
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-4xl);
  }

  .hero-subtitle {
    font-size: var(--text-2xl);
  }

  .hero-actions {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}
</style>
