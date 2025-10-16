# Poetic Journey - 古诗词赏析平台

一个基于Vue.js的现代化古诗词赏析平台，提供诗词浏览、搜索、分类、赏析等完整功能。

## ✨ 功能特性

### 🎯 核心功能
- **📚 诗词浏览** - 展示经典古诗词作品，支持分页和无限滚动
- **🔍 智能搜索** - 按标题、作者、内容关键词搜索诗词
- **🏷️ 分类浏览** - 按朝代、诗人、题材进行多维分类
- **📖 诗词赏析** - 详细的诗词解析、注释和创作背景
- **⭐ 收藏功能** - 用户收藏喜欢的诗词，支持本地存储
- **🤖 AI智能解读** - 多维度AI分析诗词意境、情感、艺术手法
- **📊 动态数据** - 从Supabase实时获取和管理诗词数据

### 🛠️ 技术特性
- **Vue 3** - 使用Composition API和现代前端技术栈
- **Vue Router** - 单页面应用，流畅的页面切换体验
- **Pinia** - 现代化状态管理，支持TypeScript
- **Supabase** - 完整的后端即服务解决方案
- **响应式设计** - 完美适配桌面端和移动端
- **中国风UI** - 传统与现代结合的设计风格

## 项目结构

```
poet/
├── public/                 # 静态资源
├── src/
│   ├── components/        # 可复用组件
│   ├── views/             # 页面组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── assets/            # 图片、样式等资源
│   └── utils/             # 工具函数
├── package.json           # 项目配置
└── vite.config.js        # Vite配置
```

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 7.0+
- Supabase账户（用于动态数据）

### 本地开发
```bash
# 克隆项目
git clone https://github.com/your-username/poetic-journey.git
cd poetic-journey

# 安装依赖
npm install

# 配置Supabase环境变量
# 复制.env.example为.env.local并填入您的Supabase项目信息

# 运行数据库迁移
npm run supabase:migrate

# 填充示例数据
npm run supabase:seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看项目

### 构建生产版本
```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### GitHub同步
```bash
# 同步Supabase配置到GitHub
npm run github:sync

# 或直接运行脚本
./sync-to-github.sh  # Linux/Mac
sync-to-github.bat  # Windows
```

## 📁 项目结构

```
poet/
├── public/                 # 静态资源
├── src/
│   ├── components/        # 可复用组件
│   ├── views/             # 页面视图组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia状态管理
│   ├── services/          # API服务层
│   ├── config/           # 配置文件
│   ├── assets/           # 图片、样式资源
│   └── utils/            # 工具函数
├── package.json          # 项目配置和依赖
├── vite.config.js       # Vite构建配置
├── .gitignore           # Git忽略文件
└── README.md            # 项目说明文档
```

## 🌐 在线演示

项目已部署到以下平台：
- **Vercel**: https://poetic-journey.vercel.app
- **Netlify**: https://poetic-journey.netlify.app

## 📊 数据架构

项目使用Supabase作为主要数据源，提供完整的后端服务：

### 数据库表设计
- `poems` - 诗词主表（标题、内容、作者、朝代等）
- `poets` - 诗人信息表（生平、风格、代表作）
- `annotations` - 诗词注释表（详细解析）
- `imagery` - 意象分析表（艺术手法分析）
- `historical_events` - 历史背景表（创作背景）
- `knowledge_graph_relations` - 知识图谱关系
- `user_reading_behavior` - 用户阅读行为记录
- `ai_interpretation_cache` - AI解读缓存
- `multimedia_assets` - 多媒体资源表
- `system_config` - 系统配置表

### Supabase功能
- **实时数据库** - PostgreSQL数据库托管
- **身份认证** - 用户管理和权限控制
- **存储服务** - 文件上传和管理
- **边缘函数** - 服务器端逻辑处理
- **行级安全** - 数据访问权限控制

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

### Supabase配置更新
当添加新的Supabase相关功能时：
1. 更新数据库迁移文件 (`supabase/migrations/`)
2. 添加相应的API服务 (`src/services/`)
3. 更新前端组件使用动态数据
4. 运行测试确保功能正常
5. 同步到GitHub (`npm run github:sync`)

### 环境变量管理
- 敏感信息使用环境变量
- 提供`.env.example`模板
- 不要提交包含敏感信息的`.env.local`文件

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Supabase](https://supabase.com/) - 完整的后端即服务解决方案
- [Vue Router](https://router.vuejs.org/) - Vue.js官方路由
- [Pinia](https://pinia.vuejs.org/) - Vue状态管理库

### Supabase MCP集成
项目已配置Supabase MCP服务器支持，提供：
- 数据库管理和迁移工具
- 实时数据同步
- 自动化部署流程
- 完整的开发工具链

---
⭐ 如果这个项目对你有帮助，请给个Star支持一下！