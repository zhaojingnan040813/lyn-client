<template>
  <div class="home">
    <!-- 头部横幅 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">智膳</h1>
        <p class="hero-subtitle">基于中医体质理论的智能膳食推荐系统</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="goToChat">
            <el-icon><ChatDotRound /></el-icon>
            开始AI咨询
          </el-button>
          <el-button size="large" @click="goToRecipes">
            <el-icon><Food /></el-icon>
            浏览菜谱
          </el-button>
        </div>
      </div>
    </section>

    <!-- 功能特色 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="feature-grid">
          <div class="feature-card" @click="goToChat">
            <div class="feature-icon">
              <el-icon size="48"><ChatDotRound /></el-icon>
            </div>
            <h3>AI营养师</h3>
            <p>智能分析您的体质状况，提供个性化的饮食建议和健康指导</p>
          </div>
          
          <div class="feature-card" @click="goToConstitution">
            <div class="feature-icon">
              <el-icon size="48"><User /></el-icon>
            </div>
            <h3>体质识别</h3>
            <p>基于中医九种体质理论，科学评估您的体质类型</p>
          </div>
          
          <div class="feature-card" @click="goToRecipes">
            <div class="feature-icon">
              <el-icon size="48"><Food /></el-icon>
            </div>
            <h3>智能菜谱</h3>
            <p>根据您的体质和偏好，推荐最适合的养生菜谱</p>
          </div>
          
          <div class="feature-card" @click="goToPreference">
            <div class="feature-icon">
              <el-icon size="48"><Setting /></el-icon>
            </div>
            <h3>个性偏好</h3>
            <p>设置您的口味偏好、饮食禁忌和身体状况</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐菜谱 -->
    <section class="recommended-recipes">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">今日推荐</h2>
          <el-button text @click="goToRecipes">查看更多 →</el-button>
        </div>
        <div class="recipe-grid" v-loading="recipesLoading">
          <div 
            v-for="recipe in recommendedRecipes" 
            :key="recipe.id" 
            class="recipe-card"
            @click="viewRecipe(recipe.id)"
          >
            <div class="recipe-image">
              <img :src="recipe.image || '/placeholder-food.jpg'" :alt="recipe.name" />
            </div>
            <div class="recipe-info">
              <h4 class="recipe-name">{{ recipe.name }}</h4>
              <p class="recipe-description">{{ recipe.description }}</p>
              <div class="recipe-tags">
                <el-tag size="small" type="success">{{ recipe.nature }}</el-tag>
                <el-tag size="small" type="info">{{ recipe.difficulty }}</el-tag>
                <el-tag size="small">{{ recipe.cookingTime }}分钟</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 体质介绍 -->
    <section class="constitution-intro">
      <div class="container">
        <h2 class="section-title">中医体质理论</h2>
        <div class="constitution-grid">
          <div 
            v-for="constitution in constitutions" 
            :key="constitution.type"
            class="constitution-card"
          >
            <h4>{{ constitution.name }}</h4>
            <p>{{ constitution.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { recipeApi, constitutionApi } from '../api'
import { ChatDotRound, Food, User, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 推荐菜谱
const recommendedRecipes = ref([])
const recipesLoading = ref(false)

// 体质类型
const constitutions = ref([])

// 页面跳转
const goToChat = () => {
  router.push('/chat')
}

const goToRecipes = () => {
  router.push('/recipes')
}

const goToConstitution = () => {
  router.push('/constitution')
}

const goToPreference = () => {
  router.push('/preference')
}

const viewRecipe = (id) => {
  router.push(`/recipes/${id}`)
}

// 加载推荐菜谱
const loadRecommendedRecipes = async () => {
  if (!userStore.sessionId) return
  
  try {
    recipesLoading.value = true
    const response = await recipeApi.getRecommendedRecipes(4)
    if (response.code === 0) {
      recommendedRecipes.value = response.data.list || []
    }
  } catch (error) {
    console.error('Failed to load recommended recipes:', error)
  } finally {
    recipesLoading.value = false
  }
}

// 加载体质类型
const loadConstitutions = async () => {
  try {
    const response = await constitutionApi.getConstitutions()
    if (response.code === 0) {
      constitutions.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to load constitutions:', error)
  }
}

onMounted(async () => {
  // 初始化用户会话
  await userStore.initSession()
  
  // 加载数据
  await Promise.all([
    loadRecommendedRecipes(),
    loadConstitutions()
  ])
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* 头部横幅 */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 通用容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 48px;
  color: #2c3e50;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

/* 功能特色 */
.features {
  padding: 80px 0;
  background: #f8f9fa;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.feature-icon {
  color: #667eea;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: #2c3e50;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
}

/* 推荐菜谱 */
.recommended-recipes {
  padding: 80px 0;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.recipe-image {
  height: 200px;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info {
  padding: 20px;
}

.recipe-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.recipe-description {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 体质介绍 */
.constitution-intro {
  padding: 80px 0;
  background: #f8f9fa;
}

.constitution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.constitution-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.constitution-card h4 {
  color: #667eea;
  margin-bottom: 12px;
  font-size: 1.125rem;
}

.constitution-card p {
  color: #6c757d;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .feature-grid,
  .recipe-grid,
  .constitution-grid {
    grid-template-columns: 1fr;
  }
}
</style>
