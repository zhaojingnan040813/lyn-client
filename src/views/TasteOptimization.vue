<template>
  <div class="taste-optimization">
    <el-container>
      <el-header class="page-header">
        <h1>口味调优</h1>
        <p>根据您的体质和偏好，个性化调整膳食口味</p>
      </el-header>

      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="preference-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Setting /></el-icon>
                  <span>口味偏好设置</span>
                </div>
              </template>

              <el-form :model="tastePreference" label-width="100px">
                <el-form-item label="咸淡程度">
                  <el-slider
                    v-model="tastePreference.saltiness"
                    :min="1"
                    :max="5"
                    :marks="saltinessMarks"
                    show-stops
                  />
                </el-form-item>

                <el-form-item label="辣度偏好">
                  <el-slider
                    v-model="tastePreference.spiciness"
                    :min="0"
                    :max="5"
                    :marks="spicinessMarks"
                    show-stops
                  />
                </el-form-item>

                <el-form-item label="甜度喜好">
                  <el-slider
                    v-model="tastePreference.sweetness"
                    :min="1"
                    :max="5"
                    :marks="sweetnessMarks"
                    show-stops
                  />
                </el-form-item>

                <el-form-item label="酸度接受">
                  <el-slider
                    v-model="tastePreference.sourness"
                    :min="1"
                    :max="5"
                    :marks="sournessMarks"
                    show-stops
                  />
                </el-form-item>

                <el-form-item label="口味类型">
                  <el-checkbox-group v-model="tastePreference.tasteTypes">
                    <el-checkbox label="川菜">川菜</el-checkbox>
                    <el-checkbox label="粤菜">粤菜</el-checkbox>
                    <el-checkbox label="湘菜">湘菜</el-checkbox>
                    <el-checkbox label="鲁菜">鲁菜</el-checkbox>
                    <el-checkbox label="苏菜">苏菜</el-checkbox>
                    <el-checkbox label="浙菜">浙菜</el-checkbox>
                    <el-checkbox label="闽菜">闽菜</el-checkbox>
                    <el-checkbox label="徽菜">徽菜</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="health-card">
              <template #header>
                <div class="card-header">
                  <el-icon><FirstAidKit /></el-icon>
                  <span>体质适配建议</span>
                </div>
              </template>

              <el-alert title="基于您的体质分析" type="info" :closable="false" show-icon>
                您当前体质：气虚质，建议口味清淡，避免过于辛辣刺激
              </el-alert>

              <div class="recommendations">
                <h4>推荐口味搭配</h4>
                <div class="recommendation-item">
                  <el-tag type="success">清淡型</el-tag>
                  <p>少盐少油，突出食材原味</p>
                </div>
                <div class="recommendation-item">
                  <el-tag type="warning">温补型</el-tag>
                  <p>适当增加生姜、葱白等温性调料</p>
                </div>
                <div class="recommendation-item">
                  <el-tag type="info">滋养型</el-tag>
                  <p>多使用山药、莲子等滋补食材</p>
                </div>
              </div>

              <div class="avoid-list">
                <h4>应避免的口味</h4>
                <el-tag v-for="item in avoidTastes" :key="item" type="danger" class="avoid-tag">
                  {{ item }}
                </el-tag>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="analysis-card">
              <template #header>
                <div class="card-header">
                  <el-icon><DataAnalysis /></el-icon>
                  <span>口味分析报告</span>
                </div>
              </template>

              <div class="analysis-chart">
                <h4>当前口味配置分析</h4>
                <div class="chart-placeholder">
                  <el-empty description="口味分析图表" :image-size="120">
                    <el-button type="primary">生成分析报告</el-button>
                  </el-empty>
                </div>
              </div>

              <div class="nutrition-balance">
                <h4>营养平衡度</h4>
                <el-progress
                  :percentage="nutritionBalance"
                  :color="progressColor"
                  :stroke-width="8"
                />
                <p class="balance-desc">当前口味配置营养平衡度：{{ nutritionBalance }}%</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-divider content-position="left">个性化推荐</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <!-- <el-icon><Potato /></el-icon> -->
                  <el-icon><Setting /></el-icon>
                  <span>推荐菜品</span>
                </div>
              </template>

              <el-row :gutter="15">
                <el-col :span="8" v-for="dish in recommendedDishes" :key="dish.id">
                  <div class="dish-item">
                    <el-image :src="dish.image" fit="cover" class="dish-image" />
                    <div class="dish-info">
                      <h5>{{ dish.name }}</h5>
                      <p class="dish-taste">{{ dish.taste }}</p>
                      <div class="dish-tags">
                        <el-tag size="small" v-for="tag in dish.tags" :key="tag">
                          {{ tag }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <el-icon><EditPen /></el-icon>
                  <span>调味料推荐</span>
                </div>
              </template>

              <el-table :data="seasoningRecommendations" style="width: 100%">
                <el-table-column prop="name" label="调味料" />
                <el-table-column prop="usage" label="建议用量" />
                <el-table-column prop="effect" label="功效" />
                <el-table-column prop="suitable" label="适合体质">
                  <template #default="scope">
                    <el-tag size="small" :type="getSuitableTagType(scope.row.suitable)">
                      {{ scope.row.suitable }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>

        <div class="action-bar">
          <el-button size="large" @click="resetPreference">重置偏好</el-button>
          <el-button type="primary" size="large" @click="savePreference">保存设置</el-button>
          <el-button type="success" size="large" @click="generateRecommendation">
            生成推荐
          </el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const tastePreference = ref({
  saltiness: 3,
  spiciness: 1,
  sweetness: 2,
  sourness: 2,
  tasteTypes: ['粤菜', '苏菜']
})

const saltinessMarks = {
  1: '很淡',
  3: '适中',
  5: '很咸'
}

const spicinessMarks = {
  0: '不吃辣',
  2: '微辣',
  4: '中辣',
  5: '特辣'
}

const sweetnessMarks = {
  1: '不甜',
  3: '适中',
  5: '很甜'
}

const sournessMarks = {
  1: '不酸',
  3: '适中',
  5: '很酸'
}

const avoidTastes = ref(['过于辛辣', '过于油腻', '生冷寒凉', '烧烤油炸'])

const nutritionBalance = computed(() => {
  const { saltiness, spiciness, sweetness, sourness } = tastePreference.value
  const balance = 100 - Math.abs(saltiness - 3) * 10 - spiciness * 8
  return Math.max(0, Math.min(100, balance))
})

const progressColor = computed(() => {
  const balance = nutritionBalance.value
  if (balance >= 80) return '#67c23a'
  if (balance >= 60) return '#e6a23c'
  return '#f56c6c'
})

const recommendedDishes = ref([
  {
    id: 1,
    name: '清蒸鲈鱼',
    taste: '清淡鲜美',
    tags: ['低盐', '营养丰富'],
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg'
  },
  {
    id: 2,
    name: '山药排骨汤',
    taste: '滋补温和',
    tags: ['温补', '健脾'],
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg'
  },
  {
    id: 3,
    name: '蒸蛋羹',
    taste: '嫩滑清淡',
    tags: ['易消化', '高蛋白'],
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c4e4c4c4c4e4c4e4c4e4c4c4e.jpeg'
  }
])

const seasoningRecommendations = ref([
  {
    name: '生姜',
    usage: '3-5片',
    effect: '温中散寒',
    suitable: '阳虚质'
  },
  {
    name: '山药',
    usage: '适量',
    effect: '健脾益气',
    suitable: '气虚质'
  },
  {
    name: '红枣',
    usage: '5-8颗',
    effect: '补血养颜',
    suitable: '血虚质'
  },
  {
    name: '枸杞',
    usage: '10-15粒',
    effect: '滋补肝肾',
    suitable: '阴虚质'
  }
])

const getSuitableTagType = suitable => {
  const typeMap = {
    气虚质: 'warning',
    阳虚质: 'info',
    阴虚质: 'danger',
    血虚质: 'success',
    平和质: 'success'
  }
  return typeMap[suitable] || 'info'
}

const resetPreference = () => {
  tastePreference.value = {
    saltiness: 3,
    spiciness: 1,
    sweetness: 2,
    sourness: 2,
    tasteTypes: ['粤菜', '苏菜']
  }
  ElMessage.success('已重置为默认偏好设置')
}

const savePreference = () => {
  ElMessage.success('口味偏好已保存')
}

const generateRecommendation = () => {
  ElMessage.info('正在生成个性化推荐...')
}
</script>

<style scoped>
.taste-optimization {
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

.preference-card,
.health-card,
.analysis-card {
  margin-bottom: 20px;
  height: 500px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header .el-icon {
  color: #409eff;
}

.recommendations {
  margin: 20px 0;
}

.recommendations h4,
.avoid-list h4,
.analysis-chart h4,
.nutrition-balance h4 {
  margin: 15px 0 10px;
  color: #333;
}

.recommendation-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 8px;
}

.recommendation-item p {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

.avoid-list {
  margin-top: 20px;
}

.avoid-tag {
  margin: 5px 5px 5px 0;
}

.analysis-chart {
  margin: 20px 0;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px dashed #ddd;
}

.nutrition-balance {
  margin-top: 20px;
}

.balance-desc {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.dish-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  transition: transform 0.2s;
}

.dish-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dish-image {
  width: 100%;
  height: 120px;
}

.dish-info {
  padding: 12px;
}

.dish-info h5 {
  margin: 0 0 8px;
  color: #333;
}

.dish-taste {
  margin: 0 0 8px;
  color: #666;
  font-size: 13px;
}

.dish-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.action-bar {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.action-bar .el-button {
  margin: 0 10px;
}
</style>
