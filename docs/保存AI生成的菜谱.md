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

## POST 保存AI生成的菜谱

POST /api/recipes/save-generated

保存经过人工编辑的AI生成菜谱到数据库

> Body 请求参数

```json
{
  "name": "山药百合养胃甜汤",
  "description": "一道专为养胃设计的清淡甜汤，以山药健脾益胃、百合滋阴润肺、红枣补中益气为核心，口感清甜绵软，性质平和，特别适合晚餐食用，既能滋养脾胃，又不会给消化系统带来负担。针对气虚质人群，通过补脾益气、增强消化功能的食材组合，温和调理脾胃功能。",
  "emoji": "🍲",
  "nature": "平",
  "flavors": [
    "甘"
  ],
  "meridians": [
    "脾",
    "胃",
    "肺"
  ],
  "suitableConstitutions": [
    "balanced",
    "qi_deficiency",
    "yin_deficiency"
  ],
  "avoidConstitutions": [
    "damp_heat",
    "phlegm_dampness"
  ],
  "category": "neutral",
  "tags": [
    "养胃",
    "清淡",
    "甜汤",
    "快手"
  ],
  "ingredients": [
    {
      "name": "铁棍山药",
      "amount": "150克",
      "icon": "🍠"
    },
    {
      "name": "鲜百合",
      "amount": "50克",
      "icon": "🌷"
    },
    {
      "name": "红枣",
      "amount": "5颗",
      "icon": "🍒"
    },
    {
      "name": "枸杞",
      "amount": "10克",
      "icon": "🔴"
    },
    {
      "name": "莲子",
      "amount": "20克",
      "icon": "🟤"
    },
    {
      "name": "冰糖",
      "amount": "15克",
      "icon": "🍬"
    },
    {
      "name": "清水",
      "amount": "800毫升",
      "icon": "💧"
    }
  ],
  "steps": [
    {
      "order": 1,
      "content": "准备食材：山药去皮切滚刀块，立即浸泡在清水中防止氧化；鲜百合掰成瓣洗净；红枣、枸杞、莲子用清水稍加冲洗。"
    },
    {
      "order": 2,
      "content": "煮制：锅中加入800毫升清水，放入山药块、莲子、红枣，大火煮沸后转中小火，炖煮15分钟。"
    },
    {
      "order": 3,
      "content": "加入百合：待山药煮至软糯后，加入鲜百合瓣，继续煮5分钟。"
    },
    {
      "order": 4,
      "content": "调味：加入冰糖和枸杞，轻轻搅拌至冰糖完全融化，再煮2分钟即可关火。"
    },
    {
      "order": 5,
      "content": "出锅：将汤品盛入碗中，温热食用效果最佳。"
    }
  ],
  "cookingTime": 25,
  "difficulty": "简单",
  "analysis": "本菜谱严格遵循用户要求：1) 清淡养胃汤：选用山药（甘平，归脾、肺、肾经）为君药，健脾养胃、益气生津；百合（甘微寒，归心、肺经）滋阴润肺、清心安神；红枣（甘温，归脾、胃经）补中益气、养血安神。三者合用，共奏健脾养胃、滋阴益气之功，性质平和，适合晚餐。2) 特殊要求：全程未使用葱；仅用少量冰糖调味，满足‘少吃盐’、‘口感偏甜’的要求；总烹饪时间25分钟，符合‘30分钟内’的限制。3) 针对气虚质：气虚质多表现为脾胃功能减弱，本汤通过山药、红枣补脾益气，莲子健脾止泻，枸杞滋补肝肾，整体增强脾胃运化功能，改善气虚症状。冰糖替代食盐，避免过咸伤肾，更符合养生原则。",
  "baseScore": 80,
  "isActive": true,
  "sortOrder": 0,
  "generatedBy": "AI",
  "generatedAt": "2025-12-07T06:13:05.036Z",
  "inputParams": {
    "dishDescription": "我想做一道清淡的汤，希望有养胃的功效，适合晚餐食用",
    "targetConstitution": null,
    "specialRequirements": "不要放葱，少吃盐，希望口感偏甜，烹饪时间控制在30分钟内"
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» name|body|string| 是 |菜谱名称|
|» description|body|string| 是 |菜谱描述|
|» emoji|body|string| 是 |none|
|» nature|body|string| 是 |性味|
|» flavors|body|[string]| 是 |none|
|» meridians|body|[string]| 是 |none|
|» suitableConstitutions|body|[string]| 是 |none|
|» avoidConstitutions|body|[string]| 是 |none|
|» category|body|string| 是 |none|
|» tags|body|[string]| 是 |none|
|» ingredients|body|[object]| 是 |食材列表|
|»» name|body|string| 是 |none|
|»» amount|body|string| 是 |none|
|»» icon|body|string| 是 |none|
|» steps|body|[object]| 是 |烹饪步骤|
|»» order|body|integer| 是 |none|
|»» content|body|string| 是 |none|
|» cookingTime|body|integer| 是 |none|
|» difficulty|body|string| 是 |none|
|» analysis|body|string| 是 |none|
|» baseScore|body|integer| 是 |none|
|» isActive|body|boolean| 是 |none|
|» sortOrder|body|integer| 是 |none|
|» generatedBy|body|string| 是 |none|
|» generatedAt|body|string| 是 |none|
|» inputParams|body|object| 是 |none|
|»» dishDescription|body|string| 是 |none|
|»» targetConstitution|body|null| 是 |none|
|»» specialRequirements|body|string| 是 |none|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|保存成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误或验证失败|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|None|

# 数据模型

