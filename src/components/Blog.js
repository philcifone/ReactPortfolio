// // Blog.js
// import React, { useState, useEffect } from 'react';
// //import BlogPost from './.BlogPost'

// const Blog = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const response = await fetch('/api/posts');
//       if (response.ok) {
//         const data = await response.json();
//         setPosts(data);
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-20 text-gray-400">Loading...</div>;
//   }

//   return (
//     <section id="blog" className="py-20 bg-gray-900">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-4xl font-bold text-center mb-16 text-gray-200">
//           Latest Writings
//         </h2>
//         <div className="grid md:grid-cols-2 gap-8">
//           {posts.map((post, index) => (
//             <BlogPost
//               key={index}
//               title={post.title}
//               excerpt={post.excerpt}
//               date={post.date}
//               tags={post.tags}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Blog;

// // server.js (Node.js/Express backend example)
// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();

// // MongoDB Schema
// const PostSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   excerpt: { type: String, required: true },
//   content: { type: String, required: true },
//   date: { type: Date, default: Date.now },
//   tags: [String]
// });

// const Post = mongoose.model('Post', PostSchema);

// // Routes
// app.get('/api/posts', async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ date: -1 });
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching posts' });
//   }
// });

// app.post('/api/posts', async (req, res) => {
//   try {
//     const post = new Post(req.body);
//     await post.save();
//     res.status(201).json(post);
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating post' });
//   }
// });

import React from 'react';
const BlogPost = ({ title, excerpt, date, tags }) => (
<article className="bg-[#2c2c2c] rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
<div className="p-6">
<div className="flex items-center text-sm text-gray-400 mb-4">
<span>{date}</span>
<span className="mx-2">•</span>
<div className="flex gap-2">
{tags.map((tag, i) => (
<span key={i} className="bg-gray-700 px-2 py-1 rounded-full text-xs">
{tag}
</span>
 ))}
</div>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-200">{title}</h3>
<p className="text-gray-400">{excerpt}</p>
<button className="mt-4 text-blue-400 hover:text-blue-300 transition-colors">
 Read more →
</button>
</div>
</article>
);
const Blog = () => {
const posts = [
{
title: "The Art of Digital Preservation",
excerpt: "Exploring modern approaches to archiving digital artifacts...",
date: "2025-01-15",
tags: ["Archival", "Digital Preservation"]
},
{
title: "Linux Photography Workflow",
excerpt: "My open-source photography processing pipeline...",
date: "2025-01-10",
tags: ["Linux", "Photography"]
}
 ];
return (
<section id="blog" className="py-20 bg-[#424242]">
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 className="text-4xl font-bold text-center mb-16 text-gray-200">Latest Writings</h2>
<div className="grid md:grid-cols-2 gap-8">
{posts.map((post, index) => (
<BlogPost
key={index}
title={post.title}
excerpt={post.excerpt}
date={post.date}
tags={post.tags}
/>
 ))}
</div>
</div>
</section>
 );
};
export default Blog;