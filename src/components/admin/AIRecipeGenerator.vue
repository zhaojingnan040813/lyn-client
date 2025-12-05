<template>
  <div v-if="visible" class="ai-recipe-generator">
    <!-- 步骤1: 输入食品名称 -->
    <FoodNameInput 
      v-if="step === 1" 
      @submit="handleFoodNameSubmit" 
      @cancel="handleCancel"
    />

    <!-- 步骤2: 生成中状态 -->
    <GeneratingStatus 
      v-if="step === 2" 
      :loading="loading"
      :error="errorMessage"
      @retry="handleRetry"
      @cancel="handleCancel"
    />

    <!-- 步骤3: 预览和编辑 -->
    <RecipePreview 
      v-if="step === 3" 
      :recipe="generatedRecipe"
      @edit="handleEdit"
      @save="handleSave"
      @regenerate="handleRegenerate"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FoodNameInput from './FoodNameInput.vue';
import GeneratingStatus from './GeneratingStatus.vue';
import RecipePreview from './RecipePreview.vue';
import { generateRecipeByAI, saveAIGeneratedRecipe } from '../../api/recipe.js';

const emit = defineEmits(['close', 'success']);

// 当前步骤
const step = ref(1);

// 加载状态
const loading = ref(false);

// 错误信息
const errorMessage = ref('');

// 生成的菜谱数据
const generatedRecipe = ref(null);

// 当前食品名称
const currentFoodName = ref('');

// 处理食品名称提交
const handleFoodNameSubmit = async (foodName) => {
  currentFoodName.value = foodName;
  step.value = 2;
  await generateRecipe(foodName);
};

// 生成菜谱
const generateRecipe = async (foodName) => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await generateRecipeByAI({ foodName });
    
    if (response.code === 0) {
      generatedRecipe.value = response.data;
      step.value = 3;
    } else {
      errorMessage.value = response.message || '生成失败';
    }
  } catch (error) {
    console.error('生成菜谱失败:', error);
    errorMessage.value = error.message || '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 重新生成
const handleRetry = () => {
  if (currentFoodName.value) {
    generateRecipe(currentFoodName.value);
  }
};

// 重新生成（从预览页面）
const handleRegenerate = () => {
  step.value = 2;
  generateRecipe(currentFoodName.value);
};

// 编辑菜谱
const handleEdit = (recipe) => {
  generatedRecipe.value = recipe;
};

// 保存菜谱
const handleSave = async (recipe) => {
  try {
    const response = await saveAIGeneratedRecipe(recipe);
    
    if (response.code === 0) {
      emit('success', 'AI生成菜谱保存成功');
      emit('close');
    } else {
      alert('保存失败: ' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('保存菜谱失败:', error);
    alert('保存失败: ' + (error.message || '网络错误'));
  }
};

// 取消操作
const handleCancel = () => {
  emit('close');
};
</script>

<style scoped>
.ai-recipe-generator {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
