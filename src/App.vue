<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo">
          <el-icon><FolderOpened /></el-icon>
          <span class="logo-text">资源分享站</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          class="header-menu"
          @select="handleMenuSelect"
          router
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/cloud-share">
            <el-icon><Link /></el-icon>
            <span>网盘链接</span>
          </el-menu-item>
          <el-menu-item index="/about">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>
    
    <el-main class="app-main">
      <router-view />
    </el-main>
    
    <el-footer class="app-footer">
      <p>© 2024 资源分享站 | Powered by Vue3 + Element Plus</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { House, Link, InfoFilled, FolderOpened } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (index) => {
  // 路由会自动处理
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  height: 64px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
}

.logo .el-icon {
  font-size: 1.8rem;
}

.logo-text {
  user-select: none;
}

.header-menu {
  background: transparent;
  border: none;
}

.header-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 2px solid transparent;
}

.header-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.header-menu :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-bottom-color: white;
}

.app-main {
  flex: 1;
  padding: 2rem;
  background: #f5f7fa;
  min-height: calc(100vh - 128px);
}

.app-footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  height: auto !important;
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 0.5rem;
  }
  
  .logo {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .header-menu {
    width: 100%;
  }
  
  .app-main {
    padding: 1rem;
  }
}
</style>
