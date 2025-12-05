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

# Constitution

## GET 获取所有体质类型

GET /api/constitutions

获取系统中所有可用的体质类型列表

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "type": "string",
      "name": "string",
      "description": "string",
      "characteristics": [
        "string"
      ]
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|[object]|false|none||none|
|»» type|string|false|none||none|
|»» name|string|false|none||none|
|»» description|string|false|none||none|
|»» characteristics|[string]|false|none||none|

## GET 获取指定体质详情

GET /api/constitutions/{type}

根据体质类型获取详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|path|string| 是 |体质类型标识|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|体质类型不存在|None|

## PUT 设置用户体质

PUT /api/session/{sessionId}/constitution

为用户设置体质类型

> Body 请求参数

```json
{
  "constitutionType": "qi_deficiency",
  "diagnosisMethod": "manual"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|
|body|body|object| 是 |none|
|» constitutionType|body|string| 是 |体质类型标识|
|» diagnosisMethod|body|string| 否 |诊断方式|

#### 枚举值

|属性|值|
|---|---|
|» diagnosisMethod|manual|
|» diagnosisMethod|ai|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|设置成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话或体质类型不存在|None|

## GET 获取用户体质信息

GET /api/session/{sessionId}/constitution

获取用户当前的体质类型及详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话不存在|None|

# Preference

## GET 获取用户偏好

GET /api/preferences

根据sessionId获取用户的口味偏好设置

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|x-session-id|header|string| 是 |用户会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "flavorPreference": {
      "sour": 100,
      "sweet": 100,
      "bitter": 100,
      "spicy": 100,
      "salty": 100
    },
    "dietaryRestrictions": [
      "string"
    ],
    "allergies": [
      "string"
    ],
    "dislikedIngredients": [
      "string"
    ],
    "currentConditions": [
      "string"
    ],
    "mealScenarios": [
      "string"
    ],
    "cookingDifficulty": 1,
    "maxCookingTime": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户或偏好不存在|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|[UserPreference](#schemauserpreference)|false|none||none|
|»» flavorPreference|[FlavorPreference](#schemaflavorpreference)|false|none||none|
|»»» sour|number|false|none||酸味偏好程度|
|»»» sweet|number|false|none||甜味偏好程度|
|»»» bitter|number|false|none||苦味偏好程度|
|»»» spicy|number|false|none||辣味偏好程度|
|»»» salty|number|false|none||咸味偏好程度|
|»» dietaryRestrictions|[string]|false|none||饮食禁忌列表|
|»» allergies|[string]|false|none||过敏原列表|
|»» dislikedIngredients|[string]|false|none||不喜欢的食材|
|»» currentConditions|[string]|false|none||当前身体状态|
|»» mealScenarios|[string]|false|none||用餐场景偏好|
|»» cookingDifficulty|number|false|none||烹饪难度偏好|
|»» maxCookingTime|number|false|none||最大烹饪时间（分钟）|

## PUT 更新用户偏好

PUT /api/preferences

更新用户的口味偏好设置，支持部分更新

> Body 请求参数

```json
{
  "flavorPreference": {
    "sour": 100,
    "sweet": 100,
    "bitter": 100,
    "spicy": 100,
    "salty": 100
  },
  "dietaryRestrictions": [
    "string"
  ],
  "allergies": [
    "string"
  ],
  "dislikedIngredients": [
    "string"
  ],
  "currentConditions": [
    "string"
  ],
  "mealScenarios": [
    "string"
  ],
  "cookingDifficulty": 1,
  "maxCookingTime": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|x-session-id|header|string| 是 |用户会话ID|
|body|body|[UserPreference](#schemauserpreference)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "偏好更新成功",
  "data": {
    "flavorPreference": {
      "sour": 100,
      "sweet": 100,
      "bitter": 100,
      "spicy": 100,
      "salty": 100
    },
    "dietaryRestrictions": [
      "string"
    ],
    "allergies": [
      "string"
    ],
    "dislikedIngredients": [
      "string"
    ],
    "currentConditions": [
      "string"
    ],
    "mealScenarios": [
      "string"
    ],
    "cookingDifficulty": 1,
    "maxCookingTime": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|更新成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|请求参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|[UserPreference](#schemauserpreference)|false|none||none|
|»» flavorPreference|[FlavorPreference](#schemaflavorpreference)|false|none||none|
|»»» sour|number|false|none||酸味偏好程度|
|»»» sweet|number|false|none||甜味偏好程度|
|»»» bitter|number|false|none||苦味偏好程度|
|»»» spicy|number|false|none||辣味偏好程度|
|»»» salty|number|false|none||咸味偏好程度|
|»» dietaryRestrictions|[string]|false|none||饮食禁忌列表|
|»» allergies|[string]|false|none||过敏原列表|
|»» dislikedIngredients|[string]|false|none||不喜欢的食材|
|»» currentConditions|[string]|false|none||当前身体状态|
|»» mealScenarios|[string]|false|none||用餐场景偏好|
|»» cookingDifficulty|number|false|none||烹饪难度偏好|
|»» maxCookingTime|number|false|none||最大烹饪时间（分钟）|

## DELETE 重置用户偏好

DELETE /api/preferences

重置用户的口味偏好为默认值

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|x-session-id|header|string| 是 |用户会话ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|重置成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在|None|

# Session

## POST 创建新会话

POST /api/session

创建匿名用户会话，返回sessionId

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "会话创建成功",
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "user": {}
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|会话创建成功|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|
|»» sessionId|string|false|none||none|
|»» user|object|false|none||none|

## GET 获取会话信息

GET /api/session/{sessionId}

根据sessionId获取用户会话信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话不存在|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|

## DELETE 删除会话

DELETE /api/session/{sessionId}

删除用户会话及相关数据

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|删除成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话不存在|None|

# Chat

## POST AI 问诊对话

POST /api/chat

发送消息与 AI 进行对话

> Body 请求参数

```json
{
  "message": "我最近总是感觉疲劳，手脚冰凉，是什么原因？",
  "history": [
    {
      "role": "user",
      "content": "string"
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» message|body|string| 是 |用户消息|
|» history|body|[object]| 否 |历史对话记录|
|»» role|body|string| 否 |none|
|»» content|body|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|»» role|user|
|»» role|assistant|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "reply": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|回复成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|
|»» reply|string|false|none||AI 回复内容|

## POST AI 问诊流式对话

POST /api/chat/stream

发送消息与 AI 进行流式对话（SSE）

> Body 请求参数

```json
{
  "message": "string",
  "history": [
    "string"
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» message|body|string| 是 |用户消息|
|» history|body|[string]| 否 |历史对话记录|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|流式响应|string|

# Recipe

## GET 获取菜谱列表

GET /api/recipes

获取菜谱列表，支持分页、筛选、搜索，可根据用户体质和偏好计算匹配度

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|category|query|string| 否 |菜谱分类筛选|
|keyword|query|string| 否 |搜索关键词（菜名、描述、食材）|
|isActive|query|string| 否 |启用状态筛选（true-已启用，false-已禁用，不传则查询所有）|
|page|query|integer| 否 |页码|
|pageSize|query|integer| 否 |每页数量|
|X-Session-Id|header|string| 否 |会话ID（用于个性化推荐）|

#### 枚举值

|属性|值|
|---|---|
|category|recommended|
|category|warming|
|category|cooling|
|category|quick|
|isActive|true|
|isActive|false|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "list": [
      {}
    ],
    "pagination": {
      "page": 0,
      "pageSize": 0,
      "total": 0
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|object|false|none||none|
|»» list|[object]|false|none||none|
|»» pagination|object|false|none||none|
|»»» page|integer|false|none||none|
|»»» pageSize|integer|false|none||none|
|»»» total|integer|false|none||none|

## POST 创建新菜谱

POST /api/recipes

创建一个新的菜谱

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|创建成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|

## GET 获取菜谱详情

GET /api/recipes/{id}

根据ID获取菜谱详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |菜谱ID|
|X-Session-Id|header|string| 否 |会话ID（用于计算个性化匹配度）|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|菜谱不存在|None|

## PUT 更新菜谱

PUT /api/recipes/{id}

更新指定ID的菜谱信息

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |菜谱ID|
|body|body|object| 是 |none|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|更新成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|菜谱不存在|None|

## DELETE 删除菜谱

DELETE /api/recipes/{id}

硬删除指定ID的菜谱

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |菜谱ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|删除成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|菜谱不存在|None|

## GET 获取推荐菜谱

GET /api/recipes/recommend

根据用户体质和偏好获取个性化推荐菜谱

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|limit|query|integer| 否 |返回数量|
|X-Session-Id|header|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "list": [
      "string"
    ],
    "reason": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|object|false|none||none|
|»» list|[string]|false|none||none|
|»» reason|string|false|none||none|

## GET 获取菜谱分类统计

GET /api/recipes/categories

获取各分类的菜谱数量

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|

## POST AI生成菜谱

POST /api/recipes/generate

根据食品名称使用AI生成菜谱数据

> Body 请求参数

```json
{
  "foodName": "西红柿"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» foodName|body|string| 否 |食品名称|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {}
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
|» code|integer|false|none||none|
|» data|object|false|none||生成的菜谱数据|

## POST 保存AI生成的菜谱

POST /api/recipes/save-generated

保存经过人工编辑的AI生成菜谱到数据库

> Body 请求参数

```json
{
  "name": "string",
  "description": "string",
  "nature": "寒",
  "ingredients": [
    "string"
  ],
  "steps": [
    "string"
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» name|body|string| 否 |菜谱名称|
|» description|body|string| 否 |菜谱描述|
|» nature|body|string| 否 |性味|
|» ingredients|body|[string]| 否 |食材列表|
|» steps|body|[string]| 否 |烹饪步骤|

#### 枚举值

|属性|值|
|---|---|
|» nature|寒|
|» nature|凉|
|» nature|平|
|» nature|温|
|» nature|热|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|保存成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误或验证失败|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|None|

# 数据模型

<h2 id="tocS_Error">Error</h2>

<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "code": 0,
  "message": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|message|string|false|none||错误信息|

<h2 id="tocS_Success">Success</h2>

<a id="schemasuccess"></a>
<a id="schema_Success"></a>
<a id="tocSsuccess"></a>
<a id="tocssuccess"></a>

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|object|false|none||none|

<h2 id="tocS_FlavorPreference">FlavorPreference</h2>

<a id="schemaflavorpreference"></a>
<a id="schema_FlavorPreference"></a>
<a id="tocSflavorpreference"></a>
<a id="tocsflavorpreference"></a>

```json
{
  "sour": 100,
  "sweet": 100,
  "bitter": 100,
  "spicy": 100,
  "salty": 100
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|sour|number|false|none||酸味偏好程度|
|sweet|number|false|none||甜味偏好程度|
|bitter|number|false|none||苦味偏好程度|
|spicy|number|false|none||辣味偏好程度|
|salty|number|false|none||咸味偏好程度|

<h2 id="tocS_UserPreference">UserPreference</h2>

<a id="schemauserpreference"></a>
<a id="schema_UserPreference"></a>
<a id="tocSuserpreference"></a>
<a id="tocsuserpreference"></a>

```json
{
  "flavorPreference": {
    "sour": 100,
    "sweet": 100,
    "bitter": 100,
    "spicy": 100,
    "salty": 100
  },
  "dietaryRestrictions": [
    "string"
  ],
  "allergies": [
    "string"
  ],
  "dislikedIngredients": [
    "string"
  ],
  "currentConditions": [
    "string"
  ],
  "mealScenarios": [
    "string"
  ],
  "cookingDifficulty": 1,
  "maxCookingTime": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|flavorPreference|[FlavorPreference](#schemaflavorpreference)|false|none||none|
|dietaryRestrictions|[string]|false|none||饮食禁忌列表|
|allergies|[string]|false|none||过敏原列表|
|dislikedIngredients|[string]|false|none||不喜欢的食材|
|currentConditions|[string]|false|none||当前身体状态|
|mealScenarios|[string]|false|none||用餐场景偏好|
|cookingDifficulty|number|false|none||烹饪难度偏好|
|maxCookingTime|number|false|none||最大烹饪时间（分钟）|

