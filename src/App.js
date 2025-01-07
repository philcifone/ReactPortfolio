import { 
  Camera, Code, Pen, ChevronDown, Github, Mail, Linkedin,
  Terminal, Archive, Sun, Moon, BookOpen
} from 'lucide-react';
import Work from './components/Work';  // Add this at the top with other imports
import { Contact, Footer } from './components/ContactFooter';  // Add this with your imports
import React, { useState, useEffect } from 'react';
import { useTheme } from './useTheme';
import { Navigation } from './components/Navigation';
import About  from './components/About';
import Blog from './components/Blog';
import Hero from './components/Hero';
import Gallery from './components/Gallery';

// Main App component
const App = () => {
  const [isDark, setIsDark] = useTheme();

  return (
    <div className="antialiased text-gray-900 bg-[#424242]">
      <Navigation isDark={isDark} setIsDark={setIsDark} />
      <Hero />
      <About />
      <Work />
      <Gallery />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;