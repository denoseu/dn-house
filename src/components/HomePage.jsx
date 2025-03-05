import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

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

const HomePage = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const buttons = [
    {
      defaultImage: '/images/mailbox1.webp',
      hoverImage: '/images/mailbox2.webp',
      alt: 'mailbox',
      label: 'Letter',
      path: '/letter'
    },
    {
      defaultImage: '/images/book1.webp',
      hoverImage: '/images/book2.webp',
      alt: 'book',
      label: 'Guestbook',
      path: '/guestbook'
    },
    {
      defaultImage: '/images/spoon1.webp',
      hoverImage: '/images/spoon2.webp',
      alt: 'spoon',
      label: 'Menu',
      path: '/menu'
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-center items-center h-screen bg-gray-50"
    >
      {/* Title */}
      <motion.h1 
        variants={fadeZoom}
        className="text-4xl font-dongdong text-black text-center"
      >
        Welcome to
      </motion.h1>
      
      {/* Banner Image */}
      <motion.div 
        variants={fadeRight}
        className="w-full max-w-4xl pb-6"
      >
        <img 
          src="/images/header.webp" 
          alt="header" 
          className="w-full h-auto object-cover rounded-lg"
        />
      </motion.div>

      {/* Menu Buttons */}
      <motion.div 
        variants={fadeLeft}
        className="grid grid-cols-3 gap-6"
      >
        {buttons.map((button, index) => (
          <motion.div 
            key={index} 
            variants={fadeIn}
            className="flex flex-col items-center space-y-2"
          >
            <Link to={button.path}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-32 h-32 
                  bg-cover bg-center 
                  transition-all duration-300 
                  transform 
                  ease-in-out
                  rounded-lg
                `}
                style={{ 
                  backgroundImage: `url('${hoveredButton === index ? button.hoverImage : button.defaultImage}')` 
                }}
                onMouseEnter={() => setHoveredButton(index)}
                onMouseLeave={() => setHoveredButton(null)}
              />
            </Link>
            <motion.span 
              variants={fadeIn}
              className="text-lg font-dongdong text-black"
            >
              {button.label}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;