import React, { useState } from 'react';
import { Github, ExternalLink, FileText, Lock, Unlock, Copy, Check, Palette, Hash, } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const ColorPaletteDemo = () => {
  const [numColors, setNumColors] = useState(5);
  const [colors, setColors] = useState(Array(5).fill('#FFFFFF'));
  const [lockedColors, setLockedColors] = useState(Array(5).fill(false));
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [format, setFormat] = useState('hex'); // 'hex' or 'rgb'
  const [harmonyMode, setHarmonyMode] = useState('random'); // 'random', 'analogous', 'complementary', 'triadic'

  const generateRandomColor = () => {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    return format === 'hex' ? hex : hexToRgb(hex);
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 
      null;
  };

  const rgbToHex = (rgb) => {
    const values = rgb.match(/\d+/g);
    if (!values) return '#000000';
    const r = parseInt(values[0]);
    const g = parseInt(values[1]);
    const b = parseInt(values[2]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
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

  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  const generateHarmonyColors = (baseColor) => {
    let rgbValues;
    if (baseColor.startsWith('#')) {
      rgbValues = hexToRgb(baseColor).match(/\d+/g).map(Number);
    } else {
      rgbValues = baseColor.match(/\d+/g).map(Number);
    }
    
    const [h, s, l] = rgbToHsl(...rgbValues);
    let harmonicColors = [];
  
    switch (harmonyMode) {
      case 'analogous':
        harmonicColors = [
          hslToRgb(h - 60, s, l),
          hslToRgb(h - 30, s, l),
          hslToRgb(h, s, l),
          hslToRgb(h + 30, s, l),
          hslToRgb(h + 60, s, l)
        ];
        break;
      
      case 'complementary':
        const comp = (h + 180) % 360;
        harmonicColors = [
          hslToRgb(h, s, l),
          hslToRgb(h, s * 0.8, l * 1.1),
          hslToRgb(h, s * 0.6, l * 1.2),
          hslToRgb(comp, s, l),
          hslToRgb(comp, s * 0.8, l * 1.1)
        ];
        break;
      
      case 'triadic':
        harmonicColors = [
          hslToRgb(h, s, l),
          hslToRgb((h + 120) % 360, s, l),
          hslToRgb((h + 240) % 360, s, l),
          hslToRgb(h, s * 0.8, l * 1.1),
          hslToRgb((h + 120) % 360, s * 0.8, l * 1.1)
        ];
        break;
  
      default:
        harmonicColors = Array(5).fill(0).map(() => generateRandomColor());
    }
  
    // Convert to selected format
    return harmonicColors.slice(0, numColors).map(color => {
      return format === 'hex' ? rgbToHex(color) : color;
    });
  };
  

  const generateNewColors = () => {
    if (harmonyMode === 'random') {
      setColors(prevColors => 
        prevColors.slice(0, numColors).map((color, index) => 
          lockedColors[index] ? color : generateRandomColor()
        )
      );
    } else {
      // Find first unlocked color or use first color
      const baseColorIndex = lockedColors.findIndex(locked => !locked);
      const baseColor = baseColorIndex === -1 ? colors[0] : generateRandomColor();
      
      const harmonyColors = generateHarmonyColors(baseColor);
      setColors(prevColors => 
        prevColors.slice(0, numColors).map((color, index) => 
          lockedColors[index] ? color : harmonyColors[index]
        )
      );
    }
  };

  const toggleLock = (index) => {
    setLockedColors(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };

  const copyColor = (color, index) => {
    const colorToCopy = format === 'hex' ? 
      (color.startsWith('rgb') ? rgbToHex(color) : color) : 
      (color.startsWith('#') ? hexToRgb(color) : color);
    
    navigator.clipboard.writeText(colorToCopy);
    setCopiedIndex(index);
    setShowAlert(true);
    setTimeout(() => {
      setCopiedIndex(null);
      setShowAlert(false);
    }, 2000);
  };

  const toggleFormat = () => {
    setFormat(prev => {
      const newFormat = prev === 'hex' ? 'rgb' : 'hex';
      setColors(colors.map(color => 
        color.startsWith('#') ? hexToRgb(color) : rgbToHex(color)
      ));
      return newFormat;
    });
  };

  const getContrastColor = (bgColor) => {
    let color = bgColor;
    if (color.startsWith('rgb')) {
      color = rgbToHex(color);
    }
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="p-6 bg-neutral-800 rounded-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-200 mb-2">Color Palette Generator</h3>
        <p className="text-gray-400">Generate, lock, and copy color codes for your next project</p>
      </div>

      {/* Controls */}
      <div className="space-y-6 mb-6">
        {/* Number of Colors and Format */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Number of Colors
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setNumColors(num);
                    // Maintain existing colors and add new ones if needed
                    setColors(prev => {
                      const newColors = [...prev];
                      // If we need more colors, generate them
                      while (newColors.length < num) {
                        newColors.push(generateRandomColor());
                      }
                      // Slice to the desired length
                      return newColors.slice(0, num);
                    });
                    setLockedColors(prev => {
                      const newLocked = [...prev];
                      while (newLocked.length < num) {
                        newLocked.push(false);
                      }
                      return newLocked.slice(0, num);
                    });
                  }}
                  className={`flex-1 py-2 rounded transition-colors ${
                    numColors === num 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:w-32">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Format
            </label>
            <button
              onClick={toggleFormat}
              className="w-full py-2 px-4 bg-neutral-700 hover:bg-neutral-600 text-gray-200 rounded flex items-center justify-center gap-2"
            >
              <Hash size={16} />
              {format.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Color Harmony */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Color Harmony
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'random', label: 'Random' },
              { value: 'analogous', label: 'Analogous' },
              { value: 'complementary', label: 'Complementary' },
              { value: 'triadic', label: 'Triadic' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setHarmonyMode(value)}
                className={`flex-1 py-2 px-4 rounded transition-colors ${
                  harmonyMode === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="grid gap-4 mb-6" style={{ 
        gridTemplateColumns: `repeat(${numColors}, 1fr)` 
      }}>
        {colors.slice(0, numColors).map((color, index) => (
          <div key={index} className="flex-1">
            <div 
              className="relative h-32 rounded-lg cursor-pointer transition-all hover:scale-105 group"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color, index)}
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
              <div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: getContrastColor(color) }}
              >
                {copiedIndex === index ? <Check size={24} /> : <Copy size={24} />}
              </div>
            </div>
            <p className="mt-2 text-center text-sm text-gray-300 font-mono select-all">
              {color}
            </p>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateNewColors}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {harmonyMode === 'random' ? <Palette size={20} /> : <Palette size={20} />}
        Generate {harmonyMode !== 'random' ? harmonyMode : ''} Colors
      </button>

      {/* Copy Alert */}
      {showAlert && (
        <Alert className="fixed bottom-4 right-4 bg-neutral-700 border-neutral-600">
          <AlertDescription className="text-gray-200">
            Copied!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
  const copyFullPalette = () => {
    // Format the palette as a string
    const paletteData = colors
      .slice(0, numColors)
      .map((color, index) => {
        const formattedColor =
          format === 'hex'
            ? (color.startsWith('rgb') ? rgbToHex(color) : color)
            : (color.startsWith('#') ? hexToRgb(color) : color);
        return `${index + 1}: ${formattedColor}`;
      })
      .join('\n');

    // Copy to clipboard
    navigator.clipboard.writeText(paletteData)
      .then(() => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy palette:', err);
      });
  };

  return (
    <div className="p-6 bg-neutral-800 rounded-lg">
      {/* ... existing components ... */}
      
      {/* Copy Full Palette */}
      <div className="text-center mt-6">
        <button
          onClick={copyFullPalette}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Copy Full Palette
        </button>
        {showAlert && (
          <div className="mt-2 text-sm text-green-500">
            Palette copied to clipboard!
          </div>
        )}
      </div>

      {/* ... existing components ... */}
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