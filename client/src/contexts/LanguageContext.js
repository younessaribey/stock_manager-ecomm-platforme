import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../locales';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Store in translations for the current language
  const [t, setT] = useState(translations[language] || translations.en);

  // When language changes, update translations and localStorage
  useEffect(() => {
    setT(translations[language] || translations.en);
    localStorage.setItem('language', language);
  }, [language]);

  // Function to change language
  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  // Get a list of available languages
  const availableLanguages = Object.keys(translations);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        changeLanguage, 
        t, 
        availableLanguages 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
