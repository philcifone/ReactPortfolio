import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation = ({ isDark, setIsDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking a link
  const handleMenuItemClick = (e) => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 transition-all duration-300 z-50 ${
          isScrolled ? 'bg-neutral-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Name */}
            <span className="text-xl font-display text-gray-200">Phil Cifone</span>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a>
              <a href="#work" className="text-gray-300 hover:text-blue-400 transition-colors">Work</a>
              <a href="#gallery" className="text-gray-300 hover:text-blue-400 transition-colors">Gallery</a>
              <a href="#blog" className="text-gray-300 hover:text-blue-400 transition-colors">Blog</a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`absolute top-16 left-0 right-0 bg-neutral-900/95 backdrop-blur-md shadow-lg transform transition-all duration-300 ease-in-out md:hidden ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
          <div className="px-4 py-2 border-t border-neutral-800">
            <a href="#about" className="block py-3 text-gray-300 hover:text-blue-400 transition-colors text-right" onClick={handleMenuItemClick}>About</a>
            <a href="#work" className="block py-3 text-gray-300 hover:text-blue-400 transition-colors text-right" onClick={handleMenuItemClick}>Work</a>
            <a href="#gallery" className="block py-3 text-gray-300 hover:text-blue-400 transition-colors text-right" onClick={handleMenuItemClick}>Gallery</a>
            <a href="#blog" className="block py-3 text-gray-300 hover:text-blue-400 transition-colors text-right" onClick={handleMenuItemClick}>Blog</a>
            <a href="#contact" className="block py-3 text-gray-300 hover:text-blue-400 transition-colors text-right" onClick={handleMenuItemClick}>Contact</a>
          </div>
        </div>
      </nav>

      {/* Backdrop (only visible when menu is open) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};