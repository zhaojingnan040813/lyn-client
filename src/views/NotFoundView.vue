<template>
    <div class="not-found-page">
        <div class="bg-texture"></div>
        <div class="bg-ink-wash"></div>

        <div class="not-found-content fade-in">
            <span class="error-icon">🍵</span>
            <h1 class="error-code font-serif">404</h1>
            <h2 class="error-title">页面未找到</h2>
            <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
            <router-link to="/" class="btn btn-primary btn-lg">
                返回首页
            </router-link>
        </div>
    </div>
</template>

<script setup>
// 404页面组件
</script>

<style scoped>
.not-found-page {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.not-found-content {
    text-align: center;
    padding: var(--space-8);
}

.error-icon {
    font-size: 80px;
    display: block;
    margin-bottom: var(--space-4);
}

.error-code {
    font-size: 120px;
    color: var(--primary);
    line-height: 1;
    margin-bottom: var(--space-2);
}

.error-title {
    font-size: var(--text-2xl);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.error-desc {
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin-bottom: var(--space-8);
}
</style>
