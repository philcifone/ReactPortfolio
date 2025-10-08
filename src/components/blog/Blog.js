import React, { useState, useEffect } from 'react';
import BlogPost from './BlogPost';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // Initialize with different number of posts based on screen size
    const [visiblePosts, setVisiblePosts] = useState(6);
    const [defaultVisiblePosts, setDefaultVisiblePosts] = useState(6);
    
    // Set up resize listener to update default visible posts
    useEffect(() => {
        const handleResize = () => {
            // Use window width to determine the appropriate number of posts
            const width = window.innerWidth;
            if (width < 768) { // Mobile
                setDefaultVisiblePosts(3);
            } else if (width < 1024) { // Tablet
                setDefaultVisiblePosts(4);
            } else { // Desktop
                setDefaultVisiblePosts(6);
            }
        };
        
        // Set initial value
        handleResize();
        
        // Add resize listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                console.log('Post data before processing:', data);
                
                if (Array.isArray(data)) {
                    // Process the data before setting state
                    const processedData = data.map(post => ({
                        ...post,
                        tags: (post.tags || []).map(tag => 
                            typeof tag === 'object' ? JSON.stringify(tag) : String(tag)
                        )
                    }));
                    
                    setPosts(processedData);
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

    // Function to handle toggling between show more and show less
    const handleShowToggle = () => {
        if (visiblePosts < posts.length) {
            // Show more posts - increment appropriately based on screen size
            const increment = Math.max(3, defaultVisiblePosts);
            setVisiblePosts(prev => Math.min(prev + increment, posts.length));
        } else {
            // Show less posts (collapse back to default number)
            setVisiblePosts(defaultVisiblePosts);
        }
    };
    
    // Determine if we're showing all posts
    const isShowingAll = visiblePosts >= posts.length;

    if (loading) {
        return (
            <section id="blog" className="py-20 bg-neutral-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-display text-center mb-16 text-gray-200">
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
                    <>
                        <div 
                            id="blog-posts-container"
                            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {posts.slice(0, visiblePosts).map((post, index) => {
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
                        
                        {/* Toggle Link - only display if there are more than 6 posts */}
                        {posts.length > 6 && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={handleShowToggle}
                                    className="text-kelly-green hover:text-baby-blue flex items-center gap-2 text-lg transition-colors border-b border-b-kelly-green hover:border-b-baby-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-baby-blue"
                                    aria-expanded={isShowingAll ? "true" : "false"}
                                    aria-controls="blog-posts-container"
                                >
                                    {isShowingAll ? (
                                        <>
                                            <span>Show fewer posts</span>
                                            <ChevronUp size={20} aria-hidden="true" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Show more posts</span>
                                            <ChevronDown size={20} aria-hidden="true" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Blog;