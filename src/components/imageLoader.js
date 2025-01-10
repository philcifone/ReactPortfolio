// imageLoader.js
const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
      // Split the path properly
      const pathParts = item.split('/');
      // Get the category (folder name)
      const category = pathParts[1];
      
      // Skip if we're not in a category folder
      if (!category) return;
  
      // Initialize category array if it doesn't exist
      if (!images[category]) {
        images[category] = [];
      }
  
      // Add image to category
      images[category].push({
        src: r(item),
        alt: pathParts[2]?.replace(/\.(webp|jpg|jpeg)$/, '') || '',
        caption: pathParts[2]?.replace(/\.(webp|jpg|jpeg)$/, '') || ''
      });
    });
  
    return images;
  };
  
  const loadGalleryImages = () => {
    // Initialize with empty arrays for all categories
    const images = {
      night: [],
      'keystone-dreams': [],
      live: [],
      'in-transit': [],
      street: [],
      people: [],
      oteote: []
    };
  
    try {
      // Use webpack's require.context to get all images
      const imageContext = require.context(
        '../images',  // The relative path to your images folder
        true,         // Include subdirectories
        /\.(webp|jpg|jpeg)$/i  // Pattern to match files
      );
  
      // Merge the loaded images with our initialized categories
      const loadedImages = importAll(imageContext);
      Object.keys(images).forEach(category => {
        if (loadedImages[category]) {
          images[category] = loadedImages[category];
        }
      });
    } catch (error) {
      console.error('Error loading images:', error);
    }
  
    return images;
  };
  
  export { loadGalleryImages };