<template>
  <div class="recipe-recommendation">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">智能菜谱推荐</h1>
      <p class="page-subtitle">根据您的体质特点，为您精选最适合的食养方案</p>
    </div>

    <!-- 推荐理由 -->
    <el-alert
      v-if="recommendationReason"
      :title="recommendationReason"
      type="info"
      show-icon
      :closable="false"
      class="recommendation-alert"
    />

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="view-switch">
        <el-radio-group v-model="viewMode" size="default">
          <el-radio-button value="card">
            <el-icon><Grid /></el-icon>
            卡片视图
          </el-radio-button>
          <el-radio-button value="table">
            <el-icon><List /></el-icon>
            表格视图
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="goToAiRecommend">
          <el-icon><StarFilled /></el-icon>
          AI智能推荐
        </el-button>
        <el-button type="success" :loading="loading" @click="loadRecommendations">
          <el-icon v-if="!loading"><Refresh /></el-icon>
          {{ loading ? '加载中...' : '刷新推荐' }}
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p class="loading-text">正在为您推荐合适的菜谱...</p>
    </div>

    <!-- 错误状态 -->
    <el-result v-else-if="error" icon="error" title="加载失败" :sub-title="error">
      <template #extra>
        <el-button type="danger" @click="loadRecommendations">重试</el-button>
      </template>
    </el-result>

    <!-- 卡片视图 -->
    <div v-else-if="viewMode === 'card' && recipes.length > 0" class="card-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8" v-for="recipe in recipes" :key="recipe.id">
          <el-card class="recipe-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="recipe-title-wrapper">
                  <span class="recipe-emoji">{{ recipe.emoji || '🍽️' }}</span>
                  <span class="recipe-name">{{ recipe.name }}</span>
                </div>
                <div class="match-score">
                  <el-icon class="star-icon"><StarFilled /></el-icon>
                  <span>{{ recipe.matchScore }}分</span>
                </div>
              </div>
            </template>

            <!-- 匹配原因 -->
            <el-alert
              :title="recipe.matchReason"
              type="success"
              :closable="false"
              class="match-reason-alert"
            />

            <!-- 菜谱描述 -->
            <p class="recipe-description">{{ recipe.description }}</p>

            <!-- 标签 -->
            <div class="tag-container">
              <el-tag v-for="tag in recipe.tags.slice(0, 3)" :key="tag" size="small" type="primary">
                {{ tag }}
              </el-tag>
            </div>

            <!-- 基本信息 -->
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">时长</span>
                <span class="info-value">{{ recipe.cookingTime }}分钟</span>
              </div>
              <div class="info-item">
                <span class="info-label">难度</span>
                <span class="info-value">{{ recipe.difficulty }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">性质</span>
                <span class="info-value">{{ recipe.nature }}</span>
              </div>
            </div>

            <!-- 查看详情按钮 -->
            <div class="card-footer">
              <el-button type="primary" @click="viewRecipeDetail(recipe)" style="width: 100%">
                查看详情
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 表格视图 -->
    <div v-else-if="viewMode === 'table' && recipes.length > 0" class="table-container">
      <el-table :data="recipes" stripe style="width: 100%">
        <el-table-column label="菜谱名称" min-width="200">
          <template #default="{ row }">
            <div class="table-recipe-name">
              <span class="recipe-emoji">{{ row.emoji || '🍽️' }}</span>
              <div class="recipe-info">
                <div class="recipe-name">{{ row.name }}</div>
                <div class="recipe-desc-short">{{ row.description }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="匹配度" width="160">
          <template #default="{ row }">
            <div class="match-info">
              <div class="match-score-table">
                <el-icon class="star-icon"><StarFilled /></el-icon>
                <span>{{ row.matchScore }}分</span>
              </div>
              <div class="match-reason-text">{{ row.matchReason }}</div>
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
              <el-tag v-for="tag in row.tags.slice(0, 2)" :key="tag" size="small" type="primary">
                {{ tag }}
              </el-tag>
              <span v-if="row.tags.length > 2" class="more-tags">+{{ row.tags.length - 2 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewRecipeDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-else-if="!loading && !error && recipes.length === 0"
      description="暂无推荐菜谱，请稍后再试或完善您的体质信息"
    />

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

<style scoped></style>
