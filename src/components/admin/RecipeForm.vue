<template>
    <div class="recipe-form-modal" v-if="visible" @click="handleClose">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>{{ isEdit ? '编辑菜谱' : '新增菜谱' }}</h2>
                <button class="close-btn" @click="handleClose">×</button>
            </div>

            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                    <!-- 基本信息 -->
                    <div class="form-section">
                        <h3>基本信息</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>菜名 <span class="required">*</span></label>
                                <input v-model="formData.name" type="text" placeholder="请输入菜名" required />
                            </div>
                            <div class="form-group">
                                <label>Emoji</label>
                                <input v-model="formData.emoji" type="text" placeholder="🍲" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>描述 <span class="required">*</span></label>
                            <textarea v-model="formData.description" rows="3" placeholder="请输入菜谱描述" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>图片URL</label>
                            <input v-model="formData.image" type="text" placeholder="请输入图片URL" />
                        </div>
                    </div>

                    <!-- 性味归经 -->
                    <div class="form-section">
                        <h3>性味归经</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>性味 <span class="required">*</span></label>
                                <select v-model="formData.nature" required>
                                    <option value="">请选择</option>
                                    <option value="寒">寒</option>
                                    <option value="凉">凉</option>
                                    <option value="平">平</option>
                                    <option value="温">温</option>
                                    <option value="热">热</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>难度</label>
                                <select v-model="formData.difficulty">
                                    <option value="简单">简单</option>
                                    <option value="中等">中等</option>
                                    <option value="困难">困难</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>口味</label>
                            <div class="checkbox-group">
                                <label v-for="flavor in flavorOptions" :key="flavor">
                                    <input type="checkbox" :value="flavor" v-model="formData.flavors" />
                                    {{ flavor }}
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>归经（用逗号分隔）</label>
                            <input v-model="meridiansStr" type="text" placeholder="如：肝,脾,胃" />
                        </div>
                    </div>

                    <!-- 体质适宜性 -->
                    <div class="form-section">
                        <h3>体质适宜性</h3>
                        <div class="form-group">
                            <label>适宜体质</label>
                            <div class="checkbox-group">
                                <label v-for="constitution in constitutionOptions" :key="constitution.value">
                                    <input type="checkbox" :value="constitution.value" v-model="formData.suitableConstitutions" />
                                    {{ constitution.label }}
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>忌用体质</label>
                            <div class="checkbox-group">
                                <label v-for="constitution in constitutionOptions" :key="constitution.value">
                                    <input type="checkbox" :value="constitution.value" v-model="formData.avoidConstitutions" />
                                    {{ constitution.label }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- 分类标签 -->
                    <div class="form-section">
                        <h3>分类标签</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>分类</label>
                                <select v-model="formData.category">
                                    <option value="warming">温补</option>
                                    <option value="cooling">清润</option>
                                    <option value="neutral">平和</option>
                                    <option value="quick">快手</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>烹饪时间（分钟）</label>
                                <input v-model.number="formData.cookingTime" type="number" min="0" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>标签（用逗号分隔）</label>
                            <input v-model="tagsStr" type="text" placeholder="如：养生,健康,美味" />
                        </div>
                    </div>

                    <!-- 食材 -->
                    <div class="form-section">
                        <h3>食材</h3>
                        <div class="ingredient-list">
                            <div v-for="(ingredient, index) in formData.ingredients" :key="index" class="ingredient-item">
                                <input v-model="ingredient.name" type="text" placeholder="食材名称" />
                                <input v-model="ingredient.amount" type="text" placeholder="用量" />
                                <input v-model="ingredient.icon" type="text" placeholder="图标" class="short-input" />
                                <button type="button" class="btn-remove" @click="removeIngredient(index)">删除</button>
                            </div>
                        </div>
                        <button type="button" class="btn-add" @click="addIngredient">+ 添加食材</button>
                    </div>

                    <!-- 步骤 -->
                    <div class="form-section">
                        <h3>烹饪步骤</h3>
                        <div class="step-list">
                            <div v-for="(step, index) in formData.steps" :key="index" class="step-item">
                                <span class="step-number">{{ index + 1 }}</span>
                                <textarea v-model="step.content" rows="2" placeholder="请输入步骤内容"></textarea>
                                <button type="button" class="btn-remove" @click="removeStep(index)">删除</button>
                            </div>
                        </div>
                        <button type="button" class="btn-add" @click="addStep">+ 添加步骤</button>
                    </div>

                    <!-- 其他信息 -->
                    <div class="form-section">
                        <h3>其他信息</h3>
                        <div class="form-group">
                            <label>食养分析</label>
                            <textarea v-model="formData.analysis" rows="3" placeholder="请输入食养分析"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>基础匹配分数（0-100）</label>
                                <input v-model.number="formData.baseScore" type="number" min="0" max="100" />
                            </div>
                            <div class="form-group">
                                <label>排序权重</label>
                                <input v-model.number="formData.sortOrder" type="number" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="formData.isActive" />
                                启用此菜谱
                            </label>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" @click="handleClose">取消</button>
                        <button type="submit" class="btn-submit">{{ isEdit ? '保存' : '创建' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    recipe: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'submit']);

// 是否为编辑模式
const isEdit = computed(() => !!props.recipe);

// 表单数据
const formData = ref({
    name: '',
    description: '',
    image: '',
    emoji: '🍲',
    nature: '',
    flavors: [],
    meridians: [],
    suitableConstitutions: [],
    avoidConstitutions: [],
    category: 'neutral',
    tags: [],
    ingredients: [],
    steps: [],
    cookingTime: 30,
    difficulty: '简单',
    analysis: '',
    baseScore: 80,
    isActive: true,
    sortOrder: 0
});

// 辅助字符串字段
const meridiansStr = ref('');
const tagsStr = ref('');

// 选项
const flavorOptions = ['酸', '甘', '苦', '辛', '咸'];
const constitutionOptions = [
    { value: 'balanced', label: '平和质' },
    { value: 'qi_deficiency', label: '气虚质' },
    { value: 'yang_deficiency', label: '阳虚质' },
    { value: 'yin_deficiency', label: '阴虚质' },
    { value: 'phlegm_dampness', label: '痰湿质' },
    { value: 'damp_heat', label: '湿热质' },
    { value: 'blood_stasis', label: '血瘀质' },
    { value: 'qi_stagnation', label: '气郁质' },
    { value: 'special', label: '特禀质' }
];

// 重置表单
const resetForm = () => {
    formData.value = {
        name: '',
        description: '',
        image: '',
        emoji: '🍲',
        nature: '',
        flavors: [],
        meridians: [],
        suitableConstitutions: [],
        avoidConstitutions: [],
        category: 'neutral',
        tags: [],
        ingredients: [],
        steps: [],
        cookingTime: 30,
        difficulty: '简单',
        analysis: '',
        baseScore: 80,
        isActive: true,
        sortOrder: 0
    };
    meridiansStr.value = '';
    tagsStr.value = '';
};

// 监听菜谱变化，初始化表单
watch(() => props.recipe, (recipe) => {
    if (recipe) {
        formData.value = {
            name: recipe.name || '',
            description: recipe.description || '',
            image: recipe.image || '',
            emoji: recipe.emoji || '🍲',
            nature: recipe.nature || '',
            flavors: recipe.flavors || [],
            meridians: recipe.meridians || [],
            suitableConstitutions: recipe.suitableConstitutions || [],
            avoidConstitutions: recipe.avoidConstitutions || [],
            category: recipe.category || 'neutral',
            tags: recipe.tags || [],
            ingredients: recipe.ingredients?.length ? [...recipe.ingredients] : [],
            steps: recipe.steps?.length ? [...recipe.steps] : [],
            cookingTime: recipe.cookingTime || 30,
            difficulty: recipe.difficulty || '简单',
            analysis: recipe.analysis || '',
            baseScore: recipe.baseScore || 80,
            isActive: recipe.isActive !== false,
            sortOrder: recipe.sortOrder || 0
        };
        meridiansStr.value = recipe.meridians?.join(',') || '';
        tagsStr.value = recipe.tags?.join(',') || '';
    } else {
        resetForm();
    }
}, { immediate: true });

// 添加食材
const addIngredient = () => {
    formData.value.ingredients.push({ name: '', amount: '', icon: '🥬' });
};

// 删除食材
const removeIngredient = (index) => {
    formData.value.ingredients.splice(index, 1);
};

// 添加步骤
const addStep = () => {
    formData.value.steps.push({ order: formData.value.steps.length + 1, content: '' });
};

// 删除步骤
const removeStep = (index) => {
    formData.value.steps.splice(index, 1);
    // 重新排序
    formData.value.steps.forEach((step, i) => {
        step.order = i + 1;
    });
};

// 关闭弹窗
const handleClose = () => {
    emit('close');
};

// 提交表单
const handleSubmit = () => {
    // 处理归经和标签
    formData.value.meridians = meridiansStr.value.split(',').filter(s => s.trim()).map(s => s.trim());
    formData.value.tags = tagsStr.value.split(',').filter(s => s.trim()).map(s => s.trim());

    // 过滤空的食材
    formData.value.ingredients = formData.value.ingredients.filter(ing => ing.name && ing.amount);

    // 过滤空的步骤并重新排序
    formData.value.steps = formData.value.steps
        .filter(step => step.content)
        .map((step, index) => ({ order: index + 1, content: step.content }));

    emit('submit', { ...formData.value });
};
</script>

<style scoped>
.recipe-form-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: var(--color-text);
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

.form-section {
    margin-bottom: 32px;
}

.form-section h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: var(--color-primary);
    border-left: 3px solid var(--color-primary);
    padding-left: 12px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--color-text);
}

.required {
    color: #ff6b6b;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--color-primary);
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.ingredient-list,
.step-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
}

.ingredient-item {
    display: grid;
    grid-template-columns: 2fr 1fr 80px auto;
    gap: 12px;
    align-items: center;
}

.short-input {
    width: 80px;
}

.step-item {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: 12px;
    align-items: start;
}

.step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    font-weight: bold;
    margin-top: 8px;
}

.btn-add {
    padding: 8px 16px;
    background: var(--color-bg);
    border: 1px dashed var(--color-border);
    border-radius: 6px;
    cursor: pointer;
    color: var(--color-primary);
    transition: all 0.3s ease;
}

.btn-add:hover {
    background: rgba(var(--color-primary-rgb), 0.1);
    border-color: var(--color-primary);
}

.btn-remove {
    padding: 6px 12px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: opacity 0.3s ease;
}

.btn-remove:hover {
    opacity: 0.8;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
}

.btn-cancel,
.btn-submit {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.btn-cancel {
    background: var(--color-bg);
    color: var(--color-text);
}

.btn-cancel:hover {
    background: var(--color-border);
}

.btn-submit {
    background: var(--color-primary);
    color: white;
}

.btn-submit:hover {
    opacity: 0.9;
}
</style>
