import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import Navbar from "../components/NavigationBar";
import Postcard from "../components/Postcard";

const MenuPage = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [postcards, setPostcards] = useState([]);
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  
  // Constants for postcard dimensions and boundary
  const POSTCARD_WIDTH = 500;
  const POSTCARD_HEIGHT = 350;
  const BOUNDARY_PADDING = 50;
  const AREA_WIDTH = 3500;
  const AREA_HEIGHT = 3000;
  const OVERLAP_BUFFER = 50;
  const NAVBAR_HEIGHT = 64; // Adjust this to match your navbar height

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: window.innerWidth,
          height: window.innerHeight - NAVBAR_HEIGHT // Account for navbar height
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Generate postcards with non-overlapping positions
  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0) {
      const postcardData = generateNonOverlappingPostcards(30);
      setPostcards(postcardData);
      
      // Center the view initially
      api.start({ 
        x: (containerSize.width - AREA_WIDTH) / 2,
        y: (containerSize.height - AREA_HEIGHT) / 2
      });
    }
  }, [containerSize, api]);

  // Function to generate non-overlapping postcards
  const generateNonOverlappingPostcards = (count) => {
    const cards = [];
    
    // sample text content
    const sampleTexts = [
      "Greetings from Paris! The Eiffel Tower is magnificent.",
      "Hello from Tokyo! Experiencing the cherry blossoms.",
      "New York City is so vibrant and full of energy!",
      "Peaceful days in Bali. The beaches are incredible.",
      "Barcelona's architecture is simply breathtaking.",
      "Enjoying the history and culture in Rome.",
      "The Northern Lights in Iceland are magical.",
      "Sydney's harbor is even more beautiful in person!",
      "Hiking through the mountains in Switzerland.",
      "The food in Thailand is absolutely delicious!"
    ];
    
    // Helper to check if a position would overlap with existing cards
    const wouldOverlap = (x, y, rotation) => {
      // Calculate the effective size considering rotation
      const rotationRad = Math.abs(rotation * Math.PI / 180);
      const effectiveWidth = POSTCARD_WIDTH * Math.cos(rotationRad) + POSTCARD_HEIGHT * Math.sin(rotationRad);
      const effectiveHeight = POSTCARD_WIDTH * Math.sin(rotationRad) + POSTCARD_HEIGHT * Math.cos(rotationRad);
      
      // Check against all existing cards
      for (const card of cards) {
        const cardRotationRad = Math.abs(card.rotation * Math.PI / 180);
        const cardEffectiveWidth = POSTCARD_WIDTH * Math.cos(cardRotationRad) + POSTCARD_HEIGHT * Math.sin(cardRotationRad);
        const cardEffectiveHeight = POSTCARD_WIDTH * Math.sin(cardRotationRad) + POSTCARD_HEIGHT * Math.cos(cardRotationRad);
        
        // Calculate centers
        const centerX1 = x + effectiveWidth / 2;
        const centerY1 = y + effectiveHeight / 2;
        const centerX2 = card.x + cardEffectiveWidth / 2;
        const centerY2 = card.y + cardEffectiveHeight / 2;
        
        // Calculate distance between centers
        const dx = Math.abs(centerX1 - centerX2);
        const dy = Math.abs(centerY1 - centerY2);
        
        // Check if centers are too close (with reduced buffer for closer packing)
        if (dx < (effectiveWidth + cardEffectiveWidth) / 2 - OVERLAP_BUFFER && 
            dy < (effectiveHeight + cardEffectiveHeight) / 2 - OVERLAP_BUFFER) {
          return true;
        }
      }
      
      return false;
    };
    
    // Try to place each postcard
    for (let i = 0; i < count; i++) {
      let x, y, rotation;
      let isValid = false;
      let attempts = 0;
      const maxAttempts = 200;
      
      while (!isValid && attempts < maxAttempts) {
        // Generate a random position within the area
        x = BOUNDARY_PADDING + Math.random() * (AREA_WIDTH - POSTCARD_WIDTH - 2 * BOUNDARY_PADDING);
        y = BOUNDARY_PADDING + Math.random() * (AREA_HEIGHT - POSTCARD_HEIGHT - 2 * BOUNDARY_PADDING);
        rotation = Math.random() * 40 - 20; // Random rotation between -20 and 20 degrees
        
        isValid = !wouldOverlap(x, y, rotation);
        attempts++;
      }
      
      if (isValid) {
        cards.push({
          id: i,
          imageSrc: "/images/demo.jpg",
          text: sampleTexts[i % sampleTexts.length],
          stampNumber: Math.floor(Math.random() * 10) + 1,
          x,
          y,
          rotation
        });
      }
    }
    
    return cards;
  };

  // Drag handler for moving the viewport
  const bind = useDrag(({ offset: [dx, dy], first, last }) => {
    // Calculate boundaries to prevent dragging too far
    const minX = containerSize.width - AREA_WIDTH - BOUNDARY_PADDING;
    const maxX = BOUNDARY_PADDING;
    const minY = containerSize.height - AREA_HEIGHT - BOUNDARY_PADDING;
    const maxY = BOUNDARY_PADDING;
    
    // Constrain the drag within boundaries
    const constrainedX = Math.min(maxX, Math.max(minX, dx));
    const constrainedY = Math.min(maxY, Math.max(minY, dy));
    
    api.start({ 
      x: constrainedX, 
      y: constrainedY,
      immediate: first || last
    });
  });

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-100">
      {/* navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      {/* container for the draggable area */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      >
        {/* draggable container for postcards */}
        <animated.div
          {...bind()}
          className="absolute"
          style={{ 
            width: AREA_WIDTH,
            height: AREA_HEIGHT,
            x,
            y,
            touchAction: 'none'
          }}
        >
          {postcards.map(({ id, imageSrc, text, stampNumber, x, y, rotation }) => (
            <div
              key={id}
              className="absolute cursor-pointer hover:z-20 group"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-out',
              }}
            >
              {/* zoom effect on hover */}
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Postcard 
                  imageSrc={imageSrc} 
                  text={text} 
                  stampNumber={stampNumber} 
                />
              </div>
            </div>
          ))}
        </animated.div>
        
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg opacity-70 hover:opacity-100 transition-opacity z-40">
          <p className="text-sm text-gray-600">Click and drag to explore</p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;