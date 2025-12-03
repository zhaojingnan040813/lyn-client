<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="visible" class="modal-overlay" @click.self="onClose">
                <div class="modal-content">
                    <button class="modal-close" @click="onClose">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div class="modal-body" v-if="recipe">
                        <!-- 菜品图片 -->
                        <div class="recipe-hero">
                            <div class="recipe-image">
                                <span class="image-emoji">{{ recipe.emoji || '🍲' }}</span>
                            </div>
                            <div class="recipe-badges">
                                <span class="badge-item nature" :class="natureClass">{{ recipe.nature }}性</span>
                                <span class="badge-item flavor">{{ flavorsText }}</span>
                                <span class="badge-item meridian">{{ meridianText }}</span>
                            </div>
                        </div>

                        <!-- 菜品信息 -->
                        <div class="recipe-info">
                            <h2 class="recipe-title">{{ recipe.name }}</h2>
                            <p class="recipe-desc">{{ recipe.description }}</p>

                            <!-- 匹配度 -->
                            <div class="match-score">
                                <div class="score-circle">
                                    <svg viewBox="0 0 100 100">
                                        <circle class="score-bg" cx="50" cy="50" r="45" />
                                        <circle class="score-fill" cx="50" cy="50" r="45"
                                            :style="{ strokeDashoffset: scoreOffset }" />
                                    </svg>
                                    <span class="score-value">{{ recipe.matchScore || recipe.baseScore }}</span>
                                </div>
                                <div class="score-label">
                                    <span class="label-main">体质匹配度</span>
                                    <span class="label-sub">{{ recipe.matchReason || '适合日常调养' }}</span>
                                </div>
                            </div>

                            <!-- 食材列表 -->
                            <div class="ingredients-section">
                                <h3>所需食材</h3>
                                <div class="ingredients-list">
                                    <span v-for="(ing, index) in recipe.ingredients" :key="index" class="ingredient-tag">
                                        {{ ing.icon }} {{ ing.name }} {{ ing.amount }}
                                    </span>
                                </div>
                            </div>

                            <!-- 烹饪步骤 -->
                            <div class="steps-section">
                                <h3>烹饪步骤</h3>
                                <div class="steps-list">
                                    <div v-for="step in recipe.steps" :key="step.order" class="step-item">
                                        <span class="step-number">{{ step.order }}</span>
                                        <span class="step-text">{{ step.content }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 食养分析 -->
                            <div class="analysis-section" v-if="recipe.analysis">
                                <h3>食养分析</h3>
                                <div class="analysis-content">
                                    <p>{{ recipe.analysis }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 底部操作 -->
                    <div class="modal-footer">
                        <button class="btn btn-outline" @click="onFavorite">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span>收藏菜谱</span>
                        </button>
                        <button class="btn btn-gold btn-lg" @click="onStartCooking">
                            <span>开始烹饪</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';

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

const emit = defineEmits(['close', 'favorite', 'startCooking']);

const natureClass = computed(() => {
    if (!props.recipe) return '';
    const nature = props.recipe.nature;
    if (nature === '温' || nature === '热') return 'warm';
    if (nature === '凉' || nature === '寒') return 'cool';
    return 'neutral';
});

const flavorsText = computed(() => {
    return props.recipe?.flavors?.join('/') || '';
});

const meridianText = computed(() => {
    if (props.recipe?.meridians?.length > 0) {
        return `入${props.recipe.meridians.join('、')}`;
    }
    return '';
});

const scoreOffset = computed(() => {
    const score = props.recipe?.matchScore || props.recipe?.baseScore || 80;
    const circumference = 2 * Math.PI * 45;
    return circumference - (score / 100) * circumference;
});

const onClose = () => {
    emit('close');
};

const onFavorite = () => {
    emit('favorite', props.recipe);
    alert('收藏功能开发中，敬请期待！');
};

const onStartCooking = () => {
    emit('startCooking', props.recipe);
    alert('烹饪模式即将推出，敬请期待！');
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-4);
    backdrop-filter: blur(4px);
}

.modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-xl);
}

.modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: var(--radius-full);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all var(--transition-fast);
}

.modal-close:hover {
    background: white;
    color: var(--text-primary);
    transform: rotate(90deg);
}

.modal-body {
    overflow-y: auto;
    flex: 1;
}

.recipe-hero {
    position: relative;
    height: 200px;
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--bg-secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.recipe-image {
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-emoji {
    font-size: 100px;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
}

.recipe-badges {
    position: absolute;
    bottom: 16px;
    left: 16px;
    display: flex;
    gap: 8px;
}

.badge-item {
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: 500;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(4px);
}

.badge-item.warm {
    background: rgba(234, 88, 12, 0.15);
    color: #ea580c;
}

.badge-item.cool {
    background: rgba(6, 182, 212, 0.15);
    color: #0891b2;
}

.recipe-info {
    padding: var(--space-6);
}

.recipe-title {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
    font-family: var(--font-serif);
    margin-bottom: var(--space-2);
}

.recipe-desc {
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
}

.match-score {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-6);
}

.score-circle {
    position: relative;
    width: 80px;
    height: 80px;
}

.score-circle svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
}

.score-bg {
    fill: none;
    stroke: var(--border-light);
    stroke-width: 8;
}

.score-fill {
    fill: none;
    stroke: var(--gold-primary);
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 283;
    transition: stroke-dashoffset 0.5s ease;
}

.score-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--gold-dark);
}

.score-label {
    flex: 1;
}

.label-main {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-tertiary);
    margin-bottom: 4px;
}

.label-sub {
    display: block;
    font-size: var(--text-base);
    color: var(--text-primary);
    font-weight: 500;
}

.ingredients-section,
.steps-section,
.analysis-section {
    margin-bottom: var(--space-6);
}

.ingredients-section h3,
.steps-section h3,
.analysis-section h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-3);
    font-family: var(--font-serif);
}

.ingredients-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.ingredient-tag {
    padding: 6px 12px;
    background: var(--bg-secondary);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    color: var(--text-secondary);
}

.steps-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.step-item {
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;
}

.step-number {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
    color: white;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: 600;
    flex-shrink: 0;
}

.step-text {
    flex: 1;
    font-size: var(--text-base);
    color: var(--text-secondary);
    line-height: 1.6;
    padding-top: 2px;
}

.analysis-content {
    padding: var(--space-4);
    background: linear-gradient(135deg, rgba(184, 134, 11, 0.05), rgba(184, 134, 11, 0.02));
    border-radius: var(--radius-lg);
    border-left: 3px solid var(--gold-primary);
}

.analysis-content p {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.8;
}

.modal-footer {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-6);
    border-top: 1px solid var(--border-light);
    background: var(--bg-card);
}

.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: 12px 20px;
    border-radius: var(--radius-lg);
    font-size: var(--text-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn-outline {
    background: transparent;
    border: 1px solid var(--border-light);
    color: var(--text-secondary);
}

.btn-outline:hover {
    border-color: var(--gold-primary);
    color: var(--gold-primary);
}

.btn-gold {
    flex: 1;
    background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
    border: none;
    color: white;
}

.btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
    transform: scale(0.95) translateY(20px);
}

@media (max-width: 640px) {
    .modal-content {
        max-height: 100vh;
        border-radius: 0;
    }

    .recipe-hero {
        height: 160px;
    }

    .image-emoji {
        font-size: 80px;
    }

    .modal-footer {
        flex-direction: column;
    }

    .btn-outline {
        order: 2;
    }
}
</style>
