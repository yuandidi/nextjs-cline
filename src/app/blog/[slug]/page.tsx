import { getPostBySlug } from '@/lib/blog';
import MDXContent from '@/components/MDXContent';
import { formatDate } from '@/lib/utils';
import CoverImage from '@/components/CoverImage';
import TagList from '@/components/TagList';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Await the params object to get the slug
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const post = await getPostBySlug(slug);
  
  // If the post doesn't exist, show 404 page
  if (!post) {
    notFound();
  }
  
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4">
          {post.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {formatDate(post.date)}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4">
            <TagList tags={post.tags} />
          </div>
        )}
      </div>
      
      <div className="relative h-64 sm:h-96 w-full mb-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
        <CoverImage 
          src={post.coverImage} 
          alt={`Cover image for ${post.title}`}
          title={post.title}
        />
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXContent source={post.content} />
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Share this post
        </h3>
        <div className="flex space-x-4">
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yourblog.com/blog/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500"
          >
            Twitter
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourblog.com/blog/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500"
          >
            Facebook
          </a>
          <a 
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://yourblog.com/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </article>
  );
}
