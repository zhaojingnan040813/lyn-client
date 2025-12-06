<template>
  <div class="constitution-diagnosis">
    <el-container>
      <el-main class="custom-main">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>中医体质诊断</h1>
          <p>了解您的体质类型，获得个性化的膳食建议</p>
        </div>

        <!-- 体质列表 -->
        <div class="constitution-list" v-loading="loading">
          <el-row :gutter="20">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              v-for="constitution in constitutions"
              :key="constitution.type"
            >
              <el-card
                class="constitution-card"
                @click="viewConstitutionDetail(constitution.type)"
                shadow="hover"
              >
                <div class="card-header">
                  <div
                    class="constitution-icon"
                    :style="{ backgroundColor: constitution.color || '#409EFF' }"
                  >
                    <span class="constitution-emoji">{{ constitution.icon }}</span>
                  </div>
                  <h3>{{ constitution.name }}</h3>
                </div>
                <div class="card-content">
                  <p class="constitution-desc">{{ constitution.description }}</p>
                  <div class="characteristics">
                    <el-tag
                      v-for="char in constitution.characteristics?.slice(0, 3)"
                      :key="char"
                      size="small"
                      type="info"
                    >
                      {{ char }}
                    </el-tag>
                  </div>
                </div>
                <div class="card-footer">
                  <el-button type="primary" size="small" text>查看详情 →</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 体质详情对话框 -->
        <el-dialog
          v-model="detailDialogVisible"
          :title="selectedConstitution?.name"
          width="80%"
          max-width="800px"
          destroy-on-close
        >
          <div v-if="selectedConstitution" class="constitution-detail">
            <!-- 基本信息 -->
            <div class="detail-section">
              <h3>体质介绍</h3>
              <p class="description">{{ selectedConstitution.description }}</p>
            </div>

            <!-- 体质特征 -->
            <div class="detail-section">
              <h3>体质特征</h3>
              <div class="characteristics-list">
                <el-tag
                  v-for="char in selectedConstitution.characteristics"
                  :key="char"
                  class="characteristic-tag"
                  size="medium"
                >
                  {{ char }}
                </el-tag>
              </div>
            </div>

            <!-- 推荐食材 -->
            <div class="detail-section">
              <h3>推荐食材</h3>
              <div class="ingredients-grid">
                <el-tag
                  v-for="ingredient in selectedConstitution.recommendedIngredients"
                  :key="ingredient"
                  class="ingredient-tag"
                  type="success"
                  effect="light"
                >
                  {{ ingredient }}
                </el-tag>
              </div>
            </div>

            <!-- 口味偏好 -->
            <div class="detail-section">
              <h3>口味偏好</h3>
              <div class="flavor-preference">
                <div
                  class="flavor-item"
                  v-for="(value, key) in selectedConstitution.flavorPreference"
                  :key="key"
                >
                  <span class="flavor-name">{{ getFlavorName(key) }}:</span>
                  <el-rate
                    :model-value="getFlavorScore(value)"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                    :max="5"
                  />
                </div>
              </div>
            </div>

            <!-- 膳食指南 -->
            <div class="detail-section">
              <h3>膳食指南</h3>
              <div class="dietary-guidelines">
                <div class="guideline-section">
                  <h4>
                    <span class="indicator indicator-success">✓</span>
                    推荐食物
                  </h4>
                  <ul>
                    <li
                      v-for="item in selectedConstitution.dietaryGuidelines.recommended"
                      :key="item"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="guideline-section">
                  <h4>
                    <span class="indicator indicator-danger">✗</span>
                    避免食物
                  </h4>
                  <ul>
                    <li v-for="item in selectedConstitution.dietaryGuidelines.avoided" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <el-button @click="detailDialogVisible = false">关闭</el-button>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { constitutionApi } from '../api/index.js'

// 响应式数据
const loading = ref(false)
const constitutions = ref([])
const selectedConstitution = ref(null)
const detailDialogVisible = ref(false)

// 获取口味名称
const getFlavorName = key => {
  const flavorMap = {
    sour: '酸',
    sweet: '甜',
    bitter: '苦',
    spicy: '辣',
    salty: '咸'
  }
  return flavorMap[key] || key
}

// 将API返回的口味数值转换为0-5的范围
const getFlavorScore = value => {
  // 假设API返回的值是20-80的范围，转换为0-5的范围
  // 例如：20->0, 30->1, 40->2, 50->2.5, 60->3, 70->4, 80->5
  return Math.round((value - 20) / 12)
}

// 获取所有体质类型
const fetchConstitutions = async () => {
  loading.value = true
  try {
    const response = await constitutionApi.getConstitutions()
    console.log('体质列表响应:', response.data)
    if (response.code === 0) {
      constitutions.value = response.data.sort((a, b) => a.sortOrder - b.sortOrder)
    } else {
      ElMessage.error(response.message || '获取体质列表失败')
    }
  } catch (error) {
    console.error('获取体质列表失败:', error)
    ElMessage.error('获取体质列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 查看体质详情
const viewConstitutionDetail = async type => {
  try {
    const response = await constitutionApi.getConstitutionByType(type)
    console.log('体质详情响应:', response)
    if (response.code === 0) {
      selectedConstitution.value = response.data
      detailDialogVisible.value = true
    } else {
      ElMessage.error(response.message || '获取体质详情失败')
    }
  } catch (error) {
    console.error('获取体质详情失败:', error)
    ElMessage.error('获取体质详情失败，请稍后重试')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchConstitutions()
})
</script>

<style scoped>
.constitution-diagnosis {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  color: #303133;
  margin-bottom: 10px;
  font-size: 2.5em;
}

.page-header p {
  color: #606266;
  font-size: 1.1em;
  margin: 0;
}

.constitution-list {
  margin-bottom: 40px;
}

.constitution-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.constitution-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  text-align: center;
  padding: 20px 20px 10px;
}

.constitution-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-size: 32px;
  font-weight: bold;
}

.constitution-emoji {
  font-size: 36px;
  line-height: 1;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 1.3em;
  font-weight: 600;
}

.card-content {
  padding: 0 20px 15px;
}

.constitution-desc {
  color: #606266;
  font-size: 0.9em;
  line-height: 1.6;
  margin-bottom: 15px;
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.characteristics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
}

.card-footer {
  text-align: center;
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
}

/* 详情对话框样式 */
.constitution-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  color: #303133;
  margin-bottom: 15px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.description {
  color: #606266;
  line-height: 1.8;
  font-size: 1.05em;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.characteristics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.characteristic-tag {
  margin: 0;
  font-size: 0.9em;
  padding: 8px 12px;
}

.ingredients-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ingredient-tag {
  margin: 0;
  font-size: 0.9em;
  padding: 6px 10px;
}

.flavor-preference {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.flavor-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.flavor-name {
  font-weight: 500;
  color: #303133;
  min-width: 40px;
}

.dietary-guidelines {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.guideline-section h4 {
  color: #303133;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1em;
}

.indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
}

.indicator-success {
  background-color: #67c23a;
}

.indicator-danger {
  background-color: #f56c6c;
}

.guideline-section ul {
  margin: 0;
  padding-left: 20px;
}

.guideline-section li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.6;
}

.guideline-section li:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .constitution-diagnosis {
    padding: 10px;
  }

  .page-header {
    padding: 15px;
    margin-bottom: 20px;
  }

  .page-header h1 {
    font-size: 2em;
  }

  .dietary-guidelines {
    grid-template-columns: 1fr;
  }

  .flavor-preference {
    grid-template-columns: 1fr;
  }
}

/* 滚动条样式 */
.constitution-detail::-webkit-scrollbar {
  width: 6px;
}

.constitution-detail::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.constitution-detail::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.constitution-detail::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
