import React, { useState } from 'react';
import { motion } from "framer-motion";

const LetterPage = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

        <motion.h1 
            variants={fadeZoom}
            className="text-4xl font-dongdong text-black text-center mt-10"
        >
            Write us a letter!
        </motion.h1>

        <motion.p
            variants={fadeRight}
            className="text-xl font-dongdong text-black text-center mt-4"
        >
            This will later appear in the guestbook :)
        </motion.p>

      <div className="relative w-full max-w-md sm:max-w-[800px] h-auto">
        {/* BG Image */}
        <img 
          src="/images/mail/input-box.svg" 
          alt="Email window" 
          className="w-full h-auto"
        />

        {/* Inputs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
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
        </div>
      </div>
    </div>
  );
};

export default LetterPage;