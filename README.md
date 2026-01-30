# Vue3 项目 - Vercel 部署

这是一个使用 Vue3 + Vite + Element Plus 构建的多页面网站，**推荐部署到 Vercel**（也可以部署到 GitHub Pages）。

## 🚀 部署方式：Vercel + Supabase

**技术栈**：
- ✅ **Vercel**：部署平台（完全免费）
- ✅ **Supabase**：PostgreSQL 数据库（完全免费，500MB）
- ✅ **GitHub**：仅用于存储源代码

**为什么选择这个方案？**
- ✅ 完全免费（Vercel + Supabase 都免费）
- ✅ 数据安全（数据库在后端，不会泄露）
- ✅ 性能优秀（全球 CDN）
- ✅ 易于维护（无需管理服务器）

**快速开始**：
1. **设置 Supabase**：查看 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. **部署到 Vercel**：查看 [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm run dev
```

项目将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
pnpm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
pnpm run preview
```

## 📦 部署步骤

### 第一步：设置 Supabase 数据库

1. 访问 https://supabase.com，创建免费项目
2. 创建 `links` 表（SQL 脚本在 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)）
3. 获取 API 密钥（Project URL 和 anon key）

**详细步骤**：查看 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 第二步：部署到 Vercel

1. 访问 https://vercel.com，使用 GitHub 登录
2. 点击 "Add New Project"，导入你的仓库
3. 配置环境变量：
   - `SUPABASE_URL`: 你的 Supabase Project URL
   - `SUPABASE_ANON_KEY`: 你的 Supabase anon key
   - `VITE_API_BASE_URL`: 部署后的 Vercel 域名（部署后更新）
4. 点击 Deploy，完成！

**详细步骤**：查看 [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)

### 第三步：更新 API URL

部署完成后，更新 `VITE_API_BASE_URL` 环境变量为你的 Vercel 域名，然后重新部署。

## 📁 项目结构

```
.
├── src/
│   ├── App.vue          # 主组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
├── package.json         # 项目配置
└── README.md           # 说明文档
```

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI 组件库
- **Vue Router** - Vue.js 官方路由管理器
- **pnpm** - 快速、节省磁盘空间的包管理器
- **Vercel** - 部署平台（Serverless Functions）
- **Supabase** - PostgreSQL 数据库（完全免费）
- **GitHub** - 仅用于存储源代码

## 📝 注意事项

- 确保 `vite.config.js` 中的 `base` 路径与你的仓库名称匹配
- 如果使用自定义域名，需要相应调整 `base` 配置
- GitHub Actions 需要仓库有写入权限，确保 Actions 已启用

## 📄 License

MIT
