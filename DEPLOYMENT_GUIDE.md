# 部署指南 - 解决 Netlify 404 问题

## 问题描述
在 Netlify 部署时出现 404 错误，是因为 Vite 的代理配置只在开发环境生效，生产环境无法使用。

## 解决方案
采用方案3：通过环境变量区分开发和生产环境的 API 请求地址。

## 配置变更

### 1. 环境变量文件
- **.env.development**: 开发环境配置，使用相对路径 `/api`
- **.env.production**: 生产环境配置，使用完整后端 URL

### 2. 请求配置
- 修改了 `src/api/request.js`，添加了 `getApiBaseUrl()` 函数
- 根据环境变量动态设置 API 基础地址

### 3. 构建配置
- 更新了 `vite.config.js`，支持加载不同模式的环境变量
- 更新了 `package.json`，构建脚本使用对应的模式

## 工作原理

### 开发环境 (npm run dev)
```
请求: /api/auth/register
↓
Vite 代理转发到: https://lyn-backend-165954-5-1362504576.sh.run.tcloudbase.com/api/auth/register
```

### 生产环境 (Netlify 部署)
```
请求: https://lyn-backend-165954-5-1362504576.sh.run.tcloudbase.com/api/auth/register
↓
直接到达后端服务器
```

## 部署步骤

### 1. 本地测试
```bash
# 开发环境测试
npm run dev

# 生产环境构建测试
npm run build
npm run preview
```

### 2. 提交代码
```bash
git add .
git commit -m "配置环境变量解决 Netlify 404 问题"
git push origin main
```

### 3. Netlify 部署
- 推送代码后，Netlify 会自动触发部署
- 构建命令: `npm run build`
- 发布目录: `dist`

## 重要注意事项

### CORS 配置
由于生产环境直接请求后端，需要在后端服务器配置 CORS：

```javascript
// 后端 CORS 配置示例
app.use(cors({
  origin: [
    'http://localhost:5173',                              // 开发环境
    'https://peaceful-rolypoly-5e93e1.netlify.app'        // 生产环境
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'X-Session-Id'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))
```

### 环境变量说明
- `VITE_API_BASE_URL`: API 基础地址
- 开发环境: `/api` (使用 Vite 代理)
- 生产环境: `https://lyn-backend-165954-5-1362504576.sh.run.tcloudbase.com/api`

### 文件说明
- `.env.development` 和 `.env.production` 会被提交到 Git
- `.env.local` 和 `.env.*.local` 被忽略，用于本地敏感配置

## 验证方法

### 1. 开发环境验证
```bash
npm run dev
# 访问 http://localhost:5173
# 查看网络面板，请求应该指向 /api/* 并被代理
```

### 2. 生产环境验证
```bash
npm run build
npm run preview
# 查看网络面板，请求应该直接指向后端完整 URL
```

### 3. Netlify 部署验证
部署后访问你的 Netlify 域名，注册功能应该正常工作。

## 故障排除

### 如果仍然出现 404
1. 检查后端服务器是否正常运行
2. 检查 CORS 配置是否正确
3. 检查环境变量是否正确加载
4. 查看浏览器控制台和网络面板的详细信息

### 如果 CORS 错误
联系后端开发者，确保你的 Netlify 域名被添加到 CORS 白名单中。

## 后续维护
- 如果后端地址变更，只需更新 `.env.production` 文件
- 如需添加新的环境变量，确保以 `VITE_` 开头
- 敏感信息应放在 `.env.local` 中，不会被提交到 Git
