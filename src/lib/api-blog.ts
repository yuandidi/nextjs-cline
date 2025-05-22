import { fetchPosts, fetchPostBySlug, fetchTags } from './api';
import { BlogPost } from './blog';

/**
 * Get all blog posts with their metadata from the API
 * @returns Array of blog posts sorted by date (newest first)
 */
export async function getAllPostsFromApi(): Promise<BlogPost[]> {
  return fetchPosts();
}

/**
 * Get a single blog post by slug from the API
 * @param slug - The slug of the post to retrieve
 * @returns The blog post data or null if not found
 */
export async function getPostBySlugFromApi(slug: string): Promise<BlogPost | null> {
  return fetchPostBySlug(slug);
}

/**
 * Get all available blog post slugs from the API
 * @returns Array of slugs
 */
export async function getAllPostSlugsFromApi(): Promise<string[]> {
  const posts = await fetchPosts();
  return posts.map(post => post.slug);
}

/**
 * Get all posts with a specific tag from the API
 * @param tag - The tag to filter by
 * @returns Array of blog posts with the specified tag
 */
export async function getPostsByTagFromApi(tag: string): Promise<BlogPost[]> {
  const allPosts = await fetchPosts();
  return allPosts.filter(post => post.tags && post.tags.includes(tag));
}

/**
 * Get all unique tags from all blog posts from the API
 * @returns Array of unique tags
 */
export async function getAllTagsFromApi(): Promise<string[]> {
  return fetchTags();
}
