<template>
    <div class="recipe-table">
        <!-- 表格 -->
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>菜名</th>
                        <th>分类</th>
                        <th>性味</th>
                        <th>难度</th>
                        <th>烹饪时间</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="recipe in recipes" :key="recipe._id">
                        <td>
                            <div class="recipe-name">
                                <span class="emoji">{{ recipe.emoji }}</span>
                                <span>{{ recipe.name }}</span>
                            </div>
                        </td>
                        <td>
                            <span class="category-tag" :class="recipe.category">
                                {{ getCategoryName(recipe.category) }}
                            </span>
                        </td>
                        <td>
                            <span class="nature-tag" :class="recipe.nature">
                                {{ recipe.nature }}
                            </span>
                        </td>
                        <td>{{ recipe.difficulty }}</td>
                        <td>{{ recipe.cookingTime }}分钟</td>
                        <td>
                            <span class="status-tag" :class="{ active: recipe.isActive }">
                                {{ recipe.isActive ? '启用' : '禁用' }}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-edit" @click="handleEdit(recipe)">编辑</button>
                                <button class="btn-delete" @click="handleDelete(recipe)">删除</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 空状态 -->
            <div v-if="recipes.length === 0" class="empty-state">
                <p>暂无菜谱数据</p>
            </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="pagination.total > 0">
            <button 
                class="page-btn" 
                :disabled="pagination.page === 1"
                @click="handlePageChange(pagination.page - 1)"
            >
                上一页
            </button>
            <span class="page-info">
                第 {{ pagination.page }} / {{ totalPages }} 页，共 {{ pagination.total }} 条
            </span>
            <button 
                class="page-btn" 
                :disabled="pagination.page >= totalPages"
                @click="handlePageChange(pagination.page + 1)"
            >
                下一页
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    recipes: {
        type: Array,
        required: true
    },
    pagination: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['edit', 'delete', 'page-change']);

// 总页数
const totalPages = computed(() => {
    return Math.ceil(props.pagination.total / props.pagination.pageSize);
});

// 获取分类名称
const getCategoryName = (category) => {
    const categoryMap = {
        warming: '温补',
        cooling: '清润',
        neutral: '平和',
        quick: '快手'
    };
    return categoryMap[category] || category;
};

// 编辑
const handleEdit = (recipe) => {
    emit('edit', recipe);
};

// 删除
const handleDelete = (recipe) => {
    if (confirm(`确定要删除菜谱"${recipe.name}"吗？此操作不可恢复！`)) {
        emit('delete', recipe._id);
    }
};

// 分页切换
const handlePageChange = (page) => {
    emit('page-change', page);
};
</script>

<style scoped>
.recipe-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.table-container {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th {
    background: var(--color-bg);
    padding: 16px;
    text-align: left;
    font-weight: 500;
    color: var(--color-text-secondary);
    border-bottom: 2px solid var(--color-border);
}

.data-table td {
    padding: 16px;
    border-bottom: 1px solid var(--color-border);
}

.data-table tbody tr:hover {
    background: var(--color-bg);
}

.recipe-name {
    display: flex;
    align-items: center;
    gap: 8px;
}

.emoji {
    font-size: 20px;
}

.category-tag,
.nature-tag,
.status-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 13px;
}

.category-tag.warming {
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
}

.category-tag.cooling {
    background: rgba(74, 144, 226, 0.1);
    color: #4a90e2;
}

.category-tag.neutral {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
}

.category-tag.quick {
    background: rgba(255, 177, 66, 0.1);
    color: #ffb142;
}

.nature-tag {
    font-weight: 500;
}

.nature-tag.寒,
.nature-tag.凉 {
    background: rgba(74, 144, 226, 0.1);
    color: #4a90e2;
}

.nature-tag.温,
.nature-tag.热 {
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
}

.nature-tag.平 {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
}

.status-tag {
    background: rgba(158, 158, 158, 0.1);
    color: #9e9e9e;
}

.status-tag.active {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.3s ease;
}

.btn-edit {
    background: var(--color-primary);
    color: white;
}

.btn-edit:hover {
    opacity: 0.8;
}

.btn-delete {
    background: #ff6b6b;
    color: white;
}

.btn-delete:hover {
    opacity: 0.8;
}

.empty-state {
    padding: 60px 20px;
    text-align: center;
    color: var(--color-text-secondary);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border-top: 1px solid var(--color-border);
}

.page-btn {
    padding: 8px 16px;
    border: 1px solid var(--color-border);
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    color: var(--color-text-secondary);
    font-size: 14px;
}
</style>
