/**
 * 飞书同步脚本
 * 自动执行飞书导出和数据库导入的整个流程
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');

console.log('===== 飞书知识库同步工具 =====');
console.log('步骤 1/2: 从飞书导出文档...');

try {
  // 执行飞书导出脚本
  execSync('node scripts/feishu-export/index.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n步骤 2/2: 将导出的文档导入到数据库...');
  
  // 执行数据库导入脚本
  execSync('node scripts/import-feishu-to-db.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n===== 同步完成! =====');
  console.log('飞书文档已成功导出并导入到数据库中');
  
} catch (error) {
  console.error('\n同步过程中发生错误:', error);
  process.exit(1);
}
