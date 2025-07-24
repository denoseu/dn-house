import React, { useState, useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import Navbar from "../components/Navbar";
import Postcard from "../components/Postcard";
import Polaroid from "../components/Polaroid";
import { fetchPhotos } from "../api/photos";

const MenuPage = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [items, setItems] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [{ x, y, scale }, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }));
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [errorPhotos, setErrorPhotos] = useState(null);
  
  // Constants for dimensions and boundary
  const POSTCARD_WIDTH = 500;
  const POSTCARD_HEIGHT = 350;
  const POLAROID_WIDTH = 300;
  const POLAROID_HEIGHT = 350;
  const BOUNDARY_PADDING = 50;
  const AREA_WIDTH = 3500;
  const AREA_HEIGHT = 3000;
  const OVERLAP_BUFFER = 25;
  const NAVBAR_HEIGHT = 64;
  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 3.0;
  const ZOOM_STEP = 0.2;
  
  // Get current zoom level for display
  const zoomDisplay = scale.to(s => Math.round(s * 100));

  // Zoom utility functions
  const zoomToScale = (newScale, centerX = null, centerY = null) => {
    const currentScale = scale.get();
    const currentX = x.get();
    const currentY = y.get();
    
    // Constrain the scale
    const constrainedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newScale));
    
    // Use container center if no specific center point provided
    const zoomCenterX = centerX !== null ? centerX : containerSize.width / 2;
    const zoomCenterY = centerY !== null ? centerY : containerSize.height / 2;
    
    // Calculate the point in the original content that's under the zoom center
    const contentPointX = (zoomCenterX - currentX) / currentScale;
    const contentPointY = (zoomCenterY - currentY) / currentScale;
    
    // Calculate the new position after scaling
    const newX = zoomCenterX - contentPointX * constrainedScale;
    const newY = zoomCenterY - contentPointY * constrainedScale;
    
    // Apply boundaries
    const minX = containerSize.width - AREA_WIDTH * constrainedScale;
    const maxX = 0;
    const minY = containerSize.height - AREA_HEIGHT * constrainedScale;
    const maxY = 0;
    
    const constrainedX = Math.min(maxX, Math.max(minX, newX));
    const constrainedY = Math.min(maxY, Math.max(minY, newY));
    
    api.start({ 
      x: constrainedX, 
      y: constrainedY, 
      scale: constrainedScale 
    });
  };

  const handleZoomIn = () => {
    const currentScale = scale.get();
    zoomToScale(currentScale + ZOOM_STEP);
  };

  const handleZoomOut = () => {
    const currentScale = scale.get();
    zoomToScale(currentScale - ZOOM_STEP);
  };

  const handleResetZoom = () => {
    // Reset to original centered position
    api.start({
      x: (containerSize.width - AREA_WIDTH) / 2,
      y: (containerSize.height - AREA_HEIGHT) / 2,
      scale: 1
    });
  };

  const handleFitToScreen = () => {
    // Calculate scale to fit the entire area in the viewport
    const scaleX = containerSize.width / AREA_WIDTH;
    const scaleY = containerSize.height / AREA_HEIGHT;
    const fitScale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding
    
    const constrainedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, fitScale));
    
    // Center the content
    const newX = (containerSize.width - AREA_WIDTH * constrainedScale) / 2;
    const newY = (containerSize.height - AREA_HEIGHT * constrainedScale) / 2;
    
    api.start({
      x: newX,
      y: newY,
      scale: constrainedScale
    });
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: window.innerWidth,
          height: window.innerHeight - NAVBAR_HEIGHT
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch photos from backend
  useEffect(() => {
    let ignore = false;
    setLoadingPhotos(true);
    fetchPhotos()
      .then(data => {
        if (!ignore) {
          console.log("Fetched photos from API:", data);
          setPhotos(Array.isArray(data.photos) ? data.photos : []);
          setLoadingPhotos(false);
        }
      })
      .catch(err => {
        if (!ignore) {
          console.error("Error fetch foto:", err);
          setErrorPhotos(err.message || "Failed to load photos");
          setLoadingPhotos(false);
        }
      });
    return () => { ignore = true; };
  }, []);

  // Generate positions for backend photos
  useEffect(() => {
    console.log("Photos loaded:", photos);
    if (
      containerSize.width > 0 &&
      containerSize.height > 0 &&
      photos.length > 0
    ) {
      const used = [];
      const getRandomPos = (type) => {
        const width = type === "postcard" ? POSTCARD_WIDTH : POLAROID_WIDTH;
        const height = type === "postcard" ? POSTCARD_HEIGHT : POLAROID_HEIGHT;
        let x, y, tries = 0;
        do {
          x = BOUNDARY_PADDING + Math.random() * (AREA_WIDTH - width - 2 * BOUNDARY_PADDING);
          y = BOUNDARY_PADDING + Math.random() * (AREA_HEIGHT - height - 2 * BOUNDARY_PADDING);
          tries++;
        } while (
          used.some(
            (pos) =>
              Math.abs(pos.x - x) < width &&
              Math.abs(pos.y - y) < height
          ) && tries < 50
        );
        used.push({ x, y });
        return { x, y };
      };

      const mapped = photos.map((photo, i) => {
        const type = photo.type || "postcard";
        const { x, y } = getRandomPos(type);
        return {
          id: photo._id || i,
          type,
          imageSrc: photo.url || "/images/demo.jpg",
          text: photo.caption || "",
          stampNumber: (i % 10) + 1,
          x,
          y,
          rotation: Math.random() * 40 - 20,
        };
      });

      console.log("Mapped photos with positions:", mapped);
      setItems(mapped);
      
      // Center the view initially
      api.start({
        x: (containerSize.width - AREA_WIDTH) / 2,
        y: (containerSize.height - AREA_HEIGHT) / 2,
        scale: 1,
      });
    }
  }, [containerSize, photos, api]);

  // Combined gesture handler for both drag and pinch (zoom)
  const bind = useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        const currentScale = scale.get();
        
        const minX = containerSize.width - AREA_WIDTH * currentScale;
        const maxX = 0;
        const minY = containerSize.height - AREA_HEIGHT * currentScale;
        const maxY = 0;
        
        const constrainedX = Math.min(maxX, Math.max(minX, dx));
        const constrainedY = Math.min(maxY, Math.max(minY, dy));
        
        api.start({ 
          x: constrainedX, 
          y: constrainedY
        });
      },
      
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();
        
        const currentScale = scale.get();
        const currentX = x.get();
        const currentY = y.get();
        
        const zoomFactor = -dy * 0.01;
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentScale * (1 + zoomFactor)));
        
        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;
        
        const contentPointX = (cursorX - currentX) / currentScale;
        const contentPointY = (cursorY - currentY) / currentScale;
        
        const newX = cursorX - contentPointX * newScale;
        const newY = cursorY - contentPointY * newScale;
        
        // Apply boundaries
        const minX = containerSize.width - AREA_WIDTH * newScale;
        const maxX = 0;
        const minY = containerSize.height - AREA_HEIGHT * newScale;
        const maxY = 0;
        
        const constrainedX = Math.min(maxX, Math.max(minX, newX));
        const constrainedY = Math.min(maxY, Math.max(minY, newY));
        
        api.start({ 
          x: constrainedX, 
          y: constrainedY, 
          scale: newScale 
        });
      },
      
      onPinch: ({ offset: [d], origin: [ox, oy], first, last, memo }) => {
        if (first) {
          return { 
            initialScale: scale.get(), 
            initialX: x.get(), 
            initialY: y.get() 
          };
        }
        
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, memo.initialScale * d / 100));
        
        const rect = containerRef.current.getBoundingClientRect();
        const containerX = ox - rect.left;
        const containerY = oy - rect.top;
        
        const contentPointX = (containerX - memo.initialX) / memo.initialScale;
        const contentPointY = (containerY - memo.initialY) / memo.initialScale;
        
        const newX = containerX - contentPointX * newScale;
        const newY = containerY - contentPointY * newScale;
        
        // Apply boundaries
        const minX = containerSize.width - AREA_WIDTH * newScale;
        const maxX = 0;
        const minY = containerSize.height - AREA_HEIGHT * newScale;
        const maxY = 0;
        
        const constrainedX = Math.min(maxX, Math.max(minX, newX));
        const constrainedY = Math.min(maxY, Math.max(minY, newY));
        
        api.start({ 
          x: constrainedX, 
          y: constrainedY, 
          scale: newScale
        });
        
        return memo;
      }
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        rubberband: true
      },
      pinch: {
        from: () => [scale.get() * 100, 0],
        rubberband: true,
        preventDefault: true
      },
      wheel: {
        preventDefault: true
      }
    }
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-50">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      >
        <animated.div
          {...bind()}
          className="absolute origin-top-left cursor-grab active:cursor-grabbing"
          style={{ 
            width: AREA_WIDTH,
            height: AREA_HEIGHT,
            x,
            y,
            scale,
            touchAction: 'none'
          }}
        >
          {!loadingPhotos && !errorPhotos && items.length > 0 && items.map(({ id, type, imageSrc, text, stampNumber, x, y, rotation }) => (
            <div
              key={id}
              className="absolute cursor-pointer hover:z-20 group"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-out',
              }}
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                {type === 'postcard' ? (
                  <Postcard 
                    imageSrc={imageSrc} 
                    text={text} 
                    stampNumber={stampNumber} 
                  />
                ) : (
                  <Polaroid
                    imageSrc={imageSrc}
                    text={text}
                    stampNumber={stampNumber}
                  />
                )}
              </div>
            </div>
          ))}
          
          {((errorPhotos || items.length === 0) && !loadingPhotos) && (
            <div className="text-center text-gray-500 font-louis mt-10">
              Failed to load photos from backend. Showing nothing or you can uncomment dummy generator.
            </div>
          )}
        </animated.div>
        
        {/* Enhanced Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleZoomIn}
              disabled={scale.get() >= MAX_ZOOM}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-200"
              title="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              disabled={scale.get() <= MIN_ZOOM}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleResetZoom}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
              title="Reset Zoom (100%)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={handleFitToScreen}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              title="Fit to Screen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Enhanced Info Panel */}
        <div className="absolute bottom-12 right-6 bg-white p-3 rounded-lg shadow-lg opacity-90 hover:opacity-100 transition-opacity z-40">
          <div className="text-sm text-gray-600 font-louis space-y-1">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
              Click and drag to explore
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Scroll or pinch to zoom
            </p>
            <p className="flex items-center gap-2 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Zoom: <animated.span>{zoomDisplay}</animated.span>%
            </p>
          </div>
        </div>
        
        {/* Loading indicator */}
        {loadingPhotos && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-30">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600 font-louis">Loading photos...</p>
            </div>
          </div>
        )}
        
        {/* Welcome Popup */}
        {showWelcomePopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50" 
              onClick={() => setShowWelcomePopup(false)}
            ></div>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 relative z-10 transform transition-all">
              <h2 className="text-2xl font-louis font-bold mb-3 text-gray-800 text-center">Hey there!</h2>
              <p className="text-gray-600 font-louis mb-6">
                Densoup & Nopasoup have ventured through a world of flavors, and now it&apos;s your turn! Scroll through their delicious discoveries—who knows, your next favorite bite might be waiting for you!
              </p>
              <div className="flex justify-center">
                <div 
                  className="relative cursor-pointer transition-transform duration-300"
                  style={{ transform: isButtonHovered ? 'scale(1.1)' : 'scale(1)' }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  onClick={() => setShowWelcomePopup(false)}
                >
                  <img 
                    src={isButtonHovered ? "/images/photo/explore.svg" : "/images/photo/explore.svg"} 
                    alt="Let's Explore" 
                    className="w-40" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;