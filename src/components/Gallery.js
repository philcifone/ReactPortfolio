import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import manayunkCar from '../images/gallery/manayunk-car.jpg';
import mc102121 from '../images/MC1021-2-1.jpg';
import mc101941 from '../images/MC1019-4-1.webp';

// Sample image data structure - replace with your actual images
const GALLERY_DATA = {
  night: [
    { src: mc102121, alt: 'Manayunk at night', caption: 'SAMPLE CAPTION REPLACE' },
  ],
  'keystone-dreams': [
    { src: mc101941, alt: 'Phonebooth in Wellsboro', caption: 'SAMPLE CAPTION REPLACE' },
    { src: manayunkCar, alt: 'Sample keystone photo 2', caption: 'SAMPLE CAPTION REPLACE' },
  ],
  live: [

  ],
  'in-transit': [

  ],
  street: [

  ],
  people: [

  ],
  'on-the-edge': [

  ],
};

const ImageModal = ({ image, onClose, onNext, onPrev, hasNext, hasPrev }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center animate-fadeIn"
    onClick={onClose}
  >
    {/* Close button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
    >
      <X size={32} />
    </button>

    <div className="max-w-6xl w-full max-h-screen p-4 flex flex-col items-center">
      {/* Navigation buttons - fixed positioning */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="fixed left-2 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-75 hover:bg-opacity-90 p-3 md:p-4 rounded-full shadow-lg z-50"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Image and caption container */}
      <div 
        className="relative max-h-[80vh] flex flex-col items-center transform transition-transform duration-300 px-12 md:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="max-w-full max-h-[80vh] object-contain"
        />
        {/* Caption with fade-in animation */}
        <div className="mt-4 text-white text-center max-w-2xl animate-fadeIn">
          <p className="text-lg">{image.caption}</p>
        </div>
      </div>

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="fixed right-2 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-75 hover:bg-opacity-90 p-3 md:p-4 rounded-full shadow-lg z-50"
        >
          <ChevronRight size={32} />
        </button>
      )}
    </div>
  </div>
);

const CategoryTab = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative px-3 md:px-8 py-2 md:py-4 transition-all duration-300 
      ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
      group min-w-fit flex-shrink-0
    `}
  >
    {/* Tab text */}
    <span className="relative z-20 text-xs md:text-base font-medium whitespace-nowrap">
      {category.label}
    </span>

    {/* Active indicator - slides in from left */}
    <span
      className={`
        absolute bottom-0 left-0 h-0.5 bg-green-500
        transition-all duration-300 ease-out
        ${isActive ? 'w-full' : 'w-0'}
      `}
    />

    {/* Hover indicator - grows from center */}
    <span
      className={`
        absolute bottom-0 left-1/2 h-0.5 bg-green-400 opacity-0
        transition-all duration-300 ease-out -translate-x-1/2
        group-hover:opacity-100 group-hover:w-full w-0
        ${isActive ? 'opacity-0' : ''}
      `}
    />
  </button>
);

const ParallaxImage = React.memo(({ src, alt, onClick, className }) => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('gallery');
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const scrollPercent = Math.max(0, Math.min(1, 
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));
      setOffset(scrollPercent * 20); // 20px maximum parallax offset
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`overflow-hidden ${className || ''}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        style={{ transform: `translateY(${offset}px)` }}
      />
    </div>
  );
});

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('night');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const categories = [
    { id: 'night', label: 'Night' },
    { id: 'keystone-dreams', label: 'Keystone Dreams' },
    { id: 'live', label: 'Live' },
    { id: 'in-transit', label: 'In Transit' },
    { id: 'street', label: 'Street' },
    { id: 'people', label: 'People' },
    { id: 'on-the-edge', label: 'On the Edge of the Earth' },
  ];

  const handleCategoryChange = (categoryId) => {
    if (categoryId === activeCategory) return;
    
    setIsChanging(true);
    setTimeout(() => {
      setActiveCategory(categoryId);
      setIsChanging(false);
    }, 300);
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  // Navigation handlers remain the same
  const handleNext = () => {
    const currentCategoryImages = GALLERY_DATA[activeCategory];
    if (currentImageIndex < currentCategoryImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setSelectedImage(currentCategoryImages[currentImageIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentCategoryImages = GALLERY_DATA[activeCategory];
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setSelectedImage(currentCategoryImages[currentImageIndex - 1]);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-200">
          <span className="inline-block transform transition-all duration-500 hover:scale-105 hover:text-green-400">
            Photography
          </span>
        </h2>
        
        {/* Category Tabs with new design */}
        <div className="mb-12 border-b border-neutral-800">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Image Grid with transition effect */}
        <div 
          className={`
            grid grid-cols-2 md:grid-cols-3 gap-4
            transition-opacity duration-300 ease-in-out
            ${isChanging ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {GALLERY_DATA[activeCategory].map((image, index) => (
            <ParallaxImage
              key={index}
              src={image.src}
              alt={image.alt}
              onClick={() => handleImageClick(image, index)}
              className="aspect-square rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            />
          ))}
        </div>
      </div>

      {/* Modal remains the same */}
      {selectedImage && (
        <ImageModal 
          image={selectedImage}
          onClose={() => {
            setSelectedImage(null);
            setCurrentImageIndex(0);
          }}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={currentImageIndex < GALLERY_DATA[activeCategory].length - 1}
          hasPrev={currentImageIndex > 0}
        />
      )}
    </section>
  );
};

export default Gallery;