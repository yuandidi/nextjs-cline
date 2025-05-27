import { getAllFeishuPosts, getFeishuPostBySlug, getAllFeishuSlugs } from './api-feishu';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  tags?: string[];
  isDraft?: boolean;
  seoDescription?: string;
  seoKeywords?: string;
  type?: string; // 'blog' 或 'feishu'
}

/**
 * Get all blog posts with their metadata
 * @returns Array of blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // 只获取飞书文章
    let feishuPosts: BlogPost[] = [];
    try {
      feishuPosts = await getAllFeishuPosts();
    } catch (error) {
      console.log('Error fetching feishu posts:', error);
    }

    // 按日期排序
    return feishuPosts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.log('Error in getAllPosts:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param slug - The slug of the post to retrieve
 * @returns The blog post data or null if not found
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // 只从飞书内容中获取
    try {
      const feishuPost = await getFeishuPostBySlug(slug);
      if (feishuPost) return feishuPost;
    } catch (error) {
      console.log(`Feishu fetch failed for slug: ${slug}:`, error);
    }
    
    return null;
  } catch (error) {
    console.log(`Error in getPostBySlug for ${slug}:`, error);
    return null;
  }
}

/**
 * Get all available blog post slugs
 * @returns Array of slugs
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    // 只获取飞书文章的slug
    let feishuSlugs: string[] = [];
    try {
      feishuSlugs = await getAllFeishuSlugs();
    } catch (error) {
      console.log('Error fetching feishu slugs:', error);
    }

    return feishuSlugs;
  } catch (error) {
    console.log('Error in getAllPostSlugs:', error);
    return [];
  }
}
