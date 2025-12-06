<template>
  <div class="recipe-recommendation">
    <el-container>
      <el-header class="page-header">
        <h1>至膳推荐</h1>
        <p>基于您的体质和口味偏好，为您推荐最适合的膳食方案</p>
      </el-header>

      <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="filter-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Filter /></el-icon>
                  <span>筛选条件</span>
                </div>
              </template>

              <el-form :model="filters" label-width="80px" size="small">
                <el-form-item label="餐次">
                  <el-checkbox-group v-model="filters.mealType">
                    <el-checkbox label="breakfast">早餐</el-checkbox>
                    <el-checkbox label="lunch">午餐</el-checkbox>
                    <el-checkbox label="dinner">晚餐</el-checkbox>
                    <el-checkbox label="snack">加餐</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label="季节">
                  <el-select v-model="filters.season" placeholder="选择季节">
                    <el-option label="春季" value="spring" />
                    <el-option label="夏季" value="summer" />
                    <el-option label="秋季" value="autumn" />
                    <el-option label="冬季" value="winter" />
                  </el-select>
                </el-form-item>

                <el-form-item label="体质">
                  <el-select v-model="filters.constitution" placeholder="选择体质">
                    <el-option label="平和质" value="balanced" />
                    <el-option label="气虚质" value="qi-deficiency" />
                    <el-option label="阳虚质" value="yang-deficiency" />
                    <el-option label="阴虚质" value="yin-deficiency" />
                    <el-option label="痰湿质" value="phlegm-dampness" />
                    <el-option label="湿热质" value="damp-heat" />
                  </el-select>
                </el-form-item>

                <el-form-item label="难度">
                  <el-slider
                    v-model="filters.difficulty"
                    :min="1"
                    :max="5"
                    :marks="difficultyMarks"
                    show-stops
                  />
                </el-form-item>

                <el-form-item label="时间">
                  <el-slider
                    v-model="filters.cookingTime"
                    :min="10"
                    :max="120"
                    :marks="timeMarks"
                    show-stops
                  />
                </el-form-item>

                <el-form-item label="标签">
                  <el-checkbox-group v-model="filters.tags">
                    <el-checkbox label="low-calorie">低卡</el-checkbox>
                    <el-checkbox label="high-protein">高蛋白</el-checkbox>
                    <el-checkbox label="low-fat">低脂</el-checkbox>
                    <el-checkbox label="vegetarian">素食</el-checkbox>
                    <el-checkbox label="spicy">辣味</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>

              <div class="filter-actions">
                <el-button size="small" @click="resetFilters">重置</el-button>
                <el-button type="primary" size="small" @click="applyFilters">应用筛选</el-button>
              </div>
            </el-card>
          </el-col>

          <el-col :span="18">
            <el-card class="recommendation-card">
              <template #header>
                <div class="recommendation-header">
                  <div class="card-header">
                    <el-icon><Star /></el-icon>
                    <span>推荐食谱</span>
                  </div>
                  <div class="view-options">
                    <el-radio-group v-model="viewMode" size="small">
                      <el-radio-button label="grid">网格</el-radio-button>
                      <el-radio-button label="list">列表</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
              </template>

              <div class="recommendation-summary">
                <el-alert title="AI智能推荐" type="success" :closable="false" show-icon>
                  基于您的气虚质体质和清淡口味偏好，为您推荐以下营养均衡的食谱
                </el-alert>
              </div>

              <!-- 网格视图 -->
              <div v-if="viewMode === 'grid'" class="recipe-grid">
                <el-row :gutter="20">
                  <el-col :span="8" v-for="recipe in recommendedRecipes" :key="recipe.id">
                    <div class="recipe-card" @click="viewRecipeDetail(recipe)">
                      <div class="recipe-image">
                        <el-image :src="recipe.image" fit="cover" class="recipe-img" />
                        <div class="recipe-badge">
                          <el-tag :type="getMealTypeColor(recipe.mealType)" size="small">
                            {{ getMealTypeText(recipe.mealType) }}
                          </el-tag>
                        </div>
                      </div>
                      <div class="recipe-info">
                        <h4>{{ recipe.name }}</h4>
                        <p class="recipe-desc">{{ recipe.description }}</p>
                        <div class="recipe-meta">
                          <span class="meta-item">
                            <el-icon><Clock /></el-icon>
                            {{ recipe.cookingTime }}分钟
                          </span>
                          <span class="meta-item">
                            <el-icon><User /></el-icon>
                            难度{{ recipe.difficulty }}
                          </span>
                        </div>
                        <div class="recipe-tags">
                          <el-tag size="small" v-for="tag in recipe.tags" :key="tag">
                            {{ getTagText(tag) }}
                          </el-tag>
                        </div>
                        <div class="recipe-rating">
                          <el-rate
                            v-model="recipe.rating"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}"
                          />
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <!-- 列表视图 -->
              <div v-else class="recipe-list">
                <el-table :data="recommendedRecipes" style="width: 100%">
                  <el-table-column width="80">
                    <template #default="scope">
                      <el-image
                        :src="scope.row.image"
                        fit="cover"
                        style="width: 60px; height: 60px; border-radius: 8px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="菜名" />
                  <el-table-column prop="description" label="描述" />
                  <el-table-column prop="cookingTime" label="烹饪时间" width="100" />
                  <el-table-column prop="difficulty" label="难度" width="80" />
                  <el-table-column label="标签" width="200">
                    <template #default="scope">
                      <el-tag
                        size="small"
                        v-for="tag in scope.row.tags"
                        :key="tag"
                        style="margin-right: 5px"
                      >
                        {{ getTagText(tag) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="rating" label="评分" width="120">
                    <template #default="scope">
                      <el-rate
                        v-model="scope.row.rating"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template #default="scope">
                      <el-button
                        link
                        type="primary"
                        size="small"
                        @click="viewRecipeDetail(scope.row)"
                      >
                        查看详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="pagination">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[6, 12, 18, 24]"
                  :total="totalRecipes"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-divider content-position="left">膳食计划</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <el-icon><Calendar /></el-icon>
                  <span>今日膳食计划</span>
                </div>
              </template>

              <el-timeline>
                <el-timeline-item
                  v-for="meal in todayMeals"
                  :key="meal.time"
                  :timestamp="meal.time"
                  :type="meal.type"
                >
                  <el-card class="meal-card">
                    <div class="meal-header">
                      <h4>{{ meal.name }}</h4>
                      <el-tag :type="getMealTypeColor(meal.type)" size="small">
                        {{ getMealTypeText(meal.type) }}
                      </el-tag>
                    </div>
                    <p>{{ meal.description }}</p>
                    <div class="meal-nutrition">
                      <span>热量: {{ meal.calories }}kcal</span>
                      <span>蛋白质: {{ meal.protein }}g</span>
                      <span>脂肪: {{ meal.fat }}g</span>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <el-icon><DataAnalysis /></el-icon>
                  <span>营养分析</span>
                </div>
              </template>

              <div class="nutrition-summary">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="nutrition-item">
                      <h4>今日营养摄入</h4>
                      <div class="nutrition-chart">
                        <el-empty description="营养分布图" :image-size="100">
                          <el-button type="primary">生成分析</el-button>
                        </el-empty>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="nutrition-stats">
                      <h4>营养达标情况</h4>
                      <div class="stat-item">
                        <span>蛋白质</span>
                        <el-progress :percentage="85" color="#67c23a" />
                      </div>
                      <div class="stat-item">
                        <span>碳水化合物</span>
                        <el-progress :percentage="70" color="#e6a23c" />
                      </div>
                      <div class="stat-item">
                        <span>脂肪</span>
                        <el-progress :percentage="60" color="#409eff" />
                      </div>
                      <div class="stat-item">
                        <span>纤维素</span>
                        <el-progress :percentage="90" color="#67c23a" />
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Filter, Star, Clock, User, Calendar, DataAnalysis } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(6)
const totalRecipes = ref(24)

const filters = ref({
  mealType: ['breakfast', 'lunch', 'dinner'],
  season: 'spring',
  constitution: 'qi-deficiency',
  difficulty: 3,
  cookingTime: 30,
  tags: ['low-calorie', 'high-protein']
})

const difficultyMarks = {
  1: '简单',
  3: '中等',
  5: '困难'
}

const timeMarks = {
  10: '10分钟',
  30: '30分钟',
  60: '1小时',
  120: '2小时'
}

const recommendedRecipes = ref([
  {
    id: 1,
    name: '山药蒸排骨',
    description: '滋补健脾，适合气虚体质',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    mealType: 'lunch',
    cookingTime: 45,
    difficulty: 3,
    tags: ['low-calorie', 'high-protein'],
    rating: 4.5
  },
  {
    id: 2,
    name: '红枣小米粥',
    description: '补血养颜，温补滋养',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    mealType: 'breakfast',
    cookingTime: 20,
    difficulty: 1,
    tags: ['low-fat', 'vegetarian'],
    rating: 4.8
  },
  {
    id: 3,
    name: '清蒸鲈鱼',
    description: '清淡鲜美，营养丰富',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    mealType: 'dinner',
    cookingTime: 25,
    difficulty: 2,
    tags: ['high-protein', 'low-fat'],
    rating: 4.6
  },
  {
    id: 4,
    name: '莲子银耳汤',
    description: '滋阴润燥，适合秋冬季节',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    mealType: 'snack',
    cookingTime: 60,
    difficulty: 2,
    tags: ['low-calorie', 'vegetarian'],
    rating: 4.4
  },
  {
    id: 5,
    name: '茯苓薏米粥',
    description: '健脾祛湿，适合痰湿体质',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    mealType: 'breakfast',
    cookingTime: 30,
    difficulty: 1,
    tags: ['low-fat', 'vegetarian'],
    rating: 4.3
  },
  {
    id: 6,
    name: '当归炖鸡汤',
    description: '补血益气，适合女性朋友',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg',
    mealType: 'dinner',
    cookingTime: 90,
    difficulty: 3,
    tags: ['high-protein'],
    rating: 4.7
  }
])

const todayMeals = ref([
  {
    time: '07:30',
    name: '红枣小米粥',
    type: 'breakfast',
    description: '温补早餐，搭配小笼包和咸菜',
    calories: 320,
    protein: 12,
    fat: 8
  },
  {
    time: '12:00',
    name: '山药蒸排骨',
    type: 'lunch',
    description: '滋补午餐，搭配青菜和米饭',
    calories: 450,
    protein: 28,
    fat: 15
  },
  {
    time: '15:30',
    name: '莲子银耳汤',
    type: 'snack',
    description: '营养加餐，补充水分和维生素',
    calories: 120,
    protein: 4,
    fat: 2
  },
  {
    time: '18:30',
    name: '清蒸鲈鱼',
    type: 'dinner',
    description: '清淡晚餐，搭配蒸蛋和时蔬',
    calories: 380,
    protein: 32,
    fat: 10
  }
])

const getMealTypeColor = type => {
  const colorMap = {
    breakfast: 'success',
    lunch: 'primary',
    dinner: 'warning',
    snack: 'info'
  }
  return colorMap[type] || 'info'
}

const getMealTypeText = type => {
  const textMap = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  }
  return textMap[type] || '其他'
}

const getTagText = tag => {
  const tagMap = {
    'low-calorie': '低卡',
    'high-protein': '高蛋白',
    'low-fat': '低脂',
    vegetarian: '素食',
    spicy: '辣味'
  }
  return tagMap[tag] || tag
}

const resetFilters = () => {
  filters.value = {
    mealType: ['breakfast', 'lunch', 'dinner'],
    season: 'spring',
    constitution: 'qi-deficiency',
    difficulty: 3,
    cookingTime: 30,
    tags: ['low-calorie', 'high-protein']
  }
  ElMessage.success('筛选条件已重置')
}

const applyFilters = () => {
  ElMessage.success('筛选条件已应用')
}

const viewRecipeDetail = recipe => {
  ElMessage.info(`查看食谱详情: ${recipe.name}`)
}

const handleSizeChange = val => {
  pageSize.value = val
}

const handleCurrentChange = val => {
  currentPage.value = val
}
</script>

<style scoped>
.recipe-recommendation {
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

.filter-card {
  height: fit-content;
  position: sticky;
  top: 20px;
}

.recommendation-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header .el-icon {
  color: #409eff;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommendation-summary {
  margin-bottom: 20px;
}

.recipe-grid {
  margin-bottom: 20px;
}

.recipe-card {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.recipe-card:hover .recipe-img {
  transform: scale(1.05);
}

.recipe-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.recipe-info {
  padding: 15px;
}

.recipe-info h4 {
  margin: 0 0 8px;
  color: #333;
  font-size: 16px;
}

.recipe-desc {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.recipe-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
  font-size: 12px;
}

.recipe-tags {
  margin-bottom: 10px;
}

.recipe-tags .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.recipe-list {
  margin-bottom: 20px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.meal-card {
  margin-bottom: 0;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.meal-header h4 {
  margin: 0;
  color: #333;
}

.meal-nutrition {
  display: flex;
  gap: 15px;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.nutrition-summary h4 {
  margin: 15px 0;
  color: #333;
}

.nutrition-chart {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px dashed #ddd;
}

.nutrition-stats {
  padding: 10px 0;
}

.stat-item {
  margin-bottom: 15px;
}

.stat-item span {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.filter-actions {
  margin-top: 20px;
  text-align: center;
}

.filter-actions .el-button {
  margin: 0 5px;
}
</style>
