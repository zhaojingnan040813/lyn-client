<template>
  <div class="recipe-recommendation h-screen flex flex-col p-0">
    <!-- 页面标题 -->
    <div
      class="bg-white/90 backdrop-blur-md border-b border-food-cream/50 shadow-warm p-6 flex-shrink-0"
    >
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <div class="inline-flex items-center gap-3 mb-3">
            <div
              class="w-12 h-12 bg-gradient-to-br from-food-orange to-food-red rounded-full flex items-center justify-center shadow-food"
            >
              <span class="text-2xl">🍽️</span>
            </div>
            <h1 class="text-3xl font-bold text-food-brown font-title">至膳推荐</h1>
          </div>
          <p class="text-food-brown/70 text-lg">根据您的体质特点，为您精选最适合的食养方案</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 p-6 overflow-auto">
      <div class="max-w-7xl mx-auto">
        <!-- 推荐理由 -->
        <el-alert
          v-if="recommendationReason"
          :title="recommendationReason"
          type="info"
          show-icon
          :closable="false"
          class="recommendation-alert mb-6 food-card"
        />

        <!-- 操作栏 -->
        <div
          class="action-bar bg-white rounded-lg p-4 mb-6 shadow-warm flex items-center justify-between"
        >
          <div class="view-switch">
            <el-radio-group v-model="viewMode" size="default" class="food-radio-group">
              <el-radio-button value="card" class="food-radio-button">
                <el-icon><Grid /></el-icon>
                卡片视图
              </el-radio-button>
              <el-radio-button value="table" class="food-radio-button">
                <el-icon><List /></el-icon>
                表格视图
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="action-buttons flex gap-3">
            <el-button
              type="primary"
              @click="goToAiRecommend"
              class="shadow-food hover:shadow-food-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <el-icon><StarFilled /></el-icon>
              AI智能推荐
            </el-button>
            <el-button
              type="success"
              :loading="loading"
              @click="loadRecommendations"
              class="shadow-food hover:shadow-food-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <el-icon v-if="!loading"><Refresh /></el-icon>
              {{ loading ? '加载中...' : '刷新推荐' }}
            </el-button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div
          v-if="loading"
          class="loading-container flex flex-col items-center justify-center py-20"
        >
          <div
            class="w-16 h-16 bg-gradient-to-br from-food-orange to-food-red rounded-full flex items-center justify-center mb-4 animate-pulse-slow"
          >
            <span class="text-3xl">⏳</span>
          </div>
          <p class="loading-text text-food-brown/70 text-lg">正在为您推荐合适的菜谱...</p>
        </div>

        <!-- 错误状态 -->
        <el-result
          v-else-if="error"
          icon="error"
          title="加载失败"
          :sub-title="error"
          class="food-card"
        >
          <template #extra>
            <el-button type="danger" @click="loadRecommendations" class="shadow-food">
              重试
            </el-button>
          </template>
        </el-result>

        <!-- 卡片视图 -->
        <div v-else-if="viewMode === 'card' && recipes.length > 0" class="card-container">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :lg="8" v-for="recipe in recipes" :key="recipe.id">
              <el-card class="recipe-card food-card food-card-hover" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <div class="recipe-title-wrapper">
                      <span class="recipe-emoji text-2xl">{{ recipe.emoji || '🍽️' }}</span>
                      <span class="recipe-name">{{ recipe.name }}</span>
                    </div>
                    <div class="match-score">
                      <el-icon class="star-icon text-food-orange"><StarFilled /></el-icon>
                      <span class="text-food-brown font-semibold">{{ recipe.matchScore }}分</span>
                    </div>
                  </div>
                </template>

                <!-- 匹配原因 -->
                <el-alert
                  :title="recipe.matchReason"
                  type="success"
                  :closable="false"
                  class="match-reason-alert mb-3"
                />

                <!-- 菜谱描述 -->
                <p class="recipe-description text-food-brown/80 mb-4">{{ recipe.description }}</p>

                <!-- 标签 -->
                <div class="tag-container mb-4">
                  <el-tag
                    v-for="tag in recipe.tags.slice(0, 3)"
                    :key="tag"
                    size="small"
                    type="primary"
                    class="mr-2"
                  >
                    {{ tag }}
                  </el-tag>
                </div>

                <!-- 基本信息 -->
                <div class="info-grid mb-4">
                  <div class="info-item">
                    <span class="info-label text-food-brown/60">⏱️ 时长</span>
                    <span class="info-value text-food-brown font-medium">
                      {{ recipe.cookingTime }}分钟
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label text-food-brown/60">📊 难度</span>
                    <span class="info-value text-food-brown font-medium">
                      {{ recipe.difficulty }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label text-food-brown/60">🌡️ 性质</span>
                    <span class="info-value text-food-brown font-medium">{{ recipe.nature }}</span>
                  </div>
                </div>

                <!-- 查看详情按钮 -->
                <div class="card-footer">
                  <el-button
                    type="primary"
                    @click="viewRecipeDetail(recipe)"
                    class="w-full shadow-food hover:shadow-food-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    查看详情
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 表格视图 -->
        <div
          v-else-if="viewMode === 'table' && recipes.length > 0"
          class="table-container food-card"
        >
          <el-table :data="recipes" stripe class="w-full">
            <el-table-column label="菜谱名称" min-width="200">
              <template #default="{ row }">
                <div class="table-recipe-name">
                  <span class="recipe-emoji text-xl">{{ row.emoji || '🍽️' }}</span>
                  <div class="recipe-info">
                    <div class="recipe-name font-medium text-food-brown">{{ row.name }}</div>
                    <div class="recipe-desc-short text-food-brown/70 text-sm">
                      {{ row.description }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="匹配度" width="160">
              <template #default="{ row }">
                <div class="match-info">
                  <div class="match-score-table">
                    <el-icon class="star-icon text-food-orange"><StarFilled /></el-icon>
                    <span class="text-food-brown font-medium">{{ row.matchScore }}分</span>
                  </div>
                  <div class="match-reason-text text-food-brown/70 text-sm">
                    {{ row.matchReason }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="cookingTime" label="烹饪时间" width="100">
              <template #default="{ row }">{{ row.cookingTime }}分钟</template>
            </el-table-column>
            <el-table-column label="难度" width="80">
              <template #default="{ row }">
                <el-tag :type="getDifficultyType(row.difficulty)" size="small">
                  {{ row.difficulty }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="性质" width="80">
              <template #default="{ row }">
                <el-tag :type="getNatureType(row.nature)" size="small">
                  {{ row.nature }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标签" min-width="150">
              <template #default="{ row }">
                <div class="tag-container-table">
                  <el-tag
                    v-for="tag in row.tags.slice(0, 2)"
                    :key="tag"
                    size="small"
                    type="primary"
                    class="mr-1"
                  >
                    {{ tag }}
                  </el-tag>
                  <span v-if="row.tags.length > 2" class="more-tags text-food-brown/60">
                    +{{ row.tags.length - 2 }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  @click="viewRecipeDetail(row)"
                  class="text-food-orange hover:text-food-red"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-else-if="!loading && !error && recipes.length === 0"
          description="暂无推荐菜谱，请稍后再试或完善您的体质信息"
          class="food-card"
        />
      </div>
    </div>

    <!-- 菜谱详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentRecipe?.name || '菜谱详情'"
      width="700px"
      destroy-on-close
    >
      <div v-loading="detailLoading" class="recipe-detail">
        <template v-if="recipeDetail">
          <!-- 基本信息 -->
          <div class="detail-section">
            <div class="detail-header">
              <span class="detail-emoji">{{ recipeDetail.emoji || '🍽️' }}</span>
              <h2 class="detail-title">{{ recipeDetail.name }}</h2>
            </div>
            <p class="detail-description">{{ recipeDetail.description }}</p>
          </div>

          <!-- 匹配信息 -->
          <el-alert
            v-if="recipeDetail.matchReason"
            :title="`匹配度: ${recipeDetail.matchScore}分 - ${recipeDetail.matchReason}`"
            type="success"
            :closable="false"
            class="detail-alert"
          />

          <!-- 属性信息 -->
          <el-descriptions :column="3" border class="detail-descriptions">
            <el-descriptions-item label="性质">{{ recipeDetail.nature }}</el-descriptions-item>
            <el-descriptions-item label="难度">{{ recipeDetail.difficulty }}</el-descriptions-item>
            <el-descriptions-item label="烹饪时间">
              {{ recipeDetail.cookingTime }}分钟
            </el-descriptions-item>
            <el-descriptions-item label="分类">{{ recipeDetail.category }}</el-descriptions-item>
            <el-descriptions-item label="口味" :span="2">
              <el-tag
                v-for="flavor in recipeDetail.flavors"
                :key="flavor"
                size="small"
                class="flavor-tag"
              >
                {{ flavor }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="归经" :span="3">
              {{ recipeDetail.meridianText || recipeDetail.meridians?.join('、') }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- 适宜体质 -->
          <div class="detail-section" v-if="recipeDetail.suitableConstitutions?.length">
            <h3 class="section-title">适宜体质</h3>
            <div class="constitution-tags">
              <el-tag v-for="c in recipeDetail.suitableConstitutions" :key="c" type="success">
                {{ c }}
              </el-tag>
            </div>
          </div>

          <!-- 不适宜体质 -->
          <div class="detail-section" v-if="recipeDetail.avoidConstitutions?.length">
            <h3 class="section-title">不适宜体质</h3>
            <div class="constitution-tags">
              <el-tag v-for="c in recipeDetail.avoidConstitutions" :key="c" type="danger">
                {{ c }}
              </el-tag>
            </div>
          </div>

          <!-- 标签 -->
          <div class="detail-section" v-if="recipeDetail.tags?.length">
            <h3 class="section-title">标签</h3>
            <div class="tag-list">
              <el-tag v-for="tag in recipeDetail.tags" :key="tag" type="primary">
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 食材 -->
          <div class="detail-section" v-if="recipeDetail.ingredients?.length">
            <h3 class="section-title">食材</h3>
            <el-table :data="recipeDetail.ingredients" stripe size="small">
              <el-table-column label="食材" prop="name">
                <template #default="{ row }">
                  <span v-if="row.icon">{{ row.icon }}</span>
                  {{ row.name }}
                </template>
              </el-table-column>
              <el-table-column label="用量" prop="amount" />
            </el-table>
          </div>

          <!-- 做法步骤 -->
          <div class="detail-section" v-if="recipeDetail.steps?.length">
            <h3 class="section-title">做法步骤</h3>
            <el-steps direction="vertical" :active="recipeDetail.steps.length">
              <el-step
                v-for="step in recipeDetail.steps"
                :key="step.order"
                :title="`步骤 ${step.order}`"
                :description="step.content"
              />
            </el-steps>
          </div>

          <!-- 食养分析 -->
          <div class="detail-section" v-if="recipeDetail.analysis">
            <h3 class="section-title">食养分析</h3>
            <el-alert :title="recipeDetail.analysis" type="info" :closable="false" />
          </div>
        </template>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { recipeApi } from '@/api/recipe'
import { ElMessage } from 'element-plus'
// import { Grid, List, Refresh, Loading, StarFilled, StarFilled } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const recipes = ref([])
const loading = ref(false)
const error = ref('')
const viewMode = ref('card') // 'card' | 'table'
const recommendationReason = ref('')

// 详情相关
const detailDialogVisible = ref(false)
const detailLoading = ref(false)
const currentRecipe = ref(null)
const recipeDetail = ref(null)

// 加载推荐菜谱
const loadRecommendations = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await recipeApi.getRecommendedRecipes(10)

    if (response.code === 0) {
      recipes.value = response.data.list || []
      recommendationReason.value = response.data.reason || ''
    } else {
      error.value = response.message || '获取推荐菜谱失败'
    }
  } catch (err) {
    console.error('获取推荐菜谱失败:', err)
    error.value = '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 查看菜谱详情
const viewRecipeDetail = async recipe => {
  currentRecipe.value = recipe
  detailDialogVisible.value = true
  detailLoading.value = true
  recipeDetail.value = null

  try {
    const response = await recipeApi.getRecipeById(recipe.id)
    if (response.code === 0) {
      recipeDetail.value = response.data
    } else {
      ElMessage.error(response.message || '获取菜谱详情失败')
    }
  } catch (err) {
    console.error('获取菜谱详情失败:', err)
    ElMessage.error('获取菜谱详情失败，请稍后重试')
  } finally {
    detailLoading.value = false
  }
}

// 获取难度标签类型
const getDifficultyType = difficulty => {
  switch (difficulty) {
    case '简单':
      return 'success'
    case '中等':
      return 'warning'
    case '困难':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取性质标签类型
const getNatureType = nature => {
  switch (nature) {
    case '平':
      return 'info'
    case '温':
      return 'danger'
    case '凉':
      return 'primary'
    default:
      return 'success'
  }
}

// 跳转到AI智能推荐页面
const goToAiRecommend = () => {
  window.open(router.resolve('/ai-recipe-recommend').href, '_blank')
}

// 页面加载时获取推荐菜谱
onMounted(() => {
  loadRecommendations()
})
</script>

<style scoped>
/* 食物主题样式覆盖 */
:deep(.el-alert) {
  border-radius: 12px;
}

:deep(.el-alert__title) {
  font-weight: 600;
}

:deep(.el-radio-group) {
  background: transparent;
}

:deep(.el-radio-button__inner) {
  background: white;
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: var(--food-brown);
  font-weight: 500;
}

:deep(.el-radio-button__original:hover .el-radio-button__inner) {
  border-color: var(--food-primary);
  background: rgba(255, 107, 53, 0.1);
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: var(--food-gradient);
  border-color: var(--food-primary);
  color: white;
}

:deep(.el-result) {
  background: white;
  border-radius: 16px;
}

:deep(.el-empty) {
  background: white;
  border-radius: 16px;
}

:deep(.el-table) {
  background: white;
  border-radius: 12px;
}

:deep(.el-table th) {
  background: linear-gradient(135deg, rgba(255, 249, 196, 0.3), rgba(255, 236, 179, 0.2));
  color: var(--food-brown);
  font-weight: 600;
}

:deep(.el-table tr:hover > td) {
  background: rgba(255, 107, 53, 0.05);
}

/* 卡片布局样式 */
.card-container {
  animation: fadeInUp 0.6s ease-out;
}

.table-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recipe-recommendation {
    padding: 0;
  }

  .action-bar {
    flex-direction: column;
    gap: 1rem;
  }

  .action-buttons {
    width: 100%;
    justify-content: stretch;
  }
}

/* 卡片内容样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recipe-emoji {
  font-size: 1.5rem;
}

.recipe-name {
  font-weight: 600;
  color: var(--food-brown);
}

.match-score {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star-icon {
  color: var(--food-orange);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 249, 196, 0.5);
}

.info-label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 600;
  color: var(--food-brown);
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.table-recipe-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.recipe-info {
  flex: 1;
}

.match-info {
  text-align: center;
}

.match-score-table {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.match-reason-text {
  font-size: 0.875rem;
  color: var(--food-brown);
  opacity: 0.8;
}

.tag-container-table {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.more-tags {
  font-size: 0.875rem;
  color: var(--food-brown);
  opacity: 0.6;
}

/* 滚动条美化 */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(255, 249, 196, 0.2);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--food-orange), var(--food-red));
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--food-red), var(--food-orange));
}
</style>
