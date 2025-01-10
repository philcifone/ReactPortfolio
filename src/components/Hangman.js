import React, { useState, useEffect } from 'react';
import { fetchWordList } from './wordLists';
import { RefreshCw, Settings } from 'lucide-react';

const HangmanDrawing = ({ mistakes }) => (
  <svg width="180" height="200" className="stroke-gray-100">
    {/* Platform */}
    <rect x="20" y="190" width="140" height="4" fill="currentColor" />
    <rect x="56" y="16" width="4" height="174" fill="currentColor" />
    <rect x="60" y="16" width="64" height="4" fill="currentColor" />
    <rect x="118" y="20" width="4" height="24" fill="currentColor" />
    
    {/* Head */}
    {mistakes >= 1 && (
      <circle 
        cx="120" 
        cy="60" 
        r="16" 
        fill="none" 
        strokeWidth="4"
        className="animate-draw"
      />
    )}
    {/* Body */}
    {mistakes >= 2 && (
      <line 
        x1="120" 
        y1="76" 
        x2="120" 
        y2="120" 
        strokeWidth="4"
        className="animate-draw" 
      />
    )}
    {/* Left Arm */}
    {mistakes >= 3 && (
      <line 
        x1="120" 
        y1="85" 
        x2="90" 
        y2="105" 
        strokeWidth="4"
        className="animate-draw" 
      />
    )}
    {/* Right Arm */}
    {mistakes >= 4 && (
      <line 
        x1="120" 
        y1="85" 
        x2="150" 
        y2="105" 
        strokeWidth="4"
        className="animate-draw" 
      />
    )}
    {/* Left Leg */}
    {mistakes >= 5 && (
      <line 
        x1="120" 
        y1="120" 
        x2="90" 
        y2="150" 
        strokeWidth="4"
        className="animate-draw" 
      />
    )}
    {/* Right Leg */}
    {mistakes >= 6 && (
      <line 
        x1="120" 
        y1="120" 
        x2="150" 
        y2="150" 
        strokeWidth="4"
        className="animate-draw" 
      />
    )}
  </svg>
);

const HangmanGame = () => {
  const [wordLength, setWordLength] = useState(5);
  const [wordList, setWordList] = useState([]);
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const maxMistakes = 6;

  useEffect(() => {
    loadWords(wordLength);
  }, [wordLength]);

  const loadWords = async (length) => {
    setLoading(true);
    try {
      const words = await fetchWordList(length);
      setWordList(words);
      startNewGame(words);
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewGame = (words = wordList) => {
    if (words.length === 0) return;
    const randomWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
    setWord(randomWord);
    setGuessedLetters(new Set());
    setMistakes(0);
    setGameStatus('playing');
  };

  const getMaskedWord = () => {
    return word
      .split('')
      .map(letter => guessedLetters.has(letter) ? letter : '_')
      .join(' ');
  };

  const handleGuess = (letter) => {
    if (gameStatus !== 'playing') return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= maxMistakes) {
        setGameStatus('lost');
      }
    } else {
      // Check for win
      const isWon = word
        .split('')
        .every(letter => newGuessedLetters.has(letter));
      if (isWon) {
        setGameStatus('won');
      }
    }
  };

  const keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl p-8 max-w-2xl mx-auto text-center">
        <p className="text-gray-200">Loading word list...</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl p-8 max-w-2xl mx-auto shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-100">Hangman</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Settings size={24} />
          </button>
          <button
            onClick={() => startNewGame()}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>

      {/* Game Status */}
      <div className="text-center mb-6">
        <p className="text-lg text-gray-400">
          Mistakes: {mistakes}/{maxMistakes}
        </p>
      </div>

      {/* Hangman Drawing */}
      <div className="flex justify-center mb-8">
        <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-800">
          <HangmanDrawing mistakes={mistakes} />
        </div>
      </div>

      {/* Word Display */}
      <div className="text-center mb-8">
        <p className="text-4xl font-mono tracking-wider text-gray-200 mb-4">
          {getMaskedWord()}
        </p>
        {gameStatus !== 'playing' && (
          <p className={`text-xl font-bold ${
            gameStatus === 'won' ? 'text-green-400' : 'text-red-400'
          }`}>
            {gameStatus === 'won' 
              ? '🎉 Congratulations! You won! 🎉' 
              : `💔 Game Over! The word was: ${word}`}
          </p>
        )}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-2">
        {keyboard.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map(letter => {
              const isGuessed = guessedLetters.has(letter);
              const isCorrect = word.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={isGuessed || gameStatus !== 'playing'}
                  className={`w-10 h-10 rounded-lg font-medium transition-all
                    ${isGuessed
                      ? isCorrect
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-red-600 text-white cursor-not-allowed'
                      : 'bg-neutral-700 text-gray-200 hover:bg-neutral-600'
                    }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-200 mb-2">Word Length</label>
                <div className="flex gap-2">
                  {[4, 5, 6, 7, 8].map(length => (
                    <button
                      key={length}
                      onClick={() => {
                        setWordLength(length);
                        setShowSettings(false);
                      }}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        wordLength === length
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-neutral-700 text-gray-200 py-2 rounded-lg hover:bg-neutral-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HangmanGame;