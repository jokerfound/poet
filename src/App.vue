<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <span class="brand-icon">🎨</span>
          <span class="brand-text">诗境寻踪</span>
        </router-link>
        
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/poems" class="nav-link">诗词赏析</router-link>
          <router-link to="/poets" class="nav-link">诗人介绍</router-link>
          <router-link to="/categories" class="nav-link">分类浏览</router-link>
          <router-link to="/favorites" class="nav-link">我的收藏</router-link>
        </div>
        
        <div class="nav-search">
          <router-link to="/search" class="search-btn">
            <span class="search-icon">🔍</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>© 2025 诗境寻踪 - AI驱动古诗词智能赏析平台</p>
        <p>传承中华文化，品味诗词之美</p>
      </div>
    </footer>

    <!-- AI聊天助手 -->
    <AIChatAssistant />
    
    <!-- 诗词赏析机器人 -->
    <PoetryAnalysisBot />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AIChatAssistant from '@/components/AIChatAssistant.vue'
import PoetryAnalysisBot from '@/components/PoetryAnalysisBot.vue'

const route = useRoute()
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.brand-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
}

.brand-text {
  font-family: 'STKaiti', 'KaiTi', serif;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.search-btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.search-icon {
  font-size: 1.2rem;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.footer-content p {
  margin: 0.5rem 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .main-content {
    padding: 1rem 0;
  }
}
</style>