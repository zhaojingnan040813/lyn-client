<template>
    <div class="exclusion-tags-container">
        <div class="section-header">
            <h3 class="section-title">🚫 饮食禁忌</h3>
            <p class="section-desc">选择您需要避免的食物类型</p>
        </div>

        <div class="tags-grid">
            <button
                v-for="option in preferenceStore.restrictionOptions"
                :key="option.value"
                class="tag-item"
                :class="{ active: isSelected(option.value) }"
                @click="toggleTag(option.value)"
            >
                <span class="tag-icon">{{ option.icon }}</span>
                <span class="tag-label">{{ option.label }}</span>
                <span class="tag-check" v-if="isSelected(option.value)">✓</span>
            </button>
        </div>

        <!-- 自定义不喜欢的食材 -->
        <div class="custom-section">
            <h4 class="custom-title">🥗 不喜欢的食材</h4>
            <div class="custom-input-wrapper">
                <input
                    v-model="customIngredient"
                    type="text"
                    class="custom-input"
                    placeholder="输入食材名称，按回车添加"
                    @keyup.enter="addCustomIngredient"
                />
                <button class="add-btn" @click="addCustomIngredient">
                    添加
                </button>
            </div>
            <div class="custom-tags" v-if="dislikedIngredients.length > 0">
                <span
                    v-for="ingredient in dislikedIngredients"
                    :key="ingredient"
                    class="custom-tag"
                >
                    {{ ingredient }}
                    <button
                        class="remove-btn"
                        @click="removeIngredient(ingredient)"
                    >
                        ×
                    </button>
                </span>
            </div>
            <p v-else class="no-items-hint">暂未添加不喜欢的食材</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePreferenceStore } from '../../stores/preference';

const preferenceStore = usePreferenceStore();
const customIngredient = ref('');

// 当前选中的禁忌
const selectedRestrictions = computed(
    () => preferenceStore.preference.dietaryRestrictions || []
);

// 不喜欢的食材
const dislikedIngredients = computed(
    () => preferenceStore.preference.dislikedIngredients || []
);

// 检查是否选中
const isSelected = (value) => {
    return selectedRestrictions.value.includes(value);
};

// 切换标签
const toggleTag = async (value) => {
    await preferenceStore.toggleRestriction(value);
};

// 添加自定义食材
const addCustomIngredient = async () => {
    const ingredient = customIngredient.value.trim();
    if (ingredient) {
        await preferenceStore.addDislikedIngredient(ingredient);
        customIngredient.value = '';
    }
};

// 移除不喜欢的食材
const removeIngredient = async (ingredient) => {
    await preferenceStore.removeDislikedIngredient(ingredient);
};
</script>

<style scoped>
.exclusion-tags-container {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    backdrop-filter: blur(16px);
    padding: var(--space-6);
}

.section-header {
    text-align: center;
    margin-bottom: var(--space-6);
}

.section-title {
    font-size: var(--text-xl);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.section-desc {
    font-size: var(--text-sm);
    color: var(--text-secondary);
}

.tags-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
}

@media (min-width: 768px) {
    .tags-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .tags-grid {
        grid-template-columns: repeat(5, 1fr);
    }
}

.tag-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--bg-secondary);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.tag-item:hover {
    border-color: var(--primary);
    background: var(--primary-light);
}

.tag-item.active {
    border-color: var(--primary);
    background: var(--primary-light);
}

.tag-icon {
    font-size: var(--text-lg);
}

.tag-label {
    font-size: var(--text-sm);
    color: var(--text-primary);
    flex: 1;
}

.tag-check {
    font-size: var(--text-sm);
    color: var(--primary);
    font-weight: bold;
}

/* 自定义食材部分 */
.custom-section {
    margin-top: var(--space-6);
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-light);
}

.custom-title {
    font-size: var(--text-base);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
}

.custom-input-wrapper {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
}

.custom-input {
    flex: 1;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    background: var(--bg-secondary);
    transition: all 0.3s ease;
}

.custom-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
}

.add-btn {
    padding: var(--space-3) var(--space-5);
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-btn:hover {
    background: var(--primary-dark);
}

.custom-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.custom-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    background: var(--bg-tertiary);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    color: var(--text-secondary);
}

.remove-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: var(--text-tertiary);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s ease;
}

.remove-btn:hover {
    background: var(--error);
}

.no-items-hint {
    font-size: var(--text-sm);
    color: var(--text-tertiary);
    text-align: center;
    padding: var(--space-4);
}
</style>
