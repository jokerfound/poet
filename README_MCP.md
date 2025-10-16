# Supabase MCP Servers 快速开始指南

## 概述

本项目已成功配置Supabase MCP (Model Context Protocol) Servers，为诗歌应用提供统一的数据服务管理。

## 配置完成状态

✅ **MCP服务器配置已完成**
- 诗歌数据服务 (`poemService`)
- 诗人数据服务 (`poetService`) 
- 搜索服务 (`searchService`)
- 用户行为服务 (`userBehaviorService`)
- AI解释服务 (`aiInterpretationService`)

✅ **代码集成已完成**
- 更新了主入口文件 (`src/main.js`)
- 重构了诗歌服务 (`src/services/poemService.js`)
- 创建了配置文档和示例

## 快速开始

### 1. 配置Supabase连接

编辑 `poet/.env.local` 文件，填入您的Supabase项目信息：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. 启动开发服务器

```bash
cd poet
npm install
npm run dev
```

### 3. 测试MCP服务器配置

```bash
# 运行测试脚本
node test-mcp-servers.js

# 或使用npm脚本
npm run mcp:test
npm run mcp:health
```

## 使用方法

### 在Vue组件中使用

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getMCPServerManager } from './config/mcpServers.js'

const poems = ref([])
const mcpManager = getMCPServerManager()

onMounted(async () => {
  const poemService = mcpManager.getServer('poemService')
  if (poemService) {
    const result = await poemService.endpoints.getAll({ limit: 20 })
    if (result.data) {
      poems.value = result.data
    }
  }
})
</script>
```

### 在服务类中使用

```javascript
import { getMCPServerManager } from './config/mcpServers.js'

class MyService {
  constructor() {
    this.mcpManager = getMCPServerManager()
    this.poemService = this.mcpManager.getServer('poemService')
  }
  
  async getPoems() {
    if (!this.poemService) return []
    
    const result = await this.poemService.endpoints.getAll({ limit: 10 })
    return result.data || []
  }
}
```

## 服务器端点说明

### 诗歌数据服务 (`poemService`)

| 端点 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `getAll` | GET | 获取所有诗歌 | `{ limit, offset, orderBy }` |
| `getById` | GET | 根据ID获取诗歌 | `id` |
| `getByPoet` | GET | 获取诗人诗歌 | `poetId, { limit, offset }` |
| `searchPoems` | GET | 搜索诗歌 | `query, { limit, offset }` |

### 用户行为服务 (`userBehaviorService`)

| 端点 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `trackReading` | POST | 记录阅读行为 | `userId, poemId, duration` |
| `getUserHistory` | GET | 获取用户历史 | `userId, { limit, offset }` |

## 错误处理

```javascript
try {
  const poemService = mcpManager.getServer('poemService')
  const result = await poemService.endpoints.getAll({ limit: 10 })
  
  if (result.error) {
    console.error('服务调用失败:', result.error.message)
    // 使用备用数据或显示错误信息
  } else {
    // 处理成功数据
    console.log('数据获取成功:', result.data)
  }
} catch (error) {
  console.error('服务异常:', error)
  // 降级到模拟数据或本地存储
}
```

## 健康检查

```javascript
// 检查所有服务器状态
const healthStatus = await mcpManager.checkHealth()

// 检查单个服务器
if (healthStatus.poemService.status === 'healthy') {
  console.log('诗歌服务运行正常')
} else {
  console.warn('诗歌服务异常:', healthStatus.poemService.error)
}
```

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 测试MCP服务器
npm run mcp:test

# 检查服务器健康状态
npm run mcp:health
```

## 故障排除

### 常见问题

1. **连接失败**
   - 检查Supabase URL和密钥是否正确
   - 验证网络连接
   - 检查浏览器控制台错误信息

2. **表不存在**
   - 确保数据库表已创建
   - 检查表名配置是否正确

3. **权限错误**
   - 检查Supabase行级安全策略
   - 验证API密钥权限

### 调试模式

在浏览器控制台启用调试：

```javascript
localStorage.setItem('mcpDebug', 'true')
```

## 扩展开发

### 添加新的MCP服务器

1. 在 `src/config/mcpServers.js` 的 `initializeServers()` 方法中添加新服务器
2. 实现相应的服务端点
3. 更新服务器管理器

### 自定义端点

您可以扩展现有服务或创建新的自定义端点：

```javascript
// 在MCPServerManager类中添加
createCustomService() {
  return {
    customEndpoint: async (params) => {
      // 实现自定义逻辑
      return await this.supabase.from('custom_table').select('*')
    }
  }
}
```

## 技术支持

- 查看详细配置文档: [MCP_SERVERS_SETUP.md](./MCP_SERVERS_SETUP.md)
- Supabase官方文档: https://supabase.com/docs
- 项目问题反馈: 查看GitHub Issues

---

**配置完成！** 🎉 您的Supabase MCP Servers已成功配置并集成到诗歌应用中。