<template>
  <div class="dish-management">
    <el-container>
      <el-header class="page-header">
        <h1>菜品管理</h1>
        <p>管理系统中的所有菜品信息，包括添加、编辑、删除等操作</p>
      </el-header>

      <el-main>
        <el-card class="management-card">
          <template #header>
            <div class="management-header">
              <div class="card-header">
                <el-icon><Menu /></el-icon>
                <span>菜品列表</span>
              </div>
              <div class="header-actions">
                <el-button type="primary" @click="showAddDialog">
                  <el-icon><Plus /></el-icon>
                  添加菜品
                </el-button>
                <el-button @click="exportData">
                  <el-icon><Download /></el-icon>
                  导出数据
                </el-button>
                <el-button @click="refreshData">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </div>
          </template>

          <!-- 搜索和筛选区域 -->
          <div class="search-area">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索菜品名称"
                  clearable
                  @clear="handleSearch"
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-select v-model="filters.category" placeholder="菜品分类" clearable>
                  <el-option label="主食类" value="staple" />
                  <el-option label="荤菜类" value="meat" />
                  <el-option label="素菜类" value="vegetable" />
                  <el-option label="汤品类" value="soup" />
                  <el-option label="甜品类" value="dessert" />
                  <el-option label="饮品类" value="beverage" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="filters.difficulty" placeholder="烹饪难度" clearable>
                  <el-option label="简单" value="1" />
                  <el-option label="中等" value="2" />
                  <el-option label="困难" value="3" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="filters.status" placeholder="状态" clearable>
                  <el-option label="启用" value="active" />
                  <el-option label="禁用" value="inactive" />
                  <el-option label="草稿" value="draft" />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetFilters">重置</el-button>
              </el-col>
            </el-row>
          </div>

          <!-- 批量操作区域 -->
          <div class="batch-actions" v-if="selectedDishes.length > 0">
            <el-alert
              :title="`已选择 ${selectedDishes.length} 个菜品`"
              type="info"
              :closable="false"
            >
              <template #default>
                <el-button size="small" @click="batchEnable">批量启用</el-button>
                <el-button size="small" @click="batchDisable">批量禁用</el-button>
                <el-button size="small" type="danger" @click="batchDelete">批量删除</el-button>
              </template>
            </el-alert>
          </div>

          <!-- 菜品表格 -->
          <el-table
            :data="dishList"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="图片" width="80">
              <template #default="scope">
                <el-image
                  :src="scope.row.image"
                  fit="cover"
                  style="width: 60px; height: 60px; border-radius: 8px"
                  :preview-src-list="[scope.row.image]"
                />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="菜品名称" width="150" />
            <el-table-column prop="category" label="分类" width="100">
              <template #default="scope">
                <el-tag :type="getCategoryTagType(scope.row.category)">
                  {{ getCategoryText(scope.row.category) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column prop="cookingTime" label="烹饪时间" width="100">
              <template #default="scope">{{ scope.row.cookingTime }}分钟</template>
            </el-table-column>
            <el-table-column prop="difficulty" label="难度" width="100">
              <template #default="scope">
                <el-rate
                  v-model="scope.row.difficulty"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}级"
                />
              </template>
            </el-table-column>
            <el-table-column prop="calories" label="热量" width="80">
              <template #default="scope">{{ scope.row.calories }}kcal</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="120" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="viewDish(scope.row)">
                  查看
                </el-button>
                <el-button link type="primary" size="small" @click="editDish(scope.row)">
                  编辑
                </el-button>
                <el-button
                  link
                  :type="scope.row.status === 'active' ? 'warning' : 'success'"
                  size="small"
                  @click="toggleStatus(scope.row)"
                >
                  {{ scope.row.status === 'active' ? '禁用' : '启用' }}
                </el-button>
                <el-button link type="danger" size="small" @click="deleteDish(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="totalDishes"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>

        <!-- 统计信息 -->
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-icon" style="background-color: #409eff">
                  <el-icon><Menu /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ totalDishes }}</div>
                  <div class="stat-label">总菜品数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-icon" style="background-color: #67c23a">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ activeDishes }}</div>
                  <div class="stat-label">启用菜品</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-icon" style="background-color: #e6a23c">
                  <el-icon><EditPen /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ draftDishes }}</div>
                  <div class="stat-label">草稿菜品</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-icon" style="background-color: #f56c6c">
                  <el-icon><CircleClose /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ inactiveDishes }}</div>
                  <div class="stat-label">禁用菜品</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!-- 添加/编辑菜品对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑菜品' : '添加菜品'"
      width="800px"
      @close="resetForm"
    >
      <el-form :model="dishForm" :rules="formRules" ref="dishFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜品名称" prop="name">
              <el-input v-model="dishForm.name" placeholder="请输入菜品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜品分类" prop="category">
              <el-select v-model="dishForm.category" placeholder="请选择分类">
                <el-option label="主食类" value="staple" />
                <el-option label="荤菜类" value="meat" />
                <el-option label="素菜类" value="vegetable" />
                <el-option label="汤品类" value="soup" />
                <el-option label="甜品类" value="dessert" />
                <el-option label="饮品类" value="beverage" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="菜品描述" prop="description">
          <el-input
            v-model="dishForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入菜品描述"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="烹饪时间" prop="cookingTime">
              <el-input-number
                v-model="dishForm.cookingTime"
                :min="1"
                :max="300"
                placeholder="分钟"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="烹饪难度" prop="difficulty">
              <el-rate v-model="dishForm.difficulty" :max="5" show-text />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="热量" prop="calories">
              <el-input-number
                v-model="dishForm.calories"
                :min="0"
                :max="2000"
                placeholder="kcal"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="菜品图片" prop="image">
          <el-input v-model="dishForm.image" placeholder="请输入图片URL">
            <template #append>
              <el-button>上传</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-checkbox-group v-model="dishForm.tags">
            <el-checkbox label="low-calorie">低卡</el-checkbox>
            <el-checkbox label="high-protein">高蛋白</el-checkbox>
            <el-checkbox label="low-fat">低脂</el-checkbox>
            <el-checkbox label="vegetarian">素食</el-checkbox>
            <el-checkbox label="spicy">辣味</el-checkbox>
            <el-checkbox label="sweet">甜味</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dishForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDish">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Menu,
  Plus,
  Download,
  Refresh,
  Search,
  CircleCheck,
  EditPen,
  CircleClose
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalDishes = ref(0)
const selectedDishes = ref([])
const dishFormRef = ref()

const filters = reactive({
  category: '',
  difficulty: '',
  status: ''
})

const dishForm = reactive({
  id: null,
  name: '',
  category: '',
  description: '',
  cookingTime: 30,
  difficulty: 3,
  calories: 200,
  image: '',
  tags: [],
  status: 'active'
})

const formRules = {
  name: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择菜品分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入菜品描述', trigger: 'blur' }]
}

const dishList = ref([
  {
    id: 1,
    name: '山药蒸排骨',
    category: 'meat',
    description: '滋补健脾，适合气虚体质的温补菜品',
    cookingTime: 45,
    difficulty: 3,
    calories: 280,
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    tags: ['high-protein', 'low-fat'],
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: '红枣小米粥',
    category: 'staple',
    description: '补血养颜，温补滋养的养生粥品',
    cookingTime: 20,
    difficulty: 1,
    calories: 180,
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    tags: ['low-calorie', 'vegetarian'],
    status: 'active',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    name: '清蒸鲈鱼',
    category: 'meat',
    description: '清淡鲜美，营养丰富的水产品',
    cookingTime: 25,
    difficulty: 2,
    calories: 220,
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    tags: ['high-protein', 'low-fat'],
    status: 'active',
    createdAt: '2024-01-13'
  },
  {
    id: 4,
    name: '莲子银耳汤',
    category: 'soup',
    description: '滋阴润燥，适合秋冬季节的汤品',
    cookingTime: 60,
    difficulty: 2,
    calories: 120,
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    tags: ['low-calorie', 'vegetarian'],
    status: 'draft',
    createdAt: '2024-01-12'
  },
  {
    id: 5,
    name: '茯苓薏米粥',
    category: 'staple',
    description: '健脾祛湿，适合痰湿体质的主食',
    cookingTime: 30,
    difficulty: 1,
    calories: 160,
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    tags: ['low-fat', 'vegetarian'],
    status: 'inactive',
    createdAt: '2024-01-11'
  }
])

const activeDishes = computed(() => {
  return dishList.value.filter(dish => dish.status === 'active').length
})

const draftDishes = computed(() => {
  return dishList.value.filter(dish => dish.status === 'draft').length
})

const inactiveDishes = computed(() => {
  return dishList.value.filter(dish => dish.status === 'inactive').length
})

const getCategoryTagType = category => {
  const typeMap = {
    staple: 'primary',
    meat: 'danger',
    vegetable: 'success',
    soup: 'info',
    dessert: 'warning',
    beverage: ''
  }
  return typeMap[category] || ''
}

const getCategoryText = category => {
  const textMap = {
    staple: '主食类',
    meat: '荤菜类',
    vegetable: '素菜类',
    soup: '汤品类',
    dessert: '甜品类',
    beverage: '饮品类'
  }
  return textMap[category] || category
}

const getStatusTagType = status => {
  const typeMap = {
    active: 'success',
    inactive: 'danger',
    draft: 'warning'
  }
  return typeMap[status] || ''
}

const getStatusText = status => {
  const textMap = {
    active: '启用',
    inactive: '禁用',
    draft: '草稿'
  }
  return textMap[status] || status
}

const handleSearch = () => {
  ElMessage.success('搜索功能待实现')
}

const resetFilters = () => {
  Object.assign(filters, {
    category: '',
    difficulty: '',
    status: ''
  })
  searchQuery.value = ''
  ElMessage.success('筛选条件已重置')
}

const handleSelectionChange = selection => {
  selectedDishes.value = selection
}

const showAddDialog = () => {
  isEdit.value = false
  dialogVisible.value = true
}

const editDish = dish => {
  isEdit.value = true
  Object.assign(dishForm, dish)
  dialogVisible.value = true
}

const viewDish = dish => {
  ElMessage.info(`查看菜品详情: ${dish.name}`)
}

const toggleStatus = dish => {
  const newStatus = dish.status === 'active' ? 'inactive' : 'active'
  dish.status = newStatus
  ElMessage.success(`菜品状态已${newStatus === 'active' ? '启用' : '禁用'}`)
}

const deleteDish = dish => {
  ElMessageBox.confirm(`确定要删除菜品 "${dish.name}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = dishList.value.findIndex(item => item.id === dish.id)
    if (index > -1) {
      dishList.value.splice(index, 1)
      totalDishes.value--
      ElMessage.success('菜品删除成功')
    }
  })
}

const batchEnable = () => {
  selectedDishes.value.forEach(dish => {
    dish.status = 'active'
  })
  ElMessage.success(`已启用 ${selectedDishes.value.length} 个菜品`)
}

const batchDisable = () => {
  selectedDishes.value.forEach(dish => {
    dish.status = 'inactive'
  })
  ElMessage.success(`已禁用 ${selectedDishes.value.length} 个菜品`)
}

const batchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedDishes.value.length} 个菜品吗？`,
    '确认批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const selectedIds = selectedDishes.value.map(dish => dish.id)
    dishList.value = dishList.value.filter(dish => !selectedIds.includes(dish.id))
    totalDishes.value -= selectedDishes.value.length
    selectedDishes.value = []
    ElMessage.success('批量删除成功')
  })
}

const saveDish = () => {
  dishFormRef.value.validate(valid => {
    if (valid) {
      if (isEdit.value) {
        const index = dishList.value.findIndex(item => item.id === dishForm.id)
        if (index > -1) {
          Object.assign(dishList.value[index], dishForm)
        }
        ElMessage.success('菜品更新成功')
      } else {
        const newDish = {
          ...dishForm,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0]
        }
        dishList.value.unshift(newDish)
        totalDishes.value++
        ElMessage.success('菜品添加成功')
      }
      dialogVisible.value = false
      resetForm()
    }
  })
}

const resetForm = () => {
  Object.assign(dishForm, {
    id: null,
    name: '',
    category: '',
    description: '',
    cookingTime: 30,
    difficulty: 3,
    calories: 200,
    image: '',
    tags: [],
    status: 'active'
  })
  if (dishFormRef.value) {
    dishFormRef.value.resetFields()
  }
}

const exportData = () => {
  ElMessage.success('导出功能待实现')
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleSizeChange = val => {
  pageSize.value = val
}

const handleCurrentChange = val => {
  currentPage.value = val
}

onMounted(() => {
  totalDishes.value = dishList.value.length
})
</script>

<style scoped>
.dish-management {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #409eff;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 14px;
}

.management-card {
  margin-bottom: 20px;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header .el-icon {
  color: #409eff;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.batch-actions {
  margin-bottom: 20px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}
</style>
