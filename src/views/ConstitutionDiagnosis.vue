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

<style scoped></style>
