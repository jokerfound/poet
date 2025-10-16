// Supabase连接测试脚本
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

async function testSupabaseConnection() {
  console.log('🔍 开始测试Supabase连接...\n')
  
  // 检查环境变量
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || supabaseUrl.includes('your-project')) {
    console.error('❌ 请先配置VITE_SUPABASE_URL环境变量')
    console.log('📖 参考: poet/supabase/setup-guide.md')
    return
  }
  
  if (!supabaseKey || supabaseKey.includes('your-anon-key')) {
    console.error('❌ 请先配置VITE_SUPABASE_ANON_KEY环境变量')
    console.log('📖 参考: poet/supabase/setup-guide.md')
    return
  }
  
  console.log('✅ 环境变量检查通过')
  console.log(`📊 项目URL: ${supabaseUrl}`)
  
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // 测试连接
    console.log('\n🔗 测试Supabase连接...')
    const { data, error } = await supabase.from('poems').select('count').limit(1)
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  表不存在，但连接正常 - 需要运行数据库迁移')
        console.log('💡 运行: npm run supabase:migrate')
      } else {
        throw error
      }
    } else {
      console.log('✅ Supabase连接成功')
    }
    
    // 测试基本查询
    console.log('\n📊 测试基本查询功能...')
    const testQuery = await supabase.from('poems').select('id, title').limit(1)
    
    if (testQuery.error && testQuery.error.code !== 'PGRST116') {
      throw testQuery.error
    }
    
    console.log('✅ 查询功能正常')
    
    // 测试插入功能（如果表存在）
    if (!testQuery.error) {
      console.log('\n➕ 测试插入功能...')
      const testInsert = await supabase
        .from('poems')
        .insert([{
          title: '测试诗词',
          content: '这是一首测试诗词',
          poet_id: 1,
          dynasty: '测试'
        }])
        .select()
      
      if (testInsert.error) {
        console.warn('⚠️  插入测试失败（可能是权限限制）:', testInsert.error.message)
      } else {
        console.log('✅ 插入功能正常')
        
        // 清理测试数据
        if (testInsert.data && testInsert.data[0]) {
          await supabase.from('poems').delete().eq('id', testInsert.data[0].id)
        }
      }
    }
    
    console.log('\n🎉 Supabase配置测试完成！')
    console.log('📖 下一步: 运行数据库迁移和种子数据')
    console.log('💻 命令: npm run supabase:setup')
    
  } catch (error) {
    console.error('❌ Supabase连接测试失败:')
    console.error('错误信息:', error.message)
    console.error('错误代码:', error.code)
    
    if (error.code === 'PGRST301') {
      console.log('\n💡 可能的原因:')
      console.log('1. 项目URL不正确')
      console.log('2. 匿名密钥无效')
      console.log('3. 项目区域不匹配')
      console.log('4. 网络连接问题')
    } else if (error.code === 'PGRST201') {
      console.log('\n💡 可能的原因:')
      console.log('1. 表不存在，需要运行迁移')
      console.log('2. RLS策略限制访问')
    }
    
    console.log('\n📖 请参考 poet/supabase/setup-guide.md 进行故障排除')
  }
}

// 运行测试
testSupabaseConnection().catch(console.error)