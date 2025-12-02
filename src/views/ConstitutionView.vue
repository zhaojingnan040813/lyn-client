<template>
    <div class="constitution-page">
        <!-- 背景装饰 -->
        <div class="bg-texture"></div>
        <div class="bg-ink-wash"></div>

        <!-- 页面标题 -->
        <div class="page-header fade-in-down">
            <h1 class="page-title font-serif">体质诊断</h1>
            <p class="page-subtitle">了解您的中医体质类型，开启个性化食养之旅</p>
        </div>

        <!-- 诊断方式选择 -->
        <div class="diagnosis-tabs card fade-in-up">
            <div class="tabs-header">
                <button class="tab-btn" :class="{ active: activeTab === 'manual' }" @click="activeTab = 'manual'">
                    <span class="tab-icon">🎯</span>
                    手动选择体质
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'ai' }" @click="activeTab = 'ai'" disabled>
                    <span class="tab-icon">🤖</span>
                    AI问诊（开发中）
                </button>
            </div>

            <!-- 手动选择体质 -->
            <div v-if="activeTab === 'manual'" class="tab-content">
                <p class="tab-description">
                    请根据您的日常身体状态，选择最符合您的体质类型
                </p>

                <!-- 加载状态 -->
                <div v-if="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>正在加载体质数据...</p>
                </div>

                <!-- 体质卡片网格 -->
                <div v-else class="constitution-grid">
                    <div v-for="item in constitutions" :key="item.type" class="constitution-card glass-card"
                        :class="{ selected: selectedType === item.type }" @click="selectConstitution(item.type)"
                        :style="{ '--card-color': item.color }">
                        <div class="card-icon">{{ item.icon }}</div>
                        <h3 class="card-title font-serif">{{ item.name }}</h3>
                        <p class="card-desc">{{ item.description }}</p>
                        <div class="card-tags">
                            <span v-for="(char, idx) in item.characteristics?.slice(0, 3)" :key="idx" class="tag">
                                {{ char }}
                            </span>
                        </div>
                        <div v-if="selectedType === item.type" class="selected-indicator">
                            ✓ 已选择
                        </div>
                    </div>
                </div>

                <!-- 确认选择按钮 -->
                <div v-if="selectedType && selectedType !== userStore.constitution?.type" class="confirm-section">
                    <button class="btn btn-primary btn-lg" @click="confirmSelection" :disabled="saving">
                        {{ saving ? '保存中...' : '确认选择' }}
                    </button>
                </div>
            </div>

            <!-- AI问诊 -->
            <div v-if="activeTab === 'ai'" class="tab-content">
                <div class="ai-placeholder">
                    <span class="placeholder-icon">🔮</span>
                    <h3>AI智能问诊</h3>
                    <p>通过智能问答，精准分析您的体质类型</p>
                    <p class="coming-soon">功能开发中，敬请期待...</p>
                </div>
            </div>
        </div>

        <!-- 当前体质信息 -->
        <div v-if="userStore.constitutionInfo" class="current-constitution card fade-in">
            <div class="constitution-summary">
                <div class="summary-icon" :style="{ background: userStore.constitutionInfo.color }">
                    {{ userStore.constitutionInfo.icon }}
                </div>
                <div class="summary-content">
                    <h3 class="summary-title font-serif">
                        您当前的体质：{{ userStore.constitutionInfo.name }}
                    </h3>
                    <p class="summary-desc">{{ userStore.constitutionInfo.description }}</p>
                </div>
            </div>

            <div class="dietary-guidelines">
                <div class="guideline-section">
                    <h4 class="section-title">
                        <span class="title-icon">✅</span> 宜吃食物
                    </h4>
                    <div class="tag-list">
                        <span v-for="food in userStore.constitutionInfo.dietaryGuidelines?.recommended" :key="food"
                            class="tag tag-primary">
                            {{ food }}
                        </span>
                    </div>
                </div>
                <div class="guideline-section">
                    <h4 class="section-title">
                        <span class="title-icon">❌</span> 忌吃食物
                    </h4>
                    <div class="tag-list">
                        <span v-for="food in userStore.constitutionInfo.dietaryGuidelines?.avoided" :key="food"
                            class="tag tag-hot">
                            {{ food }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { constitutionApi } from '../api';

const userStore = useUserStore();

// 状态
const activeTab = ref('manual');
const constitutions = ref([]);
const selectedType = ref(null);
const loading = ref(true);
const saving = ref(false);

// 初始化
onMounted(async () => {
    // 初始化用户会话
    await userStore.initSession();

    // 加载体质列表
    await loadConstitutions();

    // 如果用户已有体质，设置为选中状态
    if (userStore.constitution?.type) {
        selectedType.value = userStore.constitution.type;
    }
});

// 加载体质列表
const loadConstitutions = async () => {
    try {
        loading.value = true;
        const response = await constitutionApi.getConstitutions();
        if (response.code === 0) {
            constitutions.value = response.data;
        }
    } catch (error) {
        console.error('Failed to load constitutions:', error);
    } finally {
        loading.value = false;
    }
};

// 选择体质
const selectConstitution = (type) => {
    selectedType.value = type;
};

// 确认选择
const confirmSelection = async () => {
    if (!selectedType.value) return;

    try {
        saving.value = true;
        const success = await userStore.setConstitution(selectedType.value, 'manual');
        if (success) {
            console.log('Constitution set successfully');
        }
    } catch (error) {
        console.error('Failed to set constitution:', error);
    } finally {
        saving.value = false;
    }
};
</script>

<style scoped>
.constitution-page {
    position: relative;
    padding-bottom: var(--space-8);
}

.page-header {
    text-align: center;
    margin-bottom: var(--space-8);
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

.diagnosis-tabs {
    margin-bottom: var(--space-6);
}

.tabs-header {
    display: flex;
    gap: var(--space-2);
    padding: var(--space-4);
    border-bottom: 1px solid var(--border-light);
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition-fast);
}

.tab-btn:hover:not(:disabled) {
    background: var(--primary-alpha-10);
    color: var(--primary-dark);
}

.tab-btn.active {
    background: var(--primary-alpha-10);
    border-color: var(--primary);
    color: var(--primary-dark);
}

.tab-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tab-icon {
    font-size: var(--text-lg);
}

.tab-content {
    padding: var(--space-6);
}

.tab-description {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
}

.loading-state {
    text-align: center;
    padding: var(--space-12);
    color: var(--text-muted);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    margin: 0 auto var(--space-4);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.constitution-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-5);
}

.constitution-card {
    padding: var(--space-5);
    cursor: pointer;
    position: relative;
    border: 2px solid transparent;
    transition: var(--transition-normal);
}

.constitution-card:hover {
    border-color: var(--card-color, var(--primary));
}

.constitution-card.selected {
    border-color: var(--card-color, var(--primary));
    background: rgba(255, 255, 255, 0.9);
}

.card-icon {
    font-size: var(--text-4xl);
    margin-bottom: var(--space-3);
}

.card-title {
    font-size: var(--text-xl);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.card-desc {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-3);
    line-height: var(--leading-relaxed);
}

.card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.selected-indicator {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    padding: var(--space-1) var(--space-3);
    background: var(--success);
    color: var(--text-inverse);
    font-size: var(--text-xs);
    font-weight: 600;
    border-radius: var(--radius-full);
}

.confirm-section {
    display: flex;
    justify-content: center;
    margin-top: var(--space-8);
}

.ai-placeholder {
    text-align: center;
    padding: var(--space-12);
    color: var(--text-muted);
}

.placeholder-icon {
    font-size: 64px;
    display: block;
    margin-bottom: var(--space-4);
}

.ai-placeholder h3 {
    font-size: var(--text-xl);
    color: var(--text-secondary);
    margin-bottom: var(--space-2);
}

.coming-soon {
    margin-top: var(--space-4);
    font-size: var(--text-sm);
    color: var(--text-light);
}

/* 当前体质信息 */
.current-constitution {
    padding: var(--space-6);
}

.constitution-summary {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
}

.summary-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-3xl);
    border-radius: var(--radius-lg);
    color: white;
}

.summary-title {
    font-size: var(--text-xl);
    color: var(--text-primary);
    margin-bottom: var(--space-1);
}

.summary-desc {
    font-size: var(--text-sm);
    color: var(--text-secondary);
}

.dietary-guidelines {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
}

.section-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-3);
}

.title-icon {
    font-size: var(--text-base);
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

@media (max-width: 768px) {
    .constitution-grid {
        grid-template-columns: 1fr;
    }

    .dietary-guidelines {
        grid-template-columns: 1fr;
    }

    .tabs-header {
        flex-direction: column;
    }
}
</style>
