import React, { useState, useRef, useCallback } from 'react';
import { Download, Settings, Palette } from 'lucide-react';

const ArtGenerator = () => {
  const [gridSize, setGridSize] = useState(20);
  const [colorMode, setColorMode] = useState('random');
  const [grid, setGrid] = useState(Array(gridSize * gridSize).fill('#FFFFFF'));
  const [clickRadius, setClickRadius] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const canvasRef = useRef(null);

  // Color generation functions
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const getRadialColors = (centerX, centerY, indices) => {
    // Generate random base colors
    const baseHue = Math.floor(Math.random() * 360);
    const baseSaturation = Math.random() * 20 + 60; // 60-80% base saturation
    
    return indices.map(index => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      
      // Calculate distance from click center
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize distance to 0-1 range and add some variation
      const normalizedDistance = distance / clickRadius;
      
      // Vary hue slightly based on angle
      const angle = Math.atan2(dy, dx);
      const hueVariation = (angle / (Math.PI * 2)) * 30; // ±15 degrees variation
      const finalHue = (baseHue + hueVariation + 360) % 360;
      
      // Vary saturation based on distance
      const saturationVariation = Math.random() * 20 - 10; // ±10%
      const finalSaturation = Math.min(100, Math.max(50, 
        baseSaturation + saturationVariation - (normalizedDistance * 20)
      ));
      
      // More dramatic lightness variation
      const lightness = Math.max(20, Math.min(95,
        90 - (normalizedDistance * 70) + (Math.random() * 10 - 5)
      ));
      
      return hslToHex(finalHue, finalSaturation, lightness);
    });
  };

  const getAffectedIndices = (clickX, clickY) => {
    const indices = [];
    const radiusSquared = clickRadius * clickRadius;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const dx = x - clickX;
        const dy = y - clickY;
        if (dx * dx + dy * dy <= radiusSquared) {
          indices.push(y * gridSize + x);
        }
      }
    }

    return indices;
  };

  const handleGridClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / (rect.width / gridSize));
    const y = Math.floor((event.clientY - rect.top) / (rect.height / gridSize));
    
    const affectedIndices = getAffectedIndices(x, y);
    
    setGrid(prev => {
      const newGrid = [...prev];
      
      if (colorMode === 'random') {
        // Random colors for each affected cell
        affectedIndices.forEach(index => {
          newGrid[index] = generateRandomColor();
        });
      } else {
        // Radial gradient colors
        const radialColors = getRadialColors(x, y, affectedIndices);
        affectedIndices.forEach((index, i) => {
          newGrid[index] = radialColors[i];
        });
      }
      
      return newGrid;
    });
  };

  const saveImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / gridSize;

    grid.forEach((color, i) => {
      const x = (i % gridSize) * cellSize;
      const y = Math.floor(i / gridSize) * cellSize;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);
    });

    const link = document.createElement('a');
    link.download = 'art-generator.png';
    link.href = canvas.toDataURL();
    link.click();
  }, [grid, gridSize]);

  return (
    <div className="bg-neutral-800 rounded-lg p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-display text-gray-200">Pixel Art Generator</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg bg-neutral-700 text-gray-200 hover:bg-neutral-600"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={saveImage}
            className="p-2 rounded-lg bg-kelly-green text-white hover:bg-light-olive"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className="grid bg-neutral-900 rounded-lg overflow-hidden cursor-crosshair"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            aspectRatio: '1',
          }}
          onClick={handleGridClick}
        >
          {grid.map((color, i) => (
            <div
              key={i}
              className="transition-colors duration-300"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          className="hidden"
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-neutral-700 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Grid Size
                </label>
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-full bg-neutral-600 text-white p-2 rounded"
                >
                  <option value={10}>10 x 10</option>
                  <option value={20}>20 x 20</option>
                  <option value={32}>32 x 32</option>
                  <option value={48}>48 x 48</option>
                  <option value={64}>64 x 64</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Click Radius
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={clickRadius}
                  onChange={(e) => setClickRadius(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-gray-300 mt-1">{clickRadius}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Color Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['random', 'radial'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setColorMode(mode)}
                      className={`p-2 rounded capitalize ${
                        colorMode === mode
                          ? 'bg-baby-blue text-white'
                          : 'bg-neutral-600 text-gray-200 hover:bg-neutral-500'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (gridSize !== grid.length) {
                      // If grid size changed, create new grid preserving colors where possible
                      const newGrid = Array(gridSize * gridSize).fill('#FFFFFF');
                      const oldSize = Math.sqrt(grid.length);
                      
                      // Copy existing colors to new grid where they fit
                      for (let y = 0; y < Math.min(oldSize, gridSize); y++) {
                        for (let x = 0; x < Math.min(oldSize, gridSize); x++) {
                          const oldIndex = y * oldSize + x;
                          const newIndex = y * gridSize + x;
                          newGrid[newIndex] = grid[oldIndex] || '#FFFFFF';
                        }
                      }
                      setGrid(newGrid);
                    }
                    setShowSettings(false);
                  }}
                  className="flex-1 bg-kelly-green text-white py-2 rounded hover:bg-light-olive"
                >
                  Apply Changes
                </button>
                <button
                  onClick={() => {
                    setGrid(Array(gridSize * gridSize).fill('#FFFFFF'));
                    setShowSettings(false);
                  }}
                  className="flex-1 bg-neutral-600 text-white py-2 rounded hover:bg-neutral-500"
                >
                  Reset Canvas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtGenerator;