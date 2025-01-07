import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

// Contact section
const Contact = () => (
    <section id="contact" className="py-20 bg-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-16 text-gray-200">Get In Touch</h2>
        <div className="flex justify-center space-x-8">
          <a 
            href="mailto:phil@philcifone.com" 
            className="p-4 rounded-full bg-neutral-700 hover:bg-gray-700 transition-colors"
          >
            <Mail size={24} className="text-gray-300" />
          </a>
          <a 
            href="https://github.com/philcifone" 
            className="p-4 rounded-full bg-neutral-700 hover:bg-gray-700 transition-colors"
          >
            <Github size={24} className="text-gray-300" />
          </a>
          <a 
            href="https://linkedin.com/in/phillip-cifone" 
            className="p-4 rounded-full bg-neutral-700 hover:bg-gray-700 transition-colors"
          >
            <Linkedin size={24} className="text-gray-300" />
          </a>
        </div>
      </div>
    </section>
  );
  
  // Footer component
  const Footer = () => (
    <footer className="py-8 bg-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Phil Cifone. All rights reserved.</p>
      </div>
    </footer>
  );
  
  export { Contact, Footer };