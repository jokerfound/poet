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
            />
            <span class="search-icon">🔍</span>
          </div>
          <div class="filter-controls">
            <select v-model="selectedDynasty" class="filter-select">
              <option value="">全部朝代</option>
              <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">
                {{ dynasty }}
              </option>
            </select>
            <select v-model="selectedType" class="filter-select">
              <option value="">全部题材</option>
              <option v-for="type in poemTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 诗词列表 -->
      <div class="poems-grid">
        <div 
          class="poem-item" 
          v-for="poem in filteredPoems" 
          :key="poem.id"
          @click="viewPoemDetail(poem.id)"
        >
          <div class="poem-card">
            <div class="poem-badge" :class="getDynastyClass(poem.dynasty)">
              {{ poem.dynasty }}
            </div>
            <h3 class="poem-title">{{ poem.title }}</h3>
            <p class="poem-author">{{ poem.author }}</p>
            <div class="poem-preview">
              {{ getPoemPreview(poem.content) }}
            </div>
            <div class="poem-meta">
              <span class="meta-item">
                <span class="meta-icon">📖</span>
                {{ poem.wordCount }}字
              </span>
              <span class="meta-item">
                <span class="meta-icon">❤️</span>
                {{ poem.likes }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">⭐</span>
                {{ poem.difficulty }}
              </span>
            </div>
            <div class="poem-tags">
              <span class="tag" v-for="tag in poem.tags" :key="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredPoems.length === 0">
        <div class="empty-icon">📚</div>
        <h3>暂无诗词</h3>
        <p>尝试调整搜索条件或筛选条件</p>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="filteredPoems.length > 0">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索和筛选状态
const searchQuery = ref('')
const selectedDynasty = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// 朝代和题材选项
const dynasties = ref(['唐代', '宋代', '元代', '明代', '清代', '汉代', '魏晋'])
const poemTypes = ref(['山水田园', '边塞征战', '咏史怀古', '爱情相思', '离别送别', '咏物言志'])

// 诗词数据
const poems = ref([
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    wordCount: 20,
    likes: 1250,
    difficulty: '简单',
    tags: ['思乡', '月亮', '夜晚']
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    wordCount: 20,
    likes: 980,
    difficulty: '简单',
    tags: ['春天', '自然', '生活']
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
    wordCount: 20,
    likes: 1560,
    difficulty: '中等',
    tags: ['登高', '哲理', '壮丽']
  },
  {
    id: 4,
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐代',
    content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
    wordCount: 20,
    likes: 890,
    difficulty: '中等',
    tags: ['冬天', '孤独', '自然']
  },
  {
    id: 5,
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐代',
    content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
    wordCount: 28,
    likes: 2340,
    difficulty: '中等',
    tags: ['瀑布', '庐山', '壮观']
  },
  {
    id: 6,
    title: '相思',
    author: '王维',
    dynasty: '唐代',
    content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
    wordCount: 20,
    likes: 1780,
    difficulty: '简单',
    tags: ['爱情', '相思', '红豆']
  },
  {
    id: 7,
    title: '黄鹤楼送孟浩然之广陵',
    author: '李白',
    dynasty: '唐代',
    content: '故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。',
    wordCount: 28,
    likes: 1560,
    difficulty: '中等',
    tags: ['送别', '友情', '长江']
  },
  {
    id: 8,
    title: '枫桥夜泊',
    author: '张继',
    dynasty: '唐代',
    content: '月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。',
    wordCount: 28,
    likes: 1340,
    difficulty: '中等',
    tags: ['夜晚', '思乡', '苏州']
  }
])

// 过滤后的诗词列表
const filteredPoems = computed(() => {
  let filtered = poems.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(poem => 
      poem.title.toLowerCase().includes(query) ||
      poem.author.toLowerCase().includes(query) ||
      poem.content.toLowerCase().includes(query) ||
      poem.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 朝代过滤
  if (selectedDynasty.value) {
    filtered = filtered.filter(poem => poem.dynasty === selectedDynasty.value)
  }
  
  // 题材过滤
  if (selectedType.value) {
    filtered = filtered.filter(poem => poem.tags.includes(selectedType.value))
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

// 获取诗词预览
const getPoemPreview = (content) => {
  return content.split('。')[0] + '。' // 取第一句
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

// 查看诗词详情
const viewPoemDetail = (poemId) => {
  router.push(`/poems/${poemId}`)
}
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