// 静态诗词服务 - 确保页面能够正常显示
import { ref } from 'vue'

// 静态诗词数据
const staticPoems = [
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    popularity: 95
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    popularity: 88
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    popularity: 92
  },
  {
    id: 4,
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐代',
    content: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。',
    popularity: 85
  }
]

// 平台统计数据
const staticStats = {
  totalPoems: '5000+',
  totalPoets: '300+',
  totalDynasties: '10+',
  aiAnalyses: '10000+'
}

// 静态诗词服务类
class StaticPoemService {
  constructor() {
    this.poems = ref([])
    this.stats = ref({})
    this.loading = ref(false)
  }

  // 获取推荐诗词
  async getRecommendedPoems(limit = 4) {
    this.loading.value = true
    try {
      // 模拟异步延迟
      await new Promise(resolve => setTimeout(resolve, 100))
      return staticPoems.slice(0, limit)
    } finally {
      this.loading.value = false
    }
  }

  // 获取平台统计
  async getPlatformStats() {
    this.loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      return staticStats
    } finally {
      this.loading.value = false
    }
  }

  // 获取所有诗词
  async getAllPoems() {
    this.loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      return staticPoems
    } finally {
      this.loading.value = false
    }
  }

  // 搜索诗词
  async searchPoems(query) {
    this.loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 150))
      return staticPoems.filter(poem => 
        poem.title.includes(query) || 
        poem.author.includes(query) ||
        poem.content.includes(query)
      )
    } finally {
      this.loading.value = false
    }
  }
}

// 创建服务实例
const staticPoemService = new StaticPoemService()

export default staticPoemService