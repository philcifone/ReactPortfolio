import React, { useState, useEffect } from 'react';

const AnimatedHeading = ({ text }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const heading = document.getElementById('animated-heading');
      if (!heading) return;

      const rect = heading.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Only update if mouse has moved significantly
      setMousePosition(prev => {
        const dx = Math.abs(prev.x - x);
        const dy = Math.abs(prev.y - y);
        if (dx > 0.01 || dy > 0.01) {
          return { x, y };
        }
        return prev;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <h2 
      id="animated-heading"
      className="relative text-4xl font-bold text-center mb-16"
    >
      <div 
        className="relative inline-block text-transparent bg-clip-text transition-all duration-200"
        style={{
          backgroundImage: 'linear-gradient(45deg, rgb(74, 222, 128), rgb(59, 130, 246))',
          backgroundSize: '200% 200%',
          backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
        }}
      >
        {text}
        <div 
          className="absolute inset-0 -z-10 blur-xl opacity-20"
          style={{
            backgroundImage: 'linear-gradient(45deg, rgb(74, 222, 128), rgb(59, 130, 246))',
            backgroundSize: '200% 200%',
            backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
          }}
        />
      </div>
    </h2>
  );
};

export default AnimatedHeading;