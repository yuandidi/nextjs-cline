import { getAllPosts } from '@/lib/blog';
import BlogPostCard from '@/components/BlogPostCard';
import SearchBar from '@/components/SearchBar';

export default async function FeishuPage() {
  // 获取所有文章
  const allPosts = await getAllPosts();
  
  // 筛选出飞书文章
  const feishuPosts = allPosts.filter(post => post.type === 'feishu');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-full h-40 bg-gradient-to-r from-sakura-200 via-lavender-200 to-sky-200 dark:from-sakura-900 dark:via-lavender-900 dark:to-sky-900 opacity-20 rounded-full blur-3xl"></div>
        <h1 className="text-4xl font-bold font-quicksand text-sakura-600 dark:text-sakura-400 sm:text-5xl md:text-6xl relative z-10">
          飞书文档库
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-quicksand">
          所有文档均从飞书知识库自动同步
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar posts={feishuPosts} />

      {/* Featured Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold font-quicksand text-sakura-600 dark:text-sakura-400 mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          飞书文档
        </h2>
        
        {feishuPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {feishuPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              暂无飞书文档
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              请在飞书知识库中添加文档后重新导出
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
