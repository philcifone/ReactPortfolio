import React, { useState, useEffect } from 'react';
import BlogPost from './BlogPost';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                console.log('Fetching posts from API...');
                const response = await fetch('/api/posts');
                console.log('API Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`API returned status ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Post data before processing:', data); // New log
                
                if (Array.isArray(data)) {
                    // New: Debug logging for tags
                    data.forEach(post => {
                        console.log('Post tags:', post.tags);
                        console.log('Post tags type:', typeof post.tags);
                    });
                    
                    // New: Process the data before setting state
                    const processedData = data.map(post => ({
                        ...post,
                        tags: (post.tags || []).map(tag => 
                            typeof tag === 'object' ? JSON.stringify(tag) : String(tag)
                        )
                    }));
                    
                    setPosts(processedData); // Changed from setPosts(data)
                } else {
                    console.error('API returned non-array data:', data);
                    setError('Received invalid data format from server');
                }
            } catch (error) {
                console.error('Error fetching posts from API:', error);
                setError('Could not load blog posts');
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <section id="blog" className="py-20 bg-neutral-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-display font-bold text-center mb-16 text-gray-200">
                        Blog Posts
                    </h2>
                    <p className="text-center text-gray-200">Loading posts...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="blog" className="py-20 bg-neutral-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-display text-center mb-16 text-gray-200">
                    Blog Posts
                </h2>
                {error ? (
                    <p className="text-red-400 text-center">{error}</p>
                ) : posts.length === 0 ? (
                    <p className="text-gray-200 text-center">No posts found</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {posts.map((post) => {
                            console.log('Rendering post:', post); // Debug log
                            const processedTags = (post.tags || []).map(tag => 
                                typeof tag === 'object' ? JSON.stringify(tag) : String(tag)
                            );
                            return (
                                <BlogPost
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    excerpt={post.excerpt}
                                    date={post.date || post.created_at}
                                    tags={processedTags}
                                    image_path={post.image_path}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blog;