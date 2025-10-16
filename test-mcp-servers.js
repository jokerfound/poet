// MCP Servers 测试脚本
// 用于验证Supabase MCP服务器配置

import { getMCPServerManager } from './src/config/mcpServers.js'

async function testMCPServers() {
  console.log('=== MCP Servers 配置测试 ===\n')
  
  try {
    // 初始化MCP服务器管理器
    const mcpManager = getMCPServerManager()
    console.log('✅ MCP服务器管理器初始化成功')
    
    // 测试服务器健康状态
    console.log('\n📊 检查服务器健康状态...')
    const healthStatus = await mcpManager.checkHealth()
    console.log('健康状态:', JSON.stringify(healthStatus, null, 2))
    
    // 获取所有服务器列表
    console.log('\n📋 可用的MCP服务器:')
    const allServers = mcpManager.getAllServers()
    allServers.forEach(server => {
      console.log(`  - ${server.name}: ${server.description}`)
    })
    
    // 测试诗歌数据服务
    console.log('\n📖 测试诗歌数据服务...')
    const poemService = mcpManager.getServer('poemService')
    if (poemService) {
      console.log('✅ 诗歌数据服务加载成功')
      
      // 测试获取诗歌
      const poemsResult = await poemService.endpoints.getAll({ limit: 3 })
      if (poemsResult.error) {
        console.log('⚠️ 获取诗歌数据失败:', poemsResult.error.message)
      } else {
        console.log(`✅ 成功获取 ${poemsResult.data?.length || 0} 首诗歌`)
      }
    } else {
      console.log('❌ 诗歌数据服务加载失败')
    }
    
    // 测试诗人数据服务
    console.log('\n👨‍🎨 测试诗人数据服务...')
    const poetService = mcpManager.getServer('poetService')
    if (poetService) {
      console.log('✅ 诗人数据服务加载成功')
      
      // 测试获取诗人
      const poetsResult = await poetService.endpoints.getAll({ limit: 3 })
      if (poetsResult.error) {
        console.log('⚠️ 获取诗人数据失败:', poetsResult.error.message)
      } else {
        console.log(`✅ 成功获取 ${poetsResult.data?.length || 0} 位诗人`)
      }
    } else {
      console.log('❌ 诗人数据服务加载失败')
    }
    
    // 测试搜索服务
    console.log('\n🔍 测试搜索服务...')
    const searchService = mcpManager.getServer('searchService')
    if (searchService) {
      console.log('✅ 搜索服务加载成功')
      
      // 测试搜索诗歌
      const searchResult = await searchService.endpoints.searchPoems('春', { limit: 3 })
      if (searchResult.error) {
        console.log('⚠️ 搜索诗歌失败:', searchResult.error.message)
      } else {
        console.log(`✅ 搜索到 ${searchResult.data?.length || 0} 首包含"春"的诗歌`)
      }
    } else {
      console.log('❌ 搜索服务加载失败')
    }
    
    // 测试用户行为服务
    console.log('\n👤 测试用户行为服务...')
    const userBehaviorService = mcpManager.getServer('userBehaviorService')
    if (userBehaviorService) {
      console.log('✅ 用户行为服务加载成功')
      
      // 测试记录阅读行为
      const trackResult = await userBehaviorService.endpoints.trackReading(
        'test-user-123',
        'test-poem-456',
        30
      )
      if (trackResult.error) {
        console.log('⚠️ 记录用户行为失败:', trackResult.error.message)
      } else {
        console.log('✅ 用户行为记录成功')
      }
    } else {
      console.log('❌ 用户行为服务加载失败')
    }
    
    console.log('\n🎉 MCP Servers 配置测试完成！')
    console.log('\n📝 下一步:')
    console.log('1. 配置您的Supabase项目信息到 .env.local 文件')
    console.log('2. 运行 npm run dev 启动开发服务器')
    console.log('3. 访问 http://localhost:3003 测试应用')
    
  } catch (error) {
    console.error('❌ MCP Servers 测试失败:', error)
    console.log('\n🔧 故障排除建议:')
    console.log('1. 检查Supabase项目配置是否正确')
    console.log('2. 验证网络连接')
    console.log('3. 查看浏览器控制台错误信息')
  }
}

// 运行测试
testMCPServers().catch(console.error)