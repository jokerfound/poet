# 数据库连接配置指南

## 1. Supabase 配置

### 1.1 创建Supabase项目
1. 访问 [Supabase官网](https://supabase.com)
2. 注册账号并创建新项目
3. 获取项目URL和anon key

### 1.2 配置环境变量
复制 `.env.example` 为 `.env.local` 并填入您的配置：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. 数据库表结构

### 2.1 核心表结构

#### poems 表（诗词表）
```sql
CREATE TABLE poems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  poet_id INTEGER REFERENCES poets(id),
  dynasty VARCHAR(50),
  style VARCHAR(100),
  theme VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### poets 表（诗人表）
```sql
CREATE TABLE poets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dynasty VARCHAR(50),
  description TEXT,
  birth_year INTEGER,
  death_year INTEGER,
  style VARCHAR(100)
);
```

#### user_reading_behavior 表（用户行为表）
```sql
CREATE TABLE user_reading_behavior (
  id SERIAL PRIMARY KEY,
  poem_id INTEGER REFERENCES poems(id),
  user_id VARCHAR(255),
  read_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 扩展表结构（可选）

#### annotations 表（注释表）
```sql
CREATE TABLE annotations (
  id SERIAL PRIMARY KEY,
  poem_id INTEGER REFERENCES poems(id),
  content TEXT,
  author VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### imagery 表（意象表）
```sql
CREATE TABLE imagery (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cultural_significance TEXT
);
```

## 3. 数据初始化

### 3.1 自动创建示例数据
项目启动时会自动检查数据库连接并创建示例数据。

### 3.2 手动导入数据
可以使用以下SQL导入经典诗词数据：

```sql
-- 插入唐代诗人
INSERT INTO poets (name, dynasty, description) VALUES 
('李白', '唐', '诗仙，唐代浪漫主义诗人'),
('杜甫', '唐', '诗圣，唐代现实主义诗人'),
('王维', '唐', '诗佛，山水田园诗人');

-- 插入经典诗词
INSERT INTO poems (title, content, poet_id, dynasty) VALUES
('静夜思', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', 1, '唐'),
('春晓', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', 2, '唐');
```

## 4. 开发模式

### 4.1 本地开发
- 项目支持离线模式，即使没有数据库连接也能正常运行
- 使用本地存储模拟数据库功能
- 所有数据操作都有降级处理

### 4.2 生产环境
- 配置正确的Supabase连接信息
- 启用数据库实时同步功能
- 配置适当的数据库索引优化查询性能

## 5. 故障排除

### 5.1 常见问题

**问题：数据库连接失败**
- 检查Supabase URL和anon key是否正确
- 确认网络连接正常
- 验证数据库表是否存在

**问题：数据无法显示**
- 检查浏览器控制台错误信息
- 确认数据库表结构是否正确
- 验证环境变量配置

### 5.2 调试工具
在浏览器控制台中使用以下命令调试：

```javascript
// 检查数据库连接
window.supabase = getSupabase()

// 测试查询
window.supabase.from('poems').select('*').limit(5).then(console.log)
```

## 6. 性能优化建议

1. **索引优化**：为常用查询字段添加索引
2. **分页查询**：使用limit和offset进行分页
3. **缓存策略**：利用Supabase的缓存机制
4. **实时订阅**：合理使用实时数据同步功能

## 7. 安全配置

1. **行级安全**：启用Supabase行级安全策略
2. **权限控制**：配置适当的数据库权限
3. **API限制**：设置合理的API调用限制