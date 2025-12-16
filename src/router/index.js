import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页 - 智膳 - 智能体质膳食推荐系统'
    }
  },
  {
    path: '/ai-diagnosis',
    name: 'AiDiagnosis',
    component: () => import('../views/AiDiagnosis.vue'),
    meta: {
      title: 'AI问诊 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/constitution-diagnosis',
    name: 'ConstitutionDiagnosis',
    component: () => import('../views/ConstitutionDiagnosis.vue'),
    meta: {
      title: '体质诊断 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/taste-optimization',
    name: 'TasteOptimization',
    component: () => import('../views/TasteOptimization.vue'),
    meta: {
      title: '口味调优 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/recipe-recommendation',
    name: 'RecipeRecommendation',
    component: () => import('../views/RecipeRecommendation.vue'),
    meta: {
      title: '至膳推荐 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/dish-management',
    name: 'DishManagement',
    component: () => import('../views/DishManagement.vue'),
    meta: {
      title: '菜品管理 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/ai-add-dish',
    name: 'AiAddDish',
    component: () => import('../views/AiAddDish.vue'),
    meta: {
      title: 'AI添加菜品 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/ai-recipe-recommend',
    name: 'AiRecipeRecommend',
    component: () => import('../views/AiRecipeRecommend.vue'),
    meta: {
      title: 'AI智能推荐 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  // 认证相关路由 - 使用全屏布局
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '用户登录 - 智能体质膳食推荐系统',
      guest: true, // 游客可访问
      hideNavbar: true // 隐藏导航栏
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: '用户注册 - 智能体质膳食推荐系统',
      guest: true, // 游客可访问
      hideNavbar: true // 隐藏导航栏
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: '个人信息 - 智能体质膳食推荐系统',
      requiresAuth: true // 需要登录
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

// 路由守卫：设置页面标题和权限控制
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '智膳 - 智能体质膳食推荐系统'

  // 动态导入用户store，避免循环依赖
  const { useUserStore } = await import('../stores/user')
  const userStore = useUserStore()

  // 检查登录状态
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 需要登录但未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存重定向路径
      })
      return
    }
  }

  // 如果是游客页面但用户已登录，可以重定向到AI问诊页面
  if (to.meta.guest && userStore.isLoggedIn) {
    next('/ai-diagnosis')
    return
  }

  next()
})

export default router
