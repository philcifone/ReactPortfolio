import React, { useState } from 'react';
import { Archive, Terminal, Camera, Code, Pen, BookOpen } from 'lucide-react';
import backgroundImage from '../images/ME-0741.jpg';
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
      <h3 className="relative z-10 text-xl font-display text-neutral-100">{title}</h3>
      <p className="relative z-10 font-sans font-medium text-gray-300">{description}</p>
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
      <h2 className="text-4xl font-display text-center mb-4 text-gray-200">who is phil?</h2>
      <h3 className="text-2xl font-display text-center mb-16 text-gray-200">good question...</h3>
      <div className="grid md:grid-cols-3 gap-8">
        <SkillCard
          Icon={Archive}
          title="Digital Archivist"
          description="Preserving digital heritage and making information accessible for future generations."
        />
        <SkillCard
          Icon={Camera}
          title="Visual Artist"
          description="Capturing moments and creating art that tells stories."
        />
        <SkillCard
          Icon={Terminal}
          title="Linux Enthusiast"
          description="Command line warrior, open-source advocate, and system tinkerer extraordinaire."
        />
        <SkillCard
          Icon={Pen}
          title="Writer"
          description="Crafting narratives across technical documentation and creative writing."
        />
        <SkillCard
          Icon={BookOpen}
          title="Lifelong Learner"
          description="Constantly exploring the intersection of technology, literature, art, and preservation."
        />
        <SkillCard
          Icon={Code}
          title="Amateur Programmer"
          description="Building tools and solving problems with code, one bug at a time."
        />
      </div>
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