<template>
  <el-dialog v-model="visible" title="菜品详情" width="80%">
    <div v-if="recipe" class="recipe-detail">
      <div class="detail-header">
        <h2>{{ recipe.emoji }} {{ recipe.name }}</h2>
        <el-tag :type="getCategoryTagType(recipe.category)">
          {{ getCategoryLabel(recipe.category) }}
        </el-tag>
      </div>

      <div class="detail-content">
        <!-- 基础信息 -->
        <el-card class="detail-card" header="基础信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <p>
                <strong>菜名：</strong>
                {{ recipe.name }}
              </p>
              <p>
                <strong>描述：</strong>
                {{ recipe.description }}
              </p>
              <p>
                <strong>分类：</strong>
                <el-tag :type="getCategoryTagType(recipe.category)">
                  {{ getCategoryLabel(recipe.category) }}
                </el-tag>
              </p>
              <p>
                <strong>烹饪时间：</strong>
                {{ recipe.cookingTime }}分钟
              </p>
              <p>
                <strong>难度：</strong>
                <el-tag :type="getDifficultyTagType(recipe.difficulty)">
                  {{ recipe.difficulty }}
                </el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>状态：</strong>
                <el-tag :type="recipe.isActive ? 'success' : 'danger'">
                  {{ recipe.isActive ? '已启用' : '已禁用' }}
                </el-tag>
              </p>
              <p>
                <strong>基础评分：</strong>
                <el-rate v-model="recipe.baseScore" disabled show-score />
              </p>
              <p v-if="recipe.matchScore !== undefined">
                <strong>匹配分数：</strong>
                {{ recipe.matchScore }}分
              </p>
              <p>
                <strong>创建时间：</strong>
                {{ formatDate(recipe.createdAt) }}
              </p>
              <p>
                <strong>更新时间：</strong>
                {{ formatDate(recipe.updatedAt) }}
              </p>
            </el-col>
          </el-row>
        </el-card>

        <!-- 中医属性 -->
        <el-card class="detail-card" header="中医属性">
          <el-row :gutter="20">
            <el-col :span="8">
              <p>
                <strong>性质：</strong>
                <el-tag v-if="recipe.nature" :type="getNatureTagType(recipe.nature)">
                  {{ recipe.nature }}
                </el-tag>
              </p>
              <p>
                <strong>味道：</strong>
                <el-tag
                  v-for="flavor in recipe.flavors"
                  :key="flavor"
                  size="small"
                  style="margin-right: 5px"
                >
                  {{ flavor }}
                </el-tag>
              </p>
            </el-col>
            <el-col :span="8">
              <p>
                <strong>归经：</strong>
                <el-tag
                  v-for="meridian in recipe.meridians"
                  :key="meridian"
                  size="small"
                  style="margin-right: 5px"
                >
                  {{ meridian }}
                </el-tag>
              </p>
              <p v-if="recipe.meridianText">
                <strong>归经说明：</strong>
                {{ recipe.meridianText }}
              </p>
            </el-col>
            <el-col :span="8">
              <p>
                <strong>适合体质：</strong>
                <el-tooltip
                  v-for="constitution in recipe.suitableConstitutions"
                  :key="constitution"
                  :content="getConstitutionDescription(constitution)"
                  placement="top"
                >
                  <el-tag size="small" type="success" style="margin-right: 5px; cursor: pointer">
                    {{ getConstitutionName(constitution) }}
                  </el-tag>
                </el-tooltip>
              </p>
              <p>
                <strong>禁忌体质：</strong>
                <el-tooltip
                  v-for="constitution in recipe.avoidConstitutions"
                  :key="constitution"
                  :content="getConstitutionDescription(constitution)"
                  placement="top"
                >
                  <el-tag size="small" type="danger" style="margin-right: 5px; cursor: pointer">
                    {{ getConstitutionName(constitution) }}
                  </el-tag>
                </el-tooltip>
              </p>
            </el-col>
          </el-row>
          <el-row v-if="recipe.analysis">
            <el-col :span="24">
              <p>
                <strong>中医分析：</strong>
                {{ recipe.analysis }}
              </p>
            </el-col>
          </el-row>
        </el-card>

        <!-- 标签 -->
        <el-card v-if="recipe.tags && recipe.tags.length" class="detail-card" header="标签">
          <el-tag v-for="tag in recipe.tags" :key="tag" style="margin-right: 5px">
            {{ tag }}
          </el-tag>
        </el-card>

        <!-- 食材 -->
        <el-card
          v-if="recipe.ingredients && recipe.ingredients.length"
          class="detail-card"
          header="食材清单"
        >
          <el-row :gutter="20">
            <el-col :span="12" v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <div class="ingredient-item-detail">
                <span class="ingredient-icon">{{ ingredient.icon || '🥘' }}</span>
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span class="ingredient-amount">{{ ingredient.amount }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 制作步骤 -->
        <el-card v-if="recipe.steps && recipe.steps.length" class="detail-card" header="制作步骤">
          <div class="steps-detail">
            <div v-for="(step, index) in recipe.steps" :key="step.order" class="step-item-detail">
              <div class="step-number">{{ step.order }}</div>
              <div class="step-content">{{ step.content }}</div>
            </div>
          </div>
        </el-card>

        <!-- 匹配信息 -->
        <el-card
          v-if="recipe.matchScore !== undefined || recipe.matchReason"
          class="detail-card"
          header="个性化匹配信息"
        >
          <p v-if="recipe.matchScore !== undefined">
            <strong>匹配分数：</strong>
            {{ recipe.matchScore }}分
          </p>
          <p v-if="recipe.matchReason">
            <strong>匹配原因：</strong>
            {{ recipe.matchReason }}
          </p>
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  recipe: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newVal => {
    visible.value = newVal
  }
)

// 监听 visible 变化，同步到父组件
watch(visible, newVal => {
  emit('update:modelValue', newVal)
})

// 工具函数
const getCategoryLabel = category => {
  const labels = {
    recommended: '推荐菜谱',
    warming: '温性菜谱',
    cooling: '凉性菜谱',
    quick: '快手菜谱'
  }
  return labels[category] || category
}

const getCategoryTagType = category => {
  const types = {
    recommended: 'success',
    warming: 'danger',
    cooling: 'info',
    quick: 'warning'
  }
  return types[category] || ''
}

const getDifficultyTagType = difficulty => {
  const types = {
    简单: 'success',
    中等: 'warning',
    困难: 'danger'
  }
  return types[difficulty] || ''
}

const getNatureTagType = nature => {
  const types = {
    温: 'danger',
    凉: 'info',
    平: 'success',
    热: 'danger',
    寒: 'info'
  }
  return types[nature] || ''
}

const formatDate = dateString => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-CN')
}

// 体质类型映射
const constitutionMap = {
  balanced: { name: '平和质', description: '阴阳气血调和，体态适中，面色红润，精力充沛' },
  qi_deficiency: { name: '气虚质', description: '元气不足，疲乏气短，容易出汗，抵抗力较弱' },
  yang_deficiency: { name: '阳虚质', description: '阳气不足，畏寒怕冷，手脚冰凉，喜热饮食' },
  yin_deficiency: { name: '阴虚质', description: '阴液亏少，口燥咽干，手足心热，喜冷饮' },
  phlegm_dampness: { name: '痰湿质', description: '痰湿凝聚，形体肥胖，腹部肥满，容易困倦' },
  damp_heat: { name: '湿热质', description: '湿热内蕴，面垢油光，口苦口干，容易长痘' },
  blood_stasis: { name: '血瘀质', description: '血行不畅，面色晦暗，容易出现瘀斑，肤色暗沉' },
  qi_stagnation: { name: '气郁质', description: '气机郁滞，情绪抑郁，容易焦虑，胸闷不舒' },
  special: { name: '特禀质', description: '先天禀赋不足或过敏体质，容易过敏，适应能力差' }
}

// 获取体质显示名称
const getConstitutionName = key => {
  return constitutionMap[key]?.name || key
}

// 获取体质描述
const getConstitutionDescription = key => {
  return constitutionMap[key]?.description || ''
}
</script>

<style scoped>
.recipe-detail {
  line-height: 1.6;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.detail-header h2 {
  margin: 0;
  color: #333;
}

.detail-content p {
  margin: 10px 0;
}

.detail-content ul,
.detail-content ol {
  padding-left: 20px;
}

.detail-content li {
  margin: 5px 0;
}

.detail-content h4 {
  margin: 15px 0 10px 0;
  color: #333;
}

/* 详情页面样式 */
.detail-card {
  margin-bottom: 20px;
}

.detail-card :deep(.el-card__header) {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.ingredient-item-detail {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.ingredient-icon {
  font-size: 20px;
  min-width: 24px;
}

.ingredient-name {
  flex: 1;
  font-weight: 500;
}

.ingredient-amount {
  color: #666;
  font-size: 14px;
}

.steps-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item-detail {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.step-number {
  min-width: 32px;
  height: 32px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.step-content {
  flex: 1;
  line-height: 1.6;
  padding-top: 5px;
}
</style>
