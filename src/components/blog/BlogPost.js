import React from 'react';
import { Link } from 'react-router-dom';

const BlogPost = ({ id, title, excerpt, date, tags, image_path }) => (
  <article className="bg-neutral-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    {image_path && (
      <div className="w-full h-48 overflow-hidden">
        <img
          src={image_path}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    )}
    <div className="p-6">
      <div className="flex flex-col items-center text-sm text-gray-400 mb-4">
        <span>{new Date(date).toLocaleDateString()}</span>
        <div className="flex items-center gap-2 mt-4">
          {tags.map((tag, i) => (
            <span key={i} className="bg-gray-700 px-2 py-1 h-full text-center content-center rounded-full text-xs">
                {typeof tag === 'object' ? JSON.stringify(tag) : String(tag)}
            </span>
        ))}
        </div>
      </div>
      <h3 className="text-xl font-display text-center mb-6 text-gray-200">{title}</h3>
      <p className="text-gray-400 text-center">{excerpt}</p>
      <Link
        to={`/blog/${id}`}
        className="flex justify-center mt-6 inline-block text-light-olive hover:text-baby-blue transition-colors"
      >
        Read more →
      </Link>
    </div>
  </article>
);

export default BlogPost;