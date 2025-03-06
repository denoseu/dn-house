import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 

const NotFoundPage = () => {
  // Container variant for staggered animations
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3, 
      }
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  const fadeZoom = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };
  
  const fadeRight = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };
  
  const fadeLeft = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };
  
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <title>404</title>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <motion.div 
          className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center md:max-w-lg space-y-6 flex flex-col items-center">
            <motion.img 
                src="/images/404/404.webp" 
                alt="404 Number" 
                className="max-w-full md:max-w-lg mx-auto"
                variants={fadeZoom}
            />

            <motion.h1 
              className="text-4xl font-bold font-louis text-gray-800"
              variants={fadeRight}
            >
                Oaoa! Oaa aoaooooa!
            </motion.h1>

            <motion.p 
              className="text-lg text-gray-600 font-louis max-w-lg"
              variants={fadeIn}
            >
                Bipbop has searched through 192913912010320132013131 websites, but this page is nowhere to be found.
            </motion.p>

            <motion.div variants={fadeRight}>
              <Link 
                  to="/" 
                  className="inline-block relative"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
              >
                  <img 
                  src={isHovering ? "/images/404/home.webp" : "/images/404/home.webp"} 
                  alt="Return Home" 
                  className={`w-56 md:w-64 h-auto transition-transform duration-300 ${
                      isHovering ? 'scale-105' : 'scale-100'
                  }`}
                  />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            className="flex flex-1 items-center justify-center h-full"
            variants={fadeLeft}
          >
            <img 
              src="/images/404/bipbop-404.webp" 
              alt="404" 
              className="max-w-full md:max-w-xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;