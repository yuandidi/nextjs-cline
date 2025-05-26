/**
 * 清空数据库脚本
 * 用于删除数据库中的所有文章，保持数据库初始状态为空
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('开始清空数据库...');
    
    // 删除所有文章
    const deletedPosts = await prisma.post.deleteMany({});
    console.log(`已删除 ${deletedPosts.count} 篇文章`);
    
    // 删除所有标签
    const deletedTags = await prisma.tag.deleteMany({});
    console.log(`已删除 ${deletedTags.count} 个标签`);
    
    console.log('数据库清空完成！');
  } catch (error) {
    console.error('清空数据库时发生错误:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行清空操作
clearDatabase();
