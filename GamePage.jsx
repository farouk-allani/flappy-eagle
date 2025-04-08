import React, { useState } from 'react';
import FlappyEagle from './FlappyEagle';
import './GamePage.css';

const GamePage = () => {
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const handleGameOver = (score) => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const handleScore = (score) => {
    setCurrentScore(score);
  };

  return (
    <div className="game-page">
      <h1>Flappy Eagle</h1>
      
      <div className="score-board">
        <div className="score-item">
          <span className="score-label">Current Score:</span>
          <span className="score-value">{currentScore}</span>
        </div>
        <div className="score-item">
          <span className="score-label">High Score:</span>
          <span className="score-value">{highScore}</span>
        </div>
      </div>
      
      <div className="game-container">
        <FlappyEagle 
          width={360}
          height={640}
          onGameOver={handleGameOver}
          onScore={handleScore}
        />
      </div>
      
      <div className="game-instructions">
        <h3>How to Play</h3>
        <p>Click on the game area or press Space, Up Arrow, or X key to make the eagle jump.</p>
        <p>Avoid hitting the pipes and try to score as many points as possible!</p>
        <p>The game will reset automatically when you lose.</p>
      </div>
    </div>
  );
};

export default GamePage;
