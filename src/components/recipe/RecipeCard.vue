<template>
    <article class="recipe-card" @click="$emit('click', recipe)">
        <div class="recipe-card-image">
            <span class="recipe-emoji">{{ recipe.emoji || '🍲' }}</span>
            <span class="card-match-badge">{{ recipe.matchScore || recipe.baseScore }}% 匹配</span>
            <div class="card-nature-tags">
                <span class="nature-tag" :class="natureClass">{{ recipe.nature }}性</span>
                <span class="nature-tag">{{ flavorsText }}</span>
            </div>
        </div>
        <div class="recipe-card-body">
            <h3 class="recipe-card-title">{{ recipe.name }}</h3>
            <p class="recipe-card-desc">{{ recipe.description }}</p>
            <div class="recipe-card-meta">
                <span class="meta-item">⏱ {{ recipe.cookingTime }}分钟</span>
                <span class="meta-item">📊 {{ recipe.difficulty }}</span>
                <span class="meta-item">🫀 {{ meridianText }}</span>
            </div>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    recipe: {
        type: Object,
        required: true
    }
});

defineEmits(['click']);

const natureClass = computed(() => {
    const nature = props.recipe.nature;
    if (nature === '温' || nature === '热') return 'warm';
    if (nature === '凉' || nature === '寒') return 'cool';
    return 'neutral';
});

const flavorsText = computed(() => {
    return props.recipe.flavors?.join('/') || '';
});

const meridianText = computed(() => {
    if (props.recipe.meridians && props.recipe.meridians.length > 0) {
        return `入${props.recipe.meridians.join('、')}`;
    }
    return '';
});
</script>

<style scoped>
.recipe-card {
    background: var(--bg-white-alpha-70);
    border: 1px solid var(--border-white);
    border-radius: var(--radius-xl);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-normal);
    animation: fadeInUp 0.5s ease-out both;
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(16px);
}

.recipe-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl);
    border-color: var(--gold);
}

.recipe-card-image {
    position: relative;
    height: 140px;
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--bg-secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.recipe-emoji {
    font-size: 64px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.card-match-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
    color: white;
    font-size: var(--text-xs);
    font-weight: 600;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    box-shadow: 0 2px 8px rgba(184, 134, 11, 0.3);
}

.card-nature-tags {
    position: absolute;
    bottom: 12px;
    left: 12px;
    display: flex;
    gap: 6px;
}

.nature-tag {
    font-size: var(--text-xs);
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.9);
    color: var(--text-secondary);
    backdrop-filter: blur(4px);
}

.nature-tag.warm {
    background: rgba(234, 88, 12, 0.15);
    color: #ea580c;
}

.nature-tag.cool {
    background: rgba(6, 182, 212, 0.15);
    color: #0891b2;
}

.nature-tag.neutral {
    background: rgba(107, 114, 128, 0.15);
    color: #6b7280;
}

.recipe-card-body {
    padding: var(--space-4);
}

.recipe-card-title {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
    font-family: var(--font-serif);
}

.recipe-card-desc {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-3);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.recipe-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
}

.meta-item {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
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
</style>
