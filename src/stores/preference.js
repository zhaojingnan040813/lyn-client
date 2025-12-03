import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { preferenceApi } from '../api';

export const usePreferenceStore = defineStore('preference', () => {
    // 状态
    const preference = ref({
        flavorPreference: {
            sour: 50,
            sweet: 50,
            bitter: 50,
            spicy: 50,
            salty: 50
        },
        dietaryRestrictions: [],
        allergies: [],
        dislikedIngredients: [],
        currentConditions: [],
        mealScenarios: [],
        cookingDifficulty: 3,
        maxCookingTime: 60
    });
    const loading = ref(false);
    const error = ref(null);
    const hasLoaded = ref(false);

    // 计算属性
    const hasPreference = computed(() => hasLoaded.value);

    // 五味偏好标签
    const flavorLabels = {
        sour: { name: '酸', icon: '🍋', color: '#FFD700' },
        sweet: { name: '甜', icon: '🍯', color: '#FF69B4' },
        bitter: { name: '苦', icon: '🍵', color: '#228B22' },
        spicy: { name: '辣', icon: '🌶️', color: '#FF4500' },
        salty: { name: '咸', icon: '🧂', color: '#4169E1' }
    };

    // 饮食禁忌选项
    const restrictionOptions = [
        { value: 'vegetarian', label: '素食', icon: '🥬' },
        { value: 'vegan', label: '纯素', icon: '🌱' },
        { value: 'gluten_free', label: '无麸质', icon: '🌾' },
        { value: 'dairy_free', label: '无乳制品', icon: '🥛' },
        { value: 'nut_free', label: '无坚果', icon: '🥜' },
        { value: 'seafood_free', label: '无海鲜', icon: '🦐' },
        { value: 'egg_free', label: '无蛋', icon: '🥚' },
        { value: 'low_sugar', label: '低糖', icon: '🍬' },
        { value: 'low_salt', label: '低盐', icon: '🧂' },
        { value: 'low_fat', label: '低脂', icon: '🥓' }
    ];

    // 当前身体状态选项
    const conditionOptions = [
        { value: 'menstrual', label: '经期', icon: '🌸' },
        { value: 'pregnancy', label: '孕期', icon: '🤰' },
        { value: 'postpartum', label: '产后', icon: '👶' },
        { value: 'cold', label: '感冒', icon: '🤧' },
        { value: 'fever', label: '发热', icon: '🌡️' },
        { value: 'insomnia', label: '失眠', icon: '😴' },
        { value: 'fatigue', label: '疲劳', icon: '😫' },
        { value: 'stress', label: '压力大', icon: '😰' },
        { value: 'digestion_issues', label: '消化不良', icon: '🤢' }
    ];

    // 用餐场景选项
    const scenarioOptions = [
        { value: 'breakfast', label: '早餐', icon: '🌅' },
        { value: 'lunch', label: '午餐', icon: '☀️' },
        { value: 'dinner', label: '晚餐', icon: '🌙' },
        { value: 'snack', label: '加餐', icon: '🍪' },
        { value: 'late_night', label: '宵夜', icon: '🌃' },
        { value: 'quick_meal', label: '快手餐', icon: '⚡' },
        { value: 'family_dinner', label: '家庭聚餐', icon: '👨‍👩‍👧' },
        { value: 'party', label: '聚会', icon: '🎉' },
        { value: 'diet', label: '减脂餐', icon: '💪' },
        { value: 'nutrition', label: '滋补餐', icon: '🏥' }
    ];

    // 获取用户偏好
    const fetchPreference = async () => {
        try {
            loading.value = true;
            error.value = null;
            const response = await preferenceApi.getPreference();
            if (response.code === 0) {
                // 合并返回的数据和默认值
                preference.value = {
                    ...preference.value,
                    ...response.data,
                    flavorPreference: {
                        ...preference.value.flavorPreference,
                        ...(response.data.flavorPreference || {})
                    }
                };
                hasLoaded.value = true;
            }
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch preference:', err);
        } finally {
            loading.value = false;
        }
    };

    // 更新用户偏好
    const updatePreference = async (data) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await preferenceApi.updatePreference(data);
            if (response.code === 0) {
                preference.value = {
                    ...preference.value,
                    ...response.data,
                    flavorPreference: {
                        ...preference.value.flavorPreference,
                        ...(response.data.flavorPreference || {})
                    }
                };
                return true;
            }
            return false;
        } catch (err) {
            error.value = err.message;
            console.error('Failed to update preference:', err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // 更新五味偏好
    const updateFlavorPreference = async (flavor, value) => {
        const flavorData = {
            flavorPreference: {
                ...preference.value.flavorPreference,
                [flavor]: value
            }
        };
        return await updatePreference(flavorData);
    };

    // 切换饮食禁忌
    const toggleRestriction = async (restriction) => {
        const restrictions = [...preference.value.dietaryRestrictions];
        const index = restrictions.indexOf(restriction);
        if (index > -1) {
            restrictions.splice(index, 1);
        } else {
            restrictions.push(restriction);
        }
        return await updatePreference({ dietaryRestrictions: restrictions });
    };

    // 切换当前状态
    const toggleCondition = async (condition) => {
        const conditions = [...preference.value.currentConditions];
        const index = conditions.indexOf(condition);
        if (index > -1) {
            conditions.splice(index, 1);
        } else {
            conditions.push(condition);
        }
        return await updatePreference({ currentConditions: conditions });
    };

    // 切换用餐场景
    const toggleScenario = async (scenario) => {
        const scenarios = [...preference.value.mealScenarios];
        const index = scenarios.indexOf(scenario);
        if (index > -1) {
            scenarios.splice(index, 1);
        } else {
            scenarios.push(scenario);
        }
        return await updatePreference({ mealScenarios: scenarios });
    };

    // 添加不喜欢的食材
    const addDislikedIngredient = async (ingredient) => {
        if (!preference.value.dislikedIngredients.includes(ingredient)) {
            const ingredients = [...preference.value.dislikedIngredients, ingredient];
            return await updatePreference({ dislikedIngredients: ingredients });
        }
        return true;
    };

    // 移除不喜欢的食材
    const removeDislikedIngredient = async (ingredient) => {
        const ingredients = preference.value.dislikedIngredients.filter(i => i !== ingredient);
        return await updatePreference({ dislikedIngredients: ingredients });
    };

    // 重置偏好
    const resetPreference = async () => {
        try {
            loading.value = true;
            error.value = null;
            const response = await preferenceApi.resetPreference();
            if (response.code === 0) {
                preference.value = response.data;
                return true;
            }
            return false;
        } catch (err) {
            error.value = err.message;
            console.error('Failed to reset preference:', err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // 本地更新（不调用API，用于滑块拖动时的实时反馈）
    const setLocalFlavorPreference = (flavor, value) => {
        preference.value.flavorPreference[flavor] = value;
    };

    return {
        // 状态
        preference,
        loading,
        error,
        hasLoaded,
        // 计算属性
        hasPreference,
        // 选项数据
        flavorLabels,
        restrictionOptions,
        conditionOptions,
        scenarioOptions,
        // 方法
        fetchPreference,
        updatePreference,
        updateFlavorPreference,
        toggleRestriction,
        toggleCondition,
        toggleScenario,
        addDislikedIngredient,
        removeDislikedIngredient,
        resetPreference,
        setLocalFlavorPreference
    };
});
