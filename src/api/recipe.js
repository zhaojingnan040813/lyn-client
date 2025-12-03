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
    }
};

export default recipeApi;
