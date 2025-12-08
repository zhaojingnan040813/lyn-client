<template>
  <div class="ai-recipe-recommend">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">AI智能推荐</h1>
      <p class="page-subtitle">根据您的个性化需求，AI为您精准推荐最适合的菜品</p>
    </div>

    <!-- 推荐表单 -->
    <el-card class="form-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><StarFilled /></el-icon>
          <span class="header-title">推荐设置</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="left"
      >
        <!-- 用餐类型 -->
        <el-form-item label="用餐类型" prop="mealType">
          <el-radio-group v-model="formData.mealType" size="large">
            <el-radio-button value="breakfast">
              <el-icon><Sunrise /></el-icon>
              早餐
            </el-radio-button>
            <el-radio-button value="lunch">
              <el-icon><Sunny /></el-icon>
              午餐
            </el-radio-button>
            <el-radio-button value="dinner">
              <el-icon><Moon /></el-icon>
              晚餐
            </el-radio-button>
            <el-radio-button value="snack">
              <el-icon><Coffee /></el-icon>
              加餐
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 推荐数量 -->
        <el-form-item label="推荐数量" prop="count">
          <el-input-number
            v-model="formData.count"
            :min="1"
            :max="6"
            :step="1"
            controls-position="right"
            style="width: 200px"
          />
          <span class="form-tip">目前就只生成一个菜品,后续会优化</span>
        </el-form-item>

        <!-- 排除食材 -->
        <el-form-item label="排除食材">
          <div class="exclude-ingredients-container">
            <div class="ingredient-input-area">
              <el-input
                v-model="currentIngredient"
                placeholder="输入要排除的食材，按回车添加"
                @keyup.enter="addIngredient"
                clearable
                style="width: 300px; margin-bottom: 12px"
              >
                <template #append>
                  <el-button @click="addIngredient" :disabled="!currentIngredient.trim()">
                    添加
                  </el-button>
                </template>
              </el-input>
            </div>
            <div class="ingredient-tags">
              <el-tag
                v-for="(ingredient, index) in formData.excludeIngredients"
                :key="index"
                closable
                @close="removeIngredient(index)"
                type="danger"
                class="ingredient-tag"
              >
                {{ ingredient }}
              </el-tag>
              <span v-if="formData.excludeIngredients.length === 0" class="no-ingredients">
                暂无排除食材
              </span>
            </div>
          </div>
        </el-form-item>

        <!-- 特殊要求 -->
        <el-form-item label="特殊要求">
          <el-input
            v-model="formData.specialRequirements"
            type="textarea"
            :rows="4"
            placeholder="请输入您的特殊要求，如：希望菜品清淡易消化、适合儿童食用、低卡路里等"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="submitForm"
            style="width: 200px"
          >
            <el-icon v-if="!loading"><StarFilled /></el-icon>
            {{ loading ? 'AI推荐中...' : '开始AI推荐' }}
          </el-button>
          <el-button size="large" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 推荐结果 -->
    <div v-if="recommendations.length > 0" class="results-section">
      <!-- AI分析报告 -->
      <el-card class="analysis-card" shadow="hover" v-if="aiAnalysis">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Document /></el-icon>
            <span class="header-title">AI智能分析报告</span>
          </div>
        </template>

        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="用户画像" name="profile">
            <div class="analysis-content">
              <p>{{ aiAnalysis.userProfile }}</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="推荐策略" name="strategy">
            <div class="analysis-content">
              <p>{{ aiAnalysis.recommendStrategy }}</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="营养建议" name="nutrition">
            <div class="analysis-content">
              <p>{{ aiAnalysis.nutritionBalance }}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 推荐菜品列表 -->
      <el-card class="recipes-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Food /></el-icon>
            <span class="header-title">为您推荐 {{ recommendations.length }} 道菜品</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="8" v-for="recipe in recommendations" :key="recipe.id">
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

              <!-- AI推荐理由 -->
              <el-alert
                v-if="recipe.aiRecommendation?.reason"
                :title="recipe.aiRecommendation.reason"
                type="success"
                :closable="false"
                class="ai-reason-alert"
              />

              <!-- 菜谱描述 -->
              <p class="recipe-description">{{ recipe.description }}</p>

              <!-- 营养标签 -->
              <div class="nutrition-tags" v-if="recipe.aiRecommendation?.nutritionTags">
                <el-tag
                  v-for="tag in recipe.aiRecommendation.nutritionTags.slice(0, 3)"
                  :key="tag"
                  size="small"
                  type="success"
                  class="nutrition-tag"
                >
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

              <!-- 最佳用餐时间 -->
              <div class="best-meal-time" v-if="recipe.aiRecommendation?.bestMealTime">
                <el-icon><Clock /></el-icon>
                <span>最佳用餐时间：{{ recipe.aiRecommendation.bestMealTime }}</span>
              </div>

              <!-- 季节建议 -->
              <div class="seasonal-advice" v-if="recipe.aiRecommendation?.seasonalAdvice">
                <el-icon><Sunny /></el-icon>
                <span>{{ recipe.aiRecommendation.seasonalAdvice }}</span>
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
      </el-card>
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

          <!-- AI推荐信息 -->
          <div class="detail-section" v-if="recipeDetail.aiRecommendation">
            <h3 class="section-title">AI推荐理由</h3>
            <el-alert
              :title="recipeDetail.aiRecommendation.reason"
              type="success"
              :closable="false"
              class="detail-alert"
            />
          </div>

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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { recipeApi } from '@/api/recipe'
import { ElMessage } from 'element-plus'
// import {
//   StarFilled,
//   Sunrise,
//   Sunny,
//   Moon,
//   Coffee,
//   Document,
//   Food,
//   StarFilled,
//   Clock
// } from '@element-plus/icons-vue'

const router = useRouter()

// 表单相关
const formRef = ref()
const loading = ref(false)
const currentIngredient = ref('')
const activeTab = ref('profile')

// 表单数据
const formData = reactive({
  mealType: 'dinner',
  count: 6,
  excludeIngredients: [],
  specialRequirements: ''
})

// 表单验证规则
const formRules = {
  mealType: [{ required: true, message: '请选择用餐类型', trigger: 'change' }],
  count: [
    { required: true, message: '请输入推荐数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 20, message: '推荐数量应在1-20之间', trigger: 'blur' }
  ]
}

// 推荐结果
const recommendations = ref([])
const aiAnalysis = ref(null)

// 详情相关
const detailDialogVisible = ref(false)
const detailLoading = ref(false)
const currentRecipe = ref(null)
const recipeDetail = ref(null)

// 添加排除食材
const addIngredient = () => {
  const ingredient = currentIngredient.value.trim()
  if (ingredient && !formData.excludeIngredients.includes(ingredient)) {
    formData.excludeIngredients.push(ingredient)
    currentIngredient.value = ''
  }
}

// 移除排除食材
const removeIngredient = index => {
  formData.excludeIngredients.splice(index, 1)
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const requestData = {
      mealType: formData.mealType,
      count: formData.count
    }

    // 只有当有值时才添加排除食材
    if (formData.excludeIngredients.length > 0) {
      requestData.excludeIngredients = formData.excludeIngredients
    }

    // 只有当有值时才添加特殊要求
    if (formData.specialRequirements.trim()) {
      requestData.specialRequirements = formData.specialRequirements.trim()
    }

    const response = await recipeApi.aiRecommendRecipes(requestData)

    if (response.code === 0) {
      recommendations.value = response.data.list || []
      aiAnalysis.value = response.data.aiAnalysis || null
      ElMessage.success('AI推荐成功！')
    } else {
      ElMessage.error(response.message || 'AI推荐失败')
    }
  } catch (error) {
    console.error('AI推荐失败:', error)
    ElMessage.error('AI推荐失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.excludeIngredients = []
  currentIngredient.value = ''
  recommendations.value = []
  aiAnalysis.value = null
}

// 查看菜谱详情
const viewRecipeDetail = recipe => {
  currentRecipe.value = recipe
  detailDialogVisible.value = true
  detailLoading.value = false // 直接使用已有数据，无需加载
  recipeDetail.value = recipe // 直接使用从AI推荐接口获得的完整数据
}
</script>

<style scoped>
.ai-recipe-recommend {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #e53935;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 表单卡片 */
.form-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 18px;
  margin-right: 8px;
  color: #409eff;
}

.header-title {
  font-weight: 600;
  color: #303133;
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}

/* 排除食材 */
.exclude-ingredients-container {
  width: 100%;
}

.ingredient-input-area {
  margin-bottom: 12px;
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
}

.ingredient-tag {
  margin: 0;
}

.no-ingredients {
  color: #c0c4cc;
  font-size: 14px;
}

/* 结果区域 */
.results-section {
  margin-top: 24px;
}

.analysis-card {
  margin-bottom: 20px;
}

.analysis-content {
  line-height: 1.8;
  color: #606266;
  font-size: 14px;
}

.recipes-card {
  margin-bottom: 20px;
}

/* 菜谱卡片 */
.recipe-card {
  margin-bottom: 20px;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
}

.recipe-title-wrapper {
  display: flex;
  align-items: center;
}

.recipe-emoji {
  font-size: 24px;
  margin-right: 8px;
}

.recipe-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.match-score {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.star-icon {
  color: #f7ba2a;
  margin-right: 4px;
}

.ai-reason-alert {
  margin-bottom: 12px;
}

.recipe-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nutrition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.nutrition-tag {
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.info-value {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.best-meal-time,
.seasonal-advice {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #67c23a;
  margin-bottom: 8px;
}

.best-meal-time .el-icon,
.seasonal-advice .el-icon {
  margin-right: 4px;
}

.card-footer {
  padding-top: 8px;
}

/* 详情对话框 */
.recipe-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.detail-emoji {
  font-size: 36px;
  margin-right: 12px;
}

.detail-title {
  font-size: 22px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.detail-description {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.detail-alert {
  margin-bottom: 20px;
}

.detail-descriptions {
  margin-bottom: 20px;
}

.flavor-tag {
  margin-right: 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-recipe-recommend {
    padding: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .info-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .ingredient-input-area .el-input {
    width: 100% !important;
  }
}
</style>
