<template>
  <div class="preference-card">
    <div class="card-header">
      <h3 class="card-title">
        <span class="icon">🍳</span>
        偏好设置
      </h3>
      <span v-if="preferenceStore.hasPreference" class="badge configured">已配置</span>
      <span v-else class="badge unconfigured">未配置</span>
    </div>

    <!-- 未配置状态 -->
    <div v-if="!preferenceStore.hasPreference" class="empty-state">
      <div class="empty-icon">🎯</div>
      <p class="empty-text">您还没有配置饮食偏好</p>
      <p class="empty-hint">设置您的饮食偏好，让我们为您推荐更合适的菜品</p>
      <button class="config-btn" @click="goToPreferences">
        <span>立即配置</span>
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- 已配置状态 -->
    <div v-else class="card-content">
      <!-- 五味偏好 -->
      <div class="flavor-section">
        <h4 class="section-title">
          <span class="section-icon">👅</span>
          五味偏好
        </h4>
        <div class="flavor-bars">
          <div
            v-for="(value, flavor) in preferenceStore.preference.flavorPreference"
            :key="flavor"
            class="flavor-item"
          >
            <div class="flavor-info">
              <span class="flavor-icon">{{ preferenceStore.flavorLabels[flavor].icon }}</span>
              <span class="flavor-name">{{ preferenceStore.flavorLabels[flavor].name }}</span>
              <span class="flavor-value">{{ value }}%</span>
            </div>
            <div class="flavor-bar-container">
              <div
                class="flavor-bar"
                :style="{
                  width: `${value}%`,
                  background: preferenceStore.flavorLabels[flavor].color
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 饮食禁忌 -->
      <div v-if="hasRestrictions" class="preference-section">
        <h4 class="section-title">
          <span class="section-icon">🚫</span>
          饮食禁忌
        </h4>
        <div class="tags-container">
          <span
            v-for="restriction in preferenceStore.preference.dietaryRestrictions"
            :key="restriction"
            class="restriction-tag"
          >
            {{ getRestrictionLabel(restriction) }}
          </span>
        </div>
      </div>

      <!-- 过敏原 -->
      <div v-if="hasAllergies" class="preference-section">
        <h4 class="section-title">
          <span class="section-icon">⚠️</span>
          过敏原
        </h4>
        <div class="tags-container">
          <span
            v-for="allergy in preferenceStore.preference.allergies"
            :key="allergy"
            class="allergy-tag"
          >
            {{ allergy }}
          </span>
        </div>
      </div>

      <!-- 不喜欢的食材 -->
      <div v-if="hasDislikedIngredients" class="preference-section">
        <h4 class="section-title">
          <span class="section-icon">🙅</span>
          不喜欢的食材
        </h4>
        <div class="tags-container">
          <span
            v-for="ingredient in preferenceStore.preference.dislikedIngredients"
            :key="ingredient"
            class="dislike-tag"
          >
            {{ ingredient }}
          </span>
        </div>
      </div>

      <!-- 当前状态 -->
      <div v-if="hasCurrentConditions" class="preference-section">
        <h4 class="section-title">
          <span class="section-icon">💊</span>
          当前状态
        </h4>
        <div class="tags-container">
          <span
            v-for="condition in preferenceStore.preference.currentConditions"
            :key="condition"
            class="condition-tag"
          >
            {{ getConditionLabel(condition) }}
          </span>
        </div>
      </div>

      <!-- 用餐场景 -->
      <div v-if="hasMealScenarios" class="preference-section">
        <h4 class="section-title">
          <span class="section-icon">🕐</span>
          用餐场景
        </h4>
        <div class="tags-container">
          <span
            v-for="scenario in preferenceStore.preference.mealScenarios"
            :key="scenario"
            class="scenario-tag"
          >
            {{ getScenarioLabel(scenario) }}
          </span>
        </div>
      </div>

      <!-- 烹饪偏好 -->
      <div class="cooking-section">
        <h4 class="section-title">
          <span class="section-icon">👨‍🍳</span>
          烹饪偏好
        </h4>
        <div class="cooking-info">
          <div class="cooking-item">
            <span class="cooking-label">烹饪难度</span>
            <div class="difficulty-stars">
              <span
                v-for="i in 5"
                :key="i"
                class="star"
                :class="{ active: i <= preferenceStore.preference.cookingDifficulty }"
              >
                ★
              </span>
            </div>
          </div>
          <div class="cooking-item">
            <span class="cooking-label">最大烹饪时间</span>
            <span class="cooking-value">{{ preferenceStore.preference.maxCookingTime }} 分钟</span>
          </div>
        </div>
      </div>

      <button class="edit-btn" @click="goToPreferences">
        <span>编辑偏好</span>
        <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferenceStore } from '@/stores/preference'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const hasRestrictions = computed(() => preferenceStore.preference.dietaryRestrictions?.length > 0)

const hasAllergies = computed(() => preferenceStore.preference.allergies?.length > 0)

const hasDislikedIngredients = computed(
  () => preferenceStore.preference.dislikedIngredients?.length > 0
)

const hasCurrentConditions = computed(
  () => preferenceStore.preference.currentConditions?.length > 0
)

const hasMealScenarios = computed(() => preferenceStore.preference.mealScenarios?.length > 0)

const getRestrictionLabel = value => {
  const option = preferenceStore.restrictionOptions.find(o => o.value === value)
  return option ? `${option.icon} ${option.label}` : value
}

const getConditionLabel = value => {
  const option = preferenceStore.conditionOptions.find(o => o.value === value)
  return option ? `${option.icon} ${option.label}` : value
}

const getScenarioLabel = value => {
  const option = preferenceStore.scenarioOptions.find(o => o.value === value)
  return option ? `${option.icon} ${option.label}` : value
}

const goToPreferences = () => {
  router.push('/preference-settings')
}
</script>

<style scoped>
.preference-card {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(139, 69, 19, 0.08);
  transition: all 0.3s ease;
}

.preference-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(139, 69, 19, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #5a3a22;
  margin: 0;
}

.card-title .icon {
  font-size: 24px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge.configured {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.badge.unconfigured {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-text {
  font-size: 16px;
  color: #5a3a22;
  margin-bottom: 8px;
  font-weight: 500;
}

.empty-hint {
  font-size: 14px;
  color: #8b6f47;
  margin-bottom: 24px;
  line-height: 1.6;
}

.config-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.config-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.config-btn .arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.config-btn:hover .arrow-icon {
  transform: translateX(4px);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.flavor-section {
  padding: 16px;
  background: rgba(139, 69, 19, 0.02);
  border-radius: 12px;
  border-left: 3px solid #ffd700;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #5a3a22;
  margin: 0 0 16px 0;
}

.section-icon {
  font-size: 18px;
}

.flavor-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flavor-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flavor-info {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.flavor-icon {
  font-size: 16px;
}

.flavor-name {
  flex: 1;
  font-size: 14px;
  color: #5a3a22;
  font-weight: 500;
}

.flavor-value {
  font-size: 13px;
  color: #8b6f47;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

.flavor-bar-container {
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.flavor-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.preference-section {
  padding: 16px;
  background: rgba(139, 69, 19, 0.02);
  border-radius: 12px;
  border-left: 3px solid #8b6f47;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.restriction-tag,
.allergy-tag,
.dislike-tag,
.condition-tag,
.scenario-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.restriction-tag {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.2);
}

.restriction-tag:hover {
  background: linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%);
  transform: scale(1.05);
}

.allergy-tag {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #e65100;
  border: 1px solid rgba(230, 81, 0, 0.2);
}

.allergy-tag:hover {
  background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
  transform: scale(1.05);
}

.dislike-tag {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #616161;
  border: 1px solid rgba(97, 97, 97, 0.2);
}

.dislike-tag:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  transform: scale(1.05);
}

.condition-tag {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.2);
}

.condition-tag:hover {
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
  transform: scale(1.05);
}

.scenario-tag {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
  border: 1px solid rgba(21, 101, 192, 0.2);
}

.scenario-tag:hover {
  background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
  transform: scale(1.05);
}

.cooking-section {
  padding: 16px;
  background: rgba(139, 69, 19, 0.02);
  border-radius: 12px;
  border-left: 3px solid #ff9800;
}

.cooking-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cooking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cooking-label {
  font-size: 14px;
  color: #8b6f47;
  font-weight: 500;
}

.difficulty-stars {
  display: flex;
  gap: 4px;
}

.difficulty-stars .star {
  font-size: 20px;
  color: #e0e0e0;
  transition: color 0.3s ease;
}

.difficulty-stars .star.active {
  color: #ff9800;
}

.cooking-value {
  font-size: 14px;
  color: #5a3a22;
  font-weight: 600;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #8b6f47 0%, #6b5b45 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 111, 71, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 111, 71, 0.4);
  background: linear-gradient(135deg, #9d8158 0%, #7d6b55 100%);
}

.edit-btn .edit-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.edit-btn:hover .edit-icon {
  transform: scale(1.1);
}
</style>
