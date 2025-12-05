<template>
  <div class="food-name-input">
    <div class="input-header">
      <h2>AI生成菜谱 🤖</h2>
      <p class="description">输入食品名称，AI将为您生成完整的中医菜谱</p>
    </div>

    <form @submit.prevent="handleSubmit" class="input-form">
      <div class="form-group">
        <label for="foodName">食品名称</label>
        <input
          id="foodName"
          v-model="foodName"
          type="text"
          placeholder="请输入食品名称，如：西红柿、鸡蛋、豆腐等"
          class="food-input"
          maxlength="50"
        />
        <div class="input-hint">
          <span>{{ foodName.length }}/50</span>
        </div>
      </div>

      <!-- 常用食品快速选择 -->
      <div class="quick-select">
        <label>常用食品：</label>
        <div class="food-tags">
          <button
            v-for="food in commonFoods"
            :key="food"
            type="button"
            class="food-tag"
            @click="selectFood(food)"
          >
            {{ food }}
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn-cancel"
          @click="handleCancel"
        >
          取消
        </button>
        <button
          type="submit"
          class="btn-generate"
          :disabled="!isValid"
        >
          开始生成
        </button>
      </div>
    </form>

    <!-- 功能说明 -->
    <div class="feature-tips">
      <h3>功能说明</h3>
      <ul>
        <li>🎯 支持各种食材和菜品名称</li>
        <li>🏥 基于中医理论生成专业菜谱</li>
        <li>📝 包含完整的食材、步骤和食养分析</li>
        <li>✅ 生成后可人工编辑确认</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['submit', 'cancel']);

// 食品名称
const foodName = ref('');

// 常用食品列表
const commonFoods = [
  '西红柿', '鸡蛋', '豆腐', '青菜', '萝卜',
  '土豆', '鸡肉', '猪肉', '牛肉', '鱼',
  '冬瓜', '黄瓜', '茄子', '白菜', '菠菜'
];

// 验证输入
const isValid = computed(() => {
  return foodName.value.trim().length >= 1 && foodName.value.trim().length <= 50;
});

// 选择食品
const selectFood = (food) => {
  foodName.value = food;
};

// 提交表单
const handleSubmit = () => {
  if (isValid.value) {
    emit('submit', foodName.value.trim());
  }
};

// 取消操作
const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.food-name-input {
  padding: 24px;
  max-width: 500px;
}

.input-header {
  text-align: center;
  margin-bottom: 32px;
}

.input-header h2 {
  margin: 0 0 8px 0;
  color: var(--color-primary);
  font-size: 24px;
}

.description {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.input-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text);
}

.food-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.food-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-hint {
  text-align: right;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.quick-select {
  margin-bottom: 24px;
}

.quick-select label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  color: var(--color-text);
}

.food-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.food-tag {
  padding: 6px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text);
}

.food-tag:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel,
.btn-generate {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-cancel {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-cancel:hover {
  background: var(--color-border);
}

.btn-generate {
  background: var(--color-primary);
  color: red;
}

.btn-generate:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feature-tips {
  background: var(--color-bg);
  border-radius: 8px;
  padding: 20px;
}

.feature-tips h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--color-text);
}

.feature-tips ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.feature-tips li {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
