const { execSync } = require('child_process');

try {
  console.log('=== 检查Git状态 ===');
  
  // 检查是否在Git仓库中
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    console.log('✓ Git仓库已初始化');
    console.log('当前变更文件:', gitStatus || '无变更');
  } catch (e) {
    console.log('✗ 不在Git仓库中或未初始化');
  }

  // 检查远程仓库配置
  try {
    const remote = execSync('git remote -v', { encoding: 'utf8' });
    console.log('远程仓库配置:', remote || '未配置');
  } catch (e) {
    console.log('远程仓库: 未配置');
  }

  // 检查提交历史
  try {
    const log = execSync('git log --oneline -3', { encoding: 'utf8' });
    console.log('最近提交:', log || '无提交历史');
  } catch (e) {
    console.log('提交历史: 无');
  }

} catch (error) {
  console.log('检查过程中出错:', error.message);
}