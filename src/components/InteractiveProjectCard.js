import React, { useState } from 'react';
import { Github, ExternalLink, FileText, Lock, Unlock } from 'lucide-react';

const ColorPaletteDemo = () => {
  const [colors, setColors] = useState(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
  const [lockedColors, setLockedColors] = useState([false, false, false, false, false]);
  const [harmonyMode, setHarmonyMode] = useState('analogous');

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  // Convert hex to HSL
  const hexToHSL = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Convert HSL to hex
  const HSLToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const rgb = [255 * f(0), 255 * f(8), 255 * f(4)];
    return '#' + rgb.map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Generate harmonious colors
  const generateHarmoniousColors = (baseColor) => {
    const [h, s, l] = hexToHSL(baseColor);
    let newColors = [baseColor];

    switch (harmonyMode) {
      case 'analogous':
        newColors.push(HSLToHex((h + 30) % 360, s, l));
        newColors.push(HSLToHex((h + 60) % 360, s, l));
        newColors.push(HSLToHex((h - 30 + 360) % 360, s, l));
        newColors.push(HSLToHex((h - 60 + 360) % 360, s, l));
        break;
      case 'complementary':
        newColors.push(HSLToHex((h + 180) % 360, s, l));
        newColors.push(HSLToHex((h + 180) % 360, s, l - 20));
        newColors.push(HSLToHex(h, s, l - 20));
        newColors.push(HSLToHex(h, s - 20, l));
        break;
      case 'triadic':
        newColors.push(HSLToHex((h + 120) % 360, s, l));
        newColors.push(HSLToHex((h + 240) % 360, s, l));
        newColors.push(HSLToHex((h + 120) % 360, s, l - 20));
        newColors.push(HSLToHex((h + 240) % 360, s, l - 20));
        break;
      default:
        newColors = Array(5).fill().map(() => generateRandomColor());
    }

    return newColors;
  };

  const generateNewColors = () => {
    const baseColor = generateRandomColor();
    const newColors = generateHarmoniousColors(baseColor);
    
    setColors(prevColors => 
      prevColors.map((color, index) => 
        lockedColors[index] ? color : newColors[index]
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

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setHarmonyMode('analogous')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            harmonyMode === 'analogous' 
              ? 'bg-blue-600 text-white' 
              : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
          }`}
        >
          Analogous
        </button>
        <button
          onClick={() => setHarmonyMode('complementary')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            harmonyMode === 'complementary' 
              ? 'bg-blue-600 text-white' 
              : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
          }`}
        >
          Complementary
        </button>
        <button
          onClick={() => setHarmonyMode('triadic')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            harmonyMode === 'triadic' 
              ? 'bg-blue-600 text-white' 
              : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
          }`}
        >
          Triadic
        </button>
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
              {color.toUpperCase()}
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

// ProjectCard component remains the same...
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