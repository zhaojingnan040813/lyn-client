<template>
  <div class="constitution-diagnosis">
    <el-container>
      <el-header class="page-header">
        <h1>体质诊断</h1>
        <p>通过专业问卷和智能分析，准确识别您的体质类型</p>
      </el-header>

      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="diagnosis-card">
              <template #header>
                <div class="card-header">
                  <el-icon><DocumentChecked /></el-icon>
                  <span>体质测评问卷</span>
                </div>
              </template>

              <el-steps :active="currentStep" finish-status="success" align-center>
                <el-step title="基本信息" />
                <el-step title="生活习惯" />
                <el-step title="身体状况" />
                <el-step title="心理状态" />
                <el-step title="完成诊断" />
              </el-steps>

              <div class="question-container">
                <div v-if="currentStep === 0" class="step-content">
                  <h3>基本信息</h3>
                  <el-form :model="basicInfo" label-width="120px">
                    <el-form-item label="性别">
                      <el-radio-group v-model="basicInfo.gender">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄">
                      <el-input-number v-model="basicInfo.age" :min="1" :max="120" />
                    </el-form-item>
                    <el-form-item label="身高(cm)">
                      <el-input-number v-model="basicInfo.height" :min="100" :max="250" />
                    </el-form-item>
                    <el-form-item label="体重(kg)">
                      <el-input-number v-model="basicInfo.weight" :min="30" :max="200" />
                    </el-form-item>
                  </el-form>
                </div>

                <div v-else-if="currentStep === 1" class="step-content">
                  <h3>生活习惯</h3>
                  <div class="question-item">
                    <p>您平时的睡眠质量如何？</p>
                    <el-radio-group v-model="lifeHabits.sleep">
                      <el-radio label="excellent">很好</el-radio>
                      <el-radio label="good">较好</el-radio>
                      <el-radio label="normal">一般</el-radio>
                      <el-radio label="poor">较差</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="question-item">
                    <p>您的运动频率是？</p>
                    <el-radio-group v-model="lifeHabits.exercise">
                      <el-radio label="daily">每天</el-radio>
                      <el-radio label="weekly">每周3-4次</el-radio>
                      <el-radio label="occasionally">偶尔</el-radio>
                      <el-radio label="rarely">很少</el-radio>
                    </el-radio-group>
                  </div>
                </div>

                <div v-else class="step-content">
                  <h3>其他信息</h3>
                  <p>该部分问卷正在开发中...</p>
                </div>
              </div>

              <div class="step-actions">
                <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
                <el-button type="primary" @click="nextStep">
                  {{ currentStep === 4 ? '完成诊断' : '下一步' }}
                </el-button>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="result-card">
              <template #header>
                <div class="card-header">
                  <el-icon><DataAnalysis /></el-icon>
                  <span>体质类型说明</span>
                </div>
              </template>

              <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="平和质" name="balanced">
                  <div class="constitution-info">
                    <el-tag type="success" size="large">健康体质</el-tag>
                    <h4>平和质特征</h4>
                    <ul>
                      <li>体型匀称健壮</li>
                      <li>面色润泽，头发稠密有光泽</li>
                      <li>精力充沛，睡眠良好</li>
                      <li>性格随和开朗</li>
                    </ul>
                    <p class="suggestion">建议：保持良好的生活习惯，适度运动，均衡饮食。</p>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="气虚质" name="qi-deficiency">
                  <div class="constitution-info">
                    <el-tag type="warning" size="large">需调理体质</el-tag>
                    <h4>气虚质特征</h4>
                    <ul>
                      <li>语音低弱，气短懒言</li>
                      <li>容易疲乏，精神不振</li>
                      <li>易出汗，舌淡红</li>
                      <li>性格内向，不喜冒险</li>
                    </ul>
                    <p class="suggestion">建议：多食用补气健脾的食物，如山药、红枣、黄芪等。</p>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="阳虚质" name="yang-deficiency">
                  <div class="constitution-info">
                    <el-tag type="info" size="large">需温补体质</el-tag>
                    <h4>阳虚质特征</h4>
                    <ul>
                      <li>畏寒怕冷，手足不温</li>
                      <li>喜热饮食，精神不振</li>
                      <li>面色苍白，舌淡胖嫩</li>
                      <li>性格多沉静、内向</li>
                    </ul>
                    <p class="suggestion">建议：多食用温补食物，如羊肉、生姜、桂圆等。</p>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="阴虚质" name="yin-deficiency">
                  <div class="constitution-info">
                    <el-tag type="danger" size="large">需滋阴体质</el-tag>
                    <h4>阴虚质特征</h4>
                    <ul>
                      <li>手足心热，口燥咽干</li>
                      <li>喜冷饮，大便干燥</li>
                      <li>面色潮红，舌红少津</li>
                      <li>性情急躁，外向活泼</li>
                    </ul>
                    <p class="suggestion">建议：多食用滋阴润燥的食物，如银耳、百合、梨等。</p>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>

        <el-divider content-position="left">历史诊断记录</el-divider>

        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Clock /></el-icon>
              <span>诊断历史</span>
            </div>
          </template>

          <el-table :data="diagnosisHistory" style="width: 100%">
            <el-table-column prop="date" label="诊断日期" width="180" />
            <el-table-column prop="constitution" label="体质类型" width="180">
              <template #default="scope">
                <el-tag :type="getConstitutionTagType(scope.row.constitution)">
                  {{ scope.row.constitution }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="评分" width="120" />
            <el-table-column prop="suggestion" label="主要建议" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" size="small">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DocumentChecked, DataAnalysis, Clock } from '@element-plus/icons-vue'

const currentStep = ref(0)
const activeTab = ref('balanced')

const basicInfo = ref({
  gender: 'male',
  age: 25,
  height: 170,
  weight: 65
})

const lifeHabits = ref({
  sleep: 'good',
  exercise: 'weekly'
})

const diagnosisHistory = ref([
  {
    date: '2024-01-15',
    constitution: '气虚质',
    score: '78分',
    suggestion: '建议多食用补气健脾食物，加强适度运动'
  },
  {
    date: '2023-12-20',
    constitution: '阳虚质',
    score: '82分',
    suggestion: '建议温补饮食，避免生冷食物'
  }
])

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const getConstitutionTagType = constitution => {
  const typeMap = {
    平和质: 'success',
    气虚质: 'warning',
    阳虚质: 'info',
    阴虚质: 'danger',
    痰湿质: 'warning',
    湿热质: 'danger'
  }
  return typeMap[constitution] || 'info'
}
</script>

<style scoped>
.constitution-diagnosis {
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

.diagnosis-card,
.result-card {
  margin-bottom: 20px;
  height: 600px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header .el-icon {
  color: #409eff;
}

.question-container {
  margin: 30px 0;
  min-height: 300px;
}

.step-content {
  padding: 20px;
}

.step-content h3 {
  margin-bottom: 20px;
  color: #333;
}

.question-item {
  margin-bottom: 25px;
}

.question-item p {
  margin-bottom: 15px;
  font-weight: 500;
  color: #555;
}

.step-actions {
  text-align: center;
  margin-top: 30px;
}

.constitution-info {
  padding: 15px;
}

.constitution-info h4 {
  margin: 15px 0;
  color: #333;
}

.constitution-info ul {
  margin: 15px 0;
  padding-left: 20px;
}

.constitution-info li {
  margin-bottom: 8px;
  color: #666;
}

.suggestion {
  background-color: #f0f9ff;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  color: #333;
}
</style>
