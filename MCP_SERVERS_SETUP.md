# Supabase MCP Servers 配置指南

## 概述

本文档介绍如何配置和使用Supabase MCP (Model Context Protocol) Servers来管理诗歌应用的数据服务。

## 配置步骤

### 1. 环境变量配置

复制 `.env.example` 为 `.env.local` 并配置您的Supabase项目信息：

```bash
# 复制环境配置文件
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入您的实际配置：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. MCP服务器架构

项目包含以下MCP服务器：

#### 诗歌数据服务 (`poemService`)
- **功能**: 提供诗歌数据的CRUD操作
- **端点**:
  - `getAll()` - 获取所有诗歌
  - `getById(id)` - 根据ID获取诗歌
  - `getByPoet(poetId)` - 获取指定诗人的诗歌
  - `create(poemData)` - 创建新诗歌
  - `update(id, updates)` - 更新诗歌
  - `delete(id)` - 删除诗歌

#### 诗人数据服务 (`poetService`)
- **功能**: 管理诗人信息
- **端点**:
  - `getAll()` - 获取所有诗人
  - `getById(id)` - 根据ID获取诗人
  - `getByDynasty(dynasty)` - 按朝代获取诗人

#### 搜索服务 (`searchService`)
- **功能**: 提供全文搜索功能
- **端点**:
  - `searchPoems(query)` - 搜索诗歌
  - `searchPoets(query)` - 搜索诗人

#### 用户行为服务 (`userBehaviorService`)
- **功能**: 记录和分析用户行为
- **端点**:
  - `trackReading(userId, poemId, duration)` - 记录阅读行为
  - `getUserHistory(userId)` - 获取用户历史

#### AI解释服务 (`aiInterpretationService`)
- **功能**: 管理AI对诗歌的解释
- **端点**:
  - `getInterpretation(poemId)` - 获取AI解释
  - `createInterpretation(poemId, interpretation)` - 创建解释

## 使用方法

### 基本使用

```javascript
import { getMCPServerManager } from './src/config/mcpServers.js'

// 获取MCP服务器管理器
const mcpManager = getMCPServerManager()

// 使用诗歌数据服务
const poemService = mcpManager.getServer('poemService')
const result = await poemService.endpoints.getAll({ limit: 10 })
```

### 在Vue组件中使用

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getMCPServerManager } from './config/mcpServers.js'

const poems = ref([])
const mcpManager = getMCPServerManager()

onMounted(async () => {
  const poemService = mcpManager.getServer('poemService')
  const result = await poemService.endpoints.getAll({ limit: 20 })
  if (result.data) {
    poems.value = result.data
  }
})
</script>
```

### 错误处理

```javascript
try {
  const poemService = mcpManager.getServer('poemService')
  const result = await poemService.endpoints.getById('poem-123')
  
  if (result.error) {
    console.error('获取诗歌失败:', result.error.message)
    // 使用备用数据或显示错误信息
  } else {
    // 处理成功数据
    console.log('诗歌数据:', result.data)
  }
} catch (error) {
  console.error('服务调用异常:', error)
}
```

## 服务器健康检查

```javascript
// 检查所有服务器健康状态
const healthStatus = await mcpManager.checkHealth()
console.log('服务器健康状态:', healthStatus)

// 检查单个服务器
const poemServiceHealth = healthStatus.poemService
if (poemServiceHealth.status === 'healthy') {
  console.log('诗歌服务运行正常')
} else {
  console.warn('诗歌服务异常:', poemServiceHealth.error)
}
```

## 数据库表结构要求

确保您的Supabase数据库包含以下表结构：

### poems 表
```sql
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  poet_id UUID REFERENCES poets(id),
  dynasty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### poets 表
```sql
CREATE TABLE poets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  dynasty TEXT,
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_reading_behavior 表
```sql
CREATE TABLE user_reading_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  poem_id UUID REFERENCES poems(id),
  read_duration INTEGER,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 部署说明

### 开发环境
1. 配置环境变量
2. 启动开发服务器: `npm run dev`
3. MCP服务器将自动初始化

### 生产环境
1. 在部署平台设置环境变量
2. 构建项目: `npm run build`
3. MCP服务器配置将自动生效

## 故障排除

### 常见问题

1. **连接失败**
   - 检查Supabase URL和密钥是否正确
   - 验证网络连接
   - 检查Supabase项目是否启用

2. **表不存在**
   - 确保数据库表已创建
   - 检查表名是否与环境变量匹配

3. **权限错误**
   - 检查Supabase行级安全策略
   - 验证API密钥权限

### 调试模式

启用调试日志：
```javascript
// 在浏览器控制台查看详细日志
localStorage.setItem('mcpDebug', 'true')
```

## 扩展开发

### 添加新的MCP服务器

1. 在 `src/config/mcpServers.js` 中添加新的服务器配置
2. 实现相应的服务端点
3. 更新服务器初始化逻辑

### 自定义端点

您可以扩展现有的服务或创建新的自定义端点来满足特定需求。

## 技术支持

如有问题，请参考：
- [Supabase文档](https://supabase.com/docs)
- [项目README](../README.md)
- 查看控制台错误信息