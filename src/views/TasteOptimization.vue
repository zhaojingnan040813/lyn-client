<template>
  <div class="taste-optimization">
    <!-- 页面标题 -->
    <el-page-header @back="$router.back()" title="返回">
      <template #content>
        <div class="flex items-center">
          <el-icon class="mr-2"><Setting /></el-icon>
          <span class="text-large font-600">口味调优</span>
        </div>
      </template>
    </el-page-header>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="24">
        <!-- 左侧：用户信息区域 (1/3) -->
        <el-col :lg="8" :md="24" :sm="24" :xs="24">
          <div class="user-info-section">
            <!-- 用户体质信息 -->
            <el-card class="constitution-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><User /></el-icon>
                  <span>用户体质</span>
                </div>
              </template>

              <el-skeleton :loading="!constitution" animated>
                <template #default>
                  <div v-if="constitution" class="constitution-content">
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="体质类型">
                        <el-tag type="primary" size="small">{{ constitution.type }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="体质特征">
                        <p class="description-text">{{ constitution.description }}</p>
                      </el-descriptions-item>
                      <el-descriptions-item label="饮食建议">
                        <p class="description-text">{{ constitution.dietaryAdvice }}</p>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </template>
              </el-skeleton>
            </el-card>

            <!-- 用户偏好概览 -->
            <el-card class="preference-overview-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><Star /></el-icon>
                  <span>偏好概览</span>
                </div>
              </template>

              <el-skeleton :loading="!preference" animated>
                <template #default>
                  <div v-if="preference" class="preference-content">
                    <div class="flavor-tags">
                      <span class="label">主要口味：</span>
                      <div class="tags-container">
                        <el-tag
                          v-for="(value, key) in getMainFlavors()"
                          :key="key"
                          type="success"
                          size="small"
                          class="flavor-tag"
                        >
                          {{ getFlavorName(key) }} {{ value }}%
                        </el-tag>
                      </div>
                    </div>

                    <el-divider />

                    <el-descriptions :column="1" size="small">
                      <el-descriptions-item label="饮食禁忌">
                        <span class="preference-text">
                          {{
                            preference.dietaryRestrictions?.length > 0
                              ? preference.dietaryRestrictions.join('、')
                              : '无'
                          }}
                        </span>
                      </el-descriptions-item>
                      <el-descriptions-item label="过敏原">
                        <span class="preference-text">
                          {{
                            preference.allergies?.length > 0
                              ? preference.allergies.join('、')
                              : '无'
                          }}
                        </span>
                      </el-descriptions-item>
                      <el-descriptions-item label="烹饪偏好">
                        <div class="cooking-preference">
                          <el-tag type="info" size="small">
                            {{ getDifficultyName(preference.cookingDifficulty) }}
                          </el-tag>
                          <span class="time-text">{{ preference.maxCookingTime }}分钟内</span>
                        </div>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </template>
              </el-skeleton>
            </el-card>
          </div>
        </el-col>

        <!-- 右侧：可编辑的偏好信息区域 (2/3) -->
        <el-col :lg="16" :md="24" :sm="24" :xs="24">
          <el-card class="preference-form-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Edit /></el-icon>
                <span>个性化偏好设置</span>
              </div>
            </template>

            <el-form
              ref="formRef"
              :model="formData"
              label-width="120px"
              label-position="left"
              @submit.prevent="handleSubmit"
            >
              <!-- 五味偏好 -->
              <el-form-item label="五味偏好">
                <div class="flavor-sliders">
                  <div v-for="(label, key) in flavorLabels" :key="key" class="slider-item">
                    <div class="slider-header">
                      <span class="slider-label">{{ label }}</span>
                      <el-tag type="primary" size="small">
                        {{ formData.flavorPreference[key] }}%
                      </el-tag>
                    </div>
                    <el-slider
                      v-model="formData.flavorPreference[key]"
                      :min="0"
                      :max="100"
                      :step="1"
                      :show-input-controls="false"
                      input-size="small"
                    />
                  </div>
                </div>
              </el-form-item>

              <el-divider />

              <!-- 饮食禁忌 -->
              <el-form-item label="饮食禁忌">
                <div class="preference-section">
                  <div class="preset-options">
                    <span class="section-label">常见选项：</span>
                    <el-checkbox-group v-model="formData.dietaryRestrictions">
                      <el-checkbox label="素食" border>素食</el-checkbox>
                      <el-checkbox label="纯素" border>纯素</el-checkbox>
                      <el-checkbox label="无麸质" border>无麸质</el-checkbox>
                      <el-checkbox label="低盐" border>低盐</el-checkbox>
                      <el-checkbox label="低糖" border>低糖</el-checkbox>
                      <el-checkbox label="低脂" border>低脂</el-checkbox>
                      <el-checkbox label="无乳制品" border>无乳制品</el-checkbox>
                      <el-checkbox label="无坚果" border>无坚果</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-divider content-position="left">自定义选项</el-divider>
                  <div class="custom-options">
                    <div
                      v-for="(item, index) in customDietaryRestrictions"
                      :key="index"
                      class="list-item"
                    >
                      <el-input
                        v-model="customDietaryRestrictions[index]"
                        placeholder="请输入自定义饮食禁忌"
                        clearable
                      >
                        <template #append>
                          <el-button
                            type="danger"
                            icon="Delete"
                            @click="removeCustomItem('customDietaryRestrictions', index)"
                            text
                          />
                        </template>
                      </el-input>
                    </div>
                    <el-button
                      type="primary"
                      icon="Plus"
                      @click="addCustomItem('customDietaryRestrictions')"
                      plain
                      size="small"
                    >
                      添加自定义禁忌
                    </el-button>
                  </div>
                </div>
              </el-form-item>

              <!-- 过敏原 -->
              <el-form-item label="过敏原">
                <div class="preference-section">
                  <div class="preset-options">
                    <span class="section-label">常见过敏原：</span>
                    <el-checkbox-group v-model="formData.allergies">
                      <el-checkbox label="花生" border>花生</el-checkbox>
                      <el-checkbox label="海鲜" border>海鲜</el-checkbox>
                      <el-checkbox label="鸡蛋" border>鸡蛋</el-checkbox>
                      <el-checkbox label="牛奶" border>牛奶</el-checkbox>
                      <el-checkbox label="大豆" border>大豆</el-checkbox>
                      <el-checkbox label="小麦" border>小麦</el-checkbox>
                      <el-checkbox label="芝麻" border>芝麻</el-checkbox>
                      <el-checkbox label="贝类" border>贝类</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-divider content-position="left">自定义选项</el-divider>
                  <div class="custom-options">
                    <div v-for="(item, index) in customAllergies" :key="index" class="list-item">
                      <el-input
                        v-model="customAllergies[index]"
                        placeholder="请输入自定义过敏原"
                        clearable
                      >
                        <template #append>
                          <el-button
                            type="danger"
                            icon="Delete"
                            @click="removeCustomItem('customAllergies', index)"
                            text
                          />
                        </template>
                      </el-input>
                    </div>
                    <el-button
                      type="warning"
                      icon="Plus"
                      @click="addCustomItem('customAllergies')"
                      plain
                      size="small"
                    >
                      添加自定义过敏原
                    </el-button>
                  </div>
                </div>
              </el-form-item>

              <!-- 不喜欢的食材 -->
              <el-form-item label="不喜欢的食材">
                <div class="preference-section">
                  <div class="preset-options">
                    <span class="section-label">常见食材：</span>
                    <el-checkbox-group v-model="formData.dislikedIngredients">
                      <el-checkbox label="香菜" border>香菜</el-checkbox>
                      <el-checkbox label="芹菜" border>芹菜</el-checkbox>
                      <el-checkbox label="苦瓜" border>苦瓜</el-checkbox>
                      <el-checkbox label="胡萝卜" border>胡萝卜</el-checkbox>
                      <el-checkbox label="洋葱" border>洋葱</el-checkbox>
                      <el-checkbox label="大蒜" border>大蒜</el-checkbox>
                      <el-checkbox label="生姜" border>生姜</el-checkbox>
                      <el-checkbox label="辣椒" border>辣椒</el-checkbox>
                      <el-checkbox label="海带" border>海带</el-checkbox>
                      <el-checkbox label="木耳" border>木耳</el-checkbox>
                      <el-checkbox label="香菇" border>香菇</el-checkbox>
                      <el-checkbox label="豆腐" border>豆腐</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-divider content-position="left">自定义选项</el-divider>
                  <div class="custom-options">
                    <div
                      v-for="(item, index) in customDislikedIngredients"
                      :key="index"
                      class="list-item"
                    >
                      <el-input
                        v-model="customDislikedIngredients[index]"
                        placeholder="请输入不喜欢的食材"
                        clearable
                      >
                        <template #append>
                          <el-button
                            type="danger"
                            icon="Delete"
                            @click="removeCustomItem('customDislikedIngredients', index)"
                            text
                          />
                        </template>
                      </el-input>
                    </div>
                    <el-button
                      type="info"
                      icon="Plus"
                      @click="addCustomItem('customDislikedIngredients')"
                      plain
                      size="small"
                    >
                      添加自定义食材
                    </el-button>
                  </div>
                </div>
              </el-form-item>

              <!-- 当前身体状态 -->
              <el-form-item label="当前身体状态">
                <div class="preference-section">
                  <div class="preset-options">
                    <span class="section-label">常见状态：</span>
                    <el-checkbox-group v-model="formData.currentConditions">
                      <el-checkbox label="感冒" border>感冒</el-checkbox>
                      <el-checkbox label="咳嗽" border>咳嗽</el-checkbox>
                      <el-checkbox label="消化不良" border>消化不良</el-checkbox>
                      <el-checkbox label="失眠" border>失眠</el-checkbox>
                      <el-checkbox label="疲劳" border>疲劳</el-checkbox>
                      <el-checkbox label="便秘" border>便秘</el-checkbox>
                      <el-checkbox label="腹泻" border>腹泻</el-checkbox>
                      <el-checkbox label="头痛" border>头痛</el-checkbox>
                      <el-checkbox label="胃痛" border>胃痛</el-checkbox>
                      <el-checkbox label="食欲不振" border>食欲不振</el-checkbox>
                      <el-checkbox label="口干舌燥" border>口干舌燥</el-checkbox>
                      <el-checkbox label="面色苍白" border>面色苍白</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-divider content-position="left">自定义选项</el-divider>
                  <div class="custom-options">
                    <div
                      v-for="(item, index) in customCurrentConditions"
                      :key="index"
                      class="list-item"
                    >
                      <el-input
                        v-model="customCurrentConditions[index]"
                        placeholder="请输入当前身体状态"
                        clearable
                      >
                        <template #append>
                          <el-button
                            type="danger"
                            icon="Delete"
                            @click="removeCustomItem('customCurrentConditions', index)"
                            text
                          />
                        </template>
                      </el-input>
                    </div>
                    <el-button
                      type="success"
                      icon="Plus"
                      @click="addCustomItem('customCurrentConditions')"
                      plain
                      size="small"
                    >
                      添加自定义状态
                    </el-button>
                  </div>
                </div>
              </el-form-item>

              <!-- 用餐场景偏好 -->
              <el-form-item label="用餐场景">
                <div class="preference-section">
                  <div class="preset-options">
                    <span class="section-label">常见场景：</span>
                    <el-checkbox-group v-model="formData.mealScenarios">
                      <el-checkbox label="早餐" border>早餐</el-checkbox>
                      <el-checkbox label="午餐" border>午餐</el-checkbox>
                      <el-checkbox label="晚餐" border>晚餐</el-checkbox>
                      <el-checkbox label="宵夜" border>宵夜</el-checkbox>
                      <el-checkbox label="工作日快餐" border>工作日快餐</el-checkbox>
                      <el-checkbox label="周末聚餐" border>周末聚餐</el-checkbox>
                      <el-checkbox label="节日宴请" border>节日宴请</el-checkbox>
                      <el-checkbox label="家庭聚餐" border>家庭聚餐</el-checkbox>
                      <el-checkbox label="商务宴请" border>商务宴请</el-checkbox>
                      <el-checkbox label="一人食" border>一人食</el-checkbox>
                      <el-checkbox label="约会" border>约会</el-checkbox>
                      <el-checkbox label="运动后" border>运动后</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-divider content-position="left">自定义选项</el-divider>
                  <div class="custom-options">
                    <div
                      v-for="(item, index) in customMealScenarios"
                      :key="index"
                      class="list-item"
                    >
                      <el-input
                        v-model="customMealScenarios[index]"
                        placeholder="请输入用餐场景"
                        clearable
                      >
                        <template #append>
                          <el-button
                            type="danger"
                            icon="Delete"
                            @click="removeCustomItem('customMealScenarios', index)"
                            text
                          />
                        </template>
                      </el-input>
                    </div>
                    <el-button
                      type="primary"
                      icon="Plus"
                      @click="addCustomItem('customMealScenarios')"
                      plain
                      size="small"
                    >
                      添加自定义场景
                    </el-button>
                  </div>
                </div>
              </el-form-item>

              <el-divider />

              <!-- 烹饪设置 -->
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="烹饪难度">
                    <el-select v-model="formData.cookingDifficulty" placeholder="请选择烹饪难度">
                      <el-option label="简单 (新手友好)" :value="1" />
                      <el-option label="中等 (需要一定厨艺)" :value="2" />
                      <el-option label="困难 (需要丰富经验)" :value="3" />
                      <el-option label="专家级 (专业厨师)" :value="4" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最大烹饪时间">
                    <el-input-number
                      v-model="formData.maxCookingTime"
                      :min="5"
                      :max="300"
                      :step="5"
                      placeholder="分钟"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 操作按钮 -->
              <el-form-item>
                <div class="form-actions">
                  <el-button @click="resetForm">重置</el-button>
                  <el-button type="primary" @click="handleSubmit" :loading="loading">
                    保存偏好设置
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { preferenceApi, constitutionApi } from '@/api'

// 响应式数据
const loading = ref(false)
const constitution = ref(null)
const preference = ref(null)
const formRef = ref()

// 五味标签
const flavorLabels = {
  sour: '酸',
  sweet: '甜',
  bitter: '苦',
  spicy: '辣',
  salty: '咸'
}

// 表单数据
const formData = ref({
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
  cookingDifficulty: 1,
  maxCookingTime: 30
})

// 自定义选项数据
const customDietaryRestrictions = ref([])
const customAllergies = ref([])
const customDislikedIngredients = ref([])
const customCurrentConditions = ref([])
const customMealScenarios = ref([])

// 获取用户体质信息
const loadConstitution = async () => {
  try {
    const sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      ElMessage.error('未找到用户会话信息')
      return
    }

    const response = await constitutionApi.getUserConstitution(sessionId)
    constitution.value = response.data
  } catch (err) {
    console.error('加载体质信息失败:', err)
    ElMessage.error('加载体质信息失败')
  }
}

// 获取用户偏好
const loadPreference = async () => {
  try {
    const response = await preferenceApi.getPreference()
    preference.value = response.data

    // 将API返回的数据填充到表单
    if (response.data) {
      formData.value = {
        flavorPreference: response.data.flavorPreference || formData.value.flavorPreference,
        dietaryRestrictions: response.data.dietaryRestrictions || [],
        allergies: response.data.allergies || [],
        dislikedIngredients: response.data.dislikedIngredients || [],
        currentConditions: response.data.currentConditions || [],
        mealScenarios: response.data.mealScenarios || [],
        cookingDifficulty: response.data.cookingDifficulty || 1,
        maxCookingTime: response.data.maxCookingTime || 30
      }
    }
  } catch (err) {
    console.error('加载偏好信息失败:', err)
    ElMessage.error('加载偏好信息失败')
  }
}

// 获取主要口味
const getMainFlavors = () => {
  const flavors = formData.value.flavorPreference
  const sorted = Object.entries(flavors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
  return Object.fromEntries(sorted)
}

// 获取口味名称
const getFlavorName = key => {
  return flavorLabels[key] || key
}

// 获取难度名称
const getDifficultyName = level => {
  const levels = {
    1: '简单',
    2: '中等',
    3: '困难',
    4: '专家级'
  }
  return levels[level] || '未知'
}

// 添加项目
const addItem = field => {
  formData.value[field].push('')
}

// 删除项目
const removeItem = (field, index) => {
  formData.value[field].splice(index, 1)
}

// 添加自定义项目
const addCustomItem = field => {
  const fieldMap = {
    customDietaryRestrictions: customDietaryRestrictions,
    customAllergies: customAllergies,
    customDislikedIngredients: customDislikedIngredients,
    customCurrentConditions: customCurrentConditions,
    customMealScenarios: customMealScenarios
  }

  fieldMap[field].value.push('')
}

// 删除自定义项目
const removeCustomItem = (field, index) => {
  const fieldMap = {
    customDietaryRestrictions: customDietaryRestrictions,
    customAllergies: customAllergies,
    customDislikedIngredients: customDislikedIngredients,
    customCurrentConditions: customCurrentConditions,
    customMealScenarios: customMealScenarios
  }

  fieldMap[field].value.splice(index, 1)
}

// 重置表单
const resetForm = async () => {
  try {
    await ElMessageBox.confirm('确定要重置所有设置吗？', '确认重置', {
      type: 'warning'
    })

    if (preference.value) {
      formData.value = {
        flavorPreference: preference.value.flavorPreference || formData.value.flavorPreference,
        dietaryRestrictions: preference.value.dietaryRestrictions || [],
        allergies: preference.value.allergies || [],
        dislikedIngredients: preference.value.dislikedIngredients || [],
        currentConditions: preference.value.currentConditions || [],
        mealScenarios: preference.value.mealScenarios || [],
        cookingDifficulty: preference.value.cookingDifficulty || 1,
        maxCookingTime: preference.value.maxCookingTime || 30
      }
    }

    ElMessage.success('表单已重置')
  } catch {
    // 用户取消操作
  }
}

// 提交表单
const handleSubmit = async () => {
  loading.value = true

  try {
    // 合并预设选项和自定义选项，过滤掉空字符串
    const cleanData = {
      ...formData.value,
      dietaryRestrictions: [
        ...formData.value.dietaryRestrictions.filter(item => item.trim()),
        ...customDietaryRestrictions.value.filter(item => item.trim())
      ],
      allergies: [
        ...formData.value.allergies.filter(item => item.trim()),
        ...customAllergies.value.filter(item => item.trim())
      ],
      dislikedIngredients: [
        ...formData.value.dislikedIngredients.filter(item => item.trim()),
        ...customDislikedIngredients.value.filter(item => item.trim())
      ],
      currentConditions: [
        ...formData.value.currentConditions.filter(item => item.trim()),
        ...customCurrentConditions.value.filter(item => item.trim())
      ],
      mealScenarios: [
        ...formData.value.mealScenarios.filter(item => item.trim()),
        ...customMealScenarios.value.filter(item => item.trim())
      ]
    }

    await preferenceApi.updatePreference(cleanData)

    // 重新加载偏好数据
    await loadPreference()

    ElMessage.success('偏好设置保存成功！')
  } catch (err) {
    console.error('保存偏好失败:', err)
    ElMessage.error(err.message || '保存偏好设置失败')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadConstitution()
  loadPreference()
})
</script>

<style scoped>
.taste-optimization {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.main-content {
  margin-top: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.card-header .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.user-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.constitution-card,
.preference-overview-card {
  border-radius: 12px;
}

.constitution-content {
  line-height: 1.6;
}

.description-text {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.preference-form-card {
  border-radius: 12px;
}

.preference-content .flavor-tags {
  margin-bottom: 16px;
}

.preference-content .label {
  color: #606266;
  font-weight: 500;
  margin-right: 8px;
}

.preference-content .tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.preference-content .flavor-tag {
  margin: 0;
}

.preference-content .preference-text {
  color: #606266;
  font-size: 14px;
}

.preference-content .cooking-preference {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preference-content .time-text {
  color: #909399;
  font-size: 13px;
}

.flavor-sliders {
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

/* 样式穿刺给 el-form-item__content 这个元素加flex: 1; */
/* :deep(.el-form-item__content) {
  flex: 1;
} */

.slider-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-label {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preference-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.preset-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.section-label {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.custom-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

:deep(.el-checkbox.is-bordered) {
  margin-right: 0;
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-card__header) {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-slider) {
  margin: 0;
}

:deep(.el-slider__runway) {
  background-color: #e4e7ed;
}

:deep(.el-slider__bar) {
  background-color: #409eff;
}

:deep(.el-slider__button) {
  border-color: #409eff;
}

@media (max-width: 768px) {
  .taste-optimization {
    padding: 16px;
  }

  .main-content {
    margin-top: 16px;
  }

  .user-info-section {
    gap: 16px;
  }

  :deep(.el-card__header),
  :deep(.el-card__body) {
    padding: 16px;
  }
}
</style>
