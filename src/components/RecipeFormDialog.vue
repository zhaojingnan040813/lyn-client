<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑菜品' : '添加菜品'"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标" prop="emoji">
            <el-input v-model="form.emoji" placeholder="输入emoji表情" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="分类" prop="category">
            <el-select v-model="form.category">
              <el-option label="平性类" value="neutral" />
              <el-option label="温补类" value="warming" />
              <el-option label="清润类" value="cooling" />
              <el-option label="快手菜谱" value="quick" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="烹饪时间" prop="cookingTime">
            <el-input-number v-model="form.cookingTime" :min="1" :max="999" />
            <span style="margin-left: 10px">分钟</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="难度" prop="difficulty">
            <el-select v-model="form.difficulty">
              <el-option label="简单" value="简单" />
              <el-option label="中等" value="中等" />
              <el-option label="困难" value="困难" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          placeholder="选择或输入标签"
        >
          <el-option label="素食" value="素食" />
          <el-option label="低脂" value="低脂" />
          <el-option label="高蛋白" value="高蛋白" />
          <el-option label="清淡" value="清淡" />
          <el-option label="辣" value="辣" />
          <el-option label="甜" value="甜" />
        </el-select>
      </el-form-item>

      <el-form-item label="食材" prop="ingredients">
        <div class="ingredients-section">
          <div v-for="(ingredient, index) in form.ingredients" :key="index" class="ingredient-item">
            <el-input
              v-model="ingredient.name"
              placeholder="食材名称"
              style="width: 150px; margin-right: 10px"
            />
            <el-input
              v-model="ingredient.amount"
              placeholder="用量"
              style="width: 120px; margin-right: 10px"
            />
            <el-input
              v-model="ingredient.icon"
              placeholder="图标"
              style="width: 100px; margin-right: 10px"
            />
            <el-button type="danger" size="small" @click="removeIngredient(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addIngredient">添加食材</el-button>
        </div>
      </el-form-item>

      <el-form-item label="制作步骤" prop="steps">
        <div class="steps-section">
          <div v-for="(step, index) in form.steps" :key="index" class="step-item">
            <div class="step-header">
              <span>步骤 {{ step.order }}</span>
              <el-button type="danger" size="small" @click="removeStep(index)">删除</el-button>
            </div>
            <el-input v-model="step.content" type="textarea" :rows="2" placeholder="步骤描述" />
          </div>
          <el-button type="primary" @click="addStep">添加步骤</el-button>
        </div>
      </el-form-item>

      <el-form-item label="启用状态">
        <el-switch v-model="form.isActive" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave" :loading="loading">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  recipe: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref()
const visible = ref(false)
const isEdit = ref(false)

const form = reactive({
  name: '',
  description: '',
  emoji: '',
  category: '',
  tags: [],
  ingredients: [],
  steps: [],
  cookingTime: 30,
  difficulty: '中等',
  isActive: true
})

const rules = {
  name: [{ required: true, message: '请输入菜名', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  emoji: [{ required: true, message: '请输入图标', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  cookingTime: [{ required: true, message: '请输入烹饪时间', trigger: 'blur' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }]
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newVal => {
    visible.value = newVal
    if (newVal) {
      isEdit.value = !!props.recipe
      if (props.recipe) {
        // 编辑模式，填充表单数据
        Object.assign(form, {
          ...props.recipe,
          ingredients: [...(props.recipe.ingredients || [])],
          steps: [...(props.recipe.steps || [])]
        })
      } else {
        // 新增模式，重置表单
        resetForm()
      }
    }
  }
)

// 监听 visible 变化，同步到父组件
watch(visible, newVal => {
  emit('update:modelValue', newVal)
})

// 添加食材
const addIngredient = () => {
  form.ingredients.push({
    name: '',
    amount: '',
    icon: ''
  })
}

// 删除食材
const removeIngredient = index => {
  form.ingredients.splice(index, 1)
}

// 添加步骤
const addStep = () => {
  form.steps.push({
    order: form.steps.length + 1,
    content: ''
  })
}

// 删除步骤
const removeStep = index => {
  form.steps.splice(index, 1)
  // 重新编号
  form.steps.forEach((step, i) => {
    step.order = i + 1
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: '',
    description: '',
    emoji: '',
    category: '',
    tags: [],
    ingredients: [],
    steps: [],
    cookingTime: 30,
    difficulty: '中等',
    isActive: true
  })
  formRef.value?.resetFields()
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  resetForm()
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 处理数据格式
    const data = {
      ...form,
      ingredients: form.ingredients.filter(item => item.name),
      steps: form.steps
        .filter(item => item.content)
        .map((item, index) => ({
          order: index + 1,
          content: item.content
        }))
    }

    emit('save', data, isEdit.value ? props.recipe?.id || props.recipe?._id : null)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.ingredients-section,
.steps-section {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.step-item {
  margin-bottom: 15px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-weight: bold;
}
</style>
