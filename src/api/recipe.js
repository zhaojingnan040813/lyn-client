import request from './request';

/**
 * 菜谱相关API
 */
export const recipeApi = {
    /**
     * 获取菜谱列表
     * @param {Object} params - 查询参数
     * @param {string} params.category - 分类筛选 (recommended/warming/cooling/quick)
     * @param {string} params.keyword - 搜索关键词
     * @param {number} params.page - 页码
     * @param {number} params.pageSize - 每页数量
     */
    getRecipes(params = {}) {
        return request.get('/recipes', { params });
    },

    /**
     * 获取菜谱详情
     * @param {string} id - 菜谱ID
     */
    getRecipeById(id) {
        return request.get(`/recipes/${id}`);
    },

    /**
     * 获取推荐菜谱
     * @param {number} limit - 返回数量
     */
    getRecommendedRecipes(limit = 6) {
        return request.get('/recipes/recommend', { params: { limit } });
    },

    /**
     * 获取菜谱分类统计
     */
    getCategories() {
        return request.get('/recipes/categories');
    },

    /**
     * 创建新菜谱
     * @param {Object} data - 菜谱数据
     */
    createRecipe(data) {
        return request.post('/recipes', data);
    },

    /**
     * 更新菜谱
     * @param {string} id - 菜谱ID
     * @param {Object} data - 菜谱数据
     */
    updateRecipe(id, data) {
        return request.put(`/recipes/${id}`, data);
    },

    /**
     * 删除菜谱
     * @param {string} id - 菜谱ID
     */
    deleteRecipe(id) {
        return request.delete(`/recipes/${id}`);
    },

    /**
     * AI生成菜谱
     * @param {Object} data - 生成参数
     * @param {string} data.foodName - 食品名称
     */
    generateRecipeByAI(data) {
        return request.post('/recipes/generate', data);
    },

    /**
     * 保存AI生成的菜谱
     * @param {Object} data - 菜谱数据
     */
    saveAIGeneratedRecipe(data) {
        return request.post('/recipes/save-generated', data);
    }
};

export default recipeApi;

// 导出单独的函数以便直接使用
export const {
    getRecipes,
    getRecipeById,
    getRecommendedRecipes,
    getCategories,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    generateRecipeByAI,
    saveAIGeneratedRecipe
} = recipeApi;
