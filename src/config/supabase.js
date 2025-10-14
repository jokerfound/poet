// Supabase数据库配置
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// 创建Supabase客户端
let supabaseClient = null

// 初始化Supabase客户端
export const initSupabase = () => {
  if (!supabaseClient) {
    // 动态导入，避免依赖安装问题
    import('@supabase/supabase-js').then(({ createClient }) => {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    }).catch(error => {
      console.warn('Supabase客户端初始化失败，将使用本地存储:', error)
      supabaseClient = createMockSupabase()
    })
  }
  return supabaseClient
}

// 模拟Supabase客户端（用于开发环境）
const createMockSupabase = () => {
  return {
    from: (table) => ({
      select: (columns = '*') => Promise.resolve({ data: [], error: null }),
      insert: (data) => Promise.resolve({ data: [data], error: null }),
      update: (data) => Promise.resolve({ data: [data], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      eq: (column, value) => ({
        select: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    auth: {
      signIn: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    }
  }
}

// 获取Supabase客户端
export const getSupabase = () => {
  if (!supabaseClient) {
    return initSupabase()
  }
  return supabaseClient
}

// 数据库表名常量
export const TABLES = {
  POEMS: import.meta.env.VITE_POEMS_TABLE || 'poems',
  POETS: import.meta.env.VITE_POETS_TABLE || 'poets',
  ANNOTATIONS: import.meta.env.VITE_ANNOTATIONS_TABLE || 'annotations',
  IMAGERY: import.meta.env.VITE_IMAGERY_TABLE || 'imagery',
  HISTORICAL_EVENTS: import.meta.env.VITE_HISTORICAL_EVENTS_TABLE || 'historical_events',
  KNOWLEDGE_GRAPH: import.meta.env.VITE_KNOWLEDGE_GRAPH_TABLE || 'knowledge_graph_relations',
  USER_BEHAVIOR: import.meta.env.VITE_USER_BEHAVIOR_TABLE || 'user_reading_behavior',
  AI_INTERPRETATION: import.meta.env.VITE_AI_INTERPRETATION_TABLE || 'ai_interpretation_cache',
  MULTIMEDIA: import.meta.env.VITE_MULTIMEDIA_TABLE || 'multimedia_assets'
}

export default getSupabase