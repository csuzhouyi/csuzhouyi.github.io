# Token 泄露问题解决方案

## 问题根源

每次推送代码后，GitHub Personal Access Token 就会被自动删除，原因是：

1. **Token 被编译到构建产物中**
   - Vite 会将 `import.meta.env.VITE_GITHUB_TOKEN` 内联到 JavaScript 代码中
   - 构建后的 `dist/index-xxx.js` 文件中包含完整的 Token

2. **构建产物被公开部署**
   - GitHub Pages 是公开的
   - 任何人都可以访问 `https://csuzhouyi.github.io` 并查看源代码

3. **GitHub 自动扫描**
   - GitHub 会扫描公开的网站和代码
   - 检测到 Token 后自动撤销

## 已实施的保护措施

✅ **移除了生产环境的调试日志**
- 不再在控制台输出 Token 相关信息
- 减少 Token 暴露的风险

✅ **使用环境变量**
- 本地开发使用 `.env`（不提交到 Git）
- 生产环境使用 GitHub Secrets

## 根本解决方案

### 方案一：使用后端代理（最安全，推荐）

创建后端 API 服务器，Token 只存储在后端：

**优点**：
- ✅ Token 完全不会出现在客户端
- ✅ 最安全的方式
- ✅ GitHub 不会检测到 Token

**缺点**：
- ❌ 需要后端服务器
- ❌ 增加部署复杂度

**实现方式**：
- 使用 Vercel Serverless Functions
- 使用 Netlify Functions
- 使用 Cloudflare Workers
- 使用自己的服务器

### 方案二：定期轮换 Token（当前方案）

**操作步骤**：
1. 每 1-2 周更换一次 Token
2. 更新 GitHub Secrets
3. 重新部署

**优点**：
- ✅ 简单易行
- ✅ 不需要额外服务器

**缺点**：
- ❌ Token 仍会被编译到构建产物中
- ❌ 需要定期维护

### 方案三：使用 Fine-grained Personal Access Token

如果 GitHub 支持，使用 Fine-grained Token：
- 限制权限范围
- 限制可访问的资源

### 方案四：接受限制（适合个人项目）

对于个人项目：
- 接受 Token 会被撤销的事实
- 当 Token 被撤销时，重新生成并更新
- 这是静态网站使用客户端 API 的固有限制

## 当前最佳实践

1. **立即行动**：
   - ✅ 已移除生产环境调试日志
   - ✅ 确保 `.env` 在 `.gitignore` 中
   - ✅ 使用 GitHub Secrets 存储 Token

2. **定期维护**：
   - 每 1-2 周更换一次 Token
   - 更新 GitHub Secrets
   - 重新部署

3. **监控**：
   - 如果网站突然无法使用，检查 Token 是否被撤销
   - 及时更新 Token

## 如果 Token 被撤销

1. **重新生成 Token**
   - 访问 https://github.com/settings/tokens
   - 创建新 Token（确保有 `gist` 权限）

2. **更新 GitHub Secret**
   - 进入 Secrets 设置
   - 更新 `VITE_GITHUB_TOKEN`

3. **重新部署**
   - 推送代码或手动触发部署

## 未来改进方向

如果需要完全避免 Token 泄露：

1. **迁移到后端代理架构**
   - 使用 Vercel/Netlify Functions
   - Token 只存储在后端环境变量中

2. **使用 GitHub App**
   - 更安全的认证方式
   - 但需要更复杂的配置

## 总结

**当前情况**：
- Token 会被编译到构建产物中（无法避免）
- GitHub 会检测并撤销 Token
- 需要定期更换 Token

**已优化**：
- ✅ 移除了会暴露 Token 的日志
- ✅ 使用环境变量和 Secrets

**建议**：
- 对于个人项目，定期更换 Token 是可以接受的
- 如果项目很重要，考虑使用后端代理方案
