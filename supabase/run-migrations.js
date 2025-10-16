// Supabase数据库迁移脚本
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

async function runMigrations() {
  console.log('🚀 开始运行Supabase数据库迁移...\n')
  
  // 检查环境变量
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || supabaseUrl.includes('your-project')) {
    console.error('❌ 请先配置VITE_SUPABASE_URL环境变量')
    console.log('📖 参考: poet/supabase/setup-guide.md')
    return
  }
  
  if (!supabaseServiceKey || supabaseServiceKey.includes('your-service-key')) {
    console.error('❌ 请先配置VITE_SUPABASE_SERVICE_KEY环境变量（需要服务密钥进行迁移）')
    console.log('📖 参考: poet/supabase/setup-guide.md')
    return
  }
  
  console.log('✅ 环境变量检查通过')
  
  try {
    // 创建Supabase客户端（使用服务密钥）
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // 读取迁移文件
    const migrationsDir = join(__dirname, 'migrations')
    const migrationFiles = [
      '001_create_tables.sql',
      '002_create_functions.sql',
      '003_create_rls_policies.sql'
    ]
    
    console.log('📁 发现迁移文件:', migrationFiles.join(', '))
    
    // 按顺序执行迁移
    for (const migrationFile of migrationFiles) {
      const filePath = join(migrationsDir, migrationFile)
      
      try {
        console.log(`\n📄 执行迁移: ${migrationFile}`)
        const sql = readFileSync(filePath, 'utf8')
        
        // 分割SQL语句并执行
        const statements = sql.split(';').filter(stmt => stmt.trim())
        
        for (const statement of statements) {
          if (statement.trim()) {
            const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() })
            
            if (error) {
              // 如果exec_sql函数不存在，尝试直接执行
              if (error.message.includes('function "exec_sql" does not exist')) {
                console.log('⚠️  exec_sql函数不存在，尝试直接执行SQL...')
                const { error: directError } = await supabase.rpc('sql', { query: statement.trim() })
                if (directError) {
                  throw new Error(`直接执行失败: ${directError.message}`)
                }
              } else {
                throw error
              }
            }
          }
        }
        
        console.log(`✅ ${migrationFile} 迁移完成`)
        
      } catch (error) {
        console.error(`❌ ${migrationFile} 迁移失败:`, error.message)
        
        // 如果是表已存在的错误，继续执行
        if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
          console.log('⚠️  表或对象已存在，继续执行下一个迁移...')
          continue
        }
        
        throw error
      }
    }
    
    console.log('\n🎉 所有数据库迁移完成！')
    console.log('📊 创建的数据库对象:')
    console.log('   - poems (诗词表)')
    console.log('   - poets (诗人表)')
    console.log('   - annotations (注释表)')
    console.log('   - imagery (意象表)')
    console.log('   - historical_events (历史事件表)')
    console.log('   - knowledge_graph_relations (知识图谱关系表)')
    console.log('   - user_reading_behavior (用户阅读行为表)')
    console.log('   - ai_interpretation_cache (AI解读缓存表)')
    console.log('   - multimedia_assets (多媒体资源表)')
    console.log('   - 相关函数和存储过程')
    console.log('   - RLS安全策略')
    
    console.log('\n💡 下一步: 运行种子数据填充示例数据')
    console.log('💻 命令: npm run supabase:seed')
    
  } catch (error) {
    console.error('❌ 数据库迁移失败:')
    console.error('错误信息:', error.message)
    console.error('错误代码:', error.code)
    
    console.log('\n💡 故障排除建议:')
    console.log('1. 检查Supabase项目URL和服务密钥是否正确')
    console.log('2. 确认有足够的数据库权限')
    console.log('3. 检查网络连接')
    console.log('4. 查看Supabase项目日志获取详细错误信息')
    
    console.log('\n📖 请参考 poet/supabase/setup-guide.md 进行故障排除')
  }
}

// 运行迁移
runMigrations().catch(console.error)