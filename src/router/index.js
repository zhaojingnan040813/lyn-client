import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/constitution'
    },
    {
        path: '/constitution',
        name: 'Constitution',
        component: () => import('../views/ConstitutionView.vue'),
        meta: {
            title: '体质诊断 - 智膳'
        }
    },
    {
        path: '/preference',
        name: 'Preference',
        component: () => import('../views/PreferenceView.vue'),
        meta: {
            title: '口味调优 - 智膳'
        }
    },
    {
        path: '/recommendation',
        name: 'Recommendation',
        component: () => import('../views/RecommendationView.vue'),
        meta: {
            title: '智膳推荐 - 智膳'
        }
    },
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('../views/ChatView.vue'),
        meta: {
            title: 'AI 问诊 - 智膳'
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/AdminView.vue'),
        meta: {
            title: '管理后台 - 智膳'
        }
    },
    {
        path: '/ai-generate',
        name: 'AIGenerate',
        component: () => import('../views/AIGenerateView.vue'),
        meta: {
            title: 'AI菜谱生成器 - 智膳'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFoundView.vue'),
        meta: {
            title: '页面未找到 - 智膳'
        }
    }
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
