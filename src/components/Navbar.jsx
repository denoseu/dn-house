import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  // Determine active page based on current route
  const getActivePage = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Home';
    if (path === '/letter') return 'Letter';
    if (path === '/guestbook') return 'Guestbook';
    if (path === '/menu') return 'Menu';
    if (path === '/shop') return 'Shop';
    if (path === '/upload') return 'Upload';
    
    return '';
  };

  const activePage = getActivePage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Letter", path: "/letter" },
    { name: "Guestbook", path: "/guestbook" },
    { name: "Menu", path: "/menu" },
    { name: "Shop", path: "/shop" },
    { name: "Upload", path: "/upload" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-16 py-2 bg-white">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/images/navbar/icon.svg" 
              alt="Logo" 
              className="h-20 w-auto"
            />
          </Link>
        </div>
        
        {/* Navigation links */}
        <div className="flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              className={`relative text-gray-700 text-[20px] font-louis transition-all duration-200 group hover:scale-110 ${
                activePage === item.name ? 'font-bold' : ''
              }`}
            >
              {item.name}
              {activePage === item.name && (
                <span className="absolute bottom-0 left-0 right-0 mx-auto w-full h-0.5 bg-black transform origin-center animate-expand"></span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden flex items-center justify-between px-4 py-2 bg-white shadow-sm">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/images/navbar/icon.svg" 
              alt="Logo" 
              className="h-14 w-auto"
            />
          </Link>
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
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img 
                src="/images/navbar/icon.svg" 
                alt="Logo" 
                className="h-20 w-auto"
              />
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={`relative text-gray-700 text-xl font-louis transition-all duration-200 group hover:scale-110 ${
                  activePage === item.name ? 'font-bold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
                {activePage === item.name && (
                  <span className="absolute bottom-0 left-0 right-0 mx-auto w-full h-0.5 bg-black transform origin-center animate-expand"></span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;