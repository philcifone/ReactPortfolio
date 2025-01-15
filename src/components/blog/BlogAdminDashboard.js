import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogAdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Authentication error handler
  const handleAuthError = useCallback(() => {
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  }, [navigate]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const data = await response.json();
      const processedData = data.map(post => ({
        ...post,
        tags: Array.isArray(post.tags) 
          ? post.tags.map(tag => typeof tag === 'object' ? JSON.stringify(tag) : String(tag))
          : []
      }));

      setPosts(processedData);
    } catch (error) {
      setMessage('Error fetching posts: ' + error.message);
    }
  }, [handleAuthError]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          handleAuthError();
          return;
        }

        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        
        if (response.ok) {
          setMessage('Post deleted successfully');
          await fetchPosts();
        } else {
          const errorData = await response.json();
          setMessage(`Error deleting post: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        setMessage('Error: ' + error.message);
      }
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsEditing(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const url = isEditing ? `/api/posts/${selectedPost.id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }
      
      if (response.ok) {
        setMessage(`Post ${isEditing ? 'updated' : 'created'} successfully`);
        fetchPosts();
        setShowCreateForm(false);
        setIsEditing(false);
        setSelectedPost(null);
      } else {
        const errorData = await response.json();
        setMessage(`Error saving post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 bg-neutral-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-display text-gray-200">Blog Admin Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-kelly-green hover:bg-light-olive text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div className="mb-4 p-4 rounded-lg bg-blue-100 text-blue-700">
          {message}
        </div>
      )}

      {/* Mobile Post Cards */}
      <div className="block sm:hidden space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-neutral-700 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-medium text-gray-200">{post.title}</h3>
            <p className="text-sm text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-neutral-600 rounded-full text-xs text-gray-300"
                >
                  {typeof tag === 'string' ? tag.trim() : JSON.stringify(tag)}
                </span>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(post)}
                className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-400 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                <Pencil size={18} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="flex-1 flex items-center justify-center gap-2 p-2 text-red-400 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full bg-neutral-700 rounded-lg overflow-hidden">
          <thead className="bg-neutral-600">
            <tr>
              <th className="p-4 text-left text-gray-200">Title</th>
              <th className="p-4 text-left text-gray-200">Date</th>
              <th className="p-4 text-left text-gray-200">Tags</th>
              <th className="p-4 text-left text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-neutral-600">
                <td className="p-4 text-gray-200">{post.title}</td>
                <td className="p-4 text-gray-300">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-600 rounded-full text-sm text-gray-300"
                      >
                        {typeof tag === 'string' ? tag.trim() : JSON.stringify(tag)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-blue-400 hover:text-blue-300"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateForm || isEditing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-neutral-800 rounded-lg w-full max-w-5xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-700">
              <h2 className="text-2xl font-bold text-gray-200">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setIsEditing(false);
                  setSelectedPost(null);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <BlogPostForm
                post={selectedPost}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowCreateForm(false);
                  setIsEditing(false);
                  setSelectedPost(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BlogPostForm = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    created_at: post?.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    tags: Array.isArray(post?.tags) 
      ? post.tags.join(', ')
      : typeof post?.tags === 'string' 
        ? JSON.parse(post.tags).join(', ')
        : '',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'tags') {
        const cleanedTags = formData[key]
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .join(',');
        data.append('tags', cleanedTags);
      } else if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    onSubmit(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-neutral-700 text-gray-200 border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">Created Date</label>
        <input
          type="date"
          name="created_at"
          value={formData.created_at}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-neutral-700 text-gray-200 border-gray-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg h-48 bg-neutral-700 text-gray-200 border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">Excerpt</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg h-24 bg-neutral-700 text-gray-200 border-gray-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-neutral-700 text-gray-200 border-gray-600"
          placeholder="tech, tutorial, web development"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Featured Image
        </label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="w-full text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-600 file:text-gray-200 hover:file:bg-neutral-500"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-200 hover:text-gray-100 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default BlogAdminDashboard;