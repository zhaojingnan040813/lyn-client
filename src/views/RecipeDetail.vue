<template>
  <div class="recipe-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h1>菜谱详情</h1>
        </div>
        <div class="header-right">
          <el-button @click="toggleFavorite" :type="isFavorite ? 'danger' : 'default'">
            <el-icon><Star /></el-icon>
            {{ isFavorite ? '已收藏' : '收藏' }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="recipe-content" v-loading="loading">
      <div class="container" v-if="recipe">
        <!-- 菜谱头部信息 -->
        <div class="recipe-header">
          <div class="recipe-image">
            <img :src="recipe.image || '/placeholder-food.jpg'" :alt="recipe.name" />
          </div>
          <div class="recipe-info">
            <h1 class="recipe-name">{{ recipe.name }}</h1>
            <p class="recipe-description">{{ recipe.description }}</p>
            
            <div class="recipe-tags">
              <el-tag :type="getNatureTagType(recipe.nature)" size="large">
                {{ recipe.nature }}
              </el-tag>
              <el-tag type="info" size="large">{{ recipe.difficulty }}</el-tag>
              <el-tag type="warning" size="large">{{ recipe.cookingTime }}分钟</el-tag>
            </div>

            <div class="recipe-stats">
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>{{ recipe.viewCount || 0 }} 浏览</span>
              </div>
              <div class="stat-item">
                <el-icon><Star /></el-icon>
                <span>{{ recipe.rating || 0 }} 评分</span>
              </div>
              <div class="stat-item">
                <el-icon><Clock /></el-icon>
                <span>{{ recipe.createTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 体质匹配度 -->
        <div class="match-section" v-if="userStore.constitution && matchScore">
          <div class="match-header">
            <h3>体质匹配度</h3>
            <el-tag :type="getMatchTagType(matchScore)" size="large">
              {{ matchScore }}% 匹配
            </el-tag>
          </div>
          <div class="match-progress">
            <el-progress 
              :percentage="matchScore" 
              :stroke-width="12"
              :show-text="false"
            />
          </div>
          <p class="match-description">
            {{ getMatchDescription(matchScore) }}
          </p>
        </div>

        <!-- 营养信息 -->
        <div class="nutrition-section">
          <h3>营养信息</h3>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <span class="nutrition-label">热量</span>
              <span class="nutrition-value">{{ recipe.calories || 0 }} kcal</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">蛋白质</span>
              <span class="nutrition-value">{{ recipe.protein || 0 }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">脂肪</span>
              <span class="nutrition-value">{{ recipe.fat || 0 }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">碳水化合物</span>
              <span class="nutrition-value">{{ recipe.carbs || 0 }}g</span>
            </div>
          </div>
        </div>

        <!-- 食材清单 -->
        <div class="ingredients-section">
          <h3>食材清单</h3>
          <div class="ingredients-grid">
            <div 
              v-for="ingredient in recipe.ingredients" 
              :key="ingredient.name"
              class="ingredient-item"
            >
              <div class="ingredient-icon">
                {{ getIngredientIcon(ingredient.name) }}
              </div>
              <div class="ingredient-info">
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span class="ingredient-amount">{{ ingredient.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 烹饪步骤 -->
        <div class="steps-section">
          <h3>烹饪步骤</h3>
          <div class="steps-list">
            <div 
              v-for="(step, index) in recipe.steps" 
              :key="index"
              class="step-item"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <p>{{ step }}</p>
                <div class="step-image" v-if="recipe.stepImages && recipe.stepImages[index]">
                  <img :src="recipe.stepImages[index]" :alt="`步骤${index + 1}`" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 烹饪技巧 -->
        <div class="tips-section" v-if="recipe.tips && recipe.tips.length > 0">
          <h3>烹饪技巧</h3>
          <div class="tips-list">
            <div 
              v-for="(tip, index) in recipe.tips" 
              :key="index"
              class="tip-item"
            >
              <el-icon><Lamp /></el-icon>
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>

        <!-- 相关推荐 -->
        <div class="recommendations-section" v-if="recommendations.length > 0">
          <h3>相关推荐</h3>
          <div class="recommendations-grid">
            <div 
              v-for="rec in recommendations" 
              :key="rec.id"
              class="recommendation-card"
              @click="viewRecipe(rec.id)"
            >
              <div class="rec-image">
                <img :src="rec.image || '/placeholder-food.jpg'" :alt="rec.name" />
              </div>
              <div class="rec-info">
                <h4>{{ rec.name }}</h4>
                <p>{{ rec.description }}</p>
                <div class="rec-tags">
                  <el-tag size="small" :type="getNatureTagType(rec.nature)">
                    {{ rec.nature }}
                  </el-tag>
                  <el-tag size="small">{{ rec.cookingTime }}分钟</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty-state">
        <el-empty description="菜谱不存在或已被删除">
          <el-button type="primary" @click="goBack">返回</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { useUserStore } from '../stores/user'
import { recipeApi } from '../api'
import { 
  ArrowLeft, Star, View, Clock, Lamp 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const recipe = ref(null)
const isFavorite = ref(false)
const recommendations = ref([])

// 计算属性
const matchScore = computed(() => {
  if (!recipe.value?.matchScore) return 0
  return Math.round(recipe.value.matchScore * 100)
})

// 页面跳转
const goBack = () => {
  router.push('/recipes')
}

const viewRecipe = (id) => {
  router.push(`/recipes/${id}`)
}

// 切换收藏状态
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  const message = isFavorite.value ? '已添加到收藏' : '已取消收藏'
  ElMessage.success(message)
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

// 获取匹配度标签类型
const getMatchTagType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'info'
}

// 获取匹配度描述
const getMatchDescription = (score) => {
  if (score >= 90) return '非常适合您的体质，强烈推荐！'
  if (score >= 80) return '很适合您的体质，建议尝试。'
  if (score >= 60) return '比较适合您的体质，可以适量食用。'
  if (score >= 40) return '一般适合，注意食用量。'
  return '不太适合您的体质，建议谨慎食用。'
}

// 获取食材图标
const getIngredientIcon = (name) => {
  const iconMap = {
    '鸡蛋': '🥚',
    '鸡肉': '🍗',
    '猪肉': '🥩',
    '牛肉': '🥩',
    '鱼': '🐟',
    '虾': '🦐',
    '豆腐': '🧈',
    '土豆': '🥔',
    '番茄': '🍅',
    '黄瓜': '🥒',
    '胡萝卜': '🥕',
    '白菜': '🥬',
    '菠菜': '🥬',
    '蘑菇': '🍄',
    '洋葱': '🧅',
    '大蒜': '🧄',
    '生姜': '🧄',
    '葱': '🧅',
    '盐': '🧂',
    '油': '🫙',
    '酱油': '🫙',
    '醋': '🫙'
  }
  
  // 简单的匹配逻辑
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon
    }
  }
  
  return '🥄'
}

// 加载菜谱详情
const loadRecipeDetail = async () => {
  const recipeId = route.params.id
  if (!recipeId) return

  try {
    loading.value = true
    const response = await recipeApi.getRecipeById(recipeId)
    if (response.code === 0) {
      recipe.value = response.data
    } else {
      ElMessage.error('菜谱不存在')
      router.push('/recipes')
    }
  } catch (error) {
    console.error('Failed to load recipe detail:', error)
    ElMessage.error('加载菜谱详情失败')
    router.push('/recipes')
  } finally {
    loading.value = false
  }
}

// 加载推荐菜谱
const loadRecommendations = async () => {
  if (!userStore.sessionId) return

  try {
    const response = await recipeApi.getRecommendedRecipes(4)
    if (response.code === 0) {
      recommendations.value = response.data.list?.filter(r => r.id !== recipe.value?.id) || []
    }
  } catch (error) {
    console.error('Failed to load recommendations:', error)
  }
}

onMounted(async () => {
  // 确保用户会话已初始化
  if (!userStore.sessionId) {
    await userStore.initSession()
  }
  
  // 加载菜谱详情
  await loadRecipeDetail()
  
  // 加载推荐
  if (recipe.value) {
    await loadRecommendations()
  }
})
</script>

<style scoped>
.recipe-detail-page {
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

/* 内容区域 */
.recipe-content {
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 菜谱头部信息 */
.recipe-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.recipe-image {
  border-radius: 16px;
  overflow: hidden;
  height: 400px;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recipe-name {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
}

.recipe-description {
  font-size: 16px;
  line-height: 1.6;
  color: #6c757d;
  margin: 0;
}

.recipe-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.recipe-stats {
  display: flex;
  gap: 24px;
  color: #6c757d;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

/* 体质匹配度 */
.match-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.match-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.match-progress {
  margin-bottom: 12px;
}

.match-description {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

/* 各个内容区块 */
.nutrition-section,
.ingredients-section,
.steps-section,
.tips-section,
.recommendations-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nutrition-section h3,
.ingredients-section h3,
.steps-section h3,
.tips-section h3,
.recommendations-section h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
}

/* 营养信息 */
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.nutrition-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.nutrition-label {
  display: block;
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 8px;
}

.nutrition-value {
  display: block;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

/* 食材清单 */
.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.ingredient-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.ingredient-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ingredient-name {
  color: #2c3e50;
  font-weight: 500;
}

.ingredient-amount {
  color: #6c757d;
  font-size: 14px;
}

/* 烹饪步骤 */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-item {
  display: flex;
  gap: 16px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.step-image {
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.step-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 烹饪技巧 */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #fff3cd;
  border-radius: 8px;
  color: #856404;
}

.tip-item .el-icon {
  color: #ffc107;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 相关推荐 */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.recommendation-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.rec-image {
  height: 150px;
  overflow: hidden;
}

.rec-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .rec-image img {
  transform: scale(1.05);
}

.rec-info {
  padding: 16px;
}

.rec-info h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 16px;
}

.rec-info p {
  margin: 0 0 12px 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rec-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
  
  .container {
    padding: 0 16px;
  }
  
  .recipe-header {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .recipe-image {
    height: 250px;
  }
  
  .recipe-name {
    font-size: 24px;
  }
  
  .recipe-tags {
    gap: 8px;
  }
  
  .recipe-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .nutrition-grid,
  .ingredients-grid,
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .step-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .step-number {
    align-self: flex-start;
  }
}

/* 动画效果 */
.recipe-header,
.match-section,
.nutrition-section,
.ingredients-section,
.steps-section,
.tips-section,
.recommendations-section {
  animation: fadeInUp 0.6s ease-out;
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
