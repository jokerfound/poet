// Supabase API配置
// 用于配置Supabase客户端和API端点

import { createClient } from '@supabase/supabase-js'

// 环境变量配置
const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  serviceKey: import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'your-service-key'
}

// 创建Supabase客户端
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// API端点配置
export const API_ENDPOINTS = {
  // 诗词相关
  POEMS: {
    LIST: '/poems',
    DETAIL: (id) => `/poems/${id}`,
    SEARCH: '/poems/search',
    POPULAR: '/poems/popular',
    BY_POET: (poetId) => `/poems/poet/${poetId}`,
    RELATED: (id) => `/poems/${id}/related`
  },
  
  // 诗人相关
  POETS: {
    LIST: '/poets',
    DETAIL: (id) => `/poets/${id}`,
    BY_DYNASTY: (dynasty) => `/poets/dynasty/${dynasty}`,
    STATISTICS: (id) => `/poets/${id}/statistics`
  },
  
  // 搜索相关
  SEARCH: {
    GLOBAL: '/search',
    POEMS: '/search/poems',
    POETS: '/search/poets'
  },
  
  // 用户行为
  USER: {
    READING_HISTORY: '/user/reading-history',
    FAVORITES: '/user/favorites',
    RECOMMENDATIONS: '/user/recommendations'
  },
  
  // 统计分析
  ANALYTICS: {
    DYNASTY_STATS: '/analytics/dynasty-stats',
    POPULAR_THEMES: '/analytics/popular-themes',
    READING_TRENDS: '/analytics/reading-trends'
  }
}

// REST API客户端
export class SupabaseAPI {
  constructor() {
    this.supabase = supabase
  }

  // 通用GET请求
  async get(endpoint, params = {}) {
    const { data, error } = await this.supabase
      .from(endpoint.replace('/', ''))
      .select('*')
      .match(params)
    
    if (error) throw error
    return data
  }

  // 获取诗词列表
  async getPoems(limit = 50, offset = 0) {
    const { data, error } = await this.supabase
      .from('poems')
      .select(`
        *,
        poets (*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data
  }

  // 获取诗词详情
  async getPoemById(id) {
    const { data, error } = await this.supabase
      .from('poems')
      .select(`
        *,
        poets (*),
        annotations (*),
        imagery (*),
        multimedia_assets (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // 搜索诗词
  async searchPoems(query, limit = 20) {
    // 使用全文搜索函数
    const { data, error } = await this.supabase
      .rpc('search_poems', { 
        search_query: query, 
        limit_count: limit 
      })
    
    if (error) throw error
    return data
  }

  // 获取热门诗词
  async getPopularPoems(limit = 10) {
    const { data, error } = await this.supabase
      .rpc('get_popular_poems', { limit_count: limit })
    
    if (error) throw error
    return data
  }

  // 获取诗人列表
  async getPoets(limit = 50) {
    const { data, error } = await this.supabase
      .from('poets')
      .select('*')
      .order('name')
      .limit(limit)
    
    if (error) throw error
    return data
  }

  // 获取诗人详情
  async getPoetById(id) {
    const { data, error } = await this.supabase
      .from('poets')
      .select(`
        *,
        poems (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // 根据朝代获取诗人
  async getPoetsByDynasty(dynasty) {
    const { data, error } = await this.supabase
      .from('poets')
      .select('*')
      .eq('dynasty', dynasty)
    
    if (error) throw error
    return data
  }

  // 记录阅读行为
  async trackReading(poemId, userId = null, duration = 60) {
    const { data, error } = await this.supabase
      .from('user_reading_behavior')
      .insert([{
        user_id: userId,
        poem_id: poemId,
        read_duration: duration,
        read_at: new Date().toISOString()
      }])
    
    if (error) throw error
    return data
  }

  // 获取相关推荐
  async getRelatedPoems(poemId, limit = 5) {
    const { data, error } = await this.supabase
      .rpc('get_related_poems', { 
        poem_id: poemId, 
        limit_count: limit 
      })
    
    if (error) throw error
    return data
  }

  // 获取朝代统计
  async getDynastyStatistics() {
    const { data, error } = await this.supabase
      .rpc('get_dynasty_statistics')
    
    if (error) throw error
    return data
  }

  // 获取诗人统计
  async getPoetStatistics(poetId) {
    const { data, error } = await this.supabase
      .rpc('get_poet_statistics', { poet_id: poetId })
    
    if (error) throw error
    return data
  }
}

// 导出API实例
export const api = new SupabaseAPI()

// 错误处理工具
export const handleSupabaseError = (error) => {
  console.error('Supabase错误:', error)
  
  if (error.code === 'PGRST116') {
    return { success: false, message: '未找到请求的资源' }
  }
  
  if (error.code === '42501') {
    return { success: false, message: '权限不足' }
  }
  
  if (error.code === '42P01') {
    return { success: false, message: '数据库表不存在，请检查迁移' }
  }
  
  return { success: false, message: error.message }
}

// 连接状态检查
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('poems').select('count').limit(1)
    return { connected: !error, error: error?.message }
  } catch (error) {
    return { connected: false, error: error.message }
  }
}

export default api