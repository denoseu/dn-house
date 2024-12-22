import React, { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";

const RefreshIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9-9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const Wrapped = () => {
  const images = Array.from({ length: 12 }, (_, i) => `/images/${i + 1}.png`);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [showReplay, setShowReplay] = useState(false);
  const slideDuration = 5000;

  const resetProgress = useCallback(() => {
    setProgress(0);
  }, []);

  const handleNext = useCallback(() => {
    resetProgress();
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % images.length;
      if (nextIndex === 0) {
        setShowReplay(true);
      }
      return nextIndex;
    });
  }, [resetProgress, images.length]);

  const handlePrevious = useCallback(() => {
    resetProgress();
    setCurrentIndex((prev) => {
      const nextIndex = (prev - 1 + images.length) % images.length;
      setShowReplay(false);
      return nextIndex;
    });
  }, [resetProgress, images.length]);

  const handleReplay = useCallback(() => {
    setCurrentIndex(0);
    setProgress(0);
    setShowReplay(false);
  }, []);

  useEffect(() => {
    if (isPaused || showReplay) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / (slideDuration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, handleNext, slideDuration, showReplay]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const handleTouchStart = (e) => {
    setTouchStartTime(Date.now());
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const touchDuration = Date.now() - touchStartTime;
    setIsPaused(false);
    
    if (touchDuration < 200) {
      const touchX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const isRightSide = touchX > rect.left + rect.width / 2;
      
      if (isRightSide) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div 
        className="relative w-full h-full max-h-screen bg-black overflow-hidden"
        {...swipeHandlers}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        {/* Progress Bar */}
        <div className="absolute top-safe left-4 right-4 flex gap-1 z-20 pt-4">
          {images.map((_, index) => (
            <div 
              key={index}
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/30"
            >
              <div
                className={`h-full bg-white transition-all duration-200 rounded-full ${
                  index < currentIndex ? 'w-full' :
                  index === currentIndex ? '' : 'w-0'
                }`}
                style={{
                  width: index === currentIndex ? `${progress}%` : undefined,
                  transition: isPaused && index === currentIndex ? 'none' : 'width 0.1s linear'
                }}
              />
            </div>
          ))}
        </div>

        {/* current image */}
        <div className="relative w-full h-full">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* TOUUCHCH */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/2 h-full" />
          <div className="w-1/2 h-full" />
        </div>

        {/* replay button*/}
        {showReplay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
            <button
              onClick={handleReplay}
              className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-lg transition-all"
            >
              <RefreshIcon />
              Reply Wrapped
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wrapped;