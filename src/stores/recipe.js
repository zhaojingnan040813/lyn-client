import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recipeApi } from '../api/recipe.js'

export const useRecipeStore = defineStore('recipe', () => {
  // ========== 状态 ==========
  const recipes = ref([])
  const currentRecipe = ref(null)
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 筛选和分页状态
  const currentCategory = ref('recommended')
  const searchKeyword = ref('')
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // ========== 计算属性 ==========
  const hasMore = computed(() => {
    return recipes.value.length < pagination.value.total
  })

  const isEmpty = computed(() => {
    return !loading.value && recipes.value.length === 0
  })

  // ========== 方法 ==========

  /**
   * 获取菜谱列表
   * @param {boolean} append - 是否追加到现有列表（用于加载更多）
   */
  const fetchRecipes = async (append = false) => {
    loading.value = true
    error.value = null

    try {
      const params = {
        category: currentCategory.value,
        page: append ? pagination.value.page + 1 : 1,
        pageSize: pagination.value.pageSize
      }

      if (searchKeyword.value) {
        params.keyword = searchKeyword.value
      }

      const response = await recipeApi.getRecipes(params)

      if (response.code === 0) {
        if (append) {
          recipes.value = [...recipes.value, ...response.data.list]
        } else {
          recipes.value = response.data.list
        }
        pagination.value = response.data.pagination
      } else {
        throw new Error(response.message || '获取菜谱失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取菜谱列表失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取菜谱详情
   * @param {string} id - 菜谱ID
   */
  const fetchRecipeById = async id => {
    loading.value = true
    error.value = null

    try {
      const response = await recipeApi.getRecipeById(id)

      if (response.code === 0) {
        currentRecipe.value = response.data
        return response.data
      } else {
        throw new Error(response.message || '获取菜谱详情失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取菜谱详情失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取分类统计
   */
  const fetchCategories = async () => {
    try {
      const response = await recipeApi.getCategories()

      if (response.code === 0) {
        categories.value = response.data.categories
      }
    } catch (err) {
      console.error('获取分类统计失败:', err)
    }
  }

  /**
   * 切换分类
   * @param {string} category - 分类key
   */
  const setCategory = async category => {
    if (currentCategory.value === category) return

    currentCategory.value = category
    pagination.value.page = 1
    await fetchRecipes()
  }

  /**
   * 搜索菜谱
   * @param {string} keyword - 搜索关键词
   */
  const search = async keyword => {
    searchKeyword.value = keyword
    pagination.value.page = 1
    await fetchRecipes()
  }

  /**
   * 加载更多
   */
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return
    await fetchRecipes(true)
  }

  /**
   * 重置状态
   */
  const reset = () => {
    recipes.value = []
    currentRecipe.value = null
    currentCategory.value = 'recommended'
    searchKeyword.value = ''
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    error.value = null
  }

  /**
   * 清除当前菜谱
   */
  const clearCurrentRecipe = () => {
    currentRecipe.value = null
  }

  /**
   * AI生成菜谱
   * @param {Object} params - 生成参数
   */
  const generateRecipeByAI = async params => {
    loading.value = true
    error.value = null

    try {
      const response = await recipeApi.generateRecipeByAI(params)

      if (response.code === 0) {
        return response.data
      } else {
        throw new Error(response.message || 'AI生成菜谱失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('AI生成菜谱失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 保存AI生成的菜谱
   * @param {Object} data - 菜谱数据
   */
  const saveAIGeneratedRecipe = async data => {
    loading.value = true
    error.value = null

    try {
      const response = await recipeApi.saveAIGeneratedRecipe(data)

      if (response.code === 0) {
        // 保存成功后刷新菜谱列表
        await fetchRecipes()
        return response.data
      } else {
        throw new Error(response.message || '保存菜谱失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('保存菜谱失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    recipes,
    currentRecipe,
    categories,
    loading,
    error,
    currentCategory,
    searchKeyword,
    pagination,

    // 计算属性
    hasMore,
    isEmpty,

    // 方法
    fetchRecipes,
    fetchRecipeById,
    fetchCategories,
    setCategory,
    search,
    loadMore,
    reset,
    clearCurrentRecipe,
    generateRecipeByAI,
    saveAIGeneratedRecipe
  }
})

export default useRecipeStore
