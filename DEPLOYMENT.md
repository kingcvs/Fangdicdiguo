# TapTap 部署指南

## 项目概述
房地产帝国 - 中国房地产开发模拟游戏

## 前置准备

### 1. 环境要求
- Node.js 18+
- npm 9+
- Git

### 2. 项目构建
```bash
# 进入项目目录
cd /workspace

# 安装依赖
npm install

# 构建生产版本
npm run build
```

## 部署方案

### 方案一：静态网站托管 (推荐)

#### Vercel 部署
1. 注册 Vercel 账号：https://vercel.com
2. 导入项目到 GitHub/GitLab
3. 在 Vercel 中导入仓库
4. 配置构建命令：`npm run build`
5. 配置输出目录：`dist`
6. 点击部署

#### Netlify 部署
1. 注册 Netlify 账号：https://netlify.com
2. 导入项目到 GitHub
3. 在 Netlify 中连接仓库
4. 配置构建：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 部署网站

#### GitHub Pages
1. 将项目推送到 GitHub
2. 修改 vite.config.ts:
```typescript
export default defineConfig({
  base: '/repo-name/', // 替换为你的仓库名
  // ...
})
```
3. 构建并部署：
```bash
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

### 方案二：云服务器部署

#### 使用 Nginx
1. 构建项目：`npm run build`
2. 将 dist 目录内容上传到服务器
3. 配置 Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## TapTap 发布准备

### 1. 打包为网页应用
TapTap 支持网页应用发布，确保：
- 构建产物完整
- 所有资源可正确加载
- 适配移动端屏幕

### 2. 应用信息准备
- 应用名称：房地产帝国
- 应用类型：游戏
- 游戏类型：模拟经营
- 简介：真实还原中国房地产开发流程的模拟经营游戏
- 关键词：房地产、模拟经营、策略

### 3. 素材准备
- 应用图标：512x512 PNG
- 截图：1080x1920 (至少4张)
- 宣传图：1024x500 PNG
- 视频介绍 (可选)

### 4. TapTap 开发者平台
1. 注册开发者账号：https://developer.taptap.cn
2. 创建应用
3. 填写应用信息
4. 上传素材
5. 配置网页应用地址 (使用上面部署的 URL)
6. 提交审核

## 本地运行
```bash
# 开发模式
npm run dev

# 预览构建结果
npm run preview
```

## 技术栈
- Vue 3 + TypeScript
- Vite 构建工具
- Pinia 状态管理
- Vue Router 路由
- Tailwind CSS 样式

## 常见问题

### Q: 路由刷新 404？
A: 确保服务器配置了 SPA 回退路由，将所有请求指向 index.html

### Q: 构建失败？
A: 检查 Node.js 版本，确保 >18，运行 `npm install` 重新安装依赖

### Q: 移动端适配问题？
A: 项目已配置 viewport meta 标签，采用响应式设计，支持移动端

## 更新部署
1. 修改代码
2. 构建：`npm run build`
3. 重新部署

## 联系方式
如有问题，请查看项目文档或提交 Issue。
