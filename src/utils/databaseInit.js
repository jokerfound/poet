// 数据库初始化脚本
// 用于创建示例数据和测试数据库连接

import { getSupabase, TABLES } from '../config/supabase.js'

export class DatabaseInitializer {
  constructor() {
    this.supabase = getSupabase()
  }

  // 检查数据库连接
  async checkConnection() {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.POEMS)
        .select('count')
        .limit(1)

      if (error) {
        if (error.code === '42P01') {
          console.log('数据库表不存在，需要创建表结构')
          return { connected: true, tablesExist: false }
        }
        throw error
      }

      return { connected: true, tablesExist: true }
    } catch (error) {
      console.error('数据库连接检查失败:', error)
      return { connected: false, tablesExist: false, error: error.message }
    }
  }

  // 创建示例数据
  async createSampleData() {
    const samplePoets = [
      {
        id: 1,
        name: '李白',
        dynasty: '唐',
        description: '唐代著名诗人，字太白，号青莲居士，有"诗仙"之称',
        birth_year: 701,
        death_year: 762,
        style: '浪漫主义'
      },
      {
        id: 2,
        name: '杜甫',
        dynasty: '唐',
        description: '唐代著名诗人，字子美，自号少陵野老，有"诗圣"之称',
        birth_year: 712,
        death_year: 770,
        style: '现实主义'
      },
      {
        id: 3,
        name: '孟浩然',
        dynasty: '唐',
        description: '唐代山水田园诗人代表',
        birth_year: 689,
        death_year: 740,
        style: '山水田园'
      },
      {
        id: 4,
        name: '苏轼',
        dynasty: '宋',
        description: '宋代文学家，字子瞻，号东坡居士，唐宋八大家之一',
        birth_year: 1037,
        death_year: 1101,
        style: '豪放派'
      }
    ]

    const samplePoems = [
      {
        id: 1,
        title: '静夜思',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        poet_id: 1,
        dynasty: '唐',
        style: '五言绝句',
        theme: '思乡',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: '春晓',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        poet_id: 3,
        dynasty: '唐',
        style: '五言绝句',
        theme: '春景',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: '望岳',
        content: '岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生曾云，决眦入归鸟。会当凌绝顶，一览众山小。',
        poet_id: 2,
        dynasty: '唐',
        style: '五言古诗',
        theme: '山水',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: '水调歌头·明月几时有',
        content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
        poet_id: 4,
        dynasty: '宋',
        style: '词',
        theme: '思亲',
        created_at: new Date().toISOString()
      }
    ]

    try {
      // 插入诗人数据
      for (const poet of samplePoets) {
        const { error } = await this.supabase
          .from(TABLES.POETS)
          .upsert(poet, { onConflict: 'id' })
        
        if (error) throw error
      }

      // 插入诗词数据
      for (const poem of samplePoems) {
        const { error } = await this.supabase
          .from(TABLES.POEMS)
          .upsert(poem, { onConflict: 'id' })
        
        if (error) throw error
      }

      console.log('示例数据创建成功')
      return { success: true, poets: samplePoets.length, poems: samplePoems.length }
    } catch (error) {
      console.error('创建示例数据失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 初始化数据库
  async initialize() {
    console.log('开始初始化数据库...')
    
    // 检查连接
    const connection = await this.checkConnection()
    if (!connection.connected) {
      console.warn('数据库连接失败，使用本地数据模式')
      return { success: false, mode: 'local' }
    }

    if (!connection.tablesExist) {
      console.log('数据库表不存在，无法插入示例数据')
      return { success: false, mode: 'no_tables' }
    }

    // 创建示例数据
    const result = await this.createSampleData()
    return { 
      success: result.success, 
      mode: 'database',
      data: result 
    }
  }
}

// 导出单例实例
export const databaseInitializer = new DatabaseInitializer()

// 开发环境自动初始化
if (import.meta.env.DEV) {
  databaseInitializer.initialize().then(result => {
    console.log('数据库初始化结果:', result)
  })
}