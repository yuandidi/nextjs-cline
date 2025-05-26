/**
 * 飞书知识库导出脚本
 * 将飞书知识库内容导出为博客文章并存储到数据库中
 */

// 加载环境变量
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env' });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const matter = require('gray-matter');

const prisma = new PrismaClient();

// 检查必要的环境变量
const requiredEnvVars = ['FEISHU_APP_ID', 'FEISHU_APP_SECRET', 'FEISHU_SPACE_ID'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('错误: 缺少必要的环境变量:', missingEnvVars.join(', '));
  console.error('请确保已创建 .env 文件并填写相关配置');
  process.exit(1);
}

// 设置输出目录
const outputDir = process.env.OUTPUT_DIR || '../../src/content/feishu';
const absoluteOutputDir = path.resolve(__dirname, outputDir);

// 确保输出目录存在
if (!fs.existsSync(absoluteOutputDir)) {
  fs.mkdirSync(absoluteOutputDir, { recursive: true });
  console.log(`已创建输出目录: ${absoluteOutputDir}`);
}

// 设置临时导出目录
const tempDir = path.join(__dirname, 'temp_export');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

console.log('开始导出飞书知识库内容...');

// 设置环境变量用于feishu-pages导出
const exportEnv = {
  ...process.env,
  OUTPUT_DIR: tempDir,
  BASE_URL: process.env.BASE_URL || '/blog/feishu',
  URL_STYLE: process.env.URL_STYLE || 'nested'
};

// 如果设置了ROOT_NODE_TOKEN，则添加到环境变量
if (process.env.ROOT_NODE_TOKEN) {
  exportEnv.ROOT_NODE_TOKEN = process.env.ROOT_NODE_TOKEN;
}

try {
  // 执行feishu-pages导出
  execSync('npx feishu-pages', { 
    env: exportEnv,
    stdio: 'inherit'
  });
  
  console.log('飞书知识库内容导出成功！');
  
  // 处理导出的内容
  console.log('正在处理导出的内容...');
  
  // 读取导出的docs目录
  const docsDir = path.join(tempDir, 'docs');
  if (!fs.existsSync(docsDir)) {
    throw new Error('导出失败: 未找到docs目录');
  }
  
  // 递归复制文件函数
  function copyFilesRecursively(sourceDir, targetDir) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const items = fs.readdirSync(sourceDir);
    
    for (const item of items) {
      const sourcePath = path.join(sourceDir, item);
      const targetPath = path.join(targetDir, item);
      
      const stats = fs.statSync(sourcePath);
      
      if (stats.isDirectory()) {
        copyFilesRecursively(sourcePath, targetPath);
      } else if (stats.isFile()) {
        // 如果是Markdown文件，处理内容
        if (item.endsWith('.md')) {
          let content = fs.readFileSync(sourcePath, 'utf8');
          
          // 处理Markdown内容，添加博客所需的frontmatter
          const title = extractTitle(content);
          const date = new Date().toISOString().split('T')[0]; // 使用当前日期
          
          // 构建frontmatter
          const frontmatter = [
            '---',
            `title: "${title}"`,
            `date: "${date}"`,
            'type: "feishu"',
            'published: true',
            'tags: ["飞书"]',
            '---',
            '',
          ].join('\n');
          
          // 如果内容已经有frontmatter，则不添加
          if (!content.startsWith('---')) {
            content = frontmatter + content;
          }
          
          fs.writeFileSync(targetPath, content);
        } else {
          // 直接复制其他文件（如图片）
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    }
  }
  
  // 从Markdown内容中提取标题
  function extractTitle(content) {
    // 尝试从第一个h1标题提取
    const h1Match = content.match(/^# (.+)$/m);
    if (h1Match) {
      return h1Match[1].trim();
    }
    
    // 尝试从文件名提取
    return '飞书文档';
  }
  
  // 复制处理后的文件到目标目录
  copyFilesRecursively(docsDir, absoluteOutputDir);
  
  console.log(`处理完成！内容已保存到: ${absoluteOutputDir}`);
  
  // 将内容导入到数据库
  console.log('开始将飞书文档导入到数据库...');
  await importFeishuToDB(absoluteOutputDir);
  console.log('飞书文档已成功导入到数据库！');
  
  // 清理临时目录
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('临时文件已清理');
  
} catch (error) {
  console.error('导出过程中发生错误:', error);
  await prisma.$disconnect();
  process.exit(1);
}

/**
 * 从Markdown内容中提取摘要
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

/**
 * 导入飞书文档到数据库
 */
async function importFeishuToDB(feishuDirectory) {
  try {
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
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
