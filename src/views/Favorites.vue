<template>
  <div class="favorites">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>我的收藏</h1>
        <p>您收藏的诗词作品和诗人信息</p>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ favoritePoems.length }}</div>
            <div class="stat-label">收藏诗词</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ readingHistory.length }}</div>
            <div class="stat-label">阅读记录</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ uniquePoets.size }}</div>
            <div class="stat-label">关注诗人</div>
          </div>
        </div>
      </div>

      <!-- 收藏标签 -->
      <div class="favorite-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'poems' }"
          @click="activeTab = 'poems'"
        >
          <span class="tab-icon">📖</span>
          收藏诗词 ({{ favoritePoems.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          <span class="tab-icon">🕒</span>
          阅读历史 ({{ readingHistory.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'poets' }"
          @click="activeTab = 'poets'"
        >
          <span class="tab-icon">👥</span>
          关注诗人 ({{ favoritePoetsData.length }})
        </button>
      </div>

      <!-- 收藏诗词 -->
      <div class="tab-content" v-if="activeTab === 'poems'">
        <div class="content-header">
          <h2>收藏的诗词</h2>
          <div class="header-actions">
            <button 
              class="action-btn" 
              @click="clearFavorites"
              :disabled="favoritePoems.length === 0"
            >
              <span class="btn-icon">🗑️</span>
              清空收藏
            </button>
          </div>
        </div>

        <div class="poems-grid" v-if="favoritePoemsData.length > 0">
          <div 
            class="poem-card" 
            v-for="poem in favoritePoemsData" 
            :key="poem.id"
            @click="viewPoemDetail(poem.id)"
          >
            <div class="poem-header">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
            </div>
            <div class="poem-content">
              {{ getPoemPreview(poem.content) }}
            </div>
            <div class="poem-actions">
              <button class="action-btn small" @click="removeFromFavorites(poem.id)">
                <span class="btn-icon">❌</span>
                取消收藏
              </button>
              <button class="action-btn small secondary" @click="viewPoemDetail(poem.id)">
                <span class="btn-icon">👁️</span>
                查看详情
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">📚</div>
          <h3>暂无收藏诗词</h3>
          <p>开始收藏您喜欢的诗词吧！</p>
          <router-link to="/poems" class="btn btn-primary">
            <span class="btn-icon">🔍</span>
            去发现诗词
          </router-link>
        </div>
      </div>

      <!-- 阅读历史 -->
      <div class="tab-content" v-if="activeTab === 'history'">
        <div class="content-header">
          <h2>阅读历史</h2>
          <div class="header-actions">
            <button 
              class="action-btn" 
              @click="clearHistory"
              :disabled="readingHistory.length === 0"
            >
              <span class="btn-icon">🗑️</span>
              清空历史
            </button>
          </div>
        </div>

        <div class="history-list" v-if="readingHistory.length > 0">
          <div 
            class="history-item" 
            v-for="item in readingHistory" 
            :key="item.timestamp"
            @click="viewPoemDetail(item.id)"
          >
            <div class="history-info">
              <h4 class="poem-title">{{ item.title }}</h4>
              <p class="poem-author">{{ item.author }}</p>
              <p class="read-time">{{ formatTime(item.timestamp) }}</p>
            </div>
            <button class="action-btn small" @click.stop="removeFromHistory(item.timestamp)">
              <span class="btn-icon">❌</span>
            </button>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">🕒</div>
          <h3>暂无阅读记录</h3>
          <p>开始阅读诗词来记录您的学习历程！</p>
        </div>
      </div>

      <!-- 关注诗人 -->
      <div class="tab-content" v-if="activeTab === 'poets'">
        <div class="content-header">
          <h2>关注的诗人</h2>
          <p>根据您收藏的诗词自动生成</p>
        </div>

        <div class="poets-grid" v-if="favoritePoetsData.length > 0">
          <div 
            class="poet-card" 
            v-for="poet in favoritePoetsData" 
            :key="poet.id"
            @click="viewPoetPoems(poet.name)"
          >
            <div class="poet-avatar">
              <span class="avatar-icon">{{ poet.avatar }}</span>
            </div>
            <div class="poet-info">
              <h3 class="poet-name">{{ poet.name }}</h3>
              <p class="poet-dynasty">{{ poet.dynasty }}</p>
              <div class="poet-stats">
                <span class="stat">收藏 {{ poet.favoriteCount }} 首</span>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">👥</div>
          <h3>暂无关注诗人</h3>
          <p>收藏诗词来自动关注诗人</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poemStore'

const router = useRouter()
const poemStore = usePoemStore()

// 当前激活的标签页
const activeTab = ref('poems')

// 从store获取数据
const favoritePoems = computed(() => poemStore.favoritePoems)
const readingHistory = computed(() => poemStore.readingHistory)

// 计算关注的诗人
const uniquePoets = computed(() => {
  const poets = new Set()
  favoritePoems.value.forEach(poem => {
    poets.add(poem.author)
  })
  return poets
})

// 获取收藏诗词的详细信息
const favoritePoemsData = computed(() => {
  try {
    if (!favoritePoems.value || !Array.isArray(favoritePoems.value)) return []
    return favoritePoems.value.map(id => {
      return poemStore.poems.find(poem => poem && poem.id === id) || {}
    }).filter(poem => poem && poem.id)
  } catch (error) {
    console.error('获取收藏诗词数据失败:', error)
    return []
  }
})

// 获取关注的诗人信息
const favoritePoetsData = computed(() => {
  try {
    const poetMap = new Map()
    
    if (!favoritePoems.value || !Array.isArray(favoritePoems.value)) return []
    
    favoritePoems.value.forEach(id => {
      const poem = poemStore.poems.find(p => p && p.id === id)
      if (poem && poem.author) {
        if (!poetMap.has(poem.author)) {
          poetMap.set(poem.author, {
            name: poem.author,
            dynasty: poem.dynasty || '未知朝代',
            avatar: getPoetAvatar(poem.author),
            favoriteCount: 0
          })
        }
        const poet = poetMap.get(poem.author)
        poet.favoriteCount++
      }
    })
    
    return Array.from(poetMap.values())
  } catch (error) {
    console.error('获取关注诗人数据失败:', error)
    return []
  }
})

// 获取诗人头像
const getPoetAvatar = (poetName) => {
  const avatars = {
    '李白': '🍷', '杜甫': '📚', '白居易': '✍️', '王维': '🎨',
    '苏轼': '🌊', '李清照': '🌸', '辛弃疾': '⚔️', '陆游': '💔'
  }
  return avatars[poetName] || '👤'
}

// 获取诗词预览
const getPoemPreview = (content) => {
  if (!content) return ''
  const lines = content.split('\n').slice(0, 2)
  return lines.join(' ')
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  return time.toLocaleDateString('zh-CN')
}

// 查看诗词详情
const viewPoemDetail = (poemId) => {
  router.push(`/poems/${poemId}`)
}

// 查看诗人作品
const viewPoetPoems = (poetName) => {
  router.push(`/search?q=${poetName}`)
}

// 从收藏中移除
const removeFromFavorites = (poemId) => {
  poemStore.removeFromFavorites(poemId)
}

// 从历史中移除
const removeFromHistory = (timestamp) => {
  poemStore.removeFromHistory(timestamp)
}

// 清空收藏
const clearFavorites = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    poemStore.clearFavorites()
  }
}

// 清空历史
const clearHistory = () => {
  if (confirm('确定要清空阅读历史吗？')) {
    poemStore.clearHistory()
  }
}

onMounted(() => {
  // 页面加载时初始化数据
  try {
    poemStore.loadFromLocalStorage()
  } catch (error) {
    console.error('初始化收藏页面失败:', error)
  }
})

// 添加组件卸载时的清理
import { onUnmounted } from 'vue'

onUnmounted(() => {
  // 清理可能的内存泄漏
  console.log('Favorites组件已卸载')
})
</script>

<style scoped>
.favorites {
  min-height: 100vh;
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.favorite-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: #7f8c8d;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #3498db;
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-content {
  max-width: 1200px;
  margin: 0 auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.content-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.action-btn.secondary {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.action-btn.secondary:hover {
  background: #2980b9;
}

.btn-icon {
  font-size: 1rem;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.poem-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.poem-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.poem-header {
  margin-bottom: 1rem;
}

.poem-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poem-author {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.poem-content {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poem-actions {
  display: flex;
  gap: 0.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.history-info {
  flex: 1;
}

.history-info .poem-title {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.history-info .poem-author {
  margin-bottom: 0.5rem;
}

.read-time {
  color: #a0aec0;
  font-size: 0.8rem;
}

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.poet-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.poet-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.poet-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  font-size: 2.5rem;
}

.poet-info {
  flex: 1;
}

.poet-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.poet-dynasty {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.poet-stats {
  font-size: 0.8rem;
  color: #a0aec0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .header-stats {
    gap: 1.5rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .favorite-tabs {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .tab-btn {
    justify-content: center;
  }
  
  .content-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .poems-grid,
  .poets-grid {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>