<template>
    <div class="recommendation-page">
        <div class="bg-texture"></div>
        <div class="bg-ink-wash"></div>

        <!-- 顶部状态摘要 -->
        <section class="status-summary fade-in-down">
            <div class="summary-item constitution">
                <span class="summary-icon">{{ constitutionIcon }}</span>
                <span class="summary-label">体质</span>
                <span class="summary-value">{{ constitutionName }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-item preferences">
                <span class="summary-icon">🎯</span>
                <span class="summary-label">偏好</span>
                <span class="summary-value">{{ preferenceSummary }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-item context">
                <span class="summary-icon">⏰</span>
                <span class="summary-label">状态</span>
                <span class="summary-value">{{ contextSummary }}</span>
            </div>
            <router-link to="/constitution" class="edit-profile-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>编辑资料</span>
            </router-link>
        </section>

        <!-- 主体两栏布局 -->
        <div class="dashboard-grid">
            <!-- 左侧：菜谱推荐 -->
            <section class="recipe-section fade-in-up">
                <!-- 搜索和筛选 -->
                <SearchFilter v-model="searchKeyword" :currentCategory="currentCategory" @search="onSearch"
                    @categoryChange="onCategoryChange" />

                <!-- 菜谱列表 -->
                <div class="recipe-list">
                    <!-- 加载骨架屏 -->
                    <template v-if="loading && recipes.length === 0">
                        <div class="skeleton-card" v-for="i in 3" :key="i"></div>
                    </template>

                    <!-- 空状态 -->
                    <div v-else-if="isEmpty" class="empty-state">
                        <span class="empty-icon">🍽️</span>
                        <p>暂无匹配的菜谱</p>
                        <button class="btn btn-outline" @click="resetFilters">重置筛选</button>
                    </div>

                    <!-- 菜谱卡片 -->
                    <template v-else>
                        <RecipeCard v-for="recipe in recipes" :key="recipe._id" :recipe="recipe"
                            @click="openRecipeModal" />
                    </template>
                </div>

                <!-- 加载更多 -->
                <button v-if="hasMore && !loading" class="load-more-btn" @click="loadMore">
                    <span>加载更多推荐</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </button>

                <!-- 加载中 -->
                <div v-if="loading && recipes.length > 0" class="loading-more">
                    <span class="loading-spinner"></span>
                    <span>加载中...</span>
                </div>
            </section>

            <!-- 右侧：AI 分析面板（静态占位） -->
            <aside class="analysis-panel fade-in-up">
                <!-- AI 洞察卡片 -->
                <div class="panel-card ai-insights">
                    <div class="panel-header">
                        <div class="panel-icon">🧠</div>
                        <h3>AI 食养洞察</h3>
                    </div>
                    <div class="panel-body">
                        <div class="insight-content">
                            <p class="insight-greeting" v-html="currentInsight.greeting"></p>
                            <ul class="insight-list">
                                <li v-for="(tip, index) in currentInsight.tips" :key="index">
                                    <span class="insight-tag" :class="tip.tag">{{ tip.tag === 'warm' ? '宜' : '忌' }}</span>
                                    {{ tip.text }}
                                </li>
                            </ul>
                        </div>
                        <button class="refresh-insight-btn" @click="refreshInsight">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M23 4v6h-6M1 20v-6h6" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            <span>换一条建议</span>
                        </button>
                    </div>
                </div>

                <!-- 今日食材推荐 -->
                <div class="panel-card ingredient-recommend">
                    <div class="panel-header">
                        <div class="panel-icon">🥬</div>
                        <h3>当季食材</h3>
                    </div>
                    <div class="panel-body">
                        <div class="ingredient-grid">
                            <div v-for="ing in seasonalIngredients" :key="ing.name" class="ingredient-item">
                                <span class="ingredient-icon">{{ ing.icon }}</span>
                                <span class="ingredient-name">{{ ing.name }}</span>
                                <span class="ingredient-nature">{{ ing.nature }}性</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 五味平衡图 -->
                <div class="panel-card five-elements">
                    <div class="panel-header">
                        <div class="panel-icon">⚖</div>
                        <h3>今日五味平衡</h3>
                    </div>
                    <div class="panel-body">
                        <div class="elements-chart">
                            <div v-for="element in fiveElements" :key="element.name" class="element-bar">
                                <span class="element-name">{{ element.name }}</span>
                                <div class="element-progress">
                                    <div class="progress-fill" :style="{ width: element.value + '%', '--element-color': element.color }">
                                    </div>
                                </div>
                                <span class="element-value">{{ element.value }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 养生贴士 -->
                <div class="panel-card health-tips">
                    <div class="panel-header">
                        <div class="panel-icon">💡</div>
                        <h3>养生贴士</h3>
                    </div>
                    <div class="panel-body">
                        <div class="tip-carousel">
                            <div class="tip-item">
                                <p>{{ currentTip.text }}</p>
                                <span class="tip-source">{{ currentTip.source }}</span>
                            </div>
                            <div class="tip-controls">
                                <button class="tip-nav-btn" @click="prevTip" :disabled="healthTips.length <= 1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>
                                <div class="tip-indicators">
                                    <span 
                                        v-for="(tip, index) in healthTips" 
                                        :key="index" 
                                        class="tip-dot" 
                                        :class="{ active: index === currentTipIndex }"
                                        @click="currentTipIndex = index"
                                    ></span>
                                </div>
                                <button class="tip-nav-btn" @click="nextTip" :disabled="healthTips.length <= 1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <!-- 菜谱详情弹窗 -->
        <RecipeModal :visible="modalVisible" :recipe="selectedRecipe" @close="closeRecipeModal" />

        <!-- 移动端底部导航 -->
        <MobileNav />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRecipeStore } from '../stores/recipe.js';
import { useUserStore } from '../stores/user.js';
import { usePreferenceStore } from '../stores/preference.js';
import SearchFilter from '../components/recipe/SearchFilter.vue';
import RecipeCard from '../components/recipe/RecipeCard.vue';
import RecipeModal from '../components/recipe/RecipeModal.vue';
import MobileNav from '../components/MobileNav.vue';

// Stores
const recipeStore = useRecipeStore();
const userStore = useUserStore();
const preferenceStore = usePreferenceStore();

// 弹窗状态
const modalVisible = ref(false);
const selectedRecipe = ref(null);

// 搜索关键词
const searchKeyword = ref('');
const currentCategory = ref('recommended');

// 从 store 获取数据
const recipes = computed(() => recipeStore.recipes);
const loading = computed(() => recipeStore.loading);
const hasMore = computed(() => recipeStore.hasMore);
const isEmpty = computed(() => recipeStore.isEmpty);

// 体质图标映射
const constitutionIcons = {
    balanced: '☯',
    qi_deficiency: '☁',
    yang_deficiency: '❄',
    yin_deficiency: '🔥',
    phlegm_dampness: '💧',
    damp_heat: '🌡',
    blood_stasis: '🩸',
    qi_stagnation: '🌀',
    special: '🌸'
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

// 计算属性
const constitutionIcon = computed(() => {
    const type = userStore.constitution?.type;
    return constitutionIcons[type] || '☯';
});

const constitutionName = computed(() => {
    const type = userStore.constitution?.type;
    return constitutionNames[type] || '平和质';
});

const preferenceSummary = computed(() => {
    const spicyLevel = Math.round((preferenceStore.preference?.flavorPreference?.spicy ?? 50) / 25);
    const labels = ['不吃辣', '微辣', '适中', '重辣', '变态辣'];
    return labels[spicyLevel] + '口味';
});

const contextSummary = computed(() => {
    const contexts = preferenceStore.preference?.currentConditions || [];
    if (contexts.length === 0) return '正常';

    const contextLabels = {
        menstrual: '生理期',
        pregnancy: '孕期',
        postpartum: '产后',
        cold: '感冒',
        fever: '发热',
        insomnia: '失眠',
        fatigue: '疲劳',
        stress: '压力大'
    };

    return contexts.map(c => contextLabels[c]).filter(Boolean).join('、') || '正常';
});

// 当季食材（静态数据）
const seasonalIngredients = ref([
    { name: '山药', icon: '🥔', nature: '平' },
    { name: '红枣', icon: '🔴', nature: '温' },
    { name: '桂圆', icon: '🟤', nature: '温' },
    { name: '银耳', icon: '🍄', nature: '平' },
    { name: '莲子', icon: '⚪', nature: '平' },
    { name: '百合', icon: '🤍', nature: '凉' },
    { name: '枸杞', icon: '🔴', nature: '平' },
    { name: '核桃', icon: '🥜', nature: '温' },
    { name: '栗子', icon: '🌰', nature: '温' }
]);

// 五味平衡（静态数据）
const fiveElements = ref([
    { name: '酸 · 木', value: 60, color: 'var(--flavor-sour, #22c55e)' },
    { name: '苦 · 火', value: 40, color: 'var(--flavor-bitter, #ef4444)' },
    { name: '甘 · 土', value: 75, color: 'var(--flavor-sweet, #f59e0b)' },
    { name: '辛 · 金', value: 30, color: 'var(--flavor-spicy, #f97316)' },
    { name: '咸 · 水', value: 50, color: 'var(--flavor-salty, #3b82f6)' }
]);

// AI 洞察内容库（硬编码）
const aiInsights = [
    {
        greeting: '根据您的<strong>平和质</strong>体质，结合当前<strong>大雪</strong>节气，为您精选以下食养方案：',
        tips: [
            { tag: 'warm', text: '温补脾胃，可多食山药、红枣、桂圆' },
            { tag: 'warm', text: '润燥养阴，推荐银耳、百合、雪梨' },
            { tag: 'cold', text: '生冷寒凉，少食西瓜、苦瓜等' }
        ]
    },
    {
        greeting: '寒冷冬季，您的<strong>平和质</strong>体质需要注意保暖和温补：',
        tips: [
            { tag: 'warm', text: '多食温热食材，如羊肉、牛肉、生姜' },
            { tag: 'warm', text: '适量进补，黑芝麻、核桃有助益肾' },
            { tag: 'cold', text: '避免过食生冷，减少寒性水果摄入' }
        ]
    },
    {
        greeting: '您的体质适合以下<strong>冬季养生</strong>方案：',
        tips: [
            { tag: 'warm', text: '早餐宜温热，推荐小米粥、红枣粥' },
            { tag: 'warm', text: '午餐可食炖汤，萝卜牛腩汤最佳' },
            { tag: 'cold', text: '晚餐宜清淡，忌油腻辛辣食物' }
        ]
    }
];

// 养生贴士内容库（硬编码）
const healthTips = [
    {
        text: '"大雪时节，天气渐寒，宜早睡早起，避免熬夜损耗阳气。"',
        source: '— 《黄帝内经》'
    },
    {
        text: '"冬藏精气，少食寒凉，多食温补，以顺四时之气。"',
        source: '— 《素问·四气调神大论》'
    },
    {
        text: '"冬三月，此谓闭藏，水冰地坼，无扰乎阳。"',
        source: '— 《黄帝内经》'
    }
];

// 当前 AI 洞察索引
const currentInsightIndex = ref(0);
// 当前养生贴士索引
const currentTipIndex = ref(0);

// 方法
const onSearch = (keyword) => {
    recipeStore.search(keyword);
};

const onCategoryChange = (category) => {
    currentCategory.value = category;
    recipeStore.setCategory(category);
};

const loadMore = () => {
    recipeStore.loadMore();
};

const resetFilters = () => {
    searchKeyword.value = '';
    currentCategory.value = 'recommended';
    recipeStore.reset();
    recipeStore.fetchRecipes();
};

const openRecipeModal = (recipe) => {
    selectedRecipe.value = recipe;
    modalVisible.value = true;
};

const closeRecipeModal = () => {
    modalVisible.value = false;
    selectedRecipe.value = null;
};

const refreshInsight = () => {
    currentInsightIndex.value = (currentInsightIndex.value + 1) % aiInsights.length;
};

const nextTip = () => {
    currentTipIndex.value = (currentTipIndex.value + 1) % healthTips.length;
};

const prevTip = () => {
    currentTipIndex.value = (currentTipIndex.value - 1 + healthTips.length) % healthTips.length;
};

// 计算属性：当前 AI 洞察
const currentInsight = computed(() => aiInsights[currentInsightIndex.value]);

// 计算属性：当前养生贴士
const currentTip = computed(() => healthTips[currentTipIndex.value]);

// 初始化
onMounted(async () => {
    // 确保用户已初始化
    if (!userStore.sessionId) {
        await userStore.initSession();
    }
    // 获取偏好
    await preferenceStore.fetchPreference();
    // 获取菜谱列表
    await recipeStore.fetchRecipes();
});
</script>

<style scoped>
.recommendation-page {
    position: relative;
    padding-bottom: var(--space-8);
}

/* 状态摘要 */
.status-summary {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    padding: var(--space-4) var(--space-6);
    background: linear-gradient(135deg, var(--bg-white-alpha-70), var(--bg-white-alpha-50));
    border: 1px solid var(--border-white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    backdrop-filter: blur(16px);
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.summary-icon {
    font-size: 24px;
}

.summary-label {
    font-size: var(--text-sm);
    color: var(--text-tertiary);
}

.summary-value {
    font-size: var(--text-base);
    color: var(--text-primary);
    font-weight: 500;
}

.summary-divider {
    width: 1px;
    height: 32px;
    background: var(--border-light);
}

.edit-profile-btn {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 8px 16px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    background: transparent;
    color: var(--text-secondary);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
}

.edit-profile-btn:hover {
    border-color: var(--gold-primary);
    color: var(--gold-primary);
}

/* 两栏布局 */
.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: var(--space-6);
}

/* 菜谱区域 */
.recipe-section {
    min-height: 400px;
}

.recipe-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--space-5);
    margin-bottom: var(--space-6);
}

/* 骨架屏 */
.skeleton-card {
    height: 280px;
    background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%);
    background-size: 200% 100%;
    border-radius: var(--radius-lg);
    animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* 空状态 */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-12);
}

.empty-icon {
    font-size: 64px;
    display: block;
    margin-bottom: var(--space-4);
}

.empty-state p {
    color: var(--text-secondary);
    margin-bottom: var(--space-4);
}

/* 加载更多 */
.load-more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    padding: 16px;
    border: 1px dashed var(--border-light);
    border-radius: var(--radius-lg);
    background: transparent;
    color: var(--text-secondary);
    font-size: var(--text-base);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.load-more-btn:hover {
    border-color: var(--gold-primary);
    color: var(--gold-primary);
}

.loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-4);
    color: var(--text-tertiary);
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-light);
    border-top-color: var(--gold-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 右侧面板 */
.analysis-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.panel-card {
    background: var(--bg-white-alpha-70);
    border: 1px solid var(--border-white);
    border-radius: var(--radius-xl);
    overflow: hidden;
    backdrop-filter: blur(16px);
    animation: slideInRight 0.5s ease backwards;
}

.panel-card:nth-child(1) { animation-delay: 0.1s; }
.panel-card:nth-child(2) { animation-delay: 0.2s; }
.panel-card:nth-child(3) { animation-delay: 0.3s; }
.panel-card:nth-child(4) { animation-delay: 0.4s; }

.panel-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4);
    border-bottom: 1px solid var(--border-light);
}

.panel-icon {
    font-size: 20px;
}

.panel-header h3 {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--text-primary);
    font-family: var(--font-serif);
}

.panel-body {
    padding: var(--space-4);
}

/* AI 洞察 */
.insight-greeting {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--space-3);
}

.insight-greeting strong {
    color: var(--gold-dark);
}

.insight-list {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-4) 0;
}

.insight-list li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-2);
}

.insight-tag {
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-weight: 500;
    flex-shrink: 0;
}

.insight-tag.warm {
    background: rgba(234, 88, 12, 0.15);
    color: #ea580c;
}

.insight-tag.cold {
    background: rgba(6, 182, 212, 0.15);
    color: #0891b2;
}

.refresh-insight-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 8px 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-tertiary);
    font-size: var(--text-xs);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.refresh-insight-btn:hover {
    border-color: var(--gold-primary);
    color: var(--gold-primary);
}

/* 食材网格 */
.ingredient-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
}

.ingredient-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-2);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    cursor: default;
}

.ingredient-icon {
    font-size: 24px;
    margin-bottom: 4px;
}

.ingredient-name {
    font-size: var(--text-xs);
    color: var(--text-primary);
}

.ingredient-nature {
    font-size: 10px;
    color: var(--text-tertiary);
}

/* 五味平衡 */
.elements-chart {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.element-bar {
    display: grid;
    grid-template-columns: 60px 1fr 40px;
    align-items: center;
    gap: var(--space-2);
}

.element-name {
    font-size: var(--text-xs);
    color: var(--text-secondary);
}

.element-progress {
    height: 8px;
    background: var(--bg-secondary);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--element-color, var(--gold-primary));
    border-radius: var(--radius-full);
    transition: width 0.5s ease;
}

.element-value {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    text-align: right;
}

/* 养生贴士 */
.tip-carousel {
    position: relative;
}

.tip-item {
    text-align: center;
    padding: var(--space-2) 0;
}

.tip-item p {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-style: italic;
    line-height: 1.6;
    margin-bottom: var(--space-2);
}

.tip-source {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
}

.tip-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin-top: var(--space-3);
}

.tip-nav-btn {
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.tip-nav-btn:hover:not(:disabled) {
    color: var(--gold-primary);
    background: var(--bg-secondary);
}

.tip-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.tip-indicators {
    display: flex;
    gap: 6px;
}

.tip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--border-light);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.tip-dot:hover {
    background: var(--gold-light);
}

.tip-dot.active {
    background: var(--gold-primary);
    width: 20px;
    border-radius: 3px;
}

/* 响应式 */
@media (max-width: 1200px) {
    .dashboard-grid {
        grid-template-columns: 1fr 340px;
    }
}

@media (max-width: 992px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .analysis-panel {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-5);
    }
}

@media (max-width: 768px) {
    .recommendation-page {
        padding-bottom: calc(var(--space-16) + env(safe-area-inset-bottom));
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .analysis-panel {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .status-summary {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
    }

    .summary-divider {
        display: none;
    }

    .edit-profile-btn {
        margin-left: 0;
        width: 100%;
        justify-content: center;
    }

    .recipe-list {
        grid-template-columns: 1fr;
    }
}

/* 动画 */
.fade-in-down {
    animation: fadeInDown 0.5s ease-out both;
}

.fade-in-up {
    animation: fadeInUp 0.5s ease-out both;
    animation-delay: 0.1s;
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

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
