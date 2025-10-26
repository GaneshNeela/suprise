import React, { useRef, useState, useEffect, useCallback } from 'react';
import SwipeCards from './SwipeCards';
import './ScratchCard.css';

const ScratchCard = ({ 
  hiddenContent = "🎉 Congratulations! You've revealed the surprise! 🎉",
  scratchColor = '#c0c0c0',
  backgroundColor = '#ff6b6b',
  revealThreshold = 50, // Percentage of card that needs to be scratched to auto-reveal
  swipeCards = [] // Cards to show after scratch is revealed
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSwipeCards, setShowSwipeCards] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Fill canvas with scratch-off color
      ctx.fillStyle = scratchColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set composite operation for scratching
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scratchColor]);

  const calculateScratchedPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparentPixels = 0;
    let totalPixels = pixels.length / 4;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }
    
    const percentage = (transparentPixels / totalPixels) * 100;
    setScratchedPercentage(Math.round(percentage));
    
    if (percentage >= revealThreshold && !isRevealed) {
      setIsRevealed(true);
      // Show swipe cards immediately
      setShowSwipeCards(true);
    }
  }, [revealThreshold, isRevealed]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startScratch = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    setShowInstructions(false);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    calculateScratchedPercentage();
  };

  const scratch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    
    calculateScratchedPercentage();
  };

  const endScratch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setScratchedPercentage(100);
    setIsRevealed(true);
  };

  const resetCard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Reset canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = scratchColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    
    setScratchedPercentage(0);
    setIsRevealed(false);
    setShowInstructions(true);
  };

  return (
    <div className="scratch-card-container">
      {/* Show SwipeCards after scratch is revealed */}
      {showSwipeCards && <SwipeCards cards={swipeCards} />}
      
      {/* Hidden content background */}
      <div 
        className="hidden-content"
        style={{ 
          backgroundColor,
          opacity: showSwipeCards ? 0 : 1,
          transition: 'opacity 0.5s ease',
          display: showSwipeCards ? 'none' : 'flex'
        }}
      >
        <div className="content">
          {typeof hiddenContent === 'string' ? (
            <h1>{hiddenContent}</h1>
          ) : (
            hiddenContent
          )}
        </div>
      </div>

      {/* Scratch overlay canvas */}
      <canvas
        ref={canvasRef}
        className={`scratch-canvas ${isRevealed ? 'revealed' : ''}`}
        onMouseDown={startScratch}
        onMouseMove={scratch}
        onMouseUp={endScratch}
        onMouseLeave={endScratch}
        onTouchStart={startScratch}
        onTouchMove={scratch}
        onTouchEnd={endScratch}
        style={{ 
          cursor: isDrawing ? 'grabbing' : 'grab',
          opacity: isRevealed ? 0 : 1,
          display: showSwipeCards ? 'none' : 'block'
        }}
      />

      {/* Instructions overlay */}
      {showInstructions && !isRevealed && (
        <div className="instructions-overlay">
          <div className="instructions">
            <h2>💕 Crafted for you 💕</h2>
            <p>scratch the surface to reveal hidden content...</p>
            <div className="scratch-icon">
              <span>👆</span>
              <div className="scratch-animation"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;