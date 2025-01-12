import React, { useState, useEffect } from 'react';
import { Calculator, HardDrive, Shield, Info, Server } from 'lucide-react';

const StorageCalculator = () => {
  const [config, setConfig] = useState({
    driveSize: 4, // TB
    driveCount: 4,
    raidType: 'raidz1'
  });

  const [result, setResult] = useState({
    totalRaw: 0,
    usableSpace: 0,
    protection: '',
    drivesForParity: 0
  });

  // Info tooltip content for each RAID type
  const raidTypeInfo = {
    raidz1: "RAIDZ1 distributes parity information across all drives in a rotating pattern, allowing for one drive failure. This distributed approach differs from traditional RAID5.",
    raidz2: "RAIDZ2 uses double parity distributed across all drives, protecting against up to two simultaneous drive failures.",
    raidz3: "RAIDZ3 provides triple parity protection distributed across all drives, allowing for up to three simultaneous drive failures.",
    mirror: "Mirror configuration creates exact copies of data across pairs of drives, providing maximum read performance.",
    raid0: "RAID0 stripes data across all drives without any redundancy. While this provides maximum storage and performance, there is no protection against drive failures."
  };

  const calculateStorage = () => {
    const rawStorage = config.driveSize * config.driveCount;
    let usableSpace = 0;
    let protection = '';
    let drivesForParity = 0;

    switch (config.raidType) {
      case 'raidz1':
        drivesForParity = 1;
        usableSpace = (config.driveCount - 1) * config.driveSize;
        protection = 'Single drive failure';
        break;
      case 'raidz2':
        drivesForParity = 2;
        usableSpace = (config.driveCount - 2) * config.driveSize;
        protection = 'Double drive failure';
        break;
      case 'raidz3':
        drivesForParity = 3;
        usableSpace = (config.driveCount - 3) * config.driveSize;
        protection = 'Triple drive failure';
        break;
      case 'mirror':
        drivesForParity = Math.floor(config.driveCount / 2);
        usableSpace = (config.driveCount / 2) * config.driveSize;
        protection = 'Mirror (50% redundancy)';
        break;
      case 'raid0':
        usableSpace = rawStorage;
        protection = 'None (striping only)';
        break;
      default:
        usableSpace = 0;
    }

    setResult({
      totalRaw: rawStorage,
      usableSpace: Math.max(0, usableSpace),
      protection,
      drivesForParity
    });
  };

  useEffect(() => {
    calculateStorage();
  }, [config]);

  return (
    <div className="bg-neutral-800 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-200 mb-2">Storage Configuration Calculator</h3>
        <p className="text-gray-400">Calculate usable space and redundancy for ZFS and RAID configurations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Drive Size (TB)
            </label>
            <select
              value={config.driveSize}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                driveSize: Number(e.target.value)
              }))}
              className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
            >
              {[2, 4, 8, 12, 14, 16, 18, 20].map(size => (
                <option key={size} value={size}>{size} TB</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Number of Drives
            </label>
            <select
              value={config.driveCount}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                driveCount: Number(e.target.value)
              }))}
              className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(count => (
                <option key={count} value={count}>{count} Drives</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              RAID Configuration
            </label>
            <select
              value={config.raidType}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                raidType: e.target.value
              }))}
              className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
            >
              <option value="raidz1">RAIDZ1 (Single Parity)</option>
              <option value="raidz2">RAIDZ2 (Double Parity)</option>
              <option value="raidz3">RAIDZ3 (Triple Parity)</option>
              <option value="mirror">Mirror</option>
              <option value="raid0">RAID 0 (Striping)</option>
            </select>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-neutral-700 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive size={20} className="text-blue-400" />
              <span className="text-gray-200">Total Raw Storage:</span>
            </div>
            <span className="text-gray-200 font-mono">{result.totalRaw} TB</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={20} className="text-green-400" />
              <span className="text-gray-200">Usable Space:</span>
            </div>
            <span className="text-gray-200 font-mono">{result.usableSpace} TB</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-purple-400" />
              <span className="text-gray-200">Protection Level:</span>
            </div>
            <span className="text-gray-200">{result.protection}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info size={20} className="text-yellow-400" />
              <span className="text-gray-200">Parity Drives:</span>
            </div>
            <span className="text-gray-200">{result.drivesForParity}</span>
          </div>
        </div>
      </div>

      {/* Drive Layout Visualization */}
      <div className="mt-6">
        <h4 className="text-gray-200 font-medium mb-4 flex items-center gap-2">
          <Server size={20} className="text-blue-400" />
          Drive Layout Visualization
        </h4>
        <div className="bg-neutral-700 rounded-lg p-4 overflow-x-auto">
          <div className="flex flex-col gap-2 min-w-[600px]">
            {Array.from({ length: config.driveCount }).map((_, driveIndex) => {
              const stripeCount = 8; // Number of stripes to show
              const stripes = Array.from({ length: stripeCount });
              
              return (
                <div key={driveIndex} className="flex items-center gap-2">
                  <div className="w-20 text-gray-400 text-sm">Drive {driveIndex + 1}</div>
                  <div className="flex-1 flex gap-1">
                    {stripes.map((_, stripeIndex) => {
                      let blockType = 'data';
                      
                      if (config.raidType === 'raid0') {
                        blockType = 'data';
                      } else if (config.raidType === 'mirror') {
                        blockType = driveIndex >= config.driveCount / 2 ? 'mirror' : 'data';
                      } else {
                        // For RAIDZ1/2/3, rotate parity blocks across drives
                        const stripeGroupSize = config.driveCount;
                        const stripePosition = (driveIndex + stripeIndex) % stripeGroupSize;
                        const parityDrives = config.raidType === 'raidz1' ? 1 
                          : config.raidType === 'raidz2' ? 2 
                          : config.raidType === 'raidz3' ? 3 
                          : 0;
                        
                        blockType = stripePosition >= (stripeGroupSize - parityDrives) ? 'parity' : 'data';
                      }

                      return (
                        <div
                          key={stripeIndex}
                          className={`h-6 rounded flex-1 ${
                            blockType === 'data' 
                              ? 'bg-green-600/40 border border-green-500' 
                              : blockType === 'parity'
                                ? 'bg-purple-600/40 border border-purple-500'
                                : 'bg-blue-600/40 border border-blue-500'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-4">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-600/40 border border-green-500" />
                <span className="text-gray-300 text-sm">Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-600/40 border border-purple-500" />
                <span className="text-gray-300 text-sm">Parity</span>
              </div>
              {config.raidType === 'mirror' && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600/40 border border-blue-500" />
                  <span className="text-gray-300 text-sm">Mirror</span>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-400 bg-neutral-800/50 p-3 rounded">
              <strong className="text-gray-300">Note:</strong> This visualization is a simplified representation of storage distribution patterns. 
              The actual implementation of ZFS RAID levels involves sophisticated algorithms for data and parity distribution, including 
              variable stripe width, copy-on-write transactional semantics, and dynamic block allocation. For production deployments, 
              please consult the official OpenZFS documentation.
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">About ZFS RAID Levels</h4>
        <p className="text-gray-300 text-sm">
          RAIDZ1, RAIDZ2, and RAIDZ3 are ZFS's software RAID implementations. RAIDZ1 provides single-parity protection (similar to RAID5), 
          RAIDZ2 provides double-parity (similar to RAID6), and RAIDZ3 provides triple-parity protection. Mirror configurations provide maximum 
          read performance but use 50% of available space for redundancy.
        </p>
      </div>
    </div>
  );
};

export default StorageCalculator;