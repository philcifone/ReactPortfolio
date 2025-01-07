import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-200">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-400">{error}</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-6 bg-neutral-800">
      <Link to="/" className="text-blue-400 hover:text-blue-300 block mb-8">
        ← Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-4 text-gray-200">{post.title}</h1>
      
      <div className="mb-8">
        <span className="text-gray-400">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2 mt-2">
          {post.tags && post.tags.map((tag, i) => (
            <span key={i} className="bg-gray-700 px-2 py-1 rounded-full text-xs text-gray-200">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {post.image_path && (
        <img 
          src={post.image_path} 
          alt={post.title}
          className="w-full h-auto rounded-lg mb-8"
        />
      )}
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>
      </div>
    </article>
  );
};

export default BlogPostPage;