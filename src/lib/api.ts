import { BlogPost } from './blog';

// Define types for API responses
interface ApiPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  tags: ApiTag[];
  createdAt: string;
  updatedAt: string;
}

interface ApiTag {
  id: number;
  name: string;
}

// Use environment variable or fallback for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to make API requests that works in both client and server environments
async function makeApiRequest(url: string, options?: RequestInit) {
  // Use dynamic import for node-fetch in server environment
  if (typeof window === 'undefined') {
    try {
      // In server environment, use relative URL to the current host
      const serverUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
      const response = await fetch(serverUrl, options);
      return response;
    } catch (error) {
      console.error('Server fetch error:', error);
      throw error;
    }
  } else {
    // In browser environment, use standard fetch
    return fetch(url, options);
  }
}

/**
 * Fetch all blog posts from the API
 * @returns Array of blog posts
 */
export async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const response = await makeApiRequest('/api/posts');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const posts = await response.json() as ApiPost[];
    return posts.map((post: ApiPost) => ({
      ...post,
      tags: post.tags.map((tag: ApiTag) => tag.name),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 * @param slug - The slug of the post to fetch
 * @returns The blog post or null if not found
 */
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await makeApiRequest(`/api/posts/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    const post = await response.json() as ApiPost;
    return {
      ...post,
      tags: post.tags.map((tag: ApiTag) => tag.name),
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Create a new blog post
 * @param post - The blog post data
 * @returns The created blog post or null if failed
 */
export async function createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
  try {
    const response = await makeApiRequest('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.status}`);
    }
    
    const createdPost = await response.json() as ApiPost;
    return {
      ...createdPost,
      tags: createdPost.tags.map((tag: ApiTag) => tag.name),
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

/**
 * Update a blog post
 * @param slug - The slug of the post to update
 * @param post - The updated blog post data
 * @returns The updated blog post or null if failed
 */
export async function updatePost(
  slug: string,
  post: Partial<BlogPost>
): Promise<BlogPost | null> {
  try {
    const response = await makeApiRequest(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.status}`);
    }
    
    const updatedPost = await response.json() as ApiPost;
    return {
      ...updatedPost,
      tags: updatedPost.tags.map((tag: ApiTag) => tag.name),
    };
  } catch (error) {
    console.error(`Error updating post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Delete a blog post
 * @param slug - The slug of the post to delete
 * @returns True if successful, false otherwise
 */
export async function deletePost(slug: string): Promise<boolean> {
  try {
    const response = await makeApiRequest(`/api/posts/${slug}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting post with slug ${slug}:`, error);
    return false;
  }
}

/**
 * Fetch all tags from the API
 * @returns Array of tags
 */
export async function fetchTags(): Promise<string[]> {
  try {
    const response = await makeApiRequest('/api/tags');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`);
    }
    
    const tags = await response.json() as ApiTag[];
    return tags.map((tag: ApiTag) => tag.name);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}
