import React from 'react';

const AnimatedHeading = ({ text }) => {
  return (
    <h2 className="text-4xl font-bold text-center mb-16">
      <div className="relative inline-block group">
        <span className="relative z-10 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
          {text}
        </span>
        
        {/* Simple glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      </div>
    </h2>
  );
};

export default AnimatedHeading;