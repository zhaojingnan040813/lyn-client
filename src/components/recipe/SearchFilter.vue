<template>
    <div class="search-filter-bar">
        <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" class="search-input" placeholder="搜索菜品、食材..." v-model="searchValue"
                @input="onSearchInput" @keyup.enter="onSearch" />
            <button v-if="searchValue" class="clear-btn" @click="clearSearch">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="filter-tabs">
            <button v-for="tab in filterTabs" :key="tab.key" class="filter-tab" :class="{ active: currentTab === tab.key }"
                @click="onTabClick(tab.key)">
                {{ tab.name }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    currentCategory: {
        type: String,
        default: 'recommended'
    }
});

const emit = defineEmits(['update:modelValue', 'search', 'categoryChange']);

const filterTabs = [
    { key: 'recommended', name: '为你推荐' },
    { key: 'warming', name: '温补' },
    { key: 'cooling', name: '清润' },
    { key: 'quick', name: '快手菜' }
];

const searchValue = ref(props.modelValue);
const currentTab = ref(props.currentCategory);

// 监听外部值变化
watch(() => props.modelValue, (val) => {
    searchValue.value = val;
});

watch(() => props.currentCategory, (val) => {
    currentTab.value = val;
});

// 防抖搜索
let debounceTimer = null;
const onSearchInput = () => {
    emit('update:modelValue', searchValue.value);

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        emit('search', searchValue.value);
    }, 300);
};

const onSearch = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    emit('search', searchValue.value);
};

const clearSearch = () => {
    searchValue.value = '';
    emit('update:modelValue', '');
    emit('search', '');
};

const onTabClick = (key) => {
    currentTab.value = key;
    emit('categoryChange', key);
};
</script>

<style scoped>
.search-filter-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
}

.search-icon {
    position: absolute;
    left: 16px;
    color: var(--text-tertiary);
}

.search-input {
    width: 100%;
    padding: 12px 40px 12px 48px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
    font-size: var(--text-base);
    color: var(--text-primary);
    transition: all var(--transition-fast);
}

.search-input:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
}

.search-input::placeholder {
    color: var(--text-tertiary);
}

.clear-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.clear-btn:hover {
    color: var(--text-secondary);
    background: var(--bg-secondary);
}

.filter-tabs {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
}

.filter-tab {
    padding: 8px 16px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-full);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.filter-tab:hover {
    border-color: var(--gold-primary);
    color: var(--gold-primary);
}

.filter-tab.active {
    background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
    color: white;
    border-color: var(--gold-primary);
}

@media (max-width: 768px) {
    .search-filter-bar {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        width: 100%;
    }
}

@media (max-width: 640px) {
    .filter-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 4px;
        -webkit-overflow-scrolling: touch;
    }

    .filter-tabs::-webkit-scrollbar {
        display: none;
    }

    .filter-tab {
        flex-shrink: 0;
    }
}
</style>
