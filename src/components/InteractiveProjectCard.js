import React, { useState } from 'react';
import { Github, ExternalLink, FileText, Lock, Unlock } from 'lucide-react';

const ColorPaletteDemo = () => {
  const [colors, setColors] = useState(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
  const [lockedColors, setLockedColors] = useState([false, false, false, false, false]);

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  const generateNewColors = () => {
    setColors(prevColors => 
      prevColors.map((color, index) => 
        lockedColors[index] ? color : generateRandomColor()
      )
    );
  };

  const toggleLock = (index) => {
    setLockedColors(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="p-6 bg-neutral-800 rounded-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-200 mb-2">Color Palette Generator</h3>
        <p className="text-gray-400">Generate, lock, and copy color codes for your next project</p>
      </div>
      <div className="flex gap-2 mb-6">
        {colors.map((color, index) => (
          <div key={index} className="flex-1">
            <div 
              className="relative h-32 rounded-lg cursor-pointer transition-all hover:scale-105"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(index);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-black/40"
              >
                {lockedColors[index] ? 
                  <Lock className="w-4 h-4 text-white" /> : 
                  <Unlock className="w-4 h-4 text-white" />
                }
              </button>
            </div>
            <p className="mt-2 text-center text-sm text-gray-300 font-mono">
              {color}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={generateNewColors}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Generate New Colors
      </button>
    </div>
  );
};

const ProjectCard = ({ title, description, image, tags, githubUrl, liveUrl, pdfUrl }) => {
  return (
    <div className="bg-neutral-700 rounded-lg overflow-hidden shadow-lg">
      {image && (
        <div className="w-full h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-neutral-600 rounded-full text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Live Demo</span>
            </a>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <FileText className="w-5 h-5" />
              <span>View PDF</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProjectCard, ColorPaletteDemo };