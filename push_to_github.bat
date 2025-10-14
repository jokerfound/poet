@echo off
echo ========================================
echo GitHub推送脚本
echo ========================================

echo 1. 检查Git状态...
git status

echo.
echo 2. 添加所有文件到暂存区...
git add .

echo.
echo 3. 提交更改...
git commit -m "Update: Complete Vercel deployment configuration"

echo.
echo 4. 拉取远程更改...
git pull origin main

echo.
echo 5. 推送到GitHub...
git push origin main

echo.
echo ========================================
echo 推送完成！
echo GitHub仓库: https://github.com/jokerfound/poet
echo ========================================
pause