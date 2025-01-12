// wordLists.js
export const fetchWordList = async (length) => {
    try {
      // You can store your word list files in the public directory
      const response = await fetch(`/word-lists/words-${length}.txt`);
      const text = await response.text();
      // Split the text file into an array of words, cleaning up any whitespace
      return text.split('\n')
        .map(word => word.trim().toLowerCase())
        .filter(word => word.length === length && /^[a-z]+$/.test(word));
    } catch (error) {
      console.error('Error loading word list:', error);
      // Fallback to a small set of common words if the file fails to load
      return [
        // Add some fallback words for each length...
        'about', 'above', 'abuse', 'actor', 'acute',
        'admit', 'adopt', 'adult', 'after', 'again'
      ].filter(word => word.length === length);
    }
  };