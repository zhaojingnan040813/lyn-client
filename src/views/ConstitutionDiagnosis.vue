<template>
  <div class="constitution-diagnosis-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">体质诊断</h1>
        <p class="page-subtitle">通过专业的问题测试，帮您准确判断中医体质类型</p>

        <!-- 当前体质状态 -->
        <div class="current-status" v-if="userStore.hasConstitution">
          <div class="status-badge">
            <span class="status-label">当前体质：</span>
            <span class="constitution-name">
              {{ getConstitutionName(userStore.constitution.type) }}
            </span>
          </div>
          <div class="status-info">诊断于 {{ formatDate(userStore.constitution.diagnosedAt) }}</div>
        </div>
      </div>
    </div>

    <!-- 模式选择 -->
    <div class="mode-selection" v-if="currentMode === 'mode'">
      <div class="mode-header">
        <h2 class="mode-title">选择诊断方式</h2>
        <p class="mode-subtitle">请选择最适合您的体质判断方式</p>
      </div>

      <div class="mode-cards">
        <div class="mode-card" @click="startQuestionnaire">
          <div class="mode-icon">📋</div>
          <h3 class="mode-name">问卷测试</h3>
          <p class="mode-description">
            通过回答专业设计的体质测试题目，系统会根据您的答案计算最适合的体质类型
          </p>
          <div class="mode-features">
            <span class="feature-tag">科学评估</span>
            <span class="feature-tag">精准匹配</span>
            <span class="feature-tag">详细分析</span>
          </div>
        </div>

        <div class="mode-card" @click="showManualSelection">
          <div class="mode-icon">🎯</div>
          <h3 class="mode-name">手动选择</h3>
          <p class="mode-description">
            直接浏览所有体质类型的详细介绍，根据您的了解自行选择最符合的体质
          </p>
          <div class="mode-features">
            <span class="feature-tag">直观了解</span>
            <span class="feature-tag">快速选择</span>
            <span class="feature-tag">详细信息</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 问卷测试模式 -->
    <div class="questionnaire-mode" v-if="currentMode === 'questionnaire'">
      <ConstitutionQuestion
        :question="currentQuestion"
        :questions="questions"
        :current-question-index="currentQuestionIndex"
        :answers="answers"
        :disabled="isProcessing"
        @answer="handleAnswer"
        @next="nextQuestion"
        @previous="previousQuestion"
        @jump="jumpToQuestion"
      />
    </div>

    <!-- 手动选择模式 -->
    <div class="manual-mode" v-if="currentMode === 'manual'">
      <div class="manual-header">
        <h2 class="manual-title">选择体质类型</h2>
        <p class="manual-subtitle">了解各种体质特征，选择最符合您的类型</p>
      </div>

      <div class="constitution-grid">
        <ConstitutionCard
          v-for="constitution in constitutionList"
          :key="constitution.type"
          :constitution="constitution"
          :is-selected="selectedConstitution?.type === constitution.type"
          :compact="true"
          :show-diet-advice="false"
          @select="selectConstitution"
        />
      </div>

      <div class="manual-actions">
        <button class="btn btn-ghost" @click="backToMode" :disabled="isProcessing">返回</button>
        <button
          class="btn btn-primary"
          @click="confirmManualSelection"
          :disabled="!selectedConstitution || isProcessing"
        >
          确认选择
        </button>
      </div>
    </div>

    <!-- 测试结果 -->
    <div class="result-mode" v-if="currentMode === 'result'">
      <div class="result-header">
        <h2 class="result-title">测试完成</h2>
        <p class="result-subtitle">根据您的回答，我们为您推荐以下体质类型</p>
      </div>

      <!-- 推荐体质 -->
      <div class="recommended-constitution">
        <ConstitutionCard
          :constitution="testResult.constitutionDetails"
          :is-recommended="true"
          :score="
            Math.round(
              (testResult.maxScore / Math.max(...Object.values(testResult.constitutionScores))) *
                100
            )
          "
          @select="selectConstitution"
        />
      </div>

      <!-- 所有体质分数 -->
      <div class="score-breakdown">
        <h3 class="breakdown-title">各体质匹配度</h3>
        <div class="score-list">
          <div
            v-for="(score, type) in testResult.constitutionScores"
            :key="type"
            class="score-item"
          >
            <span class="score-constitution">{{ getConstitutionName(type) }}</span>
            <div class="score-bar">
              <div
                class="score-fill"
                :style="{
                  width: `${getScorePercentage(score)}%`,
                  backgroundColor:
                    score === testResult.maxScore
                      ? 'var(--gradient-primary)'
                      : 'var(--color-border-medium)'
                }"
              ></div>
            </div>
            <span class="score-value">{{ score }}</span>
          </div>
        </div>
      </div>

      <!-- 结果操作 -->
      <div class="result-actions">
        <button class="btn btn-ghost" @click="restartTest" :disabled="isProcessing">
          重新测试
        </button>
        <button class="btn btn-primary" @click="confirmTestResult" :disabled="isProcessing">
          确认并保存
        </button>
      </div>
    </div>

    <!-- 处理中遮罩 -->
    <div class="processing-overlay" v-if="isProcessing">
      <div class="loading-spinner"></div>
      <p class="processing-text">{{ processingText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/utils/toast'
import {
  constitutionQuestions,
  constitutionTypes,
  calculateConstitution
} from '@/data/constitutionQuestions'
import ConstitutionCard from '@/components/constitution/ConstitutionCard.vue'
import ConstitutionQuestion from '@/components/constitution/ConstitutionQuestion.vue'

const userStore = useUserStore()
const toast = useToast()

// 页面状态
const currentMode = ref('mode') // 'mode' | 'questionnaire' | 'manual' | 'result'
const isProcessing = ref(false)
const processingText = ref('')

// 问卷相关
const currentQuestionIndex = ref(0)
const answers = ref(new Array(constitutionQuestions.length).fill(null))
const testResult = ref(null)

// 手动选择相关
const selectedConstitution = ref(null)

// 计算属性
const currentQuestion = computed(() => {
  return constitutionQuestions[currentQuestionIndex.value]
})

const questions = computed(() => {
  return constitutionQuestions
})

const constitutionList = computed(() => {
  return Object.values(constitutionTypes)
})

// 体质名称映射
const getConstitutionName = type => {
  return constitutionTypes[type]?.name || type
}

// 计算分数百分比
const getScorePercentage = score => {
  if (!testResult.value || !testResult.value.constitutionScores) return 0

  const allScores = Object.values(testResult.value.constitutionScores)
  const maxScore = Math.max(...allScores.map(Math.abs))

  if (maxScore === 0) return 0

  return Math.round((Math.abs(score) / maxScore) * 100)
}

const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 模式切换方法
const startQuestionnaire = () => {
  currentMode.value = 'questionnaire'
  resetQuestionnaire()
}

const showManualSelection = () => {
  currentMode.value = 'manual'
  selectedConstitution.value = null
}

const backToMode = () => {
  currentMode.value = 'mode'
}

// 问卷相关方法
const resetQuestionnaire = () => {
  currentQuestionIndex.value = 0
  answers.value = new Array(constitutionQuestions.length).fill(null)
  console.log('Questionnaire reset:', {
    totalQuestions: constitutionQuestions.length,
    answers: answers.value
  })
}

const handleAnswer = answer => {
  answers.value[currentQuestionIndex.value] = answer
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < constitutionQuestions.length - 1) {
    currentQuestionIndex.value++
  } else {
    // 完成测试，计算结果
    calculateResult()
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const jumpToQuestion = index => {
  currentQuestionIndex.value = index
}

const calculateResult = () => {
  const validAnswers = answers.value.filter(answer => answer !== null)
  if (validAnswers.length < constitutionQuestions.length * 0.8) {
    toast.warning('请完成更多题目以获得更准确的结果')
    return
  }

  const result = calculateConstitution(validAnswers)
  testResult.value = result
  currentMode.value = 'result'
}

const restartTest = () => {
  resetQuestionnaire()
  currentMode.value = 'questionnaire'
}

// 手动选择相关方法
const selectConstitution = constitution => {
  selectedConstitution.value = constitution
}

const confirmManualSelection = async () => {
  if (!selectedConstitution.value) return

  await saveConstitution(selectedConstitution.value.type, 'manual')
}

// 结果确认方法
const confirmTestResult = async () => {
  if (!testResult.value) return

  await saveConstitution(testResult.value.recommendedType, 'manual')
}

// 保存体质
const saveConstitution = async (type, method) => {
  try {
    isProcessing.value = true
    processingText.value = '正在保存体质信息...'

    const success = await userStore.setConstitution(type, method)

    if (success) {
      toast.success('体质设置成功！')
      // 可以跳转到相关页面或显示成功信息
      setTimeout(() => {
        // 跳转到首页或其他页面
        currentMode.value = 'mode'
      }, 2000)
    } else {
      throw new Error('保存失败')
    }
  } catch (error) {
    console.error('保存体质失败:', error)
    toast.error('保存失败，请重试')
  } finally {
    isProcessing.value = false
  }
}

// 页面加载时检查用户状态
onMounted(() => {
  // 如果用户已经有体质，可以显示相关提示
  if (userStore.hasConstitution) {
    // 可以选择是否允许重新测评
  }
})
</script>

<style scoped>
.constitution-diagnosis-page {
  min-height: calc(100vh - var(--header-height));
  background: var(--color-bg-secondary);
}

/* 页面头部 */
.page-header {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.current-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-accent-alpha);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-accent);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.status-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.constitution-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-accent-dark);
}

.status-info {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-left: auto;
}

/* 模式选择 */
.mode-selection {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.mode-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.mode-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.mode-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.mode-card {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
}

.mode-card:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-medium);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.mode-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.mode-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.mode-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-lg);
}

.mode-features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
}

.feature-tag {
  background: var(--color-primary-alpha);
  color: var(--color-primary-dark);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 问卷模式 */
.questionnaire-mode {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* 手动选择模式 */
.manual-mode {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.manual-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.manual-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.manual-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

.constitution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.manual-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

/* 结果模式 */
.result-mode {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.result-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.result-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.result-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

.recommended-constitution {
  max-width: 600px;
  margin: 0 auto var(--spacing-2xl);
}

.score-breakdown {
  margin-bottom: var(--spacing-2xl);
}

.breakdown-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.score-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
}

.score-constitution {
  min-width: 100px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.score-bar {
  flex: 1;
  height: 12px;
  background: var(--color-border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
}

.score-fill {
  height: 100%;
  background: var(--gradient-primary);
  transition: width var(--transition-base) var(--ease-out);
}

.score-value {
  min-width: 40px;
  text-align: right;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

/* 处理中遮罩 */
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-light);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-lg);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.processing-text {
  color: var(--color-text-inverse);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-lg) 0;
  }

  .header-content {
    padding: 0 var(--spacing-lg);
  }

  .page-title {
    font-size: var(--text-2xl);
  }

  .page-subtitle {
    font-size: var(--text-base);
  }

  .current-status {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .status-info {
    margin-left: 0;
  }

  .mode-cards {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .constitution-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .manual-actions,
  .result-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .manual-actions .btn,
  .result-actions .btn {
    width: 100%;
  }
}
</style>
