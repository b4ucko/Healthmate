
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Check, Globe, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supportedLanguages } from '@/utils/googleTranslateService';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  available: boolean;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', available: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', available: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', available: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', available: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', available: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', available: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', available: true },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', available: true }
];

const LanguageSwitcher: React.FC<{
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}> = ({ variant = 'outline', showText = true }) => {
  const { language, setLanguage, t, isAutoTranslate, toggleAutoTranslate, isLoading } = useLanguage();

  // Handler for language change
  const handleLanguageChange = (langCode: Language) => {
    // Find language option
    const langOption = languages.find(l => l.code === langCode);
    
    // Only allow changing to available languages
    if (langOption && langOption.available) {
      setLanguage(langCode);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="gap-2" disabled={isLoading}>
          {isLoading ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <>
              {isAutoTranslate ? <Languages className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {showText && <span>{t('common.language')}</span>}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {languages.map((lang) => (
          <Tooltip key={lang.code} delayDuration={300}>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                className={`flex items-center justify-between ${!lang.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => lang.available && handleLanguageChange(lang.code)}
                disabled={!lang.available}
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-muted-foreground text-xs">({lang.name})</span>
                </span>
                {language === lang.code && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </TooltipTrigger>
            {!lang.available && (
              <TooltipContent side="left">
                <p className="text-xs">Coming soon</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuCheckboxItem 
          checked={isAutoTranslate}
          onCheckedChange={toggleAutoTranslate}
          className="cursor-pointer"
        >
          <Languages className="h-4 w-4 mr-2" />
          <span>Auto-translate with Google</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
