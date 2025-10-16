// MCP (Model Context Protocol) Servers 配置
// Supabase MCP 服务器配置

import { getSupabase, TABLES } from './supabase.js'

/**
 * MCP服务器管理器
 * 用于管理Supabase相关的MCP服务
 */
class MCPServerManager {
  constructor() {
    this.supabase = getSupabase()
    this.servers = new Map()
    this.initializeServers()
  }

  /**
   * 初始化所有MCP服务器
   */
  initializeServers() {
    // 诗歌数据服务
    this.servers.set('poemService', {
      name: '诗歌数据服务',
      description: '提供诗歌数据的CRUD操作',
      endpoints: {
        getAll: this.createPoemService().getAll,
        getById: this.createPoemService().getById,
        getByPoet: this.createPoemService().getByPoet,
        create: this.createPoemService().create,
        update: this.createPoemService().update,
        delete: this.createPoemService().delete
      }
    })

    // 诗人数据服务
    this.servers.set('poetService', {
      name: '诗人数据服务',
      description: '提供诗人数据的CRUD操作',
      endpoints: {
        getAll: this.createPoetService().getAll,
        getById: this.createPoetService().getById,
        getByDynasty: this.createPoetService().getByDynasty
      }
    })

    // 搜索服务
    this.servers.set('searchService', {
      name: '搜索服务',
      description: '提供全文搜索功能',
      endpoints: {
        searchPoems: this.createSearchService().searchPoems,
        searchPoets: this.createSearchService().searchPoets
      }
    })

    // 用户行为服务
    this.servers.set('userBehaviorService', {
      name: '用户行为服务',
      description: '记录和分析用户阅读行为',
      endpoints: {
        trackReading: this.createUserBehaviorService().trackReading,
        getUserHistory: this.createUserBehaviorService().getUserHistory
      }
    })

    // AI解释服务
    this.servers.set('aiInterpretationService', {
      name: 'AI解释服务',
      description: '提供AI对诗歌的智能解释',
      endpoints: {
        getInterpretation: this.createAIInterpretationService().getInterpretation,
        createInterpretation: this.createAIInterpretationService().createInterpretation
      }
    })
  }

  /**
   * 创建诗歌数据服务
   */
  createPoemService() {
    const supabase = this.supabase
    return {
      getAll: async (options = {}) => {
        const { limit = 50, offset = 0, orderBy = 'created_at' } = options
        return await supabase
          .from(TABLES.POEMS)
          .select('*')
          .order(orderBy, { ascending: false })
          .range(offset, offset + limit - 1)
      },
      
      getById: async (id) => {
        return await supabase
          .from(TABLES.POEMS)
          .select('*')
          .eq('id', id)
          .single()
      },
      
      getByPoet: async (poetId, options = {}) => {
        const { limit = 20, offset = 0 } = options
        return await supabase
          .from(TABLES.POEMS)
          .select('*')
          .eq('poet_id', poetId)
          .range(offset, offset + limit - 1)
      },
      
      create: async (poemData) => {
        return await supabase
          .from(TABLES.POEMS)
          .insert([poemData])
          .select()
      },
      
      update: async (id, updates) => {
        return await supabase
          .from(TABLES.POEMS)
          .update(updates)
          .eq('id', id)
          .select()
      },
      
      delete: async (id) => {
        return await supabase
          .from(TABLES.POEMS)
          .delete()
          .eq('id', id)
      }
    }
  }

  /**
   * 创建诗人数据服务
   */
  createPoetService() {
    const supabase = this.supabase
    return {
      getAll: async (options = {}) => {
        const { limit = 50, offset = 0 } = options
        return await supabase
          .from(TABLES.POETS)
          .select('*')
          .range(offset, offset + limit - 1)
      },
      
      getById: async (id) => {
        return await supabase
          .from(TABLES.POETS)
          .select('*')
          .eq('id', id)
          .single()
      },
      
      getByDynasty: async (dynasty) => {
        return await supabase
          .from(TABLES.POETS)
          .select('*')
          .eq('dynasty', dynasty)
      }
    }
  }

  /**
   * 创建搜索服务
   */
  createSearchService() {
    const supabase = this.supabase
    return {
      searchPoems: async (query, options = {}) => {
        const { limit = 20, offset = 0 } = options
        return await supabase
          .from(TABLES.POEMS)
          .select('*')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .range(offset, offset + limit - 1)
      },
      
      searchPoets: async (query) => {
        return await supabase
          .from(TABLES.POETS)
          .select('*')
          .or(`name.ilike.%${query}%,dynasty.ilike.%${query}%`)
      }
    }
  }

  /**
   * 创建用户行为服务
   */
  createUserBehaviorService() {
    const supabase = this.supabase
    return {
      trackReading: async (userId, poemId, duration) => {
        const behaviorData = {
          user_id: userId,
          poem_id: poemId,
          read_duration: duration,
          read_at: new Date().toISOString()
        }
        return await supabase
          .from(TABLES.USER_BEHAVIOR)
          .insert([behaviorData])
      },
      
      getUserHistory: async (userId, options = {}) => {
        const { limit = 20, offset = 0 } = options
        return await supabase
          .from(TABLES.USER_BEHAVIOR)
          .select(`
            *,
            poems (*)
          `)
          .eq('user_id', userId)
          .order('read_at', { ascending: false })
          .range(offset, offset + limit - 1)
      }
    }
  }

  /**
   * 创建推荐服务
   */
  createRecommendationService() {
    const supabase = this.supabase
    return {
      getRecommendations: async (userId, options = {}) => {
        const { limit = 10 } = options
        // 基于用户阅读历史推荐相似诗歌
        return await supabase
          .rpc('get_poem_recommendations', {
            user_id: userId,
            rec_limit: limit
          })
      }
    }
  }

  /**
   * 创建AI解释服务
   */
  createAIInterpretationService() {
    const supabase = this.supabase
    return {
      getInterpretation: async (poemId) => {
        return await supabase
          .from(TABLES.AI_INTERPRETATION)
          .select('*')
          .eq('poem_id', poemId)
          .single()
      },
      
      createInterpretation: async (poemId, interpretation) => {
        const interpretationData = {
          poem_id: poemId,
          interpretation: interpretation,
          created_at: new Date().toISOString()
        }
        return await supabase
          .from(TABLES.AI_INTERPRETATION)
          .insert([interpretationData])
      }
    }
  }

  /**
   * 创建缓存服务
   */
  createCacheService() {
    const supabase = this.supabase
    return {
      getCachedData: async (key) => {
        return await supabase
          .from('cache')
          .select('*')
          .eq('key', key)
          .single()
      },
      
      setCachedData: async (key, data, ttl = 3600) => {
        const cacheData = {
          key,
          data,
          expires_at: new Date(Date.now() + ttl * 1000).toISOString()
        }
        return await supabase
          .from('cache')
          .upsert(cacheData)
      }
    }
  }

  /**
   * 获取指定服务器
   */
  getServer(serverName) {
    return this.servers.get(serverName)
  }

  /**
   * 获取所有服务器列表
   */
  getAllServers() {
    return Array.from(this.servers.entries()).map(([name, config]) => ({
      name,
      ...config
    }))
  }

  /**
   * 检查服务器健康状态
   */
  async checkHealth() {
    const healthStatus = {}
    
    for (const [serverName, serverConfig] of this.servers.entries()) {
      try {
        // 测试基础连接
        const testResult = await this.supabase.from(TABLES.POEMS).select('count').limit(1)
        healthStatus[serverName] = {
          status: testResult.error ? 'error' : 'healthy',
          lastChecked: new Date().toISOString(),
          error: testResult.error ? testResult.error.message : null
        }
      } catch (error) {
        healthStatus[serverName] = {
          status: 'error',
          lastChecked: new Date().toISOString(),
          error: error.message
        }
      }
    }
    
    return healthStatus
  }
}

// 创建单例实例
let mcpServerManager = null

export const getMCPServerManager = () => {
  if (!mcpServerManager) {
    mcpServerManager = new MCPServerManager()
  }
  return mcpServerManager
}

export const initMCPServers = () => {
  return getMCPServerManager()
}

export default getMCPServerManager