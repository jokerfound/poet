# Vercel 部署指南

## 方法一：通过 Vercel Dashboard（推荐）

### 步骤 1：准备项目
确保项目包含以下文件：
- `vercel.json` - Vercel配置
- `package.json` - 项目依赖
- 完整的源代码

### 步骤 2：上传到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/poetic-journey.git
git push -u origin main
```

### 步骤 3：Vercel 部署
1. 访问 [Vercel官网](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 配置项目设置：
   - **Framework Preset**: Vite
   - **Root Directory**: poet
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
6. 配置环境变量：
   - `VITE_SUPABASE_URL` - 你的Supabase项目URL
   - `VITE_SUPABASE_ANON_KEY` - 你的Supabase anon key
7. 点击 "Deploy"

## 方法二：使用 Vercel CLI

### 安装 Vercel CLI
```bash
npm i -g vercel
```

### 部署项目
```bash
cd poet
vercel
```

按照提示操作：
- 选择默认设置
- 连接到现有项目或创建新项目
- 配置环境变量

## 环境变量配置

在 Vercel 项目中设置以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| VITE_SUPABASE_URL | Supabase项目URL | https://your-project.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase匿名密钥 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |

## 自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 自动部署

项目配置了 GitHub Actions，每次推送到 main 分支时会自动：
- 运行测试
- 构建项目
- 部署到 Vercel

## 故障排除

### 构建失败
- 检查 Node.js 版本兼容性
- 确认所有依赖正确安装
- 查看构建日志中的具体错误

### 环境变量问题
- 确保所有环境变量在 Vercel 中正确设置
- 检查变量名拼写是否正确

### 路由问题
- 确认 SPA 路由配置正确
- 检查 `vercel.json` 中的重写规则

## 监控和日志

在 Vercel Dashboard 中可查看：
- 部署状态
- 性能指标
- 错误日志
- 用户访问统计

## 支持的联系方式

如有问题，请参考：
- [Vercel 文档](https://vercel.com/docs)
- [项目 Issues](https://github.com/your-username/poetic-journey/issues)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)