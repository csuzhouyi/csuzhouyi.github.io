# GitHub Pages 部署故障排查

## 问题：本地正常，GitHub Pages 提示 Token 错误

### 快速检查清单

- [ ] GitHub Secrets 中已配置 `VITE_GITHUB_TOKEN`
- [ ] GitHub Secrets 中已配置 `VITE_GIST_ID`
- [ ] Secret 名称完全匹配（区分大小写）
- [ ] Token 有 `gist` 权限
- [ ] 已重新触发部署

## 详细排查步骤

### 1. 检查 GitHub Secrets 配置

1. **进入仓库设置**
   ```
   https://github.com/csuzhouyi/csuzhouyi.github.io/settings/secrets/actions
   ```

2. **确认 Secrets 存在**
   应该看到以下两个 Secrets：
   - ✅ `VITE_GITHUB_TOKEN`（你的 Personal Access Token）
   - ✅ `VITE_GIST_ID`（你的 Gist ID）

3. **检查 Secret 名称**
   - ⚠️ 名称必须完全匹配：`VITE_GITHUB_TOKEN` 和 `VITE_GIST_ID`
   - ⚠️ 区分大小写
   - ⚠️ 不能有空格

### 2. 验证 Token 有效性

在浏览器控制台运行以下代码测试 Token：

```javascript
// 替换为你的实际 Token
const TOKEN = '你的Token'

fetch('https://api.github.com/user', {
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
})
.then(r => {
  console.log('状态:', r.status)
  if (r.ok) {
    return r.json()
  } else {
    return r.text().then(text => {
      console.error('错误:', text)
      throw new Error(text)
    })
  }
})
.then(user => console.log('✅ Token 有效，用户:', user.login))
.catch(e => console.error('❌ Token 无效:', e))
```

### 3. 检查构建日志

1. **进入 Actions**
   ```
   https://github.com/csuzhouyi/csuzhouyi.github.io/actions
   ```

2. **查看最新的工作流运行**
   - 点击最新的 "Deploy to GitHub Pages" 运行

3. **检查 Build 步骤**
   - 展开 "Build" 步骤
   - 查看是否有错误信息
   - 注意：Secret 值不会在日志中显示（安全原因）

4. **检查环境变量是否注入**
   在构建日志中查找：
   - 如果看到 `VITE_GITHUB_TOKEN: ❌ 未设置` → Secret 未配置或名称错误
   - 如果看到 `VITE_GITHUB_TOKEN: ghp_1234...` → 环境变量已注入

### 4. 常见问题及解决方案

#### 问题 1: Secret 未配置

**症状**：
- 浏览器控制台显示：`VITE_GITHUB_TOKEN: ❌ 未设置`
- 网站提示：`GitHub Gist 未配置`

**解决**：
1. 进入 Secrets 设置页面
2. 点击 "New repository secret"
3. 添加 `VITE_GITHUB_TOKEN` 和 `VITE_GIST_ID`
4. 重新触发部署

#### 问题 2: Secret 名称错误

**症状**：
- 构建成功，但网站仍然提示未配置
- 检查日志发现环境变量未注入

**解决**：
1. 检查 Secret 名称是否完全匹配：
   - ✅ `VITE_GITHUB_TOKEN`（正确）
   - ❌ `GITHUB_TOKEN`（错误）
   - ❌ `VITE_GITHUB_TOKEN `（有空格，错误）
   - ❌ `vite_github_token`（大小写错误）

2. 删除错误的 Secret
3. 创建正确名称的 Secret
4. 重新部署

#### 问题 3: Token 权限不足

**症状**：
- 环境变量已注入
- 但 API 调用返回 403 错误

**解决**：
1. 确认 Token 有 `gist` 权限：
   - 访问 https://github.com/settings/tokens
   - 找到你的 Token
   - 检查权限范围，确保 ✅ `gist` 已勾选

2. 如果权限不足：
   - 删除旧 Token
   - 创建新 Token，**务必勾选 `gist` 权限**
   - 更新 `VITE_GITHUB_TOKEN` Secret
   - 重新部署

#### 问题 4: Token 已过期或被撤销

**症状**：
- API 调用返回 401 错误
- 提示 "Token 无效或已过期"

**解决**：
1. 检查 Token 状态：
   - 访问 https://github.com/settings/tokens
   - 查看 Token 是否还存在
   - 检查过期时间

2. 如果 Token 无效：
   - 重新生成 Token
   - 更新 `VITE_GITHUB_TOKEN` Secret
   - 重新部署

### 5. 验证修复

修复后，按以下步骤验证：

1. **触发重新部署**
   ```bash
   git commit --allow-empty -m "触发重新部署"
   git push origin master
   ```

2. **等待部署完成**
   - 进入 Actions 页面
   - 等待工作流完成（通常 2-3 分钟）

3. **测试网站**
   - 访问 `https://csuzhouyi.github.io`
   - 打开浏览器控制台（F12）
   - 应该看到：
     ```
     环境变量检查:
     - VITE_GIST_ID: 2a398a6...
     - VITE_GITHUB_TOKEN: ghp_1234...
     ```
   - 不应该看到 "未设置" 的错误

4. **测试功能**
   - 尝试添加一个链接
   - 应该能成功保存
   - 刷新页面，数据应该还在

## 调试技巧

### 在浏览器控制台检查

打开网站后，在浏览器控制台运行：

```javascript
// 检查环境变量
console.log('GIST_ID:', import.meta.env.VITE_GIST_ID ? '已设置' : '未设置')
console.log('GITHUB_TOKEN:', import.meta.env.VITE_GITHUB_TOKEN ? '已设置' : '未设置')
```

### 检查构建产物

如果怀疑环境变量未注入，可以检查构建产物：

1. 下载构建产物（Actions → Artifacts）
2. 解压后查看 `dist/index.html`
3. 搜索 `VITE_GITHUB_TOKEN`，应该能看到值（已混淆）

## 仍然无法解决？

如果以上步骤都无法解决问题，请提供：

1. **浏览器控制台的完整日志**
   - 截图或复制所有错误信息

2. **GitHub Actions 构建日志**
   - Actions → 最新的运行 → Build 步骤的日志

3. **Secrets 配置截图**
   - Settings → Secrets and variables → Actions
   - 显示 Secret 名称（**不要显示 Secret 值**）

4. **环境信息**
   - 本地环境：Windows/Mac/Linux
   - Node 版本
   - pnpm 版本
