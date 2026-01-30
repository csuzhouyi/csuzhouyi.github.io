# 修复 401 Bad credentials 错误

## 错误信息
```
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest",
  "status": "401"
}
```

## 问题原因

"Bad credentials" 表示 GitHub API 无法验证你的 Token。可能的原因：

1. ✅ Token 已过期
2. ✅ Token 被撤销
3. ✅ Token 格式错误（包含空格、换行等）
4. ✅ Token 没有正确的权限

## 解决步骤

### 步骤 1: 检查当前 Token 状态

1. **访问 Token 设置页面**
   ```
   https://github.com/settings/tokens
   ```

2. **查找你的 Token**
   - 查找以 `ghp_roMX` 开头的 Token
   - 检查状态：
     - ✅ Active（活跃）
     - ❌ Expired（已过期）
     - ❌ Revoked（已撤销）

3. **检查权限**
   - 点击 Token 查看详情
   - 确认 ✅ `gist` 权限已勾选

### 步骤 2: 重新生成 Token（推荐）

如果 Token 已过期、被撤销或权限不足：

1. **删除旧 Token**（如果存在）
   - 在 Token 列表中找到旧 Token
   - 点击 **Delete** 或 **Revoke**

2. **创建新 Token**
   - 点击 **Generate new token** → **Generate new token (classic)**
   - **Note**: `Cloud Share Storage - Production`
   - **Expiration**: 
     - 选择 `No expiration`（推荐）或
     - 选择较长时间，如 `1 year`
   - **Select scopes**: ✅ **只勾选 `gist`**
   - 点击 **Generate token**

3. **复制新 Token**
   - ⚠️ **重要**：Token 只显示一次
   - 立即复制完整的 Token（格式：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
   - 保存到安全的地方

### 步骤 3: 更新 GitHub Secret

1. **进入 Secrets 设置**
   ```
   https://github.com/csuzhouyi/csuzhouyi.github.io/settings/secrets/actions
   ```

2. **更新 VITE_GITHUB_TOKEN**
   - 找到 `VITE_GITHUB_TOKEN` Secret
   - 点击 **Update**（更新）
   - 粘贴新 Token
   - ⚠️ **注意**：
     - 不要有多余的空格
     - 不要有换行
     - 确保完整复制（通常 40+ 个字符）
   - 点击 **Update secret**

### 步骤 4: 验证 Token（可选但推荐）

在更新 Secret 之前，可以先测试 Token 是否有效：

在浏览器控制台运行：

```javascript
const TOKEN = '你的新Token' // 替换为实际 Token

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
.then(user => {
  console.log('✅ Token 有效！')
  console.log('用户:', user.login)
})
.catch(e => {
  console.error('❌ Token 无效:', e)
})
```

- ✅ 如果返回 200 和用户信息 → Token 有效
- ❌ 如果返回 401 → Token 仍然无效，检查格式

### 步骤 5: 重新触发部署

更新 Secret 后，需要重新触发部署：

**方法一：推送空提交**
```bash
git commit --allow-empty -m "更新 GitHub Token"
git push origin master
```

**方法二：手动触发**
1. 进入 **Actions** 标签
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow**
4. 选择 `master` 分支
5. 点击 **Run workflow**

### 步骤 6: 等待部署完成

1. **查看部署进度**
   - 进入 **Actions** 标签
   - 查看最新的工作流运行
   - 等待所有步骤完成（通常 2-3 分钟）

2. **验证修复**
   - 访问 `https://csuzhouyi.github.io`
   - 打开浏览器控制台（F12）
   - 应该看到：
     ```
     Gist 获取成功: 网盘链接分享数据
     数据加载成功，链接数量: X
     ```
   - 不应该再看到 401 错误

## 常见问题

### Q: 更新 Secret 后还是 401？

**A: 检查以下几点：**
1. Secret 名称是否正确：`VITE_GITHUB_TOKEN`（区分大小写）
2. Token 是否完整复制（没有截断）
3. Token 是否包含多余的空格或换行
4. 是否已重新触发部署

### Q: Token 格式正确但还是无效？

**A: 可能的原因：**
1. Token 已过期（检查过期时间）
2. Token 被撤销（检查 Token 状态）
3. Token 没有 `gist` 权限（重新生成时确保勾选）

### Q: 如何确认 Token 有 gist 权限？

**A:**
1. 访问 https://github.com/settings/tokens
2. 找到你的 Token
3. 查看权限范围（Scopes）
4. 确认 ✅ `gist` 已勾选

如果没有 `gist` 权限：
- 删除旧 Token
- 重新创建，**务必勾选 `gist` 权限**

## 预防措施

为了避免将来再次出现此问题：

1. **设置较长的过期时间**
   - 创建 Token 时选择 `No expiration` 或较长时间

2. **定期检查 Token 状态**
   - 每月检查一次 Token 是否仍然有效

3. **使用描述性名称**
   - Token 的 Note 字段使用清晰的描述，便于识别

4. **保存 Token 备份**
   - 将 Token 保存到密码管理器（安全的地方）
   - 如果 Token 丢失，需要重新生成

## 总结

修复 401 错误的步骤：
1. ✅ 检查 Token 状态
2. ✅ 重新生成 Token（确保有 gist 权限）
3. ✅ 更新 GitHub Secret
4. ✅ 重新触发部署
5. ✅ 验证修复

完成这些步骤后，401 错误应该就会解决。
