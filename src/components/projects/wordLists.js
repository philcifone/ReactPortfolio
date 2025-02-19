// wordLists.js
export const fetchWordList = async () => {
  try {
    // Load all word lists (4-8) simultaneously
    const wordLengths = [4, 5, 6, 7, 8];
    const responses = await Promise.all(
      wordLengths.map(length => 
        fetch(`/word-lists/words-${length}.txt`)
          .then(response => response.text())
      )
    );

    // Combine all words into one big pool, maintaining only valid words
    const allWords = responses.flatMap(text => 
      text.split('\n')
        .map(word => word.trim().toLowerCase())
        .filter(word => /^[a-z]+$/.test(word))
    );

    return allWords;
  } catch (error) {
    console.error('Error loading word lists:', error);
    // Fallback with words of various lengths
    return [
      // Nature
      'tree', 'leaf', 'river', 'ocean', 'mountain', 'forest', 'flower', 'garden',
      'wolf', 'eagle', 'hawk', 'bear', 'fox', 'deer', 'butterfly', 'bee',
      'rain', 'snow', 'wind', 'storm', 'cloud', 'star', 'moon', 'sun',
      
      // Books & Academia
      'book', 'page', 'poem', 'story', 'novel', 'essay', 'thesis',
      'study', 'learn', 'read', 'write', 'edit', 'paper', 'library',
      'math', 'science', 'history', 'art', 'physics', 'biology', 'chemistry',
      'theory', 'research', 'scholar', 'student', 'teacher', 'professor',
      
      // Sports
      'ball', 'team', 'game', 'win', 'race', 'score', 'goal',
      'swim', 'run', 'jump', 'throw', 'catch', 'kick', 'hit',
      'soccer', 'hockey', 'tennis', 'golf', 'rugby', 'cricket',
      'athlete', 'player', 'coach', 'stadium', 'field', 'court',
      
      // Music
      'song', 'note', 'tune', 'beat', 'rhythm', 'melody', 'harmony',
      'bass', 'drum', 'piano', 'guitar', 'violin', 'flute', 'harp',
      'jazz', 'rock', 'blues', 'opera', 'concert', 'band', 'orchestra',
      'music', 'sing', 'play', 'compose', 'conduct', 'perform',
      
      // Art
      'paint', 'draw', 'sketch', 'color', 'line', 'shape', 'form',
      'artist', 'canvas', 'brush', 'pencil', 'ink', 'clay', 'sculpture',
      'design', 'create', 'craft', 'print', 'photo', 'film', 'digital',
      'gallery', 'studio', 'museum', 'exhibit', 'show', 'art',
      
      // Mix of short/long words across themes
      'owl', 'jay', 'pen', 'lab', 'tap', 'bow', 'bat', 'key', 'oil',
      'dance', 'paint', 'study', 'write', 'teach', 'learn',
      'symphony', 'research', 'creative', 'wildlife', 'practice'
    ];
  }
};