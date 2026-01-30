# GitHub Gists 数据存储配置指南

## 为什么需要这个？

由于 GitHub Pages 是静态网站，没有后端服务器，要实现多人共享的全局数据（如下载统计），需要使用外部存储服务。

本方案使用 **GitHub Gists API** 作为免费的数据存储后端，具有以下优势：
- ✅ 完全免费
- ✅ 无需额外服务
- ✅ 与 GitHub 生态集成
- ✅ 支持多人访问和更新
- ✅ 数据持久化存储

## 配置步骤

### 1. 创建 GitHub Personal Access Token

#### 详细步骤：

1. **登录 GitHub 账号**
   - 访问 https://github.com 并登录

2. **进入设置页面**
   - 点击右上角头像
   - 在下拉菜单中选择 **Settings**（设置）

3. **进入开发者设置**
   - 在左侧菜单最下方找到 **Developer settings**
   - 点击进入

4. **创建 Token**
   - 在左侧菜单选择 **Personal access tokens**
   - 选择 **Tokens (classic)**（经典版本）
   - 点击 **Generate new token**（生成新令牌）
   - 选择 **Generate new token (classic)**（生成经典令牌）

5. **填写 Token 信息**
   - **Note**（备注）：填写描述，例如 `Cloud Share Storage` 或 `网盘分享站数据存储`
   - **Expiration**（过期时间）：
     - 选择 `No expiration`（永不过期）或
     - 选择较长时间，如 `90 days`（90天）或 `1 year`（1年）
   - **Select scopes**（选择权限）：
     - ✅ **只勾选 `gist`**（这是唯一需要的权限）
     - ❌ 不要勾选其他权限（为了安全）

6. **生成 Token**
   - 滚动到页面底部
   - 点击 **Generate token**（生成令牌）按钮

7. **复制并保存 Token**
   - ⚠️ **非常重要**：Token 只显示一次，请立即复制保存
   - Token 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 建议保存到安全的地方（如密码管理器）

#### 如果找不到设置选项？

- 确保已登录 GitHub 账号
- 如果使用中文界面，菜单名称可能是：
  - Settings → 设置
  - Developer settings → 开发者设置
  - Personal access tokens → 个人访问令牌

### 2. 配置环境变量

#### 方法一：使用 .env 文件（推荐用于本地开发）

1. 复制 `.env.example` 文件为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 Token：
   ```env
   VITE_GITHUB_TOKEN=你的GitHub_Token
   VITE_GIST_ID=
   ```

3. **重要**：将 `.env` 添加到 `.gitignore`，不要提交到仓库！

#### 方法二：使用 GitHub Pages 环境变量（用于生产环境）

由于 GitHub Pages 是静态网站，无法直接使用环境变量。有以下几种方案：

**方案 A：使用 GitHub Secrets + GitHub Actions（推荐）**

1. 在仓库的 **Settings** > **Secrets and variables** > **Actions**
2. 点击 **New repository secret**
3. 添加以下 Secrets：
   - `GITHUB_TOKEN`: 你的 Personal Access Token
   - `GIST_ID`: （可选，首次会自动创建）

4. 修改 `.github/workflows/deploy.yml`，在构建时注入环境变量：
   ```yaml
   - name: Build
     run: pnpm run build
     env:
       VITE_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
       VITE_GIST_ID: ${{ secrets.GIST_ID }}
   ```

**方案 B：使用客户端配置页面**

创建一个配置页面，让用户输入 Token（存储在 localStorage），但这种方式安全性较低。

**方案 C：使用公开的 Gist（不推荐）**

如果数据不需要保密，可以使用公开的 Gist，但这样任何人都可以访问和修改数据。

### 3. 手动创建 Gist 并获取 GIST_ID

#### 步骤一：创建 Gist

1. **访问 GitHub Gists**：
   - 登录 GitHub
   - 访问 https://gist.github.com
   - 或者点击右上角头像 > **Your gists**

2. **创建新的 Gist**：
   - 点击页面右上角的 **+** 或 **New gist** 按钮
   - **Filename**（文件名）：输入 `cloud-share-data.json`
   - **Description**（描述）：输入 `网盘链接分享数据`
   - **Content**（内容）：输入以下初始内容：
     ```json
     {
       "links": [],
       "lastUpdate": null,
       "version": "1.0.0"
     }
     ```
   - **选择可见性**：建议选择 **Create secret gist**（创建私密 Gist）
   - 点击 **Create secret gist** 或 **Create public gist**

3. **获取 GIST_ID**：
   - 创建成功后，查看浏览器地址栏
   - URL 格式为：`https://gist.github.com/用户名/GIST_ID`
   - 例如：`https://gist.github.com/csuzhouyi/abc123def456789...`
   - `abc123def456789...` 就是你的 GIST_ID（通常是一串 32 位的字符串）

#### 方法二：从已有 Gist 获取 ID

如果你已经有 Gist，可以通过以下方式查看 ID：

1. **访问 GitHub Gists**：
   - 登录 GitHub
   - 访问 https://gist.github.com
   - 或者点击右上角头像 > **Your gists**

2. **找到你的 Gist**：
   - 查找名为 "网盘链接分享数据" 的 Gist
   - 或者查找包含 `cloud-share-data.json` 文件的 Gist

3. **获取 GIST_ID**：
   - 打开 Gist 页面
   - 查看浏览器地址栏，URL 格式为：`https://gist.github.com/用户名/GIST_ID`
   - 例如：`https://gist.github.com/csuzhouyi/abc123def456...`
   - `abc123def456...` 就是你的 GIST_ID

#### 方法三：通过 API 查看

如果你有多个 Gist，可以通过 API 查看：

1. 访问：`https://api.github.com/gists`
2. 在请求头中添加：`Authorization: token 你的Token`
3. 查找 `description` 为 "网盘链接分享数据" 的 Gist
4. 复制该 Gist 的 `id` 字段

### 4. 配置 GIST_ID

获取到 GIST_ID 后：

1. **本地开发**：更新 `.env` 文件
   ```env
   VITE_GITHUB_TOKEN=你的Token
   VITE_GIST_ID=你的GIST_ID
   ```

2. **生产环境**：更新 GitHub Secrets
   - 仓库 Settings > Secrets and variables > Actions
   - 添加或更新 `GIST_ID` Secret

### 5. 配置完成后的使用流程

1. **确保已配置**：
   - ✅ 已创建 GitHub Personal Access Token
   - ✅ 已手动创建 Gist 并获取 GIST_ID
   - ✅ 已在 `.env` 文件或 GitHub Secrets 中配置了 `VITE_GITHUB_TOKEN` 和 `VITE_GIST_ID`

2. **启动项目**：
   - 运行 `pnpm run dev` 启动开发服务器
   - 或部署到 GitHub Pages

3. **使用功能**：
   - 添加链接会自动保存到 GitHub Gist
   - 所有用户共享同一份数据
   - 下载统计会实时更新

## 工作原理

1. **读取数据**：从 GitHub Gists API 获取数据
2. **保存数据**：通过 GitHub Gists API 更新数据
3. **下载统计**：每次下载时更新 Gist 中的计数
4. **降级方案**：如果 API 失败，自动回退到本地存储

## 数据格式

Gist 中存储的 JSON 格式：
```json
{
  "links": [
    {
      "id": 1234567890,
      "name": "链接名称",
      "url": "https://example.com",
      "code": "提取码",
      "description": "描述",
      "tags": ["标签1", "标签2"],
      "downloadCount": 0,
      "createTime": "2024-01-01 12:00:00"
    }
  ],
  "lastUpdate": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

## 注意事项

1. **Token 安全**：
   - 不要将 Token 提交到公开仓库
   - Token 只需要 `gist` 权限即可
   - 定期更换 Token

2. **API 限制**：
   - GitHub API 有速率限制（未认证：60次/小时，认证：5000次/小时）
   - 对于正常使用，这个限制足够

3. **数据备份**：
   - 系统会自动在本地存储备份
   - 建议定期导出数据

4. **多人协作**：
   - 如果多人同时修改，最后保存的会覆盖之前的
   - 建议添加冲突检测机制（高级功能）

## 故障排除

### 问题：无法加载数据
- 检查 Token 是否正确配置
- 检查 Token 是否有 `gist` 权限
- 查看浏览器控制台的错误信息

### 问题：无法保存数据
- 检查 Token 是否过期
- 检查网络连接
- 系统会自动回退到本地存储

### 问题：统计不准确
- 确保所有用户都使用相同的 Gist ID
- 检查 API 调用是否成功

## 替代方案

如果不想使用 GitHub Gists，可以考虑：

1. **Firebase**：Google 的免费 BaaS 服务
2. **Supabase**：开源的 Firebase 替代品
3. **Airtable**：表格数据库服务
4. **JSONBin.io**：免费的 JSON 存储服务

这些服务通常需要注册账号，但提供更好的功能和更简单的配置。
