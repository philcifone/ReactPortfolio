import React from 'react';

const AnimatedHeading = ({ text }) => {
  return (
    <h2 className="text-4xl font-bold font-display text-center mb-12">
      <div className="relative inline-block group">
        <span className="relative z-10 bg-light-olive bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
          {text}
        </span>
      </div>
    </h2>
  );
};

export default AnimatedHeading;