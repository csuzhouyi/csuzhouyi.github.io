<template>
  <div class="about">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>关于本站</span>
        </div>
      </template>
      
      <div class="about-content">
        <el-icon class="about-icon"><InfoFilled /></el-icon>
        <h2>资源分享站</h2>
        <p class="version">版本: 1.0.0</p>
        
        <el-divider />
        
        <h3>功能介绍</h3>
        <ul class="feature-list">
          <li>📦 网盘链接管理：添加、编辑、删除网盘链接</li>
          <li>🔍 快速检索：支持按名称、描述、标签搜索</li>
          <li>📊 下载统计：实时统计每个链接的下载次数</li>
          <li>🏷️ 标签分类：使用标签对链接进行分类管理</li>
          <li>💾 本地存储：数据保存在浏览器本地存储中</li>
        </ul>
        
        <el-divider />
        
        <h3>技术栈</h3>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-card shadow="hover" class="tech-card">
              <h4>Vue 3</h4>
              <p>渐进式 JavaScript 框架</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card shadow="hover" class="tech-card">
              <h4>Element Plus</h4>
              <p>基于 Vue 3 的组件库</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card shadow="hover" class="tech-card">
              <h4>Vue Router</h4>
              <p>Vue.js 官方路由管理器</p>
            </el-card>
          </el-col>
        </el-row>
        
        <el-divider />
        
        <h3>使用说明</h3>
        <el-steps direction="vertical" :active="3">
          <el-step title="添加链接" description='点击"添加链接"按钮，填写链接信息并保存' />
          <el-step title="搜索资源" description="使用搜索框快速查找需要的资源链接" />
          <el-step title="下载使用" description='点击"下载"按钮打开链接，系统会自动记录下载次数' />
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { InfoFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.about {
  max-width: 1000px;
  margin: 0 auto;
}

.about-content {
  text-align: center;
}

.about-icon {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.about-content h2 {
  margin: 1rem 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.version {
  color: #666;
  margin-bottom: 2rem;
}

.about-content h3 {
  text-align: left;
  margin: 2rem 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.feature-list {
  text-align: left;
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.75rem 0;
  color: #555;
  font-size: 1rem;
  line-height: 1.8;
}

.tech-card {
  margin-bottom: 1rem;
  text-align: center;
}

.tech-card h4 {
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-size: 1.2rem;
}

.tech-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

:deep(.el-steps) {
  margin-top: 1rem;
}
</style>
