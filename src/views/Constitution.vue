<template>
  <div class="constitution-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h1>体质测试</h1>
        </div>
      </div>
    </div>

    <div class="constitution-content">
      <div class="container">
        <!-- 测试说明 -->
        <div class="test-intro" v-if="!showResult">
          <div class="intro-card">
            <h2>中医体质辨识测试</h2>
            <p>本测试基于中医体质理论，通过一系列问题帮助您了解自己的体质类型。请根据您近一年的身体感受和状态，选择最符合您情况的答案。</p>
            
            <div class="test-tips">
              <h4>测试说明：</h4>
              <ul>
                <li>请根据您的真实情况回答，不要思考太久</li>
                <li>每个问题只能选择一个答案</li>
                <li>测试大约需要5-10分钟</li>
                <li>结果仅供参考，如有健康问题请咨询专业医师</li>
              </ul>
            </div>

            <el-button type="primary" size="large" @click="startTest">
              开始测试
            </el-button>
          </div>
        </div>

        <!-- 测试问题 -->
        <div class="test-questions" v-if="currentStep === 'questions' && !showResult">
          <div class="progress-bar">
            <el-progress 
              :percentage="Math.round((currentQuestionIndex / questions.length) * 100)"
              :stroke-width="8"
            />
            <span class="progress-text">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          </div>

          <div class="question-card" v-if="currentQuestion">
            <h3 class="question-title">{{ currentQuestion.question }}</h3>
            
            <div class="options-list">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                class="option-item"
                :class="{ active: answers[currentQuestionIndex] === index }"
                @click="selectOption(index)"
              >
                <div class="option-radio">
                  <el-radio 
                    v-model="answers[currentQuestionIndex]" 
                    :label="index"
                    @change="selectOption(index)"
                  >
                    {{ option.text }}
                  </el-radio>
                </div>
              </div>
            </div>

            <div class="question-actions">
              <el-button @click="previousQuestion" :disabled="currentQuestionIndex === 0">
                上一题
              </el-button>
              <el-button 
                type="primary" 
                @click="nextQuestion"
                :disabled="answers[currentQuestionIndex] === undefined"
              >
                {{ currentQuestionIndex === questions.length - 1 ? '完成测试' : '下一题' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 测试结果 -->
        <div class="test-result" v-if="showResult">
          <div class="result-card">
            <div class="result-header">
              <h2>您的体质类型</h2>
              <div class="constitution-type">
                <span class="type-name">{{ resultConstitution?.name }}</span>
                <el-tag :type="getConstitutionTagType(resultConstitution?.type)" size="large">
                  {{ resultConstitution?.type }}
                </el-tag>
              </div>
            </div>

            <div class="result-content">
              <div class="result-description">
                <h3>体质特征</h3>
                <p>{{ resultConstitution?.description }}</p>
              </div>

              <div class="characteristics">
                <h3>主要特征</h3>
                <ul>
                  <li v-for="char in resultConstitution?.characteristics" :key="char">
                    {{ char }}
                  </li>
                </ul>
              </div>

              <div class="recommendations">
                <h3>养生建议</h3>
                <div class="recommendation-list">
                  <div class="recommendation-item">
                    <el-icon><Food /></el-icon>
                    <div>
                      <h4>饮食建议</h4>
                      <p>根据您的体质特点，建议选择{{ resultConstitution?.dietaryAdvice || '清淡均衡'}}的饮食</p>
                    </div>
                  </div>
                  <div class="recommendation-item">
                    <el-icon><TrendCharts /></el-icon>
                    <div>
                      <h4>运动建议</h4>
                      <p>适合{{ resultConstitution?.exerciseAdvice || '适度'}}的运动方式</p>
                    </div>
                  </div>
                  <div class="recommendation-item">
                    <el-icon><Moon /></el-icon>
                    <div>
                      <h4>生活起居</h4>
                      <p>保持{{ resultConstitution?.lifestyleAdvice || '规律'}}的生活作息</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="result-actions">
              <el-button @click="retakeTest">重新测试</el-button>
              <el-button type="primary" @click="saveConstitution">
                保存体质信息
              </el-button>
              <el-button type="success" @click="goToRecipes">
                查看推荐菜谱
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { constitutionApi } from '../api'
import { ArrowLeft, Food, TrendCharts, Moon } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 测试状态
const currentStep = ref('intro') // intro, questions, result
const currentQuestionIndex = ref(0)
const answers = ref({})
const showResult = ref(false)
const resultConstitution = ref(null)

// 加载状态
const loading = ref(false)

// 测试问题（简化版本，实际应该从API获取）
const questions = ref([
  {
    question: "您平时的体力状况如何？",
    options: [
      { text: "精力充沛，不易疲劳", type: "balanced" },
      { text: "容易疲劳，稍微活动就累", type: "qi_deficiency" },
      { text: "畏寒怕冷，手脚冰凉", type: "yang_deficiency" },
      { text: "手足心热，口干咽燥", type: "yin_deficiency" },
      { text: "身体沉重，容易困倦", type: "phlegm_dampness" }
    ]
  },
  {
    question: "您对温度的敏感程度如何？",
    options: [
      { text: "既不怕冷也不怕热", type: "balanced" },
      { text: "特别怕冷，冬天难熬", type: "yang_deficiency" },
      { text: "特别怕热，夏天难熬", type: "yin_deficiency" },
      { text: "怕冷又怕热，适应性差", type: "phlegm_dampness" },
      { text: "对温度变化不太敏感", type: "balanced" }
    ]
  },
  {
    question: "您的食欲和消化情况如何？",
    options: [
      { text: "食欲正常，消化良好", type: "balanced" },
      { text: "食欲不振，消化不良", type: "qi_deficiency" },
      { text: "食欲旺盛，容易饥饿", type: "yang_deficiency" },
      { text: "食欲一般，口干舌燥", type: "yin_deficiency" },
      { text: "食欲不佳，胸闷腹胀", type: "phlegm_dampness" }
    ]
  },
  {
    question: "您的睡眠质量如何？",
    options: [
      { text: "睡眠良好，精力充足", type: "balanced" },
      { text: "入睡困难，多梦易醒", type: "yin_deficiency" },
      { text: "嗜睡，睡后仍感疲劳", type: "phlegm_dampness" },
      { text: "睡眠浅，容易惊醒", type: "qi_deficiency" },
      { text: "睡眠一般，偶有失眠", type: "balanced" }
    ]
  },
  {
    question: "您的情绪状态如何？",
    options: [
      { text: "情绪稳定，心态平和", type: "balanced" },
      { text: "容易焦虑，思虑过多", type: "qi_stagnation" },
      { text: "情绪波动大，易怒", type: "liver_qi_stagnation" },
      { text: "性格内向，敏感多疑", type: "qi_stagnation" },
      { text: "乐观开朗，不易生气", type: "balanced" }
    ]
  }
])

// 计算属性
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

// 页面跳转
const goBack = () => {
  if (currentStep.value === 'questions' && currentQuestionIndex.value > 0) {
    previousQuestion()
  } else if (currentStep.value === 'result') {
    showResult.value = false
    currentStep.value = 'questions'
  } else {
    router.push('/')
  }
}

// 开始测试
const startTest = () => {
  currentStep.value = 'questions'
  currentQuestionIndex.value = 0
  answers.value = {}
  showResult.value = false
}

// 选择选项
const selectOption = (index) => {
  answers.value[currentQuestionIndex.value] = index
}

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  } else {
    calculateResult()
  }
}

// 计算结果
const calculateResult = () => {
  // 统计各种体质类型的得分
  const typeScores = {}
  
  Object.values(answers.value).forEach(answerIndex => {
    const question = questions.value[Object.keys(answers.value).indexOf(answerIndex.toString())]
    if (question && question.options[answerIndex]) {
      const type = question.options[answerIndex].type
      typeScores[type] = (typeScores[type] || 0) + 1
    }
  })

  // 找出得分最高的体质类型
  let maxScore = 0
  let resultType = 'balanced'
  
  Object.entries(typeScores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score
      resultType = type
    }
  })

  // 设置结果并显示
  loadConstitutionInfo(resultType)
}

// 加载体质信息
const loadConstitutionInfo = async (type) => {
  try {
    loading.value = true
    const response = await constitutionApi.getConstitutionByType(type)
    if (response.code === 0) {
      resultConstitution.value = response.data
      showResult.value = true
      currentStep.value = 'result'
    }
  } catch (error) {
    console.error('Failed to load constitution info:', error)
    ElMessage.error('加载体质信息失败')
  } finally {
    loading.value = false
  }
}

// 重新测试
const retakeTest = () => {
  currentStep.value = 'intro'
  currentQuestionIndex.value = 0
  answers.value = {}
  showResult.value = false
  resultConstitution.value = null
}

// 保存体质信息
const saveConstitution = async () => {
  if (!resultConstitution.value?.type || !userStore.sessionId) {
    ElMessage.error('保存失败，请重试')
    return
  }

  try {
    loading.value = true
    const success = await userStore.setConstitution(resultConstitution.value.type, 'manual')
    if (success) {
      ElMessage.success('体质信息保存成功')
    } else {
      ElMessage.error('保存失败，请重试')
    }
  } catch (error) {
    console.error('Failed to save constitution:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

// 查看推荐菜谱
const goToRecipes = () => {
  router.push('/recipes')
}

// 获取体质标签类型
const getConstitutionTagType = (type) => {
  const typeMap = {
    'balanced': 'success',
    'qi_deficiency': 'warning',
    'yang_deficiency': 'info',
    'yin_deficiency': 'danger',
    'phlegm_dampness': 'warning',
    'damp_heat': 'danger',
    'blood_stasis': 'danger',
    'qi_stagnation': 'warning',
    'special_constitution': 'info'
  }
  return typeMap[type] || 'info'
}

onMounted(() => {
  // 如果已有体质信息，可以直接显示
  if (userStore.constitution) {
    loadConstitutionInfo(userStore.constitution.type)
  }
})
</script>

<style scoped>
.constitution-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

/* 内容区域 */
.constitution-content {
  padding: 24px 0;
  min-height: calc(100vh - 80px);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 测试说明 */
.test-intro {
  display: flex;
  justify-content: center;
}

.intro-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.intro-card h2 {
  color: #2c3e50;
  margin-bottom: 16px;
}

.intro-card p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 24px;
}

.test-tips {
  text-align: left;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 32px;
}

.test-tips h4 {
  color: #2c3e50;
  margin-bottom: 12px;
}

.test-tips ul {
  color: #6c757d;
  line-height: 1.8;
  padding-left: 20px;
}

/* 测试问题 */
.test-questions {
  max-width: 600px;
  margin: 0 auto;
}

.progress-bar {
  margin-bottom: 32px;
  position: relative;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -30px;
  font-size: 14px;
  color: #6c757d;
}

.question-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.question-title {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 24px;
  line-height: 1.5;
}

.options-list {
  margin-bottom: 32px;
}

.option-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.option-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.option-item.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.option-radio {
  padding: 16px 20px;
}

.option-radio .el-radio {
  width: 100%;
  margin: 0;
}

.option-radio .el-radio__label {
  font-size: 16px;
  line-height: 1.5;
  color: #2c3e50;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

/* 测试结果 */
.test-result {
  max-width: 800px;
  margin: 0 auto;
}

.result-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.result-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 32px;
  text-align: center;
}

.result-header h2 {
  margin: 0 0 16px 0;
  font-size: 28px;
}

.constitution-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.type-name {
  font-size: 32px;
  font-weight: bold;
}

.result-content {
  padding: 32px;
}

.result-description,
.characteristics,
.recommendations {
  margin-bottom: 32px;
}

.result-description h3,
.characteristics h3,
.recommendations h3 {
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 20px;
}

.result-description p {
  color: #6c757d;
  line-height: 1.6;
  font-size: 16px;
}

.characteristics ul {
  color: #6c757d;
  line-height: 1.8;
  padding-left: 20px;
}

.characteristics li {
  margin-bottom: 8px;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.recommendation-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.recommendation-item .el-icon {
  font-size: 24px;
  color: #667eea;
  flex-shrink: 0;
}

.recommendation-item h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 16px;
}

.recommendation-item p {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
  font-size: 14px;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 32px;
  border-top: 1px solid #e8e8e8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }
  
  .header-left h1 {
    font-size: 20px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .intro-card,
  .question-card {
    padding: 24px 20px;
  }
  
  .recommendation-list {
    grid-template-columns: 1fr;
  }
  
  .result-header {
    padding: 32px 24px;
  }
  
  .result-header h2 {
    font-size: 24px;
  }
  
  .type-name {
    font-size: 28px;
  }
  
  .result-content {
    padding: 24px 20px;
  }
  
  .result-actions {
    flex-direction: column;
    padding: 20px;
  }
}
</style>
