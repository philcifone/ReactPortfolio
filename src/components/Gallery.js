import React, { useState } from 'react';
import manayunkCar from '../images/manayunk-car.jpg';
import mc102121 from '../images/MC1021-2-1.jpg'
import mc101941 from '../images/MC1019-4-1.webp'

const ImageModal = ({ image, onClose }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="max-w-4xl max-h-[90vh] relative">
      <img
        src={image.src}
        alt={image.alt}
        className="max-w-full max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ×
      </button>
    </div>
  </div>
);

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { src: manayunkCar, alt: 'Manayunk Car' },
    { src: mc102121, alt: 'Manayunk at night'},
    { src: mc101941, alt: 'Phonebooth in Wellsboro, Pennsylvania'},
    // Add other images in the same format
  ];

  return (
    <section id="gallery" className="py-20 bg-[#2c2c2c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-200">Photography</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </section>
  );
};

export default Gallery;