<template>
  <div class="search">
    <div class="container">
      <!-- 搜索框 -->
      <div class="search-header">
        <h1>搜索诗词</h1>
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="输入诗词标题、作者、内容或关键词..."
            @keyup.enter="performSearch"
            class="search-input"
          />
          <button class="search-btn" @click="performSearch">
            <span class="search-icon">🔍</span>
            搜索
          </button>
        </div>
        
        <!-- 搜索历史 -->
        <div class="search-history" v-if="searchStore.searchRecords.length > 0">
          <h3>搜索历史</h3>
          <div class="history-tags">
            <span 
              v-for="record in searchStore.searchRecords" 
              :key="record"
              class="history-tag"
              @click="searchQuery = record; performSearch()"
            >
              {{ record }}
            </span>
          </div>
          <button class="clear-history" @click="searchStore.clearSearchHistory">
            清除历史
          </button>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div class="search-results" v-if="searchResults.length > 0">
        <div class="results-header">
          <h2>搜索结果 ({{ searchResults.length }})</h2>
          <div class="sort-controls">
            <select v-model="sortBy" class="sort-select">
              <option value="relevance">相关度</option>
              <option value="title">标题</option>
              <option value="author">作者</option>
              <option value="dynasty">朝代</option>
            </select>
          </div>
        </div>

        <div class="results-grid">
          <div 
            class="result-item" 
            v-for="poem in sortedResults" 
            :key="poem.id"
            @click="viewPoemDetail(poem.id)"
          >
            <div class="result-card">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
              <div class="poem-preview">
                {{ highlightMatches(poem.content) }}
              </div>
              <div class="result-meta">
                <span class="meta-item">📖 {{ poem.wordCount }}字</span>
                <span class="meta-item">❤️ {{ poem.likes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="searchQuery && searchResults.length === 0">
        <div class="empty-icon">🔍</div>
        <h3>未找到相关诗词</h3>
        <p>尝试使用不同的关键词或检查拼写</p>
        <div class="suggestions">
          <h4>搜索建议：</h4>
          <ul>
            <li>使用更具体的关键词</li>
            <li>尝试作者姓名</li>
            <li>使用诗词中的关键词</li>
            <li>检查拼写是否正确</li>
          </ul>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div class="popular-searches" v-if="!searchQuery">
        <h2>热门搜索</h2>
        <div class="popular-tags">
          <span 
            v-for="tag in popularTags" 
            :key="tag"
            class="popular-tag"
            @click="searchQuery = tag; performSearch()"
          >
            {{ tag }}
          </span>
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
const searchStore = usePoemStore()

const searchQuery = ref('')
const searchResults = ref([])
const sortBy = ref('relevance')

// 热门搜索标签
const popularTags = ref([
  '李白', '杜甫', '唐诗', '宋词', '月亮', '思乡', '春天', '爱情',
  '山水', '送别', '边塞', '咏史', '豪放', '婉约', '田园'
])

// 示例诗词数据（实际应用中应该从API获取）
const allPoems = ref([
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    wordCount: 20,
    likes: 1250
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    wordCount: 20,
    likes: 980
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
    wordCount: 20,
    likes: 1560
  },
  {
    id: 4,
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐代',
    content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
    wordCount: 20,
    likes: 890
  },
  {
    id: 5,
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐代',
    content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
    wordCount: 28,
    likes: 2340
  },
  {
    id: 6,
    title: '相思',
    author: '王维',
    dynasty: '唐代',
    content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
    wordCount: 20,
    likes: 1780
  }
])

// 执行搜索
const performSearch = () => {
  if (!searchQuery.value.trim()) return

  // 添加到搜索历史
  searchStore.addSearchRecord(searchQuery.value)

  // 执行搜索逻辑
  const query = searchQuery.value.toLowerCase()
  searchResults.value = allPoems.value.filter(poem => 
    poem.title.toLowerCase().includes(query) ||
    poem.author.toLowerCase().includes(query) ||
    poem.content.toLowerCase().includes(query) ||
    poem.dynasty.toLowerCase().includes(query)
  )
}

// 高亮匹配内容
const highlightMatches = (content) => {
  if (!searchQuery.value) return content
  
  const query = searchQuery.value
  const regex = new RegExp(query, 'gi')
  return content.replace(regex, match => `<mark>${match}</mark>`)
}

// 排序后的结果
const sortedResults = computed(() => {
  const results = [...searchResults.value]
  
  switch (sortBy.value) {
    case 'title':
      return results.sort((a, b) => a.title.localeCompare(b.title))
    case 'author':
      return results.sort((a, b) => a.author.localeCompare(b.author))
    case 'dynasty':
      return results.sort((a, b) => a.dynasty.localeCompare(b.dynasty))
    case 'relevance':
    default:
      return results
  }
})

// 查看诗词详情
const viewPoemDetail = (poemId) => {
  router.push(`/poems/${poemId}`)
}

// 组件挂载时聚焦搜索框
onMounted(() => {
  const searchInput = document.querySelector('.search-input')
  if (searchInput) {
    searchInput.focus()
  }
})
</script>

<style scoped>
.search {
  min-height: 100vh;
  padding: 2rem 0;
}

.search-header {
  text-align: center;
  margin-bottom: 3rem;
}

.search-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.search-history {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-top: 2rem;
}

.search-history h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.history-tag {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.history-tag:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.clear-history {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-history:hover {
  color: #e74c3c;
}

.search-results {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.results-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
}

.sort-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.result-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.result-item:hover {
  transform: translateY(-5px);
}

.result-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.result-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.poem-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poem-author {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.poem-preview {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1rem;
}

.poem-preview mark {
  background: #ffeaa7;
  padding: 0.1rem 0.2rem;
  border-radius: 0.2rem;
}

.result-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #718096;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
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
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 2rem;
}

.suggestions {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.suggestions h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.suggestions ul {
  list-style-type: none;
  padding: 0;
}

.suggestions li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f1f1;
}

.suggestions li:last-child {
  border-bottom: none;
}

.popular-searches {
  margin-top: 3rem;
}

.popular-searches h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.popular-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.popular-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }
  
  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .popular-tags {
    gap: 0.5rem;
  }
  
  .popular-tag {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>