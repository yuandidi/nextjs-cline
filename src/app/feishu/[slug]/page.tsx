import { getPostBySlug } from '@/lib/blog';
import MDXContent from '@/components/MDXContent';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function FeishuPost({ params }: { params: { slug: string } }) {
  // 获取slug参数
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const post = await getPostBySlug(slug);
  
  // 如果文章不存在或不是飞书类型，显示404页面
  if (!post || post.type !== 'feishu') {
    notFound();
  }
  
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/feishu" className="text-sakura-600 dark:text-sakura-400 hover:underline mb-4 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          返回飞书文档列表
        </Link>
        
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-sakura-500 dark:border-sakura-600">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-sakura-500 dark:text-sakura-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.date)}
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 prose prose-lg dark:prose-invert max-w-none prose-headings:text-sakura-700 dark:prose-headings:text-sakura-400 prose-a:text-sakura-600 dark:prose-a:text-sakura-400">
        <MDXContent source={post.content} />
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sakura-500 dark:text-sakura-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>从飞书知识库自动同步</span>
        </div>
      </div>
    </article>
  );
}
