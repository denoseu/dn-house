import React, { useState } from 'react';
import { motion } from "framer-motion";

const LetterPage = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);

  // Animations
  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay } }
  });

  // Button hover and zoom animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  };

  // Reset input fields
  const handleReset = () => {
    setTo('');
    setSubject('');
    setMessage('');
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
    >
      {/* Title */}
      <motion.h1 
        variants={fadeIn(0.1)}
        className="text-4xl font-dongdong text-black text-center mt-10"
      >
        Write us a letter!
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={fadeIn(0.5)}
        className="text-xl font-dongdong text-black text-center mt-4"
      >
        This will later appear in the guestbook :)
      </motion.p>

      {/* Email Input Box */}
      <motion.div 
        variants={fadeIn(0.8)}
        className="relative w-full max-w-md sm:max-w-[800px] h-auto mt-6"
      >
        {/* Background Image */}
        <motion.img 
          src="/images/mail/input-box.svg" 
          alt="Email window"
          className="w-full h-auto"
          variants={fadeIn(0.9)}
        />

        {/* Input Fields */}
        <motion.div 
          variants={fadeIn(1.2)}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            className="absolute top-[46px] left-[23%] w-[70%] bg-transparent border-none focus:outline-none 
              text-gray-700 text-sm md:text-lg font-dongdong pointer-events-auto
              md:top-[115px] md:left-[23%] md:w-[80%]"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="absolute top-[66px] left-[33%] w-[70%] bg-transparent border-none focus:outline-none 
              text-gray-700 text-sm md:text-lg font-dongdong pointer-events-auto
              md:left-[33%] md:top-[157px] md:w-[80%]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="absolute top-[28%] left-[16%] w-[65%] md:w-[65%] h-[35%] md:h-[40%] bg-transparent border-none focus:outline-none 
              text-gray-700 text-sm md:text-lg font-dongdong resize-none pointer-events-auto
              md:left-[16%] md:top-[210px] md:w-[520px]"
          />
        </motion.div>

        {/* Send Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          className="absolute bottom-[20%] left-[15%] md:bottom-[20%] md:left-[15%] z-10"
          onMouseEnter={() => setIsSendHovered(true)}
          onMouseLeave={() => setIsSendHovered(false)}
        >
          <img 
            src={isSendHovered ? "/images/mail/send.svg" : "/images/mail/send.svg"} 
            alt="Send" 
            className="w-16 md:w-32"
          />
        </motion.button>

        {/* Trash Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          className="absolute bottom-[23%] right-[16%] md:bottom-[23%] md:right-[18%] z-10"
          onClick={handleReset}
          onMouseEnter={() => setIsTrashHovered(true)}
          onMouseLeave={() => setIsTrashHovered(false)}
        >
          <img 
            src={isTrashHovered ? "/images/mail/trash2.svg" : "/images/mail/trash1.svg"} 
            alt="Reset" 
            className="w-12 md:w-20"
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LetterPage;