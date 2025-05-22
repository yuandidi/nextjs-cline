import { getAllTags, getPostsByTag } from '@/lib/blog';
import Link from 'next/link';

export default async function TagsPage() {
  const tags = await getAllTags();
  
  // Get post counts for each tag
  const tagCounts = await Promise.all(
    tags.map(async (tag) => {
      const posts = await getPostsByTag(tag);
      return { tag, count: posts.length };
    })
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4">
          All Tags
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Browse posts by topic
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {tagCounts.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-900 dark:text-white"
          >
            <span className="font-medium">#{tag}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({count})
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
