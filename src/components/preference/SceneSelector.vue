<template>
    <div class="scene-selector-container">
        <div class="section-header">
            <h3 class="section-title">🍽️ 用餐场景</h3>
            <p class="section-desc">选择您常见的用餐场景，获取更精准推荐</p>
        </div>

        <div class="scenes-grid">
            <div
                v-for="option in preferenceStore.scenarioOptions"
                :key="option.value"
                class="scene-card"
                :class="{ active: isSelected(option.value) }"
                @click="toggleScenario(option.value)"
            >
                <div class="scene-icon">{{ option.icon }}</div>
                <div class="scene-label">{{ option.label }}</div>
                <div class="scene-check" v-if="isSelected(option.value)">
                    <svg viewBox="0 0 24 24" class="check-icon">
                        <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                        />
                    </svg>
                </div>
            </div>
        </div>

        <!-- 烹饪偏好 -->
        <div class="cooking-prefs">
            <div class="pref-item">
                <div class="pref-header">
                    <span class="pref-icon">⏱️</span>
                    <span class="pref-label">烹饪时间</span>
                </div>
                <div class="time-options">
                    <button
                        v-for="option in timeOptions"
                        :key="option.value"
                        class="time-btn"
                        :class="{ active: selectedTime === option.value }"
                        @click="selectTime(option.value)"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <div class="pref-item">
                <div class="pref-header">
                    <span class="pref-icon">👨‍🍳</span>
                    <span class="pref-label">烹饪难度</span>
                </div>
                <div class="difficulty-selector">
                    <button
                        v-for="level in 5"
                        :key="level"
                        class="difficulty-star"
                        :class="{ active: level <= selectedDifficulty }"
                        @click="selectDifficulty(level)"
                    >
                        {{ level <= selectedDifficulty ? '⭐' : '☆' }}
                    </button>
                    <span class="difficulty-label">{{ difficultyLabel }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePreferenceStore } from '../../stores/preference';

const preferenceStore = usePreferenceStore();

// 烹饪时间选项
const timeOptions = [
    { value: 15, label: '15分钟内' },
    { value: 30, label: '30分钟内' },
    { value: 60, label: '1小时内' },
    { value: 120, label: '不限时' }
];

// 难度标签
const difficultyLabels = ['', '新手友好', '简单', '中等', '较难', '大厨级'];

// 本地状态
const selectedTime = ref(60);
const selectedDifficulty = ref(3);

// 当前选中的场景
const selectedScenarios = computed(
    () => preferenceStore.preference.mealScenarios || []
);

// 难度标签
const difficultyLabel = computed(() => difficultyLabels[selectedDifficulty.value]);

// 监听store变化
watch(
    () => preferenceStore.preference,
    (newVal) => {
        if (newVal.maxCookingTime) {
            selectedTime.value = newVal.maxCookingTime;
        }
        if (newVal.cookingDifficulty) {
            selectedDifficulty.value = newVal.cookingDifficulty;
        }
    },
    { immediate: true, deep: true }
);

// 检查是否选中
const isSelected = (value) => {
    return selectedScenarios.value.includes(value);
};

// 切换场景
const toggleScenario = async (value) => {
    await preferenceStore.toggleScenario(value);
};

// 选择烹饪时间
const selectTime = async (value) => {
    selectedTime.value = value;
    await preferenceStore.updatePreference({ maxCookingTime: value });
};

// 选择烹饪难度
const selectDifficulty = async (level) => {
    selectedDifficulty.value = level;
    await preferenceStore.updatePreference({ cookingDifficulty: level });
};
</script>

<style scoped>
.scene-selector-container {
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

.scenes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
}

@media (min-width: 768px) {
    .scenes-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .scenes-grid {
        grid-template-columns: repeat(5, 1fr);
    }
}

.scene-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4);
    background: var(--bg-secondary);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.scene-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.scene-card.active {
    border-color: var(--primary);
    background: var(--primary-light);
}

.scene-icon {
    font-size: 28px;
}

.scene-label {
    font-size: var(--text-sm);
    color: var(--text-primary);
    font-weight: 500;
    text-align: center;
}

.scene-check {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.check-icon {
    width: 14px;
    height: 14px;
    color: white;
}

/* 烹饪偏好 */
.cooking-prefs {
    margin-top: var(--space-6);
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
}

@media (min-width: 768px) {
    .cooking-prefs {
        flex-direction: row;
        gap: var(--space-8);
    }
}

.pref-item {
    flex: 1;
}

.pref-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
}

.pref-icon {
    font-size: var(--text-lg);
}

.pref-label {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
}

.time-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.time-btn {
    padding: var(--space-2) var(--space-4);
    background: var(--bg-secondary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
}

.time-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.time-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
}

.difficulty-selector {
    display: flex;
    align-items: center;
    gap: var(--space-1);
}

.difficulty-star {
    background: none;
    border: none;
    font-size: var(--text-xl);
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s ease;
}

.difficulty-star:hover {
    transform: scale(1.2);
}

.difficulty-star.active {
    color: #FFD700;
}

.difficulty-label {
    margin-left: var(--space-3);
    font-size: var(--text-sm);
    color: var(--text-secondary);
}
</style>
