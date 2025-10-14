import { getSupabase, TABLES } from '../config/supabase.js'

// 诗词数据服务
export class PoemService {
  constructor() {
    this.supabase = getSupabase()
  }

  // 获取所有诗词
  async getAllPoems(limit = 50, offset = 0) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          poets (*)
        `)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取诗词列表失败:', error)
      return this.getMockPoems() // 返回模拟数据
    }
  }

  // 根据ID获取诗词详情
  async getPoemById(id) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          poets (*),
          annotations (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('获取诗词详情失败:', error)
      return this.getMockPoemById(id) // 返回模拟数据
    }
  }

  // 搜索诗词
  async searchPoems(query, limit = 20) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          poets (*)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,poets.name.ilike.%${query}%`)
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('搜索诗词失败:', error)
      return this.searchMockPoems(query) // 返回模拟搜索结果
    }
  }

  // 根据诗人获取诗词
  async getPoemsByPoet(poetId, limit = 20) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          poets (*)
        `)
        .eq('poet_id', poetId)
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取诗人诗词失败:', error)
      return this.getMockPoemsByPoet(poetId)
    }
  }

  // 获取所有诗人
  async getAllPoets(limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.POETS)
        .select('*')
        .limit(limit)
        .order('dynasty')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取诗人列表失败:', error)
      return this.getMockPoets()
    }
  }

  // 根据朝代获取诗人
  async getPoetsByDynasty(dynasty) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.POETS)
        .select('*')
        .eq('dynasty', dynasty)
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取朝代诗人失败:', error)
      return this.getMockPoetsByDynasty(dynasty)
    }
  }

  // 添加阅读记录
  async addReadingRecord(poemId, userId = null) {
    try {
      const record = {
        poem_id: poemId,
        user_id: userId,
        read_at: new Date().toISOString()
      }

      const { data, error } = await this.supabase
        .from(TABLES.USER_BEHAVIOR)
        .insert(record)

      if (error) throw error
      return data
    } catch (error) {
      console.error('添加阅读记录失败:', error)
      return null
    }
  }

  // 获取热门诗词
  async getPopularPoems(limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.USER_BEHAVIOR)
        .select(`
          poem_id,
          poems (*, poets (*)),
          count:count(*)
        `)
        .group('poem_id, poems(id, title, content, poets(id, name))')
        .order('count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data?.map(item => ({
        ...item.poems,
        read_count: item.count
      })) || []
    } catch (error) {
      console.error('获取热门诗词失败:', error)
      return this.getMockPopularPoems()
    }
  }

  // 模拟数据方法
  getMockPoems() {
    return [
      {
        id: 1,
        title: '静夜思',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        poet_id: 1,
        dynasty: '唐',
        created_at: '2024-01-01T00:00:00Z',
        poets: {
          id: 1,
          name: '李白',
          dynasty: '唐',
          description: '唐代著名诗人，诗仙'
        }
      },
      {
        id: 2,
        title: '春晓',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        poet_id: 2,
        dynasty: '唐',
        created_at: '2024-01-01T00:00:00Z',
        poets: {
          id: 2,
          name: '孟浩然',
          dynasty: '唐',
          description: '唐代山水田园诗人'
        }
      }
    ]
  }

  getMockPoemById(id) {
    const poems = this.getMockPoems()
    return poems.find(poem => poem.id === parseInt(id)) || null
  }

  searchMockPoems(query) {
    const poems = this.getMockPoems()
    return poems.filter(poem => 
      poem.title.includes(query) || 
      poem.content.includes(query) ||
      poem.poets.name.includes(query)
    )
  }

  getMockPoets() {
    return [
      { id: 1, name: '李白', dynasty: '唐', description: '唐代著名诗人，诗仙' },
      { id: 2, name: '杜甫', dynasty: '唐', description: '唐代著名诗人，诗圣' },
      { id: 3, name: '孟浩然', dynasty: '唐', description: '唐代山水田园诗人' },
      { id: 4, name: '苏轼', dynasty: '宋', description: '宋代文学家，唐宋八大家之一' }
    ]
  }

  getMockPoemsByPoet(poetId) {
    const poems = this.getMockPoems()
    return poems.filter(poem => poem.poet_id === parseInt(poetId))
  }

  getMockPoetsByDynasty(dynasty) {
    const poets = this.getMockPoets()
    return poets.filter(poet => poet.dynasty === dynasty)
  }

  getMockPopularPoems() {
    const poems = this.getMockPoems()
    return poems.map(poem => ({
      ...poem,
      read_count: Math.floor(Math.random() * 100) + 1
    })).sort((a, b) => b.read_count - a.read_count).slice(0, 10)
  }
}

export default new PoemService()