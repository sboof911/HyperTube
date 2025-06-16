import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../locales/en';
import { fr } from '../locales/fr';

type Language = 'en' | 'fr';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    
    if (savedLanguage && ['en', 'fr'].includes(savedLanguage)) {
      return savedLanguage as Language;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'fr' ? 'fr' : 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Translations>(language === 'en' ? en : fr);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setTranslations(lang === 'en' ? en : fr);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof typeof en) => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};