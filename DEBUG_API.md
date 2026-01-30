# GitHub Gists API 调试指南

## 常见状态码及解决方案

### 200 OK ✅
- **含义**：请求成功
- **处理**：正常，数据会正常加载

### 401 Unauthorized ❌
- **含义**：认证失败
- **可能原因**：
  1. Token 无效或已过期
  2. Token 格式错误
  3. Token 未正确配置
- **解决方案**：
  1. 检查 `.env` 文件中的 `VITE_GITHUB_TOKEN` 是否正确
  2. 确认 Token 格式为 `ghp_xxxxxxxxxxxxx`
  3. 重新生成 Token：
     - 访问 https://github.com/settings/tokens
     - 删除旧 Token，创建新 Token
     - 确保勾选了 `gist` 权限

### 403 Forbidden ❌
- **含义**：权限不足
- **可能原因**：
  1. Token 没有 `gist` 权限
  2. Token 权限范围不足
- **解决方案**：
  1. 检查 Token 权限：
     - 访问 https://github.com/settings/tokens
     - 找到你的 Token，检查权限范围
     - 确保勾选了 `gist` 权限
  2. 如果权限不足，重新创建 Token 并勾选 `gist` 权限

### 404 Not Found ❌
- **含义**：Gist 不存在
- **可能原因**：
  1. GIST_ID 错误
  2. Gist 已被删除
  3. Gist 是私有的，但 Token 没有访问权限
- **解决方案**：
  1. 检查 `.env` 文件中的 `VITE_GIST_ID` 是否正确
  2. 访问 https://gist.github.com 确认 Gist 是否存在
  3. 确认 Gist 的可见性设置
  4. 如果 Gist 不存在，按照文档手动创建一个

### 422 Unprocessable Entity ❌
- **含义**：请求格式错误
- **可能原因**：数据格式不正确
- **解决方案**：检查数据格式，确保 JSON 有效

## 调试步骤

### 1. 检查环境变量

打开浏览器控制台（F12），查看是否有以下日志：
- `GitHub Gist 未配置，使用本地存储` - 说明环境变量未正确加载
- `正在获取 Gist 数据，GIST_ID: xxx` - 说明正在尝试调用 API

### 2. 检查 Token 格式

Token 应该以 `ghp_` 开头，例如：
```
ghp_1234567890abcdefghijklmnopqrstuvwxyzABCDEF
```

### 3. 测试 API 调用

在浏览器控制台运行以下代码测试：

```javascript
// 替换为你的实际值
const GIST_ID = '你的GIST_ID'
const GITHUB_TOKEN = '你的Token'

fetch(`https://api.github.com/gists/${GIST_ID}`, {
  headers: {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
})
.then(response => {
  console.log('状态码:', response.status)
  console.log('状态文本:', response.statusText)
  return response.json()
})
.then(data => console.log('数据:', data))
.catch(error => console.error('错误:', error))
```

### 4. 检查网络请求

1. 打开浏览器开发者工具（F12）
2. 进入 **Network**（网络）标签
3. 刷新页面或执行操作
4. 查找对 `api.github.com/gists` 的请求
5. 查看：
   - **Status**：状态码
   - **Headers**：请求头（检查 Authorization）
   - **Response**：响应内容

### 5. 验证 Gist 存在

访问以下 URL（替换为你的 GIST_ID）：
```
https://gist.github.com/你的用户名/GIST_ID
```

如果页面显示 404，说明 Gist 不存在或 ID 错误。

## 常见问题排查

### 问题：环境变量未生效

**原因**：Vite 需要重启开发服务器才能读取新的环境变量

**解决**：
1. 停止开发服务器（Ctrl+C）
2. 重新运行 `pnpm run dev`

### 问题：生产环境无法使用

**原因**：GitHub Pages 是静态网站，无法读取 `.env` 文件

**解决**：
1. 使用 GitHub Secrets 配置环境变量
2. 在 `.github/workflows/deploy.yml` 中注入环境变量
3. 重新部署

### 问题：CORS 错误

**原因**：GitHub API 支持 CORS，不应该出现此错误

**解决**：如果出现 CORS 错误，检查：
1. 请求 URL 是否正确
2. 请求方法是否正确
3. 浏览器控制台是否有其他错误

## 获取帮助

如果以上方法都无法解决问题：

1. **查看浏览器控制台**：检查完整的错误信息
2. **查看 Network 标签**：检查实际的 API 请求和响应
3. **检查 GitHub Token**：确认 Token 有效且有正确权限
4. **检查 Gist**：确认 Gist 存在且可访问

## 测试 API 的工具

可以使用以下工具测试 API：

1. **Postman**：https://www.postman.com/
2. **curl**：命令行工具
3. **浏览器控制台**：直接运行 fetch 代码

### 使用 curl 测试

```bash
curl -H "Authorization: Bearer 你的Token" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/gists/你的GIST_ID
```
