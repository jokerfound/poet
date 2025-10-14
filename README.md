# Poetic Journey - 古诗词赏析平台

一个基于Vue.js的现代化古诗词赏析平台，提供诗词浏览、搜索、分类、赏析等完整功能。

## ✨ 功能特性

### 🎯 核心功能
- **📚 诗词浏览** - 展示经典古诗词作品，支持分页和无限滚动
- **🔍 智能搜索** - 按标题、作者、内容关键词搜索诗词
- **🏷️ 分类浏览** - 按朝代、诗人、题材进行多维分类
- **📖 诗词赏析** - 详细的诗词解析、注释和创作背景
- **⭐ 收藏功能** - 用户收藏喜欢的诗词，支持本地存储

### 🛠️ 技术特性
- **Vue 3** - 使用Composition API和现代前端技术栈
- **Vue Router** - 单页面应用，流畅的页面切换体验
- **Pinia** - 现代化状态管理，支持TypeScript
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

### 本地开发
```bash
# 克隆项目
git clone https://github.com/your-username/poetic-journey.git
cd poetic-journey

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看项目

### 构建生产版本
```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
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

项目支持多种数据源：
- **Supabase** - 云端数据库（生产环境）
- **Local Storage** - 本地数据存储（开发环境）
- **Mock Data** - 模拟数据（离线模式）

### 数据库表设计
- `poems` - 诗词表
- `poets` - 诗人表  
- `user_reading_behavior` - 用户行为记录
- `annotations` - 诗词注释

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Supabase](https://supabase.com/) - 开源Firebase替代品
- [Vue Router](https://router.vuejs.org/) - Vue.js官方路由

---
⭐ 如果这个项目对你有帮助，请给个Star支持一下！