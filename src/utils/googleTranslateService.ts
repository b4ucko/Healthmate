import { TranslationDict } from "@/contexts/LanguageContext";

// Google Translation API endpoint (free client)
const API_URL = "https://translate.googleapis.com/translate_a/single";

// Supported languages in the app
export const supportedLanguages = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil", 
  bn: "Bengali",
  mr: "Marathi",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam"
};

// Google Translate language codes (may differ from our internal codes)
const googleLanguageCodes: Record<string, string> = {
  en: "en",
  hi: "hi",
  ta: "ta",
  bn: "bn",
  mr: "mr",
  te: "te",
  kn: "kn",
  ml: "ml"
};

/**
 * Translates a text string to the target language using free Google Translate API
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    const lang = googleLanguageCodes[targetLang] || 'en';
    const response = await fetch(
      `${API_URL}?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      console.error("Translation API error:", response.statusText);
      return text; // Return original text if translation fails
    }

    const data = await response.json();
    // The free Google Translate API response is structured as:
    // [ [ [translatedPart, originalPart, ...], ... ], ... ]
    if (data && data[0]) {
      const translatedParts = data[0].map((part: any) => part[0]).filter(Boolean);
      return translatedParts.join("");
    }
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text on error
  }
};

/**
 * Flattens a nested dictionary into a list of key paths and values
 */
const flattenDictionary = (
  dict: TranslationDict,
  currentPath: string[] = []
): Array<{ path: string[]; value: string }> => {
  let results: Array<{ path: string[]; value: string }> = [];
  for (const [key, value] of Object.entries(dict)) {
    if (typeof value === 'string') {
      results.push({ path: [...currentPath, key], value });
    } else if (typeof value === 'object' && value !== null) {
      results = results.concat(flattenDictionary(value as TranslationDict, [...currentPath, key]));
    }
  }
  return results;
};

/**
 * Sets a value in a nested dictionary given a key path
 */
const setNestedValue = (dict: TranslationDict, path: string[], value: string) => {
  let current: any = dict;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
};

/**
 * Batch translates all strings in a translation dictionary using chunked API calls
 */
export const translateDictionary = async (
  dict: TranslationDict,
  targetLang: string,
  baseLang: string = "en"
): Promise<TranslationDict> => {
  // Don't translate if target language is the base language
  if (targetLang === baseLang) {
    return dict;
  }

  const flattened = flattenDictionary(dict);
  const valuesToTranslate = flattened.map(item => item.value);
  const translatedValues: string[] = [];
  
  // We translate in chunks of 25 strings to avoid URL length limits and formatting bugs
  const chunkSize = 25;
  for (let i = 0; i < valuesToTranslate.length; i += chunkSize) {
    const chunk = valuesToTranslate.slice(i, i + chunkSize);
    const joinedText = chunk.join("\n");
    
    try {
      const translatedJoined = await translateText(joinedText, targetLang);
      const splitTranslated = translatedJoined.split("\n");
      
      // If the split length matches, add them
      if (splitTranslated.length === chunk.length) {
        translatedValues.push(...splitTranslated);
      } else {
        // Fallback: translate individually for this chunk if the line counts mismatch
        console.warn(`Translation chunk size mismatch (${chunk.length} vs ${splitTranslated.length}), translating individually`);
        const individualTranslations = await Promise.all(
          chunk.map(text => translateText(text, targetLang))
        );
        translatedValues.push(...individualTranslations);
      }
    } catch (error) {
      console.error("Failed to translate chunk, using original values", error);
      translatedValues.push(...chunk);
    }
  }
  
  // Reconstruct the dictionary
  const translatedDict: TranslationDict = {};
  for (let i = 0; i < flattened.length; i++) {
    const { path } = flattened[i];
    const translatedVal = translatedValues[i] || flattened[i].value;
    setNestedValue(translatedDict, path, translatedVal);
  }
  
  return translatedDict;
};

/**
 * Creates a cache key for storing translations
 */
export const createTranslationCacheKey = (lang: string): string => {
  return `healthmate-translations-${lang}`;
};

/**
 * Gets cached translations from localStorage
 */
export const getCachedTranslations = (lang: string): TranslationDict | null => {
  const cached = localStorage.getItem(createTranslationCacheKey(lang));
  return cached ? JSON.parse(cached) : null;
};

/**
 * Caches translations in localStorage
 */
export const cacheTranslations = (lang: string, translations: TranslationDict): void => {
  localStorage.setItem(
    createTranslationCacheKey(lang),
    JSON.stringify(translations)
  );
};
