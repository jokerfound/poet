// MCP Servers 使用示例
// 展示如何使用配置的Supabase MCP服务

import { getMCPServerManager } from './mcpServers.js'

// 初始化MCP服务器管理器
const mcpManager = getMCPServerManager()

// 使用示例
async function demonstrateMCPServers() {
  console.log('=== MCP Servers 使用示例 ===')
  
  // 1. 获取所有服务器列表
  const allServers = mcpManager.getAllServers()
  console.log('可用的MCP服务器:', allServers.map(s => s.name))
  
  // 2. 使用诗歌数据服务
  const poemService = mcpManager.getServer('poemService')
  if (poemService) {
    console.log('\n=== 诗歌数据服务示例 ===')
    
    // 获取所有诗歌
    const poemsResult = await poemService.endpoints.getAll({ limit: 5 })
    if (poemsResult.data) {
      console.log('前5首诗歌:', poemsResult.data)
    } else if (poemsResult.error) {
      console.log('获取诗歌失败:', poemsResult.error.message)
    }
    
    // 搜索诗歌
    const searchResult = await poemService.endpoints.searchPoems('春')
    if (searchResult.data) {
      console.log('包含"春"的诗歌:', searchResult.data)
    } else if (searchResult.error) {
      console.log('搜索诗歌失败:', searchResult.error.message)
    }
  }
  
  // 3. 使用诗人数据服务
  const poetService = mcpManager.getServer('poetService')
  if (poetService) {
    console.log('\n=== 诗人数据服务示例 ===')
    
    // 获取所有诗人
    const poetsResult = await poetService.endpoints.getAll({ limit: 3 })
    if (poetsResult.data) {
      console.log('前3位诗人:', poetsResult.data)
    } else if (poetsResult.error) {
      console.log('获取诗人失败:', poetsResult.error.message)
    }
  }
  
  // 4. 使用用户行为服务
  const userBehaviorService = mcpManager.getServer('userBehaviorService')
  if (userBehaviorService) {
    console.log('\n=== 用户行为服务示例 ===')
    
    // 记录用户阅读行为
    const trackResult = await userBehaviorService.endpoints.trackReading(
      'user-123',
      'poem-456',
      120 // 阅读时长120秒
    )
    if (trackResult.data) {
      console.log('用户行为记录成功')
    } else if (trackResult.error) {
      console.log('记录用户行为失败:', trackResult.error.message)
    }
  }
  
  // 5. 检查服务器健康状态
  const healthStatus = await mcpManager.checkHealth()
  console.log('\n=== 服务器健康状态 ===')
  console.log(JSON.stringify(healthStatus, null, 2))
}

// 导出使用函数
export {
  demonstrateMCPServers,
  mcpManager
}

// 如果直接运行此文件，则执行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateMCPServers().catch(console.error)
}