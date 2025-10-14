<template>
  <div class="categories">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>分类浏览</h1>
        <p>按朝代、题材、风格等多种方式探索诗词世界</p>
      </div>

      <!-- 朝代分类 -->
      <section class="category-section">
        <h2 class="section-title">按朝代浏览</h2>
        <div class="dynasty-grid">
          <div 
            class="dynasty-card" 
            v-for="dynasty in dynasties" 
            :key="dynasty.id"
            @click="browseByDynasty(dynasty.name)"
          >
            <div class="dynasty-icon">{{ dynasty.icon }}</div>
            <h3>{{ dynasty.name }}</h3>
            <p>{{ dynasty.period }}</p>
            <div class="dynasty-stats">
              <span class="stat">{{ dynasty.poetCount }}位诗人</span>
              <span class="stat">{{ dynasty.poemCount }}首诗词</span>
            </div>
            <p class="dynasty-desc">{{ dynasty.description }}</p>
          </div>
        </div>
      </section>

      <!-- 题材分类 -->
      <section class="category-section">
        <h2 class="section-title">按题材浏览</h2>
        <div class="theme-grid">
          <div 
            class="theme-card" 
            v-for="theme in themes" 
            :key="theme.id"
            @click="browseByTheme(theme.name)"
          >
            <div class="theme-header">
              <span class="theme-icon">{{ theme.icon }}</span>
              <h3>{{ theme.name }}</h3>
            </div>
            <p class="theme-desc">{{ theme.description }}</p>
            <div class="theme-examples">
              <span class="example" v-for="example in theme.examples" :key="example">
                {{ example }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 风格分类 -->
      <section class="category-section">
        <h2 class="section-title">按风格浏览</h2>
        <div class="style-grid">
          <div 
            class="style-card" 
            v-for="style in styles" 
            :key="style.id"
            @click="browseByStyle(style.name)"
          >
            <div class="style-badge" :class="style.color">
              {{ style.name }}
            </div>
            <p class="style-desc">{{ style.description }}</p>
            <div class="style-representatives">
              <h4>代表诗人</h4>
              <div class="poets-list">
                <span class="poet" v-for="poet in style.representatives" :key="poet">
                  {{ poet }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门标签 -->
      <section class="category-section">
        <h2 class="section-title">热门标签</h2>
        <div class="tags-cloud">
          <span 
            class="tag" 
            v-for="tag in popularTags" 
            :key="tag.name"
            :style="{ fontSize: tag.size + 'rem' }"
            @click="browseByTag(tag.name)"
          >
            {{ tag.name }}
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 朝代分类数据
const dynasties = ref([
  {
    id: 1,
    name: '唐代',
    icon: '🏛️',
    period: '618-907年',
    poetCount: '2000+',
    poemCount: '50000+',
    description: '诗歌发展的黄金时代，涌现出李白、杜甫等伟大诗人'
  },
  {
    id: 2,
    name: '宋代',
    icon: '🎨',
    period: '960-1279年',
    poetCount: '9000+',
    poemCount: '200000+',
    description: '词的发展达到顶峰，苏轼、李清照等词人各领风骚'
  },
  {
    id: 3,
    name: '元代',
    icon: '🎭',
    period: '1271-1368年',
    poetCount: '2000+',
    poemCount: '30000+',
    description: '散曲兴起，诗词创作继续发展'
  },
  {
    id: 4,
    name: '明代',
    icon: '📜',
    period: '1368-1644年',
    poetCount: '10000+',
    poemCount: '100000+',
    description: '诗词创作承前启后，出现众多文学流派'
  },
  {
    id: 5,
    name: '清代',
    icon: '👑',
    period: '1644-1912年',
    poetCount: '20000+',
    poemCount: '400000+',
    description: '诗词创作繁荣，出现众多著名诗人和词人'
  }
])

// 题材分类数据
const themes = ref([
  {
    id: 1,
    name: '山水田园',
    icon: '🏞️',
    description: '描写自然风光和田园生活的诗歌',
    examples: ['《山居秋暝》', '《饮酒》', '《江雪》']
  },
  {
    id: 2,
    name: '边塞征战',
    icon: '⚔️',
    description: '反映边塞生活和战争场景的诗歌',
    examples: ['《从军行》', '《凉州词》', '《出塞》']
  },
  {
    id: 3,
    name: '咏史怀古',
    icon: '📜',
    description: '借古讽今，抒发历史感慨的诗歌',
    examples: ['《赤壁》', '《登金陵凤凰台》', '《蜀相》']
  },
  {
    id: 4,
    name: '爱情相思',
    icon: '💕',
    description: '表达爱情和相思之情的诗歌',
    examples: ['《相思》', '《锦瑟》', '《雨霖铃》']
  },
  {
    id: 5,
    name: '离别送别',
    icon: '👋',
    description: '抒发离别之情和送别之意的诗歌',
    examples: ['《送元二使安西》', '《芙蓉楼送辛渐》', '《别董大》']
  },
  {
    id: 6,
    name: '咏物言志',
    icon: '🎯',
    description: '通过咏物来表达志向和情感的诗歌',
    examples: ['《石灰吟》', '《梅花》', '《竹石》']
  }
])

// 风格分类数据
const styles = ref([
  {
    id: 1,
    name: '豪放派',
    color: 'bold',
    description: '气势磅礴，情感奔放，语言雄浑',
    representatives: ['李白', '苏轼', '辛弃疾']
  },
  {
    id: 2,
    name: '婉约派',
    color: 'gentle',
    description: '情感细腻，语言婉转，意境优美',
    representatives: ['李清照', '柳永', '秦观']
  },
  {
    id: 3,
    name: '现实主义',
    color: 'realistic',
    description: '反映社会现实，关注民生疾苦',
    representatives: ['杜甫', '白居易', '陆游']
  },
  {
    id: 4,
    name: '浪漫主义',
    color: 'romantic',
    description: '想象丰富，情感热烈，追求理想',
    representatives: ['李白', '李贺', '屈原']
  }
])

// 热门标签数据
const popularTags = ref([
  { name: '月亮', size: 1.8 },
  { name: '春天', size: 1.6 },
  { name: '思乡', size: 1.5 },
  { name: '爱情', size: 1.7 },
  { name: '山水', size: 1.4 },
  { name: '送别', size: 1.3 },
  { name: '边塞', size: 1.2 },
  { name: '咏史', size: 1.1 },
  { name: '田园', size: 1.3 },
  { name: '豪放', size: 1.2 },
  { name: '婉约', size: 1.1 },
  { name: '酒', size: 1.4 },
  { name: '花', size: 1.3 },
  { name: '雪', size: 1.2 },
  { name: '秋', size: 1.1 }
])

// 浏览功能
const browseByDynasty = (dynasty) => {
  router.push(`/search?q=${dynasty}`)
}

const browseByTheme = (theme) => {
  router.push(`/search?q=${theme}`)
}

const browseByStyle = (style) => {
  router.push(`/search?q=${style}`)
}

const browseByTag = (tag) => {
  router.push(`/search?q=${tag}`)
}
</script>

<style scoped>
.categories {
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
}

.category-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.dynasty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dynasty-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.dynasty-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dynasty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.dynasty-card h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.dynasty-card p {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.dynasty-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.dynasty-stats .stat {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.dynasty-desc {
  color: #718096;
  line-height: 1.6;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.theme-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.theme-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.theme-icon {
  font-size: 2rem;
}

.theme-header h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
}

.theme-desc {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.theme-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.style-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.style-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.style-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  color: white;
  font-weight: 500;
  margin-bottom: 1rem;
}

.style-badge.bold {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.style-badge.gentle {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}

.style-badge.realistic {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.style-badge.romantic {
  background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
}

.style-desc {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.style-representatives h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poets-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.poet {
  background: #f8f9fa;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tag:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .dynasty-grid,
  .theme-grid,
  .style-grid {
    grid-template-columns: 1fr;
  }
  
  .tags-cloud {
    gap: 0.5rem;
  }
  
  .tag {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>