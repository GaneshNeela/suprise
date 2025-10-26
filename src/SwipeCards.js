import React, { useState, useRef, useEffect } from 'react';
import './SwipeCards.css';

const SwipeCards = ({ cards = [] }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [showScrollMessage, setShowScrollMessage] = useState(false);
    const [allowScrolling, setAllowScrolling] = useState(false);
    const [touchStartY, setTouchStartY] = useState(null);
    const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  const [showBirthdaySurprise, setShowBirthdaySurprise] = useState(false);
  const [showCakeAnimation, setShowCakeAnimation] = useState(false);
  const [hideBirthdayContent, setHideBirthdayContent] = useState(false);
  const [cakeSlices, setCakeSlices] = useState([]);
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [cuttingAnimation, setCuttingAnimation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [knifeY, setKnifeY] = useState(0);
  const [cutProgress, setCutProgress] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [isCardDragging, setIsCardDragging] = useState(false);
  const startY = useRef(0);
  const cardRef = useRef(null);    // Default cards if none provided
    const defaultCards = [
        {
            id: 1,
            title: "Our First Date",
            content: "Remember when we first met? Your smile lit up the entire room and I knew my life would never be the same.",
            emoji: "💕",
            background: "linear-gradient(135deg, #ffeef0 0%, #ffd6cc 100%)"
        },
        {
            id: 2,
            title: "Your Beautiful Soul",
            content: "Every day with you is a blessing. Your kindness, your laughter, your gentle heart - you make everything better.",
            emoji: "🌹",
            background: "linear-gradient(135deg, #ffe0e6 0%, #ffb3c1 100%)"
        },
        {
            id: 3,
            title: "Forever Together",
            content: "I promise to love you today, tomorrow, and for all the days that follow. You are my everything.",
            emoji: "💍",
            background: "linear-gradient(135deg, #f8e6ff 0%, #e6ccff 100%)"
        },
        {
            id: 4,
            title: "My Heart is Yours",
            content: "In a world full of temporary things, you are my forever. Thank you for being the love of my life.",
            emoji: "💖",
            background: "linear-gradient(135deg, #fff0e6 0%, #ffe0cc 100%)"
        }
    ];

    const cardsToShow = cards.length > 0 ? cards : defaultCards;

    const minSwipeDistance = 80; // Increased for better control

    // Check if we're on the last card and show scroll message
    useEffect(() => {
        if (currentCardIndex === cardsToShow.length - 1) {
            const timer = setTimeout(() => {
                setAllowScrolling(true);
                // Show birthday surprise after 1 second (removed scroll message delay)
                setTimeout(() => {
                    setShowBirthdaySurprise(true);
                }, 1000);
            }, 1000); // Show birthday surprise 2 seconds after reaching last card

            return () => clearTimeout(timer);
        } else {
            setShowScrollMessage(false);
            setAllowScrolling(false);
            setShowBirthdaySurprise(false);
        }
    }, [currentCardIndex, cardsToShow.length]);

    // Enable/disable body scroll
    useEffect(() => {
        if (allowScrolling) {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
            document.documentElement.style.overflow = 'auto';
            document.documentElement.style.height = 'auto';
            // Also update the root element
            const root = document.getElementById('root');
            if (root) {
                root.style.overflow = 'auto';
                root.style.height = 'auto';
            }
        } else {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.height = '100vh';
            const root = document.getElementById('root');
            if (root) {
                root.style.overflow = 'hidden';
                root.style.height = '100vh';
            }
        }

        return () => {
            // Clean up - allow scrolling
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
            document.documentElement.style.overflow = 'auto';
            document.documentElement.style.height = 'auto';
            const root = document.getElementById('root');
            if (root) {
                root.style.overflow = 'auto';
                root.style.height = 'auto';
            }
        };
    }, [allowScrolling]);

    // Handle birthday content timing and cake animation
    useEffect(() => {
        if (showBirthdaySurprise) {
            // After 4 seconds, start hiding birthday content and show cake
            const timer = setTimeout(() => {
                setHideBirthdayContent(true);
                // Show cake immediately after content fades out
                setTimeout(() => {
                    setShowCakeAnimation(true);
                }, 500); // Wait for fade out animation
            }, 4000); // Show birthday content for 4 seconds

            return () => clearTimeout(timer);
        }
    }, [showBirthdaySurprise]);

    // Global event listeners for knife dragging
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging && showCakeAnimation && !isCakeCut) {
                handleKnifeMove(e);
            }
        };

        const handleGlobalMouseUp = (e) => {
            if (isDragging && showCakeAnimation && !isCakeCut) {
                handleKnifeEnd(e);
            }
        };

        const handleGlobalTouchMove = (e) => {
            if (isDragging && showCakeAnimation && !isCakeCut) {
                handleKnifeMove(e);
            }
        };

        const handleGlobalTouchEnd = (e) => {
            if (isDragging && showCakeAnimation && !isCakeCut) {
                handleKnifeEnd(e);
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.addEventListener('touchmove', handleGlobalTouchMove);
            document.addEventListener('touchend', handleGlobalTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('touchmove', handleGlobalTouchMove);
            document.removeEventListener('touchend', handleGlobalTouchEnd);
        };
    }, [isDragging, showCakeAnimation, isCakeCut]);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setTouchStartY(e.targetTouches[0].clientY);
        setIsCardDragging(true);
        setSwipeOffset(0);
        setIsVerticalScroll(false);
    };

    const onTouchMove = (e) => {
        if (!touchStart || !touchStartY) return;

        const currentTouchX = e.targetTouches[0].clientX;
        const currentTouchY = e.targetTouches[0].clientY;
        const diffX = currentTouchX - touchStart;
        const diffY = currentTouchY - touchStartY;

        // Determine if this is a vertical scroll or horizontal swipe
        if (!isVerticalScroll && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
            setIsVerticalScroll(true);
            setIsCardDragging(false);
            setSwipeOffset(0);
            return; // Allow default scroll behavior
        }

        // Only handle horizontal swipes if not vertical scrolling
        if (!isVerticalScroll && Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault(); // Prevent scrolling for horizontal swipes

            // Limit the swipe offset to prevent excessive movement
            const maxOffset = 100;
            const limitedOffset = Math.max(-maxOffset, Math.min(maxOffset, diffX));

            setSwipeOffset(limitedOffset);
            setTouchEnd(currentTouchX);
        }
    };

    const onTouchEnd = () => {
        if (isVerticalScroll) {
            resetSwipe();
            return; // Don't handle swipe logic for vertical scrolls
        }

        if (!touchStart || !touchEnd) {
            resetSwipe();
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentCardIndex < cardsToShow.length - 1) {
            // Only allow left swipe if not on last card
            handleSwipeLeft();
        } else if (isRightSwipe) {
            handleSwipeRight();
        } else {
            // Snap back if swipe wasn't far enough or on last card
            resetSwipe();
        }
    };

    const resetSwipe = () => {
        setIsCardDragging(false);
        setSwipeOffset(0);
        setTouchStart(null);
        setTouchEnd(null);
        setTouchStartY(null);
        setIsVerticalScroll(false);
    };

    const handleSwipeLeft = () => {
        if (isAnimating) return;

        // Disable swipe left on the last card
        if (currentCardIndex === cardsToShow.length - 1) {
            return;
        }

        setIsAnimating(true);
        resetSwipe();

        setTimeout(() => {
            if (currentCardIndex < cardsToShow.length - 1) {
                setCurrentCardIndex(currentCardIndex + 1);
            }
            setIsAnimating(false);
        }, 300);
    };

    const handleSwipeRight = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        resetSwipe();

        setTimeout(() => {
            if (currentCardIndex > 0) {
                setCurrentCardIndex(currentCardIndex - 1);
            } else {
                setCurrentCardIndex(cardsToShow.length - 1); // Loop to last card
            }
            setIsAnimating(false);
        }, 300);
    };

    const handleMouseDown = (e) => {
        setTouchStart(e.clientX);
        setIsCardDragging(true);
        setSwipeOffset(0);
    };

    const handleMouseMove = (e) => {
        if (!touchStart || !isCardDragging) return;

        const diff = e.clientX - touchStart;
        const maxOffset = 100;
        const limitedOffset = Math.max(-maxOffset, Math.min(maxOffset, diff));

        setSwipeOffset(limitedOffset);
        setTouchEnd(e.clientX);
    };

    const handleMouseUp = () => {
        if (!touchStart || !touchEnd) {
            resetSwipe();
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentCardIndex < cardsToShow.length - 1) {
            // Only allow left swipe if not on last card
            handleSwipeLeft();
        } else if (isRightSwipe) {
            handleSwipeRight();
        } else {
            resetSwipe();
        }
    };

    const handleKnifeStart = (e) => {
        console.log('handleKnifeStart called!', e.type);
        if (isCakeCut) return;
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        setIsDragging(true);
        
        // Get the starting Y position
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        startY.current = clientY;
        
        console.log('Knife drag started at:', clientY);
    };

    const handleSimpleClick = () => {
        console.log('Simple click handler worked!');
        alert('Knife clicked! Events are working.');
    };

    const handleKnifeMove = (e) => {
        if (!isDragging || isCakeCut) return;
        e.preventDefault();
        e.stopPropagation();
        
        // Get current Y position
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        const delta = clientY - startY.current;
        const maxCut = 150; // Much smaller distance for easier mobile cutting
        const newKnifeY = Math.max(0, Math.min(maxCut, delta));
        const newProgress = (newKnifeY / maxCut) * 100;
        
        setKnifeY(newKnifeY);
        setCutProgress(newProgress);
        
        console.log('Cutting progress:', newProgress, 'Knife Y:', newKnifeY);
    };

    const handleKnifeEnd = (e) => {
        if (!isDragging) return;
        e?.preventDefault();
        e?.stopPropagation();
        setIsDragging(false);

        console.log('Knife drag ended. Progress:', cutProgress);

        if (cutProgress >= 40) { // Much easier threshold for mobile (40% instead of 70%)
            setIsCakeCut(true);
            
            // Create sparkles
            const newSparkles = Array.from({ length: 40 }, (_, i) => ({
                id: i,
                left: `${35 + Math.random() * 30}%`,
                top: `${25 + Math.random() * 50}%`,
                delay: `${Math.random() * 0.5}s`,
            }));
            setSparkles(newSparkles);
            
            setTimeout(() => setSparkles([]), 3000);
        } else {
            // Reset if not cut enough
            setKnifeY(0);
            setCutProgress(0);
        }
    };

    return (
        <div className={`swipe-cards-container ${allowScrolling ? 'scrollable' : ''}`}>
            {/* Cards Section */}
            <div className={`cards-section ${showBirthdaySurprise ? 'hidden' : ''}`}>
                <div className="swipe-instruction">
                    <p>💕 Swipe or drag the cards left/right 💕</p>
                </div>

                <div className="card-wrapper">
                    <div
                        ref={cardRef}
                        className={`love-card ${isAnimating ? 'swiping-left' : ''} ${isCardDragging ? 'dragging' : ''}`}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                            background: cardsToShow[currentCardIndex].background,
                            cursor: isCardDragging ? 'grabbing' : 'grab',
                            transform: `translateX(${swipeOffset}px) ${isCardDragging ? 'scale(0.98)' : 'scale(1)'}`,
                            transition: isCardDragging ? 'none' : 'transform 0.3s ease'
                        }}
                    >
                        <div className="card-emoji">
                            {cardsToShow[currentCardIndex].emoji}
                        </div>
                        <h2 className="card-title">
                            {cardsToShow[currentCardIndex].title}
                        </h2>
                        <p className="card-content">
                            {cardsToShow[currentCardIndex].content}
                        </p>
                    </div>
                </div>

                <div className="card-indicators">
                    {cardsToShow.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator ${index === currentCardIndex ? 'active' : ''}`}
                            onClick={() => setCurrentCardIndex(index)}
                        />
                    ))}
                </div>

                <div className="card-counter">
                    {currentCardIndex + 1} of {cardsToShow.length}
                </div>

                <div className="navigation-buttons">
                    <button
                        onClick={handleSwipeRight}
                        className="nav-btn prev-btn"
                        disabled={isAnimating}
                    >
                        ❮
                    </button>
                    <button
                        onClick={handleSwipeLeft}
                        className="nav-btn next-btn"
                        disabled={isAnimating || currentCardIndex === cardsToShow.length - 1}
                    >
                        ❯
                    </button>
                </div>
            </div>

            {/* Birthday Surprise Section */}
            {showBirthdaySurprise && (
                <div className="birthday-surprise-section">
                    <div className="birthday-header-top">
                        <h1>🎉 Happy Birthday! 🎉</h1>
                    </div>

                    <div className="birthday-content-area">
                        {/* Birthday message content that will vanish */}
                        <div className={`birthday-message-content ${hideBirthdayContent ? 'vanishing' : ''}`}>
                            <div className="birthday-message">
                                <div className="birthday-emoji text-6xl mb-4 animate-bounce">🎂</div>

                                <h2 className="text-3xl font-bold text-pink-600 mb-2">
                                    Happy Birthday, <span className="text-rose-500">Shivani! 💖</span>
                                </h2>

                                <p className="text-gray-700 mb-6 text-lg">
                                    Wishing you a day as bright, beautiful, and inspiring as you are!
                                    May your heart be filled with laughter, joy, and countless smiles today and always ✨
                                </p>

                                <div className="birthday-wishes space-y-2 text-base font-medium text-gray-800">
                                    <div className="wish">🌟 May your dreams take flight and shine brighter than ever</div>
                                    <div className="wish">💐 Surrounded by people who make you feel truly loved</div>
                                    <div className="wish">🎁 Filled with sweet surprises and endless smiles</div>
                                    <div className="wish">🌈 A new chapter full of magic, success, and adventure awaits</div>
                                </div>

                                <div className="mt-6 text-2xl animate-pulse">🎉 You deserve the world, Shivani! 🎉</div>
                            </div>
                        </div>

                        {/* Drag-to-Cut Cake */}
                        {showCakeAnimation && (
                            <div 
                                className="cake-cutting-container"
                                onMouseMove={handleKnifeMove}
                                onMouseUp={handleKnifeEnd}
                                onMouseLeave={handleKnifeEnd}
                                onTouchMove={handleKnifeMove}
                                onTouchEnd={handleKnifeEnd}
                            >
                                {/* Sparkles */}
                                {sparkles.map((s) => (
                                    <div
                                        key={s.id}
                                        className="sparkle"
                                        style={{
                                            left: s.left,
                                            top: s.top,
                                            animationDelay: s.delay,
                                        }}
                                    >
                                        ✨
                                    </div>
                                ))}

                                {/* Instruction */}
                                {!isCakeCut && cutProgress < 10 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-120px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        textAlign: 'center',
                                        zIndex: 1000,
                                        width: '400px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        padding: '15px 20px',
                                        borderRadius: '15px',
                                        border: '3px solid #ff6b9d',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                                    }}>
                                        <p style={{
                                            fontSize: '1.3rem',
                                            fontWeight: 'bold',
                                            color: '#ff6b9d',
                                            margin: '0',
                                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            🎂 Drag the knife down to cut the cake and celebrate! 🎉
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            marginTop: '10px'
                                        }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#ff6b9d',
                                                animation: 'dot-pulse 1.4s ease-in-out infinite'
                                            }}></div>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#ff6b9d',
                                                animation: 'dot-pulse 1.4s ease-in-out infinite',
                                                animationDelay: '0.2s'
                                            }}></div>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#ff6b9d',
                                                animation: 'dot-pulse 1.4s ease-in-out infinite',
                                                animationDelay: '0.4s'
                                            }}></div>
                                        </div>
                                    </div>
                                )}

                                {/* Celebration message when cutting */}
                                {!isCakeCut && cutProgress >= 10 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-80px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        textAlign: 'center',
                                        zIndex: 1000,
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        padding: '10px 20px',
                                        borderRadius: '10px',
                                        border: '2px solid #ff6b9d'
                                    }}>
                                        <p style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            color: '#ff6b9d',
                                            margin: '0'
                                        }}>
                                            🎊 Keep going! Almost there! 🎊
                                        </p>
                                    </div>
                                )}

                                {/* Cake */}
                                <div className="cake-wrapper">
                                    {/* Knife positioned within cake wrapper */}
                                    {!isCakeCut && (
                                        <div
                                            className={`knife ${isDragging ? 'dragging' : ''}`}
                                            style={{
                                                position: 'absolute',
                                                top: '-80px', // Start above the cake
                                                left: '50%',
                                                transform: `translateX(-50%) translateY(${knifeY}px) scale(${isDragging ? 1.15 : 1})`,
                                                cursor: 'grab',
                                                zIndex: 1000,
                                                background: isDragging ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                                border: '3px dashed rgba(255, 107, 157, 0.6)',
                                                borderRadius: '15px',
                                                padding: '20px', // Larger padding for easier touch
                                                width: '120px', // Even larger touch area
                                                height: '140px', // Even larger touch area
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: isDragging ? '0 8px 25px rgba(255, 107, 157, 0.4)' : '0 4px 15px rgba(255, 107, 157, 0.2)',
                                                transition: 'all 0.2s ease',
                                                touchAction: 'none', // Prevent scrolling during touch
                                                userSelect: 'none', // Prevent text selection
                                                WebkitUserSelect: 'none',
                                                WebkitTouchCallout: 'none'
                                            }}
                                            onClick={handleSimpleClick}
                                            onMouseDown={handleKnifeStart}
                                            onTouchStart={handleKnifeStart}
                                        >
                                            <div style={{
                                                fontSize: '40px', 
                                                textAlign: 'center', 
                                                lineHeight: '1',
                                                filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))',
                                                marginBottom: '5px'
                                            }}>🔪</div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#ff6b9d',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                                            }}>
                                                DRAG DOWN
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Cake Top Half */}
                                    <div 
                                        className={`cake-top-half ${isCakeCut ? 'cut-separated' : ''}`}
                                    >
                                        {/* Candle */}
                                        <div className="candle">
                                            <div className="candle-stick"></div>
                                            <div className="flame">
                                                <div className="flame-outer"></div>
                                                <div className="flame-inner"></div>
                                            </div>
                                        </div>

                                        {/* Top layer - Frosting */}
                                        <div className="frosting-top">
                                            <div className="shimmer-effect"></div>
                                            {/* Decorative dots */}
                                            {[...Array(8)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="decoration-dot"
                                                    style={{
                                                        left: `${15 + i * 10}%`,
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Cake body */}
                                        <div className="cake-body">
                                            <div className="cake-texture"></div>
                                            {/* Cut line */}
                                            {cutProgress > 0 && !isCakeCut && (
                                                <div 
                                                    className="cut-line"
                                                    style={{ 
                                                        height: `${cutProgress * 1.5}px`,
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Bottom edge */}
                                        <div className="cake-bottom"></div>
                                    </div>

                                    {/* Cake Bottom Half */}
                                    <div 
                                        className={`cake-bottom-half ${isCakeCut ? 'cut-separated' : ''}`}
                                    >
                                        <div className="frosting-top">
                                            <div className="shimmer-effect"></div>
                                        </div>
                                        <div className="cake-body">
                                            <div className="cake-texture"></div>
                                        </div>
                                        <div className="cake-bottom"></div>
                                    </div>

                                    {/* Revealed Message Inside */}
                                    {isCakeCut && (
                                        <div className="revealed-message">
                                            <div className="message-emoji">🎊</div>
                                            <h3 className="message-title">
                                                You’re the real dessert tonight.!
                                            </h3>
                                            <p className="message-subtitle">🎂✨🎉</p>
                                        </div>
                                    )}
                                </div>

                                {/* Cake plate */}
                                <div className="cake-plate"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Below Content Section */}
            {allowScrolling && !showBirthdaySurprise && (
                <div className="below-content-section">
                    <div className="romantic-ending">
                        <div className="ending-emoji">💖</div>
                        <h1>Our Love Story Continues...</h1>
                        <p>Every moment with you is a new chapter in our beautiful love story.</p>

                        <div className="love-quotes">
                            <div className="quote">
                                <p>"You are my sun, my moon, and all my stars."</p>
                                <span>- E.E. Cummings</span>
                            </div>

                            <div className="quote">
                                <p>"In all the world, there is no heart for me like yours."</p>
                                <span>- Maya Angelou</span>
                            </div>

                            <div className="quote">
                                <p>"Being deeply loved by someone gives you strength, while loving someone deeply gives you courage."</p>
                                <span>- Lao Tzu</span>
                            </div>
                        </div>

                        <div className="final-message">
                            <h2>Thank you for being my everything 💕</h2>
                            <p>I love you more than words could ever express.</p>
                            <div className="hearts">💕 💖 💕 💖 💕</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SwipeCards;