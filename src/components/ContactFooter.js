import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('submitting');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <section id="contact" className="py-20 bg-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-display font-bold text-center mb-16 text-gray-200">Get In Touch</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-neutral-700 rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-neutral-600 border ${
                    errors.name ? 'border-red-500' : 'border-neutral-500'
                  } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-neutral-600 border ${
                    errors.email ? 'border-red-500' : 'border-neutral-500'
                  } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 bg-neutral-600 border ${
                    errors.message ? 'border-red-500' : 'border-neutral-500'
                  } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-colors ${
                  status === 'submitting'
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Send size={20} />
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-green-400 text-center">Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-center">Sorry! Not in use yet. Please use adjacent links.</p>
              )}
            </form>
          </div>

          {/* Social Links and Info */}
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-display font-semibold text-gray-200 mb-4">Connect With Me!</h3>
              <p className="text-gray-400 mb-6">
                Feel free to reach out through the contact form or connect with me on social media.
              </p>
            </div>

            <div className="flex justify-center md:justify-start space-x-6">
              <a 
                href="mailto:phil@philcifone.com" 
                className="p-4 rounded-full bg-neutral-600 hover:bg-neutral-500 transition-colors"
              >
                <Mail size={24} className="text-gray-200" />
              </a>
              <a 
                href="https://github.com/philcifone" 
                className="p-4 rounded-full bg-neutral-600 hover:bg-neutral-500 transition-colors"
              >
                <Github size={24} className="text-gray-200" />
              </a>
              <a 
                href="https://linkedin.com/in/phillip-cifone" 
                className="p-4 rounded-full bg-neutral-600 hover:bg-neutral-500 transition-colors"
              >
                <Linkedin size={24} className="text-gray-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-8 bg-neutral-800 border-t border-neutral-700">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} Phil Cifone. All rights reserved.</p>
    </div>
  </footer>
);

export { ContactForm as Contact, Footer };