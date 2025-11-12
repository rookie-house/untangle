'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FloatingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Background blur effect
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-4 right-4 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      } ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl scale-95 border-purple-500/20'
          : 'bg-gray-900/80 backdrop-blur-md shadow-xl border-gray-700/50'
      } rounded-2xl border`}
    >
      <div className="flex items-center space-x-2 sm:space-x-3 px-4 py-3">
        {/* Auth Buttons */}
        <Link
          href="/login"
          className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-gray-800/50 relative group"
        >
          Login
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full"></span>
        </Link>
        <Link
          href="/signup"
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
