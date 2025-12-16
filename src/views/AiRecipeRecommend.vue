<template>
  <div class="ai-recommend-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">
            <span class="title-icon">🤖</span>
            AI 智能推荐
          </h1>
          <p class="page-subtitle">基于您的体质特征和饮食偏好，为您量身定制健康菜谱</p>
        </div>
        <div class="header-stats" v-if="recommendStats">
          <div class="stat-item">
            <span class="stat-value">{{ recommendStats.totalRecommended }}</span>
            <span class="stat-label">已推荐</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ recommendStats.saved }}</span>
            <span class="stat-label">已保存</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ recommendStats.matchRate }}%</span>
            <span class="stat-label">匹配率</span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-content">
      <div class="content-layout">
        <!-- 左侧：推荐配置面板 -->
        <div class="config-section">
          <AiRecommendPanel :is-recommending="isRecommending" @recommend="handleRecommend" />
        </div>

        <!-- 右侧：推荐结果 -->
        <div class="results-section">
          <!-- AI分析卡片 -->
          <AiAnalysisCard v-if="aiAnalysis" :analysis="aiAnalysis" class="analysis-card" />

          <!-- 推荐状态 -->
          <div v-if="!hasRecommended && !isRecommending" class="empty-state">
            <div class="empty-icon">🎯</div>
            <h3>开始您的智能推荐之旅</h3>
            <p>配置您的偏好条件，AI将为您推荐最适合的健康菜谱</p>
          </div>

          <!-- 推荐中状态 -->
          <div v-if="isRecommending" class="loading-state">
            <div class="loading-animation">
              <div class="ai-thinking">
                <span class="thinking-icon">🧠</span>
                <div class="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <h3>AI 正在为您分析推荐</h3>
              <p>基于您的体质特征和偏好，寻找最适合的菜谱...</p>
            </div>
          </div>

          <!-- 推荐结果 -->
          <div v-if="hasRecommended && !isRecommending" class="recommendations-content">
            <!-- 结果头部 -->
            <div class="results-header">
              <div class="results-info">
                <h3>推荐结果</h3>
                <p>为您找到 {{ recommendedRecipes.length }} 道适合的菜谱</p>
              </div>
              <div class="results-actions">
                <button
                  class="action-btn save-all-btn"
                  :disabled="selectedRecipes.size === 0"
                  @click="handleSaveAll"
                >
                  <span class="btn-icon">💾</span>
                  保存选中 ({{ selectedRecipes.size }})
                </button>
                <button class="action-btn refresh-btn" @click="handleRefresh">
                  <span class="btn-icon">🔄</span>
                  重新推荐
                </button>
              </div>
            </div>

            <!-- 菜谱网格 -->
            <div class="recipes-grid">
              <div
                v-for="(recipe, index) in recommendedRecipes"
                :key="recipe._id"
                class="recipe-card-wrapper"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="recipe-checkbox" @click="toggleRecipeSelection(recipe._id)">
                  <input
                    type="checkbox"
                    :checked="selectedRecipes.has(recipe._id)"
                    @change="toggleRecipeSelection(recipe._id)"
                  />
                  <span class="checkbox-custom"></span>
                </div>

                <RecipeCard
                  :recipe="recipe"
                  :is-featured="recipe.matchScore >= 90"
                  @click="handleRecipeClick"
                  @favorite-toggle="handleFavoriteToggle"
                  @share="handleRecipeShare"
                />

                <div class="recipe-actions">
                  <button
                    class="save-btn"
                    :class="{ 'is-saved': recipe.saved }"
                    @click="handleSaveRecipe(recipe)"
                  >
                    <span v-if="!recipe.saved">💾</span>
                    <span v-else>✅</span>
                    {{ recipe.saved ? '已保存' : '保存' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜谱保存弹窗 -->
    <RecipeSaveModal
      :recipe="selectedRecipe"
      :is-visible="isSaveModalVisible"
      @close="closeSaveModal"
      @save="handleSaveConfirm"
    />

    <!-- 菜谱详情弹窗 -->
    <RecipeDetailModal
      :recipe="detailRecipe"
      :is-visible="isDetailModalVisible"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/utils/toast'
import { useRecipeStore } from '@/stores/recipe'
import { useUserStore } from '@/stores/user'
import {
  staggerAnimation,
  viewportAnimation,
  batchViewportAnimation,
  fadeIn,
  slideIn,
  scale,
  countUp
} from '@/utils/animations'

// 组件导入
import AiRecommendPanel from '@/components/recipe/AiRecommendPanel.vue'
import AiAnalysisCard from '@/components/recipe/AiAnalysisCard.vue'
import RecipeCard from '@/components/recipe/RecipeCard.vue'
import RecipeSaveModal from '@/components/recipe/RecipeSaveModal.vue'
import RecipeDetailModal from '@/components/recipe/RecipeDetailModal.vue'

const router = useRouter()
const toast = useToast()
const recipeStore = useRecipeStore()
const userStore = useUserStore()

// 响应式状态
const isRecommending = ref(false)
const recommendedRecipes = ref([])
const aiAnalysis = ref(null)
const selectedRecipes = ref(new Set())
const selectedRecipe = ref(null)
const detailRecipe = ref(null)
const isSaveModalVisible = ref(false)
const isDetailModalVisible = ref(false)

// 推荐统计
const recommendStats = reactive({
  totalRecommended: 0,
  saved: 0,
  matchRate: 0
})

// 计算属性
const hasRecommended = computed(() => recommendedRecipes.value.length > 0)

// 处理AI推荐
const handleRecommend = async params => {
  isRecommending.value = true

  try {
    // 调用API获取AI推荐
    const response = await recipeStore.fetchAiRecommendations(params)

    if (response && response.length > 0) {
      recommendedRecipes.value = response
      aiAnalysis.value = {
        userProfile:
          '基于您的体质特征和饮食偏好分析，您适合温和调理型菜谱，注重营养均衡和口感清淡。',
        recommendStrategy:
          '推荐以温补为主、营养均衡的菜谱，注重易消化和季节适应性，符合您的体质调理需求。',
        nutritionBalance:
          '推荐菜谱营养搭配均衡，蛋白质、维生素、膳食纤维含量适中，有助于增强体质和改善消化。'
      }

      // 更新统计
      recommendStats.totalRecommended += response.length
      updateMatchRate()

      toast.success(`AI为您推荐了 ${response.length} 道菜谱`)
    } else {
      toast.warning('暂无符合条件的推荐，请调整推荐条件')
    }
  } catch (error) {
    console.error('AI推荐失败:', error)
    toast.error('AI推荐失败，请重试')
  } finally {
    isRecommending.value = false
  }
}

// 处理菜谱点击
const handleRecipeClick = recipe => {
  detailRecipe.value = recipe
  isDetailModalVisible.value = true
}

// 处理收藏切换
const handleFavoriteToggle = (recipe, isFavorited) => {
  recipeStore.toggleFavorite(recipe._id, isFavorited)
}

// 处理菜谱分享
const handleRecipeShare = recipe => {
  recipeStore.shareRecipe(recipe._id)
}

// 切换菜谱选择
const toggleRecipeSelection = recipeId => {
  if (selectedRecipes.value.has(recipeId)) {
    selectedRecipes.value.delete(recipeId)
  } else {
    selectedRecipes.value.add(recipeId)
  }
}

// 处理保存单个菜谱
const handleSaveRecipe = recipe => {
  selectedRecipe.value = recipe
  isSaveModalVisible.value = true
}

// 处理批量保存
const handleSaveAll = async () => {
  const recipesToSave = recommendedRecipes.value.filter(
    recipe => selectedRecipes.value.has(recipe._id) && !recipe.saved
  )

  if (recipesToSave.length === 0) {
    toast.info('没有需要保存的菜谱')
    return
  }

  try {
    for (const recipe of recipesToSave) {
      await recipeStore.saveAIGeneratedRecipe({
        name: recipe.name,
        description: recipe.description,
        nature: '平', // 默认值，用户可以在保存弹窗中修改
        ingredients: [], // 需要从AI推荐中提取
        steps: [] // 需要从AI推荐中提取
      })
      recipe.saved = true
    }

    recommendStats.saved += recipesToSave.length
    selectedRecipes.value.clear()

    toast.success(`成功保存 ${recipesToSave.length} 道菜谱`)
  } catch (error) {
    console.error('批量保存失败:', error)
    toast.error('保存失败，请重试')
  }
}

// 处理保存确认
const handleSaveConfirm = async saveData => {
  try {
    await recipeStore.saveAIGeneratedRecipe(saveData)

    // 标记为已保存
    const recipe = recommendedRecipes.value.find(r => r._id === selectedRecipe.value._id)
    if (recipe) {
      recipe.saved = true
    }

    recommendStats.saved++
    closeSaveModal()

    toast.success('菜谱保存成功！')
  } catch (error) {
    console.error('保存失败:', error)
    toast.error('保存失败，请重试')
  }
}

// 处理刷新推荐
const handleRefresh = () => {
  recommendedRecipes.value = []
  aiAnalysis.value = null
  selectedRecipes.value.clear()

  // 触发重新推荐（这里可以保存之前的参数）
  toast.info('请重新配置推荐条件')
}

// 关闭保存弹窗
const closeSaveModal = () => {
  isSaveModalVisible.value = false
  selectedRecipe.value = null
}

// 关闭详情弹窗
const closeDetailModal = () => {
  isDetailModalVisible.value = false
  detailRecipe.value = null
}

// 更新匹配率
const updateMatchRate = () => {
  if (recommendedRecipes.value.length === 0) {
    recommendStats.matchRate = 0
    return
  }

  const avgScore =
    recommendedRecipes.value.reduce((sum, recipe) => sum + (recipe.matchScore || 0), 0) /
    recommendedRecipes.value.length
  recommendStats.matchRate = Math.round(avgScore)
}

// 组件挂载时的初始化
onMounted(async () => {
  // 检查用户登录状态
  if (!userStore.isLoggedIn) {
    toast.warning('请先登录以获得更好的推荐体验')
  }

  // 初始化动画
  await nextTick()
  initializeAnimations()
})

// 初始化动画效果
const initializeAnimations = () => {
  // 页面头部统计数字动画
  const statElements = document.querySelectorAll('.stat-value')
  statElements.forEach(el => {
    if (el.textContent && !isNaN(parseInt(el.textContent))) {
      countUp(el, parseInt(el.textContent), 1500, 0)
    }
  })

  // 视口动画
  const analysisCard = document.querySelector('.analysis-card')
  if (analysisCard) {
    viewportAnimation(analysisCard, slideIn, { direction: 'right' })
  }

  // 菜谱卡片批量动画
  observeRecipeCards()
}

// 监听菜谱卡片的出现
const observeRecipeCards = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            fadeIn(entry.target)
            slideIn(entry.target, 'up')
          }, index * 100)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  // 监听推荐结果的变化
  const watchRecipes = () => {
    const cards = document.querySelectorAll('.recipe-card-wrapper')
    cards.forEach(card => {
      // 重置动画状态
      card.style.opacity = '0'
      observer.observe(card)
    })
  }

  // 使用MutationObserver监听DOM变化
  const mutationObserver = new MutationObserver(() => {
    watchRecipes()
  })

  const gridContainer = document.querySelector('.recipes-grid')
  if (gridContainer) {
    mutationObserver.observe(gridContainer, {
      childList: true,
      subtree: true
    })
  }

  watchRecipes()
}
</script>

<style scoped>
.ai-recommend-page {
  min-height: calc(100vh - var(--header-height));
  background: linear-gradient(135deg, var(--color-bg-primary), #f8f9fa);
}

/* 页面头部 */
.page-header {
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--spacing-xl) 0;
  position: sticky;
  top: var(--header-height);
  z-index: 10;
  backdrop-filter: blur(var(--blur-sm));
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
}

.header-text {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.title-icon {
  font-size: var(--text-4xl);
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  margin: 0;
  line-height: var(--leading-relaxed);
}

.header-stats {
  display: flex;
  gap: var(--spacing-xl);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-accent);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* 页面内容 */
.page-content {
  padding: var(--spacing-xl) 0;
}

.content-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.config-section {
  position: sticky;
  top: calc(var(--header-height) + 100px);
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.analysis-card {
  animation: slideInRight 0.6s ease-out;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--color-border-medium);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.7;
}

.empty-state h3 {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  margin: 0;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
}

.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.ai-thinking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.thinking-icon {
  font-size: 3rem;
  animation: pulse 2s infinite;
}

.thinking-dots {
  display: flex;
  gap: var(--spacing-xs);
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.thinking-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.thinking-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
.thinking-dots span:nth-child(3) {
  animation-delay: 0;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 推荐结果 */
.recommendations-content {
  animation: fadeIn 0.6s ease-out;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.results-info h3 {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.results-info p {
  color: var(--color-text-secondary);
  margin: 0;
}

.results-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.save-all-btn {
  background: var(--gradient-accent);
  color: white;
}

.save-all-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.save-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-medium);
}

.refresh-btn:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-text-secondary);
}

.btn-icon {
  font-size: var(--text-base);
}

/* 菜谱网格 */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.recipe-card-wrapper {
  position: relative;
  animation: slideInUp 0.6s ease-out backwards;
}

.recipe-checkbox {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  z-index: 2;
  cursor: pointer;
}

.recipe-checkbox input[type='checkbox'] {
  display: none;
}

.checkbox-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-bg-elevated);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.recipe-checkbox input:checked + .checkbox-custom {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.recipe-checkbox input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.recipe-actions {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 2;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  backdrop-filter: blur(var(--blur-sm));
}

.save-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
  transform: scale(1.05);
}

.save-btn.is-saved {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

/* 动画 */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .config-section {
    position: static;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }

  .header-stats {
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-lg) 0;
  }

  .header-content {
    padding: 0 var(--spacing-lg);
  }

  .page-title {
    font-size: var(--text-2xl);
  }

  .title-icon {
    font-size: var(--text-3xl);
  }

  .page-subtitle {
    font-size: var(--text-base);
  }

  .header-stats {
    gap: var(--spacing-md);
  }

  .content-layout {
    padding: 0 var(--spacing-lg);
  }

  .recipes-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .results-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
