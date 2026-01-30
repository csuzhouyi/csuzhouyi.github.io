# Token 安全指南

## ⚠️ 重要：为什么 Token 会被自动删除

GitHub 有**自动安全扫描机制**，如果检测到 Token 泄露，会**自动撤销** Token。

### 🔴 核心问题

**对于静态网站（GitHub Pages），Token 必须出现在客户端代码中才能调用 API。**

- Vite 在构建时会将 `import.meta.env.VITE_*` 环境变量内联到 JavaScript 代码中
- 构建产物被部署到公开的 GitHub Pages
- GitHub 会自动扫描公开的网站和代码
- 一旦检测到 Token，就会自动撤销

**这是静态网站使用客户端 API 的固有安全限制。**

### Token 泄露的常见原因

1. **Token 被提交到 Git 仓库**
   - 即使后来删除了，Git 历史中仍然存在
   - GitHub 会扫描所有公开仓库和提交历史

2. **Token 出现在日志或错误信息中**
   - 控制台输出
   - 错误堆栈
   - 构建日志

3. **Token 被硬编码在代码中**
   - 直接写在 `.js`、`.vue` 等文件中
   - 即使文件是私有的，也可能被扫描

## ✅ 正确的 Token 使用方式

### 1. 本地开发：使用 .env 文件

```env
# .env 文件（不要提交到 Git）
VITE_GITHUB_TOKEN=ghp_你的Token
VITE_GIST_ID=你的GIST_ID
```

**重要**：
- ✅ `.env` 已在 `.gitignore` 中
- ✅ 不要提交 `.env` 文件
- ✅ 不要将 Token 硬编码在代码中

### 2. 生产环境：使用 GitHub Secrets

1. **创建 Secret**
   - 仓库 Settings → Secrets and variables → Actions
   - 添加 `VITE_GITHUB_TOKEN` Secret

2. **在构建时注入**
   - 通过 GitHub Actions 在构建时注入
   - Token 不会出现在代码中

### 3. 检查 Token 是否泄露

运行以下命令检查 Git 历史：

```bash
# 检查 Git 历史中是否有 Token
git log --all --source --full-history -p | grep -i "ghp_"

# 检查当前工作区是否有 Token
grep -r "ghp_" . --exclude-dir=node_modules --exclude-dir=.git
```

## 🔒 安全最佳实践

### 1. 立即撤销泄露的 Token

如果 Token 已泄露：

1. **访问 Token 设置**
   ```
   https://github.com/settings/tokens
   ```

2. **删除泄露的 Token**
   - 找到对应的 Token
   - 点击 **Delete** 或 **Revoke**

3. **创建新 Token**
   - 使用新的 Token
   - 更新 `.env` 和 GitHub Secrets

### 2. 清理 Git 历史（如果 Token 已提交）

如果 Token 已经被提交到 Git：

**⚠️ 警告**：这会重写 Git 历史，需要强制推送

```bash
# 使用 git-filter-repo 工具（推荐）
# 安装：pip install git-filter-repo

git filter-repo --invert-paths --path .env
git filter-repo --replace-text <(echo "ghp_旧Token==>ghp_已删除")

# 强制推送（谨慎操作）
git push origin --force --all
```

**或者**：更简单的方法

```bash
# 使用 BFG Repo-Cleaner
# 下载：https://rtyley.github.io/bfg-repo-cleaner/

# 删除包含 Token 的文件
bfg --delete-files .env

# 清理 Git 历史
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 强制推送
git push origin --force --all
```

### 3. 预防措施

1. **使用 .gitignore**
   ```gitignore
   # 确保 .env 在 .gitignore 中
   .env
   .env.local
   .env.*.local
   ```

2. **提交前检查**
   ```bash
   # 提交前检查是否包含敏感信息
   git diff --cached | grep -i "ghp_"
   ```

3. **使用 Git Hooks**
   创建 `.git/hooks/pre-commit`：
   ```bash
   #!/bin/bash
   if git diff --cached | grep -q "ghp_"; then
     echo "❌ 错误：检测到 Token，请移除后再提交"
     exit 1
   fi
   ```

4. **定期轮换 Token**
   - 每 3-6 个月更换一次 Token
   - 如果怀疑泄露，立即更换

## 🚨 如果 Token 已泄露

### 立即行动

1. **撤销 Token**（最重要）
   - 立即访问 https://github.com/settings/tokens
   - 删除泄露的 Token

2. **创建新 Token**
   - 生成新的 Token
   - 更新所有使用该 Token 的地方

3. **检查泄露范围**
   - 检查 Git 历史
   - 检查是否有公开的仓库包含 Token
   - 检查构建日志

4. **清理历史**（如果必要）
   - 如果 Token 在公开仓库中，需要清理 Git 历史
   - 或者将仓库设为私有

## 📋 检查清单

提交代码前，确保：

- [ ] `.env` 文件在 `.gitignore` 中
- [ ] 没有将 Token 硬编码在代码中
- [ ] 没有在注释中包含 Token
- [ ] 没有在日志中输出完整 Token
- [ ] Git 历史中没有 Token
- [ ] 使用 GitHub Secrets 存储生产环境 Token

## 🔍 如何检查当前状态

```bash
# 1. 检查 .env 是否会被提交
git status --ignored | grep .env

# 2. 检查 Git 历史中是否有 Token
git log --all --source --full-history -p | grep -i "ghp_"

# 3. 检查工作区文件
grep -r "ghp_" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md"
```

## 💡 总结

**Token 被自动删除的原因**：
- GitHub 检测到 Token 泄露（在公开仓库、提交历史、日志、**构建产物**等）
- GitHub 自动撤销以保护你的账户安全
- **对于静态网站，Token 必须出现在客户端代码中，这是无法避免的**

**已实施的保护措施**：
1. ✅ 移除了生产环境的调试日志（避免在控制台暴露 Token）
2. ✅ 使用 `.env` 文件（本地开发，不提交到 Git）
3. ✅ 使用 GitHub Secrets（生产环境构建时注入）
4. ✅ Token 不会出现在源代码中

**但仍然存在的问题**：
- ⚠️ Token 会被编译到构建产物（JavaScript 文件）中
- ⚠️ 构建产物是公开的（GitHub Pages）
- ⚠️ GitHub 会扫描并可能撤销 Token

**长期解决方案**：
1. **使用后端代理**（推荐）
   - 创建后端 API 服务器
   - Token 只存储在后端
   - 前端通过后端代理调用 GitHub API
   - 需要后端服务器（如 Vercel、Netlify Functions 等）

2. **定期轮换 Token**
   - 每 1-2 周更换一次 Token
   - 更新 GitHub Secrets
   - 重新部署

3. **使用 Fine-grained Personal Access Token**（如果可用）
   - 限制 Token 的权限范围
   - 限制可访问的仓库

4. **接受限制**
   - 对于个人项目，定期更换 Token 是可以接受的
   - 如果 Token 被撤销，重新生成并更新即可
