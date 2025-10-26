import React from 'react';
import ScratchCard from './ScratchCard';
import './App.css';

function App() {
  const customContent = (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💕</div>
      <p style={{ 
        fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
        fontFamily: 'Georgia, serif',
        color: '#8b4b6b',
        opacity: '0.9'
      }}>
        A special message just for you
      </p>
    </div>
  );

  const romanticCards = [
    {
      id: 1,
      title: "Best Colleague",
      content: "for the colleague who does work with dedication and timeless effort. your help and support means a lot. Thanks for being an amazing coworker!",
      emoji: "💪",
      background: "linear-gradient(135deg, #ffeef0 0%, #ffd6cc 100%)"
    },
    {
      id: 2,
      title: "Best Friend",
      content: "for the friend who is smart, kind and fun to be with. time moves fast when you are around. thank you for being such a wonderful friend!",
      emoji: "👯‍♂️",
      background: "linear-gradient(135deg, #ffe0e6 0%, #ffb3c1 100%)"
    },
    {
      id: 3,
      title: "My Choice",
      content: "My Love, My Best Friend , My Best Colleague. My Partner in Crime. I am pleased to have you in my life.",
      emoji: "💓",
      background: "linear-gradient(135deg, #f8e6ff 0%, #e6ccff 100%)"
    }
  ];

  return (
    <div className="App">
      <ScratchCard 
        hiddenContent={customContent}
        scratchColor="#f8d7da"
        backgroundColor="linear-gradient(135deg, #ffeef0 0%, #ffd6cc 100%)"
        revealThreshold={15}
        swipeCards={romanticCards}
      />
    </div>
  );
}

export default App;
