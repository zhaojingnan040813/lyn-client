<template>
  <el-dialog v-model="visible" title="列设置" width="50%">
    <div class="column-settings">
      <el-checkbox-group v-model="selectedColumns">
        <el-row :gutter="20">
          <el-col :span="8" v-for="column in columns" :key="column.key">
            <el-checkbox :label="column.key" :disabled="column.required">
              {{ column.label }}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    default: () => []
  },
  visibleColumns: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const visible = ref(false)
const selectedColumns = ref([])

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newVal => {
    visible.value = newVal
    if (newVal) {
      selectedColumns.value = [...props.visibleColumns]
    }
  }
)

// 监听 visible 变化，同步到父组件
watch(visible, newVal => {
  emit('update:modelValue', newVal)
})

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  // 恢复原始选择
  selectedColumns.value = [...props.visibleColumns]
}

// 保存设置
const handleSave = () => {
  emit('save', selectedColumns.value)
  ElMessage.success('列设置已保存')
  visible.value = false
}
</script>

<style scoped>
.column-settings {
  max-height: 300px;
  overflow-y: auto;
}

.column-settings .el-checkbox {
  margin-bottom: 10px;
  width: 100%;
}
</style>
