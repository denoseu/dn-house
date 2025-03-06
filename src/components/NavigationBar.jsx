import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex items-center justify-between px-16 py-2 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src="/images/navbar/icon.svg" 
          alt="BN's House Logo" 
          className="h-20 w-auto"
        />
      </div>
      
      {/* Navigation links */}
      <div className="flex items-center space-x-8">
        {/* Home */}
        <a 
          href="/" 
          className="text-gray-700 text-[20px] font-louis hover:font-bold transition-all duration-200"
        >
          Home
        </a>
        
        {/* Create a Post */}
        <div 
          className="relative"
          ref={dropdownRef}
        >
          <button 
            className="flex items-center text-gray-700 text-[20px] font-louis hover:font-bold transition-all duration-200"
            onClick={toggleDropdown}
          >
            Create a Post
            <ChevronDown 
              className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {/* Dropdown content */}
          {isDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <a 
                href="/create/polaroid" 
                className="block px-4 py-2 text-gray-700 text-[20px] font-louis hover:bg-gray-100 hover:font-bold transition-all duration-150 cursor-pointer"
                onClick={() => {
                  console.log("Polaroid option clicked");
                  setIsDropdownOpen(false);
                }}
              >
                Polaroid
              </a>
              <a 
                href="/create/postcard" 
                className="block px-4 py-2 text-gray-700 text-[20px] font-louis hover:bg-gray-100 hover:font-bold transition-all duration-150 cursor-pointer"
                onClick={() => {
                  console.log("Postcards option clicked");
                  setIsDropdownOpen(false);
                }}
              >
                Postcard
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;