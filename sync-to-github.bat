@echo off
REM Supabase配置同步到GitHub脚本 (Windows版本)

echo 🚀 开始同步Supabase配置到GitHub...

REM 检查Git状态
echo 📊 检查Git状态...
git status

REM 添加所有新文件
echo ➕ 添加新文件到Git...
git add .

REM 检查是否有需要提交的更改
git diff-index --quiet HEAD --
if %errorlevel% equ 0 (
    echo ✅ 没有需要提交的更改
    exit /b 0
)

REM 提交更改
echo 💾 提交Supabase配置更新...
git commit -m "feat: 完成Supabase MCP服务器配置

- 添加Supabase数据库迁移文件
- 更新前端组件使用动态数据
- 配置环境变量和API接口
- 添加数据库测试和种子脚本
- 更新项目文档和配置指南"

REM 推送到GitHub
echo 📤 推送到GitHub...
git push origin main

echo 🎉 Supabase配置已成功同步到GitHub!
echo 🔗 查看提交: https://github.com/你的用户名/poet/commits/main
echo 📖 配置文档: SETUP_COMPLETE.md