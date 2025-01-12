import React, { useState, useEffect } from 'react';
import { Scissors, Circle, Square, RotateCcw } from 'lucide-react';

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

    setTimeout(() => {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const computerSelection = choices[array[0] % choices.length];
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
    <div className="bg-neutral-900 rounded-xl p-8 max-w-2xl mx-auto shadow-xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-100 mb-3">Rock Paper Scissors</h2>
        <p className="text-gray-400">Best out of three. Shoot!</p>
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-3 items-center mb-10 bg-neutral-800 rounded-lg p-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-400 mb-1">You</p>
          <p className="text-4xl font-bold text-gray-100">{playerScore}</p>
        </div>
        <div className="text-center border-x border-neutral-700 px-4">
          <p className="text-sm text-gray-400 mb-1">Round</p>
          <p className="text-2xl font-medium text-gray-300">{matchCount}/3</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-400 mb-1">Computer</p>
          <p className="text-4xl font-bold text-gray-100">{computerScore}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex items-center justify-between mb-10 bg-neutral-800 rounded-lg p-6">
        {/* Player Choice */}
        <div className="flex-1 flex justify-center">
          <div className="h-24 flex items-center justify-center">
            {playerChoice ? (
              <div className={`transform transition-transform duration-300 ${
                isAnimating ? 'scale-110' : ''
              } text-blue-400`}>
                {getIcon(playerChoice, 48)}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-neutral-700" />
            )}
          </div>
        </div>

        {/* VS */}
        <div className="px-8">
          <span className="text-gray-500 font-bold text-xl">VS</span>
        </div>

        {/* Computer Choice */}
        <div className="flex-1 flex justify-center">
          <div className="h-24 flex items-center justify-center">
            {computerChoice ? (
              <div className={`transform transition-transform duration-300 ${
                isAnimating ? 'scale-110' : ''
              } text-red-400`}>
                {getIcon(computerChoice, 48)}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-neutral-700" />
            )}
          </div>
        </div>
      </div>

      {/* Result Message */}
      <div className="text-center mb-10 min-h-16">
        <p className="text-xl text-gray-200">{result}</p>
        {gameOver && (
          <p className="text-2xl font-bold mt-3">
            {playerScore > computerScore ? (
              <span className="text-green-400">🎉 You won the game! 🎉</span>
            ) : (
              <span className="text-red-400">💔 Game Over - Computer Wins! 💔</span>
            )}
          </p>
        )}
      </div>

      {/* Controls */}
      {!gameOver ? (
        <div className="flex justify-center gap-6">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => playRound(choice)}
              disabled={isAnimating}
              className={`p-6 rounded-xl transition-all duration-300 
                ${isAnimating ? 'bg-neutral-800 cursor-not-allowed' : 'bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800'} 
                transform hover:scale-110 active:scale-95 disabled:transform-none
                ${choice === playerChoice ? 'ring-2 ring-blue-400' : ''}`}
            >
              {getIcon(choice, 36)}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
          >
            <RotateCcw size={24} />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;