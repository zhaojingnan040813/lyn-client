import request from './request';

/**
 * 会话相关API
 */
export const sessionApi = {
    // 创建新会话
    createSession() {
        return request.post('/session');
    },

    // 获取会话信息
    getSession(sessionId) {
        return request.get(`/session/${sessionId}`);
    },

    // 删除会话
    deleteSession(sessionId) {
        return request.delete(`/session/${sessionId}`);
    }
};

/**
 * 偏好相关API
 */
export const preferenceApi = {
    // 获取用户偏好
    getPreference() {
        return request.get('/preferences');
    },

    // 更新用户偏好
    updatePreference(data) {
        return request.put('/preferences', data);
    },

    // 重置用户偏好
    resetPreference() {
        return request.delete('/preferences');
    }
};

/**
 * 体质相关API
 */
export const constitutionApi = {
    // 获取所有体质类型
    getConstitutions() {
        return request.get('/constitutions');
    },

    // 获取指定体质详情
    getConstitutionByType(type) {
        return request.get(`/constitutions/${type}`);
    },

    // 设置用户体质
    setUserConstitution(sessionId, constitutionType, diagnosisMethod = 'manual') {
        return request.put(`/session/${sessionId}/constitution`, {
            constitutionType,
            diagnosisMethod
        });
    },

    // 获取用户体质信息
    getUserConstitution(sessionId) {
        return request.get(`/session/${sessionId}/constitution`);
    }
};

export default {
    sessionApi,
    preferenceApi,
    constitutionApi
};
