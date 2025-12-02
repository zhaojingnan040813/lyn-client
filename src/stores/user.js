import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { sessionApi, constitutionApi } from '../api';

export const useUserStore = defineStore('user', () => {
    // 状态
    const sessionId = ref(localStorage.getItem('sessionId') || null);
    const constitution = ref(null);
    const constitutionInfo = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // 计算属性
    const isLoggedIn = computed(() => !!sessionId.value);
    const hasConstitution = computed(() => !!constitution.value?.type);

    // 初始化会话
    const initSession = async () => {
        // 如果已有sessionId，尝试获取会话信息
        if (sessionId.value) {
            try {
                loading.value = true;
                const response = await sessionApi.getSession(sessionId.value);
                if (response.code === 0) {
                    constitution.value = response.data.user.constitution;
                    // 如果有体质，获取体质详情
                    if (constitution.value?.type) {
                        await fetchConstitutionInfo(constitution.value.type);
                    }
                    return;
                }
            } catch (err) {
                console.warn('Session not found, creating new one');
            }
        }

        // 创建新会话
        await createSession();
    };

    // 创建新会话
    const createSession = async () => {
        try {
            loading.value = true;
            error.value = null;
            const response = await sessionApi.createSession();
            if (response.code === 0) {
                sessionId.value = response.data.sessionId;
                constitution.value = response.data.user.constitution;
                localStorage.setItem('sessionId', sessionId.value);
            }
        } catch (err) {
            error.value = err.message;
            console.error('Failed to create session:', err);
        } finally {
            loading.value = false;
        }
    };

    // 设置体质
    const setConstitution = async (constitutionType, method = 'manual') => {
        if (!sessionId.value) {
            await initSession();
        }

        try {
            loading.value = true;
            error.value = null;
            const response = await constitutionApi.setUserConstitution(
                sessionId.value,
                constitutionType,
                method
            );
            if (response.code === 0) {
                constitution.value = response.data.constitution;
                constitutionInfo.value = response.data.constitutionInfo;
                return true;
            }
            return false;
        } catch (err) {
            error.value = err.message;
            console.error('Failed to set constitution:', err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // 获取体质详情
    const fetchConstitutionInfo = async (type) => {
        try {
            const response = await constitutionApi.getConstitutionByType(type);
            if (response.code === 0) {
                constitutionInfo.value = response.data;
            }
        } catch (err) {
            console.error('Failed to fetch constitution info:', err);
        }
    };

    // 清除会话
    const clearSession = () => {
        sessionId.value = null;
        constitution.value = null;
        constitutionInfo.value = null;
        localStorage.removeItem('sessionId');
    };

    return {
        // 状态
        sessionId,
        constitution,
        constitutionInfo,
        loading,
        error,
        // 计算属性
        isLoggedIn,
        hasConstitution,
        // 方法
        initSession,
        createSession,
        setConstitution,
        fetchConstitutionInfo,
        clearSession
    };
});
