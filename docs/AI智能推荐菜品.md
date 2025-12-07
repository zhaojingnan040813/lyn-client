---
title: 智能体质膳食推荐系统 API
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 智能体质膳食推荐系统 API

基于中医体质理论的智能膳食推荐系统API文档

Base URLs:

# Authentication

# Recipe

## POST AI智能推荐菜品

POST /api/recipes/ai-recommend

基于用户偏好进行AI深度分析，生成个性化菜品推荐

> Body 请求参数

```json
{
  "mealType": "dinner",
  "count": 6,
  "excludeIngredients": [
    "香菜",
    "胡萝卜"
  ],
  "specialRequirements": "希望菜品清淡易消化，适合晚餐食用"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» mealType|body|string| 否 |用餐类型（可选）|
|» count|body|integer| 否 |推荐数量|
|» excludeIngredients|body|[string]| 否 |额外排除的食材（可选）|
|» specialRequirements|body|string| 否 |特殊要求（可选）|

#### 枚举值

|属性|值|
|---|---|
|» mealType|breakfast|
|» mealType|lunch|
|» mealType|dinner|
|» mealType|snack|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "AI智能推荐成功",
  "data": {
    "list": [
      {
        "_id": "692fa7f99f1efafa42ed6f7f",
        "name": "小米南瓜粥",
        "description": "养胃健脾，补中益气，老少皆宜",
        "image": "",
        "emoji": "🎃",
        "nature": "温",
        "flavors": [
          "甘"
        ],
        "meridians": [
          "脾",
          "胃"
        ],
        "suitableConstitutions": [
          "qi_deficiency",
          "balanced",
          "yang_deficiency"
        ],
        "avoidConstitutions": [],
        "category": "quick",
        "tags": [
          "早餐",
          "养胃",
          "粥品"
        ],
        "ingredients": [
          {
            "name": "小米",
            "amount": "100g",
            "icon": "🌾"
          },
          {
            "name": "南瓜",
            "amount": "200g",
            "icon": "🎃"
          },
          {
            "name": "清水",
            "amount": "适量",
            "icon": "💧"
          }
        ],
        "steps": [
          {
            "order": 1,
            "content": "小米淘洗干净"
          },
          {
            "order": 2,
            "content": "南瓜去皮切小块"
          },
          {
            "order": 3,
            "content": "锅中加水烧开"
          },
          {
            "order": 4,
            "content": "放入小米和南瓜"
          },
          {
            "order": 5,
            "content": "大火煮沸后转小火"
          },
          {
            "order": 6,
            "content": "熬煮至粥稠南瓜软烂即可"
          }
        ],
        "cookingTime": 30,
        "difficulty": "简单",
        "analysis": "小米健脾养胃、补虚损；南瓜补中益气、消炎止痛。此粥特别适合脾胃虚弱者，是养胃的佳品。",
        "baseScore": 84,
        "isActive": true,
        "sortOrder": 0,
        "createdAt": "2025-12-03T03:01:14.016Z",
        "updatedAt": "2025-12-07T06:34:46.887Z",
        "meridianText": "入脾、胃",
        "id": "692fa7f99f1efafa42ed6f7f",
        "matchScore": 89,
        "matchReason": "适合您的口味偏好",
        "aiRecommendation": {
          "reason": "小米南瓜粥性温味甘，温和养胃，适合特禀质人群晚餐食用。虽然您偏好酸味，但晚餐宜清淡易消化，这款粥能补中益气、健脾养胃，有助于改善特禀质常见的消化敏感问题。烹饪简单快捷，适合忙碌的晚餐准备。",
          "nutritionTags": [
            "易消化",
            "养胃健脾",
            "补中益气",
            "老少皆宜"
          ],
          "bestMealTime": "晚餐",
          "seasonalAdvice": "秋冬季节食用更佳，温暖脾胃"
        }
      },
      {
        "_id": "692fa7f99f1efafa42ed6f78",
        "name": "薏米红豆粥",
        "description": "清热利湿，健脾消肿，美白祛斑",
        "image": "",
        "emoji": "🥣",
        "nature": "凉",
        "flavors": [
          "甘"
        ],
        "meridians": [
          "脾",
          "胃",
          "肺"
        ],
        "suitableConstitutions": [
          "phlegm_dampness",
          "damp_heat"
        ],
        "avoidConstitutions": [
          "yang_deficiency",
          "qi_deficiency"
        ],
        "category": "cooling",
        "tags": [
          "祛湿",
          "美白",
          "减肥"
        ],
        "ingredients": [
          {
            "name": "薏米",
            "amount": "50g",
            "icon": "⚪"
          },
          {
            "name": "红豆",
            "amount": "50g",
            "icon": "🔴"
          },
          {
            "name": "冰糖",
            "amount": "适量",
            "icon": "🧊"
          }
        ],
        "steps": [
          {
            "order": 1,
            "content": "薏米、红豆提前浸泡4小时"
          },
          {
            "order": 2,
            "content": "锅中加足量清水"
          },
          {
            "order": 3,
            "content": "大火煮沸后转小火"
          },
          {
            "order": 4,
            "content": "煮至红豆开花软烂"
          },
          {
            "order": 5,
            "content": "加入冰糖调味"
          },
          {
            "order": 6,
            "content": "可根据喜好调整浓稠度"
          }
        ],
        "cookingTime": 60,
        "difficulty": "简单",
        "analysis": "薏米利水渗湿、健脾；红豆利水消肿、清热解毒。此粥是祛湿的经典组合，适合湿气重、身体浮肿者食用。",
        "baseScore": 83,
        "isActive": true,
        "sortOrder": 0,
        "createdAt": "2025-12-03T03:01:14.015Z",
        "updatedAt": "2025-12-07T06:34:45.208Z",
        "meridianText": "入脾、胃、肺",
        "id": "692fa7f99f1efafa42ed6f78",
        "matchScore": 88,
        "matchReason": "适合您的口味偏好",
        "aiRecommendation": {
          "reason": "薏米红豆粥性味甘凉，能清热利湿、健脾消肿，适合特禀质人群改善湿热体质。虽然您偏好酸味，但此粥的甘味能温和调理脾胃，晚餐食用有助于消化吸收。其美白祛斑功效对特禀质常见的皮肤敏感问题也有辅助改善作用，烹饪简单适合晚间制作。",
          "nutritionTags": [
            "健脾利湿",
            "低脂高纤",
            "富含维生素B"
          ],
          "bestMealTime": "晚餐",
          "seasonalAdvice": "特别适合夏季或潮湿季节食用，有助于祛除体内湿气"
        }
      },
      {
        "_id": "6932a8af688e0bc0e3eb070a",
        "name": "酸辣开胃土豆丝",
        "description": "一道经典的家常菜，以土豆为主料，配以青红椒、醋和辣椒等调味。中医认为此菜具有健脾开胃、行气消食的功效。酸味入肝，能收敛固涩；辣味辛散，能行气活血。整体口感爽脆，酸辣适口，特别适合食欲不振、消化不良的人群食用。",
        "image": "",
        "emoji": "🥔🌶️",
        "nature": "平",
        "flavors": [
          "酸",
          "甘",
          "辛"
        ],
        "meridians": [
          "脾",
          "胃",
          "肝"
        ],
        "suitableConstitutions": [
          "balanced",
          "qi_stagnation"
        ],
        "avoidConstitutions": [
          "yin_deficiency",
          "damp_heat"
        ],
        "category": "neutral",
        "tags": [
          "开胃",
          "家常",
          "快手菜"
        ],
        "ingredients": [
          {
            "name": "土豆",
            "amount": "2个（约400克）",
            "icon": "🥔"
          },
          {
            "name": "青椒",
            "amount": "1个",
            "icon": "🫑"
          },
          {
            "name": "红椒",
            "amount": "半个",
            "icon": "🌶️"
          },
          {
            "name": "干辣椒",
            "amount": "3-4个",
            "icon": "🌶️"
          },
          {
            "name": "大蒜",
            "amount": "3瓣",
            "icon": "🧄"
          },
          {
            "name": "生姜",
            "amount": "2片",
            "icon": "🫚"
          },
          {
            "name": "陈醋",
            "amount": "2汤匙",
            "icon": "🍶"
          },
          {
            "name": "生抽",
            "amount": "1汤匙",
            "icon": "🥄"
          },
          {
            "name": "食盐",
            "amount": "适量",
            "icon": "🧂"
          },
          {
            "name": "白糖",
            "amount": "半茶匙",
            "icon": "🍚"
          },
          {
            "name": "食用油",
            "amount": "2汤匙",
            "icon": "🫗"
          }
        ],
        "steps": [
          {
            "order": 1,
            "content": "准备食材：土豆去皮，切成均匀的细丝，放入清水中浸泡，洗去表面淀粉，防止氧化变黑。青红椒去籽切丝，干辣椒剪成小段，大蒜、生姜切末。"
          },
          {
            "order": 2,
            "content": "焯水：锅中烧开水，加入少许盐和几滴油，将土豆丝放入焯烫约30秒至断生，捞出立即过凉水，沥干水分备用。此步骤能使土豆丝口感更爽脆。"
          },
          {
            "order": 3,
            "content": "炝锅：炒锅烧热，倒入食用油，油温五成热时，放入干辣椒段、姜末、蒜末，小火煸炒出香味。"
          },
          {
            "order": 4,
            "content": "翻炒：转大火，倒入沥干水的土豆丝和青红椒丝，快速翻炒均匀。"
          },
          {
            "order": 5,
            "content": "调味：沿锅边淋入陈醋，激发出醋香，然后加入生抽、食盐和白糖，继续大火快速翻炒约1分钟，使调味均匀。"
          },
          {
            "order": 6,
            "content": "出锅：待所有食材炒匀，土豆丝熟透但仍保持脆爽时，即可关火装盘。"
          }
        ],
        "cookingTime": 15,
        "difficulty": "简单",
        "analysis": "本菜谱以土豆（马铃薯）为主料。土豆性平味甘，归脾胃经，能健脾和胃、益气调中。其富含淀粉和膳食纤维，易于消化。配以醋之酸味，酸入肝，能柔肝、收敛，并助消化；辣椒之辛味，辛入肺，能发散、行气、温中散寒。酸辣结合，辛开苦降（此处以酸代苦），能有效刺激食欲，促进胃肠蠕动，帮助消化积滞。但需注意，过食辛辣易耗伤阴液，故阴虚体质、湿热体质者不宜多食。整体而言，这是一道性味平和、侧重调和脾胃气机、开胃消食的佳肴。",
        "baseScore": 80,
        "isActive": true,
        "sortOrder": 0,
        "createdAt": "2025-12-05T09:41:03.824Z",
        "updatedAt": "2025-12-07T06:34:51.756Z",
        "meridianText": "入脾、胃、肝",
        "id": "6932a8af688e0bc0e3eb070a",
        "matchScore": 88,
        "matchReason": "清淡易消化，适合宵夜",
        "aiRecommendation": {
          "reason": "您偏好酸味，这道酸辣开胃土豆丝以醋调味，酸味突出，能刺激食欲，适合晚餐时提振胃口。中医认为酸味入肝，有收敛之效，对特禀质可能存在的过敏倾向有一定调节作用。菜品性味平和，搭配辛散的辣椒，能健脾开胃、助消化，且烹饪简单快捷，适合作为晚餐的清爽配菜。",
          "nutritionTags": [
            "低脂",
            "富含维生素C",
            "膳食纤维"
          ],
          "bestMealTime": "晚餐",
          "seasonalAdvice": "四季皆宜，夏季食用更显开胃爽口。"
        }
      },
      {
        "_id": "6932a8c1688e0bc0e3eb070e",
        "name": "酸辣开胃土豆丝11",
        "description": "一道经典的家常菜，以土豆为主料，配以青红椒、醋和辣椒等调味。中医认为此菜具有健脾开胃、行气消食的功效。酸味入肝，能收敛固涩；辣味辛散，能行气活血。整体口感爽脆，酸辣适口，特别适合食欲不振、消化不良的人群食用。",
        "image": "",
        "emoji": "🥔🌶️",
        "nature": "平",
        "flavors": [
          "酸",
          "甘",
          "辛"
        ],
        "meridians": [
          "脾",
          "胃",
          "肝"
        ],
        "suitableConstitutions": [
          "balanced",
          "qi_stagnation"
        ],
        "avoidConstitutions": [
          "yin_deficiency",
          "damp_heat"
        ],
        "category": "neutral",
        "tags": [
          "开胃",
          "家常",
          "快手菜"
        ],
        "ingredients": [
          {
            "name": "土豆",
            "amount": "2个（约400克）",
            "icon": "🥔"
          },
          {
            "name": "青椒",
            "amount": "1个",
            "icon": "🫑"
          },
          {
            "name": "红椒",
            "amount": "半个",
            "icon": "🌶️"
          },
          {
            "name": "干辣椒",
            "amount": "3-4个",
            "icon": "🌶️"
          },
          {
            "name": "大蒜",
            "amount": "3瓣",
            "icon": "🧄"
          },
          {
            "name": "生姜",
            "amount": "2片",
            "icon": "🫚"
          },
          {
            "name": "陈醋",
            "amount": "2汤匙",
            "icon": "🍶"
          },
          {
            "name": "生抽",
            "amount": "1汤匙",
            "icon": "🥄"
          },
          {
            "name": "食盐",
            "amount": "适量",
            "icon": "🧂"
          },
          {
            "name": "白糖",
            "amount": "半茶匙",
            "icon": "🍚"
          },
          {
            "name": "食用油",
            "amount": "2汤匙",
            "icon": "🫗"
          }
        ],
        "steps": [
          {
            "order": 1,
            "content": "准备食材：土豆去皮，切成均匀的细丝，放入清水中浸泡，洗去表面淀粉，防止氧化变黑。青红椒去籽切丝，干辣椒剪成小段，大蒜、生姜切末。"
          },
          {
            "order": 2,
            "content": "焯水：锅中烧开水，加入少许盐和几滴油，将土豆丝放入焯烫约30秒至断生，捞出立即过凉水，沥干水分备用。此步骤能使土豆丝口感更爽脆。"
          },
          {
            "order": 3,
            "content": "炝锅：炒锅烧热，倒入食用油，油温五成热时，放入干辣椒段、姜末、蒜末，小火煸炒出香味。"
          },
          {
            "order": 4,
            "content": "翻炒：转大火，倒入沥干水的土豆丝和青红椒丝，快速翻炒均匀。"
          },
          {
            "order": 5,
            "content": "调味：沿锅边淋入陈醋，激发出醋香，然后加入生抽、食盐和白糖，继续大火快速翻炒约1分钟，使调味均匀。"
          },
          {
            "order": 6,
            "content": "出锅：待所有食材炒匀，土豆丝熟透但仍保持脆爽时，即可关火装盘。"
          }
        ],
        "cookingTime": 15,
        "difficulty": "简单",
        "analysis": "本菜谱以土豆（马铃薯）为主料。土豆性平味甘，归脾胃经，能健脾和胃、益气调中。其富含淀粉和膳食纤维，易于消化。配以醋之酸味，酸入肝，能柔肝、收敛，并助消化；辣椒之辛味，辛入肺，能发散、行气、温中散寒。酸辣结合，辛开苦降（此处以酸代苦），能有效刺激食欲，促进胃肠蠕动，帮助消化积滞。但需注意，过食辛辣易耗伤阴液，故阴虚体质、湿热体质者不宜多食。整体而言，这是一道性味平和、侧重调和脾胃气机、开胃消食的佳肴。",
        "baseScore": 80,
        "isActive": true,
        "sortOrder": 0,
        "createdAt": "2025-12-05T09:41:21.615Z",
        "updatedAt": "2025-12-07T06:34:51.234Z",
        "meridianText": "入脾、胃、肝",
        "id": "6932a8c1688e0bc0e3eb070e",
        "matchScore": 88,
        "matchReason": "清淡易消化，适合宵夜",
        "aiRecommendation": {
          "reason": "这道酸辣开胃土豆丝11完美契合您对酸味的偏好，其酸味入肝、收敛固涩的特性有助于调和特禀质的敏感体质。晚餐食用能健脾开胃，促进消化，避免夜间积食。爽脆的土豆丝搭配青红椒，酸辣适口，既能满足味蕾，又不会给肠胃造成负担，特别适合作为晚餐的清爽选择。",
          "nutritionTags": [
            "低热量",
            "富含维生素C",
            "膳食纤维"
          ],
          "bestMealTime": "晚餐",
          "seasonalAdvice": "四季皆宜，夏季食用尤能提振食欲"
        }
      },
      {
        "_id": "692fa7f99f1efafa42ed6f72",
        "name": "核桃芝麻糊",
        "description": "补肾益脑，乌发润肠，滋阴养血",
        "image": "",
        "emoji": "🥜",
        "nature": "温",
        "flavors": [
          "甘"
        ],
        "meridians": [
          "肝",
          "肾",
          "大肠"
        ],
        "suitableConstitutions": [
          "yang_deficiency",
          "blood_stasis",
          "yin_deficiency"
        ],
        "avoidConstitutions": [
          "phlegm_dampness"
        ],
        "category": "warming",
        "tags": [
          "早餐",
          "补肾",
          "乌发"
        ],
        "ingredients": [
          {
            "name": "核桃仁",
            "amount": "50g",
            "icon": "🥜"
          },
          {
            "name": "黑芝麻",
            "amount": "30g",
            "icon": "⚫"
          },
          {
            "name": "糯米粉",
            "amount": "20g",
            "icon": "🍚"
          },
          {
            "name": "冰糖",
            "amount": "适量",
            "icon": "🧊"
          }
        ],
        "steps": [
          {
            "order": 1,
            "content": "核桃仁、黑芝麻分别炒香"
          },
          {
            "order": 2,
            "content": "放入料理机打成细粉"
          },
          {
            "order": 3,
            "content": "糯米粉用少量水调成糊"
          },
          {
            "order": 4,
            "content": "锅中加水煮沸，倒入核桃芝麻粉"
          },
          {
            "order": 5,
            "content": "边煮边搅拌，加入糯米糊"
          },
          {
            "order": 6,
            "content": "煮至浓稠，加冰糖调味"
          }
        ],
        "cookingTime": 20,
        "difficulty": "简单",
        "analysis": "核桃补肾固精、温肺定喘；黑芝麻补肝肾、润五脏。两者配伍，对肾虚腰痛、须发早白有良好的食疗效果。",
        "baseScore": 82,
        "isActive": true,
        "sortOrder": 0,
        "createdAt": "2025-12-03T03:01:14.014Z",
        "updatedAt": "2025-12-07T06:34:48.642Z",
        "meridianText": "入肝、肾、大肠",
        "id": "692fa7f99f1efafa42ed6f72",
        "matchScore": 87,
        "matchReason": "适合您的口味偏好",
        "aiRecommendation": {
          "reason": "虽然您偏好酸味，但核桃芝麻糊的甘甜温润能温和滋养特禀体质。其补肾益脑功效有助于增强体质基础，乌发润肠特性对晚餐后的消化系统有益。简单烹饪适合忙碌的晚餐准备，温性食材能平衡夜间阳气收敛的特点。",
          "nutritionTags": [
            "补脑益智",
            "润肠通便",
            "滋阴养血",
            "富含不饱和脂肪酸"
          ],
          "bestMealTime": "晚餐",
          "seasonalAdvice": "秋冬季节食用更佳，温性食材能帮助抵御寒冷，滋润干燥季节的皮肤和肠道。"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 6,
      "total": 5
    },
    "aiAnalysis": {
      "userProfile": "用户为特禀质（过敏体质），先天禀赋特殊，对多种食物存在过敏反应（鸡蛋、牛奶、大豆），饮食需高度警惕。口味上对酸味有强烈偏好（85分），其他四味均为中性。饮食遵循严格的素食、纯素、无麸质及低盐原则，并排斥胡萝卜和洋葱。当前存在阴虚内热的典型症状（失眠、口干舌燥），可能与体质及饮食限制导致的营养不均衡有关。生活习惯上偏好制作简单、耗时短的菜品（烹饪难度2级，最大60分钟），用餐场景多集中在宵夜和约会等放松或社交场合。综合来看，用户是一位需要严格规避过敏原、追求简单烹饪、喜爱酸味、且当前身体有轻微虚热表现的素食者。",
      "recommendStrategy": "推荐策略核心围绕‘规避风险、投其所好、调理现状’三大原则展开：\n1.  **严格规避过敏与禁忌**：所有推荐菜品必须完全排除鸡蛋、牛奶、大豆、麸质、胡萝卜、洋葱，并符合纯素、低盐要求。这是首要且不可妥协的前提。\n2.  **强化酸味主线，兼顾其他风味**：充分利用用户对酸味的强烈偏好，选择天然酸味食材（如柠檬、番茄、醋、酸浆果）作为菜肴风味核心，以提升食欲和满足感。同时，搭配中性甜、苦、辣、咸味进行平衡，避免风味单一。\n3.  **针对当前状态进行食养**：用户‘失眠、口干舌燥’是阴虚内热之象。推荐菜品将侧重选用滋阴、生津、清虚热的食材，如百合、银耳、梨、荸荠、黄瓜、绿叶蔬菜等，并采用清淡的烹饪方式（如凉拌、蒸、快炒）。\n4.  **适配场景与烹饪能力**：针对‘晚餐’及潜在的‘宵夜’‘约会’场景，推荐菜品需兼具美观、易消化、制作快捷的特点。以凉菜、快炒汤羹、蒸菜为主，确保在60分钟内轻松完成，符合其‘简单烹饪’的偏好。\n5.  **营养密度与易得性**：在严苛的饮食限制下，优先选择营养丰富且不易引起过敏的食材，如藜麦（无麸质优质蛋白）、坚果（需确认无交叉污染）、多种彩色蔬菜（除胡萝卜外）和菌菇类，以弥补因规避大豆、蛋奶可能造成的蛋白质与钙质缺口。",
      "nutritionBalance": "鉴于用户严格的饮食限制（纯素、无大豆、无蛋奶）和当前阴虚状态，营养建议重点在于构建安全、均衡且具有调理作用的膳食模式：\n1.  **蛋白质补充策略**：规避大豆后，需依赖其他植物蛋白来源。推荐食用：藜麦（无麸质全蛋白）、鹰嘴豆（需确认无过敏）、扁豆、南瓜籽、火麻仁、杏仁（酱）等。建议每餐包含至少一种优质植物蛋白来源。\n2.  **钙与维生素D关注**：无奶制品摄入需特别关注钙质。多食用深绿色蔬菜（如西兰花、羽衣甘蓝）、杏仁、芝麻酱、 fortified无麸质植物奶（如杏仁奶、米奶，需确认成分安全）以及海藻类。适当晒太阳或考虑补充剂（需咨询医生）。\n3.  **滋阴生津食材日常化**：将百合、银耳、梨、荸荠、莲藕、黄瓜、西红柿等滋阴生津食材纳入日常食谱。例如，晚餐可包含一道银耳百合羹或黄瓜拌藜麦沙拉。\n4.  **脂肪酸均衡**：通过摄入亚麻籽油、紫苏油、核桃（需确认无过敏）等富含Omega-3的植物油和坚果，平衡脂肪酸，有益于抗炎和皮肤健康（特禀质常伴皮肤敏感）。\n5.  **晚餐搭配范例与原则**：\n    *   **主菜（酸味核心）**：如‘柠檬香草拌藜麦豆腐（使用鹰嘴豆豆腐）’，提供蛋白质和复合碳水化合物，酸味开胃。\n    *   **副菜（滋阴清热）**：如‘凉拌黄瓜银耳’，清爽生津。\n    *   **汤羹（安抚助眠）**：如‘百合小米粥’，温和易消化，安神助眠，适合宵夜场景。\n    *   **总体原则**：晚餐宜清淡、易消化，七分饱即可，避免加重失眠。严格控制盐分，利用香菇、海带、番茄的自然鲜味和柠檬汁、醋的酸味来替代部分盐的调味功能。"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|推荐成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|object|false|none||none|
|»» list|[object]|false|none||none|
|»»» _id|string|false|none||none|
|»»» name|string|false|none||none|
|»»» description|string|false|none||none|
|»»» matchScore|integer|false|none||none|
|»»» matchReason|string|false|none||none|
|»»» aiRecommendation|object|false|none||none|
|»»»» reason|string|false|none||none|
|»»»» nutritionTags|[string]|false|none||none|
|»»»» bestMealTime|string|false|none||none|
|»»»» seasonalAdvice|string|false|none||none|
|»» pagination|object|false|none||none|
|»»» page|integer|false|none||none|
|»»» pageSize|integer|false|none||none|
|»»» total|integer|false|none||none|
|»» aiAnalysis|object|false|none||none|
|»»» userProfile|string|false|none||none|
|»»» recommendStrategy|string|false|none||none|
|»»» nutritionBalance|string|false|none||none|

# 数据模型

