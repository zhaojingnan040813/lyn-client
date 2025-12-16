<template>
  <div class="recipe-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <!-- 快捷操作 -->
        <div class="header-actions">
          <button class="btn btn-secondary toggle-filters-btn" @click="toggleFilters">
            <span class="btn-icon">🎯</span>
            <span>筛选</span>
          </button>
        </div>

        <div class="title-section">
          <!-- <h1 class="page-title">
            <span class="title-icon">🍽️</span>
            至膳推荐
          </h1> -->
          <p class="page-description">基于您的体质和偏好，为您推荐最适合的健康菜谱</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-main">
      <!-- 筛选面板 -->
      <div v-show="showFilters" class="filters-panel">
        <RecipeFilters
          :search-keyword="searchParams.keyword"
          @search="handleSearch"
          @filter-change="handleFilterChange"
          @category-change="handleCategoryChange"
          @reset="handleResetFilters"
          @suggestion-click="handleSuggestionClick"
          ref="filtersRef"
        />
      </div>

      <!-- 菜谱网格 -->
      <div class="recipe-content">
        <RecipeGrid
          :recipes="recipeStore.recipes"
          :loading="recipeStore.loading"
          :search-keyword="searchParams.keyword"
          :loading-recipe-ids="loadingRecipeIds"
          @recipe-click="handleRecipeClick"
          @favorite-toggle="handleFavoriteToggle"
          @share="handleShare"
          @sort-change="handleSortChange"
          @view-mode-change="handleViewModeChange"
          @reset="handleReset"
          ref="gridRef"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <RecipeDetailModal
      :is-visible="showDetailModal"
      :recipe="selectedRecipe"
      :loading="detailLoading"
      @close="closeDetailModal"
      @favorite-toggle="handleFavoriteToggle"
      @share="handleShare"
      @retry="retryLoadDetail"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useRecipeStore } from '@/stores/recipe'
import { useToast } from '@/utils/toast'
import { RecipeCard, RecipeFilters, RecipeGrid, RecipeDetailModal, EmptyState } from '@/components'

const router = useRouter()
const userStore = useUserStore()
const recipeStore = useRecipeStore()
const toast = useToast()

// 响应式数据
const showFilters = ref(true)
const showDetailModal = ref(false)
const selectedRecipe = ref(null)
const detailLoading = ref(false)
const loadingRecipeIds = ref(new Set())

// 搜索参数
const searchParams = reactive({
  keyword: '',
  category: 'recommended',
  sortBy: 'matchScore',
  sortOrder: 'desc',
  filters: {
    maxTime: '',
    difficulty: '',
    constitutions: [],
    nutritionTags: []
  },
  page: 1,
  pageSize: 12
})

// 组件引用
const filtersRef = ref(null)
const gridRef = ref(null)

// 初始化数据
onMounted(async () => {
  try {
    await loadInitialData()
  } catch (error) {
    console.error('初始化失败:', error)
    toast.error('页面初始化失败，请刷新重试')
  }
})

// 加载初始数据
const loadInitialData = async () => {
  // 获取推荐菜谱
  await loadRecipes()
}

// 加载菜谱列表
const loadRecipes = async () => {
  try {
    await recipeStore.fetchRecipes(searchParams)
  } catch (error) {
    console.error('加载菜谱失败:', error)
    toast.error('加载菜谱失败，请稍后重试')
  }
}

// 处理搜索
const handleSearch = async keyword => {
  searchParams.keyword = keyword
  searchParams.page = 1
  await loadRecipes()
}

// 处理筛选变化
const handleFilterChange = async filters => {
  searchParams.filters = { ...filters }
  searchParams.page = 1
  await loadRecipes()
}

// 处理分类变化
const handleCategoryChange = async category => {
  searchParams.category = category
  searchParams.page = 1
  await loadRecipes()
}

// 处理排序变化
const handleSortChange = async sortConfig => {
  searchParams.sortBy = sortConfig.sortBy
  searchParams.sortOrder = sortConfig.sortOrder
  searchParams.page = 1
  await loadRecipes()
}

// 处理视图模式变化
const handleViewModeChange = viewMode => {
  // 保存用户偏好
  localStorage.setItem('recipe-view-mode', viewMode)
}

// 处理菜谱点击
const handleRecipeClick = async recipe => {
  selectedRecipe.value = recipe
  showDetailModal.value = true

  // 标记为加载中
  loadingRecipeIds.value.add(recipe.id)

  try {
    detailLoading.value = true
    await recipeStore.fetchRecipeDetail(recipe.id)
  } catch (error) {
    console.error('加载菜谱详情失败:', error)
    toast.error('加载菜谱详情失败')
  } finally {
    detailLoading.value = false
    loadingRecipeIds.value.delete(recipe.id)
  }
}

// 处理收藏切换
const handleFavoriteToggle = async (recipe, isFavorited) => {
  if (!userStore.isLoggedIn) {
    toast.warning('请先登录后再进行收藏')
    router.push('/login')
    return
  }

  try {
    await recipeStore.toggleFavorite(recipe.id, isFavorited)
  } catch (error) {
    console.error('收藏操作失败:', error)
    toast.error('收藏操作失败，请稍后重试')
  }
}

// 处理分享
const handleShare = recipe => {
  // 分享逻辑已在组件中实现
  console.log('分享菜谱:', recipe.name)
}

// 处理建议点击
const handleSuggestionClick = async category => {
  searchParams.category = category
  searchParams.page = 1
  await loadRecipes()
}

// 处理重置筛选
const handleReset = async () => {
  searchParams.keyword = ''
  searchParams.category = 'recommended'
  searchParams.filters = {
    maxTime: '',
    difficulty: '',
    constitutions: [],
    nutritionTags: []
  }
  searchParams.page = 1

  // 重置筛选组件
  if (filtersRef.value) {
    filtersRef.value.updateCategoryCounts({})
  }

  await loadRecipes()
}

// 切换筛选面板
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedRecipe.value = null
}

// 重试加载详情
const retryLoadDetail = async () => {
  if (selectedRecipe.value) {
    await handleRecipeClick(selectedRecipe.value)
  }
}

// 监听滚动事件，实现无限滚动
const handleScroll = async () => {
  if (recipeStore.loading || recipeStore.hasMore === false) return

  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  // 距离底部100px时加载更多
  if (scrollTop + windowHeight >= documentHeight - 100) {
    searchParams.page += 1
    await loadRecipes()
  }
}

onMounted(() => {
  // 恢复视图模式
  const savedViewMode = localStorage.getItem('recipe-view-mode')
  if (savedViewMode && gridRef.value) {
    // 延迟设置，确保组件已挂载
    nextTick(() => {
      gridRef.value.setViewMode(savedViewMode)
    })
  }

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

// 清理滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.recipe-page {
  min-height: 100vh;
  background: var(--color-bg-primary);
}

/* 页面头部 */
.page-header {
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--spacing-xl) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(var(--blur-sm));
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

/* 快捷操作区域 - 居左 */
.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
  order: -1; /* 确保在标题前面 */
}

/* 标题区域 */
.title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.title-icon {
  font-size: var(--text-2xl);
}

.page-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: var(--leading-relaxed);
}

/* 按钮样式 */
.toggle-filters-btn {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-medium);
}

.toggle-filters-btn:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.btn-icon {
  margin-right: var(--spacing-xs);
  font-size: var(--text-base);
}

/* 主要内容区 */
.page-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 筛选面板 */
.filters-panel {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 菜谱内容区 */
.recipe-content {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-header {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: var(--spacing-md);
  }

  .header-actions {
    order: 1; /* 在小屏幕上移到标题下面 */
    justify-content: center;
  }

  .title-section {
    order: 0; /* 标题在前面 */
    text-align: center;
  }

  .page-title {
    font-size: var(--text-2xl);
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .header-content {
    gap: var(--spacing-sm);
  }

  .page-title {
    font-size: var(--text-xl);
  }

  .page-description {
    font-size: var(--text-sm);
  }

  .page-main {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .header-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: var(--spacing-sm);
  }

  .page-title {
    font-size: var(--text-lg);
    flex-direction: column;
    text-align: center;
  }

  .title-icon {
    font-size: var(--text-xl);
    margin-bottom: var(--spacing-xs);
    margin-right: 0;
  }

  .page-description {
    font-size: var(--text-xs);
    text-align: center;
  }
}

/* 加载状态 */
.recipe-page.is-loading {
  pointer-events: none;
}

.recipe-page.is-loading .recipe-content {
  opacity: 0.6;
}

/* 骨架屏动画 */
.skeleton-fade {
  animation: skeletonFade 1s ease-in-out infinite alternate;
}

@keyframes skeletonFade {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.7;
  }
}

/* 空状态增强 */
.recipe-content:has(.empty-state) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

/* 筛选面板增强 */
.filters-panel {
  position: relative;
}

.filters-panel::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-border-light) 20%,
    var(--color-border-light) 80%,
    transparent 100%
  );
}

/* 页面切换动画 */
.page-header,
.page-main {
  animation: pageFadeIn 0.6s ease-out;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .page-header {
    backdrop-filter: blur(var(--blur-md));
  }
}

/* 滚动条美化 */
.recipe-page::-webkit-scrollbar {
  width: 8px;
}

.recipe-page::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

.recipe-page::-webkit-scrollbar-thumb {
  background: var(--color-border-medium);
  border-radius: var(--radius-full);
}

.recipe-page::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}

/* 打印样式 */
@media print {
  .page-header {
    position: static;
    box-shadow: none;
    border-bottom: 1px solid #000;
  }

  .header-actions {
    display: none;
  }

  .filters-panel {
    display: none;
  }

  .recipe-content {
    padding: 0;
  }
}
</style>
