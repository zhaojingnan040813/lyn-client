<template>
    <div class="preference-page">
        <div class="bg-texture"></div>
        <div class="bg-ink-wash"></div>

        <div class="page-header fade-in-down">
            <h1 class="page-title font-serif">口味调优</h1>
            <p class="page-subtitle">根据您的口味偏好，定制专属食养方案</p>
        </div>

        <div class="card placeholder-card fade-in-up">
            <div class="placeholder-content">
                <span class="placeholder-icon">🍴</span>
                <h3>口味调优功能</h3>
                <p>此功能将在后续迭代中实现</p>
                <ul class="feature-list">
                    <li>✨ 五味偏好滑块调节（酸甜苦辣咸）</li>
                    <li>✨ 饮食禁忌标签选择</li>
                    <li>✨ 当前身体状态设置</li>
                    <li>✨ 用餐场景选择</li>
                </ul>
                <router-link to="/constitution" class="btn btn-outline">
                    ← 返回体质诊断
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
// 占位组件，功能将在后续迭代中实现
</script>

<style scoped>
.preference-page {
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

.placeholder-card {
    padding: var(--space-12);
}

.placeholder-content {
    text-align: center;
}

.placeholder-icon {
    font-size: 72px;
    display: block;
    margin-bottom: var(--space-6);
}

.placeholder-content h3 {
    font-size: var(--text-2xl);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.placeholder-content p {
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
}

.feature-list {
    text-align: left;
    max-width: 300px;
    margin: 0 auto var(--space-8);
}

.feature-list li {
    padding: var(--space-2) 0;
    color: var(--text-secondary);
    font-size: var(--text-sm);
}
</style>
