/**
 * 飞书文档导入数据库脚本
 * 将飞书导出的Markdown文件导入到数据库中
 */

// 加载环境变量
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const feishuDirectory = path.join(process.cwd(), 'src/content/feishu');

/**
 * 从Markdown内容中提取标题
 */
function extractTitle(content) {
  // 尝试从第一个h1标题提取
  const h1Match = content.match(/^# (.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // 如果没有找到标题，返回默认标题
  return '飞书文档';
}

/**
 * 从内容中提取摘要
 */
function extractExcerpt(content) {
  // 移除标题行
  const contentWithoutTitle = content.replace(/^#\s+.+$/m, '').trim();
  
  // 获取第一段非空文本作为摘要
  const paragraphs = contentWithoutTitle.split(/\n\s*\n/);
  for (const paragraph of paragraphs) {
    const cleanParagraph = paragraph.trim().replace(/^[#\-*>]+\s*/, '');
    if (cleanParagraph) {
      return cleanParagraph.length > 200 
        ? cleanParagraph.substring(0, 200) + '...' 
        : cleanParagraph;
    }
  }
  
  return '';
}

// 不再提取标签

/**
 * 导入飞书文档到数据库
 */
async function importFeishuToDB() {
  try {
    console.log('开始导入飞书文档到数据库...');
    
    // 排除SUMMARY.md文件
    const fileNames = fs.readdirSync(feishuDirectory)
      .filter(fileName => fileName.endsWith('.md') && fileName !== 'SUMMARY.md');
    
    console.log(`找到 ${fileNames.length} 个飞书文档`);
    
    // 处理每个文件
    for (const fileName of fileNames) {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(feishuDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 使用gray-matter解析markdown文件的元数据
      const matterResult = matter(fileContents);
      
      // 获取文件的创建时间作为日期
      const stats = fs.statSync(fullPath);
      const date = stats.birthtime;
      
      // 从内容中提取信息
      const title = matterResult.data.title || extractTitle(matterResult.content);
      const excerpt = extractExcerpt(matterResult.content);
      
      console.log(`处理文档: ${title} (${slug})`);
      
      // 检查文章是否已存在
      const existingPost = await prisma.post.findUnique({
        where: { slug },
      });
      
      if (existingPost) {
        // 更新现有文章
        console.log(`更新现有文章: ${title}`);
        await prisma.post.update({
          where: { slug },
          data: {
            title,
            excerpt,
            content: matterResult.content,
            date,
            type: 'feishu'
          },
        });
      } else {
        // 创建新文章
        console.log(`创建新文章: ${title}`);
        await prisma.post.create({
          data: {
            slug,
            title,
            excerpt,
            content: matterResult.content,
            date,
            type: 'feishu'
          },
        });
      }
    }
    
    console.log('飞书文档导入数据库完成！');
  } catch (error) {
    console.error('导入过程中发生错误:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行导入
importFeishuToDB();
