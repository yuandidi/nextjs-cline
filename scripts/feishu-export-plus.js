/**
 * 飞书知识库一体化导出脚本
 * 功能：
 * 1. 从飞书知识库导出内容
 * 2. 比对并删除在飞书中已不存在的文章
 * 3. 添加新增的文章和更新已有文章
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
const outputDir = process.env.OUTPUT_DIR || 'src/content/feishu';
const absoluteOutputDir = path.resolve(process.cwd(), outputDir);

// 确保输出目录存在
if (!fs.existsSync(absoluteOutputDir)) {
  fs.mkdirSync(absoluteOutputDir, { recursive: true });
  console.log(`已创建输出目录: ${absoluteOutputDir}`);
}

// 设置临时导出目录
const tempDir = path.join(process.cwd(), 'temp_feishu_export');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

console.log('===== 飞书知识库一体化导出工具 =====');

// 主函数
async function main() {
  try {
    console.log('步骤 1/4: 获取数据库中现有的飞书文章...');
    // 获取数据库中所有飞书文章的slug
    const existingPosts = await prisma.post.findMany({
      where: {
        type: 'feishu'
      },
      select: {
        slug: true,
        title: true
      }
    });
    
    const existingSlugs = new Set(existingPosts.map(post => post.slug));
    const existingPostsMap = new Map(existingPosts.map(post => [post.slug, post]));
    console.log(`数据库中现有 ${existingSlugs.size} 篇飞书文章`);
    
    console.log('\n步骤 2/4: 从飞书导出文档...');
    // 执行飞书导出
    await exportFromFeishu();
    
    console.log('\n步骤 3/4: 处理已删除的文章...');
    // 获取导出目录中的所有文件
    const exportedFiles = fs.readdirSync(absoluteOutputDir)
      .filter(fileName => fileName.endsWith('.md') && fileName !== 'SUMMARY.md');
    
    // 获取导出的文章slug
    const exportedSlugs = new Set(exportedFiles.map(fileName => fileName.replace(/\.md$/, '')));
    console.log(`飞书导出了 ${exportedSlugs.size} 篇文章`);
    
    // 打印导出的文章列表，便于调试
    console.log('导出的文章列表:');
    exportedFiles.forEach(fileName => {
      console.log(`- ${fileName}`);
    });
    
    // 找出在数据库中存在但在导出中不存在的文章
    const deletedSlugs = [...existingSlugs].filter(slug => !exportedSlugs.has(slug));
    
    if (deletedSlugs.length > 0) {
      console.log(`\n发现 ${deletedSlugs.length} 篇在飞书中已删除的文章:`);
      
      // 删除这些文章
      for (const slug of deletedSlugs) {
        const post = existingPostsMap.get(slug);
        console.log(`- 删除文章: ${post?.title || slug} (${slug})`);
        
        await prisma.post.delete({
          where: { slug }
        });
      }
      
      console.log(`\n成功删除 ${deletedSlugs.length} 篇在飞书中已不存在的文章`);
    } else {
      console.log('\n没有发现需要删除的文章');
    }
    
    console.log('\n步骤 4/4: 导入新增和更新的文章...');
    // 导入新增和更新的文章
    await importFeishuToDB(absoluteOutputDir, existingSlugs);
    
    console.log('\n===== 同步完成! =====');
    console.log('飞书文档已成功导出并导入到数据库中，已删除的文章也已处理');
    
  } catch (error) {
    console.error('\n同步过程中发生错误:', error);
    process.exit(1);
  } finally {
    // 清理临时目录
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('临时文件已清理');
    }
    
    await prisma.$disconnect();
  }
}

/**
 * 从飞书导出文档
 */
async function exportFromFeishu() {
  console.log('开始导出飞书知识库内容...');
  
  // 清空输出目录，确保不会有旧文件残留
  if (fs.existsSync(absoluteOutputDir)) {
    console.log(`清空输出目录: ${absoluteOutputDir}`);
    const files = fs.readdirSync(absoluteOutputDir);
    for (const file of files) {
      const filePath = path.join(absoluteOutputDir, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    }
  }
  
  // 设置环境变量用于feishu-pages导出
  const exportEnv = {
    ...process.env,
    OUTPUT_DIR: tempDir,
    BASE_URL: process.env.BASE_URL || '/blog/feishu',
    URL_STYLE: process.env.URL_STYLE || 'nested',
    FORCE_REFRESH: 'true' // 强制刷新，不使用缓存
  };
  
  // 如果设置了ROOT_NODE_TOKEN，则添加到环境变量
  if (process.env.ROOT_NODE_TOKEN) {
    exportEnv.ROOT_NODE_TOKEN = process.env.ROOT_NODE_TOKEN;
  }
  
  try {
    // 执行feishu-pages导出，添加--no-cache参数确保获取最新内容
    execSync('npx feishu-pages --no-cache', { 
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
    
    // 复制处理后的文件到目标目录
    copyFilesRecursively(docsDir, absoluteOutputDir);
    
    console.log(`处理完成！内容已保存到: ${absoluteOutputDir}`);
    
  } catch (error) {
    console.error('导出过程中发生错误:', error);
    throw error;
  }
}

/**
 * 从Markdown内容中提取标题
 */
function extractTitle(content) {
  // 尝试从第一个h1标题提取
  const h1Match = content.match(/^# (.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // 尝试从文件名提取
  return '飞书文档';
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
async function importFeishuToDB(feishuDirectory, existingSlugs) {
  try {
    // 排除SUMMARY.md文件
    const fileNames = fs.readdirSync(feishuDirectory)
      .filter(fileName => fileName.endsWith('.md') && fileName !== 'SUMMARY.md');
    
    console.log(`找到 ${fileNames.length} 个飞书文档`);
    
    let updatedCount = 0;
    let createdCount = 0;
    
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
      
      // 检查文章是否已存在
      if (existingSlugs.has(slug)) {
        // 更新现有文章
        console.log(`更新现有文章: ${title} (${slug})`);
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
        updatedCount++;
      } else {
        // 创建新文章
        console.log(`创建新文章: ${title} (${slug})`);
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
        createdCount++;
      }
    }
    
    console.log(`\n成功更新 ${updatedCount} 篇文章，创建 ${createdCount} 篇新文章`);
  } catch (error) {
    console.error('导入过程中发生错误:', error);
    throw error;
  }
}

// 执行主函数
main().catch(error => {
  console.error('执行主函数时发生错误:', error);
  process.exit(1);
});
