import {
  Camera, Code, Pen, ChevronDown, Github, Mail, Linkedin,
  Terminal, Archive, Sun, Moon, BookOpen
} from 'lucide-react';
import Work from './components/Work';
import { Contact, Footer } from './components/ContactFooter';
import React, { useState, useEffect } from 'react';
import { useTheme } from './useTheme';
import { Navigation } from './components/Navigation';
import About from './components/About';
import Blog from './components/Blog';
import BlogAdmin from './components/BlogAdmin';
import BlogPostPage from './components/BlogPostPage';  // Import the new component
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Main portfolio component
const Portfolio = ({ isDark, setIsDark }) => (
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

// Main App component
const App = () => {
  const [isDark, setIsDark] = useTheme();

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route 
            path="/" 
            element={<Portfolio isDark={isDark} setIsDark={setIsDark} />} 
          />
          <Route 
            path="/admin" 
            element={<BlogAdmin />} 
          />
          <Route 
            path="/blog/:id" 
            element={<BlogPostPage />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;