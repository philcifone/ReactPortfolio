import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check, Shield } from 'lucide-react';
import { fetchWordList } from './wordLists';

const DicewareGenerator = () => {
  const [wordList, setWordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [numWords, setNumWords] = useState(5);
  const [copied, setCopied] = useState(false);
  const [entropy, setEntropy] = useState(0);

  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      try {
        // We'll use 5-letter words for consistency
        const words = await fetchWordList(5);
        setWordList(words);
        generatePassword(words, numWords);
      } catch (error) {
        console.error('Error loading word list:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWords();
  }, []);

  const rollDice = () => Math.floor(Math.random() * wordList.length);

  const generatePassword = (words = wordList, num = numWords) => {
    if (words.length === 0) return;

    const selectedWords = Array(num)
      .fill(0)
      .map(() => words[rollDice()]);

    const newPassword = selectedWords.join(' ');
    setPassword(newPassword);

    // Calculate entropy (bits of randomness)
    // Entropy = log2(pool_size) * num_words
    const bitsOfEntropy = Math.log2(words.length) * num;
    setEntropy(Math.round(bitsOfEntropy));
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
          <p>Loading word list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-200 mb-2">Diceware Password Generator</h3>
        <p className="text-gray-400">Generate secure, memorable passwords using the Diceware method</p>
      </div>

      <div className="space-y-6">
        {/* Password Display */}
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

        {/* Settings */}
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-700 rounded-lg p-4">
            <h4 className="text-gray-200 font-medium mb-2">About Diceware Passwords</h4>
            <p className="text-gray-400 text-sm">
              Diceware generates passwords by randomly selecting words from a large list. 
              These passwords are both secure and memorable. Each word adds about {Math.round(Math.log2(wordList.length))} bits 
              of entropy to your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DicewareGenerator;