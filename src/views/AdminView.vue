<template>
    <div class="admin-view">
        <div class="admin-header">
            <h1>菜谱管理后台</h1>
            <p>管理系统中的所有菜谱信息</p>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="admin-toolbar">
            <div class="toolbar-left">
                <input 
                    v-model="searchKeyword" 
                    type="text" 
                    placeholder="搜索菜名、描述、食材..." 
                    class="search-input"
                    @keyup.enter="handleSearch"
                />
                <button class="btn-search" @click="handleSearch">搜索</button>

                <select v-model="filters.nature" @change="handleSearch" class="filter-select">
                    <option value="">全部性味</option>
                    <option value="寒">寒</option>
                    <option value="凉">凉</option>
                    <option value="平">平</option>
                    <option value="温">温</option>
                    <option value="热">热</option>
                </select>

                <select v-model="filters.category" @change="handleSearch" class="filter-select">
                    <option value="">全部分类</option>
                    <option value="warming">温补</option>
                    <option value="cooling">清润</option>
                    <option value="neutral">平和</option>
                    <option value="quick">快手</option>
                </select>

                <select v-model="filters.isActive" @change="handleSearch" class="filter-select">
                    <option value="">全部状态</option>
                    <option value="true">已启用</option>
                    <option value="false">已禁用</option>
                </select>
            </div>

            <div class="toolbar-right">
                <button class="btn-create" @click="handleCreate">
                    <span>+</span> 新增菜谱
                </button>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
            <p>加载中...</p>
        </div>

        <!-- 菜谱表格 -->
        <RecipeTable 
            v-else
            :recipes="recipes" 
            :pagination="pagination"
            @edit="handleEdit"
            @delete="handleDelete"
            @page-change="handlePageChange"
        />

        <!-- 菜谱表单弹窗 -->
        <RecipeForm 
            :visible="formVisible"
            :recipe="currentRecipe"
            @close="handleCloseForm"
            @submit="handleSubmitForm"
        />

        <!-- 消息提示 -->
        <div v-if="message.show" class="message" :class="message.type">
            {{ message.text }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RecipeTable from '../components/admin/RecipeTable.vue';
import RecipeForm from '../components/admin/RecipeForm.vue';
import recipeApi from '../api/recipe.js';

// 菜谱列表
const recipes = ref([]);
const loading = ref(false);

// 分页信息
const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
});

// 搜索和筛选
const searchKeyword = ref('');
const filters = ref({
    nature: '',
    category: '',
    isActive: ''
});

// 表单状态
const formVisible = ref(false);
const currentRecipe = ref(null);

// 消息提示
const message = ref({
    show: false,
    type: 'success',
    text: ''
});

// 加载菜谱列表
const loadRecipes = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.value.page,
            pageSize: pagination.value.pageSize,
            keyword: searchKeyword.value
        };

        // 添加分类筛选
        if (filters.value.category) {
            params.category = filters.value.category;
        }

        // 添加性味筛选
        if (filters.value.nature) {
            params.nature = filters.value.nature;
        }

        // 添加启用状态筛选
        if (filters.value.isActive !== '') {
            params.isActive = filters.value.isActive;
        }

        const response = await recipeApi.getRecipes(params);
        
        recipes.value = response.data.list || [];
        pagination.value = response.data.pagination;
    } catch (error) {
        console.error('加载菜谱失败:', error);
        showMessage('加载菜谱失败', 'error');
    } finally {
        loading.value = false;
    }
};

// 搜索
const handleSearch = () => {
    pagination.value.page = 1;
    loadRecipes();
};

// 分页切换
const handlePageChange = (page) => {
    pagination.value.page = page;
    loadRecipes();
};

// 创建菜谱
const handleCreate = () => {
    currentRecipe.value = null;
    formVisible.value = true;
};

// 编辑菜谱
const handleEdit = (recipe) => {
    currentRecipe.value = recipe;
    formVisible.value = true;
};

// 删除菜谱
const handleDelete = async (recipeId) => {
    try {
        await recipeApi.deleteRecipe(recipeId);
        showMessage('菜谱删除成功', 'success');
        loadRecipes();
    } catch (error) {
        console.error('删除菜谱失败:', error);
        showMessage('删除菜谱失败', 'error');
    }
};

// 关闭表单
const handleCloseForm = () => {
    formVisible.value = false;
    currentRecipe.value = null;
};

// 提交表单
const handleSubmitForm = async (formData) => {
    try {
        if (currentRecipe.value) {
            // 编辑模式
            await recipeApi.updateRecipe(currentRecipe.value._id, formData);
            showMessage('菜谱更新成功', 'success');
        } else {
            // 创建模式
            await recipeApi.createRecipe(formData);
            showMessage('菜谱创建成功', 'success');
        }
        handleCloseForm();
        loadRecipes();
    } catch (error) {
        console.error('保存菜谱失败:', error);
        showMessage(error.response?.data?.message || '保存菜谱失败', 'error');
    }
};

// 显示消息
const showMessage = (text, type = 'success') => {
    message.value = {
        show: true,
        type,
        text
    };
    setTimeout(() => {
        message.value.show = false;
    }, 3000);
};

// 组件挂载时加载数据
onMounted(() => {
    loadRecipes();
});
</script>

<style scoped>
.admin-view {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
}

.admin-header {
    margin-bottom: 32px;
}

.admin-header h1 {
    font-size: 32px;
    margin: 0 0 8px 0;
    color: var(--color-text);
}

.admin-header p {
    color: var(--color-text-secondary);
    margin: 0;
}

.admin-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
}

.toolbar-left {
    display: flex;
    gap: 12px;
    flex: 1;
    flex-wrap: wrap;
}

.search-input {
    flex: 1;
    min-width: 200px;
    padding: 10px 16px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 14px;
}

.search-input:focus {
    outline: none;
    border-color: var(--color-primary);
}

.filter-select {
    padding: 10px 16px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    background: white;
}

.filter-select:focus {
    outline: none;
    border-color: var(--color-primary);
}

.btn-search {
    padding: 10px 24px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: opacity 0.3s ease;
}

.btn-search:hover {
    opacity: 0.9;
}

.toolbar-right {
    display: flex;
    gap: 12px;
}

.btn-create {
    padding: 10px 24px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.3s ease;
}

.btn-create:hover {
    opacity: 0.9;
}

.btn-create span {
    font-size: 18px;
    font-weight: bold;
}

.loading {
    background: white;
    border-radius: 8px;
    padding: 60px 20px;
    text-align: center;
    color: var(--color-text-secondary);
}

.message {
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    animation: slideIn 0.3s ease;
    z-index: 2000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message.success {
    background: #2ed573;
}

.message.error {
    background: #ff6b6b;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .admin-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .toolbar-left {
        flex-direction: column;
    }

    .search-input {
        min-width: 100%;
    }
}
</style>
