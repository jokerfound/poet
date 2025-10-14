<template>
  <div class="poem-detail">
    <div class="container-sm">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <button class="back-btn" @click="$router.back()">
          <span class="btn-icon">⬅️</span>
          返回列表
        </button>
      </div>

      <!-- 诗词内容 -->
      <div class="poem-content-section">
        <div class="poem-header">
          <h1 class="poem-title">{{ poem.title }}</h1>
          <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
          <div class="poem-actions">
            <button class="action-btn" @click="toggleFavorite" :class="{ active: isFavorite }">
              <span class="btn-icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
              {{ isFavorite ? '已收藏' : '收藏' }}
            </button>
            <button class="action-btn" @click="sharePoem">
              <span class="btn-icon">📤</span>
              分享
            </button>
            <button class="action-btn" @click="playAudio">
              <span class="btn-icon">🔊</span>
              朗诵
            </button>
          </div>
        </div>

        <div class="poem-text">
          <pre class="poem-content">{{ poem.content }}</pre>
        </div>

        <!-- 诗词标签 -->
        <div class="poem-tags">
          <span class="tag" v-for="tag in poem.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- AI赏析 -->
      <div class="ai-analysis-section">
        <h2 class="section-title">AI智能赏析</h2>
        <div class="analysis-tabs">
          <button 
            v-for="tab in analysisTabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="analysis-content">
          <div v-if="activeTab === 'meaning'" class="tab-content">
            <h3>诗意解读</h3>
            <p>{{ poem.analysis.meaning }}</p>
          </div>
          
          <div v-if="activeTab === 'artistic'" class="tab-content">
            <h3>艺术特色</h3>
            <p>{{ poem.analysis.artistic }}</p>
          </div>
          
          <div v-if="activeTab === 'background'" class="tab-content">
            <h3>创作背景</h3>
            <p>{{ poem.analysis.background }}</p>
          </div>
          
          <div v-if="activeTab === 'appreciation'" class="tab-content">
            <h3>名家赏析</h3>
            <p>{{ poem.analysis.appreciation }}</p>
          </div>
        </div>
      </div>

      <!-- 相关诗词 -->
      <div class="related-poems-section">
        <h2 class="section-title">相关诗词</h2>
        <div class="related-grid">
          <div 
            class="related-poem" 
            v-for="related in relatedPoems" 
            :key="related.id"
            @click="viewRelatedPoem(related.id)"
          >
            <h4>{{ related.title }}</h4>
            <p>{{ related.author }}</p>
            <div class="poem-preview">{{ getPoemPreview(related.content) }}</div>
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

const poemId = parseInt(route.params.id)

// 诗词数据
const poem = ref({
  id: poemId,
  title: '静夜思',
  author: '李白',
  dynasty: '唐代',
  content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
  tags: ['思乡', '月亮', '夜晚', '抒情'],
  analysis: {
    meaning: '这首诗通过描绘静夜中的月光景象，表达了诗人深切的思乡之情。前两句写景，后两句抒情，情景交融，意境深远。',
    artistic: '语言朴素自然，比喻贴切生动。运用了对比手法，将月光比作霜，增强了诗歌的形象性。',
    background: '此诗创作于唐玄宗开元十四年（726年）九月十五日，时李白26岁，当时在扬州旅舍。',
    appreciation: '明代文学家胡应麟评价此诗："太白诸绝句，信口而成，所谓无意于工而无不工者。"'
  }
})

// 相关诗词
const relatedPoems = ref([
  {
    id: 2,
    title: '月下独酌',
    author: '李白',
    content: '花间一壶酒，独酌无相亲。举杯邀明月，对影成三人。'
  },
  {
    id: 3,
    title: '关山月',
    author: '李白',
    content: '明月出天山，苍茫云海间。长风几万里，吹度玉门关。'
  },
  {
    id: 4,
    title: '望月怀远',
    author: '张九龄',
    content: '海上生明月，天涯共此时。情人怨遥夜，竟夕起相思。'
  }
])

// 赏析标签
const analysisTabs = ref([
  { id: 'meaning', label: '诗意解读' },
  { id: 'artistic', label: '艺术特色' },
  { id: 'background', label: '创作背景' },
  { id: 'appreciation', label: '名家赏析' }
])

const activeTab = ref('meaning')

// 收藏状态
const isFavorite = computed(() => poemStore.favorites.includes(poemId))

// 切换收藏
const toggleFavorite = () => {
  poemStore.toggleFavorite(poemId)
}

// 分享诗词
const sharePoem = () => {
  if (navigator.share) {
    navigator.share({
      title: `${poem.value.title} - ${poem.value.author}`,
      text: poem.value.content,
      url: window.location.href
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(`${poem.value.title}\n${poem.value.author}\n${poem.value.content}`)
    alert('诗词内容已复制到剪贴板')
  }
}

// 播放朗诵
const playAudio = () => {
  // 模拟音频播放
  alert('朗诵功能开发中...')
}

// 获取诗词预览
const getPoemPreview = (content) => {
  return content.split('。')[0] + '。'
}

// 查看相关诗词
const viewRelatedPoem = (relatedId) => {
  router.push(`/poems/${relatedId}`)
}

// 组件挂载时添加到阅读历史
onMounted(() => {
  poemStore.addToHistory(poem.value)
})
</script>

<style scoped>
.poem-detail {
  min-height: 100vh;
  padding: 2rem 0;
}

.back-nav {
  margin-bottom: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e2e8f0;
}

.poem-content-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.poem-header {
  text-align: center;
  margin-bottom: 2rem;
}

.poem-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poem-author {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.poem-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #3498db;
  transform: translateY(-2px);
}

.action-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.poem-text {
  margin: 2rem 0;
}

.poem-content {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 1.5rem;
  line-height: 2;
  text-align: center;
  white-space: pre-wrap;
  margin: 0;
}

.poem-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.ai-analysis-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.analysis-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f1f1f1;
}

.tab-btn {
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #718096;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.tab-btn:hover {
  color: #3498db;
}

.tab-content {
  padding: 1rem 0;
}

.tab-content h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.tab-content p {
  line-height: 1.8;
  color: #4a5568;
  font-size: 1.1rem;
}

.related-poems-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-poem {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-poem:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.related-poem h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.related-poem p {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.poem-preview {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 1rem;
  color: #718096;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .poem-title {
    font-size: 2rem;
  }
  
  .poem-content {
    font-size: 1.2rem;
  }
  
  .poem-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .analysis-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    text-align: left;
    border-bottom: 1px solid #f1f1f1;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>