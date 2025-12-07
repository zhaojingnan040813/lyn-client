<template>
  <div class="ai-add-dish">
    <div class="page-header">
      <h1>AI添加菜品</h1>
      <p>使用人工智能辅助您创建新的菜品</p>
    </div>

    <div class="content-wrapper">
      <!-- AI输入区域 -->
      <el-card class="ai-input-card" header="AI菜品生成">
        <el-form :model="aiForm" label-width="120px">
          <el-form-item label="菜品描述">
            <el-input
              v-model="aiForm.dishDescription"
              type="textarea"
              :rows="4"
              placeholder="请描述您想要创建的菜品，例如：一道适合夏季的清凉汤品，主要食材是冬瓜和排骨..."
            />
          </el-form-item>

          <el-form-item label="目标体质">
            <el-select
              v-model="aiForm.targetConstitution"
              placeholder="选择目标体质"
              style="width: 100%"
            >
              <el-option label="平和质" value="balanced" />
              <el-option label="气虚质" value="qi_deficiency" />
              <el-option label="阳虚质" value="yang_deficiency" />
              <el-option label="阴虚质" value="yin_deficiency" />
              <el-option label="痰湿质" value="phlegm_dampness" />
              <el-option label="湿热质" value="damp_heat" />
              <el-option label="血瘀质" value="blood_stasis" />
              <el-option label="气郁质" value="qi_stagnation" />
              <el-option label="特禀质" value="special" />
            </el-select>
          </el-form-item>

          <el-form-item label="特殊要求">
            <el-input
              v-model="aiForm.specialRequirements"
              placeholder="例如：低盐、素食、快手菜等"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="generateDish" :loading="generating" size="large">
              <el-icon><Cpu /></el-icon>
              AI生成菜品
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 生成结果区域 -->
      <el-card v-if="generatedDish" class="result-card" header="AI生成的菜品">
        <div class="dish-preview">
          <h3>{{ generatedDish.name }}</h3>
          <p>{{ generatedDish.description }}</p>

          <el-row :gutter="20">
            <el-col :span="8">
              <p>
                <strong>分类：</strong>
                {{ generatedDish.category }}
              </p>
              <p>
                <strong>烹饪时间：</strong>
                {{ generatedDish.cookingTime }}分钟
              </p>
              <p>
                <strong>难度：</strong>
                {{ generatedDish.difficulty }}
              </p>
            </el-col>
            <el-col :span="8">
              <p>
                <strong>性质：</strong>
                {{ generatedDish.nature }}
              </p>
              <p>
                <strong>味道：</strong>
                {{ generatedDish.flavors?.join(', ') }}
              </p>
              <p>
                <strong>归经：</strong>
                {{ generatedDish.meridians?.join(', ') }}
              </p>
            </el-col>
            <el-col :span="8">
              <p>
                <strong>适合体质：</strong>
                {{
                  generatedDish.suitableConstitutions?.map(c => getConstitutionName(c)).join(', ')
                }}
              </p>
              <p>
                <strong>避免体质：</strong>
                {{
                  generatedDish.avoidConstitutions?.map(c => getConstitutionName(c)).join(', ') ||
                  '无'
                }}
              </p>
            </el-col>
          </el-row>

          <div class="ingredients-section">
            <h4>食材清单</h4>
            <el-table :data="generatedDish.ingredients" size="small">
              <el-table-column prop="name" label="食材名称" />
              <el-table-column prop="amount" label="用量" />
              <el-table-column prop="icon" label="图标" />
            </el-table>
          </div>

          <div class="steps-section">
            <h4>制作步骤</h4>
            <ol>
              <li v-for="(step, index) in generatedDish.steps" :key="index">
                {{ step.content }}
              </li>
            </ol>
          </div>

          <div v-if="generatedDish.tags?.length" class="tags-section">
            <h4>标签</h4>
            <el-tag
              v-for="tag in generatedDish.tags"
              :key="tag"
              type="success"
              effect="light"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>

          <div v-if="generatedDish.analysis" class="analysis-section">
            <h4>AI分析</h4>
            <el-collapse>
              <el-collapse-item title="查看详细分析" name="analysis">
                <p class="analysis-content">{{ generatedDish.analysis }}</p>
              </el-collapse-item>
            </el-collapse>
          </div>

          <div class="actions">
            <el-button @click="clearResult" :disabled="generating || saving">清除结果</el-button>
            <el-button @click="regenerateDish" :disabled="generating">重新生成</el-button>
            <el-button type="success" @click="saveDish" :loading="saving" :disabled="generating">
              保存到菜品库
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe.js'

// Router和Store
const router = useRouter()
const recipeStore = useRecipeStore()

// 响应式数据
const generating = ref(false)
const saving = ref(false)
const generatedDish = ref(null)

// AI表单数据
const aiForm = reactive({
  dishDescription: '',
  targetConstitution: '',
  specialRequirements: ''
})

// 表单验证
const validateForm = () => {
  if (!aiForm.dishDescription.trim()) {
    ElMessage.warning('请输入菜品描述')
    return false
  }
  return true
}

// AI生成菜品
const generateDish = async () => {
  if (!validateForm()) return

  generating.value = true

  try {
    const data = await recipeStore.generateRecipeByAI({
      dishDescription: aiForm.dishDescription.trim(),
      targetConstitution: aiForm.targetConstitution || '',
      specialRequirements: aiForm.specialRequirements || ''
    })

    generatedDish.value = data
    ElMessage.success('AI菜品生成成功！')
  } catch (error) {
    console.error('AI生成菜品失败:', error)
    ElMessage.error(error.message || 'AI生成失败，请重试')
  } finally {
    generating.value = false
  }
}

// 重新生成
const regenerateDish = () => {
  generateDish()
}

// 保存菜品
const saveDish = async () => {
  if (!generatedDish.value) {
    ElMessage.warning('没有可保存的菜品')
    return
  }

  saving.value = true

  try {
    await recipeStore.saveAIGeneratedRecipe(generatedDish.value)
    ElMessage.success('菜品已保存到菜品库！')

    // 保存成功后询问用户是否跳转到菜品管理页面
    setTimeout(() => {
      ElMessage({
        message: '菜品保存成功！是否前往菜品管理页面查看？',
        type: 'success',
        duration: 0,
        showClose: true
      })

      // 自动跳转到菜品管理页面
      router.push('/dish-management')
    }, 1000)
  } catch (error) {
    console.error('保存菜品失败:', error)
    ElMessage.error(error.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 体质名称映射
const getConstitutionName = code => {
  const constitutionMap = {
    balanced: '平和质',
    qi_deficiency: '气虚质',
    yang_deficiency: '阳虚质',
    yin_deficiency: '阴虚质',
    phlegm_dampness: '痰湿质',
    damp_heat: '湿热质',
    blood_stasis: '血瘀质',
    qi_stagnation: '气郁质',
    special: '特禀质'
  }
  return constitutionMap[code] || code
}

// 清除生成结果
const clearResult = () => {
  generatedDish.value = null
}

// 重置表单
const resetForm = () => {
  aiForm.dishDescription = ''
  aiForm.targetConstitution = ''
  aiForm.specialRequirements = ''
  generatedDish.value = null
}
</script>

<style scoped>
.ai-add-dish {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.ai-input-card {
  margin-bottom: 30px;
}

.ai-input-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.result-card {
  margin-bottom: 30px;
}

.result-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.dish-preview h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 24px;
}

.dish-preview p {
  line-height: 1.6;
  margin-bottom: 15px;
  color: #666;
}

.ingredients-section,
.steps-section,
.tags-section,
.analysis-section {
  margin: 25px 0;
}

.ingredients-section h4,
.steps-section h4,
.tags-section h4,
.analysis-section h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
  border-bottom: 2px solid #e1e1e1;
  padding-bottom: 5px;
}

.steps-section ol {
  padding-left: 20px;
}

.steps-section li {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #555;
}

.tags-section .tag-item {
  margin-right: 8px;
  margin-bottom: 8px;
}

.analysis-content {
  line-height: 1.8;
  color: #555;
  font-size: 14px;
  margin: 0;
  padding: 10px 0;
}

.actions {
  margin-top: 30px;
  text-align: center;
}

.actions .el-button {
  margin: 0 10px;
  padding: 12px 25px;
  font-size: 16px;
}
</style>
