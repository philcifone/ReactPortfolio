import React from 'react';
import { Mail, Github, Linkedin, Rss } from 'lucide-react';

const Contact = () => (
  <section id="contact" className="py-20 bg-neutral-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-display font-bold text-center mb-16 text-gray-200">Thanks for scrolling all this way!</h2>
      
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div>
          <h3 className="text-xl font-display font-semibold text-gray-200 mb-4">Since you made it this far, shoot me an email. <br /> I'll send you a print, if you want.</h3>
          <br />
          <p className="text-gray-400 mb-6">
            I have recently moved away from social media. Please reach out on one of these below links. Please subscribe to my RSS feed for regular blog updates!
          </p>
        </div>
        <div className="flex justify-center space-x-8">
          <a 
            href="mailto:phil@philcifone.com" 
            className="p-4 rounded-full bg-kelly-green hover:bg-baby-blue transition-colors"
            aria-label="Email"
          >
            <Mail size={24} className="text-gray-200" />
          </a>
          <a 
            href="https://github.com/philcifone" 
            className="p-4 rounded-full bg-kelly-green hover:bg-baby-blue transition-colors"
            aria-label="GitHub"
          >
            <Github size={24} className="text-gray-200" />
          </a>
          <a 
            href="https://linkedin.com/in/phillip-cifone" 
            className="p-4 rounded-full bg-kelly-green hover:bg-baby-blue transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} className="text-gray-200" />
          </a>
          <a 
            href="/rss.xml" 
            className="p-4 rounded-full bg-kelly-green hover:bg-baby-blue transition-colors"
            aria-label="RSS Feed"
          >
            <Rss size={24} className="text-gray-200" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-8 bg-neutral-800 border-t border-neutral-700">
    <div className="max-w-6xl font-display mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <div className="mb-4">
        <p>&copy; {new Date().getFullYear()} Phil Cifone <br></br><br></br>I have decided to share the artistic work on this website according to the terms of the Creative Commons license as described below.<br></br>This websites source code is shared according to the GPLv3 copyleft license as described below.</p><br></br>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <a 
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <img 
              src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" 
              alt="CC"
              className="h-5 w-5 inline"
            />
            <img 
              src="https://mirrors.creativecommons.org/presskit/icons/by.svg" 
              alt="BY"
              className="h-5 w-5 inline"
            />
            <img 
              src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" 
              alt="NC"
              className="h-5 w-5 inline"
            />
            <img 
              src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" 
              alt="SA"
              className="h-5 w-5 inline"
            />
            <span>CC BY-NC-SA 4.0</span>
          </a>
          <span className="hidden sm:inline">|</span>
          <a 
            href="https://www.gnu.org/licenses/gpl-3.0.en.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <img 
              src="https://www.gnu.org/graphics/gplv3-88x31.png" 
              alt="GPLv3"
              className="h-5"
            />
            <span>GPL v3</span>
          </a>
        </div>
      </div>
      <a 
        href="/rss.xml"
        className="inline-flex items-center gap-2 mt-2 text-gray-400 hover:text-gray-300 transition-colors"
      >
        <Rss size={16} />
        <span>RSS Feed</span>
      </a>
    </div>
  </footer>
);

export { Contact, Footer };