const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Poet项目GitHub上传脚本 ===\\n');

try {
  // 1. 检查Git状态
  console.log('1. 检查Git状态...');
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    console.log('当前变更:', status || '无变更');
  } catch (e) {
    console.log('Git状态检查失败，可能未初始化');
  }

  // 2. 检查提交历史
  console.log('\\n2. 检查提交历史...');
  try {
    const log = execSync('git log --oneline -3', { encoding: 'utf8' });
    console.log('最近提交:', log || '无提交历史');
  } catch (e) {
    console.log('无提交历史，需要初始化提交');
  }

  // 3. 检查远程仓库
  console.log('\\n3. 检查远程仓库配置...');
  try {
    const remote = execSync('git remote -v', { encoding: 'utf8' });
    console.log('远程仓库:', remote || '未配置');
  } catch (e) {
    console.log('远程仓库未配置');
  }

  // 4. 重新初始化Git（如果需要）
  console.log('\\n4. 初始化Git仓库...');
  try {
    execSync('git init', { stdio: 'inherit' });
  } catch (e) {
    console.log('Git初始化可能已完成');
  }

  // 5. 添加所有文件
  console.log('\\n5. 添加文件到暂存区...');
  execSync('git add .', { stdio: 'inherit' });

  // 6. 提交更改
  console.log('\\n6. 提交更改...');
  execSync('git commit -m "Initial commit: Complete poet application with Vue.js and Supabase"', { stdio: 'inherit' });

  // 7. 设置远程仓库
  console.log('\\n7. 设置远程仓库...');
  execSync('git remote add origin https://github.com/jokerfound/poet.git', { stdio: 'inherit' });

  // 8. 设置主分支
  console.log('\\n8. 设置主分支...');
  execSync('git branch -M main', { stdio: 'inherit' });

  // 9. 推送到GitHub
  console.log('\\n9. 推送到GitHub...');
  console.log('注意：首次推送可能需要GitHub认证');
  execSync('git push -u origin main', { stdio: 'inherit' });

  console.log('\\n✅ 上传完成！');
  console.log('GitHub仓库地址: https://github.com/jokerfound/poet');

} catch (error) {
  console.log('\\n❌ 执行过程中出错:', error.message);
  console.log('请检查：');
  console.log('1. GitHub仓库是否已创建 (https://github.com/jokerfound/poet)');
  console.log('2. 网络连接是否正常');
  console.log('3. GitHub认证是否正确');
}