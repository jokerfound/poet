# Supabase 数据库配置

本目录包含诗词网站Supabase数据库的配置文件和迁移脚本。

## 文件结构

```
supabase/
├── migrations/           # 数据库迁移文件
│   ├── 001_create_tables.sql      # 创建表结构
│   ├── 002_create_functions.sql   # 创建函数和存储过程
│   └── 003_create_rls_policies.sql # 行级安全策略
├── config.js            # API配置
└── README.md            # 说明文档
```

## 数据库表结构

### 核心表
- **poets** - 诗人信息表
- **poems** - 诗词内容表
- **annotations** - 诗词注释表
- **imagery** - 意象分析表

### 扩展表
- **historical_events** - 历史事件表
- **knowledge_graph_relations** - 知识图谱关系表
- **user_reading_behavior** - 用户阅读行为表
- **ai_interpretation_cache** - AI解释缓存表
- **multimedia_assets** - 多媒体资源表

## 部署步骤

### 1. 创建Supabase项目
1. 访问 [Supabase官网](https://supabase.com)
2. 创建新项目
3. 获取项目URL和匿名密钥

### 2. 配置环境变量
复制 `.env.example` 为 `.env.local` 并填入实际配置：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 执行数据库迁移

#### 方法一：使用Supabase Dashboard
1. 登录Supabase Dashboard
2. 进入SQL编辑器
3. 依次执行迁移文件中的SQL语句

#### 方法二：使用Supabase CLI
```bash
# 安装Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 应用迁移
supabase db push
```

### 4. 验证部署
运行项目并检查控制台输出，确认数据库连接正常。

## API接口

### 诗词相关接口
- `GET /poems` - 获取诗词列表
- `GET /poems/:id` - 获取诗词详情
- `GET /poems/search?q=关键词` - 搜索诗词
- `GET /poems/popular` - 获取热门诗词

### 诗人相关接口
- `GET /poets` - 获取诗人列表
- `GET /poets/:id` - 获取诗人详情
- `GET /poets/dynasty/:dynasty` - 按朝代获取诗人

### 搜索接口
- `GET /search?q=关键词` - 全局搜索
- `GET /search/poems?q=关键词` - 搜索诗词
- `GET /search/poets?q=关键词` - 搜索诗人

## 功能特性

### 1. 全文搜索
使用PostgreSQL的全文搜索功能，支持诗词标题、内容和诗人名的搜索。

### 2. 热门推荐
基于用户阅读行为统计热门诗词。

### 3. 相关推荐
根据诗词的主题、朝代和诗人推荐相关内容。

### 4. 统计分析
提供朝代统计、诗人统计等数据分析功能。

## 安全配置

### 行级安全策略(RLS)
所有表都启用了行级安全策略：
- 允许匿名用户读取数据
- 仅允许认证用户修改数据
- 用户只能访问自己的行为数据

### 索引优化
为常用查询字段创建了索引，提高查询性能。

## 故障排除

### 常见问题

1. **连接失败**
   - 检查环境变量配置
   - 验证网络连接
   - 确认Supabase项目状态

2. **表不存在**
   - 检查迁移是否执行成功
   - 验证表名是否正确

3. **权限错误**
   - 检查RLS策略配置
   - 验证API密钥权限

### 调试工具

在浏览器控制台检查：
```javascript
// 测试连接
import { checkConnection } from './config.js'
checkConnection().then(console.log)

// 测试API
import { api } from './config.js'
api.getPoems().then(console.log)
```

## 扩展开发

### 添加新表
1. 在迁移文件中创建表结构
2. 配置RLS策略
3. 在API配置中添加接口

### 添加新功能
1. 创建数据库函数
2. 在API类中添加方法
3. 更新前端服务调用

## 联系方式

如有问题请联系开发团队或查看项目文档。