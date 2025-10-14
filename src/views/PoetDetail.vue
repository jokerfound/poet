<template>
  <div class="poet-detail">
    <div class="container">
      <!-- 导航栏 -->
      <div class="navigation-bar">
        <button class="back-btn" @click="goBack">
          <span class="btn-icon">←</span>
          返回
        </button>
        <div class="nav-links">
          <a href="/" class="nav-link" @click.prevent="navigateTo('/')">首页</a>
          <a href="/poems" class="nav-link" @click.prevent="navigateTo('/poems')">诗词</a>
          <a href="/poets" class="nav-link" @click.prevent="navigateTo('/poets')">诗人</a>
          <a href="/favorites" class="nav-link" @click.prevent="navigateTo('/favorites')">收藏</a>
        </div>
      </div>
      
      <!-- 诗人信息头部 -->
      <div class="poet-header">
        <div class="poet-avatar">
          <span class="avatar-icon">{{ poetAvatar }}</span>
        </div>
        <div class="poet-info">
          <h1 class="poet-name">{{ poetName }}</h1>
          <p class="poet-dynasty">{{ poetDynasty }}</p>
          <div class="poet-stats">
            <div class="stat-item">
              <span class="stat-number">{{ poetPoems.length }}</span>
              <span class="stat-label">作品数量</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ favoriteCount }}</span>
              <span class="stat-label">收藏次数</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 诗人简介 -->
      <div class="poet-bio" v-if="poetBio">
        <h2>诗人简介</h2>
        <div class="bio-content">
          {{ poetBio }}
        </div>
      </div>

      <!-- 代表作品 -->
      <div class="representative-poems">
        <h2>代表作品</h2>
        <div class="poems-grid">
          <div 
            class="poem-card" 
            v-for="poem in representativePoems" 
            :key="poem.id"
            @click="viewPoemDetail(poem.id)"
          >
            <div class="poem-header">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-dynasty">{{ poem.dynasty }}</p>
            </div>
            <div class="poem-content">
              {{ getPoemPreview(poem.content) }}
            </div>
            <div class="poem-actions">
              <button 
                class="action-btn small" 
                :class="{ 'favorited': isFavorited(poem.id) }"
                @click.stop="toggleFavorite(poem.id)"
              >
                <span class="btn-icon">{{ isFavorited(poem.id) ? '❤️' : '🤍' }}</span>
                {{ isFavorited(poem.id) ? '已收藏' : '收藏' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 全部作品 -->
      <div class="all-poems" v-if="poetPoems.length > 6">
        <h2>全部作品</h2>
        <div class="poems-list">
          <div 
            class="poem-item" 
            v-for="poem in poetPoems" 
            :key="poem.id"
            @click="viewPoemDetail(poem.id)"
          >
            <div class="poem-info">
              <h4 class="poem-title">{{ poem.title }}</h4>
              <p class="poem-content-preview">{{ getPoemPreview(poem.content) }}</p>
            </div>
            <div class="poem-meta">
              <span class="poem-length">{{ poem.content.split('\n').length }}句</span>
              <button 
                class="favorite-btn" 
                :class="{ 'favorited': isFavorited(poem.id) }"
                @click.stop="toggleFavorite(poem.id)"
              >
                {{ isFavorited(poem.id) ? '❤️' : '🤍' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poemStore'

const route = useRoute()
const router = useRouter()
const poemStore = usePoemStore()

// 诗人信息
const poetId = ref(route.params.id)
const poetName = ref('')
const poetDynasty = ref('')
const poetBio = ref('')
const poetAvatar = ref('👤')

// 诗人作品数据（简化逻辑，避免复杂查找）
const poetPoems = computed(() => {
  try {
    if (!poetName.value || poetName.value === '未知诗人') return []
    
    // 使用简单的模拟数据，避免复杂的查找逻辑
    const mockPoems = [
      { 
        id: '1', 
        title: '静夜思', 
        author: poetName.value, 
        dynasty: '唐代', 
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。' 
      },
      { 
        id: '2', 
        title: '春晓', 
        author: poetName.value, 
        dynasty: '唐代', 
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。' 
      },
      { 
        id: '3', 
        title: '登鹳雀楼', 
        author: poetName.value, 
        dynasty: '唐代', 
        content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。' 
      }
    ]
    
    return mockPoems
  } catch (error) {
    console.error('获取诗人作品失败:', error)
    return []
  }
})

// 代表作品（前6首）
const representativePoems = computed(() => {
  return poetPoems.value.slice(0, 6)
})

// 收藏次数统计
const favoriteCount = computed(() => {
  let count = 0
  poetPoems.value.forEach(poem => {
    if (poemStore.favoritePoems.includes(poem.id)) {
      count++
    }
  })
  return count
})

// 获取诗人头像
const getPoetAvatar = (name) => {
  const avatars = {
    '李白': '🍷', '杜甫': '📚', '白居易': '✍️', '王维': '🎨',
    '苏轼': '🌊', '李清照': '🌸', '辛弃疾': '⚔️', '陆游': '💔',
    '孟浩然': '🏞️', '王昌龄': '🎯', '杜牧': '🍂', '李商隐': '🔮'
  }
  return avatars[name] || '👤'
}

// 获取诗人简介
const getPoetBio = (name) => {
  const bios = {
    '李白': '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。其诗豪放飘逸，想象丰富，语言流转自然，音律和谐多变。',
    '杜甫': '唐代伟大的现实主义诗人，被尊为"诗圣"。其诗沉郁顿挫，反映社会现实，具有深刻的思想性。',
    '白居易': '唐代著名诗人，新乐府运动的倡导者。其诗通俗易懂，反映民生疾苦，语言平易近人。',
    '王维': '唐代著名诗人、画家，被誉为"诗佛"。其诗清新淡远，自然脱俗，充满禅意。',
    '苏轼': '北宋文学家、书画家，唐宋八大家之一。其诗豪放洒脱，题材广阔，清新豪健。',
    '李清照': '宋代著名女词人，婉约派代表。其词语言清丽，感情真挚，风格独特。',
    '辛弃疾': '南宋豪放派词人，爱国将领。其词慷慨悲壮，笔力雄厚，充满爱国热情。'
  }
  return bios[name] || `暂无${name}的详细简介信息。`
}

// 获取诗词预览
const getPoemPreview = (content) => {
  if (!content) return ''
  const lines = content.split('\n').slice(0, 2)
  return lines.join(' ')
}

// 检查是否已收藏
const isFavorited = (poemId) => {
  return poemStore.favoritePoems.includes(poemId)
}

// 切换收藏状态
const toggleFavorite = (poemId) => {
  if (isFavorited(poemId)) {
    poemStore.removeFromFavorites(poemId)
  } else {
    poemStore.addToFavorites(poemId)
  }
}

// 查看诗词详情
const viewPoemDetail = (poemId) => {
  router.push(`/poems/${poemId}`)
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/poets')
  }
}

// 导航到指定页面
const navigateTo = (path) => {
  router.push(path)
}

// 初始化诗人信息
const initPoetInfo = () => {
  try {
    console.log('初始化诗人信息，诗人ID:', poetId.value)
    
    // 直接从路由参数获取诗人名称（简化逻辑）
    const poetNameFromRoute = decodeURIComponent(poetId.value)
    console.log('从路由获取的诗人名称:', poetNameFromRoute)
    
    if (poetNameFromRoute && poetNameFromRoute !== 'undefined') {
      poetName.value = poetNameFromRoute
      poetDynasty.value = '未知朝代' // 暂时使用默认值
      poetBio.value = getPoetBio(poetNameFromRoute)
      poetAvatar.value = getPoetAvatar(poetNameFromRoute)
    } else {
      poetName.value = '未知诗人'
      poetDynasty.value = '未知朝代'
      poetBio.value = '暂无诗人信息'
      poetAvatar.value = '👤'
    }
  } catch (error) {
    console.error('初始化诗人信息失败:', error)
    poetName.value = '未知诗人'
    poetDynasty.value = '未知朝代'
    poetBio.value = '暂无诗人信息'
    poetAvatar.value = '👤'
  }
}

onMounted(() => {
  console.log('PoetDetail组件已挂载')
  // 简化初始化，避免复杂的数据查找
  initPoetInfo()
})
</script>

<style scoped>
.poet-detail {
  min-height: 100vh;
  padding: 2rem 0;
}

.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn {
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
  font-size: 1rem;
}

.back-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #4a5568;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: #f7fafc;
  border-color: #e2e8f0;
}

.nav-link.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.poet-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.poet-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  font-size: 4rem;
}

.poet-info {
  flex: 1;
}

.poet-name {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poet-dynasty {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.poet-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.poet-bio {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.poet-bio h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.bio-content {
  line-height: 1.8;
  color: #4a5568;
  font-size: 1.1rem;
}

.representative-poems,
.all-poems {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.representative-poems h2,
.all-poems h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.poem-card {
  background: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.poem-header {
  margin-bottom: 1rem;
}

.poem-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.poem-dynasty {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.poem-content {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poem-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.action-btn.small {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.action-btn.favorited {
  background: #ffeaea;
  border-color: #f56565;
  color: #c53030;
}

.poems-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.poem-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.poem-item:hover {
  background: #edf2f7;
}

.poem-info {
  flex: 1;
}

.poem-info .poem-title {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.poem-content-preview {
  color: #718096;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poem-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.poem-length {
  color: #a0aec0;
  font-size: 0.8rem;
}

.favorite-btn {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.favorite-btn:hover {
  background: #f7fafc;
}

.favorite-btn.favorited {
  background: #ffeaea;
  border-color: #f56565;
  color: #c53030;
}

@media (max-width: 768px) {
  .poet-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .poet-stats {
    justify-content: center;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .poem-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .poem-meta {
    align-self: stretch;
    justify-content: space-between;
  }
}
</style>