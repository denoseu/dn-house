import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <title>404 | DN's House</title>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        {/* Banner */}
        <img 
          src="/images/404/404.webp" 
          alt="404 Number" 
          className="max-w-full mb-6 md:max-w-xl"
        />

        {/* Main Content */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-dongdong text-gray-800">
            Oaoa! Oaa aoaooooa!
          </h1>
          
          <p className="text-lg text-gray-600 font-dongdong max-w-lg mx-auto">
            Bipbop has searched through 192913912010320132013131 websites, but this page is nowhere to be found.
          </p>

          {/* Return Home Button */}
          <Link 
            to="/" 
            className="inline-block relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img 
              src={isHovering ? "/images/404/home.webp" : "/images/404/home.webp"} 
              alt="Return Home" 
              className={`w-56 md:w-64 h-auto mt-6 transition-transform duration-300 ${
                isHovering ? 'scale-105' : 'scale-100'
              }`}
            />
          </Link>

          {/* 404 Image */}
          <img 
            src="/images/404/bipbop-404.webp" 
            alt="404" 
            className="mx-auto max-w-full md:max-w-md my-6"
          />

        </div>
      </div>
    </>
  );
};

export default NotFoundPage;