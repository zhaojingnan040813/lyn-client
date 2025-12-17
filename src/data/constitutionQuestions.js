/**
 * 体质测试题目数据
 * 基于中医体质理论设计的标准化问题
 */

export const constitutionQuestions = [
  {
    id: 1,
    question: '您的体力状况如何？',
    options: [
      {
        text: '精力充沛，不易疲劳',
        scores: { balanced: 3, yang_deficiency: -1, yin_deficiency: -1 }
      },
      { text: '容易疲劳，稍微活动就气喘', scores: { qi_deficiency: 3, yang_deficiency: 2 } },
      { text: '体力一般，但容易倦怠', scores: { qi_deficiency: 2, phlegm_dampness: 1 } },
      { text: '时好时坏，不稳定', scores: { qi_stagnation: 2, special: 1 } }
    ]
  },
  {
    id: 2,
    question: '您对冷热的敏感程度如何？',
    options: [
      { text: '怕冷，手脚冰凉', scores: { yang_deficiency: 3, qi_deficiency: 2 } },
      { text: '怕热，容易出汗', scores: { yin_deficiency: 3, damp_heat: 2 } },
      { text: '冷热都能适应', scores: { balanced: 3 } },
      { text: '既怕冷又怕热', scores: { qi_deficiency: 2, yin_deficiency: 2, special: 1 } }
    ]
  },
  {
    id: 3,
    question: '您的面色通常如何？',
    options: [
      { text: '红润有光泽', scores: { balanced: 3 } },
      { text: '面色苍白或萎黄', scores: { qi_deficiency: 3, blood_stasis: 2 } },
      { text: '面色晦暗或有色斑', scores: { blood_stasis: 3, qi_stagnation: 2 } },
      { text: '面部油腻，易长痘', scores: { damp_heat: 3, phlegm_dampness: 2 } }
    ]
  },
  {
    id: 4,
    question: '您的体型特点是？',
    options: [
      { text: '体型匀称，体重适中', scores: { balanced: 3 } },
      { text: '体型偏瘦', scores: { yin_deficiency: 3, qi_deficiency: 2 } },
      { text: '体型偏胖，肌肉松软', scores: { phlegm_dampness: 3, yang_deficiency: 2 } },
      { text: '肥胖且结实', scores: { damp_heat: 2, phlegm_dampness: 2 } }
    ]
  },
  {
    id: 5,
    question: '您的消化系统状况如何？',
    options: [
      { text: '消化良好，食欲正常', scores: { balanced: 3 } },
      { text: '食欲不振，易腹胀', scores: { qi_deficiency: 3, phlegm_dampness: 2 } },
      { text: '易饥饿，但消化快', scores: { yin_deficiency: 3, damp_heat: 2 } },
      { text: '大便溏薄或粘滞', scores: { phlegm_dampness: 3, qi_deficiency: 1 } }
    ]
  },
  {
    id: 6,
    question: '您的情绪状态通常如何？',
    options: [
      { text: '情绪稳定，心情舒畅', scores: { balanced: 3 } },
      { text: '容易焦虑，思虑过多', scores: { qi_stagnation: 3, yin_deficiency: 2 } },
      { text: '情绪波动大，易怒', scores: { qi_stagnation: 2, damp_heat: 2 } },
      { text: '情绪低落，易抑郁', scores: { qi_stagnation: 3, blood_stasis: 1 } }
    ]
  },
  {
    id: 7,
    question: '您的睡眠质量如何？',
    options: [
      { text: '睡眠很好，精力充沛', scores: { balanced: 3 } },
      { text: '入睡困难，多梦易醒', scores: { yin_deficiency: 3, qi_stagnation: 2 } },
      { text: '嗜睡，但醒来仍疲劳', scores: { phlegm_dampness: 3, qi_deficiency: 2 } },
      { text: '睡眠不安宁，易惊醒', scores: { qi_deficiency: 2, yang_deficiency: 2 } }
    ]
  },
  {
    id: 8,
    question: '您的舌头通常表现为？',
    options: [
      { text: '淡红舌，薄白苔', scores: { balanced: 3 } },
      {
        text: '舌淡胖，边有齿痕',
        scores: { qi_deficiency: 3, yang_deficiency: 2, phlegm_dampness: 1 }
      },
      { text: '红舌，少苔或无苔', scores: { yin_deficiency: 3, damp_heat: 2 } },
      { text: '舌暗红或有瘀点', scores: { blood_stasis: 3, qi_stagnation: 2 } },
      { text: '舌苔厚腻', scores: { phlegm_dampness: 3, damp_heat: 2 } }
    ]
  },
  {
    id: 9,
    question: '您容易出汗吗？',
    options: [
      { text: '正常出汗', scores: { balanced: 3 } },
      { text: '易自汗，稍动即汗', scores: { qi_deficiency: 3, yang_deficiency: 2 } },
      { text: '盗汗，夜间易汗', scores: { yin_deficiency: 3 } },
      { text: '出汗少或无汗', scores: { damp_heat: 2, blood_stasis: 1 } }
    ]
  },
  {
    id: 10,
    question: '您是否容易过敏？',
    options: [
      { text: '很少过敏', scores: { balanced: 2 } },
      { text: '过敏体质，易鼻炎、皮肤过敏', scores: { special: 3, yin_deficiency: 1 } },
      { text: '季节性过敏', scores: { special: 2, qi_deficiency: 1 } },
      { text: '对多种物质过敏', scores: { special: 3 } }
    ]
  }
]

/**
 * 体质类型详细信息
 */
export const constitutionTypes = {
  balanced: {
    type: 'balanced',
    name: '平和质',
    description: '阴阳气血调和，体质状态较好',
    characteristics: [
      '体型匀称健壮',
      '面色润泽，头发稠密有光泽',
      '精力充沛，睡眠良好',
      '性格随和开朗',
      '患病较少，自身调节能力强',
      '适应能力强，能耐寒热'
    ],
    dietAdvice: ['饮食有节，不暴饮暴食', '粗细搭配，营养均衡', '适量运动，劳逸结合'],
    avoidFoods: []
  },
  qi_deficiency: {
    type: 'qi_deficiency',
    name: '气虚质',
    description: '元气不足，气息低弱',
    characteristics: [
      '语音低弱，气短懒言',
      '容易疲乏，精神不振',
      '易出虚汗',
      '舌淡红，舌体胖大，边有齿痕',
      '面色萎黄或淡白',
      '肌肉松软不实'
    ],
    dietAdvice: [
      '宜食补气健脾食物',
      '如：山药、莲子、大枣、小米',
      '忌食生冷油腻',
      '运动要适度，避免剧烈运动'
    ],
    avoidFoods: ['生冷食物', '油腻食物', '难消化食物']
  },
  yang_deficiency: {
    type: 'yang_deficiency',
    name: '阳虚质',
    description: '阳气不足，怕冷畏寒',
    characteristics: [
      '畏寒怕冷，手足不温',
      '喜热饮食，精神不振',
      '舌淡胖嫩，脉沉迟',
      '面色㿠白',
      '易腹泻',
      '性欲减退'
    ],
    dietAdvice: [
      '宜食温补食物',
      '如：羊肉、韭菜、生姜、桂圆',
      '忌食生冷寒凉',
      '注意保暖，适当运动'
    ],
    avoidFoods: ['生冷食物', '寒性水果', '冰镇饮品']
  },
  yin_deficiency: {
    type: 'yin_deficiency',
    name: '阴虚质',
    description: '阴液亏虚，燥热内盛',
    characteristics: [
      '手足心热，口燥咽干',
      '喜冷饮，大便干燥',
      '舌红少津，脉细数',
      '面色潮红，有烘热感',
      '易失眠',
      '皮肤干燥'
    ],
    dietAdvice: ['宜食滋阴润燥食物', '如：银耳、百合、梨、鸭肉', '忌食温燥食物', '保证充足睡眠'],
    avoidFoods: ['辛辣食物', '煎炸食物', '温补药物']
  },
  phlegm_dampness: {
    type: 'phlegm_dampness',
    name: '痰湿质',
    description: '痰湿凝聚，体型肥胖',
    characteristics: [
      '体型肥胖，腹部肥满',
      '面部皮肤油脂较多',
      '多汗且黏',
      '胸闷，痰多',
      '口黏腻或甜',
      '身重困倦'
    ],
    dietAdvice: [
      '宜食健脾祛湿食物',
      '如：薏米、赤小豆、冬瓜',
      '忌食肥甘厚味',
      '加强运动，控制体重'
    ],
    avoidFoods: ['甜食', '油腻食物', '酒类', '冷饮']
  },
  damp_heat: {
    type: 'damp_heat',
    name: '湿热质',
    description: '湿热内蕴，排泄不畅',
    characteristics: [
      '面垢油光，易生痤疮',
      '口苦口干，身重困倦',
      '大便黏滞不畅',
      '小便短赤',
      '男性阴囊潮湿，女性带下增多',
      '舌质偏红，苔黄腻'
    ],
    dietAdvice: ['宜食清热利湿食物', '如：绿豆、苦瓜、黄瓜', '忌食辛辣油腻', '保持皮肤清洁干燥'],
    avoidFoods: ['辛辣食物', '油腻食物', '酒类', '烧烤']
  },
  blood_stasis: {
    type: 'blood_stasis',
    name: '血瘀质',
    description: '血行不畅，易有瘀滞',
    characteristics: [
      '肤色晦暗，色素沉着',
      '易出现瘀斑',
      '口唇暗淡',
      '舌暗或有瘀点',
      '健忘',
      '女性多痛经'
    ],
    dietAdvice: [
      '宜食活血化瘀食物',
      '如：山楂、玫瑰花、红糖',
      '忌食寒凉',
      '适当运动，促进血液循环'
    ],
    avoidFoods: ['生冷食物', '寒性食物']
  },
  qi_stagnation: {
    type: 'qi_stagnation',
    name: '气郁质',
    description: '气机郁滞，情志不舒',
    characteristics: [
      '神情抑郁，忧虑脆弱',
      '多愁善感，情绪不稳',
      '胸闷，胁胀',
      '嗳气，善太息',
      '咽喉异物感',
      '女性乳房胀痛'
    ],
    dietAdvice: ['宜食疏肝理气食物', '如：柑橘、玫瑰花、茉莉花', '保持心情舒畅', '多参加集体活动'],
    avoidFoods: ['过饱饮食', '刺激性食物']
  },
  special: {
    type: 'special',
    name: '特禀质',
    description: '先天禀赋不足，易过敏',
    characteristics: [
      '易过敏',
      '不感冒也鼻塞打喷嚏',
      '易患药物过敏',
      '易患花粉症',
      '皮肤易起荨麻疹',
      '遗传性疾病'
    ],
    dietAdvice: ['饮食清淡，均衡营养', '避免已知过敏原', '增强体质，提高免疫力', '居住环境清洁'],
    avoidFoods: ['海鲜', '辛辣食物', '发物', '个人过敏原']
  }
}

/**
 * 计算体质测试结果
 * @param {Array} answers - 用户答案数组，每个元素包含 questionId 和 optionIndex
 * @returns {Object} 包含推荐体质和详细分数的对象
 */
export function calculateConstitution(answers) {
  const scores = {
    balanced: 0,
    qi_deficiency: 0,
    yang_deficiency: 0,
    yin_deficiency: 0,
    phlegm_dampness: 0,
    damp_heat: 0,
    blood_stasis: 0,
    qi_stagnation: 0,
    special: 0
  }

  // 计算每种体质的得分
  answers.forEach(answer => {
    const question = constitutionQuestions.find(q => q.id === answer.questionId)
    if (question && answer.optionIndex !== undefined) {
      const option = question.options[answer.optionIndex]
      if (option && option.scores) {
        Object.keys(option.scores).forEach(constitution => {
          scores[constitution] += option.scores[constitution] || 0
        })
      }
    }
  })

  // 找出得分最高的体质
  const maxScore = Math.max(...Object.values(scores))
  const recommendedConstitutions = Object.keys(scores).filter(key => scores[key] === maxScore)

  // 如果有多个最高分，默认选择第一个
  const recommendedType = recommendedConstitutions[0] || 'balanced'

  return {
    recommendedType,
    constitutionScores: scores,
    maxScore,
    constitutionDetails: constitutionTypes[recommendedType]
  }
}
