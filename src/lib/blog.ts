import { fetchTags } from './api';
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

// 空的示例文章数组，不再使用示例文章
const samplePosts: BlogPost[] = [];

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

/**
 * Get all posts with a specific tag
 * @param tag - The tag to filter by
 * @returns Array of blog posts with the specified tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    // Try to fetch from API first
    const allPosts = await getAllPosts();
    return allPosts.filter(post => post.tags && post.tags.includes(tag));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(`Falling back to sample posts for tag: ${tag}:`, error);
    // Fall back to sample posts if API fails
    return samplePosts.filter(post => post.tags && post.tags.includes(tag));
  }
}

/**
 * Get all unique tags from all blog posts
 * @returns Array of unique tags
 */
export async function getAllTags(): Promise<string[]> {
  try {
    // Try to fetch from API first
    return await fetchTags();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log('Falling back to sample tags:', error);
    // Fall back to sample posts if API fails
    const tagsSet = new Set<string>();
    
    samplePosts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    
    return Array.from(tagsSet).sort();
  }
}
