import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthService';

const GameZone = () => {
  const { user, logout } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover

  const games = [
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Match pairs of cards to improve your memory',
      icon: '🧠',
      component: MemoryGame
    },
    {
      id: 'snake',
      name: 'Snake & Ladders',
      description: 'Classic board game with educational twists',
      icon: '🐍',
      component: SnakeLaddersGame
    },
    {
      id: 'math',
      name: 'Math Challenge',
      description: 'Solve math problems to earn points',
      icon: '🔢',
      component: MathGame
    },
    {
      id: 'word',
      name: 'Word Builder',
      description: 'Build words from given letters',
      icon: '📝',
      component: WordGame
    }
  ];

  const renderGame = () => {
    if (!selectedGame) return null;
    
    const GameComponent = selectedGame.component;
    return (
      <GameComponent
        onGameOver={(finalScore) => {
          setScore(finalScore);
          setGameState('gameover');
        }}
        onBackToMenu={() => {
          setSelectedGame(null);
          setGameState('menu');
          setScore(0);
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Header */}
      <header className="bg-white bg-opacity-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 text-xl font-bold">🎮</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Game Zone</h1>
                <p className="text-sm text-white opacity-90">Fun & Educational Games</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={logout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gameState === 'menu' && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Game!</h2>
            <p className="text-white text-lg opacity-90">Select a game to start playing and learning</p>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="text-center mb-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-white text-xl mb-4">Your Score: {score}</p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setGameState('menu');
                    setScore(0);
                  }}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    setSelectedGame(null);
                    setGameState('menu');
                    setScore(0);
                  }}
                  className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  setSelectedGame(game);
                  setGameState('playing');
                }}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:bg-opacity-30 transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-white opacity-90 text-sm">{game.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {gameState === 'playing' && renderGame()}
      </main>
    </div>
  );
};

// Memory Game Component
const MemoryGame = ({ onGameOver, onBackToMenu }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setScore(0);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlippedCards;
      const firstSymbol = cards.find(c => c.id === firstCard).symbol;
      const secondSymbol = cards.find(c => c.id === secondCard).symbol;

      if (firstSymbol === secondSymbol) {
        setMatchedCards([...matchedCards, firstCard, secondCard]);
        setScore(score + 10);
        
        if (matchedCards.length + 2 === cards.length) {
          setTimeout(() => onGameOver(score + 10), 500);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Memory Match</h2>
          <div className="text-white">
            <span className="mr-4">Moves: {moves}</span>
            <span>Score: {score}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square bg-white rounded-lg flex items-center justify-center text-3xl cursor-pointer transition-all transform ${
                flippedCards.includes(card.id) || matchedCards.includes(card.id)
                  ? 'rotate-y-180'
                  : 'hover:scale-105'
              }`}
            >
              {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.symbol : '?'}
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={initializeGame}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Restart
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Snake & Ladders Game Component
const SnakeLaddersGame = ({ onGameOver, onBackToMenu }) => {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
  const ladders = { 1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

  const rollDice = () => {
    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newDiceValue);
    
    let newPosition = playerPosition + newDiceValue;
    
    // Check for ladders
    if (ladders[newPosition]) {
      newPosition = ladders[newPosition];
      setScore(score + 5);
    }
    
    // Check for snakes
    if (snakes[newPosition]) {
      newPosition = snakes[newPosition];
    }
    
    setPlayerPosition(Math.min(newPosition, 100));
    setScore(score + 1);
    
    if (newPosition >= 100) {
      setGameOver(true);
      setTimeout(() => onGameOver(score + 1), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Snake & Ladders</h2>
          <div className="text-white">
            <span className="mr-4">Position: {playerPosition}/100</span>
            <span>Score: {score}</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎲</div>
          <div className="text-4xl font-bold text-white mb-4">{diceValue}</div>
          <button
            onClick={rollDice}
            disabled={gameOver}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            Roll Dice
          </button>
        </div>

        {gameOver && (
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
            <p className="text-white">You reached the finish line!</p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setPlayerPosition(1);
              setDiceValue(0);
              setGameOver(false);
              setScore(0);
            }}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Restart
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Math Game Component
const MathGame = ({ onGameOver, onBackToMenu }) => {
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateQuestion();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateQuestion = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, correctAnswer;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        correctAnswer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        correctAnswer = num1 * num2;
        break;
    }

    setQuestion({ num1, num2, operation, correctAnswer });
    setAnswer('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer) === question.correctAnswer) {
      setScore(score + 10);
      generateQuestion();
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Math Challenge</h2>
          <div className="text-white">
            <span className="mr-4">Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-white mb-4">
            {question.num1} {question.operation} {question.num2} = ?
          </div>
          
          <form onSubmit={handleSubmit} className="flex justify-center">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="text-2xl text-center w-32 py-2 rounded-lg mr-4"
              autoFocus
            />
            <button
              type="submit"
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setScore(0);
              setTimeLeft(60);
              setGameOver(false);
              generateQuestion();
            }}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Restart
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Word Game Component
const WordGame = ({ onGameOver, onBackToMenu }) => {
  const [letters, setLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);

  const wordList = ['CAT', 'DOG', 'BAT', 'RAT', 'MAT', 'HAT', 'SAT', 'PAT'];

  useEffect(() => {
    generateLetters();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateLetters = () => {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    
    const newLetters = [
      ...vowels.slice(0, 2),
      ...consonants.slice(0, 6)
    ].sort(() => Math.random() - 0.5);
    
    setLetters(newLetters);
  };

  const addLetter = (letter) => {
    setCurrentWord(currentWord + letter);
  };

  const removeLastLetter = () => {
    setCurrentWord(currentWord.slice(0, -1));
  };

  const submitWord = () => {
    if (wordList.includes(currentWord) && !foundWords.includes(currentWord)) {
      setFoundWords([...foundWords, currentWord]);
      setScore(score + currentWord.length * 10);
    }
    setCurrentWord('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Word Builder</h2>
          <div className="text-white">
            <span className="mr-4">Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-white mb-4">Current Word: {currentWord}</div>
          
          <div className="flex justify-center space-x-2 mb-4">
            {letters.map((letter, index) => (
              <button
                key={index}
                onClick={() => addLetter(letter)}
                className="w-12 h-12 bg-white text-purple-600 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="space-x-2">
            <button
              onClick={removeLastLetter}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Delete
            </button>
            <button
              onClick={submitWord}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">Found Words:</h3>
          <div className="flex flex-wrap gap-2">
            {foundWords.map((word, index) => (
              <span key={index} className="bg-white text-purple-600 px-3 py-1 rounded-lg font-semibold">
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setScore(0);
              setTimeLeft(120);
              setGameOver(false);
              setFoundWords([]);
              setCurrentWord('');
              generateLetters();
            }}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Restart
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameZone;