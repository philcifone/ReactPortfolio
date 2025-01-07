import React from 'react';
import { Link } from 'react-router-dom';

const BlogPost = ({ id, title, excerpt, date, tags }) => (
  <article className="bg-neutral-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-400 mb-4">
        <span>{new Date(date).toLocaleDateString()}</span>
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
      <Link 
        to={`/blog/${id}`} 
        className="mt-4 inline-block text-blue-400 hover:text-blue-300 transition-colors"
      >
        Read more →
      </Link>
    </div>
  </article>
);

export default BlogPost;