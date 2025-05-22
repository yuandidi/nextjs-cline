import { fetchPosts, fetchPostBySlug, fetchTags } from './api';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  tags?: string[];
}

// Sample blog posts for development
const samplePosts: BlogPost[] = [
  {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js',
    date: '2025-05-20',
    excerpt: 'Learn how to build modern web applications with Next.js, a React framework with server-side rendering capabilities.',
    coverImage: '/images/blog/nextjs-cover.jpg',
    content: '# Getting Started with Next.js\n\nNext.js is a powerful React framework that enables functionality such as server-side rendering, static site generation, and API routes. It\'s designed to make building modern web applications easier and more efficient.\n\n## Why Choose Next.js?\n\nThere are several reasons why Next.js has become a popular choice for developers:\n\n1. **Server-side Rendering (SSR)**: Next.js can render pages on the server, which improves performance and SEO.\n2. **Static Site Generation (SSG)**: You can generate static HTML files at build time, which can be served from a CDN for maximum performance.\n3. **API Routes**: Next.js allows you to create API endpoints as part of your application.\n4. **File-based Routing**: The routing system is based on the file system, making it intuitive and easy to use.\n5. **Built-in CSS Support**: Next.js has built-in support for CSS modules, Sass, and other styling solutions.\n\n## Getting Started\n\nTo create a new Next.js project, run the following command:\n\n```bash\nnpx create-next-app my-next-app\n```\n\nThis will create a new Next.js project in the `my-next-app` directory with all the necessary files and dependencies.\n\n## Creating Your First Page\n\nIn Next.js, pages are React components exported from files in the `pages` directory. To create a new page, simply create a new file in the `pages` directory:\n\n```jsx\n// pages/about.js\nexport default function About() {\n  return (\n    <div>\n      <h1>About Us</h1>\n      <p>This is the about page of our website.</p>\n    </div>\n  );\n}\n```\n\nThis will create a new page at the `/about` route.\n\n## Conclusion\n\nNext.js is a powerful framework that makes building modern web applications easier and more efficient. With features like server-side rendering, static site generation, and API routes, it\'s a great choice for building fast, SEO-friendly web applications.',
    tags: ['nextjs', 'react', 'frontend']
  },
  {
    slug: 'modern-css-techniques',
    title: 'Modern CSS Techniques for Better Web Design',
    date: '2025-05-15',
    excerpt: 'Explore modern CSS techniques and best practices to create responsive, accessible, and visually appealing web designs.',
    coverImage: '/images/blog/css-cover.jpg',
    content: '# Modern CSS Techniques for Better Web Design\n\nCSS has evolved significantly over the years, providing web designers with powerful tools to create responsive, accessible, and visually appealing websites. In this post, we\'ll explore some modern CSS techniques that can help you improve your web design skills.\n\n## Flexbox and Grid\n\nFlexbox and Grid are two layout systems that have revolutionized how we design web layouts:\n\n### Flexbox\n\nFlexbox is designed for one-dimensional layouts, either rows or columns:\n\n```css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\n### Grid\n\nGrid is designed for two-dimensional layouts, with rows and columns:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n```\n\n## CSS Variables\n\nCSS variables (custom properties) allow you to store and reuse values throughout your stylesheet:\n\n```css\n:root {\n  --primary-color: #3498db;\n  --secondary-color: #2ecc71;\n  --font-family: "Arial", sans-serif;\n}\n\n.button {\n  background-color: var(--primary-color);\n  font-family: var(--font-family);\n}\n```\n\n## Media Queries and Responsive Design\n\nMedia queries allow you to apply different styles based on the device characteristics:\n\n```css\n/* Mobile styles */\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}\n\n/* Desktop styles */\n@media (min-width: 769px) {\n  .container {\n    flex-direction: row;\n  }\n}\n```\n\n## Conclusion\n\nModern CSS provides powerful tools for creating responsive, accessible, and visually appealing web designs. By leveraging techniques like Flexbox, Grid, CSS variables, and media queries, you can create websites that look great on any device and provide a better user experience.',
    tags: ['css', 'frontend', 'web-design', 'responsive-design']
  },
  {
    slug: 'understanding-react-hooks',
    title: 'Understanding React Hooks: A Comprehensive Guide',
    date: '2025-05-10',
    excerpt: 'Learn how to use React Hooks to manage state and side effects in functional components, making your code cleaner and more reusable.',
    coverImage: '/images/blog/react-hooks-cover.jpg',
    content: '# Understanding React Hooks: A Comprehensive Guide\n\nReact Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class component. They allow you to "hook into" React state and lifecycle features from functional components, making your code cleaner and more reusable.\n\n## Why Hooks?\n\nBefore Hooks, you had to use class components to manage state and lifecycle methods. This often led to complex components that were difficult to understand and reuse. Hooks solve this problem by allowing you to:\n\n- Use state and other React features without classes\n- Reuse stateful logic between components\n- Organize related code together instead of splitting it across lifecycle methods\n\n## Basic Hooks\n\n### useState\n\nThe `useState` hook allows you to add state to functional components:\n\n```jsx\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n### useEffect\n\nThe `useEffect` hook allows you to perform side effects in functional components:\n\n```jsx\nimport React, { useState, useEffect } from \'react\';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n  }, [count]); // Only re-run the effect if count changes\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n### useContext\n\nThe `useContext` hook allows you to subscribe to React context without introducing nesting:\n\n```jsx\nimport React, { useContext } from \'react\';\n\nconst ThemeContext = React.createContext(\'light\');\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>I am styled by theme context!</button>;\n}\n```\n\n## Additional Hooks\n\nReact also provides additional hooks like `useReducer`, `useCallback`, `useMemo`, `useRef`, and more, which can be used for more specific use cases.\n\n## Custom Hooks\n\nOne of the most powerful features of Hooks is the ability to create your own custom hooks, which allow you to extract component logic into reusable functions:\n\n```jsx\nimport { useState, useEffect } from \'react\';\n\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  \n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener(\'resize\', handleResize);\n    return () => {\n      window.removeEventListener(\'resize\', handleResize);\n    };\n  }, []);\n  \n  return width;\n}\n\nfunction MyComponent() {\n  const width = useWindowWidth();\n  return <div>Window width: {width}</div>;\n}\n```\n\n## Conclusion\n\nReact Hooks provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle. They allow you to write more concise and reusable code, making your components easier to understand and test.',
    tags: ['react', 'hooks', 'frontend', 'javascript']
  }
];

/**
 * Get all blog posts with their metadata
 * @returns Array of blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Try to fetch from API first
    const posts = await fetchPosts();
    return posts;
  } catch (error) {
    console.log('Falling back to sample posts:', error);
    // Fall back to sample posts if API fails
    return samplePosts;
  }
}

/**
 * Get a single blog post by slug
 * @param slug - The slug of the post to retrieve
 * @returns The blog post data or null if not found
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Try to fetch from API first
    const post = await fetchPostBySlug(slug);
    return post;
  } catch (error) {
    console.log(`Falling back to sample post for slug: ${slug}:`, error);
    // Fall back to sample posts if API fails
    const post = samplePosts.find(p => p.slug === slug) || null;
    return post;
  }
}

/**
 * Get all available blog post slugs
 * @returns Array of slugs
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    // Try to fetch from API first
    const posts = await fetchPosts();
    return posts.map(post => post.slug);
  } catch (error) {
    console.log('Falling back to sample post slugs:', error);
    // Fall back to sample posts if API fails
    return samplePosts.map(post => post.slug);
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
