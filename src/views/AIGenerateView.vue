<template>
    <div class="ai-generate-view">
        <div class="generate-header">
            <button class="back-btn" @click="handleBack">
                ← 返回管理后台
            </button>
            <h1>AI菜谱生成器</h1>
            <p>使用人工智能快速生成营养健康的菜谱</p>
        </div>

        <div class="generate-content">
            <!-- 步骤1: 输入食品名称 -->
            <FoodNameInput 
                v-if="step === 1" 
                @submit="handleFoodNameSubmit" 
                @cancel="handleBack"
            />

            <!-- 步骤2: 生成中状态 -->
            <GeneratingStatus 
                v-if="step === 2" 
                :loading="loading"
                :error="errorMessage"
                @retry="handleRetry"
                @cancel="handleBack"
            />

            <!-- 步骤3: 预览和编辑 -->
            <RecipePreview 
                v-if="step === 3" 
                :recipe="generatedRecipe"
                :saving="saving"
                @edit="handleEdit"
                @save="handleSave"
                @regenerate="handleRegenerate"
                @cancel="handleBack"
            />
        </div>

        <!-- 消息提示 -->
        <div v-if="message.show" class="message" :class="message.type">
            {{ message.text }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FoodNameInput from '../components/admin/FoodNameInput.vue';
import GeneratingStatus from '../components/admin/GeneratingStatus.vue';
import RecipePreview from '../components/admin/RecipePreview.vue';
import { generateRecipeByAI, saveAIGeneratedRecipe } from '../api/recipe.js';

const router = useRouter();

// 当前步骤
const step = ref(1);

// 加载状态
const loading = ref(false);

// 保存状态
const saving = ref(false);

// 错误信息
const errorMessage = ref('');

// 生成的菜谱数据
const generatedRecipe = ref(null);

// 当前食品名称
const currentFoodName = ref('');

// 消息提示
const message = ref({
    show: false,
    type: 'success',
    text: ''
});

// 返回管理后台
const handleBack = () => {
    router.push('/admin');
};

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
        saving.value = true;
        const response = await saveAIGeneratedRecipe(recipe);
        
        if (response.code === 0) {
            showMessage('AI生成菜谱保存成功', 'success');
            setTimeout(() => {
                router.push('/admin');
            }, 2000);
        } else {
            showMessage('保存失败: ' + (response.message || '未知错误'), 'error');
        }
    } catch (error) {
        console.error('保存菜谱失败:', error);
        showMessage('保存失败: ' + (error.message || '网络错误'), 'error');
    } finally {
        saving.value = false;
    }
};

// 显示消息
const showMessage = (text, type = 'success') => {
    message.value = {
        show: true,
        type,
        text
    };
    setTimeout(() => {
        message.value.show = false;
    }, 3000);
};
</script>

<style scoped>
.ai-generate-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 100vh;
}

.generate-header {
    margin-bottom: 32px;
}

.back-btn {
    padding: 8px 16px;
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    margin-bottom: 20px;
}

.back-btn:hover {
    background: var(--color-primary);
    color: white;
}

.generate-header h1 {
    font-size: 32px;
    margin: 0 0 8px 0;
    color: var(--color-text);
}

.generate-header p {
    color: var(--color-text-secondary);
    margin: 0;
    font-size: 16px;
}

.generate-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.message {
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    animation: slideIn 0.3s ease;
    z-index: 2000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message.success {
    background: #2ed573;
}

.message.error {
    background: #ff6b6b;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .ai-generate-view {
        padding: 20px 16px;
    }
    
    .generate-header h1 {
        font-size: 24px;
    }
    
    .generate-header p {
        font-size: 14px;
    }
}
</style>
