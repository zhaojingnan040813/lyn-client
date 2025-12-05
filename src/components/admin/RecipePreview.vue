<template>
  <div class="recipe-preview">
    <div class="preview-header">
      <h2>菜谱预览 ✨</h2>
      <div class="ai-badge">
        🤖 AI生成
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-if="!isEditing" class="preview-mode">
      <RecipeCard :recipe="recipe" />
      
      <div class="preview-actions">
        <button @click="handleEdit" class="btn-edit">
          编辑菜谱
        </button>
        <button @click="handleSave" class="btn-save" :disabled="saving">
          {{ saving ? '保存中...' : '保存菜谱' }}
        </button>
        <button @click="handleRegenerate" class="btn-regenerate">
          重新生成
        </button>
        <button @click="handleCancel" class="btn-cancel">
          取消
        </button>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="edit-mode">
      <RecipeForm 
        :visible="true"
        :recipe="editableRecipe"
        @submit="handleFormSubmit"
        @close="handleEditCancel"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import RecipeCard from '../recipe/RecipeCard.vue';
import RecipeForm from './RecipeForm.vue';

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'save', 'regenerate', 'cancel']);

// 是否在编辑状态
const isEditing = ref(false);

// 可编辑的菜谱数据
const editableRecipe = ref(null);

// 格式化菜谱数据用于显示
const displayRecipe = computed(() => {
  return {
    ...props.recipe,
    // 确保食材和步骤格式正确
    ingredients: props.recipe.ingredients || [],
    steps: props.recipe.steps || []
  };
});

// 进入编辑模式
const handleEdit = () => {
  editableRecipe.value = JSON.parse(JSON.stringify(props.recipe));
  isEditing.value = true;
};

// 退出编辑模式
const handleEditCancel = () => {
  isEditing.value = false;
  editableRecipe.value = null;
};

// 处理表单提交
const handleFormSubmit = (recipeData) => {
  editableRecipe.value = recipeData;
  isEditing.value = false;
};

// 保存菜谱
const handleSave = () => {
  const recipeToSave = editableRecipe.value || props.recipe;
  
  // 验证必填字段
  const requiredFields = ['name', 'description', 'nature', 'ingredients', 'steps'];
  const missingFields = requiredFields.filter(field => !recipeToSave[field]);
  
  if (missingFields.length > 0) {
    alert('请完善必填字段: ' + missingFields.join(', '));
    return;
  }

  // 触发保存事件，让父组件处理API调用
  emit('save', recipeToSave);
};

// 重新生成
const handleRegenerate = () => {
  emit('regenerate');
};

// 取消
const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.recipe-preview {
  padding: 24px;
  max-width: 800px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.preview-header h2 {
  margin: 0;
  color: var(--color-primary);
  font-size: 24px;
}

.ai-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.preview-mode {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding: 20px;
  background: var(--color-bg);
  border-radius: 8px;
}

.btn-edit,
.btn-save,
.btn-regenerate,
.btn-cancel {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-edit {
  background: #4a90e2;
  color: white;
}

.btn-edit:hover {
  background: #357abd;
}

.btn-save {
  background: #51cf66;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #40c057;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-regenerate {
  background: #f59f00;
  color: white;
}

.btn-regenerate:hover {
  background: #d48806;
}

.btn-cancel {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-cancel:hover {
  background: var(--color-border);
}

.edit-mode {
  position: relative;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .preview-actions {
    grid-template-columns: 1fr;
  }
}
</style>
