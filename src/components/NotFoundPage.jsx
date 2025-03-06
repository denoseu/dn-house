import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <title>404 | DN's House</title>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:max-w-lg space-y-6 md:mr-8 flex flex-col items-center">
            <img 
                src="/images/404/404.webp" 
                alt="404 Number" 
                className="max-w-full md:max-w-xl mx-auto"
            />

            <h1 className="text-4xl font-bold font-dongdong text-gray-800">
                Oaoa! Oaa aoaooooa!
            </h1>

            <p className="text-lg text-gray-600 font-dongdong max-w-lg">
                Bipbop has searched through 192913912010320132013131 websites, but this page is nowhere to be found.
            </p>

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
          </div>

          <div className="flex flex-1 items-center justify-center h-full">
            <img 
              src="/images/404/bipbop-404.webp" 
              alt="404" 
              className="max-w-full md:max-w-xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
