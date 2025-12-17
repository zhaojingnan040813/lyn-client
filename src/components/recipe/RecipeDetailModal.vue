<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- 关闭按钮 -->
          <button class="modal-close" @click="close">
            <span class="close-icon">✕</span>
          </button>

          <!-- 模态框内容 -->
          <div class="modal-content">
            <div v-if="loading" class="modal-loading">
              <LoadingSpinner size="lg" />
              <span>加载菜谱详情...</span>
            </div>

            <div v-else-if="recipe" class="recipe-detail">
              <!-- 头部信息 -->
              <div class="recipe-header">
                <div class="recipe-image">
                  <img
                    v-if="recipe.image && !imageError"
                    :src="recipe.image"
                    :alt="recipe.name"
                    @error="imageError = true"
                  />
                  <div v-else class="image-placeholder">
                    <div class="placeholder-icon">
                      <span>🍽️</span>
                    </div>
                  </div>

                  <!-- 匹配度标签 -->
                  <div v-if="recipe.matchScore !== undefined" class="match-badge">
                    <span class="match-value">{{ recipe.matchScore }}%</span>
                    <span class="match-label">匹配度</span>
                  </div>
                </div>

                <div class="recipe-info">
                  <h1 class="recipe-name">{{ recipe.name }}</h1>
                  <p class="recipe-description">{{ recipe.description }}</p>

                  <!-- 基础信息 -->
                  <div class="recipe-meta">
                    <div class="meta-group">
                      <h3 class="meta-title">基本信息</h3>
                      <div class="meta-list">
                        <div v-if="recipe.cookingTime" class="meta-item">
                          <span class="meta-icon">⏱️</span>
                          <span class="meta-label">烹饪时间</span>
                          <span class="meta-value">{{ recipe.cookingTime }}分钟</span>
                        </div>
                        <div v-if="recipe.difficulty" class="meta-item">
                          <span class="meta-icon">📊</span>
                          <span class="meta-label">难度等级</span>
                          <span class="meta-value">
                            {{ recipe.difficulty }}
                          </span>
                        </div>
                        <div v-if="recipe.servings" class="meta-item">
                          <span class="meta-icon">👥</span>
                          <span class="meta-label">份量</span>
                          <span class="meta-value">{{ recipe.servings }}人份</span>
                        </div>
                        <div v-if="recipe.category" class="meta-item">
                          <span class="meta-icon">🏷️</span>
                          <span class="meta-label">分类</span>
                          <span class="meta-value">{{ getCategoryLabel(recipe.category) }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 体质适配 -->
                    <div
                      v-if="recipe.suitableConstitutions && recipe.suitableConstitutions.length"
                      class="meta-group"
                    >
                      <h3 class="meta-title">适合体质</h3>
                      <div class="constitutions-list">
                        <span
                          v-for="constitution in recipe.suitableConstitutions"
                          :key="constitution"
                          class="constitution-tag"
                          :style="{ backgroundColor: getConstitutionColor(constitution) }"
                        >
                          {{ getConstitutionLabel(constitution) }}
                        </span>
                      </div>
                    </div>

                    <!-- 营养标签 -->
                    <div
                      v-if="recipe.nutritionTags && recipe.nutritionTags.length"
                      class="meta-group"
                    >
                      <h3 class="meta-title">营养特点</h3>
                      <div class="nutrition-tags-list">
                        <span v-for="tag in recipe.nutritionTags" :key="tag" class="nutrition-tag">
                          {{ getNutritionLabel(tag) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 详细内容标签页 -->
              <div class="recipe-tabs">
                <div class="tabs-header">
                  <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    :class="['tab-btn', { 'is-active': activeTab === tab.key }]"
                    @click="activeTab = tab.key"
                  >
                    <span class="tab-icon">{{ tab.icon }}</span>
                    <span class="tab-label">{{ tab.label }}</span>
                  </button>
                </div>

                <div class="tabs-content">
                  <!-- 食材清单 -->
                  <div v-if="activeTab === 'ingredients'" class="tab-panel">
                    <div
                      v-if="recipe.ingredients && recipe.ingredients.length"
                      class="ingredients-section"
                    >
                      <h3 class="section-title">食材清单</h3>
                      <div class="ingredients-list">
                        <div
                          v-for="(ingredient, index) in recipe.ingredients"
                          :key="index"
                          class="ingredient-item"
                        >
                          <span class="ingredient-name">{{ ingredient.name || ingredient }}</span>
                          <span v-if="ingredient.amount" class="ingredient-amount">
                            {{ ingredient.amount }}
                          </span>
                          <span v-if="ingredient.unit" class="ingredient-unit">
                            {{ ingredient.unit }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="empty-section">
                      <p>暂无食材信息</p>
                    </div>
                  </div>

                  <!-- 烹饪步骤 -->
                  <div v-if="activeTab === 'steps'" class="tab-panel">
                    <div v-if="recipe.steps && recipe.steps.length" class="steps-section">
                      <h3 class="section-title">烹饪步骤</h3>
                      <div class="steps-list">
                        <div v-for="(step, index) in recipe.steps" :key="index" class="step-item">
                          <div class="step-number">{{ index + 1 }}</div>
                          <div class="step-content">
                            <p class="step-description">{{ step.content || step }}</p>
                            <div v-if="step.time" class="step-time">
                              <span class="time-icon">⏱️</span>
                              {{ step.time }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="empty-section">
                      <p>暂无烹饪步骤</p>
                    </div>
                  </div>

                  <!-- 营养信息 -->
                  <div v-if="activeTab === 'nutrition'" class="tab-panel">
                    <div
                      v-if="recipe.nutritionTags && recipe.nutritionTags.length"
                      class="nutrition-section"
                    >
                      <h3 class="section-title">营养特点</h3>
                      <div class="nutrition-tags-list">
                        <span v-for="tag in recipe.nutritionTags" :key="tag" class="nutrition-tag">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                    <div v-else class="empty-section">
                      <p>暂无营养信息</p>
                    </div>
                  </div>

                  <!-- AI推荐理由 -->
                  <div v-if="activeTab === 'ai'" class="tab-panel">
                    <div
                      v-if="recipe.recommendReason || recipe.healthBenefits || recipe.bestMealTime"
                      class="ai-section"
                    >
                      <h3 class="section-title">
                        <span class="ai-icon">🤖</span>
                        AI智能推荐分析
                      </h3>
                      <div v-if="recipe.recommendReason" class="ai-reason">
                        <h4 class="reason-title">推荐理由</h4>
                        <p class="reason-content">{{ recipe.recommendReason }}</p>
                      </div>
                      <div v-if="recipe.healthBenefits" class="ai-benefits">
                        <h4 class="benefits-title">健康益处</h4>
                        <p class="benefits-content">{{ recipe.healthBenefits }}</p>
                      </div>
                      <div
                        v-if="recipe.nutritionTags && recipe.nutritionTags.length"
                        class="ai-tags"
                      >
                        <h4 class="tags-title">营养标签</h4>
                        <div class="ai-tags-list">
                          <span v-for="tag in recipe.nutritionTags" :key="tag" class="ai-tag">
                            {{ tag }}
                          </span>
                        </div>
                      </div>
                      <div v-if="recipe.bestMealTime" class="ai-meal-time">
                        <h4 class="meal-time-title">最佳用餐时间</h4>
                        <p class="meal-time-content">{{ recipe.bestMealTime }}</p>
                      </div>
                      <div v-if="recipe.seasonalAdvice" class="ai-seasonal">
                        <h4 class="seasonal-title">季节建议</h4>
                        <p class="seasonal-content">{{ recipe.seasonalAdvice }}</p>
                      </div>
                    </div>
                    <div v-else class="empty-section">
                      <p>暂无AI分析信息</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="modal-error">
              <div class="error-icon">⚠️</div>
              <h3>加载失败</h3>
              <p>无法获取菜谱详情，请稍后重试</p>
              <button class="btn btn-primary" @click="retry">重试</button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div v-if="recipe && !loading" class="modal-actions">
            <button class="action-btn favorite-btn" @click="toggleFavorite">
              <span class="action-icon">{{ isFavorited ? '❤️' : '🤍' }}</span>
              <span class="action-label">{{ isFavorited ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="action-btn share-btn" @click="share">
              <span class="action-icon">📤</span>
              <span class="action-label">分享</span>
            </button>
            <button class="action-btn print-btn" @click="print">
              <span class="action-icon">🖨️</span>
              <span class="action-label">打印</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '@/utils/toast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  recipe: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'favorite-toggle', 'share', 'retry'])

const toast = useToast()

// 本地状态
const imageError = ref(false)
const isFavorited = ref(false)
const activeTab = ref('ingredients')

// 标签页配置
const tabs = [
  { key: 'ingredients', label: '食材', icon: '🥘' },
  { key: 'steps', label: '步骤', icon: '📝' },
  { key: 'nutrition', label: '营养', icon: '📊' },
  { key: 'ai', label: 'AI分析', icon: '🤖' }
]

// 获取标签映射函数
const getCategoryLabel = category => {
  const categoryMap = {
    recommended: '推荐',
    warming: '温补',
    cooling: '清热',
    quick: '快手菜'
  }
  return categoryMap[category] || category
}

const getConstitutionLabel = constitution => {
  const constitutionMap = {
    balanced: '平和质',
    qi_deficiency: '气虚质',
    yang_deficiency: '阳虚质',
    yin_deficiency: '阴虚质',
    phlegm_dampness: '痰湿质',
    damp_heat: '湿热质',
    blood_stasis: '血瘀质',
    qi_stagnation: '气郁质',
    special: '特禀质'
  }
  return constitutionMap[constitution] || constitution
}

const getConstitutionColor = constitution => {
  const colorMap = {
    balanced: 'var(--color-constitution-balanced)',
    qi_deficiency: 'var(--color-constitution-qi)',
    yang_deficiency: 'var(--color-constitution-yang)',
    yin_deficiency: 'var(--color-constitution-yin)',
    phlegm_dampness: 'var(--color-constitution-phlegm)',
    damp_heat: 'var(--color-constitution-damp)',
    blood_stasis: 'var(--color-constitution-blood)',
    qi_stagnation: 'var(--color-constitution-qi-stagnation)',
    special: 'var(--color-constitution-special)'
  }
  return colorMap[constitution] || 'var(--color-text-tertiary)'
}

const getNutritionLabel = key => {
  const nutritionMap = {
    calories: '热量',
    protein: '蛋白质',
    fat: '脂肪',
    carbohydrate: '碳水化合物',
    fiber: '膳食纤维',
    sodium: '钠',
    sugar: '糖分',
    cholesterol: '胆固醇'
  }
  return nutritionMap[key] || key
}

// 操作处理
const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  close()
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  emit('favorite-toggle', props.recipe, isFavorited.value)

  toast.info(isFavorited.value ? '已添加到收藏' : '已取消收藏')
}

const share = () => {
  const shareUrl = `${window.location.origin}/recipe/${props.recipe.id}`
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      toast.success('链接已复制到剪贴板')
    })
    .catch(() => {
      toast.error('复制失败，请手动复制链接')
    })
  emit('share', props.recipe)
}

const print = () => {
  window.print()
}

const retry = () => {
  emit('retry')
}

// 监听菜谱变化，重置状态
watch(
  () => props.recipe,
  newRecipe => {
    if (newRecipe) {
      imageError.value = false
      activeTab.value = 'ingredients'
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* 模态框基础样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(var(--blur-sm));
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.modal-container {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 900px;
  max-height: 90vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 40px;
  height: 40px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all var(--transition-base);
}

.modal-close:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.close-icon {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
  padding-top: var(--spacing-2xl);
}

/* 加载和错误状态 */
.modal-loading,
.modal-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  min-height: 200px;
  color: var(--color-text-secondary);
}

.error-icon {
  font-size: 3rem;
  color: var(--color-error);
}

/* 菜谱详情 */
.recipe-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* 头部信息 */
.recipe-header {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.recipe-image {
  position: relative;
  width: 300px;
  height: 225px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-bg-tertiary);
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.placeholder-icon span {
  display: inline-block;
}

.match-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: var(--gradient-accent);
  color: white;
  padding: var(--spacing-sm);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.match-value {
  display: block;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.match-label {
  font-size: var(--text-xs);
  opacity: 0.9;
}

.recipe-info {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--leading-tight);
}

.recipe-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-lg) 0;
}

/* 元信息 */
.recipe-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.meta-group {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.meta-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-md);
}

.meta-icon {
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.meta-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  min-width: 80px;
}

.meta-value {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

/* 体质标签 */
.constitutions-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.constitution-tag {
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

/* 营养标签 */
.nutrition-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.nutrition-tag {
  background: var(--color-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 标签页 */
.recipe-tabs {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-light);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.tab-btn.is-active {
  background: var(--color-bg-elevated);
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-icon {
  font-size: var(--text-base);
}

.tabs-content {
  max-height: 400px;
  overflow-y: auto;
}

.tab-panel {
  padding: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-lg) 0;
}

/* 食材清单 */
.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.ingredient-item:hover {
  background: var(--color-bg-tertiary);
  transform: translateX(4px);
}

.ingredient-name {
  flex: 1;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.ingredient-amount {
  color: var(--color-accent);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
}

.ingredient-unit {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

/* 烹饪步骤 */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.step-item {
  display: flex;
  gap: var(--spacing-lg);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding-top: var(--spacing-xs);
}

.step-description {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-sm) 0;
}

.step-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.time-icon {
  font-size: var(--text-base);
}

/* 营养信息 */
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.nutrition-label {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.nutrition-value {
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
}

/* AI分析 */
.ai-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.ai-icon {
  font-size: var(--text-xl);
  margin-right: var(--spacing-sm);
}

.ai-reason,
.ai-benefits,
.ai-tags,
.ai-meal-time,
.ai-seasonal {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.reason-title,
.benefits-title,
.tags-title,
.meal-time-title,
.seasonal-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.reason-content,
.benefits-content,
.meal-time-content,
.seasonal-content {
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.ai-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.ai-tag {
  background: var(--gradient-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 空状态 */
.empty-section {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
}

/* 操作按钮 */
.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border-light);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.action-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  font-size: var(--text-base);
}

.action-label {
  font-weight: var(--font-medium);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-slow);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transform: scale(1) translateY(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .recipe-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .recipe-image {
    width: 100%;
    max-width: 400px;
    height: 300px;
  }

  .modal-container {
    max-width: 95%;
    max-height: 95vh;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }

  .modal-content {
    padding: var(--spacing-lg);
    padding-top: var(--spacing-xl);
  }

  .recipe-name {
    font-size: var(--text-2xl);
  }

  .tabs-header {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1;
    min-width: 80px;
  }

  .tab-icon {
    display: none;
  }

  .nutrition-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .recipe-image {
    height: 200px;
  }

  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .meta-label {
    min-width: auto;
  }

  .step-item {
    gap: var(--spacing-md);
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: var(--text-base);
  }
}

/* 打印样式 */
@media print {
  .modal-overlay {
    position: static;
    background: white;
    backdrop-filter: none;
  }

  .modal-container {
    box-shadow: none;
    max-width: 100%;
    max-height: none;
  }

  .modal-close,
  .modal-actions {
    display: none;
  }

  .tabs-content {
    max-height: none;
    overflow: visible;
  }

  .tab-btn {
    display: none;
  }

  .tab-panel {
    display: block !important;
    page-break-inside: avoid;
  }
}
</style>
