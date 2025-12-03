<template>
    <div class="flavor-slider-container">
        <div class="section-header">
            <h3 class="section-title">🍴 五味偏好</h3>
            <p class="section-desc">调节您对各种口味的偏好程度</p>
        </div>

        <div class="flavor-sliders">
            <div
                v-for="(config, key) in preferenceStore.flavorLabels"
                :key="key"
                class="flavor-item"
            >
                <div class="flavor-header">
                    <span class="flavor-icon">{{ config.icon }}</span>
                    <span class="flavor-name">{{ config.name }}</span>
                    <span class="flavor-value">{{ localValues[key] }}</span>
                </div>
                <div class="slider-wrapper">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        :value="localValues[key]"
                        class="flavor-slider"
                        :style="{ '--slider-color': config.color }"
                        @input="onSliderInput(key, $event)"
                        @change="onSliderChange(key, $event)"
                    />
                    <div class="slider-labels">
                        <span>不喜欢</span>
                        <span>一般</span>
                        <span>非常喜欢</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { usePreferenceStore } from '../../stores/preference';

const preferenceStore = usePreferenceStore();

// 本地状态，用于实时更新滑块
const localValues = ref({
    sour: 50,
    sweet: 50,
    bitter: 50,
    spicy: 50,
    salty: 50
});

// 监听store变化，同步到本地
watch(
    () => preferenceStore.preference.flavorPreference,
    (newVal) => {
        if (newVal) {
            localValues.value = { ...newVal };
        }
    },
    { immediate: true, deep: true }
);

// 滑块输入时（拖动中）
const onSliderInput = (flavor, event) => {
    const value = parseInt(event.target.value);
    localValues.value[flavor] = value;
};

// 滑块变化完成时（松开鼠标）
const onSliderChange = async (flavor, event) => {
    const value = parseInt(event.target.value);
    await preferenceStore.updateFlavorPreference(flavor, value);
};

onMounted(() => {
    // 初始化本地值
    if (preferenceStore.preference.flavorPreference) {
        localValues.value = { ...preferenceStore.preference.flavorPreference };
    }
});
</script>

<style scoped>
.flavor-slider-container {
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

.flavor-sliders {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
}

.flavor-item {
    padding: var(--space-4);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    transition: all 0.3s ease;
}

.flavor-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.flavor-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
}

.flavor-icon {
    font-size: var(--text-xl);
}

.flavor-name {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    flex: 1;
}

.flavor-value {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--primary);
    background: var(--primary-light);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    min-width: 36px;
    text-align: center;
}

.slider-wrapper {
    width: 100%;
}

.flavor-slider {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(
        to right,
        var(--bg-tertiary) 0%,
        var(--slider-color, var(--primary)) 100%
    );
    border-radius: 4px;
    outline: none;
    cursor: pointer;
}

.flavor-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: white;
    border: 3px solid var(--slider-color, var(--primary));
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease;
}

.flavor-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
}

.flavor-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border: 3px solid var(--slider-color, var(--primary));
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-2);
    font-size: var(--text-xs);
    color: var(--text-tertiary);
}

/* 响应式 */
@media (min-width: 768px) {
    .flavor-sliders {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
    }
}

@media (min-width: 1024px) {
    .flavor-sliders {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>
