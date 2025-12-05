import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
            title: '智膳 - 智能体质膳食推荐系统'
        }
    },
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('../views/Chat.vue'),
        meta: {
            title: 'AI营养师 - 智膳'
        }
    },
    {
        path: '/recipes',
        name: 'Recipes',
        component: () => import('../views/Recipes.vue'),
        meta: {
            title: '养生菜谱 - 智膳'
        }
    },
    {
        path: '/recipes/:id',
        name: 'RecipeDetail',
        component: () => import('../views/RecipeDetail.vue'),
        meta: {
            title: '菜谱详情 - 智膳'
        }
    },
    {
        path: '/constitution',
        name: 'Constitution',
        component: () => import('../views/Constitution.vue'),
        meta: {
            title: '体质测试 - 智膳'
        }
    },
    {
        path: '/preference',
        name: 'Preference',
        component: () => import('../views/Preference.vue'),
        meta: {
            title: '偏好设置 - 智膳'
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
