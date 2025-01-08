import React from 'react';
import { ChevronDown } from 'lucide-react';
import mc102121 from '../images/MC1021-2-1.jpg'

const Hero = () => (
  <div 
    className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
    style={{
        backgroundImage: `url(${mc102121})`,
      }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/75" />
    
    {/* Content */}
    <div className="text-center space-y-6 p-4 relative z-10">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-400">
        Preserving Tomorrow,
        <br />
        Creating Today
      </h1>
      <p className="text-xl text-gray-200 max-w-2xl mx-auto">
        Digital Preservation Reimagined: Crafting Open Solutions for Tomorrow's Archives
      </p>
      <a href="#about" className="inline-block animate-bounce mt-8">
        <ChevronDown size={32} className="text-gray-200" />
      </a>
    </div>
  </div>
);

export default Hero;