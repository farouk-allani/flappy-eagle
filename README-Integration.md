# Flappy Eagle Integration Guide for React + Vite

This guide explains how to integrate the Flappy Eagle game into your React application built with Vite.

## Setup Instructions

### 1. Copy the Files

Copy the following files to your React project:
- `FlappyEagle.jsx` - The main game component
- `FlappyEagle.css` - Styles for the game component
- `GamePage.jsx` - Example page component that uses the game
- `GamePage.css` - Styles for the example page

### 2. Create Assets Directory

Create an `assets` directory in your project (if it doesn't exist already) and copy the following files:
- `flappybird.png` - The eagle sprite
- `toppipe.png` - The top pipe sprite
- `bottompipe.png` - The bottom pipe sprite
- `flappybirdbg.png` - The background image

### 3. Import the Game Component

Import the game component in your app:

```jsx
import { Routes, Route } from 'react-router-dom';
import GamePage from './GamePage';

function App() {
  return (
    <Routes>
      <Route path="/game" element={<GamePage />} />
      {/* Your other routes */}
    </Routes>
  );
}

export default App;
```

Or directly in a specific page:

```jsx
import FlappyEagle from './FlappyEagle';

function MyPage() {
  return (
    <div>
      <h1>My Game Page</h1>
      <FlappyEagle 
        width={360} 
        height={640} 
        onGameOver={(score) => console.log(`Game over! Score: ${score}`)}
        onScore={(score) => console.log(`Current score: ${score}`)}
      />
    </div>
  );
}
```

## Customization Options

The `FlappyEagle` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | 360 | Canvas width in pixels |
| height | number | 640 | Canvas height in pixels |
| gravity | number | 0.4 | Gravity effect on the bird |
| jumpVelocity | number | -6 | Jump velocity (negative for upward) |
| pipeSpeed | number | -2 | Pipe movement speed (negative for leftward) |
| pipeInterval | number | 1500 | Time between pipe spawns in milliseconds |
| onGameOver | function | () => {} | Callback when game ends, receives final score |
| onScore | function | () => {} | Callback when score changes, receives current score |

## Responsive Design

The game is designed to be responsive and will adapt to different screen sizes. The canvas will maintain its aspect ratio while scaling down on smaller screens.

## Browser Compatibility

This implementation uses standard HTML5 Canvas API and should work in all modern browsers.

## Adding Sound Effects

To add sound effects, you can import audio files and play them at appropriate moments:

```jsx
import jumpSound from './assets/sfx_wing.wav';
import scoreSound from './assets/sfx_point.wav';
import hitSound from './assets/sfx_hit.wav';

// Then in your component:
const jumpAudio = new Audio(jumpSound);
const scoreAudio = new Audio(scoreSound);
const hitAudio = new Audio(hitSound);

// Play sounds at appropriate times:
const handleJump = () => {
  jumpAudio.currentTime = 0;
  jumpAudio.play();
  // other jump logic
};
```

## Performance Considerations

- The game uses `requestAnimationFrame` for smooth animation
- Canvas operations are optimized to minimize redraws
- The game loop is properly cleaned up when the component unmounts

## Troubleshooting

If you encounter issues:

1. Make sure all asset paths are correct
2. Check browser console for errors
3. Verify that the canvas element is properly rendered
4. Ensure the component is unmounted properly to prevent memory leaks
