# Supabase 配置指南

## 1. 创建Supabase项目

1. 访问 [Supabase官网](https://supabase.com) 并注册/登录账户
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - **Name**: poet-platform (或您喜欢的名称)
   - **Database Password**: 设置安全的数据库密码
   - **Region**: 选择离您最近的区域
   - **Pricing Plan**: 选择免费计划即可

## 2. 获取项目配置信息

项目创建完成后，在项目设置页面获取以下信息：

1. **项目URL**: 在 Settings > API > Project URL
2. **匿名密钥**: 在 Settings > API > Project API keys > `anon` `public`
3. **服务密钥**: 在 Settings > API > Project API keys > `service_role` (用于管理操作)

## 3. 配置环境变量

将获取的配置信息填入 `poet/.env.local` 文件：

```env
# Supabase配置
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
VITE_SUPABASE_SERVICE_KEY=your-actual-service-key
```

## 4. 配置MCP访问令牌

为了使用MCP工具管理Supabase，需要设置访问令牌：

### 方法1：环境变量
在系统环境变量中添加：
```bash
# Windows PowerShell
$env:SUPABASE_ACCESS_TOKEN="your-supabase-access-token"

# 或添加到系统环境变量
```

### 方法2：命令行参数
运行MCP服务器时添加：
```bash
npx -y @supabase/mcp-server-supabase --access-token "your-token"
```

### 获取访问令牌
1. 访问 Supabase 仪表板
2. 进入 Settings > API
3. 生成新的访问令牌或使用现有令牌

## 5. 运行数据库迁移

配置完成后，运行数据库迁移脚本：

```bash
# 进入项目目录
cd poet

# 运行迁移脚本（需要先配置好环境变量）
npm run db:migrate
```

或手动执行SQL：

1. 登录 Supabase 仪表板
2. 进入 SQL Editor
3. 依次执行 `supabase/migrations/` 目录下的SQL文件

## 6. 测试配置

运行测试脚本来验证配置：

```bash
# 测试Supabase连接
npm run test:supabase

# 启动开发服务器
npm run dev
```

## 7. 故障排除

### 常见问题

1. **连接失败**: 检查环境变量是否正确设置
2. **表不存在**: 确保已运行数据库迁移
3. **权限错误**: 检查RLS策略是否正确配置
4. **MCP工具认证失败**: 验证访问令牌是否有效

### 调试步骤

1. 检查浏览器控制台错误信息
2. 验证环境变量是否加载正确
3. 测试Supabase客户端连接
4. 检查网络连接和防火墙设置

## 8. 下一步

配置完成后，您的诗词平台将能够：
- 从Supabase动态加载诗词数据
- 支持实时搜索和筛选
- 记录用户阅读行为
- 提供个性化推荐

如有问题，请参考Supabase官方文档或联系技术支持。