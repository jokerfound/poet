<template>
  <div class="poems">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>诗词赏析</h1>
        <p>探索中华诗词的博大精深，感受古人的智慧与情感</p>
        <div class="header-actions">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索诗词标题、作者或内容..."
              class="search-input"
              @input="handleSearch"
            />
            <span class="search-icon">🔍</span>
          </div>
          <div class="filter-controls">
            <select v-model="selectedDynasty" class="filter-select" @change="handleFilterChange">
              <option value="">全部朝代</option>
              <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">
                {{ dynasty }}
              </option>
            </select>
            <select v-model="selectedType" class="filter-select" @change="handleFilterChange">
              <option value="">全部题材</option>
              <option v-for="type in poemTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载诗词数据...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="loadPoems">重试</button>
      </div>

      <!-- 诗词列表 -->
      <div v-else class="poems-grid">
        <div 
          class="poem-item" 
          v-for="poem in paginatedPoems" 
          :key="poem.id"
          @click="viewPoemDetail(poem.id)"
        >
          <div class="poem-card">
            <div class="poem-badge" :class="getDynastyClass(poem.dynasty)">
              {{ poem.dynasty }}
            </div>
            <h3 class="poem-title">{{ poem.title }}</h3>
            <p class="poem-author">{{ poem.poet?.name || '未知' }}</p>
            <div class="poem-preview">
              {{ getPoemPreview(poem.content) }}
            </div>
            <div class="poem-meta">
              <span class="meta-item">
                <span class="meta-icon">📖</span>
                {{ getWordCount(poem.content) }}字
              </span>
              <span class="meta-item">
                <span class="meta-icon">❤️</span>
                {{ poem.read_count || 0 }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">⭐</span>
                {{ getDifficulty(poem.content) }}
              </span>
            </div>
            <div class="poem-tags">
              <span class="tag" v-if="poem.theme">{{ poem.theme }}</span>
              <span class="tag" v-for="imagery in getImageryTags(poem)" :key="imagery">
                {{ imagery }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="!loading && !error && paginatedPoems.length === 0">
        <div class="empty-icon">📚</div>
        <h3>暂无诗词</h3>
        <p>尝试调整搜索条件或筛选条件</p>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="!loading && !error && paginatedPoems.length > 0">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <span class="pagination-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import poemService from '@/services/poemService'

const router = useRouter()

// 搜索和筛选状态
const searchQuery = ref('')
const selectedDynasty = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// 数据状态
const poems = ref([])
const loading = ref(true)
const error = ref(null)

// 朝代和题材选项
const dynasties = ref(['唐代', '宋代', '元代', '明代', '清代', '汉代', '魏晋'])
const poemTypes = ref(['山水田园', '边塞征战', '咏史怀古', '爱情相思', '离别送别', '咏物言志'])

// 加载诗词数据
const loadPoems = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await poemService.getPoems(100) // 加载100首诗词
    poems.value = data
  } catch (err) {
    error.value = err.message
    console.error('加载诗词数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 筛选处理
const handleFilterChange = () => {
  currentPage.value = 1
}

// 过滤后的诗词列表
const filteredPoems = computed(() => {
  let filtered = poems.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(poem => 
      poem.title.toLowerCase().includes(query) ||
      (poem.poet?.name?.toLowerCase().includes(query) || '') ||
      poem.content.toLowerCase().includes(query) ||
      (poem.theme?.toLowerCase().includes(query) || '') ||
      (poem.imagery?.some(img => img.toLowerCase().includes(query)) || false)
    )
  }
  
  // 朝代过滤
  if (selectedDynasty.value) {
    filtered = filtered.filter(poem => poem.dynasty === selectedDynasty.value)
  }
  
  // 题材过滤
  if (selectedType.value) {
    filtered = filtered.filter(poem => 
      poem.theme === selectedType.value || 
      (poem.imagery?.includes(selectedType.value) || false)
    )
  }
  
  return filtered
})

// 分页相关计算
const totalPages = computed(() => Math.ceil(filteredPoems.value.length / itemsPerPage))
const paginatedPoems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPoems.value.slice(start, end)
})

// 监听分页变化
watch(currentPage, (newPage, oldPage) => {
  if (newPage > totalPages.value) {
    currentPage.value = totalPages.value
  }
  if (newPage < 1) {
    currentPage.value = 1
  }
})

// 获取诗词预览
const getPoemPreview = (content) => {
  const sentences = content.split(/[。！？]/)
  return sentences[0] + (sentences[0].length < 10 && sentences[1] ? sentences[1] : '') + '...'
}

// 获取字数
const getWordCount = (content) => {
  return content.replace(/[^\u4e00-\u9fa5]/g, '').length
}

// 获取难度等级
const getDifficulty = (content) => {
  const wordCount = getWordCount(content)
  if (wordCount <= 20) return '简单'
  if (wordCount <= 40) return '中等'
  return '困难'
}

// 获取朝代样式类
const getDynastyClass = (dynasty) => {
  const dynastyClasses = {
    '唐代': 'tang',
    '宋代': 'song',
    '元代': 'yuan',
    '明代': 'ming',
    '清代': 'qing'
  }
  return dynastyClasses[dynasty] || 'default'
}

// 获取意象标签
const getImageryTags = (poem) => {
  const tags = []
  if (poem.imagery) {
    tags.push(...poem.imagery.slice(0, 2))
  }
  return tags
}

// 查看诗词详情
const viewPoemDetail = async (poemId) => {
  try {
    // 记录阅读行为
    await poemService.trackReading(poemId)
  } catch (err) {
    console.error('记录阅读行为失败:', err)
  }
  router.push(`/poems/${poemId}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadPoems()
})
</script>

<style scoped>
.poems {
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

.header-actions {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #e74c3c;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e74c3c;
  border-radius: 0.5rem;
  background: white;
  color: #e74c3c;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #e74c3c;
  color: white;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.poem-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.poem-item:hover {
  transform: translateY(-5px);
}

.poem-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  position: relative;
  transition: all 0.3s ease;
}

.poem-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.poem-badge {
  position: absolute;
  top: -10px;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.poem-badge.tang { background: #e74c3c; }
.poem-badge.song { background: #3498db; }
.poem-badge.yuan { background: #9b59b6; }
.poem-badge.ming { background: #f39c12; }
.poem-badge.qing { background: #1abc9c; }
.poem-badge.default { background: #95a5a6; }

.poem-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poem-author {
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.poem-preview {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1rem;
}

.poem-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #718096;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.poem-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #3498db;
  border-radius: 0.5rem;
  background: white;
  color: #3498db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #3498db;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #718096;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-controls {
    justify-content: center;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>