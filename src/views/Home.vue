<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">诗境寻踪</h1>
        <p class="hero-subtitle">AI驱动古诗词智能赏析平台</p>
        <p class="hero-description">
          沉浸式体验中华诗词之美，AI智能解读，个性化学习路径
        </p>
        <div class="hero-actions">
          <router-link to="/poems" class="btn btn-primary">
            <span class="btn-icon">📖</span>
            开始赏析
          </router-link>
          <router-link to="/search" class="btn btn-secondary">
            <span class="btn-icon">🔍</span>
            搜索诗词
          </router-link>
        </div>
      </div>
      <div class="hero-background">
        <div class="floating-poem">床前明月光，疑是地上霜</div>
        <div class="floating-poem">举头望明月，低头思故乡</div>
        <div class="floating-poem">春风又绿江南岸，明月何时照我还</div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">平台特色</h2>
        <div class="grid grid-3">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>AI智能解读</h3>
            <p>多维度AI分析诗词意境、情感、艺术手法，提供深度解读</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>沉浸式体验</h3>
            <p>诗词配图、背景音乐、朗诵音频，打造全方位感官体验</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>个性化学习</h3>
            <p>根据兴趣推荐诗词，构建专属学习路径</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐诗词 -->
    <section class="recommendations">
      <div class="container">
        <h2 class="section-title">今日推荐</h2>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="grid grid-2">
          <div class="poem-card" v-for="poem in recommendedPoems" :key="poem.id">
            <div class="poem-header">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
            </div>
            <div class="poem-content">
              {{ poem.content }}
            </div>
            <div class="poem-actions">
              <router-link :to="`/poems/${poem.id}`" class="btn btn-primary">
                详细赏析
              </router-link>
              <button class="btn btn-secondary" @click="toggleFavorite(poem.id)">
                {{ isFavorite(poem.id) ? '取消收藏' : '收藏' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats">
      <div class="container">
        <div class="grid grid-4">
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalPoems }}</div>
            <div class="stat-label">诗词总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalPoets }}</div>
            <div class="stat-label">诗人数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalDynasties }}</div>
            <div class="stat-label">朝代覆盖</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.aiAnalyses }}</div>
            <div class="stat-label">AI解读</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePoemStore } from '@/stores/poemStore'
import staticPoemService from '@/services/staticPoemService'

const poemStore = usePoemStore()

// 推荐诗词数据
const recommendedPoems = ref([])
const stats = ref({
  totalPoems: '加载中...',
  totalPoets: '加载中...',
  totalDynasties: '加载中...',
  aiAnalyses: '加载中...'
})
const loading = ref(true)
const error = ref(null)

// 加载首页数据
const loadHomeData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 获取推荐诗词
    const poems = await staticPoemService.getRecommendedPoems(4)
    recommendedPoems.value = poems.map(poem => ({
      id: poem.id,
      title: poem.title,
      author: poem.author || '未知',
      dynasty: poem.dynasty,
      content: poem.content
    }))
    
    // 获取统计数据
    const statsData = await staticPoemService.getPlatformStats()
    const poets = await staticPoemService.getPoets(1)
    
    stats.value = statsData
    
  } catch (err) {
    error.value = err.message
    console.error('加载首页数据失败:', err)
    
    // 使用模拟数据作为降级方案
    recommendedPoems.value = [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。'
      },
      {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐代',
        content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。'
      }
    ]
    
    stats.value = {
      totalPoems: '5000+',
      totalPoets: '300+',
      totalDynasties: '10+',
      aiAnalyses: '10000+'
    }
  } finally {
    loading.value = false
  }
}

// 收藏功能
const toggleFavorite = async (poemId) => {
  try {
    poemStore.toggleFavorite(poemId)
    // 记录阅读行为
    await staticPoemService.trackReading(poemId)
  } catch (err) {
    console.error('记录阅读行为失败:', err)
  }
}

const isFavorite = (poemId) => {
  return poemStore.favorites.includes(poemId)
}

// 组件挂载时加载数据
onMounted(() => {
  loadHomeData()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  position: relative;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.hero-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.hero-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-icon {
  margin-right: 0.5rem;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.floating-poem {
  position: absolute;
  font-size: 1.5rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  animation: float 6s ease-in-out infinite;
}

.floating-poem:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-poem:nth-child(2) {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.floating-poem:nth-child(3) {
  top: 40%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.features {
  padding: 4rem 0;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.feature-card {
  text-align: center;
  padding: 2rem;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

.recommendations {
  padding: 4rem 0;
  background: #f8f9fa;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.poem-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.poem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.poem-header {
  margin-bottom: 1.5rem;
}

.poem-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poem-author {
  color: #7f8c8d;
  font-size: 1rem;
}

.poem-content {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  white-space: pre-line;
}

.poem-actions {
  display: flex;
  gap: 1rem;
}

.stats {
  padding: 3rem 0;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .poem-actions {
    flex-direction: column;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>