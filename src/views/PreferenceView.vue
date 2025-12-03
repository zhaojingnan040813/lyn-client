<template>
    <div class="preference-page">
        <div class="bg-texture"></div>
        <div class="bg-ink-wash"></div>

        <div class="page-header fade-in-down">
            <h1 class="page-title font-serif">口味调优</h1>
            <p class="page-subtitle">根据您的口味偏好，定制专属食养方案</p>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container fade-in">
            <div class="loading-spinner"></div>
            <p class="loading-text">加载偏好设置中...</p>
        </div>

        <!-- 主要内容 -->
        <div v-else class="preference-content">
            <!-- 步骤指示器 -->
            <div class="step-indicator fade-in-up">
                <div class="step completed">
                    <span class="step-number">1</span>
                    <span class="step-label">体质诊断</span>
                </div>
                <div class="step-line completed"></div>
                <div class="step active">
                    <span class="step-number">2</span>
                    <span class="step-label">口味调优</span>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <span class="step-number">3</span>
                    <span class="step-label">智膳推荐</span>
                </div>
            </div>

            <!-- 用户体质信息 -->
            <div v-if="userStore.constitution?.type" class="constitution-badge fade-in-up">
                <span class="badge-icon">{{ getConstitutionIcon(userStore.constitution.type) }}</span>
                <span class="badge-text">当前体质：{{ getConstitutionName(userStore.constitution.type) }}</span>
                <router-link to="/constitution" class="badge-link">修改</router-link>
            </div>

            <!-- 五味偏好 -->
            <div class="section fade-in-up" style="animation-delay: 0.1s">
                <FlavorSlider />
            </div>

            <!-- 饮食禁忌 -->
            <div class="section fade-in-up" style="animation-delay: 0.2s">
                <ExclusionTags />
            </div>

            <!-- 当前状态 -->
            <div class="section fade-in-up" style="animation-delay: 0.3s">
                <ContextToggles />
            </div>

            <!-- 用餐场景 -->
            <div class="section fade-in-up" style="animation-delay: 0.4s">
                <SceneSelector />
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons fade-in-up" style="animation-delay: 0.5s">
                <router-link to="/constitution" class="btn btn-outline">
                    ← 返回体质诊断
                </router-link>
                <button class="btn btn-secondary" @click="resetPreferences">
                    重置偏好
                </button>
                <router-link to="/recommendation" class="btn btn-primary">
                    获取推荐 →
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { usePreferenceStore } from '../stores/preference';
import FlavorSlider from '../components/preference/FlavorSlider.vue';
import ExclusionTags from '../components/preference/ExclusionTags.vue';
import ContextToggles from '../components/preference/ContextToggles.vue';
import SceneSelector from '../components/preference/SceneSelector.vue';

const userStore = useUserStore();
const preferenceStore = usePreferenceStore();

const loading = computed(() => preferenceStore.loading && !preferenceStore.hasLoaded);

// 体质图标映射
const constitutionIcons = {
    balanced: '☯️',
    qi_deficiency: '💨',
    yang_deficiency: '❄️',
    yin_deficiency: '🔥',
    phlegm_dampness: '💧',
    damp_heat: '🌡️',
    blood_stasis: '🩸',
    qi_stagnation: '😤',
    special: '🌟'
};

// 体质名称映射
const constitutionNames = {
    balanced: '平和质',
    qi_deficiency: '气虚质',
    yang_deficiency: '阳虚质',
    yin_deficiency: '阴虚质',
    phlegm_dampness: '痰湿质',
    damp_heat: '湿热质',
    blood_stasis: '血瘀质',
    qi_stagnation: '气郁质',
    special: '特禀质'
};

const getConstitutionIcon = (type) => constitutionIcons[type] || '❓';
const getConstitutionName = (type) => constitutionNames[type] || '未知体质';

// 重置偏好
const resetPreferences = async () => {
    if (confirm('确定要重置所有偏好设置吗？')) {
        await preferenceStore.resetPreference();
    }
};

onMounted(async () => {
    // 确保用户会话存在
    if (!userStore.sessionId) {
        await userStore.initSession();
    }
    // 加载用户偏好
    await preferenceStore.fetchPreference();
});
</script>

<style scoped>
.preference-page {
    position: relative;
    padding-bottom: var(--space-8);
    min-height: 100vh;
}

.page-header {
    text-align: center;
    margin-bottom: var(--space-6);
}

.page-title {
    font-size: var(--text-3xl);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.page-subtitle {
    font-size: var(--text-base);
    color: var(--text-secondary);
}

/* 加载状态 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-16);
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--border-light);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    margin-top: var(--space-4);
    color: var(--text-secondary);
    font-size: var(--text-sm);
}

/* 主要内容 */
.preference-content {
    max-width: 900px;
    margin: 0 auto;
}

/* 步骤指示器 */
.step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-8);
    padding: var(--space-4);
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
}

.step-number {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-tertiary);
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: var(--text-sm);
    transition: all 0.3s ease;
}

.step.completed .step-number {
    background: var(--primary);
    color: white;
}

.step.active .step-number {
    background: var(--primary);
    color: white;
    box-shadow: 0 0 0 4px var(--primary-light);
}

.step-label {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    white-space: nowrap;
}

.step.completed .step-label,
.step.active .step-label {
    color: var(--text-primary);
}

.step-line {
    width: 60px;
    height: 2px;
    background: var(--border-light);
    margin: 0 var(--space-2);
    margin-bottom: var(--space-6);
}

.step-line.completed {
    background: var(--primary);
}

/* 体质徽章 */
.constitution-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-5);
    background: var(--primary-light);
    border: 1px solid var(--primary-lighter);
    border-radius: var(--radius-full);
    margin-bottom: var(--space-6);
}

.badge-icon {
    font-size: var(--text-xl);
}

.badge-text {
    font-size: var(--text-sm);
    color: var(--text-primary);
}

.badge-link {
    font-size: var(--text-xs);
    color: var(--primary);
    text-decoration: underline;
}

/* 区块 */
.section {
    margin-bottom: var(--space-6);
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    justify-content: center;
    margin-top: var(--space-8);
    padding: var(--space-6);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
}

.btn {
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    font-size: var(--text-base);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
}

.btn-primary {
    background: var(--primary);
    color: white;
    border: none;
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    border: 1px solid var(--border-light);
}

.btn-secondary:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
}

.btn-outline {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-light);
}

.btn-outline:hover {
    border-color: var(--primary);
    color: var(--primary);
}

/* 动画 */
.fade-in {
    animation: fadeIn 0.5s ease forwards;
}

.fade-in-up {
    animation: fadeInUp 0.5s ease forwards;
}

.fade-in-down {
    animation: fadeInDown 0.5s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式 */
@media (max-width: 768px) {
    .step-indicator {
        transform: scale(0.9);
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
