<template>
    <nav class="mobile-nav">
        <router-link to="/recommendation" class="nav-item" :class="{ active: $route.path === '/recommendation' }">
            <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span class="nav-label">推荐</span>
        </router-link>

        <router-link to="/preference" class="nav-item" :class="{ active: $route.path === '/preference' }">
            <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m5.196-14.196l-4.242 4.242m0 6.364l-4.242 4.242m14.196-5.196l-6 0m-6 0l-6 0m14.196 5.196l-4.242-4.242m0-6.364l-4.242-4.242" />
            </svg>
            <span class="nav-label">偏好</span>
        </router-link>

        <router-link to="/constitution" class="nav-item" :class="{ active: $route.path === '/constitution' }">
            <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            <span class="nav-label">体质</span>
        </router-link>
    </nav>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
.mobile-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    background: var(--bg-white-alpha-70);
    border-top: 1px solid var(--border-white);
    backdrop-filter: blur(16px);
    padding: 8px 0 max(8px, env(safe-area-inset-bottom));
    z-index: var(--z-fixed);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.mobile-nav::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent, var(--bg-paper-alpha));
    pointer-events: none;
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px;
    color: var(--text-tertiary);
    text-decoration: none;
    transition: all var(--transition-fast);
    position: relative;
}

.nav-item.active {
    color: var(--gold-primary);
}

.nav-item:active {
    transform: scale(0.95);
}

.nav-icon {
    width: 24px;
    height: 24px;
    transition: all var(--transition-fast);
}

.nav-item.active .nav-icon {
    stroke-width: 2.5;
}

.nav-label {
    font-size: 11px;
    font-weight: 500;
}

/* 激活指示器 */
.nav-item.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 3px;
    background: linear-gradient(90deg, var(--gold-primary), var(--gold-dark));
    border-radius: 0 0 3px 3px;
}

/* 仅在移动端显示 */
@media (max-width: 768px) {
    .mobile-nav {
        display: flex;
    }
}
</style>
