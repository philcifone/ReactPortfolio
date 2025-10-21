import React, { useState } from 'react';
import { Archive, Terminal, Camera, Code, Pen, BookOpen, Book } from 'lucide-react';
import vb10294 from '../images/vb10294.webp'

const SkillCard = ({ Icon, title, description }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="group relative p-6 space-y-4 bg-neutral-800/60 rounded-lg hover:transform hover:scale-105 transition-all duration-300 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Holographic background effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(179, 113, 223, 0.33),
            rgba(43, 184, 209, 0.34),
            rgba(133, 231, 21, 0.4)
          )`,
          filter: 'blur(8px)',
          transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`,
        }}
      />

      {/* Icon with gradient effect */}
      <div className="relative z-10">
        <Icon 
          size={40} 
          className="mx-auto text-light-olive transition-all duration-300"
        />
      </div>

      {/* Content */}
      <h3 className="relative z-10 text-xl font-display text-center text-neutral-100">{title}</h3>
      <p className="relative z-10 font-sans text-base text-center font-medium text-gray-300">{description}</p>
    </div>
  );
};

const SkillCard2 = ({ Icon, title, description }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="group relative p-6 space-y-4 bg-neutral-800/60 rounded-lg hover:transform hover:scale-100 transition-all duration-300 overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* Holographic background effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(179, 113, 223, 0.13),
            rgba(43, 184, 209, 0.15),
            rgba(133, 231, 21, 0.2)
          )`,
          filter: 'blur(8px)',
          transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`,
        }}
      />

      {/* Content */}
      <h3 className="relative z-10 text-xl font-display text-center text-neutral-100">{title}</h3>
      <p className="relative z-10 font-sans text-base text-center font-medium text-gray-300">{description}</p>
    </div>
  );
};

const About = () => (
  <section 
    id="about" 
    className="py-20 bg-cover bg-center md:bg-center relative"
    style={{ backgroundImage: `url(${vb10294})` }}
  >
    {/* Background overlay */}
    <div className="absolute inset-0 bg-black/50"></div>

    {/* Content */}
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-6xl font-display text-center mb-6 text-gray-200">who is phil?</h2>
    </div>

    {/* Content2 */}
      <div className="grid md:grid-cols-1 p-8">
        <SkillCard2
          Icon={Book}
          title=""
          description="Phil Cifone is a living, breathing, human being that has existed 
          somewhere on this planet Earth since the late 20th century. He likes photography, computers, music, and books. 
          He resides in the suburban vicinity of Philadelphia, Pennsylvania, in the United (for now) States of America with 
          his wife and Amanda where they read, cook, listen to terrestrial radio, trail run, hike, and act as caregivers to their numerous cats."
        />
      </div>

    {/* Gradient animation keyframes */}
    <style jsx>{`
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  </section>
);

export default About;