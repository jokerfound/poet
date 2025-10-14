import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '诗境寻踪 - 首页'
    }
  },
  {
    path: '/poems',
    name: 'Poems',
    component: () => import('@/views/Poems.vue'),
    meta: {
      title: '诗词赏析'
    }
  },
  {
    path: '/poems/:id',
    name: 'PoemDetail',
    component: () => import('@/views/PoemDetail.vue'),
    meta: {
      title: '诗词详情'
    }
  },
  {
    path: '/poets',
    name: 'Poets',
    component: () => import('@/views/Poets.vue'),
    meta: {
      title: '诗人介绍'
    }
  },
  {
    path: '/poets/:id',
    name: 'PoetDetail',
    component: () => import('@/views/PoetDetail.vue'),
    meta: {
      title: '诗人详情'
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/Categories.vue'),
    meta: {
      title: '分类浏览'
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/Favorites.vue'),
    meta: {
      title: '我的收藏'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: {
      title: '搜索诗词'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router