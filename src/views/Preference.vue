<template>
  <div class="preference-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h1>偏好设置</h1>
        </div>
        <div class="header-right">
          <el-button @click="resetPreference" :disabled="loading">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
          <el-button type="primary" @click="savePreference" :loading="loading">
            <el-icon><Check /></el-icon>
            保存
          </el-button>
        </div>
      </div>
    </div>

    <div class="preference-content">
      <div class="container">
        <!-- 五味偏好 -->
        <div class="preference-section">
          <div class="section-header">
            <h2>五味偏好</h2>
            <p>调整您对不同口味偏好程度</p>
          </div>
          
          <div class="flavor-preferences">
            <div class="flavor-item" v-for="(value, flavor) in flavorPreference" :key="flavor">
              <div class="flavor-info">
                <span class="flavor-name">{{ getFlavorName(flavor) }}</span>
                <span class="flavor-icon">{{ getFlavorIcon(flavor) }}</span>
              </div>
              <el-slider
                v-model="flavorPreference[flavor]"
                :min="0"
                :max="200"
                :step="10"
                :show-tooltip="false"
                @change="onFlavorChange"
              />
              <span class="flavor-value">{{ flavorPreference[flavor] }}%</span>
            </div>
          </div>
        </div>

        <!-- 饮食禁忌 -->
        <div class="preference-section">
          <div class="section-header">
            <h2>饮食禁忌</h2>
            <p>选择您的饮食限制</p>
          </div>
          
          <div class="restriction-options">
            <el-checkbox-group v-model="preference.dietaryRestrictions">
              <div class="restriction-grid">
                <div 
                  v-for="restriction in dietaryRestrictions" 
                  :key="restriction.value"
                  class="restriction-item"
                >
                  <el-checkbox :label="restriction.value">
                    <div class="restriction-content">
                      <span class="restriction-icon">{{ restriction.icon }}</span>
                      <span class="restriction-name">{{ restriction.name }}</span>
                    </div>
                  </el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 身体状态 -->
        <div class="preference-section">
          <div class="section-header">
            <h2>当前身体状态</h2>
            <p>选择您当前的身体状况（可多选）</p>
          </div>
          
          <div class="condition-options">
            <el-checkbox-group v-model="preference.currentConditions">
              <div class="condition-grid">
                <div 
                  v-for="condition in currentConditions" 
                  :key="condition.value"
                  class="condition-item"
                >
                  <el-checkbox :label="condition.value">
                    <div class="condition-content">
                      <span class="condition-icon">{{ condition.icon }}</span>
                      <span class="condition-name">{{ condition.name }}</span>
                    </div>
                  </el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 用餐场景 -->
        <div class="preference-section">
          <div class="section-header">
            <h2>用餐场景</h2>
            <p>选择您的常用用餐场景</p>
          </div>
          
          <div class="scenario-options">
            <el-checkbox-group v-model="preference.mealScenarios">
              <div class="scenario-grid">
                <div 
                  v-for="scenario in mealScenarios" 
                  :key="scenario.value"
                  class="scenario-item"
                >
                  <el-checkbox :label="scenario.value">
                    <div class="scenario-content">
                      <span class="scenario-icon">{{ scenario.icon }}</span>
                      <span class="scenario-name">{{ scenario.name }}</span>
                    </div>
                  </el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 烹饪设置 -->
        <div class="preference-section">
          <div class="section-header">
            <h2>烹饪设置</h2>
            <p>设置您的烹饪偏好</p>
          </div>
          
          <div class="cooking-settings">
            <div class="setting-item">
              <label class="setting-label">烹饪难度</label>
              <el-radio-group v-model="preference.cookingDifficulty">
                <el-radio :label="1">简单</el-radio>
                <el-radio :label="2">中等</el-radio>
                <el-radio :label="3">困难</el-radio>
              </el-radio-group>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">最大烹饪时间（分钟）</label>
              <el-input-number
                v-model="preference.maxCookingTime"
                :min="10"
                :max="180"
                :step="10"
                :controls-position="'right'"
              />
            </div>
          </div>
        </div>

        <!-- 过敏信息 -->
        <div class="preference-section">
          <div class="section-header">
            <h2>过敏信息</h2>
            <p>添加您的过敏食材（可选）</p>
          </div>
          
          <div class="allergy-section">
            <div class="allergy-input">
              <el-input
                v-model="newAllergy"
                placeholder="输入过敏食材，按回车添加"
                @keyup.enter="addAllergy"
                clearable
              >
                <template #append>
                  <el-button @click="addAllergy">添加</el-button>
                </template>
              </el-input>
            </div>
            
            <div class="allergy-tags" v-if="preference.allergies.length > 0">
              <el-tag
                v-for="(allergy, index) in preference.allergies"
                :key="index"
                closable
                @close="removeAllergy(index)"
                type="danger"
              >
                {{ allergy }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 不喜欢的食材 -->
        <div class="preference-section">
          <div class="section-header">
            <h2>不喜欢的食材</h2>
            <p>添加您不喜欢的食材（可选）</p>
          </div>
          
          <div class="disliked-section">
            <div class="disliked-input">
              <el-input
                v-model="newDisliked"
                placeholder="输入不喜欢的食材，按回车添加"
                @keyup.enter="addDisliked"
                clearable
              >
                <template #append>
                  <el-button @click="addDisliked">添加</el-button>
                </template>
              </el-input>
            </div>
            
            <div class="disliked-tags" v-if="preference.dislikedIngredients.length > 0">
              <el-tag
                v-for="(ingredient, index) in preference.dislikedIngredients"
                :key="index"
                closable
                @close="removeDisliked(index)"
                type="warning"
              >
                {{ ingredient }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { usePreferenceStore } from '../stores/preference'
import { ArrowLeft, RefreshLeft, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const preferenceStore = usePreferenceStore()

// 响应式数据
const loading = ref(false)
const newAllergy = ref('')
const newDisliked = ref('')

// 偏好数据
const preference = reactive({
  flavorPreference: {
    sour: 100,
    sweet: 100,
    bitter: 100,
    spicy: 100,
    salty: 100
  },
  dietaryRestrictions: [],
  allergies: [],
  dislikedIngredients: [],
  currentConditions: [],
  mealScenarios: [],
  cookingDifficulty: 2,
  maxCookingTime: 60
})

// 五味偏好引用
const flavorPreference = reactive(preference.flavorPreference)

// 饮食禁忌选项
const dietaryRestrictions = [
  { value: 'vegetarian', name: '素食', icon: '🥬' },
  { value: 'vegan', name: '纯素', icon: '🌱' },
  { value: 'gluten_free', name: '无麸质', icon: '🌾' },
  { value: 'dairy_free', name: '无乳制品', icon: '🥛' },
  { value: 'low_carb', name: '低碳水', icon: '🥩' },
  { value: 'low_fat', name: '低脂', icon: '🥗' },
  { value: 'low_sodium', name: '低钠', icon: '🧂' },
  { value: 'sugar_free', name: '无糖', icon: '🚫' },
  { value: 'nut_free', name: '无坚果', icon: '🥜' },
  { value: 'egg_free', name: '无蛋', icon: '🥚' }
]

// 身体状态选项
const currentConditions = [
  { value: 'fatigue', name: '疲劳乏力', icon: '😴' },
  { value: 'insomnia', name: '失眠多梦', icon: '🌙' },
  { value: 'stress', name: '压力大', icon: '😰' },
  { value: 'cold_hands', name: '手脚冰凉', icon: '🧊' },
  { value: 'hot_body', name: '身体燥热', icon: '🔥' },
  { value: 'poor_appetite', name: '食欲不振', icon: '🍽️' },
  { value: 'digestion_issues', name: '消化不良', icon: '🤢' },
  { value: 'headache', name: '头痛头晕', icon: '🤕' },
  { value: 'skin_issues', name: '皮肤问题', icon: '🧴' }
]

// 用餐场景选项
const mealScenarios = [
  { value: 'breakfast', name: '早餐', icon: '🌅' },
  { value: 'lunch', name: '午餐', icon: '☀️' },
  { value: 'dinner', name: '晚餐', icon: '🌙' },
  { value: 'snack', name: '加餐', icon: '🍎' },
  { value: 'work_meal', name: '工作餐', icon: '💼' },
  { value: 'family_meal', name: '家庭聚餐', icon: '👨‍👩‍👧‍👦' },
  { value: 'party', name: '聚会', icon: '🎉' },
  { value: 'date', name: '约会', icon: '💕' },
  { value: 'solo_dining', name: '单人用餐', icon: '🍽️' },
  { value: 'travel', name: '旅行', icon: '✈️' }
]

// 页面跳转
const goBack = () => {
  router.push('/')
}

// 获取五味名称
const getFlavorName = (flavor) => {
  const nameMap = {
    sour: '酸味',
    sweet: '甜味',
    bitter: '苦味',
    spicy: '辣味',
    salty: '咸味'
  }
  return nameMap[flavor] || flavor
}

// 获取五味图标
const getFlavorIcon = (flavor) => {
  const iconMap = {
    sour: '🍋',
    sweet: '🍯',
    bitter: '☕',
    spicy: '🌶️',
    salty: '🧂'
  }
  return iconMap[flavor] || '👅'
}

// 五味偏好变化
const onFlavorChange = () => {
  // 实时更新，不需要防抖
}

// 添加过敏信息
const addAllergy = () => {
  if (newAllergy.value.trim() && !preference.allergies.includes(newAllergy.value.trim())) {
    preference.allergies.push(newAllergy.value.trim())
    newAllergy.value = ''
  }
}

// 移除过敏信息
const removeAllergy = (index) => {
  preference.allergies.splice(index, 1)
}

// 添加不喜欢的食材
const addDisliked = () => {
  if (newDisliked.value.trim() && !preference.dislikedIngredients.includes(newDisliked.value.trim())) {
    preference.dislikedIngredients.push(newDisliked.value.trim())
    newDisliked.value = ''
  }
}

// 移除不喜欢的食材
const removeDisliked = (index) => {
  preference.dislikedIngredients.splice(index, 1)
}

// 重置偏好
const resetPreference = async () => {
  try {
    loading.value = true
    await preferenceStore.resetPreference()
    await loadPreference()
    ElMessage.success('偏好已重置')
  } catch (error) {
    console.error('Failed to reset preference:', error)
    ElMessage.error('重置失败，请重试')
  } finally {
    loading.value = false
  }
}

// 保存偏好
const savePreference = async () => {
  try {
    loading.value = true
    await preferenceStore.updatePreference(preference)
    ElMessage.success('偏好保存成功')
  } catch (error) {
    console.error('Failed to save preference:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

// 加载偏好
const loadPreference = async () => {
  try {
    const pref = await preferenceStore.fetchPreference()
    if (pref) {
      Object.assign(preference, pref)
      Object.assign(flavorPreference, pref.flavorPreference)
    }
  } catch (error) {
    console.error('Failed to load preference:', error)
  }
}

onMounted(async () => {
  // 确保用户会话已初始化
  if (!userStore.sessionId) {
    await userStore.initSession()
  }
  
  // 加载偏好设置
  await loadPreference()
})
</script>

<style scoped>
.preference-page {
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
  max-width: 1000px;
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

.header-right {
  display: flex;
  gap: 12px;
}

/* 内容区域 */
.preference-content {
  padding: 24px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 偏好设置区块 */
.preference-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 20px;
}

.section-header p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

/* 五味偏好 */
.flavor-preferences {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.flavor-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.flavor-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
}

.flavor-name {
  font-weight: 500;
  color: #2c3e50;
}

.flavor-icon {
  font-size: 18px;
}

.flavor-item .el-slider {
  flex: 1;
  margin: 0 16px;
}

.flavor-value {
  min-width: 50px;
  text-align: right;
  font-weight: 500;
  color: #667eea;
}

/* 饮食禁忌 */
.restriction-options,
.condition-options,
.scenario-options {
  margin-top: 16px;
}

.restriction-grid,
.condition-grid,
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.restriction-item,
.condition-item,
.scenario-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.restriction-item:hover,
.condition-item:hover,
.scenario-item:hover {
  background: #e8f4ff;
}

.restriction-content,
.condition-content,
.scenario-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.restriction-icon,
.condition-icon,
.scenario-icon {
  font-size: 16px;
}

.restriction-name,
.condition-name,
.scenario-name {
  color: #2c3e50;
}

/* 烹饪设置 */
.cooking-settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-label {
  font-weight: 500;
  color: #2c3e50;
}

.setting-item .el-radio-group {
  display: flex;
  gap: 24px;
}

/* 过敏信息和不喜欢的食材 */
.allergy-section,
.disliked-section {
  margin-top: 16px;
}

.allergy-input,
.disliked-input {
  margin-bottom: 16px;
}

.allergy-tags,
.disliked-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.allergy-tags .el-tag,
.disliked-tags .el-tag {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }
  
  .header-left h1 {
    font-size: 20px;
  }
  
  .header-right {
    gap: 8px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .preference-section {
    padding: 20px 16px;
  }
  
  .flavor-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .flavor-info {
    min-width: auto;
  }
  
  .flavor-item .el-slider {
    margin: 0;
  }
  
  .flavor-value {
    text-align: center;
    min-width: auto;
  }
  
  .restriction-grid,
  .condition-grid,
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  
  .setting-item .el-radio-group {
    flex-direction: column;
    gap: 12px;
  }
}

/* 动画效果 */
.preference-section {
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

/* 自定义滑块样式 */
.el-slider__runway {
  background-color: #e8e8e8;
}

.el-slider__bar {
  background-color: #667eea;
}

.el-slider__button {
  border-color: #667eea;
  background-color: #667eea;
}

.el-slider__button:hover {
  transform: scale(1.2);
}

/* 复选框样式优化 */
.el-checkbox {
  width: 100%;
}

.el-checkbox__label {
  width: 100%;
  padding-left: 8px;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #667eea;
  border-color: #667eea;
}
</style>
