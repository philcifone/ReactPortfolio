import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Info, Share2 } from 'lucide-react';

const WebPConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [status, setStatus] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const canvasRef = useRef(null);

  // Detect iOS on component mount
  useEffect(() => {
    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    setIsIOS(checkIsIOS());
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setConvertedImage(null);
    setStatus('');
    setShowIOSInstructions(false);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const convertToWebP = async () => {
    if (!selectedFile) {
      setStatus('Please select an image first');
      return;
    }

    try {
      setStatus('Converting...');
      
      const img = new Image();
      img.src = preview;
      
      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const webpData = canvas.toDataURL('image/webp', quality);
          setConvertedImage(webpData);
          
          if (isIOS) {
            setShowIOSInstructions(true);
            setStatus('Conversion complete! Follow instructions below to save.');
          } else {
            setStatus('Conversion complete! Click Download to save.');
          }
          resolve();
        };
      });
    } catch (error) {
      setStatus('Error converting image. Please try again.');
      console.error('Conversion error:', error);
    }
  };

  const downloadWebP = async () => {
    if (!convertedImage) return;

    try {
      // Convert base64 to blob
      const base64Response = convertedImage.split(',')[1];
      const blobData = atob(base64Response);
      const arrayBuffer = new ArrayBuffer(blobData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < blobData.length; i++) {
        uint8Array[i] = blobData.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: 'image/webp' });
      const blobUrl = URL.createObjectURL(blob);
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '') + '.webp';

      if (isIOS) {
        try {
          setStatus('Opening share sheet...');
          const file = new File([blob], fileName, { type: 'image/webp' });
          
          // First try sharing the file
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Download WebP Image',
            });
            setStatus('Share sheet opened!');
          } else {
            // Fallback to opening in new tab
            setStatus('Opening in new tab...');
            const newTab = window.open('about:blank', '_blank');
            if (newTab) {
              newTab.document.write('<img src="' + convertedImage + '" alt="Converted WebP">');
              newTab.document.title = fileName;
              setStatus('Image opened in new tab. Press and hold to save.');
            } else {
              throw new Error('Popup blocked');
            }
          }
        } catch (error) {
          console.error('iOS share error:', error);
          setStatus('Could not open share sheet. Opening in new tab...');
          window.location.href = convertedImage;
        }
      } else {
        // For other devices
        try {
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.target = '_blank'; // Add this for mobile browsers
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setStatus('Download started!');
        } catch (error) {
          console.error('Download error:', error);
          setStatus('Download failed. Opening in new tab...');
          window.location.href = convertedImage;
        }
      }

      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error('Download/Share error:', error);
      setStatus('Error during download. Please try again.');
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 max-w-xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-2xl font-display text-gray-200">WebP Converter</h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-400 hover:text-gray-300"
          >
            <Info size={16} />
          </button>
        </div>
        <p className="text-gray-400">Convert images to WebP format</p>
      </div>

      {showInfo && (
        <div className="mb-6 bg-neutral-700 rounded-lg p-4 text-sm text-gray-300">
          <h4 className="font-medium text-gray-200 mb-2">About WebP Format</h4>
          <p className="mb-2">
            WebP images can significantly improve your website's SEO and performance. They typically reduce file sizes by 25-35% 
            compared to JPEG/PNG while maintaining similar quality, leading to:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-2">
            <li>Faster page load times, which Google considers a key ranking factor</li>
            <li>Better Core Web Vitals scores, especially Largest Contentful Paint (LCP)</li>
            <li>Lower bandwidth usage, improving mobile performance</li>
            <li>Better crawl efficiency for search engines</li>
          </ul>
          <p>WebP is fully supported by all modern browsers and is recommended by Google for optimal web performance.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* File Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Select Image
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-neutral-700 border border-neutral-600 rounded p-4 text-gray-300 text-center cursor-pointer hover:bg-neutral-600 transition-colors">
              <Upload size={24} className="mx-auto mb-2" />
              {selectedFile ? selectedFile.name : 'Choose an image'}
            </div>
          </div>
        </div>

        {/* Quality Slider */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Quality: {Math.round(quality * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-200">Preview</h4>
            <div className="bg-neutral-700 rounded-lg p-2">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded"
              />
              <div className="text-center mt-2 text-sm text-gray-300">
                Size: {formatSize(selectedFile.size)}
              </div>
            </div>
          </div>
        )}

        {/* Convert Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={convertToWebP}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              !selectedFile
                ? 'bg-neutral-700 cursor-not-allowed text-gray-500'
                : 'bg-kelly-green hover:bg-light-olive text-white'
            }`}
          >
            <ImageIcon size={20} />
            Convert to WebP
          </button>

          {convertedImage && (
            <button
              onClick={downloadWebP}
              className="px-4 py-2 rounded-lg flex items-center gap-2 bg-baby-blue hover:bg-light-olive text-white transition-colors"
            >
              {isIOS ? <Share2 size={20} /> : <Download size={20} />}
              {isIOS ? 'Save Image' : 'Download'}
            </button>
          )}
        </div>

        {/* Status */}
        {status && (
          <div className="text-center text-gray-300">{status}</div>
        )}

        {/* iOS Instructions */}
        {showIOSInstructions && isIOS && (
          <div className="mt-4 bg-neutral-700 rounded-lg p-4 text-sm text-gray-300">
            <h4 className="font-medium text-gray-200 mb-2">How to Save on iOS</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>Tap the "Share" button above</li>
              <li>Choose "Save Image" from the share menu</li>
              <li>The WebP image will be saved to your Photos app</li>
            </ol>
            <p className="mt-2 text-xs">
              Note: If sharing isn't available, the image will open in a new tab. 
              You can then tap and hold on the image to save it.
            </p>
          </div>
        )}
      </div>

      {/* Hidden canvas for conversion */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default WebPConverter;