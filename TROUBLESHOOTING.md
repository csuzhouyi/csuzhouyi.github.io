# 故障排查指南

## 错误：GitHub Token 无效或已过期 (401)

### 问题症状
- 控制台显示：`保存数据失败: Error: GitHub Token 无效或已过期`
- API 返回状态码：401 Unauthorized

### 解决步骤

#### 1. 检查 .env 文件

确认 `.env` 文件存在且包含正确的配置：

```env
VITE_GITHUB_TOKEN=ghp_你的Token
VITE_GIST_ID=你的GIST_ID
```

**检查要点**：
- ✅ Token 以 `ghp_` 开头
- ✅ Token 没有多余的空格或引号
- ✅ 文件位于项目根目录（与 `package.json` 同级）

#### 2. 验证 Token 是否有效

**方法一：在浏览器控制台测试**

打开浏览器控制台（F12），运行：

```javascript
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
.then(user => console.log('用户信息:', user.login))
.catch(e => console.error('失败:', e))
```

- **200 OK**：Token 有效 ✅
- **401 Unauthorized**：Token 无效或过期 ❌

**方法二：使用 curl 测试**

```bash
curl -H "Authorization: Bearer 你的Token" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user
```

#### 3. 重新生成 Token

如果 Token 无效，需要重新生成：

1. **访问 Token 设置页面**
   - https://github.com/settings/tokens
   - 或：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **删除旧 Token**（如果存在）
   - 找到对应的 Token
   - 点击 **Delete** 或 **Revoke**

3. **创建新 Token**
   - 点击 **Generate new token** → **Generate new token (classic)**
   - **Note**: 填写描述，如 `Cloud Share Storage`
   - **Expiration**: 选择过期时间（建议选择较长时间或 `No expiration`）
   - **Select scopes**: ✅ 勾选 `gist` 权限
   - 点击 **Generate token**

4. **复制新 Token**
   - ⚠️ Token 只显示一次，立即复制
   - 格式：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. **更新 .env 文件**
   ```env
   VITE_GITHUB_TOKEN=ghp_新Token
   VITE_GIST_ID=你的GIST_ID
   ```

6. **重启开发服务器**
   ```bash
   # 停止当前服务器（Ctrl+C）
   # 重新启动
   pnpm run dev
   ```

#### 4. 检查 Token 权限

确保 Token 有 `gist` 权限：

1. 访问 https://github.com/settings/tokens
2. 找到你的 Token
3. 检查权限范围（Scopes）
4. 确保 ✅ `gist` 已勾选

如果没有 `gist` 权限：
- 删除旧 Token
- 重新创建 Token，**务必勾选 `gist` 权限**

#### 5. 检查 Token 格式

**正确格式**：
```
ghp_1234567890abcdefghijklmnopqrstuvwxyzABCDEF
```

**常见错误**：
- ❌ 缺少 `ghp_` 前缀
- ❌ 包含多余的空格
- ❌ 包含引号（如 `"ghp_xxx"`）
- ❌ Token 被截断

#### 6. 确认环境变量已加载

打开浏览器控制台，查看是否有以下日志：

```
环境变量检查:
- VITE_GIST_ID: 2a398a6...
- VITE_GITHUB_TOKEN: ghp_1234...
```

如果显示 `未设置`，说明环境变量未正确加载。

**解决方法**：
1. 确认 `.env` 文件在项目根目录
2. 确认文件内容正确
3. **重启开发服务器**（重要！）

### 常见问题

#### Q: 为什么修改 .env 后还是不行？

A: Vite 只在启动时读取 `.env` 文件。修改后必须：
1. 停止开发服务器（Ctrl+C）
2. 重新运行 `pnpm run dev`

#### Q: 生产环境（GitHub Pages）怎么办？

A: GitHub Pages 无法读取 `.env` 文件，需要使用 GitHub Secrets：

1. 仓库 Settings → Secrets and variables → Actions
2. 添加 `GITHUB_TOKEN` Secret（值为你的 Token）
3. 添加 `GIST_ID` Secret（值为你的 GIST_ID）
4. 代码已配置在 `.github/workflows/deploy.yml` 中自动注入

#### Q: Token 格式正确但还是 401？

A: 可能的原因：
1. Token 已过期（检查过期时间）
2. Token 被撤销（检查 Token 列表）
3. Token 没有 `gist` 权限
4. 环境变量未正确加载（重启服务器）

### 验证修复

修复后，测试步骤：

1. 重启开发服务器
2. 打开浏览器控制台
3. 尝试添加一个链接
4. 查看控制台日志：
   - ✅ 应该看到 `Gist 获取成功`
   - ✅ 应该看到 `数据保存成功`
   - ❌ 不应该看到 401 错误

### 仍然无法解决？

如果以上步骤都无法解决问题，请提供以下信息：

1. 浏览器控制台的完整错误信息
2. Network 标签中 API 请求的详细信息
3. `.env` 文件内容（**隐藏 Token，只显示前8位**）
4. Token 的创建时间和过期时间
