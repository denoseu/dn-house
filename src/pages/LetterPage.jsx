import React, { useState } from 'react';
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { createGuestbookEntry } from "../api/guestbook";

const LetterPage = () => {
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);

  // State untuk loading dan error feedback
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);

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
    setFrom('');
    setSubject('');
    setMessage('');
  };

  // Handler untuk tombol Send
  const handleSend = async () => {
    setIsSending(true);
    setSendError(null);
    setSendSuccess(false);
    try {
      await createGuestbookEntry({ from, subject, message });
      setSendSuccess(true);
      handleReset();
    } catch (err) {
      setSendError('Failed to send letter. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <title>Letter Us</title>
      <Navbar />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-4"
      >
        {/* Title */}
        <motion.h1 
          variants={fadeIn(0.1)}
          className="text-4xl font-louis text-black text-center mt-10"
        >
          Write us a letter!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeIn(0.5)}
          className="text-xl font-louis text-black text-center mt-4"
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
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From"
              className="absolute top-[46px] left-[23%] w-[70%] bg-transparent border-none focus:outline-none 
                text-gray-700 text-sm md:text-lg font-louis pointer-events-auto
                md:top-[115px] md:left-[23%] md:w-[80%]"
            />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="absolute top-[66px] left-[33%] w-[70%] bg-transparent border-none focus:outline-none 
                text-gray-700 text-sm md:text-lg font-louis pointer-events-auto
                md:left-[33%] md:top-[157px] md:w-[80%]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="absolute top-[28%] left-[16%] w-[65%] md:w-[65%] h-[35%] md:h-[40%] bg-transparent border-none focus:outline-none 
                text-gray-700 text-sm md:text-lg font-louis resize-none pointer-events-auto
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
            onClick={handleSend}
            disabled={isSending}
          >
            <img 
              src={isSendHovered ? "/images/mail/send.svg" : "/images/mail/send.svg"} 
              alt="Send" 
              className={`w-16 md:w-32 ${isSending ? 'opacity-50' : ''}`}
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

        {/* Feedback setelah kirim */}
        {sendSuccess && (
          <div className="text-green-600 text-center mt-2 font-louis">Letter sent!</div>
        )}
        {sendError && (
          <div className="text-red-600 text-center mt-2 font-louis">{sendError}</div>
        )}
      </motion.div>
    </>
  );
};

export default LetterPage;