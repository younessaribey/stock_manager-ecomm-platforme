import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaMobileAlt, 
  FaHome,
  FaShoppingBag,
  FaNewspaper,
  FaEnvelope,
  FaGlobe,
  FaChevronDown,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDockHidden, setIsDockHidden] = useState(false);
  const [isLightTopBg, setIsLightTopBg] = useState(false);
  const [isLightBottomBg, setIsLightBottomBg] = useState(false);
  const scrollDebounceRef = useRef(null);
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
      // Debounce background evaluation to avoid flicker
      if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
      scrollDebounceRef.current = setTimeout(() => {
        evaluateBackgroundLightness();
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Helpers to detect background luminance beneath navbar and dock
  const parseRgb = (colorStr) => {
    if (!colorStr) return { r: 255, g: 255, b: 255, a: 1 };
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1
      };
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const getRelativeLuminance = ({ r, g, b }) => {
    const srgb = [r, g, b].map((v) => v / 255);
    const linear = srgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };

  const evaluateBackgroundLightness = () => {
    try {
      const midX = Math.floor(window.innerWidth / 2);
      const sampleTopY = Math.min(Math.max(80, Math.floor(window.innerHeight * 0.12)), window.innerHeight - 1);
      const sampleBottomY = Math.max(window.innerHeight - 120, 0);
      const topEl = document.elementFromPoint(midX, sampleTopY);
      const bottomEl = document.elementFromPoint(midX, sampleBottomY);
      const topStyle = topEl ? window.getComputedStyle(topEl) : null;
      const bottomStyle = bottomEl ? window.getComputedStyle(bottomEl) : null;
      const topColor = parseRgb(topStyle ? topStyle.backgroundColor : 'rgb(255,255,255)');
      const bottomColor = parseRgb(bottomStyle ? bottomStyle.backgroundColor : 'rgb(255,255,255)');
      // If fully transparent, assume underlying is light (typical white pages)
      const topLum = (topColor.a !== undefined && topColor.a < 0.05) ? 1 : getRelativeLuminance(topColor);
      const bottomLum = (bottomColor.a !== undefined && bottomColor.a < 0.05) ? 1 : getRelativeLuminance(bottomColor);
      const nextTop = topLum > 0.7;
      const nextBottom = bottomLum > 0.7;
      // Only update state if changed to prevent re-renders and blinking
      setIsLightTopBg((prev) => (prev !== nextTop ? nextTop : prev));
      setIsLightBottomBg((prev) => (prev !== nextBottom ? nextBottom : prev));
    } catch (e) {
      setIsLightTopBg(true);
      setIsLightBottomBg(true);
    }
  };

  useEffect(() => {
    evaluateBackgroundLightness();
    const onResize = () => evaluateBackgroundLightness();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const hideDock = () => {
    setIsDockHidden(true);
    // Ensure navbar becomes visible immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showDock = () => {
    setIsDockHidden(false);
  };

  // Navigation items with icons
  const navItems = [
    { 
      path: '/', 
      label: t.navigation?.home || 'Home', 
      icon: <FaHome />,
      color: 'text-blue-500'
    },
    { 
      path: '/products', 
      label: t.navigation?.shop || 'Shop', 
      icon: <FaShoppingBag />,
      color: 'text-green-500'
    },
    { 
      path: '/news', 
      label: t.navigation?.news || 'News', 
      icon: <FaNewspaper />,
      color: 'text-purple-500'
    },
    { 
      path: '/contact', 
      label: t.navigation?.contact || 'Contact', 
      icon: <FaEnvelope />,
      color: 'text-red-500'
    },
  ];

  const isDark = theme === 'dark';

  return (
    <>
      {/* Traditional Navbar - Visible when at top */}
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ 
          y: (isScrollingDown && !isDockHidden) ? -100 : 0,
          opacity: (isScrollingDown && !isDockHidden) ? 0 : 1
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
        className={`fixed top-0 left-0 right-0 z-[100] shadow-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
        style={{
          background: isDark 
            ? (isLightTopBg ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.5)')
            : (isLightTopBg ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.85)'),
          backdropFilter: 'blur(25px) saturate(180%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
          borderBottom: isDark 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid rgba(0,0,0,0.1)'
        }}
      >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
            <Link to="/" className="flex items-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
              <FaMobileAlt className="h-8 w-8 text-blue-500 mr-2" />
                </motion.div>
              <span className="font-bold text-xl tracking-tight">Brothers Phone</span>
            </Link>
            </motion.div>

          {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={item.path} 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      location.pathname === item.path 
                        ? `bg-white/10 ${item.color}` 
                        : `${isLightTopBg ? 'hover:bg-black/20' : 'hover:bg-white/5'} hover:text-blue-400`
                    }`}
                  >
                    <span className={`text-lg ${location.pathname === item.path ? item.color : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
            </Link>
                </motion.div>
              ))}
            
            {/* Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <FaSun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <FaMoon className="h-5 w-5 text-blue-500" />
                )}
              </motion.button>

            {/* Language Switcher */}
              <motion.div 
                className="ml-4"
                whileHover={{ scale: 1.05 }}
              >
              <LanguageSwitcher />
              </motion.div>

              {/* Show Dock Button (desktop) */}
              {isDockHidden && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showDock}
                  className={`ml-3 px-3 py-2 rounded-xl transition-colors ${isLightTopBg ? 'bg-black/30 hover:bg-black/40' : 'bg-white/10 hover:bg-white/20'}`}
                  title="Show Dock"
                >
                  <FaBars className="text-white" />
                </motion.button>
              )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
                isDark 
                  ? 'text-white hover:text-blue-400' 
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
                <AnimatePresence mode="wait">
              {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                <FaTimes className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                <FaBars className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Show Dock Button (mobile) */}
              {isDockHidden && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={showDock}
                  className={`ml-2 p-2 rounded-lg ${
                    isDark 
                      ? 'bg-white/10 text-white' 
                      : 'bg-gray-900/10 text-gray-900'
                  }`}
                  title="Show Dock"
                >
                  <FaBars className="h-5 w-5" />
                </motion.button>
              )}
            </div>
        </div>

        {/* Mobile menu */}
          <AnimatePresence>
        {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`md:hidden py-4 space-y-2 ${
                  isDark 
                    ? 'border-t border-gray-700' 
                    : 'border-t border-gray-200'
                }`}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
            <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        location.pathname === item.path 
                          ? isDark
                            ? `bg-white/10 ${item.color}` 
                            : `bg-gray-900/10 ${item.color}`
                          : isDark
                            ? 'text-white hover:bg-gray-700'
                            : 'text-gray-900 hover:bg-gray-100'
                      }`}
              onClick={() => setIsMenuOpen(false)}
            >
                      <span className={`text-lg ${location.pathname === item.path ? item.color : ''}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
            </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Language Switcher & Theme Toggle */}
                <div className={`px-4 py-2 mt-4 pt-4 space-y-3 ${
                  isDark 
                    ? 'border-t border-gray-700' 
                    : 'border-t border-gray-200'
                }`}>
                  <LanguageSwitcher />
                  
                  {/* Theme Toggle Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                      isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/20'
                    }`}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                    <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* iOS-style Floating Dock - Always Centered */}
      <AnimatePresence>
        {isScrollingDown && scrollY > 200 && !isDockHidden && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 transform z-[90] pointer-events-none">
            <motion.div
              initial={{ 
                y: 100, 
                opacity: 0,
                scale: 0.8 
              }}
              animate={{ 
                y: 0, 
                opacity: 1,
                scale: 1 
              }}
              exit={{ 
                y: 100, 
                opacity: 0,
                scale: 0.8 
              }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94] // iOS easing
              }}
              className="pointer-events-auto"
            >
            {/* Desktop Dock - New iOS Style */}
            <div className="hidden md:block">
              <div 
                className="backdrop-blur-2xl rounded-3xl px-8 py-5 shadow-2xl"
                style={{
                  background: isDark 
                    ? (isLightBottomBg ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.7)')
                    : (isLightBottomBg ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.85)'),
                  backdropFilter: 'blur(25px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                  boxShadow: isDark 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className="flex items-end justify-center space-x-4">
                  {/* Hide Dock Button (Left) */}
                  <motion.button
                    whileHover={{ scale: 1.2, y: -8 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={hideDock}
                    className={`p-4 rounded-2xl backdrop-blur-sm shadow-xl ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/15' 
                        : 'bg-gray-200/50 hover:bg-gray-300/50'
                    }`}
                    title="Hide Dock"
                  >
                    <FaChevronDown className={isDark ? 'text-white/90' : 'text-gray-700'} size={18} />
                  </motion.button>

                  {/* Navigation Items */}
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ scale: 1.2, y: -8 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-4 rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300 ${
                        location.pathname === item.path
                          ? (isDark 
                              ? 'bg-white/20 shadow-2xl ring-2 ring-white/30' 
                              : 'bg-gray-300/70 shadow-2xl ring-2 ring-gray-400/50')
                          : (isDark 
                              ? (isLightBottomBg ? 'bg-black/60 hover:bg-black/70' : 'bg-black/40 hover:bg-black/50')
                              : (isLightBottomBg ? 'bg-white/40 hover:bg-white/50' : 'bg-gray-200/50 hover:bg-gray-300/50'))
                      }`}
                    >
                      <Link to={item.path} className="flex flex-col items-center -mb-1">
                        <span className={`${
                          location.pathname === item.path 
                            ? item.color 
                            : (isDark ? 'text-white drop-shadow-lg' : 'text-gray-700')
                        }`}>
                          {React.cloneElement(item.icon, { size: 24 })}
                        </span>
                        <span className={`mt-1 text-[11px] leading-none ${isDark ? 'text-white/90' : 'text-gray-700'}`}>{item.label}</span>
            </Link>
                    </motion.div>
                  ))}

                  {/* Language Switcher */}
                  <div className={`p-4 rounded-2xl backdrop-blur-sm shadow-xl ${
                    isDark ? 'bg-white/10' : 'bg-gray-200/50'
                  }`}>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Dock - New iOS Style - Centered */}
            <div className="md:hidden w-full flex justify-center">
              <div 
                className="backdrop-blur-2xl rounded-3xl px-6 py-4 shadow-2xl"
                style={{
                  background: isDark 
                    ? (isLightBottomBg ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.7)')
                    : (isLightBottomBg ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.85)'),
                  backdropFilter: 'blur(25px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                  boxShadow: isDark 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className="flex items-end justify-center space-x-3">
                  {/* Hide Dock Button (Left) */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={hideDock}
                    className={`p-3 rounded-2xl backdrop-blur-sm shadow-xl ${
                      isDark ? 'bg-white/10' : 'bg-gray-200/50'
                    }`}
                    title="Hide Dock"
                  >
                    <FaChevronDown className={isDark ? 'text-white/90' : 'text-gray-700'} size={14} />
                  </motion.button>

                  {/* Navigation Items */}
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300 ${
                        location.pathname === item.path
                          ? (isDark 
                              ? 'bg-white/20 shadow-2xl ring-2 ring-white/30' 
                              : 'bg-gray-300/70 shadow-2xl ring-2 ring-gray-400/50')
                          : (isDark 
                              ? (isLightBottomBg ? 'bg-black/60' : 'bg-black/40')
                              : (isLightBottomBg ? 'bg-white/40' : 'bg-gray-200/50'))
                      }`}
                    >
                      <Link to={item.path} className="flex flex-col items-center -mb-0.5">
                        <span className={`${
                          location.pathname === item.path 
                            ? item.color 
                            : (isDark ? 'text-white drop-shadow-lg' : 'text-gray-700')
                        }`}>
                          {React.cloneElement(item.icon, { size: 20 })}
                        </span>
                        <span className={`mt-0.5 text-[10px] leading-none ${isDark ? 'text-white/90' : 'text-gray-700'}`}>{item.label}</span>
            </Link>
                    </motion.div>
                  ))}
            
                  {/* Language Switcher */}
                  <div className={`p-3 rounded-2xl backdrop-blur-sm shadow-xl ${
                    isDark ? 'bg-white/10' : 'bg-gray-200/50'
                  }`}>
              <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;