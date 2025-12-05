import { createRouter, createWebHistory } from 'vue-router';

const routes = [
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || '智膳 - 智能体质膳食推荐系统';
    next();
});

export default router;
