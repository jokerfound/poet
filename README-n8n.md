# 诗词赏析机器人 - n8n工作流部署指南

## 项目概述

本项目使用n8n工作流引擎构建了一个智能诗词赏析机器人，提供以下功能：
- 🤖 AI驱动的诗词深度分析
- 💬 智能问答系统
- 📚 相关诗词推荐
- 🎯 多维度赏析（情感、艺术、历史、综合）

## 系统架构

```
前端应用 (Vue.js)
    ↓ HTTP请求
n8n工作流引擎
    ↓ API调用
OpenAI GPT-4
    ↓ 响应处理
前端展示
```

## 部署步骤

### 1. 环境要求

- Docker & Docker Compose
- OpenAI API密钥
- Node.js 16+ (用于前端应用)

### 2. 快速部署

```bash
# 1. 进入项目目录
cd poet

# 2. 运行部署脚本（Linux/Mac）
chmod +x deploy-n8n.sh
./deploy-n8n.sh

# 或手动部署（Windows）
docker-compose -f docker-compose.n8n.yml up -d
```

### 3. 配置n8n工作流

#### 3.1 访问n8n平台
- 地址: http://localhost:5678
- 用户名: `admin`
- 密码: `poet123456`

#### 3.2 导入工作流
1. 点击右上角"设置"图标
2. 选择"导入工作流"
3. 导入以下工作流文件：
   - `n8n-workflows/poetry-analysis-workflow.json` (诗词分析)
   - `n8n-workflows/poetry-qa-workflow.json` (智能问答)

#### 3.3 配置OpenAI API
1. 点击"设置" → "凭证"
2. 点击"添加凭证"
3. 选择"OpenAI API"
4. 输入您的API密钥
5. 保存凭证

### 4. 启动前端应用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或构建生产版本
npm run build
```

## 工作流说明

### 诗词分析工作流 (`poetry-analysis-workflow.json`)

**功能**: 对输入的诗词进行多维度分析

**流程**:
1. Webhook接收请求
2. 数据验证和预处理
3. 调用OpenAI GPT-4进行分析
4. 结果处理和格式化
5. 返回分析结果

**请求示例**:
```json
{
  "poemContent": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
  "analysisType": "comprehensive",
  "userQuestion": "这首诗表达了什么情感？"
}
```

**响应示例**:
```json
{
  "analysis": "《静夜思》是李白的代表作之一...",
  "insights": ["运用了生动的意象描写", "情感表达真挚动人"],
  "recommendations": ["建议结合历史背景深入理解"],
  "relatedPoems": [...]
}
```

### 智能问答工作流 (`poetry-qa-workflow.json`)

**功能**: 回答诗词相关的各种问题

**流程**:
1. Webhook接收问题
2. 问题预处理
3. 调用OpenAI GPT-4进行回答
4. 答案质量评估
5. 返回回答结果

## API接口

### 诗词分析接口
- **URL**: `POST http://localhost:5678/poetry/analyze`
- **Content-Type**: `application/json`

**请求体**:
```typescript
interface AnalysisRequest {
  poemId?: number
  poemTitle?: string
  poemContent?: string
  analysisType: 'sentiment' | 'artistic' | 'historical' | 'comprehensive'
  userQuestion?: string
}
```

### 智能问答接口
- **URL**: `POST http://localhost:5678/poetry/qa`
- **Content-Type**: `application/json`

**请求体**:
```typescript
interface QARequest {
  question: string
  context?: any
  conversationId?: string
}
```

## 前端集成

### 组件使用

```vue
<template>
  <PoetryAnalysisBot />
</template>

<script setup>
import PoetryAnalysisBot from '@/components/PoetryAnalysisBot.vue'
</script>
```

### 服务调用

```typescript
import { usePoetryAnalysis } from '@/services/poetryAnalysisService'

const { loading, error, analyzePoetry, askQuestion } = usePoetryAnalysis()

// 分析诗词
const result = await analyzePoetry({
  poemContent: '床前明月光...',
  analysisType: 'comprehensive'
})

// 提问
const answer = await askQuestion('李白的诗歌特点是什么？')
```

## 功能特性

### 1. 智能分析
- 情感分析：识别诗词中的情感倾向
- 艺术手法：分析修辞手法和表现技巧
- 历史背景：结合时代背景进行解读
- 综合赏析：多维度深度分析

### 2. 交互体验
- 悬浮式聊天界面
- 快速操作按钮
- 实时打字指示器
- 响应式设计

### 3. 个性化推荐
- 基于分析结果推荐相关诗词
- 个性化学习路径
- 智能内容过滤

## 故障排除

### 常见问题

1. **n8n服务无法启动**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep 5678
   
   # 重启服务
   docker-compose -f docker-compose.n8n.yml restart
   ```

2. **OpenAI API调用失败**
   - 检查API密钥是否正确
   - 验证网络连接
   - 检查API配额

3. **前端无法连接n8n**
   - 确认n8n服务正在运行
   - 检查CORS配置
   - 验证网络连通性

### 日志查看

```bash
# 查看n8n日志
docker logs poet-n8n

# 查看Redis日志
docker logs poet-redis
```

## 开发指南

### 自定义工作流

1. 在n8n平台编辑工作流
2. 添加新的处理节点
3. 测试工作流功能
4. 导出工作流配置

### 扩展功能

- 添加诗词数据库集成
- 实现用户历史记录
- 添加语音朗读功能
- 集成图像识别

## 许可证

本项目采用MIT许可证。详见LICENSE文件。

## 技术支持

如有问题，请提交Issue或联系开发团队。