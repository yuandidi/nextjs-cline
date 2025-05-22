import { getPostsByTag, getAllTags } from '@/lib/blog';
import BlogPostCard from '@/components/BlogPostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  
  return tags.map((tag: string) => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  // Get the tag from params
  const tag = params.tag;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag);
  
  if (posts.length === 0) {
    notFound();
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4">
          Posts tagged with &quot;{decodedTag}&quot;
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Found {posts.length} post{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
