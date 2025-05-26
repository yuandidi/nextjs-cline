import { BlogPost } from './blog';

// 定义飞书文章接口，只包含飞书文章需要的字段
interface FeishuPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  type: string;
}
import prisma from './prisma';
import { Prisma } from '@prisma/client';

// 定义包含type字段的Post类型
interface PostWithType {
  id: number;
  slug: string;
  title: string;
  date: Date;
  excerpt: string;
  content: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 获取所有飞书文档
 */
export async function getAllFeishuPosts(): Promise<BlogPost[]> {
  try {
    // 从数据库中获取所有飞书文章
    const posts = await prisma.post.findMany({
      where: {
        type: 'feishu'
      } as Prisma.PostWhereInput,
      orderBy: {
        date: 'desc'
      }
    });
    
    // 将Prisma模型转换为FeishuPost接口
    return posts.map(post => {
      const typedPost = post as unknown as PostWithType;
      return {
        slug: typedPost.slug,
        title: typedPost.title,
        date: typedPost.date.toISOString(),
        excerpt: typedPost.excerpt,
        content: typedPost.content,
        type: typedPost.type
      } as FeishuPost;
    });
  } catch (error) {
    console.error('获取飞书文章时出错:', error);
    return [];
  }
}

/**
 * 获取所有飞书文档的slug
 */
export async function getAllFeishuSlugs(): Promise<string[]> {
  try {
    // 从数据库中获取所有飞书文章的slug
    const posts = await prisma.post.findMany({
      where: {
        type: 'feishu'
      } as Prisma.PostWhereInput,
      select: {
        slug: true
      }
    });
    
    return posts.map(post => post.slug);
  } catch (error) {
    console.error(`获取飞书文档slug时出错: ${error}`);
    return [];
  }
}

/**
 * 根据slug获取飞书文档
 */
export async function getFeishuPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // 从数据库中获取指定slug的飞书文章
    const post = await prisma.post.findFirst({
      where: {
        slug,
        type: 'feishu'
      } as Prisma.PostWhereInput
    });
    
    if (!post) {
      return null;
    }
    
    // 将Prisma模型转换为FeishuPost接口
    const typedPost = post as unknown as PostWithType;
    return {
      slug: typedPost.slug,
      title: typedPost.title,
      date: typedPost.date.toISOString(),
      excerpt: typedPost.excerpt,
      content: typedPost.content,
      type: typedPost.type
    } as FeishuPost;
  } catch (error) {
    console.error(`获取飞书文档时出错: ${error}`);
    return null;
  }
}
