<template>
  <div class="constitution-diagnosis">
    <el-container>
      <el-main class="custom-main">
        <div class="layout-container">
          <!-- 左侧体质列表 -->
          <div class="constitution-list-panel" v-loading="loading">
            <div class="panel-header">
              <h2>体质类型</h2>
            </div>
            <div class="constitution-list">
              <el-card
                v-for="constitution in constitutions"
                :key="constitution.type"
                class="constitution-card"
                :class="{ active: selectedConstitution?.type === constitution.type }"
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
                  <el-button
                    type="primary"
                    size="default"
                    @click.stop="setMyConstitution(constitution)"
                    :loading="constitution.loading"
                    class="set-constitution-btn"
                  >
                    <span class="btn-icon">💝</span>
                    设置成我的体质
                  </el-button>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 右侧详情区域 -->
          <div class="detail-panel">
            <div v-if="selectedConstitution" class="constitution-detail">
              <!-- 详情头部 -->
              <div class="detail-header">
                <div
                  class="detail-icon"
                  :style="{ backgroundColor: selectedConstitution.color || '#409EFF' }"
                >
                  <span class="detail-emoji">{{ selectedConstitution.icon }}</span>
                </div>
                <div class="detail-title">
                  <h2>{{ selectedConstitution.name }}</h2>
                  <p>{{ selectedConstitution.description }}</p>
                </div>
              </div>

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
                      <li
                        v-for="item in selectedConstitution.dietaryGuidelines.avoided"
                        :key="item"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 未选中体质时的占位提示 -->
            <div v-else class="detail-placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">📋</div>
                <h3>请选择一个体质类型</h3>
                <p>点击左侧的体质卡片查看详细信息</p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { constitutionApi } from '../api/index.js'
import { useUserStore } from '../stores/user.js'

// 使用用户store
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const constitutions = ref([])
const selectedConstitution = ref(null)

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
    } else {
      ElMessage.error(response.message || '获取体质详情失败')
    }
  } catch (error) {
    console.error('获取体质详情失败:', error)
    ElMessage.error('获取体质详情失败，请稍后重试')
  }
}

// 设置成我的体质
const setMyConstitution = async constitution => {
  try {
    // 设置该体质卡片的加载状态
    constitution.loading = true

    const success = await userStore.setConstitution(constitution.type, 'manual')

    if (success) {
      ElMessage.success(`已成功设置您的体质为：${constitution.name}`)
    } else {
      ElMessage.error('设置体质失败，请稍后重试')
    }
  } catch (error) {
    console.error('设置体质失败:', error)
    ElMessage.error('设置体质失败，请稍后重试')
  } finally {
    // 移除该体质卡片的加载状态
    constitution.loading = false
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

.layout-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 40px);
}

/* 左侧体质列表面板 */
.constitution-list-panel {
  flex: 0 0 25%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #409eff 0%, #0056b3 100%);
  color: white;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.3em;
  font-weight: 600;
}

.constitution-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.constitution-list::-webkit-scrollbar {
  width: 6px;
}

.constitution-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.constitution-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.constitution-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 右侧详情面板 */
.detail-panel {
  flex: 0 0 calc(75% - 20px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 详情头部样式 */
.detail-header {
  padding: 30px;
  background: linear-gradient(135deg, #409eff 0%, #0056b3 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 12px 12px 0 0;
}

.detail-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.detail-emoji {
  font-size: 48px;
  line-height: 1;
}

.detail-title h2 {
  margin: 0 0 10px 0;
  font-size: 2em;
  font-weight: 600;
}

.detail-title p {
  margin: 0;
  font-size: 1.1em;
  opacity: 0.9;
  line-height: 1.6;
}

/* 占位提示样式 */
.detail-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.placeholder-content {
  text-align: center;
  color: #909399;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.placeholder-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.3em;
  color: #606266;
}

.placeholder-content p {
  margin: 0;
  font-size: 1em;
  color: #909399;
}

.constitution-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
}

.constitution-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.constitution-card.active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.constitution-card.active .constitution-icon {
  transform: scale(1.1);
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
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
}

/* 设置体质按钮样式 */
.set-constitution-btn {
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.3);
}

.set-constitution-btn:hover {
  background: linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 90, 36, 0.4);
}

.set-constitution-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(238, 90, 36, 0.3);
}

.set-constitution-btn .btn-icon {
  font-size: 16px;
  line-height: 1;
}

.set-constitution-btn.is-loading {
  background: linear-gradient(135deg, #ffa502 0%, #ff6348 100%);
}

/* 详情内容样式 */
.constitution-detail {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

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

  .layout-container {
    flex-direction: column;
    height: auto;
    gap: 15px;
  }

  .constitution-list-panel {
    flex: none;
    width: 100%;
    max-height: 300px;
  }

  .detail-panel {
    flex: none;
    width: 100%;
    min-height: 400px;
  }

  .detail-header {
    padding: 20px;
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .detail-icon {
    width: 80px;
    height: 80px;
  }

  .detail-emoji {
    font-size: 36px;
  }

  .detail-title h2 {
    font-size: 1.5em;
  }

  .detail-title p {
    font-size: 1em;
  }

  .constitution-detail {
    padding: 20px;
  }

  .detail-section {
    margin-bottom: 20px;
  }

  .dietary-guidelines {
    grid-template-columns: 1fr;
  }

  .flavor-preference {
    grid-template-columns: 1fr;
  }

  .constitution-icon {
    width: 60px;
    height: 60px;
  }

  .constitution-emoji {
    font-size: 28px;
  }

  .card-header {
    padding: 15px 15px 8px;
  }

  .card-content {
    padding: 0 15px 12px;
  }

  .card-footer {
    padding: 12px 15px;
  }

  .set-constitution-btn {
    height: 40px;
    font-size: 13px;
  }

  .set-constitution-btn .btn-icon {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .constitution-diagnosis {
    padding: 5px;
  }

  .constitution-list-panel {
    max-height: 250px;
  }

  .panel-header {
    padding: 15px;
  }

  .panel-header h2 {
    font-size: 1.1em;
  }

  .constitution-list {
    padding: 15px;
  }

  .detail-placeholder {
    padding: 20px;
  }

  .placeholder-icon {
    font-size: 48px;
  }

  .placeholder-content h3 {
    font-size: 1.1em;
  }
}
</style>
