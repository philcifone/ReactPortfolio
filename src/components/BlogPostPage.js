import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

const BlogPostPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-neutral-800 rounded w-1/4"></div>
            <div className="h-12 bg-neutral-800 rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-neutral-800 rounded w-full"></div>
              <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="max-w-md p-8 bg-neutral-800 rounded-lg shadow-lg text-center">
          <p className="text-red-400 mb-4 text-lg">{error}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <article className="w-full max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-8 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-200 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-800 rounded-full text-xs text-gray-300 hover:bg-neutral-700 transition-colors"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.image_path && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.image_path} 
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="text-gray-300 leading-relaxed space-y-6 whitespace-pre-wrap">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-neutral-800 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPostPage;