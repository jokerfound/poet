// 诗词服务 - 提供诗词数据的获取和管理功能
import { ref } from 'vue'
import { api, handleSupabaseError } from '../supabase/config.js'

// 诗词服务类
class PoemService {
  constructor() {
    this.poems = ref([])
    this.poets = ref([])
    this.loading = ref(false)
    this.error = ref(null)
    this.connectionStatus = ref('checking')
  }

  // 检查数据库连接状态
  async checkConnection() {
    try {
      const result = await api.checkConnection()
      this.connectionStatus.value = result.connected ? 'connected' : 'disconnected'
      return result.connected
    } catch (error) {
      this.connectionStatus.value = 'error'
      return false
    }
  }

  // 获取诗词列表
  async getPoems(limit = 50, offset = 0) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const poems = await api.getPoems(limit, offset)
      this.poems.value = poems
      return poems
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      
      // 如果连接失败，返回模拟数据作为降级方案
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn('使用模拟数据作为降级方案')
        return this.getMockPoems(limit)
      }
      
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 获取诗词详情
  async getPoemById(id) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const poem = await api.getPoemById(id)
      return poem
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      
      // 降级到模拟数据
      if (error.code === 'PGRST116') {
        return this.getMockPoemById(id)
      }
      
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 搜索诗词
  async searchPoems(query, limit = 20) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const results = await api.searchPoems(query, limit)
      return results
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      
      // 降级到本地搜索
      if (error.code === 'PGRST116') {
        return this.localSearchPoems(query, limit)
      }
      
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 获取诗人列表
  async getPoets(limit = 50) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const poets = await api.getPoets(limit)
      this.poets.value = poets
      return poets
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      
      if (error.code === 'PGRST116') {
        return this.getMockPoets(limit)
      }
      
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 获取诗人详情
  async getPoetById(id) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const poet = await api.getPoetById(id)
      return poet
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      
      if (error.code === 'PGRST116') {
        return this.getMockPoetById(id)
      }
      
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 根据朝代获取诗人
  async getPoetsByDynasty(dynasty) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const poets = await api.getPoetsByDynasty(dynasty)
      return poets
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 获取热门诗词
  async getPopularPoems(limit = 10) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const poems = await api.getPopularPoems(limit)
      return poems
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      
      if (error.code === 'PGRST116') {
        return this.getMockPoems(limit)
      }
      
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 获取相关推荐
  async getRelatedPoems(poemId, limit = 5) {
    this.loading.value = true
    this.error.value = null
    
    try {
      const poems = await api.getRelatedPoems(poemId, limit)
      return poems
    } catch (error) {
      const handledError = handleSupabaseError(error)
      this.error.value = handledError.message
      
      if (error.code === 'PGRST116') {
        return this.getMockPoems(limit)
      }
      
      throw handledError
    } finally {
      this.loading.value = false
    }
  }

  // 记录阅读行为
  async trackReading(poemId, duration = 60) {
    try {
      await api.trackReading(poemId, null, duration)
    } catch (error) {
      console.warn('记录阅读行为失败:', error.message)
      // 静默失败，不中断用户体验
    }
  }

  // 获取朝代统计
  async getDynastyStatistics() {
    try {
      const stats = await api.getDynastyStatistics()
      return stats
    } catch (error) {
      console.warn('获取朝代统计失败:', error.message)
      return []
    }
  }

  // 获取诗人统计
  async getPoetStatistics(poetId) {
    try {
      const stats = await api.getPoetStatistics(poetId)
      return stats
    } catch (error) {
      console.warn('获取诗人统计失败:', error.message)
      return null
    }
  }

  // 降级方案：模拟数据
  getMockPoems(limit = 10) {
    return [
      {
        id: 1,
        title: '静夜思',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        poet: { name: '李白', dynasty: '唐' },
        dynasty: '唐',
        theme: '思乡',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: '春晓',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        poet: { name: '孟浩然', dynasty: '唐' },
        dynasty: '唐',
        theme: '春天',
        created_at: '2023-01-02T00:00:00Z'
      }
    ].slice(0, limit)
  }

  getMockPoemById(id) {
    const poems = this.getMockPoems()
    return poems.find(p => p.id === id) || poems[0]
  }

  getMockPoets(limit = 10) {
    return [
      {
        id: 1,
        name: '李白',
        dynasty: '唐',
        biography: '唐代著名诗人，诗仙',
        works_count: 1000
      },
      {
        id: 2,
        name: '杜甫',
        dynasty: '唐',
        biography: '唐代著名诗人，诗圣',
        works_count: 1400
      }
    ].slice(0, limit)
  }

  getMockPoetById(id) {
    const poets = this.getMockPoets()
    return poets.find(p => p.id === id) || poets[0]
  }

  localSearchPoems(query, limit = 20) {
    const poems = this.getMockPoems(50)
    return poems.filter(poem => 
      poem.title.includes(query) || 
      poem.content.includes(query) ||
      poem.poet.name.includes(query)
    ).slice(0, limit)
  }

  // 清除错误
  clearError() {
    this.error.value = null
  }
}

// 创建服务实例
const poemService = new PoemService()

// 初始化时检查连接状态
poemService.checkConnection()

export default poemService