<template>
    <header class="header">
        <router-link to="/" class="logo">
            <div class="logo-icon">膳</div>
            <span class="logo-text">智能体质膳食推荐系统</span>
        </router-link>

        <nav class="nav">
            <router-link to="/chat" class="nav-item" :class="{ active: currentRoute === 'Chat' }">
                AI 问诊
            </router-link>
            <router-link to="/constitution" class="nav-item" :class="{ active: currentRoute === 'Constitution' }">
                体质诊断
            </router-link>
            <router-link to="/preference" class="nav-item" :class="{ active: currentRoute === 'Preference' }">
                口味调优
            </router-link>
            <router-link to="/recommendation" class="nav-item" :class="{ active: currentRoute === 'Recommendation' }">
                智膳推荐
            </router-link>
            <router-link to="/admin" class="nav-item" :class="{ active: currentRoute === 'Admin' }">
                管理后台
            </router-link>
        </nav>

        <div class="header-right">
            <div class="solar-term" v-if="solarTerm">
                <span>🌿</span>
                <span>{{ solarTerm }}</span>
            </div>
        </div>
    </header>
    <!-- 占位元素，防止内容被fixed header遮挡 -->
    <div class="header-placeholder"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 当前路由名称
const currentRoute = computed(() => route.name);

// 获取当前节气（简化版本，实际应该根据日期计算）
const solarTerm = computed(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // 简化的节气判断
    const terms = {
        '1-5': '小寒', '1-20': '大寒',
        '2-4': '立春', '2-19': '雨水',
        '3-6': '惊蛰', '3-21': '春分',
        '4-5': '清明', '4-20': '谷雨',
        '5-6': '立夏', '5-21': '小满',
        '6-6': '芒种', '6-21': '夏至',
        '7-7': '小暑', '7-23': '大暑',
        '8-8': '立秋', '8-23': '处暑',
        '9-8': '白露', '9-23': '秋分',
        '10-8': '寒露', '10-24': '霜降',
        '11-8': '立冬', '11-22': '小雪',
        '12-7': '大雪', '12-22': '冬至'
    };

    // 查找最近的节气
    for (const [date, term] of Object.entries(terms)) {
        const [m, d] = date.split('-').map(Number);
        if (month === m && Math.abs(day - d) <= 7) {
            return term;
        }
    }

    return '大雪'; // 默认返回
});
</script>

<style scoped>
.header-placeholder {
    height: var(--header-height);
}
</style>
