import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check, Shield, Settings } from 'lucide-react';
import { fetchWordList } from './wordLists';

// Leet speak transformation map
const LEET_MAP = {
  'a': '@',
  'e': '3',
  'i': '1',
  'o': '0',
  's': '$',
  'r': '7',
  'b': '8',
  'g': '9',
  'z': '2'
};

const DicewareGenerator = () => {
  const [wordList, setWordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [numWords, setNumWords] = useState(5);
  const [copied, setCopied] = useState(false);
  const [entropy, setEntropy] = useState(0);
  const [leetProbability, setLeetProbability] = useState(0.5); // 50% chance by default
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      try {
        // Load the word list for the current number of words
        const words = await fetchWordList(numWords);
        console.log('Loaded words:', words); // Debug log
        if (!words || words.length === 0) {
          throw new Error('No words loaded from fetchWordList');
        }
        setWordList(words);
        generatePassword(words, numWords);
      } catch (error) {
        console.error('Error loading word lists:', error);
        // Fallback word list in case of loading failure
        const fallbackWords = ['cat', 'dog', 'bird', 'fish', 'tree', 'house', 'table', 'chair', 'book', 'lamp'];
        setWordList(fallbackWords);
        generatePassword(fallbackWords, numWords);
      } finally {
        setLoading(false);
      }
    };
    loadWords();
  }, [numWords]);

  const rollDice = () => Math.floor(Math.random() * wordList.length);

  // Enhanced convertToLeetSpeak with randomization
  const convertToLeetSpeak = (word) => {
    return word.toLowerCase().split('').map(char => {
      if (LEET_MAP[char] && Math.random() < leetProbability) {
        return LEET_MAP[char];
      }
      return char;
    }).join('');
  };

  const generatePassword = (words = wordList, num = numWords) => {
    if (!words || words.length === 0) {
      console.error('No words available for password generation');
      return;
    }

    console.log('Generating password with words:', words); // Debug log

    // Generate an array of target lengths for each word position
    const targetLengths = Array(num).fill(0).map(() => 
      Math.floor(Math.random() * 5) + 3  // Random length between 3 and 7 characters
    );

    console.log('Target lengths:', targetLengths); // Debug log

    // Select words that roughly match our target lengths
    const selectedWords = targetLengths.map(targetLength => {
      // Find words that are within ±1 character of our target length
      const validWords = words.filter(word => 
        Math.abs(word.length - targetLength) <= 1
      );
      
      console.log(`Found ${validWords.length} valid words for length ${targetLength}`); // Debug log
      
      // If we can't find a word of the desired length, fall back to any word
      if (validWords.length === 0) {
        const randomWord = words[rollDice()];
        console.log(`No valid words found for length ${targetLength}, using random word: ${randomWord}`);
        return randomWord;
      }
      
      // Select a random word from the valid words
      const selectedWord = validWords[Math.floor(Math.random() * validWords.length)];
      console.log(`Selected word: ${selectedWord} for target length: ${targetLength}`);
      return selectedWord;
    });

    const newPassword = selectedWords
      .map(convertToLeetSpeak)
      .join('-');
    
    setPassword(newPassword);

    // Calculate entropy (bits of randomness)
    // Now includes additional entropy from random leet transformations
    const wordEntropy = Math.log2(words.length) * num;
    const leetEntropy = selectedWords.join('').length * Math.log2(2) * leetProbability;
    setEntropy(Math.round(wordEntropy + leetEntropy));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStrengthColor = (bits) => {
    if (bits < 50) return 'text-red-500';
    if (bits < 80) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStrengthLabel = (bits) => {
    if (bits < 50) return 'Weak';
    if (bits < 80) return 'Good';
    return 'Strong';
  };

  if (loading) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6">
        <div className="text-center text-gray-200">
          <p>Loading word lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display text-gray-200 mb-2">Enhanced Diceware Generator</h3>
        <p className="text-gray-400">Generate secure passwords with varying word lengths and random character substitutions</p>
      </div>

      <div className="space-y-6">
        <div className="bg-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield size={16} className={getStrengthColor(entropy)} />
              <span className={`text-sm ${getStrengthColor(entropy)}`}>
                {getStrengthLabel(entropy)} ({entropy} bits of entropy)
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => generatePassword()}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                title="Generate new password"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <p className="text-xl text-gray-200 font-mono break-all">
            {password}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Number of Words
            </label>
            <div className="flex gap-2">
              {[4, 5, 6, 7, 8].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setNumWords(num);
                    generatePassword(wordList, num);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    numWords === num
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-neutral-700 rounded-lg p-6 max-w-sm w-full">
                <h4 className="text-xl font-bold text-gray-200 mb-4">Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-200 mb-2">
                      Leet Speak Probability ({Math.round(leetProbability * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={leetProbability * 100}
                      onChange={(e) => {
                        const newProb = Number(e.target.value) / 100;
                        setLeetProbability(newProb);
                        generatePassword();
                      }}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-neutral-700 rounded-lg p-4">
            <h4 className="text-gray-200 font-medium mb-2">About Enhanced Diceware</h4>
            <p className="text-gray-400 text-sm">
              This generator creates passwords with varying word lengths (3-7 characters) and adds random character 
              substitutions with a {Math.round(leetProbability * 100)}% probability per character. This increases 
              entropy by making the password pattern less predictable while maintaining readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DicewareGenerator;