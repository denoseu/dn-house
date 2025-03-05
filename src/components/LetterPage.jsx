import React, { useState } from 'react';

const LetterPage = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative">
        {/* BG Image */}
        <img 
            src="/images/mail/input-box.svg" 
            alt="Email window" 
            className="w-[800px] h-auto"
            />

        {/* Inputs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            className="absolute top-[145px] left-[23%] w-[80%] bg-transparent border-none focus:outline-none text-black text-sm font-dongdong pointer-events-auto"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="absolute top-[185px] left-[32%] w-[80%] bg-transparent border-none focus:outline-none text-black text-sm font-dongdong pointer-events-auto"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="absolute top-[230px] left-[16%] w-[520px] h-[40%] bg-transparent border-none focus:outline-none text-black text-sm font-dongdong resize-none pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default LetterPage;