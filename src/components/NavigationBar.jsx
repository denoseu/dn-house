import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-16 py-2 bg-white shadow-sm">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/images/navbar/icon.svg" 
            alt="Logo" 
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

      {/* Mobile Navbar */}
      <nav className="md:hidden flex items-center justify-between px-4 py-2 bg-white shadow-sm">
        <div className="flex items-center">
          <img 
            src="/images/navbar/icon.svg" 
            alt="Logo" 
            className="h-14 w-auto"
          />
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="text-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <Menu className="w-8 h-8" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center pt-12"
        >
          <div className="absolute top-6 right-4">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 focus:outline-none"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="mb-8">
            <img 
              src="/images/navbar/icon.svg" 
              alt="Logo" 
              className="h-20 w-auto"
            />
          </div>

          <div className="flex flex-col items-center space-y-6">
            <a 
              href="/" 
              className="text-gray-700 text-xl font-louis hover:font-bold transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            
            {/* Mobile dropdown */}
            <div className="relative flex flex-col items-center">
              <button 
                className="flex items-center text-gray-700 text-xl font-louis hover:font-bold transition-all duration-200"
                onClick={toggleMobileDropdown}
              >
                Create a Post
                <ChevronDown 
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {/* Mobile dropdown content */}
              {isMobileDropdownOpen && (
                <div className="flex flex-col items-center mt-2 space-y-4">
                  <a 
                    href="/create/polaroid" 
                    className="text-gray-600 text-lg font-louis hover:font-bold transition-all duration-150"
                    onClick={() => {
                      console.log("Mobile: Polaroid option clicked");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Polaroid
                  </a>
                  <a 
                    href="/create/postcard" 
                    className="text-gray-600 text-lg font-louis hover:font-bold transition-all duration-150"
                    onClick={() => {
                      console.log("Mobile: Postcards option clicked");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Postcard
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;