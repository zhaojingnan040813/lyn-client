<template>
  <div class="recipes-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h1>养生菜谱</h1>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="goToRecipeGenerate">
            <el-icon><Plus /></el-icon>
            AI生成菜谱
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <div class="container">
        <div class="search-row">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索菜谱名称、描述或食材..."
            class="search-input"
            @input="handleSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="filter-row">
          <!-- 分类筛选 -->
          <div class="filter-group">
            <span class="filter-label">分类：</span>
            <el-radio-group v-model="currentCategory" @change="handleCategoryChange">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="recommended">推荐</el-radio-button>
              <el-radio-button label="warming">温补</el-radio-button>
              <el-radio-button label="cooling">清补</el-radio-button>
              <el-radio-button label="quick">快手</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜谱列表 -->
    <div class="recipes-content">
      <div class="container">
        <div class="recipes-grid" v-loading="loading">
          <div 
            v-for="recipe in recipes" 
            :key="recipe.id"
            class="recipe-card"
            @click="viewRecipe(recipe.id)"
          >
            <div class="recipe-image">
              <img :src="recipe.image || '/placeholder-food.jpg'" :alt="recipe.name" />
              <div class="recipe-overlay">
                <el-button type="primary" size="small">
                  查看详情
                </el-button>
              </div>
            </div>
            <div class="recipe-info">
              <h3 class="recipe-name">{{ recipe.name }}</h3>
              <p class="recipe-description">{{ recipe.description }}</p>
              
              <div class="recipe-tags">
                <el-tag size="small" :type="getNatureTagType(recipe.nature)">
                  {{ recipe.nature }}
                </el-tag>
                <el-tag size="small" type="info">{{ recipe.difficulty }}</el-tag>
                <el-tag size="small">{{ recipe.cookingTime }}分钟</el-tag>
              </div>
              
              <div class="recipe-stats">
                <div class="stat-item">
                  <el-icon><View /></el-icon>
                  <span>{{ recipe.viewCount || 0 }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><Star /></el-icon>
                  <span>{{ recipe.rating || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore && !loading">
          <el-button @click="loadMore" :loading="loadingMore">
            加载更多
          </el-button>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && recipes.length === 0" class="empty-state">
          <el-empty description="暂无菜谱">
            <el-button type="primary" @click="goToRecipeGenerate">
              AI生成菜谱
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { useUserStore } from '../stores/user'
import { ArrowLeft, Search, Plus, View, Star } from '@element-plus/icons-vue'

const router = useRouter()
const recipeStore = useRecipeStore()
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const loadingMore = ref(false)
const searchKeyword = ref('')
const currentCategory = ref('all')

// 从store获取数据
const recipes = computed(() => recipeStore.recipes)
const pagination = computed(() => recipeStore.pagination)
const hasMore = computed(() => {
  return pagination.value.page * pagination.value.pageSize < pagination.value.total
})

// 页面跳转
const goBack = () => {
  router.push('/')
}

const goToRecipeGenerate = () => {
  router.push('/recipes/generate')
}

const viewRecipe = (id) => {
  router.push(`/recipes/${id}`)
}

// 搜索处理
const handleSearch = debounce(() => {
  recipeStore.setSearchKeyword(searchKeyword.value)
  loadRecipes(true)
}, 500)

// 分类切换
const handleCategoryChange = () => {
  recipeStore.setCategory(currentCategory.value)
  loadRecipes(true)
}

// 加载菜谱
const loadRecipes = async (reset = false) => {
  try {
    if (reset) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    await recipeStore.fetchRecipes(reset)
  } catch (error) {
    console.error('Failed to load recipes:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 加载更多
const loadMore = () => {
  loadRecipes(false)
}

// 获取性味标签类型
const getNatureTagType = (nature) => {
  const typeMap = {
    '寒': 'info',
    '凉': 'info',
    '平': 'success',
    '温': 'warning',
    '热': 'danger'
  }
  return typeMap[nature] || 'info'
}

// 防抖函数
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

onMounted(async () => {
  // 确保用户会话已初始化
  if (!userStore.sessionId) {
    await userStore.initSession()
  }
  
  // 加载菜谱
  await loadRecipes(true)
})
</script>

<style scoped>
.recipes-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

/* 搜索筛选 */
.search-filter {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-row {
  margin-bottom: 16px;
}

.search-input {
  max-width: 600px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #6c757d;
  white-space: nowrap;
}

/* 菜谱内容 */
.recipes-content {
  padding: 24px 0;
  min-height: calc(100vh - 200px);
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 菜谱卡片 */
.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.recipe-card:hover .recipe-overlay {
  opacity: 1;
}

.recipe-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image img {
  transform: scale(1.05);
}

.recipe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recipe-info {
  padding: 20px;
}

.recipe-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2c3e50;
  line-height: 1.4;
}

.recipe-description {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.recipe-stats {
  display: flex;
  gap: 16px;
  color: #6c757d;
  font-size: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 32px 0;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }
  
  .header-left h1 {
    font-size: 20px;
  }
  
  .search-filter {
    padding: 16px 0;
  }
  
  .search-row {
    margin-bottom: 12px;
  }
  
  .search-input {
    max-width: 100%;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-group {
    width: 100%;
    justify-content: space-between;
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .recipes-content {
    padding: 16px 0;
  }
  
  .container {
    padding: 0 16px;
  }
}

/* 动画效果 */
.recipes-grid .recipe-card {
  animation: fadeInUp 0.5s ease-out;
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

/* 滚动条样式 */
.recipes-content::-webkit-scrollbar {
  width: 6px;
}

.recipes-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.recipes-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.recipes-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
