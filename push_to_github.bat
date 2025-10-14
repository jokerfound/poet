@echo off
echo ========================================
echo GitHub推送脚本 - 解决SSL证书问题
echo ========================================

echo 1. 临时禁用SSL验证（解决证书错误）...
git config --global http.sslVerify false

echo.
echo 2. 检查Git状态...
git status

echo.
echo 3. 添加所有文件到暂存区...
git add .

echo.
echo 4. 提交更改...
git commit -m "Update: Complete Vercel deployment configuration"

echo.
echo 5. 拉取远程更改...
git pull origin main

echo.
echo 6. 推送到GitHub...
git push origin main

echo.
echo 7. 恢复SSL验证...
git config --global http.sslVerify true

echo.
echo ========================================
echo 推送完成！
echo GitHub仓库: https://github.com/jokerfound/poet
echo ========================================
echo.
echo 如果推送失败，请检查：
echo - 网络连接
echo - GitHub账号权限
echo - 仓库是否存在
pause