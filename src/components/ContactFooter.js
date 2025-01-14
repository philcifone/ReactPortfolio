import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const Contact = () => (
  <section id="contact" className="py-20 bg-neutral-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-display font-bold text-center mb-16 text-gray-200">Get In Touch</h2>
      
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div>
          <h3 className="text-xl font-display font-semibold text-gray-200 mb-4">Connect With Me!</h3>
          <p className="text-gray-400 mb-6">
            Feel free to reach out and connect with me on any of these platforms.
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
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-8 bg-neutral-800 border-t border-neutral-700">
    <div className="max-w-6xl font-display mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} Phil Cifone. All rights reserved.</p>
    </div>
  </footer>
);

export { Contact, Footer };