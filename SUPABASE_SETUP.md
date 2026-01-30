# Supabase 数据库设置指南

本项目使用 **Supabase**（PostgreSQL）作为数据库，完全替代 GitHub Gists。

## 🎯 为什么选择 Supabase？

- ✅ **完全免费**：500MB 数据库，足够个人项目使用
- ✅ **PostgreSQL**：强大的关系型数据库
- ✅ **REST API**：开箱即用的 API，无需编写后端代码
- ✅ **实时功能**：支持实时数据同步（可选）
- ✅ **易于使用**：简单的 Web 界面，无需 SQL 知识

## 📋 设置步骤

### 第一步：创建 Supabase 项目

1. **访问 Supabase**
   - 打开 https://supabase.com
   - 点击 **Start your project**（开始你的项目）
   - 使用 GitHub 账号登录（推荐）

2. **创建新项目**
   - 点击 **New Project**（新建项目）
   - 填写项目信息：
     - **Name**: `cloud-share`（或任意名称）
     - **Database Password**: 设置一个强密码（**请记住这个密码！**）
     - **Region**: 选择离你最近的区域（如 `Southeast Asia (Singapore)`）
   - 点击 **Create new project**（创建新项目）
   - 等待项目创建完成（通常需要 1-2 分钟）

### 第二步：创建数据表

1. **进入 SQL Editor**
   - 在左侧菜单中，点击 **SQL Editor**（SQL 编辑器）

2. **创建 `links` 表**
   - 点击 **New query**（新建查询）
   - 复制并粘贴以下 SQL 代码：

```sql
-- 创建 links 表
CREATE TABLE IF NOT EXISTS links (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  code TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  download_count INTEGER DEFAULT 0,
  create_time TIMESTAMPTZ DEFAULT NOW(),
  update_time TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_links_create_time ON links(create_time DESC);
CREATE INDEX IF NOT EXISTS idx_links_tags ON links USING GIN(tags);

-- 启用 Row Level Security (RLS)
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取和写入（公开访问）
CREATE POLICY "Allow public read access" ON links
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON links
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON links
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON links
  FOR DELETE USING (true);
```

3. **执行 SQL**
   - 点击 **Run**（运行）按钮
   - 应该看到 "Success. No rows returned"（成功，无返回行）

### 第三步：获取 API 密钥

1. **进入项目设置**
   - 在左侧菜单中，点击 **Settings**（设置）图标（齿轮图标）
   - 在设置菜单中，点击 **API**（API）

2. **找到 Project URL**
   - 在页面顶部，找到 **Project URL** 部分
   - 格式：`https://xxxxxxxxxxxxx.supabase.co`
   - 点击复制按钮或手动复制这个 URL
   - **这就是 `SUPABASE_URL`**

3. **找到 API Keys**
   - 向下滚动，找到 **Project API keys** 部分
   - 你会看到几个密钥：
     - **`anon` `public`** - 这是我们要用的（匿名公钥）
     - **`service_role` `secret`** - 不要使用这个（服务端密钥，权限太高）
   
4. **复制 anon public key**
   - 找到 **`anon` `public`** 这一行
   - 如果密钥被隐藏（显示为 `••••••••`），点击右侧的 **Reveal**（显示）按钮
   - 或者直接点击密钥右侧的 **复制图标**（📋）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **这就是 `SUPABASE_ANON_KEY`**

**如果找不到 `anon public` key：**
- 确保你在 **Settings** → **API** 页面
- 检查页面是否完全加载
- 尝试刷新页面
- 如果仍然找不到，可能是 Supabase 界面更新了，可以尝试：
  - 在 **Project API keys** 部分查找任何包含 "anon" 或 "public" 的密钥
  - 或者查找标签为 "anon" 的密钥（通常是最上面的一个）

### 第四步：配置 Vercel 环境变量

1. **进入 Vercel 项目设置**
   - 访问 https://vercel.com
   - 进入你的项目
   - 点击 **Settings**（设置）→ **Environment Variables**（环境变量）

2. **添加环境变量**
   
   - **`SUPABASE_URL`**
     - **Value**: 你的 Supabase Project URL
     - **Environment**: Production, Preview, Development（全部选择）
   
   - **`SUPABASE_ANON_KEY`**
     - **Value**: 你的 Supabase anon public key
     - **Environment**: Production, Preview, Development（全部选择）
   
   - **`VITE_API_BASE_URL`**
     - **Value**: 你的 Vercel 域名（例如：`https://your-project.vercel.app`）
     - **Environment**: Production, Preview, Development（全部选择）
     - **注意**: 部署后会自动生成，需要更新这个值

3. **保存并重新部署**
   - 点击 **Save**（保存）
   - 进入 **Deployments**（部署）标签
   - 点击最新部署的 **...** → **Redeploy**（重新部署）

### 第五步：验证设置

1. **测试 API**
   - 部署完成后，访问你的网站
   - 进入 **云盘分享** 页面
   - 尝试添加一个链接
   - 应该能正常工作

2. **检查数据库**
   - 回到 Supabase 项目
   - 点击 **Table Editor**（表编辑器）
   - 选择 `links` 表
   - 应该能看到你添加的链接

## 📊 数据表结构

### `links` 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | BIGSERIAL | 主键，自动递增 |
| `name` | TEXT | 链接名称（必填） |
| `url` | TEXT | 链接地址（必填） |
| `code` | TEXT | 提取码（可选） |
| `description` | TEXT | 描述（可选） |
| `tags` | JSONB | 标签数组（JSON 格式） |
| `download_count` | INTEGER | 下载次数（默认 0） |
| `create_time` | TIMESTAMPTZ | 创建时间（自动） |
| `update_time` | TIMESTAMPTZ | 更新时间（自动） |

## 🔒 安全说明

### Row Level Security (RLS)

本项目使用 **公开访问策略**，这意味着：
- ✅ 任何人都可以读取数据（查看链接）
- ✅ 任何人都可以添加、编辑、删除数据

**如果你需要限制访问**，可以修改 RLS 策略：

```sql
-- 删除公开策略
DROP POLICY IF EXISTS "Allow public read access" ON links;
DROP POLICY IF EXISTS "Allow public insert access" ON links;
DROP POLICY IF EXISTS "Allow public update access" ON links;
DROP POLICY IF EXISTS "Allow public delete access" ON links;

-- 创建仅读取策略（只允许读取，不允许写入）
CREATE POLICY "Allow public read only" ON links
  FOR SELECT USING (true);
```

### API 密钥安全

- ✅ `anon public` key 可以安全地暴露在客户端
- ✅ 它只能访问 RLS 策略允许的数据
- ✅ 如果需要更严格的权限控制，可以使用 `service_role` key（但必须在服务器端使用）

## 🆘 常见问题

### Q: 如何备份数据？

A: 在 Supabase 项目中：
1. 进入 **Settings** → **Database**
2. 点击 **Backups**（备份）
3. Supabase 自动每天备份，也可以手动创建备份

### Q: 如何导出数据？

A: 在 Supabase 项目中：
1. 进入 **Table Editor**
2. 选择 `links` 表
3. 点击 **Export**（导出）按钮
4. 选择导出格式（CSV、JSON 等）

### Q: 免费额度够用吗？

A: 对于个人项目，完全够用：
- **数据库大小**: 500MB（可以存储大量链接）
- **API 请求**: 无限制（但有速率限制）
- **带宽**: 2GB/月（通常足够）

### Q: 如何迁移现有数据？

A: 如果你之前使用 GitHub Gists：
1. 导出 Gist 中的数据（JSON 格式）
2. 在 Supabase 的 **Table Editor** 中手动添加
3. 或者编写一个迁移脚本（使用 Supabase API）

## 📚 更多资源

- Supabase 文档：https://supabase.com/docs
- PostgreSQL 文档：https://www.postgresql.org/docs/
- Supabase REST API：https://supabase.com/docs/reference/javascript/introduction

## ✅ 完成！

现在你的项目已经完全使用 Supabase 作为数据库，不再依赖 GitHub Gists！
