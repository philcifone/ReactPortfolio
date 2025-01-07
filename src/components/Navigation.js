// Navigation.js
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const Navigation = ({ isDark, setIsDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full transition-all duration-300 z-50 ${
      isScrolled ? 'bg-[#2c2c2c]/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <span className="text-xl font-bold text-gray-200">Phil Cifone</span>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a>
              <a href="#work" className="text-gray-300 hover:text-blue-400 transition-colors">Work</a>
              <a href="#gallery" className="text-gray-300 hover:text-blue-400 transition-colors">Gallery</a>
              <a href="#blog" className="text-gray-300 hover:text-blue-400 transition-colors">Blog</a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};