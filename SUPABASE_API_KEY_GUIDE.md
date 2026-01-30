# Supabase API 密钥获取详细指南

## 📍 如何找到 API 密钥

### 方法一：通过 Settings → API（推荐）

1. **登录 Supabase**
   - 访问 https://supabase.com
   - 登录你的账号

2. **进入项目**
   - 在项目列表中，点击你的项目

3. **打开设置**
   - 在左侧菜单栏，找到并点击 **Settings**（设置）图标
   - 图标通常是一个齿轮 ⚙️

4. **进入 API 页面**
   - 在设置菜单中，点击 **API**（API）
   - 或者直接访问：`https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api`

5. **找到 Project URL**
   - 在页面顶部，你会看到 **Project URL**
   - 格式：`https://xxxxxxxxxxxxx.supabase.co`
   - 点击右侧的复制按钮 📋
   - **这就是 `SUPABASE_URL`**

6. **找到 API Keys**
   - 向下滚动，找到 **Project API keys** 部分
   - 你会看到一个表格，包含以下列：
     - **Name**（名称）
     - **Key**（密钥）
     - **Actions**（操作）

7. **复制 anon public key**
   - 在表格中找到 **Name** 为 **`anon`** 或 **`anon public`** 的行
   - 在 **Key** 列中，你会看到密钥（可能被隐藏为 `••••••••`）
   - 如果被隐藏，点击右侧的 **Reveal**（显示）按钮
   - 或者点击 **Copy**（复制）按钮直接复制
   - **这就是 `SUPABASE_ANON_KEY`**

### 方法二：通过项目概览页面

1. **进入项目概览**
   - 登录后，直接进入你的项目

2. **查看项目信息**
   - 在项目概览页面，通常会显示项目的基本信息
   - 查找 **API** 或 **Settings** 链接

3. **按照方法一的步骤继续**

### 方法三：直接访问 API 设置页面

如果你知道项目 ID：
- 直接访问：`https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api`
- 替换 `YOUR_PROJECT_ID` 为你的实际项目 ID

## 🔍 如果仍然找不到

### 检查清单

- [ ] 确保你已经创建了 Supabase 项目
- [ ] 确保你登录的是正确的账号
- [ ] 确保你在正确的项目中
- [ ] 尝试刷新页面（F5 或 Ctrl+R）
- [ ] 检查浏览器控制台是否有错误
- [ ] 尝试使用不同的浏览器

### 界面可能的变化

Supabase 界面可能会更新，但 API 密钥通常会在以下位置之一：

1. **Settings** → **API** → **Project API keys**
2. **Project Settings** → **API**
3. **Settings** → **General** → **API Settings**

### 密钥的特征

**`anon public` key 的特征：**
- Name 通常显示为 `anon` 或 `anon public`
- Key 以 `eyJ` 开头（JWT token 格式）
- 长度很长（通常 200+ 字符）
- 在表格中通常位于最上方

**不要使用 `service_role` key：**
- 这个密钥权限太高
- 只能在服务器端使用
- 如果泄露会有安全风险

## 📸 参考截图位置

在 Supabase 界面中，API 密钥通常显示为：

```
Project API keys
┌─────────────┬──────────────────────────────────────────┬─────────┐
│ Name        │ Key                                       │ Actions │
├─────────────┼──────────────────────────────────────────┼─────────┤
│ anon        │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ [Reveal]│
│ service_role│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ [Reveal]│
└─────────────┴──────────────────────────────────────────┴─────────┘
```

你需要的是 **`anon`** 这一行的密钥。

## 🆘 仍然无法找到？

如果按照以上步骤仍然找不到，可以：

1. **查看 Supabase 文档**
   - https://supabase.com/docs/guides/api
   - 搜索 "API keys" 或 "anon key"

2. **联系 Supabase 支持**
   - 在 Supabase 网站底部找到 "Support" 链接
   - 或者在 Discord 社区寻求帮助

3. **检查项目状态**
   - 确保项目已完全创建
   - 检查项目是否处于暂停状态

## ✅ 找到后

找到 API 密钥后，请按照 `SUPABASE_SETUP.md` 中的步骤配置 Vercel 环境变量。
