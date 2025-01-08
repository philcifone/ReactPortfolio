import React, { useState, useEffect } from 'react';

const BlogAdmin = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    image: null
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => console.log('API Test Response:', data))
      .catch(err => console.error('API Test Error:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    // Add each field to FormData
    Object.keys(formData).forEach(key => {
      if (formData[key]) { // Only add if value exists
        if (key === 'image') {
          data.append(key, formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    try {
      console.log('Sending request to server...');
      
      // Use the full URL
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        body: data
      });
      
      console.log('Response status:', response.status);
      
      // Get the raw response text first
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);
      
      if (response.ok) {
        const result = JSON.parse(rawResponse);
        setMessage('Post created successfully!');
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          tags: '',
          image: null
        });
      } else {
        setMessage(`Error creating post: ${rawResponse}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Error: ' + error.message);
    }
};

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-200">Create New Blog Post</h1>
      
      {message && (
        <div className="mb-4 p-4 rounded bg-blue-100 text-blue-700">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields remain the same */}
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
          <label className="block text-sm font-medium mb-2 text-gray-200">Tags (comma-separated)</label>
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
          <label className="block text-sm font-medium mb-2 text-gray-200">Featured Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full text-gray-200"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default BlogAdmin;