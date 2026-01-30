<template>
  <div class="home">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎来到资源分享站</span>
        </div>
      </template>
      <div class="welcome-content">
        <el-icon class="welcome-icon"><Promotion /></el-icon>
        <h1>资源分享站</h1>
        <p class="subtitle">一个便捷的网盘链接分享平台</p>
      </div>
    </el-card>

    <el-row :gutter="20" class="feature-cards">
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="feature-card" shadow="hover">
          <el-icon class="feature-icon"><Search /></el-icon>
          <h3>快速检索</h3>
          <p>支持关键词搜索，快速找到你需要的资源链接</p>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="feature-card" shadow="hover">
          <el-icon class="feature-icon"><DataAnalysis /></el-icon>
          <h3>下载统计</h3>
          <p>实时统计每个链接的下载次数，了解资源热度</p>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="feature-card" shadow="hover">
          <el-icon class="feature-icon"><Share /></el-icon>
          <h3>便捷分享</h3>
          <p>轻松添加和管理网盘链接，支持多种网盘平台</p>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="quick-start-card">
      <template #header>
        <div class="card-header">
          <span>快速开始</span>
        </div>
      </template>
      <el-steps :active="1" align-center>
        <el-step title="浏览链接" description="查看所有可用的网盘链接" />
        <el-step title="搜索资源" description="使用搜索功能快速定位" />
        <el-step title="下载使用" description="点击链接跳转下载" />
      </el-steps>
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="$router.push('/cloud-share')">
          <el-icon><Link /></el-icon>
          前往网盘链接页面
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Promotion, Search, DataAnalysis, Share, Link } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 2rem;
  text-align: center;
}

.card-header {
  font-size: 1.2rem;
  font-weight: 600;
}

.welcome-content {
  padding: 2rem 0;
}

.welcome-icon {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.welcome-content h1 {
  margin: 1rem 0;
  font-size: 2.5rem;
  color: #333;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.feature-cards {
  margin-bottom: 2rem;
}

.feature-card {
  text-align: center;
  height: 100%;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin: 1rem 0;
  color: #333;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.quick-start-card {
  margin-top: 2rem;
}

.action-buttons {
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .welcome-content h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>
