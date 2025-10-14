import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Language labels for display
  const languageLabels = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية'
  };

  return (
    <div className="relative inline-block text-left group">
      <button className={`flex items-center focus:outline-none transition-colors ${
        isDark 
          ? 'text-white hover:text-blue-400' 
          : 'text-gray-900 hover:text-blue-600'
      }`}>
        <FaGlobe className="mr-1 h-5 w-5" />
        <span className="hidden md:inline">{languageLabels[language]}</span>
      </button>
      
      {/* Dropdown menu */}
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="py-1">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === lang 
                  ? 'bg-blue-50 text-blue-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {languageLabels[lang] || lang}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile-friendly select overlay */}
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer md:hidden"
        aria-label="Select language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabels[lang] || lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
