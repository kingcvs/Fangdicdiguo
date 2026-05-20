# GitHub Pages 部署教程（含国内访问方案

本教程将指导你如何将房地产帝国项目部署到 GitHub Pages，并提供国内可访问的替代方案。

## 目录
1. [GitHub Pages 部署](#github-pages-部署)
2. [国内访问优化方案](#国内访问优化方案)
3. [国内替代方案](#国内替代方案)

---

## GitHub Pages 部署

### 前置准备

1. **GitHub 账号**
   - 注册地址：[https://github.com](https://github.com)
   - 如无账号请先注册

2. **项目准备**
   - 确保项目已推送到 GitHub 仓库
   - 本地构建测试通过

### 方法一：使用 GitHub Actions 自动部署（推荐）

#### 步骤 1：修改 vite 配置

编辑 [vite.config.ts](file:///workspace/vite.config.ts)，添加 base 配置：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 替换为你的仓库名，例如：'/real-estate-empire/
  base: '/你的仓库名/',
})
```

#### 步骤 2：创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  # 推送到 main 分支时触发部署
  push:
    branches: [ "main"
  # 允许手动触发部署
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 步骤 3：配置 GitHub Pages

1. 进入 GitHub 仓库的 **Settings**
2. 左侧菜单选择 **Pages**
3. 在 **Build and deployment** 部分：
   - **Source** 选择 **GitHub Actions**
4. 保存设置

#### 步骤 4：推送代码

```bash
git add .
git commit -m "配置 GitHub Pages 部署"
git push
```

推送后，GitHub Actions 会自动开始构建和部署。

#### 步骤 5：访问网站

部署完成后，访问地址为：
```
https://你的用户名.github.io/你的仓库名/
```

---

### 方法二：手动部署到 gh-pages 分支

#### 步骤 1：修改 vite 配置

同样需要修改 [vite.config.ts](file:///workspace/vite.config.ts) 的 base 配置（同上）

#### 步骤 2：本地构建

```bash
npm run build
```

#### 步骤 3：安装 gh-pages 工具

```bash
npm install -D gh-pages
```

#### 步骤 4：添加部署脚本

在 [package.json](file:///workspace/package.json) 中添加：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 步骤 5：执行部署

```bash
npm run build
npm run deploy
```

#### 步骤 6：配置 GitHub Pages

1. 进入 GitHub 仓库的 **Settings** → **Pages**
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 **gh-pages** 分支
4. 点击 **Save**

---

## 配置单页应用（SPA）路由

GitHub Pages 需要配置路由回退，防止刷新 404。

### 方案 1：使用 Hash 路由

修改路由模式为 hash 模式，修改 [src/router/index.ts](file:///workspace/src/router/index.ts)：

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // 使用 Hash 模式
  routes: [...]
})
```

### 方案 2：使用 404.html 回退

创建 `public/404.html 文件：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>404</title>
    <script>
      // 将路径重写脚本
      (function(l) {
        if (l.search) {
          var q = {};
          l.search.slice(1).split('&').forEach(function(v) {
            var a = v.split('=');
            q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
          });
          if (q.p !== undefined) {
            window.history.replaceState({}, window.document.title, q.p + (q.q ? ('?' + q.q) + l.hash);
          }
        }
      }(window.location));
    </script>
  </head>
  <body>
  </body>
</html>
```

同时在 `index.html 的 `<head>` 中添加：

```html
<script>
  // SPA 路径重写脚本
  (function(l) {
    l.replace(l.pathname + l.search + l.hash);
  }(window.location));
</script>
```

---

## 国内访问优化方案

由于 GitHub Pages 在国内访问速度较慢或不稳定，以下是几种优化方案：

### 方案 1：使用 Cloudflare CDN 加速

#### 步骤：
1. 注册 Cloudflare 账号：[https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 添加你的域名
3. 将域名 DNS 解析到 Cloudflare
4. 在 Cloudflare 中配置 CNAME 指向 GitHub Pages 地址
5. 开启 CDN 加速

### 方案 2：使用 jsdelivr CDN

将静态资源通过 jsdelivr 加速，在 vite 中配置：

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  base: 'https://cdn.jsdelivr.net/gh/你的用户名/你的仓库名@gh-pages/',
})
```

### 方案 3：使用 Gitee Pages（推荐国内使用）

---

## 国内替代方案

### 方案一：Gitee Pages（推荐）

Gitee Pages 是国内的 GitHub Pages 替代品，访问速度快。

#### 部署步骤：

1. **注册 Gitee 账号**：[https://gitee.com](https://gitee.com)

2. **创建仓库**并推送代码

3. **修改 vite 配置**：

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  base: '/你的仓库名/',
})
```

4. **本地构建**：
```bash
npm run build
```

5. **配置 Gitee Pages：
   - 进入仓库 → **服务** → **Gitee Pages**
   - 选择部署分支（如 `gh-pages` 或 `main`
   - 部署目录填写 `dist`
   - 点击 **启动**

6. **访问地址**：
```
https://你的用户名.gitee.io/你的仓库名/
```

### 方案二：Vercel（国内访问较好）

Vercel 在国内访问速度比 GitHub Pages 快很多。

详细步骤参考之前创建的 [DEPLOYMENT.md](file:///workspace/DEPLOYMENT.md) 中的 Vercel 部署部分。

### 方案三：Netlify（国内访问较好）

详细步骤参考 [NETLIFY_DEPLOY.md](file:///workspace/NETLIFY_DEPLOY.md)。

### 方案四：使用国内静态托管服务

- **腾讯云静态网站托管
- **阿里云 OSS + CDN
- **七牛云静态托管
- **又拍云

---

## 部署检查清单

- [ ] 修改 `vite.config.ts` 配置了正确的 base 路径
- [ ] 配置了 SPA 路由回退（Hash 模式或 404.html
- [ ] 本地构建成功 `npm run build`
- [ ] 推送到 GitHub/Gitee
- [ ] 配置 Pages 服务
- [ ] 测试访问正常

---

## 常见问题

### Q: GitHub Pages 访问速度慢？
**A:** 建议使用 Gitee Pages、Vercel 或 Netlify 替代。

### Q: 刷新页面 404？
**A:** 使用 Hash 路由模式，或配置 404.html 回退脚本。

### Q: 图片/资源加载失败？
**A:** 检查 `vite.config.ts` 中的 base 路径配置是否正确。
