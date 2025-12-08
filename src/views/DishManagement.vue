<template>
  <div class="dish-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索菜名、描述或食材"
            @keyup.enter="handleSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedCategory" placeholder="选择分类" clearable>
            <el-option label="推荐菜谱" value="recommended" />
            <el-option label="温性菜谱" value="warming" />
            <el-option label="凉性菜谱" value="cooling" />
            <el-option label="快手菜谱" value="quick" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="isActiveFilter" placeholder="状态筛选" clearable>
            <el-option label="已启用" :value="true" />
            <el-option label="已禁用" :value="false" />
          </el-select>
        </el-col>
        <el-col :span="10">
          <div class="action-buttons">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="handleExport">导出</el-button>
            <el-button type="info" @click="showColumnSettings = true">列设置</el-button>
            <el-button type="primary" @click="handleAddDish" class="add-dish-btn">
              <el-icon><Plus /></el-icon>
              手工添加菜品
            </el-button>
            <el-button type="success" @click="handleAiAddDish" class="ai-add-dish-btn">
              <el-icon><Cpu /></el-icon>
              AI添加菜品
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 菜品列表 -->
    <div class="table-section">
      <el-table :data="recipeList" v-loading="loading" style="width: 100%" stripe>
        <!-- 图标列 -->
        <el-table-column
          v-if="visibleColumns.includes('emoji')"
          prop="emoji"
          label="图标"
          width="60"
        >
          <template #default="{ row }">
            <span class="recipe-emoji">{{ row.emoji }}</span>
          </template>
        </el-table-column>

        <!-- 菜名列 -->
        <el-table-column
          v-if="visibleColumns.includes('name')"
          prop="name"
          label="菜名"
          width="150"
        />

        <!-- 描述列 -->
        <el-table-column
          v-if="visibleColumns.includes('description')"
          prop="description"
          label="描述"
          width="200"
        >
          <template #default="{ row }">
            <el-tooltip :content="row.description" placement="top" v-if="row.description">
              <span class="text-ellipsis">{{ row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 图片列 -->
        <el-table-column
          v-if="visibleColumns.includes('image')"
          prop="image"
          label="图片"
          width="100"
        >
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="row.image"
              style="width: 60px; height: 60px"
              fit="cover"
            />
          </template>
        </el-table-column>

        <!-- 分类列 -->
        <el-table-column
          v-if="visibleColumns.includes('category')"
          prop="category"
          label="分类"
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type="getCategoryTagType(row.category)">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 烹饪时间列 -->
        <el-table-column
          v-if="visibleColumns.includes('cookingTime')"
          prop="cookingTime"
          label="烹饪时间"
          width="100"
        >
          <template #default="{ row }">{{ row.cookingTime }}分钟</template>
        </el-table-column>

        <!-- 难度列 -->
        <el-table-column
          v-if="visibleColumns.includes('difficulty')"
          prop="difficulty"
          label="难度"
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type="getDifficultyTagType(row.difficulty)">
              {{ row.difficulty }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 性质列 -->
        <el-table-column
          v-if="visibleColumns.includes('nature')"
          prop="nature"
          label="性质"
          width="80"
        >
          <template #default="{ row }">
            <el-tag v-if="row.nature" :type="getNatureTagType(row.nature)">{{ row.nature }}</el-tag>
          </template>
        </el-table-column>

        <!-- 味道列 -->
        <el-table-column
          v-if="visibleColumns.includes('flavors')"
          prop="flavors"
          label="味道"
          width="120"
        >
          <template #default="{ row }">
            <el-tag
              v-for="flavor in row.flavors"
              :key="flavor"
              size="small"
              style="margin-right: 5px"
            >
              {{ flavor }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 归经列 -->
        <el-table-column
          v-if="visibleColumns.includes('meridians')"
          prop="meridians"
          label="归经"
          width="120"
        >
          <template #default="{ row }">
            <el-tag
              v-for="meridian in row.meridians"
              :key="meridian"
              size="small"
              style="margin-right: 5px"
            >
              {{ meridian }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 适合体质列 -->
        <el-table-column
          v-if="visibleColumns.includes('suitableConstitutions')"
          prop="suitableConstitutions"
          label="适合体质"
          width="150"
        >
          <template #default="{ row }">
            <el-tooltip
              v-for="constitution in row.suitableConstitutions"
              :key="constitution"
              :content="getConstitutionDescription(constitution)"
              placement="top"
            >
              <el-tag size="small" type="success" style="margin-right: 5px; cursor: pointer">
                {{ getConstitutionName(constitution) }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 禁忌体质列 -->
        <el-table-column
          v-if="visibleColumns.includes('avoidConstitutions')"
          prop="avoidConstitutions"
          label="禁忌体质"
          width="150"
        >
          <template #default="{ row }">
            <el-tooltip
              v-for="constitution in row.avoidConstitutions"
              :key="constitution"
              :content="getConstitutionDescription(constitution)"
              placement="top"
            >
              <el-tag size="small" type="danger" style="margin-right: 5px; cursor: pointer">
                {{ getConstitutionName(constitution) }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 标签列 -->
        <el-table-column
          v-if="visibleColumns.includes('tags')"
          prop="tags"
          label="标签"
          width="150"
        >
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 5px">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 基础评分列 -->
        <el-table-column
          v-if="visibleColumns.includes('baseScore')"
          prop="baseScore"
          label="基础评分"
          width="100"
        >
          <template #default="{ row }">
            <el-rate v-model="row.baseScore" disabled show-score />
          </template>
        </el-table-column>

        <!-- 匹配分数列 -->
        <el-table-column
          v-if="visibleColumns.includes('matchScore')"
          prop="matchScore"
          label="匹配分数"
          width="100"
        >
          <template #default="{ row }">
            <span v-if="row.matchScore !== undefined">{{ row.matchScore }}分</span>
          </template>
        </el-table-column>

        <!-- 状态列 -->
        <el-table-column
          v-if="visibleColumns.includes('isActive')"
          prop="isActive"
          label="状态"
          width="80"
        >
          <template #default="{ row }">
            <el-switch v-model="row.isActive" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>

        <!-- 创建时间列 -->
        <el-table-column
          v-if="visibleColumns.includes('createdAt')"
          prop="createdAt"
          label="创建时间"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <!-- 更新时间列 -->
        <el-table-column
          v-if="visibleColumns.includes('updatedAt')"
          prop="updatedAt"
          label="更新时间"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-if="visibleColumns.includes('actions')"
          label="操作"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingRecipe ? '编辑菜品' : '添加菜品'"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-form ref="recipeFormRef" :model="recipeForm" :rules="recipeRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜名" prop="name">
              <el-input v-model="recipeForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="emoji">
              <el-input v-model="recipeForm.emoji" placeholder="输入emoji表情" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述" prop="description">
          <el-input v-model="recipeForm.description" type="textarea" :rows="3" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="分类" prop="category">
              <el-select v-model="recipeForm.category">
                <el-option label="平性类" value="neutral" />
                <el-option label="温补类" value="warming" />
                <el-option label="清润类" value="cooling" />
                <el-option label="快手菜谱" value="quick" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="烹饪时间" prop="cookingTime">
              <el-input-number v-model="recipeForm.cookingTime" :min="1" :max="999" />
              <span style="margin-left: 10px">分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="recipeForm.difficulty">
                <el-option label="简单" value="简单" />
                <el-option label="中等" value="中等" />
                <el-option label="困难" value="困难" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="recipeForm.tags"
            multiple
            filterable
            allow-create
            placeholder="选择或输入标签"
          >
            <el-option label="素食" value="素食" />
            <el-option label="低脂" value="低脂" />
            <el-option label="高蛋白" value="高蛋白" />
            <el-option label="清淡" value="清淡" />
            <el-option label="辣" value="辣" />
            <el-option label="甜" value="甜" />
          </el-select>
        </el-form-item>

        <el-form-item label="食材" prop="ingredients">
          <div class="ingredients-section">
            <div
              v-for="(ingredient, index) in recipeForm.ingredients"
              :key="index"
              class="ingredient-item"
            >
              <el-input
                v-model="ingredient.name"
                placeholder="食材名称"
                style="width: 150px; margin-right: 10px"
              />
              <el-input
                v-model="ingredient.amount"
                placeholder="用量"
                style="width: 120px; margin-right: 10px"
              />
              <el-input
                v-model="ingredient.icon"
                placeholder="图标"
                style="width: 100px; margin-right: 10px"
              />
              <el-button type="danger" size="small" @click="removeIngredient(index)">
                删除
              </el-button>
            </div>
            <el-button type="primary" @click="addIngredient">添加食材</el-button>
          </div>
        </el-form-item>

        <el-form-item label="制作步骤" prop="steps">
          <div class="steps-section">
            <div v-for="(step, index) in recipeForm.steps" :key="index" class="step-item">
              <div class="step-header">
                <span>步骤 {{ step.order }}</span>
                <el-button type="danger" size="small" @click="removeStep(index)">删除</el-button>
              </div>
              <el-input v-model="step.content" type="textarea" :rows="2" placeholder="步骤描述" />
            </div>
            <el-button type="primary" @click="addStep">添加步骤</el-button>
          </div>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="适合体质" prop="suitableConstitutions">
              <el-select
                v-model="recipeForm.suitableConstitutions"
                multiple
                placeholder="选择适合的体质"
                style="width: 100%"
              >
                <el-option label="平和质" value="balanced" />
                <el-option label="气虚质" value="qi_deficiency" />
                <el-option label="阳虚质" value="yang_deficiency" />
                <el-option label="阴虚质" value="yin_deficiency" />
                <el-option label="痰湿质" value="phlegm_dampness" />
                <el-option label="湿热质" value="damp_heat" />
                <el-option label="血瘀质" value="blood_stasis" />
                <el-option label="气郁质" value="qi_stagnation" />
                <el-option label="特禀质" value="special" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="禁忌体质" prop="avoidConstitutions">
              <el-select
                v-model="recipeForm.avoidConstitutions"
                multiple
                placeholder="选择禁忌的体质"
                style="width: 100%"
              >
                <el-option label="平和质" value="balanced" />
                <el-option label="气虚质" value="qi_deficiency" />
                <el-option label="阳虚质" value="yang_deficiency" />
                <el-option label="阴虚质" value="yin_deficiency" />
                <el-option label="痰湿质" value="phlegm_dampness" />
                <el-option label="湿热质" value="damp_heat" />
                <el-option label="血瘀质" value="blood_stasis" />
                <el-option label="气郁质" value="qi_stagnation" />
                <el-option label="特禀质" value="special" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="启用状态">
          <el-switch v-model="recipeForm.isActive" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 列设置对话框 -->
    <el-dialog v-model="showColumnSettings" title="列设置" width="50%">
      <div class="column-settings">
        <el-checkbox-group v-model="visibleColumns">
          <el-row :gutter="20">
            <el-col :span="8" v-for="column in allColumns" :key="column.key">
              <el-checkbox :label="column.key" :disabled="column.required">
                {{ column.label }}
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="showColumnSettings = false">取消</el-button>
        <el-button type="primary" @click="saveColumnSettings">保存</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="showViewDialog" title="菜品详情" width="80%">
      <div v-if="viewingRecipe" class="recipe-detail">
        <div class="detail-header">
          <h2>{{ viewingRecipe.emoji }} {{ viewingRecipe.name }}</h2>
          <el-tag :type="getCategoryTagType(viewingRecipe.category)">
            {{ getCategoryLabel(viewingRecipe.category) }}
          </el-tag>
        </div>

        <div class="detail-content">
          <!-- 基础信息 -->
          <el-card class="detail-card" header="基础信息">
            <el-row :gutter="20">
              <el-col :span="12">
                <p>
                  <strong>菜名：</strong>
                  {{ viewingRecipe.name }}
                </p>
                <p>
                  <strong>描述：</strong>
                  {{ viewingRecipe.description }}
                </p>
                <p>
                  <strong>分类：</strong>
                  <el-tag :type="getCategoryTagType(viewingRecipe.category)">
                    {{ getCategoryLabel(viewingRecipe.category) }}
                  </el-tag>
                </p>
                <p>
                  <strong>烹饪时间：</strong>
                  {{ viewingRecipe.cookingTime }}分钟
                </p>
                <p>
                  <strong>难度：</strong>
                  <el-tag :type="getDifficultyTagType(viewingRecipe.difficulty)">
                    {{ viewingRecipe.difficulty }}
                  </el-tag>
                </p>
              </el-col>
              <el-col :span="12">
                <p>
                  <strong>状态：</strong>
                  <el-tag :type="viewingRecipe.isActive ? 'success' : 'danger'">
                    {{ viewingRecipe.isActive ? '已启用' : '已禁用' }}
                  </el-tag>
                </p>
                <p>
                  <strong>基础评分：</strong>
                  <el-rate v-model="viewingRecipe.baseScore" disabled show-score />
                </p>
                <p v-if="viewingRecipe.matchScore !== undefined">
                  <strong>匹配分数：</strong>
                  {{ viewingRecipe.matchScore }}分
                </p>
                <p>
                  <strong>创建时间：</strong>
                  {{ formatDate(viewingRecipe.createdAt) }}
                </p>
                <p>
                  <strong>更新时间：</strong>
                  {{ formatDate(viewingRecipe.updatedAt) }}
                </p>
              </el-col>
            </el-row>
          </el-card>

          <!-- 中医属性 -->
          <el-card class="detail-card" header="中医属性">
            <el-row :gutter="20">
              <el-col :span="8">
                <p>
                  <strong>性质：</strong>
                  <el-tag
                    v-if="viewingRecipe.nature"
                    :type="getNatureTagType(viewingRecipe.nature)"
                  >
                    {{ viewingRecipe.nature }}
                  </el-tag>
                </p>
                <p>
                  <strong>味道：</strong>
                  <el-tag
                    v-for="flavor in viewingRecipe.flavors"
                    :key="flavor"
                    size="small"
                    style="margin-right: 5px"
                  >
                    {{ flavor }}
                  </el-tag>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <strong>归经：</strong>
                  <el-tag
                    v-for="meridian in viewingRecipe.meridians"
                    :key="meridian"
                    size="small"
                    style="margin-right: 5px"
                  >
                    {{ meridian }}
                  </el-tag>
                </p>
                <p v-if="viewingRecipe.meridianText">
                  <strong>归经说明：</strong>
                  {{ viewingRecipe.meridianText }}
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <strong>适合体质：</strong>
                  <el-tooltip
                    v-for="constitution in viewingRecipe.suitableConstitutions"
                    :key="constitution"
                    :content="getConstitutionDescription(constitution)"
                    placement="top"
                  >
                    <el-tag size="small" type="success" style="margin-right: 5px; cursor: pointer">
                      {{ getConstitutionName(constitution) }}
                    </el-tag>
                  </el-tooltip>
                </p>
                <p>
                  <strong>禁忌体质：</strong>
                  <el-tooltip
                    v-for="constitution in viewingRecipe.avoidConstitutions"
                    :key="constitution"
                    :content="getConstitutionDescription(constitution)"
                    placement="top"
                  >
                    <el-tag size="small" type="danger" style="margin-right: 5px; cursor: pointer">
                      {{ getConstitutionName(constitution) }}
                    </el-tag>
                  </el-tooltip>
                </p>
              </el-col>
            </el-row>
            <el-row v-if="viewingRecipe.analysis">
              <el-col :span="24">
                <p>
                  <strong>中医分析：</strong>
                  {{ viewingRecipe.analysis }}
                </p>
              </el-col>
            </el-row>
          </el-card>

          <!-- 标签 -->
          <el-card
            v-if="viewingRecipe.tags && viewingRecipe.tags.length"
            class="detail-card"
            header="标签"
          >
            <el-tag v-for="tag in viewingRecipe.tags" :key="tag" style="margin-right: 5px">
              {{ tag }}
            </el-tag>
          </el-card>

          <!-- 食材 -->
          <el-card
            v-if="viewingRecipe.ingredients && viewingRecipe.ingredients.length"
            class="detail-card"
            header="食材清单"
          >
            <el-row :gutter="20">
              <el-col
                :span="12"
                v-for="(ingredient, index) in viewingRecipe.ingredients"
                :key="index"
              >
                <div class="ingredient-item-detail">
                  <span class="ingredient-icon">{{ ingredient.icon || '🥘' }}</span>
                  <span class="ingredient-name">{{ ingredient.name }}</span>
                  <span class="ingredient-amount">{{ ingredient.amount }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <!-- 制作步骤 -->
          <el-card
            v-if="viewingRecipe.steps && viewingRecipe.steps.length"
            class="detail-card"
            header="制作步骤"
          >
            <div class="steps-detail">
              <div
                v-for="(step, index) in viewingRecipe.steps"
                :key="step.order"
                class="step-item-detail"
              >
                <div class="step-number">{{ step.order }}</div>
                <div class="step-content">{{ step.content }}</div>
              </div>
            </div>
          </el-card>

          <!-- 匹配信息 -->
          <el-card
            v-if="viewingRecipe.matchScore !== undefined || viewingRecipe.matchReason"
            class="detail-card"
            header="个性化匹配信息"
          >
            <p v-if="viewingRecipe.matchScore !== undefined">
              <strong>匹配分数：</strong>
              {{ viewingRecipe.matchScore }}分
            </p>
            <p v-if="viewingRecipe.matchReason">
              <strong>匹配原因：</strong>
              {{ viewingRecipe.matchReason }}
            </p>
          </el-card>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { recipeApi } from '../api/recipe'

// 响应式数据
const loading = ref(false)
const saving = ref(false)
const recipeList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 搜索相关
const searchKeyword = ref('')
const selectedCategory = ref('')
const isActiveFilter = ref('')

// 对话框状态
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const showColumnSettings = ref(false)
const editingRecipe = ref(null)
const viewingRecipe = ref(null)

// 列设置相关
const visibleColumns = ref([
  'emoji',
  'name',
  'category',
  'cookingTime',
  'difficulty',
  'isActive',
  'createdAt',
  'actions'
])

const allColumns = [
  { key: 'emoji', label: '图标', required: true },
  { key: 'name', label: '菜名', required: true },
  { key: 'description', label: '描述' },
  { key: 'image', label: '图片' },
  { key: 'category', label: '分类', required: true },
  { key: 'cookingTime', label: '烹饪时间' },
  { key: 'difficulty', label: '难度' },
  { key: 'nature', label: '性质' },
  { key: 'flavors', label: '味道' },
  { key: 'meridians', label: '归经' },
  { key: 'suitableConstitutions', label: '适合体质' },
  { key: 'avoidConstitutions', label: '禁忌体质' },
  { key: 'tags', label: '标签' },
  { key: 'baseScore', label: '基础评分' },
  { key: 'matchScore', label: '匹配分数' },
  { key: 'isActive', label: '状态', required: true },
  { key: 'createdAt', label: '创建时间' },
  { key: 'updatedAt', label: '更新时间' },
  { key: 'actions', label: '操作', required: true }
]

// 表单相关
const recipeFormRef = ref()
const recipeForm = reactive({
  name: '',
  description: '',
  emoji: '',
  category: '',
  tags: [],
  ingredients: [],
  steps: [],
  suitableConstitutions: [],
  avoidConstitutions: [],
  cookingTime: 30,
  difficulty: '中等',
  isActive: true
})

// 表单验证规则
const recipeRules = {
  name: [{ required: true, message: '请输入菜名', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  emoji: [{ required: true, message: '请输入图标', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  cookingTime: [{ required: true, message: '请输入烹饪时间', trigger: 'blur' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }]
}

// 页面加载时获取数据
onMounted(() => {
  loadRecipes()
})

// 加载菜谱列表
const loadRecipes = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }

    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }
    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }
    if (isActiveFilter.value !== '') {
      params.isActive = isActiveFilter.value
    }

    const response = await recipeApi.getRecipes(params)
    recipeList.value = response.data.list
    total.value = response.data.pagination.total
  } catch (error) {
    ElMessage.error('获取菜谱列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadRecipes()
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
  isActiveFilter.value = ''
  currentPage.value = 1
  loadRecipes()
}

// 分页处理
const handleSizeChange = val => {
  pageSize.value = val
  loadRecipes()
}

const handleCurrentChange = val => {
  currentPage.value = val
  loadRecipes()
}

// 添加菜品
const handleAddDish = () => {
  resetForm()
  showCreateDialog.value = true
}

// AI添加菜品
const handleAiAddDish = () => {
  // 在新标签页中打开AI添加菜品页面
  window.open('/ai-add-dish', '_blank')
}

// 查看详情
const handleView = row => {
  viewingRecipe.value = { ...row }
  showViewDialog.value = true
}

// 编辑
const handleEdit = row => {
  editingRecipe.value = row
  Object.assign(recipeForm, {
    ...row,
    ingredients: [...(row.ingredients || [])],
    steps: [...(row.steps || [])]
  })
  showCreateDialog.value = true
}

// 删除
const handleDelete = row => {
  ElMessageBox.confirm(`确定要删除菜品"${row.name}"吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await recipeApi.deleteRecipe(row.id || row._id)
      ElMessage.success('删除成功')
      loadRecipes()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 状态切换
const handleStatusChange = async row => {
  try {
    await recipeApi.updateRecipe(row.id || row._id, {
      isActive: row.isActive
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    // 恢复原状态
    row.isActive = !row.isActive
    ElMessage.error('状态更新失败')
  }
}

// 保存
const handleSave = async () => {
  if (!recipeFormRef.value) return

  try {
    await recipeFormRef.value.validate()
    saving.value = true

    // 处理数据格式
    const data = {
      ...recipeForm,
      ingredients: recipeForm.ingredients.filter(item => item.name),
      steps: recipeForm.steps
        .filter(item => item.content)
        .map((item, index) => ({
          order: index + 1,
          content: item.content
        }))
    }

    if (editingRecipe.value) {
      await recipeApi.updateRecipe(editingRecipe.value.id || editingRecipe.value._id, data)
      ElMessage.success('更新成功')
    } else {
      await recipeApi.createRecipe(data)
      ElMessage.success('创建成功')
    }

    showCreateDialog.value = false
    resetForm()
    loadRecipes()
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  editingRecipe.value = null
  Object.assign(recipeForm, {
    name: '',
    description: '',
    emoji: '',
    category: '',
    tags: [],
    ingredients: [],
    steps: [],
    suitableConstitutions: [],
    avoidConstitutions: [],
    cookingTime: 30,
    difficulty: '中等',
    isActive: true
  })
  recipeFormRef.value?.resetFields()
}

// 添加食材
const addIngredient = () => {
  recipeForm.ingredients.push({
    name: '',
    amount: '',
    icon: ''
  })
}

// 删除食材
const removeIngredient = index => {
  recipeForm.ingredients.splice(index, 1)
}

// 添加步骤
const addStep = () => {
  recipeForm.steps.push({
    order: recipeForm.steps.length + 1,
    content: ''
  })
}

// 删除步骤
const removeStep = index => {
  recipeForm.steps.splice(index, 1)
  // 重新编号
  recipeForm.steps.forEach((step, i) => {
    step.order = i + 1
  })
}

// 工具函数
const getCategoryLabel = category => {
  const labels = {
    recommended: '推荐菜谱',
    warming: '温性菜谱',
    cooling: '凉性菜谱',
    quick: '快手菜谱'
  }
  return labels[category] || category
}

const getCategoryTagType = category => {
  const types = {
    recommended: 'success',
    warming: 'danger',
    cooling: 'info',
    quick: 'warning'
  }
  return types[category] || ''
}

const getDifficultyTagType = difficulty => {
  const types = {
    简单: 'success',
    中等: 'warning',
    困难: 'danger'
  }
  return types[difficulty] || ''
}

const formatDate = dateString => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-CN')
}

const getNatureTagType = nature => {
  const types = {
    温: 'danger',
    凉: 'info',
    平: 'success',
    热: 'danger',
    寒: 'info'
  }
  return types[nature] || ''
}

// 体质类型映射
const constitutionMap = {
  balanced: { name: '平和质', description: '阴阳气血调和，体态适中，面色红润，精力充沛' },
  qi_deficiency: { name: '气虚质', description: '元气不足，疲乏气短，容易出汗，抵抗力较弱' },
  yang_deficiency: { name: '阳虚质', description: '阳气不足，畏寒怕冷，手脚冰凉，喜热饮食' },
  yin_deficiency: { name: '阴虚质', description: '阴液亏少，口燥咽干，手足心热，喜冷饮' },
  phlegm_dampness: { name: '痰湿质', description: '痰湿凝聚，形体肥胖，腹部肥满，容易困倦' },
  damp_heat: { name: '湿热质', description: '湿热内蕴，面垢油光，口苦口干，容易长痘' },
  blood_stasis: { name: '血瘀质', description: '血行不畅，面色晦暗，容易出现瘀斑，肤色暗沉' },
  qi_stagnation: { name: '气郁质', description: '气机郁滞，情绪抑郁，容易焦虑，胸闷不舒' },
  special: { name: '特禀质', description: '先天禀赋不足或过敏体质，容易过敏，适应能力差' }
}

// 获取体质显示名称
const getConstitutionName = key => {
  return constitutionMap[key]?.name || key
}

// 获取体质描述
const getConstitutionDescription = key => {
  return constitutionMap[key]?.description || ''
}

// 列设置相关函数
const saveColumnSettings = () => {
  // 保存到本地存储
  localStorage.setItem('recipeColumns', JSON.stringify(visibleColumns.value))
  showColumnSettings.value = false
  ElMessage.success('列设置已保存')
}

// 加载列设置
const loadColumnSettings = () => {
  const saved = localStorage.getItem('recipeColumns')
  if (saved) {
    try {
      visibleColumns.value = JSON.parse(saved)
    } catch (e) {
      console.error('加载列设置失败', e)
    }
  }
}

// 导出功能
const handleExport = () => {
  const exportData = recipeList.value.map(recipe => {
    const exportRow = {}
    allColumns.forEach(column => {
      if (column.key === 'actions') return // 跳过操作列

      let value = recipe[column.key]

      // 特殊处理数组字段
      if (Array.isArray(value)) {
        value = value.join(', ')
      }

      // 特殊处理布尔值
      if (typeof value === 'boolean') {
        value = value ? '是' : '否'
      }

      // 特殊处理时间
      if (column.key === 'createdAt' || column.key === 'updatedAt') {
        value = formatDate(value)
      }

      exportRow[column.label] = value || ''
    })
    return exportRow
  })

  // 创建CSV内容
  const headers = allColumns
    .filter(col => col.key !== 'actions')
    .map(col => col.label)
    .join(',')

  const rows = exportData.map(row =>
    allColumns
      .filter(col => col.key !== 'actions')
      .map(col => `"${row[col.label] || ''}"`)
      .join(',')
  )

  const csvContent = [headers, ...rows].join('\n')

  // 下载文件
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `菜品列表_${new Date().toLocaleDateString()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('导出成功')
}

// 页面加载时加载列设置
onMounted(() => {
  loadColumnSettings()
  loadRecipes()
})
</script>

<style scoped>
.dish-management {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.search-section {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pagination {
  padding: 20px;
  text-align: right;
  border-top: 1px solid #ebeef5;
}

.recipe-emoji {
  font-size: 24px;
}

.ingredients-section,
.steps-section {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  flex: 1;
}

.ingredient-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.step-item {
  margin-bottom: 15px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-weight: bold;
}

.recipe-detail {
  line-height: 1.6;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.detail-header h2 {
  margin: 0;
  color: #333;
}

.detail-content p {
  margin: 10px 0;
}

.detail-content ul,
.detail-content ol {
  padding-left: 20px;
}

.detail-content li {
  margin: 5px 0;
}

.detail-content h4 {
  margin: 15px 0 10px 0;
  color: #333;
}

/* 详情页面样式 */
.detail-card {
  margin-bottom: 20px;
}

.detail-card :deep(.el-card__header) {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.ingredient-item-detail {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.ingredient-icon {
  font-size: 20px;
  min-width: 24px;
}

.ingredient-name {
  flex: 1;
  font-weight: 500;
}

.ingredient-amount {
  color: #666;
  font-size: 14px;
}

.steps-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item-detail {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.step-number {
  min-width: 32px;
  height: 32px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.step-content {
  flex: 1;
  line-height: 1.6;
  padding-top: 5px;
}

.text-ellipsis {
  display: inline-block;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-settings {
  max-height: 300px;
  overflow-y: auto;
}

.column-settings .el-checkbox {
  margin-bottom: 10px;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.add-dish-btn {
  margin-left: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: bold;
}

.add-dish-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.ai-add-dish-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  font-weight: bold;
}

.ai-add-dish-btn:hover {
  background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
}
</style>
