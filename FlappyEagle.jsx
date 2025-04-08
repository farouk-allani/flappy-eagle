import React, { useEffect, useRef, useState } from 'react';
import './FlappyEagle.css';

// Import assets
import birdImage from './assets/flappybird.png';
import topPipeImage from './assets/toppipe.png';
import bottomPipeImage from './assets/bottompipe.png';
import backgroundImage from './assets/flappybirdbg.png';

const FlappyEagle = ({ 
  width = 360, 
  height = 640,
  gravity = 0.4,
  jumpVelocity = -6,
  pipeSpeed = -2,
  pipeInterval = 1500,
  onGameOver = () => {},
  onScore = () => {}
}) => {
  const canvasRef = useRef(null);
  const birdRef = useRef({
    x: width / 8,
    y: height / 2,
    width: 34,
    height: 24
  });
  const pipeArrayRef = useRef([]);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const velocityYRef = useRef(0);
  const requestIdRef = useRef(null);
  const [score, setScore] = useState(0);
  
  // Load images
  const birdImgRef = useRef(null);
  const topPipeImgRef = useRef(null);
  const bottomPipeImgRef = useRef(null);

  // Initialize the game
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Load images
    const birdImg = new Image();
    birdImg.src = birdImage;
    birdImgRef.current = birdImg;

    const topPipeImg = new Image();
    topPipeImg.src = topPipeImage;
    topPipeImgRef.current = topPipeImg;

    const bottomPipeImg = new Image();
    bottomPipeImg.src = bottomPipeImage;
    bottomPipeImgRef.current = bottomPipeImg;

    // Start game loop when images are loaded
    birdImg.onload = () => {
      context.drawImage(birdImg, birdRef.current.x, birdRef.current.y, birdRef.current.width, birdRef.current.height);
      requestIdRef.current = requestAnimationFrame(update);
    };

    // Set up event listeners
    document.addEventListener('keydown', moveBird);
    canvas.addEventListener('click', () => {
      velocityYRef.current = jumpVelocity;
      if (gameOverRef.current) {
        resetGame();
      }
    });

    // Set up pipe generation interval
    const pipeIntervalId = setInterval(placePipes, pipeInterval);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', moveBird);
      canvas.removeEventListener('click', () => {});
      clearInterval(pipeIntervalId);
      cancelAnimationFrame(requestIdRef.current);
    };
  }, [width, height, jumpVelocity, pipeInterval]);

  // Game update function
  const update = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    requestIdRef.current = requestAnimationFrame(update);
    
    if (gameOverRef.current) {
      return;
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    velocityYRef.current += gravity;
    birdRef.current.y = Math.max(birdRef.current.y + velocityYRef.current, 0);
    context.drawImage(
      birdImgRef.current, 
      birdRef.current.x, 
      birdRef.current.y, 
      birdRef.current.width, 
      birdRef.current.height
    );

    if (birdRef.current.y > canvas.height) {
      gameOver();
    }

    // Pipes
    for (let i = 0; i < pipeArrayRef.current.length; i++) {
      let pipe = pipeArrayRef.current[i];
      pipe.x += pipeSpeed;
      context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

      if (!pipe.passed && birdRef.current.x > pipe.x + pipe.width) {
        scoreRef.current += 0.5;
        pipe.passed = true;
        
        // Only trigger score event on whole numbers
        if (Number.isInteger(scoreRef.current)) {
          setScore(scoreRef.current);
          onScore(scoreRef.current);
        }
      }

      if (detectCollision(birdRef.current, pipe)) {
        gameOver();
      }
    }

    // Clear pipes that are off screen
    while (pipeArrayRef.current.length > 0 && pipeArrayRef.current[0].x < -64) {
      pipeArrayRef.current.shift();
    }

    // Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(scoreRef.current, 5, 45);

    if (gameOverRef.current) {
      context.fillText("GAME OVER", 5, 90);
    }
  };

  // Place pipes function
  const placePipes = () => {
    if (gameOverRef.current) {
      return;
    }

    const pipeWidth = 64;
    const pipeHeight = 512;
    const pipeX = width;
    const pipeY = 0;

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = height/4;

    let topPipe = {
      img: topPipeImgRef.current,
      x: pipeX,
      y: randomPipeY,
      width: pipeWidth,
      height: pipeHeight,
      passed: false
    };
    
    let bottomPipe = {
      img: bottomPipeImgRef.current,
      x: pipeX,
      y: randomPipeY + pipeHeight + openingSpace,
      width: pipeWidth,
      height: pipeHeight,
      passed: false
    };
    
    pipeArrayRef.current.push(topPipe);
    pipeArrayRef.current.push(bottomPipe);
  };

  // Move bird function
  const moveBird = (e) => {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
      velocityYRef.current = jumpVelocity;

      if (gameOverRef.current) {
        resetGame();
      }
    }
  };

  // Game over function
  const gameOver = () => {
    gameOverRef.current = true;
    onGameOver(scoreRef.current);
  };

  // Reset game function
  const resetGame = () => {
    birdRef.current.y = height / 2;
    pipeArrayRef.current = [];
    velocityYRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    gameOverRef.current = false;
  };

  // Collision detection
  const detectCollision = (a, b) => {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  };

  return (
    <div className="flappy-eagle-container">
      <canvas 
        ref={canvasRef} 
        id="flappy-eagle-board"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="game-controls">
        <p>Click or press Space/Up/X to jump</p>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
};

export default FlappyEagle;
