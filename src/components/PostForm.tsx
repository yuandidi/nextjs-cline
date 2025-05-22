'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/blog';
import { createPost, updatePost, fetchTags } from '@/lib/api';
import dynamic from 'next/dynamic';
import MDXContent from './MDXContent';

// Import the markdown editor dynamically to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface PostFormProps {
  initialData?: Partial<BlogPost>;
  isEditing?: boolean;
}

// Define the view modes for the editor
type EditorViewMode = 'edit' | 'live' | 'preview';

export default function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    coverImage: '',
    tags: [],
    ...initialData,
  });
  
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<EditorViewMode>('edit');
  const [isDraft, setIsDraft] = useState(initialData?.isDraft ?? true);
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(initialData?.seoKeywords || '');

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Error loading tags:', err);
      }
    };

    loadTags();
  }, []);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title if not editing
    if (name === 'title' && !isEditing) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle markdown editor content change
  const handleContentChange = (value?: string) => {
    setFormData(prev => ({ ...prev, content: value || '' }));
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  const addNewTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      setAvailableTags(prev => [...prev, newTag.trim()]);
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Add SEO metadata and draft status to the post data
      const postData = {
        ...formData,
        isDraft,
        seoDescription,
        seoKeywords
      };
      
      let result;
      if (isEditing && initialData?.slug) {
        result = await updatePost(initialData.slug, postData);
      } else {
        result = await createPost(postData as Omit<BlogPost, 'id'>);
      }
      
      if (result) {
        router.push('/admin');
      } else {
        setError('Failed to save post. Please try again.');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // No toggle function needed as we're using viewMode directly

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            disabled={isEditing}
          />
          {isEditing && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Slug cannot be changed after creation.
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date ? formData.date.toString().split('T')[0] : ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={isDraft}
                onChange={() => setIsDraft(true)}
                className="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Draft</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={!isDraft}
                onChange={() => setIsDraft(false)}
                className="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Published</span>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Excerpt *
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SEO Description
          </label>
          <textarea
            id="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Meta description for search engines"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {seoDescription.length}/160 characters
          </p>
        </div>
        
        <div>
          <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SEO Keywords
          </label>
          <input
            type="text"
            id="seoKeywords"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Comma-separated keywords"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Cover Image URL
        </label>
        <div className="mt-1 flex">
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage || ''}
            onChange={handleChange}
            className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse
          </button>
        </div>
        {formData.coverImage && (
          <div className="mt-2">
            <img 
              src={formData.coverImage} 
              alt="Cover preview" 
              className="h-40 w-auto object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/blog/nextjs-cover.jpg';
              }}
            />
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {availableTags.map(tag => (
            <label key={tag} className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <input
                type="checkbox"
                checked={(formData.tags || []).includes(tag)}
                onChange={() => handleTagChange(tag)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{tag}</span>
            </label>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag"
            className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={addNewTag}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content *
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'edit' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setViewMode('live')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'live' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Live
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'preview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        
        {/* Markdown Editor */}
        <div data-color-mode="auto">
          <MDEditor
            value={formData.content || ''}
            onChange={handleContentChange}
            preview={viewMode}
            height={400}
            className="mt-1"
          />
        </div>
      </div>
      
      {viewMode === 'preview' && (
        <div className="border rounded-md p-6 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4">{formData.title || 'Post Title'}</h2>
          <div className="prose dark:prose-invert max-w-none">
            <MDXContent source={formData.content || ''} />
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
