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

## POST AI生成菜谱

POST /api/recipes/generate

根据食品名称使用AI生成菜谱数据

> Body 请求参数

```json
{
  "dishDescription": "我想做一道清淡的汤，希望有养胃的功效，适合晚餐食用",
  "targetConstitution": "",
  "specialRequirements": "不要放葱，少吃盐，希望口感偏甜，烹饪时间控制在30分钟内"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» dishDescription|body|string| 是 |none|
|» targetConstitution|body|string| 是 |none|
|» specialRequirements|body|string| 是 |none|
|» foodName|body|string| 否 |食品名称|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "name": "string",
    "description": "string",
    "emoji": "string",
    "nature": "string",
    "flavors": [
      "string"
    ],
    "meridians": [
      "string"
    ],
    "suitableConstitutions": [
      "string"
    ],
    "avoidConstitutions": [
      "string"
    ],
    "category": "string",
    "tags": [
      "string"
    ],
    "ingredients": [
      {
        "name": "string",
        "amount": "string",
        "icon": "string"
      }
    ],
    "steps": [
      {
        "order": 0,
        "content": "string"
      }
    ],
    "cookingTime": 0,
    "difficulty": "string",
    "analysis": "string",
    "baseScore": 0,
    "isActive": true,
    "sortOrder": 0,
    "generatedBy": "string",
    "generatedAt": "string",
    "inputParams": {
      "dishDescription": "string",
      "targetConstitution": "string",
      "specialRequirements": "string"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|生成成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误或生成失败|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||生成的菜谱数据|
|»» name|string|true|none||none|
|»» description|string|true|none||none|
|»» emoji|string|true|none||none|
|»» nature|string|true|none||none|
|»» flavors|[string]|true|none||none|
|»» meridians|[string]|true|none||none|
|»» suitableConstitutions|[string]|true|none||none|
|»» avoidConstitutions|[string]|true|none||none|
|»» category|string|true|none||none|
|»» tags|[string]|true|none||none|
|»» ingredients|[object]|true|none||none|
|»»» name|string|true|none||none|
|»»» amount|string|true|none||none|
|»»» icon|string|true|none||none|
|»» steps|[object]|true|none||none|
|»»» order|integer|true|none||none|
|»»» content|string|true|none||none|
|»» cookingTime|integer|true|none||none|
|»» difficulty|string|true|none||none|
|»» analysis|string|true|none||none|
|»» baseScore|integer|true|none||none|
|»» isActive|boolean|true|none||none|
|»» sortOrder|integer|true|none||none|
|»» generatedBy|string|true|none||none|
|»» generatedAt|string|true|none||none|
|»» inputParams|object|true|none||none|
|»»» dishDescription|string|true|none||none|
|»»» targetConstitution|string|true|none||none|
|»»» specialRequirements|string|true|none||none|

# 数据模型

