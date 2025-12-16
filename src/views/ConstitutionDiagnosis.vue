<template>
  <div class="constitution-diagnosis">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="title-icon">🌿</span>
            中医体质测评
          </h1>
          <p class="hero-subtitle">通过科学问卷，了解您的体质类型，获取个性化养生建议</p>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <section class="main-section">
      <div class="container">
        <!-- 测评状态卡片 -->
        <div class="status-card" v-if="hasStarted && !showResult">
          <div class="status-header">
            <div class="progress-info">
              <span class="progress-text">
                测评进度：{{ currentQuestionIndex + 1 }} / {{ questions.length }}
              </span>
              <span class="progress-percentage">
                {{ Math.round((currentQuestionIndex / questions.length) * 100) }}%
              </span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${(currentQuestionIndex / questions.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 问卷区域 -->
        <div class="questionnaire-container" v-if="hasStarted && !showResult && !loading">
          <transition name="question-slide" mode="out-in">
            <QuestionCard
              :key="currentQuestionIndex"
              :question="currentQuestion"
              :selected-option="selectedOption"
              :is-first-question="currentQuestionIndex === 0"
              :is-last-question="currentQuestionIndex === questions.length - 1"
              @update:selected-option="selectOption"
              @previous="previousQuestion"
              @next="nextQuestion"
            />
          </transition>
        </div>

        <!-- 加载状态 -->
        <div class="loading-container" v-if="loading">
          <LoadingSpinner size="lg" />
          <p class="loading-text">正在分析您的体质特征...</p>
        </div>

        <!-- 结果展示区域 -->
        <div class="result-container" v-if="showResult && !loading">
          <div class="result-header">
            <h2 class="result-title">您的体质测评结果</h2>
            <p class="result-subtitle">
              {{
                userStore.hasConstitution && !hasStarted
                  ? '您已保存的体质信息'
                  : '基于您的回答，我们为您生成了个性化的体质分析'
              }}
            </p>
          </div>

          <div class="result-content">
            <!-- 主要体质卡片 -->
            <div class="primary-constitution-card">
              <div
                class="constitution-badge"
                :style="{ backgroundColor: getConstitutionColor(primaryConstitution.type) }"
              >
                {{ primaryConstitution.name }}
              </div>
              <h3 class="constitution-title">{{ primaryConstitution.name }}</h3>
              <p class="constitution-description">{{ primaryConstitution.description }}</p>
              <div class="constitution-characteristics">
                <h4>主要特征：</h4>
                <ul>
                  <li
                    v-for="characteristic in primaryConstitution.characteristics"
                    :key="characteristic"
                  >
                    {{ characteristic }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 雷达图 -->
            <div class="chart-container" v-if="constitutionScores.length > 0">
              <h3>体质倾向分析</h3>
              <RadarChart :constitution-scores="constitutionScores" />
            </div>

            <!-- 调理建议 -->
            <div class="advice-section">
              <h3>个性化调理建议</h3>
              <div class="advice-cards">
                <AdviceCard
                  type="diet"
                  icon="🍲"
                  title="饮食建议"
                  :advice="getDietAdvice(primaryConstitution.type)"
                  detail-title="推荐食材"
                  :detail-items="getRecommendedFoods(primaryConstitution.type)"
                />
                <AdviceCard
                  type="exercise"
                  icon="🏃"
                  title="运动建议"
                  :advice="getExerciseAdvice(primaryConstitution.type)"
                  detail-title="推荐运动"
                  :detail-items="getRecommendedExercises(primaryConstitution.type)"
                />
                <AdviceCard
                  type="lifestyle"
                  icon="🌙"
                  title="生活作息"
                  :advice="getLifestyleAdvice(primaryConstitution.type)"
                  detail-title="注意事项"
                  :detail-items="getLifestyleTips(primaryConstitution.type)"
                />
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="result-actions">
              <button
                v-if="!userStore.hasConstitution || hasStarted"
                class="btn btn-primary"
                @click="saveResult"
              >
                保存结果
              </button>
              <button class="btn btn-secondary" @click="restartTest">重新测评</button>
              <button class="btn btn-outline" @click="goToRecommendation">查看膳食推荐</button>
            </div>
          </div>
        </div>

        <!-- 开始测评区域 -->
        <div class="start-container" v-if="!hasStarted && !loading && !userStore.hasConstitution">
          <div class="start-card">
            <div class="start-icon">🔮</div>
            <h2>开始您的体质测评之旅</h2>
            <p>本测评包含15道精选题目，预计需要3-5分钟完成</p>
            <div class="start-features">
              <div class="feature-item">
                <span class="feature-icon">✨</span>
                <span>科学权威的中医体质理论</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>直观的可视化分析结果</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>个性化养生调理建议</span>
              </div>
            </div>
            <button class="btn btn-primary btn-lg" @click="startTest">开始测评</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/utils/toast'
import { QuestionCard, RadarChart, AdviceCard } from '@/components'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// 响应式数据
const hasStarted = ref(false)
const loading = ref(false)
const showResult = ref(false)
const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const answers = ref([])

// 体质数据
const constitutionTypes = ref([
  { type: 'balanced', name: '平和质', color: '#8B9F6F' },
  { type: 'qi', name: '气虚质', color: '#D4A574' },
  { type: 'yang', name: '阳虚质', color: '#C97064' },
  { type: 'yin', name: '阴虚质', color: '#7A9FBF' },
  { type: 'phlegm', name: '痰湿质', color: '#9F8F7F' },
  { type: 'damp', name: '湿热质', color: '#A58F6F' },
  { type: 'blood', name: '血瘀质', color: '#8F6F7F' },
  { type: 'qi-stagnation', name: '气郁质', color: '#7F8F9F' },
  { type: 'special', name: '特禀质', color: '#9F7F8F' }
])

// 问卷题目
const questions = ref([
  {
    category: '体型特征',
    text: '您的体型特点是什么？',
    options: [
      { label: 'A', text: '体型匀称，不胖不瘦' },
      { label: 'B', text: '体型偏瘦，肌肉不发达' },
      { label: 'C', text: '体型偏胖，容易发胖' },
      { label: 'D', text: '体型中等，但肌肉松软' },
      { label: 'E', text: '体型壮实，肌肉发达' }
    ],
    weights: {
      balanced: 5,
      qi: 3,
      yang: 2,
      yin: 1,
      phlegm: 2,
      damp: 3,
      blood: 1,
      'qi-stagnation': 2,
      special: 1
    }
  },
  {
    category: '精神状态',
    text: '您的精神状态通常如何？',
    options: [
      { label: 'A', text: '精力充沛，精神饱满' },
      { label: 'B', text: '容易疲劳，精神不振' },
      { label: 'C', text: '情绪低落，缺乏活力' },
      { label: 'D', text: '时好时坏，不稳定' },
      { label: 'E', text: '容易焦虑，思虑过多' }
    ],
    weights: {
      balanced: 5,
      qi: 2,
      yang: 1,
      yin: 3,
      phlegm: 2,
      damp: 1,
      blood: 2,
      'qi-stagnation': 4,
      special: 2
    }
  },
  {
    category: '面色特征',
    text: '您的面色通常是什么样的？',
    options: [
      { label: 'A', text: '红润有光泽' },
      { label: 'B', text: '面色苍白，缺乏血色' },
      { label: 'C', text: '面色潮红' },
      { label: 'D', text: '面色晦暗，色素沉着' },
      { label: 'E', text: '面色发黄，油腻' }
    ],
    weights: {
      balanced: 5,
      qi: 2,
      yang: 1,
      yin: 3,
      phlegm: 1,
      damp: 3,
      blood: 4,
      'qi-stagnation': 2,
      special: 1
    }
  },
  {
    category: '体温调节',
    text: '您对冷热的敏感程度如何？',
    options: [
      { label: 'A', text: '冷热适中，无明显偏好' },
      { label: 'B', text: '特别怕冷，手脚冰凉' },
      { label: 'C', text: '特别怕热，容易出汗' },
      { label: 'D', text: '怕冷又怕热' },
      { label: 'E', text: '对温度变化不敏感' }
    ],
    weights: {
      balanced: 5,
      qi: 2,
      yang: 4,
      yin: 1,
      phlegm: 2,
      damp: 1,
      blood: 2,
      'qi-stagnation': 1,
      special: 3
    }
  },
  {
    category: '消化功能',
    text: '您的消化系统功能如何？',
    options: [
      { label: 'A', text: '消化良好，食欲正常' },
      { label: 'B', text: '消化较弱，容易腹胀' },
      { label: 'C', text: '容易饥饿，食量大' },
      { label: 'D', text: '食欲不振，消化不良' },
      { label: 'E', text: '容易腹泻或便秘' }
    ],
    weights: {
      balanced: 5,
      qi: 3,
      yang: 2,
      yin: 1,
      phlegm: 4,
      damp: 3,
      blood: 1,
      'qi-stagnation': 2,
      special: 1
    }
  },
  {
    category: '睡眠质量',
    text: '您的睡眠质量如何？',
    options: [
      { label: 'A', text: '睡眠充足，精力充沛' },
      { label: 'B', text: '嗜睡，但醒来仍疲劳' },
      { label: 'C', text: '失眠多梦，容易惊醒' },
      { label: 'D', text: '睡眠浅，易醒' },
      { label: 'E', text: '睡眠不规律，时好时坏' }
    ],
    weights: {
      balanced: 5,
      qi: 2,
      yang: 3,
      yin: 4,
      phlegm: 1,
      damp: 2,
      blood: 3,
      'qi-stagnation': 3,
      special: 2
    }
  },
  {
    category: '出汗情况',
    text: '您平时的出汗情况如何？',
    options: [
      { label: 'A', text: '正常出汗，运动后适当出汗' },
      { label: 'B', text: '容易出汗，稍微活动就出汗' },
      { label: 'C', text: '出汗少，几乎不出汗' },
      { label: 'D', text: '夜间盗汗' },
      { label: 'E', text: '出汗黏腻，有异味' }
    ],
    weights: {
      balanced: 5,
      qi: 4,
      yang: 2,
      yin: 3,
      phlegm: 3,
      damp: 2,
      blood: 2,
      'qi-stagnation': 1,
      special: 1
    }
  },
  {
    category: '性格特征',
    text: '您的性格特点是什么？',
    options: [
      { label: 'A', text: '性格开朗，乐观随和' },
      { label: 'B', text: '性格温和，但容易疲劳' },
      { label: 'C', text: '性格急躁，容易发怒' },
      { label: 'D', text: '性格内向，不爱说话' },
      { label: 'E', text: '多愁善感，容易情绪化' }
    ],
    weights: {
      balanced: 5,
      qi: 2,
      yang: 1,
      yin: 2,
      phlegm: 2,
      damp: 1,
      blood: 2,
      'qi-stagnation': 4,
      special: 3
    }
  },
  {
    category: '皮肤状态',
    text: '您的皮肤通常是什么状态？',
    options: [
      { label: 'A', text: '皮肤光滑，有弹性' },
      { label: 'B', text: '皮肤干燥，容易脱皮' },
      { label: 'C', text: '皮肤油腻，容易长痘' },
      { label: 'D', text: '皮肤暗沉，有色斑' },
      { label: 'E', text: '皮肤敏感，容易过敏' }
    ],
    weights: {
      balanced: 5,
      qi: 2,
      yang: 1,
      yin: 4,
      phlegm: 3,
      damp: 4,
      blood: 4,
      'qi-stagnation': 1,
      special: 5
    }
  },
  {
    category: '头发状态',
    text: '您的头发通常是什么状态？',
    options: [
      { label: 'A', text: '头发浓密有光泽' },
      { label: 'B', text: '头发稀疏，容易脱落' },
      { label: 'C', text: '头发干枯，分叉' },
      { label: 'D', text: '头发油腻，容易出油' },
      { label: 'E', text: '头发早白' }
    ],
    weights: {
      balanced: 5,
      qi: 3,
      yang: 2,
      yin: 3,
      phlegm: 2,
      damp: 2,
      blood: 4,
      'qi-stagnation': 2,
      special: 1
    }
  },
  {
    category: '眼睛状态',
    text: '您的眼睛通常是什么状态？',
    options: [
      { label: 'A', text: '眼睛明亮，有神采' },
      { label: 'B', text: '眼睛无神，眼袋重' },
      { label: 'C', text: '眼睛干涩，容易疲劳' },
      { label: 'D', text: '眼圈发黑，有血丝' },
      { label: 'E', text: '眼睛容易过敏' }
    ],
    weights: {
      balanced: 5,
      qi: 3,
      yang: 2,
      yin: 3,
      phlegm: 2,
      damp: 1,
      blood: 4,
      'qi-stagnation': 2,
      special: 3
    }
  },
  {
    category: '口腔状态',
    text: '您的口腔通常是什么状态？',
    options: [
      { label: 'A', text: '口腔清新，无异味' },
      { label: 'B', text: '口淡无味' },
      { label: 'C', text: '口干咽燥' },
      { label: 'D', text: '口苦口臭' },
      { label: 'E', text: '口中黏腻' }
    ],
    weights: {
      balanced: 5,
      qi: 2,
      yang: 1,
      yin: 4,
      phlegm: 3,
      damp: 4,
      blood: 2,
      'qi-stagnation': 2,
      special: 1
    }
  },
  {
    category: '呼吸系统',
    text: '您的呼吸系统通常如何？',
    options: [
      { label: 'A', text: '呼吸顺畅，无异常' },
      { label: 'B', text: '气短，容易喘' },
      { label: 'C', text: '咳嗽少痰' },
      { label: 'D', text: '咳嗽多痰' },
      { label: 'E', text: '容易过敏，打喷嚏' }
    ],
    weights: {
      balanced: 5,
      qi: 4,
      yang: 2,
      yin: 2,
      phlegm: 3,
      damp: 1,
      blood: 2,
      'qi-stagnation': 1,
      special: 4
    }
  },
  {
    category: '心血管',
    text: '您的心血管系统通常如何？',
    options: [
      { label: 'A', text: '心率正常，血压稳定' },
      { label: 'B', text: '心慌心悸' },
      { label: 'C', text: '心烦意乱' },
      { label: 'D', text: '胸闷胸痛' },
      { label: 'E', text: '血压不稳定' }
    ],
    weights: {
      balanced: 5,
      qi: 3,
      yang: 2,
      yin: 2,
      phlegm: 2,
      damp: 2,
      blood: 4,
      'qi-stagnation': 3,
      special: 2
    }
  },
  {
    category: '肌肉关节',
    text: '您的肌肉关节通常如何？',
    options: [
      { label: 'A', text: '肌肉有力，关节灵活' },
      { label: 'B', text: '肌肉无力，容易酸痛' },
      { label: 'C', text: '关节疼痛，活动不便' },
      { label: 'D', text: '肌肉僵硬，关节不适' },
      { label: 'E', text: '关节风湿痛' }
    ],
    weights: {
      balanced: 5,
      qi: 3,
      yang: 2,
      yin: 2,
      phlegm: 2,
      damp: 3,
      blood: 4,
      'qi-stagnation': 2,
      special: 3
    }
  }
])

// 计算属性
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value] || {}
})

const primaryConstitution = computed(() => {
  // 如果用户已有保存的体质信息，直接显示
  if (userStore.constitution?.type && !hasStarted.value) {
    return {
      type: userStore.constitution.type,
      name: getConstitutionName(userStore.constitution.type),
      description: getConstitutionDescription(userStore.constitution.type),
      characteristics: getConstitutionCharacteristics(userStore.constitution.type)
    }
  }

  // 如果是基于问卷计算的结果
  if (!constitutionScores.value.length) return null

  const maxScore = Math.max(...constitutionScores.value.map(s => s.score))
  const primary = constitutionScores.value.find(s => s.score === maxScore)

  return {
    type: primary.type,
    name: primary.name,
    description: getConstitutionDescription(primary.type),
    characteristics: getConstitutionCharacteristics(primary.type)
  }
})

const constitutionScores = ref([])

// 方法
const getConstitutionName = type => {
  const constitution = constitutionTypes.value.find(c => c.type === type)
  return constitution ? constitution.name : ''
}

const getConstitutionColor = type => {
  const constitution = constitutionTypes.value.find(c => c.type === type)
  return constitution ? constitution.color : '#8B6F47'
}

const getConstitutionDescription = type => {
  const descriptions = {
    balanced: '阴阳气血调和，体质状态相对稳定平衡',
    qi: '元气不足，以气息低弱、机体功能状态低下为主要特征',
    yang: '阳气不足，以畏寒怕冷、手足不温等虚寒表现为主要特征',
    yin: '阴液亏少，以口燥咽干、手足心热等虚热表现为主要特征',
    phlegm: '痰湿凝聚，以体型肥胖、腹部肥满、口黏苔腻等为主要特征',
    damp: '湿热内蕴，以面垢油光、口苦、苔黄腻等为主要特征',
    blood: '血行不畅，以肤色晦暗、舌质紫暗等血瘀表现为主要特征',
    'qi-stagnation': '气机郁滞，以神情抑郁、忧虑脆弱等气郁表现为主要特征',
    special: '先天禀赋不足，以生理缺陷、过敏反应等为主要特征'
  }
  return descriptions[type] || ''
}

const getConstitutionCharacteristics = type => {
  const characteristics = {
    balanced: [
      '体型匀称健壮',
      '面色润泽',
      '毛发稠密有光泽',
      '精力充沛',
      '睡眠良好',
      '性格随和开朗'
    ],
    qi: ['语声低怯', '气短懒言', '容易疲乏', '精神不振', '易出汗', '舌淡红'],
    yang: ['平素畏冷', '手足不温', '喜热饮食', '精神不振', '睡眠偏多', '面色㿠白'],
    yin: ['口燥咽干', '手足心热', '喜冷饮', '大便干燥', '舌红少津', '脉象细弦'],
    phlegm: ['体型肥胖', '腹部肥满松软', '面部皮肤油脂较多', '多汗且黏', '胸闷', '痰多'],
    damp: ['面垢油光', '易生痤疮', '口苦口干', '身重困倦', '大便黏滞不畅', '小便短黄'],
    blood: ['肤色晦暗', '色素沉着', '容易出现瘀斑', '口唇暗淡', '舌暗或有瘀点', '脉象涩'],
    'qi-stagnation': ['神情抑郁', '情感脆弱', '烦闷不乐', '舌淡红', '苔薄白', '脉象弦'],
    special: ['先天失常', '容易过敏', '不感冒也会打喷嚏', '容易药物过敏', '花粉过敏', '食物过敏']
  }
  return characteristics[type] || []
}

const startTest = () => {
  hasStarted.value = true
  currentQuestionIndex.value = 0
  answers.value = []
  selectedOption.value = null
}

const selectOption = index => {
  selectedOption.value = index
}

const nextQuestion = () => {
  if (selectedOption.value === null) return

  // 保存答案
  answers.value.push({
    questionIndex: currentQuestionIndex.value,
    selectedOption: selectedOption.value,
    weights: currentQuestion.value.weights
  })

  // 重置选择
  selectedOption.value = null

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  } else {
    // 完成测评，计算结果
    calculateResult()
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    // 恢复上一题的答案
    const lastAnswer = answers.value.pop()
    if (lastAnswer) {
      selectedOption.value = lastAnswer.selectedOption
    }
  }
}

const calculateResult = () => {
  loading.value = true

  // 初始化各体质分数
  const scores = {}
  constitutionTypes.value.forEach(constitution => {
    scores[constitution.type] = 0
  })

  // 计算各体质总分
  answers.value.forEach(answer => {
    Object.entries(answer.weights).forEach(([type, weight]) => {
      scores[type] += weight
    })
  })

  // 转换为分数数组
  constitutionScores.value = constitutionTypes.value.map(constitution => ({
    type: constitution.type,
    name: constitution.name,
    score: scores[constitution.type]
  }))

  // 模拟加载时间
  setTimeout(() => {
    loading.value = false
    showResult.value = true
  }, 2000)
}

const saveResult = async () => {
  try {
    await userStore.setConstitution(primaryConstitution.value.type, 'manual')
    toast.success('体质结果已保存')
  } catch (error) {
    toast.error('保存失败，请重试')
  }
}

const restartTest = () => {
  hasStarted.value = false
  showResult.value = false
  currentQuestionIndex.value = 0
  answers.value = []
  selectedOption.value = null
  constitutionScores.value = []
}

const getDietAdvice = type => {
  const advice = {
    balanced: '饮食均衡，荤素搭配，粗细结合，营养全面',
    qi: '宜食补气健脾的食物，如山药、莲子、大枣等，忌生冷油腻',
    yang: '宜食温补食物，如羊肉、韭菜、生姜等，忌生冷寒凉',
    yin: '宜食滋阴润燥食物，如银耳、百合、梨等，忌辛辣燥热',
    phlegm: '宜食健脾利湿食物，如薏米、赤小豆、冬瓜等，忌肥甘厚味',
    damp: '宜食清热利湿食物，如绿豆、苦瓜、黄瓜等，忌辛辣油腻',
    blood: '宜食活血化瘀食物，如山楂、玫瑰花、黑木耳等，忌寒凉凝血',
    'qi-stagnation': '宜食疏肝理气食物，如柑橘、芹菜、玫瑰花茶等，忌情志抑郁',
    special: '宜食抗过敏食物，如蜂蜜、胡萝卜、西兰花等，忌致敏食物'
  }
  return advice[type] || ''
}

const getRecommendedFoods = type => {
  const foods = {
    balanced: ['五谷杂粮', '新鲜蔬菜', '时令水果', '优质蛋白'],
    qi: ['山药', '莲子', '大枣', '黄芪', '鸡肉', '牛肉'],
    yang: ['羊肉', '韭菜', '生姜', '核桃', '桂圆', '虾仁'],
    yin: ['银耳', '百合', '梨', '枸杞', '绿豆', '鸭肉'],
    phlegm: ['薏米', '赤小豆', '冬瓜', '白萝卜', '陈皮', '茯苓'],
    damp: ['绿豆', '苦瓜', '黄瓜', '芹菜', '莲子心', '薏米'],
    blood: ['山楂', '玫瑰花', '黑木耳', '红糖', '红花', '当归'],
    'qi-stagnation': ['柑橘', '芹菜', '玫瑰花茶', '薄荷', '佛手', '陈皮'],
    special: ['蜂蜜', '胡萝卜', '西兰花', '苹果', '酸奶', '燕麦']
  }
  return foods[type] || []
}

const getExerciseAdvice = type => {
  const advice = {
    balanced: '保持规律运动，多种运动方式结合，维持身心健康',
    qi: '选择和缓运动，如散步、太极、八段锦，避免剧烈运动',
    yang: '选择温和有氧运动，如快走、游泳，避免在寒冷环境中运动',
    yin: '选择中小强度运动，如瑜伽、太极，避免过度出汗',
    phlegm: '选择有氧运动，如慢跑、游泳，帮助祛湿化痰',
    damp: '选择强度适中运动，如登山、骑行，促进排汗祛湿',
    blood: '选择活血化瘀运动，如太极拳、舞蹈，促进血液循环',
    'qi-stagnation': '选择舒展运动，如瑜伽、气功，调节情志',
    special: '选择温和运动，如散步、太极，增强体质，避免过敏原'
  }
  return advice[type] || ''
}

const getRecommendedExercises = type => {
  const exercises = {
    balanced: ['跑步', '游泳', '球类运动', '瑜伽', '太极'],
    qi: ['散步', '太极', '八段锦', '气功', '轻度瑜伽'],
    yang: ['快走', '游泳', '室内健身', '太极', '广场舞'],
    yin: ['瑜伽', '太极', '散步', '气功', '冥想'],
    phlegm: ['慢跑', '游泳', '快走', '爬楼梯', '健身操'],
    damp: ['登山', '骑行', '游泳', '跑步', '羽毛球'],
    blood: ['太极拳', '舞蹈', '瑜伽', '快走', '按摩'],
    'qi-stagnation': ['瑜伽', '气功', '太极', '冥想', '户外散步'],
    special: ['散步', '太极', '瑜伽', '呼吸训练', '轻体操']
  }
  return exercises[type] || []
}

const getLifestyleAdvice = type => {
  const advice = {
    balanced: '保持规律作息，劳逸结合，心态平和，预防疾病',
    qi: '保证充足睡眠，避免过度劳累，注意保暖，适度休息',
    yang: '注意保暖，避免受凉，保证睡眠，适度晒太阳',
    yin: '保证充足睡眠，避免熬夜，保持心情舒畅，适度补水',
    phlegm: '保持环境干燥，规律作息，避免久坐，适度活动',
    damp: '保持环境通风，避免潮湿，勤换衣物，保持清洁',
    blood: '注意保暖，避免受凉，保持心情舒畅，适度按摩',
    'qi-stagnation': '调节情志，避免抑郁，保持心情愉快，适度社交',
    special: '避免过敏原，保持环境清洁，增强体质，规律作息'
  }
  return advice[type] || ''
}

const getLifestyleTips = type => {
  const tips = {
    balanced: ['规律作息', '均衡饮食', '适度运动', '定期体检'],
    qi: ['充足睡眠', '避免劳累', '注意保暖', '循序渐进'],
    yang: ['注意保暖', '避免受凉', '适度晒太阳', '温热饮食'],
    yin: ['避免熬夜', '保持心情舒畅', '适度补水', '避免燥热'],
    phlegm: ['保持干燥', '规律作息', '避免久坐', '清淡饮食'],
    damp: ['保持通风', '勤换衣物', '避免潮湿', '清洁卫生'],
    blood: ['注意保暖', '避免受凉', '保持心情愉快', '适度按摩'],
    'qi-stagnation': ['调节情志', '避免抑郁', '保持愉快', '适度社交'],
    special: ['避免过敏原', '保持清洁', '增强体质', '及时就医']
  }
  return tips[type] || []
}

const goToRecommendation = () => {
  router.push('/recipe-recommendation')
}

// 生命周期
onMounted(async () => {
  // 检查用户是否已有体质信息
  if (userStore.hasConstitution && !userStore.constitutionInfo) {
    // 如果有体质类型但没有详细信息，获取详细信息
    await userStore.fetchConstitutionInfo(userStore.constitution.type)
  }

  if (userStore.hasConstitution) {
    // 直接显示已保存的体质结果
    showResult.value = true
    hasStarted.value = false
  }
})
</script>

<style scoped>
.constitution-diagnosis {
  min-height: calc(100vh - var(--header-height));
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

/* Hero 区域 */
.hero-section {
  padding: var(--spacing-3xl) 0;
  background: var(--gradient-mesh);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(139, 111, 71, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(90, 159, 143, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.title-icon {
  font-size: var(--text-5xl);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}

/* 主要内容区域 */
.main-section {
  padding: var(--spacing-2xl) 0;
}

/* 状态卡片 */
.status-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.status-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
}

.progress-text {
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.progress-percentage {
  color: var(--color-primary);
  font-weight: var(--font-semibold);
}

.progress-bar {
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow) var(--ease-out);
}

/* 问卷容器 */
.questionnaire-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 过渡动画 */
.question-slide-enter-active,
.question-slide-leave-active {
  transition: all var(--transition-slow) var(--ease-out);
}

.question-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.question-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 加载容器 */
.loading-container {
  text-align: center;
  padding: var(--spacing-4xl) 0;
}

.loading-text {
  margin-top: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
}

/* 结果容器 */
.result-container {
  max-width: 1000px;
  margin: 0 auto;
}

.result-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.result-title {
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.result-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
}

.result-content {
  display: grid;
  gap: var(--spacing-2xl);
}

/* 主要体质卡片 */
.primary-constitution-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
  border: 2px solid var(--color-border-light);
}

.constitution-badge {
  display: inline-block;
  color: var(--color-text-inverse);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  margin-bottom: var(--spacing-lg);
}

.constitution-title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.constitution-description {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.constitution-characteristics {
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}

.constitution-characteristics h4 {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.constitution-characteristics ul {
  list-style: none;
  padding: 0;
}

.constitution-characteristics li {
  padding: var(--spacing-xs) 0;
  color: var(--color-text-secondary);
  position: relative;
  padding-left: var(--spacing-lg);
}

.constitution-characteristics li::before {
  content: '•';
  color: var(--color-primary);
  position: absolute;
  left: 0;
  font-weight: var(--font-bold);
}

/* 图表容器 */
.chart-container {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
}

.chart-container h3 {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

/* 建议区域 */
.advice-section {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
}

.advice-section h3 {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.advice-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

/* 操作按钮 */
.result-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.result-actions .btn {
  min-width: 150px;
}

/* 开始测评区域 */
.start-container {
  max-width: 600px;
  margin: 0 auto;
}

.start-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--color-border-light);
}

.start-icon {
  font-size: var(--text-6xl);
  margin-bottom: var(--spacing-xl);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.start-card h2 {
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.start-card p {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-xl);
  line-height: var(--leading-relaxed);
}

.start-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

.feature-icon {
  font-size: var(--text-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-3xl);
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .title-icon {
    font-size: var(--text-4xl);
  }

  .advice-cards {
    grid-template-columns: 1fr;
  }

  .result-actions {
    flex-direction: column;
  }

  .result-actions .btn {
    width: 100%;
  }
}
</style>
