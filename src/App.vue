<template>
  <div class="app">
    <header class="header">
      <h1>🎉 Vue3 GitHub Pages 项目</h1>
      <p class="subtitle">欢迎使用Vue3构建的GitHub Pages网站</p>
    </header>
    
    <main class="main">
      <div class="card">
        <h2>项目信息</h2>
        <p>这是一个使用Vue3 + Vite构建的项目，可以直接部署到GitHub Pages。</p>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">框架:</span>
            <span class="value">Vue 3</span>
          </div>
          <div class="info-item">
            <span class="label">构建工具:</span>
            <span class="value">Vite</span>
          </div>
          <div class="info-item">
            <span class="label">部署平台:</span>
            <span class="value">GitHub Pages</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>功能特性</h2>
        <ul class="feature-list">
          <li>✨ 现代化的Vue3 Composition API</li>
          <li>⚡ 快速的Vite构建工具</li>
          <li>📦 自动化的GitHub Pages部署</li>
          <li>🎨 响应式设计</li>
        </ul>
      </div>

      <div class="card">
        <h2>计数器示例</h2>
        <div class="counter">
          <button @click="decrement" class="btn btn-secondary">-</button>
          <span class="count">{{ count }}</span>
          <button @click="increment" class="btn btn-primary">+</button>
        </div>
        <p class="counter-text">当前计数: {{ count }}</p>
      </div>
    </main>

    <footer class="footer">
      <p>© 2024 Vue3 GitHub Pages 项目</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.card h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #667eea;
  font-weight: 500;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.feature-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  color: #555;
}

.feature-list li:last-child {
  border-bottom: none;
}

.counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.count {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  min-width: 60px;
  text-align: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: scale(1.05);
}

.btn-secondary {
  background: #e2e8f0;
  color: #333;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: scale(1.05);
}

.counter-text {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.footer {
  background: #f7fafc;
  padding: 2rem;
  text-align: center;
  color: #666;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .main {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>
