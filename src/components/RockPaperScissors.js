import React, { useState, useEffect } from 'react';
import { Scissors, Circle, Square, RotateCcw, Trophy, X } from 'lucide-react';

const RockPaperScissors = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [result, setResult] = useState('');
  const [matchCount, setMatchCount] = useState(1);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const choices = ['rock', 'paper', 'scissors'];
  
  const getIcon = (choice, size = 24) => {
    switch (choice) {
      case 'rock':
        return <Circle size={size} />;
      case 'paper':
        return <Square size={size} />;
      case 'scissors':
        return <Scissors size={size} />;
      default:
        return null;
    }
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return 'tie';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'player';
    }
    return 'computer';
  };

  const playRound = (playerSelection) => {
    if (gameOver || isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(playerSelection);
    setComputerChoice(null);
    setResult('');

    // Simulate computer thinking
    setTimeout(() => {
      const computerSelection = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(computerSelection);
      
      const winner = determineWinner(playerSelection, computerSelection);
      
      if (winner === 'player') {
        setPlayerScore(prev => prev + 1);
        setResult('You won this round!');
      } else if (winner === 'computer') {
        setComputerScore(prev => prev + 1);
        setResult('Computer won this round!');
      } else {
        setResult("It's a tie!");
      }

      setMatchCount(prev => prev + 1);
      setIsAnimating(false);
    }, 1000);
  };

  useEffect(() => {
    if (playerScore === 2 || computerScore === 2) {
      setGameOver(true);
    }
  }, [playerScore, computerScore]);

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setResult('');
    setMatchCount(1);
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameOver(false);
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-200 mb-2">Rock Paper Scissors</h2>
        <p className="text-gray-400">Best out of three. Choose your weapon!</p>
      </div>

      {/* Score Display */}
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-400">You</p>
          <p className="text-3xl text-gray-200">{playerScore}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Round</p>
          <p className="text-xl text-gray-300">{matchCount}/3</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-400">Computer</p>
          <p className="text-3xl text-gray-200">{computerScore}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex justify-between items-center mb-8">
        {/* Player Choice */}
        <div className="text-center flex-1">
          <div className="h-24 flex items-center justify-center">
            {playerChoice && (
              <div className={`transform transition-transform duration-300 ${isAnimating ? 'scale-110' : ''}`}>
                {getIcon(playerChoice, 48)}
              </div>
            )}
          </div>
        </div>

        {/* VS */}
        <div className="px-4">
          <span className="text-gray-500 font-bold">VS</span>
        </div>

        {/* Computer Choice */}
        <div className="text-center flex-1">
          <div className="h-24 flex items-center justify-center">
            {computerChoice && (
              <div className={`transform transition-transform duration-300 ${isAnimating ? 'scale-110' : ''}`}>
                {getIcon(computerChoice, 48)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result Message */}
      <div className="text-center mb-8">
        <p className="text-xl text-gray-200">{result}</p>
        {gameOver && (
          <p className="text-2xl font-bold mt-2 text-green-400">
            {playerScore > computerScore ? '🎉 You won the game! 🎉' : '💔 Game Over - Computer Wins! 💔'}
          </p>
        )}
      </div>

      {/* Controls */}
      {!gameOver ? (
        <div className="flex justify-center gap-4">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => playRound(choice)}
              disabled={isAnimating}
              className={`p-4 rounded-full transition-all duration-300 
                ${isAnimating ? 'bg-neutral-700 cursor-not-allowed' : 'bg-neutral-600 hover:bg-neutral-500'} 
                transform hover:scale-110 active:scale-95`}
            >
              {getIcon(choice, 32)}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RotateCcw size={20} />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;