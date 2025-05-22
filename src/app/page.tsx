import { getAllPosts } from '@/lib/blog';
import BlogPostCard from '@/components/BlogPostCard';
import SearchBar from '@/components/SearchBar';

export default async function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Welcome to My Blog
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Exploring web development, programming, and technology.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar posts={posts} />

      {/* Featured Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Latest Posts
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Subscribe to the newsletter
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Get the latest posts delivered right to your inbox.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:w-1/3">
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
