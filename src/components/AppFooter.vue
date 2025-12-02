<template>
    <footer class="floating-footer">
        <div class="footer-left">
            <div class="step-indicator">
                <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">1</div>
                <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
                <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">2</div>
                <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
                <div class="step" :class="{ active: currentStep === 3 }">3</div>
            </div>
            <span class="step-text">{{ stepText }}</span>
        </div>

        <div class="footer-right">
            <button v-if="showPrevButton" class="btn btn-outline" @click="handlePrev">
                ← 上一步
            </button>
            <button v-if="showNextButton" class="btn btn-primary" :disabled="!canProceed" @click="handleNext">
                {{ nextButtonText }} →
            </button>
        </div>
    </footer>
    <!-- 占位元素，防止内容被fixed footer遮挡 -->
    <div class="footer-placeholder"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 步骤映射
const stepMap = {
    'Constitution': 1,
    'Preference': 2,
    'Recommendation': 3
};

// 当前步骤
const currentStep = computed(() => stepMap[route.name] || 1);

// 步骤文本
const stepText = computed(() => {
    const texts = {
        1: '体质诊断',
        2: '口味调优',
        3: '智膳推荐'
    };
    return texts[currentStep.value] || '';
});

// 是否显示上一步按钮
const showPrevButton = computed(() => currentStep.value > 1);

// 是否显示下一步按钮
const showNextButton = computed(() => currentStep.value < 3);

// 是否可以进行下一步
const canProceed = computed(() => {
    if (currentStep.value === 1) {
        return userStore.hasConstitution;
    }
    return true;
});

// 下一步按钮文本
const nextButtonText = computed(() => {
    if (currentStep.value === 1) {
        return '调整口味';
    } else if (currentStep.value === 2) {
        return '查看推荐';
    }
    return '下一步';
});

// 上一步处理
const handlePrev = () => {
    if (currentStep.value === 2) {
        router.push('/constitution');
    } else if (currentStep.value === 3) {
        router.push('/preference');
    }
};

// 下一步处理
const handleNext = () => {
    if (currentStep.value === 1) {
        router.push('/preference');
    } else if (currentStep.value === 2) {
        router.push('/recommendation');
    }
};
</script>

<style scoped>
.footer-placeholder {
    height: var(--footer-height);
}

.footer-right {
    display: flex;
    gap: var(--space-3);
}
</style>
