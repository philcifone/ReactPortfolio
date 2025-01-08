import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

const BlogAdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setMessage('Error fetching posts: ' + error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });
        
        console.log('Delete response status:', response.status);
        
        if (response.ok) {
          setMessage('Post deleted successfully');
          await fetchPosts(); // Refresh the posts list
        } else {
          const errorData = await response.json();
          console.error('Delete error response:', errorData);
          setMessage(`Error deleting post: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Delete operation error:', error);
        setMessage('Error: ' + error.message);
      }
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsEditing(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-neutral-800 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-200">Blog Admin Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      {message && (
        <div className="mb-4 p-4 rounded bg-blue-100 text-blue-700">
          {message}
        </div>
      )}

      {/* Posts Table */}
      <div className="overflow-x-auto">
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
                    {(() => {
                      let tagArray;
                      try {
                        tagArray = typeof post.tags === 'string' 
                          ? JSON.parse(post.tags.replace(/[\[\]"]/g, '').split(','))
                          : post.tags;
                      } catch (e) {
                        tagArray = post.tags || [];
                      }
                      return tagArray.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-neutral-600 rounded-full text-sm text-gray-300"
                        >
                          {tag.trim()}
                        </span>
                      ));
                    })()}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-200">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h2>
            <BlogPostForm
              post={selectedPost}
              onSubmit={async (formData) => {
                // Handle form submission
                try {
                  const url = isEditing ? `/api/posts/${selectedPost.id}` : '/api/posts';
                  const method = isEditing ? 'PUT' : 'POST';
                  
                  const response = await fetch(url, {
                    method,
                    body: formData
                  });
                  
                  if (response.ok) {
                    setMessage(`Post ${isEditing ? 'updated' : 'created'} successfully`);
                    fetchPosts();
                    setShowCreateForm(false);
                    setIsEditing(false);
                    setSelectedPost(null);
                  } else {
                    setMessage('Error saving post');
                  }
                } catch (error) {
                  setMessage('Error: ' + error.message);
                }
              }}
              onCancel={() => {
                setShowCreateForm(false);
                setIsEditing(false);
                setSelectedPost(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Reuse your existing BlogPostForm component or create a new one
const BlogPostForm = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
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
    
    console.log('Raw form data:', formData);
    
    Object.keys(formData).forEach(key => {
      if (key === 'tags') {
        // Clean and process tags
        const cleanedTags = formData[key]
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .join(',');
        console.log('Processed tags:', cleanedTags);
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
          className="w-full p-2 border rounded bg-neutral-700 text-gray-200 border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 border rounded h-48 bg-neutral-700 text-gray-200 border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">Excerpt</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full p-2 border rounded h-24 bg-neutral-700 text-gray-200 border-gray-600"
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
          className="w-full p-2 border rounded bg-neutral-700 text-gray-200 border-gray-600"
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
          className="w-full text-gray-200"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-200 hover:text-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default BlogAdminDashboard;