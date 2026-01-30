# Vercel 快速部署指南（5分钟）

## 🚀 快速开始

### 第一步：访问 Vercel

1. 打开 https://vercel.com
2. 点击 **Sign Up**（注册）或 **Login**（登录）
3. 使用 **GitHub** 账号登录（推荐）

### 第二步：导入项目

1. 登录后，点击 **Add New Project**（添加新项目）
2. 在仓库列表中找到 `csuzhouyi/csuzhouyi.github.io`
3. 点击 **Import**（导入）

### 第三步：配置项目

Vercel 会自动识别 Vite 项目，保持默认配置即可：

- **Framework Preset**: `Vite` ✅（自动识别）
- **Root Directory**: `./` ✅（默认）
- **Build Command**: `pnpm run build` ✅（自动识别）
- **Output Directory**: `dist` ✅（自动识别）
- **Install Command**: `pnpm install` ✅（自动识别）

**不需要修改任何配置！**

### 第四步：配置环境变量

在部署前，点击 **Environment Variables**（环境变量）添加：

#### 必需的环境变量

1. **`SUPABASE_URL`**
   - **Value**: 你的 Supabase Project URL（例如：`https://xxxxxxxxxxxxx.supabase.co`）
   - **注意**: 不需要 `VITE_` 前缀（这是后端环境变量）
   - **获取方式**: Supabase 项目 → Settings → API → Project URL

2. **`SUPABASE_ANON_KEY`**
   - **Value**: 你的 Supabase anon public key
   - **注意**: 不需要 `VITE_` 前缀（这是后端环境变量）
   - **获取方式**: Supabase 项目 → Settings → API → anon public key

3. **`VITE_API_BASE_URL`**
   - **Value**: 先留空，部署后再更新为你的 Vercel 域名
   - **注意**: 需要 `VITE_` 前缀（这是前端环境变量）
   - **示例**: `https://your-project.vercel.app`

**重要**：在设置 Supabase 之前，请先完成 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 中的步骤！

#### 如何添加环境变量

1. 点击 **Environment Variables** 标签
2. 点击 **Add** 按钮
3. 输入 **Name** 和 **Value**
4. 选择环境（**Production**, **Preview**, **Development**）
   - 建议全部选择 ✅
5. 点击 **Save**

### 第五步：部署

1. 点击 **Deploy**（部署）按钮
2. 等待部署完成（通常 1-2 分钟）
3. 部署完成后，Vercel 会显示你的网站 URL
   - 格式：`https://csuzhouyi-github-io.vercel.app`
   - 或者：`https://csuzhouyi-github-io-xxxxx.vercel.app`

### 第六步：配置 API Base URL

部署完成后：

1. **复制你的 Vercel 域名**
   - 在部署页面可以看到
   - 例如：`https://csuzhouyi-github-io.vercel.app`

2. **更新环境变量**
   - 进入项目 **Settings** → **Environment Variables**
   - 找到 `VITE_API_BASE_URL`
   - 点击 **Edit**（编辑）
   - 更新 **Value** 为你的 Vercel 域名（例如：`https://csuzhouyi-github-io.vercel.app`）
   - **注意**: 只需要域名，不要加路径
   - 点击 **Save**

3. **重新部署**
   - 进入 **Deployments** 标签
   - 点击最新部署右侧的 **...** → **Redeploy**（重新部署）
   - 或者推送代码触发自动部署

### 第七步：验证

1. **访问网站**
   - 打开 Vercel 提供的域名
   - 应该能看到网站正常显示

2. **测试功能**
   - 进入 **云盘分享** 页面
   - 尝试添加链接
   - 应该能正常工作

3. **验证 Token 安全**
   - 右键 → 查看页面源代码
   - 搜索 `ghp_` 或 `GITHUB_TOKEN`
   - **不应该找到任何 Token** ✅

## ✅ 完成！

现在你的网站已经部署在 Vercel 上了！

### 自动部署

以后每次推送代码到 GitHub，Vercel 会自动：
- ✅ 检测到代码更新
- ✅ 自动构建和部署
- ✅ 更新网站

### 自定义域名（可选）

如果你想使用 `csuzhouyi.github.io` 域名：

1. 进入项目 **Settings** → **Domains**
2. 点击 **Add Domain**
3. 输入：`csuzhouyi.github.io`
4. 按照提示配置 DNS（如果需要）

## 🆘 遇到问题？

### 问题：部署失败

**检查**：
- ✅ 环境变量是否正确配置
- ✅ `GITHUB_TOKEN` 是否有 `gist` 权限
- ✅ `VITE_GIST_ID` 是否正确

### 问题：添加链接失败

**检查**：
- ✅ `VITE_API_BASE_URL` 是否已配置
- ✅ `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 是否正确
- ✅ Supabase 数据库表是否已创建
- ✅ 是否已重新部署
- ✅ 浏览器控制台是否有错误

### 问题：数据库连接失败

**检查**：
- ✅ Supabase 项目是否正常运行
- ✅ RLS 策略是否正确配置（允许公开访问）
- ✅ API 密钥是否正确

## 📚 更多信息

- 详细迁移指南：查看 `MIGRATE_TO_VERCEL.md`
- Vercel 文档：https://vercel.com/docs
