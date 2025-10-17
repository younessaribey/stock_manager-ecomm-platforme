import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaEnvelope, FaGlobe, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`mt-auto border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Signature */}
          <div className={`flex flex-col md:flex-row items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center gap-2">
              <span>Developed with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Younes Saribey
              </span>
            </div>
            <span className="hidden md:inline">•</span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Like this project? Let's work together!
            </span>
          </div>

          {/* Contact Links */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:younessaribey1@gmail.com"
              className={`flex items-center gap-2 text-sm transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope />
              <span className="hidden sm:inline">younessaribey1@gmail.com</span>
            </a>
            <a
              href="https://younessaribey.dev"
              className={`flex items-center gap-2 text-sm transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGlobe />
              <span>younessaribey.dev</span>
            </a>
          </div>

          {/* Year */}
          <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

