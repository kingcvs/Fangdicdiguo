# 房地产帝国 - Vue3版本 开发指南

## 项目概述

这是一个使用 Vue3 + TypeScript + Vite + TailwindCSS + Pinia 开发的房地产模拟游戏。

## 技术栈

- **框架**: Vue 3.4 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite 5
- **样式**: TailwindCSS 3
- **状态管理**: Pinia 2
- **路由**: Vue Router 4

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
/
├── pmc/                          # 原始项目（保留）
├── src/
│   ├── main.ts                   # 应用入口
│   ├── App.vue                   # 根组件
│   ├── router/
│   │   └── index.ts             # 路由配置
│   ├── stores/
│   │   ├── game.ts              # 游戏状态管理
│   │   └── ui.ts                # UI状态管理
│   ├── views/
│   │   ├── MainMenu.vue         # 主菜单
│   │   ├── GameMain.vue         # 游戏主界面
│   │   ├── Registration/        # 注册流程
│   │   └── Settings/            # 设置页面
│   ├── components/              # 通用组件
│   ├── types/
│   │   └── game.ts              # 游戏类型定义
│   └── styles/
│       └── main.css             # 主样式文件
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 核心功能进度

### ✅ 已完成
- 项目初始化和基础架构
- Vue3 + TypeScript + Vite 项目设置
- TailwindCSS 样式系统
- Pinia 状态管理
- 主菜单系统
- 旧存档兼容和数据迁移

### ⏳ 进行中/待完成
- 公司注册流程（11步）
- 投资系统（土地竞拍）
- 工程管理系统
- 营销销售系统
- 资本运作系统
- 个人模块
- 品牌模块
- 治理系统

## 存档兼容性

项目完全兼容原始 `pmc/` 项目的存档数据，自动将旧格式转换为新格式。

原始存档 key: `real-estate-save`

## 设计规范

### 颜色系统

```css
--game-primary: #0d1b2a       /* 主背景色 */
--game-secondary: #14263b     /* 次要背景色 */
--game-accent: #FBBF24        /* 金色强调色 */
--game-accent-end: #D4AF37    /* 渐变结束色 */
```

### 组件类名

```css
.btn-primary      /* 主要按钮样式 */
.bg-game-card/80  /* 卡片背景 */
```

## 下一步开发

### 1. 公司注册流程
- 创建11个注册步骤的组件
- 实现表单验证
- 连接到game store

### 2. 投资系统
- 土地市场页面
- 土地竞拍逻辑
- 土地储备管理

### 3. 其他业务模块
- 工程管理
- 营销销售
- 资本运作
- 个人模块

## 注意事项

- 保持与原始游戏的存档兼容性
- 遵循 Vue3 Composition API 最佳实践
- 使用 TypeScript 类型定义
- 保持代码模块化和可扩展
