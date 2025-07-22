import React, { useState, useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import Navbar from "../components/Navbar";
import Postcard from "../components/Postcard";
import Polaroid from "../components/Polaroid";
import { fetchPhotos } from "../api/photos"; // tambahkan import

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
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2.0;
  
  // Get current zoom level for display
  const zoomDisplay = scale.to(s => Math.round(s * 100));

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
          // log
          console.log("Fetched photos from API:", data);
          setPhotos(Array.isArray(data.photos) ? data.photos : []);
          setLoadingPhotos(false);
        }
      })
      .catch(err => {
        if (!ignore) {
          // log
          console.error("Error fetch foto:", err);

          setErrorPhotos(err.message || "Failed to load photos");
          setLoadingPhotos(false);
        }
      });
    return () => { ignore = true; };
  }, []);

  // // Generate postcards and polaroids with non-overlapping positions
  // useEffect(() => {
  //   if (containerSize.width > 0 && containerSize.height > 0) {
  //     const mixedItems = generateNonOverlappingItems(30);
  //     setItems(mixedItems);
      
  //     // Center the view initially
  //     api.start({ 
  //       x: (containerSize.width - AREA_WIDTH) / 2,
  //       y: (containerSize.height - AREA_HEIGHT) / 2,
  //       scale: 1
  //     });
  //   }
  // }, [containerSize, api]);

  // Generate positions for backend photos
  useEffect(() => {
    // log photos
    console.log("Photos loaded:", photos);
    if (
      containerSize.width > 0 &&
      containerSize.height > 0 &&
      photos.length > 0
    ) {
      // Generate random positions for each photo (tidak overlap, simple version)
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
        const type = Math.random() < 0.5 ? "postcard" : "polaroid";
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
      // log mapped
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
        // Get current zoom level
        const currentScale = scale.get();
        
        // Calculate boundaries, adjusted for zoom
        const minX = containerSize.width - AREA_WIDTH * currentScale;
        const maxX = 0;
        const minY = containerSize.height - AREA_HEIGHT * currentScale;
        const maxY = 0;
        
        // Constrain the drag within boundaries
        const constrainedX = Math.min(maxX, Math.max(minX, dx));
        const constrainedY = Math.min(maxY, Math.max(minY, dy));
        
        api.start({ 
          x: constrainedX, 
          y: constrainedY
        });
      },
      
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();
        
        // Get current values
        const currentScale = scale.get();
        const currentX = x.get();
        const currentY = y.get();
        
        // Calculate new scale (invert direction for more intuitive zoom)
        const zoomFactor = -dy * 0.01; // Increased sensitivity
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentScale * (1 + zoomFactor)));
        
        // Calculate cursor position relative to container
        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;
        
        // Calculate the point in the original content that's under the cursor
        const contentPointX = (cursorX - currentX) / currentScale;
        const contentPointY = (cursorY - currentY) / currentScale;
        
        // Calculate the new position after scaling
        const newX = cursorX - contentPointX * newScale;
        const newY = cursorY - contentPointY * newScale;
        
        // Apply the new position and scale
        api.start({ 
          x: newX, 
          y: newY, 
          scale: newScale 
        });
      },
      
      onPinch: ({ offset: [d], origin: [ox, oy], first, last, memo }) => {
        if (first) {
          // Store initial values when pinch starts
          return { 
            initialScale: scale.get(), 
            initialX: x.get(), 
            initialY: y.get() 
          };
        }
        
        // Calculate new scale from pinch distance
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, memo.initialScale * d / 100));
        
        // Get origin position relative to container
        const rect = containerRef.current.getBoundingClientRect();
        const containerX = ox - rect.left;
        const containerY = oy - rect.top;
        
        // Calculate the point in the original content that's under the pinch center
        const contentPointX = (containerX - memo.initialX) / memo.initialScale;
        const contentPointY = (containerY - memo.initialY) / memo.initialScale;
        
        // Calculate the new position after scaling
        const newX = containerX - contentPointX * newScale;
        const newY = containerY - contentPointY * newScale;
        
        // Apply the new position and scale
        api.start({ 
          x: newX, 
          y: newY, 
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
      
      {/* container for the draggable area */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      >
        {/* draggable and zoomable container for postcards and polaroids */}
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
          {/* Render backend photos */}
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
          {/* Jika gagal fetch, fallback ke dummy */}
          {((errorPhotos || items.length === 0) && !loadingPhotos) && (
            <div className="text-center text-gray-500 font-louis mt-10">
              Failed to load photos from backend. Showing nothing or you can uncomment dummy generator.
            </div>
          )}
        </animated.div>
        
        <div className="absolute bottom-12 right-4 bg-white p-2 rounded-lg opacity-70 hover:opacity-100 transition-opacity z-40">
          <div className="text-sm text-gray-600 font-louis">
            <p>Click and drag to explore</p>
            <p>Pinch or scroll to zoom</p>
            <p>Current zoom: {zoomDisplay.get()}%</p>
          </div>
        </div>
        
        {/* Popup */}
        {showWelcomePopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowWelcomePopup(false)}></div>
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