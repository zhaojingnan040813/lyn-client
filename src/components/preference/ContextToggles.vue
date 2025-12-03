<template>
    <div class="context-toggles-container">
        <div class="section-header">
            <h3 class="section-title">💊 当前状态</h3>
            <p class="section-desc">选择您当前的身体状态，我们将调整推荐</p>
        </div>

        <div class="toggles-grid">
            <div
                v-for="option in preferenceStore.conditionOptions"
                :key="option.value"
                class="toggle-item"
                :class="{ active: isSelected(option.value) }"
                @click="toggleCondition(option.value)"
            >
                <div class="toggle-content">
                    <span class="toggle-icon">{{ option.icon }}</span>
                    <span class="toggle-label">{{ option.label }}</span>
                </div>
                <div class="toggle-switch">
                    <div class="switch-track" :class="{ on: isSelected(option.value) }">
                        <div class="switch-thumb"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tips-section">
            <div class="tip-card">
                <span class="tip-icon">💡</span>
                <p class="tip-text">
                    选择当前身体状态后，系统将为您推荐更适合的食养方案。
                    例如经期时会避免推荐寒凉食物，感冒时会推荐清热解毒的食谱。
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePreferenceStore } from '../../stores/preference';

const preferenceStore = usePreferenceStore();

// 当前选中的状态
const selectedConditions = computed(
    () => preferenceStore.preference.currentConditions || []
);

// 检查是否选中
const isSelected = (value) => {
    return selectedConditions.value.includes(value);
};

// 切换状态
const toggleCondition = async (value) => {
    await preferenceStore.toggleCondition(value);
};
</script>

<style scoped>
.context-toggles-container {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    border: 1px solid var(--border-light);
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

.toggles-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
}

@media (min-width: 768px) {
    .toggles-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .toggles-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    background: var(--bg-secondary);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;
}

.toggle-item:hover {
    border-color: var(--primary-light);
    background: var(--bg-tertiary);
}

.toggle-item.active {
    border-color: var(--primary);
    background: var(--primary-light);
}

.toggle-content {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.toggle-icon {
    font-size: var(--text-xl);
}

.toggle-label {
    font-size: var(--text-base);
    color: var(--text-primary);
    font-weight: 500;
}

.toggle-switch {
    flex-shrink: 0;
}

.switch-track {
    width: 44px;
    height: 24px;
    background: var(--bg-tertiary);
    border-radius: 12px;
    position: relative;
    transition: all 0.3s ease;
}

.switch-track.on {
    background: var(--primary);
}

.switch-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.switch-track.on .switch-thumb {
    left: 22px;
}

/* 提示区域 */
.tips-section {
    margin-top: var(--space-6);
}

.tip-card {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-4);
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--bg-secondary) 100%);
    border-radius: var(--radius-md);
    border: 1px solid var(--primary-lighter);
}

.tip-icon {
    font-size: var(--text-xl);
    flex-shrink: 0;
}

.tip-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.6;
}
</style>
