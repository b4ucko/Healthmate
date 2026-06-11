
import React, { createContext, useState, useContext, useEffect } from 'react';
import { enUS, hiIN, taIN, bnIN, mrIN } from '../translations';
import { 
  translateDictionary, 
  getCachedTranslations, 
  cacheTranslations 
} from '@/utils/googleTranslateService';
import { toast } from 'sonner';

// Define available languages
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'kn' | 'ml' | 'mr' | 'auto';

// Type for our translation dictionaries
export interface TranslationDict {
  [key: string]: string | TranslationDict;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translations: TranslationDict;
  isAutoTranslate: boolean;
  toggleAutoTranslate: () => void;
  isLoading: boolean;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  translations: {},
  isAutoTranslate: false,
  toggleAutoTranslate: () => {},
  isLoading: false
});

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('healthmate-language') as Language) || 'en'
  );
  
  const [translations, setTranslations] = useState<TranslationDict>(enUS);
  const [isAutoTranslate, setIsAutoTranslate] = useState<boolean>(
    () => {
      const saved = localStorage.getItem('healthmate-auto-translate');
      return saved === null ? true : saved === 'true';
    }
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Inject Google Translate script and initialize the widget
  useEffect(() => {
    const initTranslate = () => {
      if ((window as any).google && (window as any).google.translate) {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        } catch (e) {
          console.error("Failed to initialize TranslateElement:", e);
        }
      }
    };

    (window as any).googleTranslateElementInit = initTranslate;

    if ((window as any).google && (window as any).google.translate) {
      initTranslate();
    } else if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Toggle auto-translate feature
  const toggleAutoTranslate = () => {
    const newValue = !isAutoTranslate;
    setIsAutoTranslate(newValue);
    localStorage.setItem('healthmate-auto-translate', newValue.toString());
    
    if (newValue) {
      toast.success('Auto-translate enabled. Translations provided by Google Translate.');
      // Reload translations with auto-translate
      loadTranslations(language, true);
    } else {
      toast.info('Using built-in translations');
      // Reload with built-in translations
      loadTranslations(language, false);
    }
  };

  // Load translations for a specific language
  const loadTranslations = async (lang: Language, useAutoTranslate: boolean) => {
    setIsLoading(true);
    
    try {
      if (useAutoTranslate && lang !== 'en') {
        // First check if we have cached translations
        const cachedTranslations = getCachedTranslations(lang);
        
        if (cachedTranslations) {
          setTranslations(cachedTranslations);
        } else {
          // If no cache, get built-in translations first
          let baseTranslations = getBuiltInTranslations(lang);
          
          // Then enhance with Google Translate API for missing translations
          const translatedDict = await translateDictionary(enUS, lang);
          
          // Merge built-in with translated content, prioritizing built-in
          const mergedTranslations = { ...translatedDict, ...baseTranslations };
          
          // Cache the results
          cacheTranslations(lang, mergedTranslations);
          setTranslations(mergedTranslations);
        }
      } else {
        // Use built-in translations
        setTranslations(getBuiltInTranslations(lang));
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to built-in translations
      setTranslations(getBuiltInTranslations(lang));
      if (useAutoTranslate) {
        toast.error('Failed to load Google translations. Using built-in translations instead.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get built-in translations
  const getBuiltInTranslations = (lang: Language): TranslationDict => {
    switch (lang) {
      case 'hi':
        return hiIN;
      case 'ta':
        return taIN;
      case 'bn':
        return bnIN;
      case 'mr':
        return mrIN;
      // For other languages we fall back to English for now
      default:
        return enUS;
    }
  };

  // Update translations when language or auto-translate changes
  useEffect(() => {
    loadTranslations(language, isAutoTranslate);
    localStorage.setItem('healthmate-language', language);
    document.documentElement.lang = language;

    // Trigger Google Translate widget update
    const targetLang = language === 'auto' ? 'en' : language;
    const cookieValue = `/en/${targetLang}`;
    
    // Set cookie on domain and path
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    
    let attempts = 0;
    const interval = setInterval(() => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = targetLang;
        selectEl.dispatchEvent(new Event('change'));
        clearInterval(interval);
      }
      attempts++;
      if (attempts > 30) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language, isAutoTranslate]);

  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('healthmate-language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations, 
      isAutoTranslate, 
      toggleAutoTranslate,
      isLoading 
    }}>
      {children}
      <div 
        id="google_translate_element" 
        style={{ 
          opacity: 0, 
          width: 0, 
          height: 0, 
          overflow: 'hidden', 
          position: 'absolute', 
          top: -9999, 
          left: -9999, 
          pointerEvents: 'none' 
        }} 
      />
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
