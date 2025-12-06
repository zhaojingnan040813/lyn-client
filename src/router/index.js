import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/ai-diagnosis'
  },
  {
    path: '/ai-diagnosis',
    name: 'AiDiagnosis',
    component: () => import('../views/AiDiagnosis.vue'),
    meta: {
      title: 'AI问诊 - 智能体质膳食推荐系统'
    }
  },
  {
    path: '/constitution-diagnosis',
    name: 'ConstitutionDiagnosis',
    component: () => import('../views/ConstitutionDiagnosis.vue'),
    meta: {
      title: '体质诊断 - 智能体质膳食推荐系统'
    }
  },
  {
    path: '/taste-optimization',
    name: 'TasteOptimization',
    component: () => import('../views/TasteOptimization.vue'),
    meta: {
      title: '口味调优 - 智能体质膳食推荐系统'
    }
  },
  {
    path: '/recipe-recommendation',
    name: 'RecipeRecommendation',
    component: () => import('../views/RecipeRecommendation.vue'),
    meta: {
      title: '至膳推荐 - 智能体质膳食推荐系统'
    }
  },
  {
    path: '/dish-management',
    name: 'DishManagement',
    component: () => import('../views/DishManagement.vue'),
    meta: {
      title: '菜品管理 - 智能体质膳食推荐系统'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '智膳 - 智能体质膳食推荐系统'
  next()
})

export default router
