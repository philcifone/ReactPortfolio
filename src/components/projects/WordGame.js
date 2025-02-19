import React, { useState, useEffect } from 'react';
import { RotateCcw, Settings, HelpCircle } from 'lucide-react';
import { fetchWordList } from './wordLists';

const WordGame = () => {
  const [gameSettings, setGameSettings] = useState({
    wordLength: 5,
    maxGuesses: 6
  });
  const [wordList, setWordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [usedLetters, setUsedLetters] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      try {
        const allWords = await fetchWordList();
        // Filter words to match the current word length setting
        const filteredWords = allWords.filter(word => word.length === gameSettings.wordLength);
        setWordList(filteredWords);
        
        if (filteredWords.length > 0) {
          const newWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
          setSecretWord(newWord);
        } else {
          setMessage('No words found for current length setting');
        }
      } catch (error) {
        console.error('Error loading words:', error);
        setMessage('Error loading word list');
      } finally {
        setLoading(false);
      }
    };
    loadWords();
  }, [gameSettings.wordLength]);

  // Helper function to count occurrences of letters in a word
  const getLetterCount = (word) => {
    return word.split('').reduce((acc, letter) => {
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});
  };

  // Get the status of each letter in a guess
  const evaluateGuess = (guess, target) => {
    const result = Array(guess.length).fill('absent');
    const targetLetterCount = getLetterCount(target);
    const usedIndices = new Set();
    
    // First pass: Mark all correct letters
    guess.split('').forEach((letter, i) => {
      if (letter === target[i]) {
        result[i] = 'correct';
        targetLetterCount[letter]--;
        usedIndices.add(i);
      }
    });

    // Second pass: Mark present letters, respecting remaining count
    guess.split('').forEach((letter, i) => {
      if (!usedIndices.has(i) && targetLetterCount[letter] > 0) {
        result[i] = 'present';
        targetLetterCount[letter]--;
      }
    });

    return result;
  };

  const startNewGame = () => {
    if (wordList.length === 0) {
      setMessage('No valid words available');
      return;
    }
    const filteredWords = wordList.filter(word => word.length === gameSettings.wordLength);
    const newWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setSecretWord(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
    setUsedLetters({});
  };

  const handleKeyPress = (event) => {
    if (gameOver) return;

    if (event.key === 'Enter') {
      submitGuess();
    } else if (event.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < gameSettings.wordLength) {
      setCurrentGuess(prev => prev + event.key.toLowerCase());
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, gameOver, gameSettings.wordLength]);

  const getLetterStyle = (letter, position, guess) => {
    if (!guess) return 'bg-neutral-700';
    
    const evaluation = evaluateGuess(guess, secretWord);
    switch (evaluation[position]) {
      case 'correct':
        return 'bg-green-600';
      case 'present':
        return 'bg-yellow-600';
      default:
        return 'bg-neutral-600';
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== gameSettings.wordLength) {
      setMessage(`Word must be ${gameSettings.wordLength} letters!`);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const validWords = wordList.filter(word => word.length === gameSettings.wordLength);
    if (!validWords.includes(currentGuess)) {
      setMessage('Not in word list!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Update used letters with accurate evaluation
    const newUsedLetters = { ...usedLetters };
    const evaluation = evaluateGuess(currentGuess, secretWord);
    
    currentGuess.split('').forEach((letter, i) => {
      const currentStatus = evaluation[i];
      // Only upgrade the status (absent -> present -> correct)
      if (currentStatus === 'correct' || 
          (currentStatus === 'present' && newUsedLetters[letter] !== 'correct') ||
          (!newUsedLetters[letter])) {
        newUsedLetters[letter] = currentStatus;
      }
    });
    
    setUsedLetters(newUsedLetters);

    if (currentGuess === secretWord) {
      setGameOver(true);
      setMessage('Congratulations! You won!');
    } else if (newGuesses.length >= gameSettings.maxGuesses) {
      setGameOver(true);
      setMessage(`Game Over! The word was: ${secretWord}`);
    }

    setCurrentGuess('');
  };

  const getKeyboardButtonStyle = (key) => {
    const status = usedLetters[key];
    switch (status) {
      case 'correct':
        return 'bg-green-600';
      case 'present':
        return 'bg-yellow-600';
      case 'absent':
        return 'bg-neutral-700';
      default:
        return 'bg-neutral-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6 max-w-xl mx-auto">
        <div className="text-center text-gray-200">
          <p>Loading word list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-200">Word Game</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 text-gray-400 hover:text-gray-300"
          >
            <HelpCircle size={20} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-gray-300"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={startNewGame}
            className="p-2 text-gray-400 hover:text-gray-300"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {message && (
        <div className="text-center mb-4 text-gray-200">
          {message}
        </div>
      )}

      <div className="grid gap-2 mb-4">
        {Array.from({ length: gameSettings.maxGuesses }).map((_, i) => (
          <div key={i} className="flex gap-2 justify-center">
            {Array.from({ length: gameSettings.wordLength }).map((_, j) => {
              const letter = guesses[i]?.[j] || (i === guesses.length ? currentGuess[j] : '');
              return (
                <div
                  key={j}
                  className={`w-12 h-12 flex items-center justify-center text-xl font-bold text-white rounded 
                    ${getLetterStyle(letter, j, guesses[i])} 
                    ${i === guesses.length && shake ? 'animate-[shake_0.2s_ease-in-out]' : ''}`}
                >
                  {letter?.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="grid gap-2">
        {[
          ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
          ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
          ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
        ].map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map(key => {
              const isSpecialKey = key === 'Enter' || key === '⌫';
              const buttonStyle = isSpecialKey ? 'bg-neutral-600' : getKeyboardButtonStyle(key);

              return (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'Enter') submitGuess();
                    else if (key === '⌫') setCurrentGuess(prev => prev.slice(0, -1));
                    else if (currentGuess.length < gameSettings.wordLength) {
                      setCurrentGuess(prev => prev + key);
                    }
                  }}
                  className={`${isSpecialKey ? 'px-4' : 'w-8'} h-10 ${buttonStyle} text-white rounded font-medium hover:opacity-90`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-neutral-700 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-200 mb-2">Word Length</label>
                <select
                  value={gameSettings.wordLength}
                  onChange={(e) => setGameSettings(prev => ({
                    ...prev,
                    wordLength: Number(e.target.value)
                  }))}
                  className="w-full bg-neutral-600 text-white p-2 rounded"
                >
                  {[4, 5, 6, 7, 8].map(length => (
                    <option key={length} value={length}>{length} letters</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-200 mb-2">Max Guesses</label>
                <select
                  value={gameSettings.maxGuesses}
                  onChange={(e) => setGameSettings(prev => ({
                    ...prev,
                    maxGuesses: Number(e.target.value)
                  }))}
                  className="w-full bg-neutral-600 text-white p-2 rounded"
                >
                  {[4, 5, 6, 7, 8].map(guesses => (
                    <option key={guesses} value={guesses}>{guesses} guesses</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setShowSettings(false);
                  startNewGame();
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save & New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-neutral-700 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-200 mb-4">How to Play</h3>
            <div className="space-y-4 text-gray-200">
              <p>Guess the word in {gameSettings.maxGuesses} tries.</p>
              <p>Each guess must be a valid {gameSettings.wordLength}-letter word.</p>
              <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Green: Letter is in the correct spot</li>
                <li>Yellow: Letter is in the word but in the wrong spot</li>
                <li>Gray: Letter is not in the word</li>
              </ul>
              <button
                onClick={() => setShowHelp(false)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordGame;