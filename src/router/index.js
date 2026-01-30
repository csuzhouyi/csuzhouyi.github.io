import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CloudShare from '../views/CloudShare.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: '首页' }
    },
    {
      path: '/cloud-share',
      name: 'cloudShare',
      component: CloudShare,
      meta: { title: '网盘链接分享' }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: { title: '关于' }
    }
  ]
})

export default router
