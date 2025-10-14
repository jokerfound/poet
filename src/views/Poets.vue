<template>
  <div class="poets">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>诗人介绍</h1>
        <p>了解历代诗人的生平事迹和创作风格</p>
        <div class="header-actions">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索诗人姓名..."
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
          </div>
        </div>
      </div>

      <!-- 诗人列表 -->
      <div class="poets-grid">
        <div 
          class="poet-card" 
          v-for="poet in filteredPoets" 
          :key="poet.id"
          @click="viewPoetDetail(poet.id)"
        >
          <div class="poet-avatar">
            <span class="avatar-icon">{{ poet.avatar }}</span>
          </div>
          <div class="poet-info">
            <h3 class="poet-name">{{ poet.name }}</h3>
            <p class="poet-dynasty">{{ poet.dynasty }}</p>
            <p class="poet-lifespan">{{ poet.lifespan }}</p>
            <div class="poet-stats">
              <span class="stat">
                <span class="stat-icon">📖</span>
                {{ poet.poemCount }}首
              </span>
              <span class="stat">
                <span class="stat-icon">⭐</span>
                {{ poet.popularity }}
              </span>
            </div>
            <p class="poet-intro">{{ poet.introduction }}</p>
            <div class="poet-tags">
              <span class="tag" v-for="tag in poet.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredPoets.length === 0">
        <div class="empty-icon">👥</div>
        <h3>暂无诗人信息</h3>
        <p>尝试调整搜索条件</p>
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

// 朝代选项
const dynasties = ref(['唐代', '宋代', '元代', '明代', '清代', '汉代', '魏晋'])

// 诗人数据
const poets = ref([
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    lifespan: '701年-762年',
    avatar: '🍷',
    poemCount: 1010,
    popularity: '诗仙',
    introduction: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。其诗豪放飘逸，想象丰富，语言流转自然。',
    tags: ['浪漫主义', '豪放', '酒仙', '游侠']
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐代',
    lifespan: '712年-770年',
    avatar: '📚',
    poemCount: 1400,
    popularity: '诗圣',
    introduction: '唐代伟大的现实主义诗人，被尊为"诗圣"。其诗沉郁顿挫，反映社会现实，语言精炼。',
    tags: ['现实主义', '沉郁', '忧国忧民', '史诗']
  },
  {
    id: 3,
    name: '白居易',
    dynasty: '唐代',
    lifespan: '772年-846年',
    avatar: '✍️',
    poemCount: 2800,
    popularity: '诗魔',
    introduction: '唐代伟大的现实主义诗人，主张"文章合为时而著，歌诗合为事而作"。',
    tags: ['现实主义', '通俗', '讽喻', '新乐府']
  },
  {
    id: 4,
    name: '王维',
    dynasty: '唐代',
    lifespan: '701年-761年',
    avatar: '🎨',
    poemCount: 400,
    popularity: '诗佛',
    introduction: '唐代著名诗人、画家，被誉为"诗佛"。其诗清新淡远，自然脱俗，充满禅意。',
    tags: ['山水田园', '禅意', '诗画一体', '隐逸']
  },
  {
    id: 5,
    name: '苏轼',
    dynasty: '宋代',
    lifespan: '1037年-1101年',
    avatar: '🌊',
    poemCount: 2700,
    popularity: '东坡居士',
    introduction: '宋代文学巨匠，诗、词、文、书、画俱佳，豪放词派代表人物。',
    tags: ['豪放派', '全才', '乐观', '豁达']
  },
  {
    id: 6,
    name: '李清照',
    dynasty: '宋代',
    lifespan: '1084年-1155年',
    avatar: '🌸',
    poemCount: 60,
    popularity: '易安居士',
    introduction: '宋代著名女词人，婉约词派代表，其词语言清丽，感情真挚。',
    tags: ['婉约派', '女词人', '深情', '细腻']
  },
  {
    id: 7,
    name: '辛弃疾',
    dynasty: '宋代',
    lifespan: '1140年-1207年',
    avatar: '⚔️',
    poemCount: 600,
    popularity: '稼轩居士',
    introduction: '宋代豪放派词人，其词慷慨悲壮，充满爱国热情和英雄气概。',
    tags: ['豪放派', '爱国', '英雄', '悲壮']
  },
  {
    id: 8,
    name: '陆游',
    dynasty: '宋代',
    lifespan: '1125年-1210年',
    avatar: '💔',
    poemCount: 9300,
    popularity: '放翁',
    introduction: '宋代爱国诗人，其诗充满爱国热情，风格雄浑豪放，语言平易晓畅。',
    tags: ['爱国', '豪放', '忧国', '高产']
  }
])

// 过滤后的诗人列表
const filteredPoets = computed(() => {
  let filtered = poets.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(poet => 
      poet.name.toLowerCase().includes(query) ||
      poet.introduction.toLowerCase().includes(query) ||
      poet.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 朝代过滤
  if (selectedDynasty.value) {
    filtered = filtered.filter(poet => poet.dynasty === selectedDynasty.value)
  }
  
  return filtered
})

// 查看诗人详情
const viewPoetDetail = (poetId) => {
  router.push(`/poets/${poetId}`)
}
</script>

<style scoped>
.poets {
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
  max-width: 300px;
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

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.poet-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 1.5rem;
}

.poet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.poet-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  font-size: 3rem;
  display: block;
}

.poet-info {
  flex: 1;
}

.poet-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poet-dynasty {
  color: #3498db;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.poet-lifespan {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.poet-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #718096;
  font-size: 0.9rem;
}

.poet-intro {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poet-tags {
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

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .poets-grid {
    grid-template-columns: 1fr;
  }
  
  .poet-card {
    flex-direction: column;
    text-align: center;
  }
  
  .poet-stats {
    justify-content: center;
  }
}
</style>