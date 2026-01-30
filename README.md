# Vue3 GitHub Pages 项目

这是一个使用 Vue3 + Vite 构建的项目，可以直接部署到 GitHub Pages。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 📦 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

1. 确保你的仓库名称是 `username.github.io` 格式
2. 在 `vite.config.js` 中，将 `base` 设置为你的仓库路径：
   ```js
   base: '/csuzhouyi.github.io/',
   ```
   如果你的仓库名就是 `username.github.io`，可以设置为 `base: '/'`

3. 推送代码到 `main` 分支，GitHub Actions 会自动构建并部署

4. 在仓库设置中启用 GitHub Pages：
   - 进入 Settings > Pages
   - Source 选择 `gh-pages` 分支
   - 保存后等待几分钟，你的网站就会在 `https://username.github.io` 上线

### 方法二：手动部署

1. 构建项目：
   ```bash
   npm run build
   ```

2. 进入 `dist` 目录，初始化 git 并推送到 `gh-pages` 分支：
   ```bash
   cd dist
   git init
   git add -A
   git commit -m 'deploy'
   git push -f git@github.com:username/username.github.io.git main:gh-pages
   ```

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
- **GitHub Pages** - 静态网站托管服务

## 📝 注意事项

- 确保 `vite.config.js` 中的 `base` 路径与你的仓库名称匹配
- 如果使用自定义域名，需要相应调整 `base` 配置
- GitHub Actions 需要仓库有写入权限，确保 Actions 已启用

## 📄 License

MIT
