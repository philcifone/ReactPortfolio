import React from 'react';
import { ChevronDown } from 'lucide-react';
//import mc102121 from '../images/MC1021-2-1.jpg'
import vb10282 from '../images/vb10282.webp'

const Hero = () => (
  <div 
    className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
    style={{
        backgroundImage: `url(${vb10282})`,
      }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/70" />
    
    {/* Content */}
    <div className="text-center space-y-6 p-4 relative z-10">
      <h1 className="font-display text-6xl md:text-8xl bg-clip-text text-transparent p-2 bg-light-olive">
        Phil Cifone
        <br/>
        <br/>
      </h1>
      <h2 className="font-display text-4xl md:text-6xl bg-clip-text text-transparent bg-light-olive">
        Preserving Today's Creations
      </h2>
      <p className="font-sans font-medium text-2xl text-gray-200 max-w-2xl mx-auto p-4">
        & 
        <br/>
        <br/>
        Crafting Open Solutions for Tomorrow's Archives
      </p>
      <a href="#about" className="inline-block animate-bounce mt-8">
        <ChevronDown size={32} className="text-gray-200" />
      </a>
    </div>
  </div>
);

export default Hero;