import { getAllPosts } from '@/lib/blog';
import BlogPostCard from '@/components/BlogPostCard';
import SearchBar from '@/components/SearchBar';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-full h-40 bg-gradient-to-r from-sakura-200 via-lavender-200 to-sky-200 dark:from-sakura-900 dark:via-lavender-900 dark:to-sky-900 opacity-20 rounded-full blur-3xl"></div>
        <h1 className="text-4xl font-bold font-quicksand anime-gradient-text sm:text-5xl md:text-6xl relative z-10">
          二次元博客
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-quicksand">
          探索动漫、游戏、编程和二次元文化的世界
        </p>
        <div className="mt-6 flex justify-center">
          <span className="inline-block text-sm font-noto-jp text-lavender-600 dark:text-lavender-400">
            アニメとマンガの世界へようこそ！
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar posts={posts} />

      {/* Featured Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold font-quicksand text-sakura-600 dark:text-sakura-400 mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          最新文章
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-sakura-50 to-lavender-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 shadow-lg border border-sakura-100 dark:border-sakura-900">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h3 className="text-xl font-bold font-quicksand text-sakura-600 dark:text-sakura-400">
              订阅我们的通讯
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              获取最新的二次元内容和博客更新。
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:w-1/3">
            <form className="flex">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="flex-grow px-4 py-2 rounded-l-md border border-sakura-200 dark:border-sakura-800 focus:outline-none focus:ring-2 focus:ring-sakura-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="bg-sakura-500 hover:bg-sakura-600 text-white px-4 py-2 rounded-r-md transition-colors duration-200"
              >
                订阅
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
