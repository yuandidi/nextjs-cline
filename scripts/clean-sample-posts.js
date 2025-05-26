/**
 * 清理示例文章脚本
 * 用于删除示例博客文章文件和数据库中的记录
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const readline = require('readline');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const blogDirectory = path.join(process.cwd(), 'src/content/blog');
const samplePosts = [
  'getting-started-with-nextjs.mdx',
  'modern-css-techniques.mdx',
  'understanding-react-hooks.mdx'
];

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('===== 示例文章清理工具 =====');
console.log('此脚本将删除以下示例文章:');
samplePosts.forEach(post => console.log(`- ${post}`));
console.log('\n警告: 此操作不可逆，删除后无法恢复！');

// 询问用户是否确认删除
rl.question('\n确认删除这些文件吗? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    try {
      // 检查目录是否存在
      if (!fs.existsSync(blogDirectory)) {
        console.log(`目录不存在: ${blogDirectory}`);
        rl.close();
        return;
      }
      
      // 删除每个示例文章
      let deletedCount = 0;
      samplePosts.forEach(post => {
        const filePath = path.join(blogDirectory, post);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`已删除: ${post}`);
          deletedCount++;
        } else {
          console.log(`文件不存在: ${post}`);
        }
      });
      
      console.log(`\n操作完成! 已删除 ${deletedCount} 个示例文章。`);
    } catch (error) {
      console.error('删除过程中发生错误:', error);
    }
  } else {
    console.log('操作已取消，未删除任何文件。');
  }
  
  rl.close();
});
