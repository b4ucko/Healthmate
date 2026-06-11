
// Simple NLP utility functions for multi-language text processing

/**
 * Normalizes text by removing extra spaces, converting to lowercase, and removing punctuation
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Simple tokenization - splits text into words
 */
export const tokenize = (text: string): string[] => {
  const normalized = normalizeText(text);
  return normalized.split(' ').filter(token => token.length > 0);
};

/**
 * Calculates the similarity between two texts using Jaccard similarity
 * (intersection over union of word sets)
 */
export const calculateSimilarity = (text1: string, text2: string): number => {
  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));
  
  // Find intersection
  const intersection = new Set([...tokens1].filter(token => tokens2.has(token)));
  
  // Find union
  const union = new Set([...tokens1, ...tokens2]);
  
  // Calculate Jaccard similarity
  return intersection.size / union.size;
};

/**
 * Detects language from text based on character set and common words
 * Very simplified version - for production use consider using a proper language detection library
 */
export const detectLanguage = (text: string): 'en' | 'hi' | 'ta' | 'bn' | 'unknown' => {
  const normalized = normalizeText(text);
  
  // Check for Hindi characters (Unicode range)
  const hindiPattern = /[\u0900-\u097F]/;
  if (hindiPattern.test(normalized)) return 'hi';
  
  // Check for Tamil characters (Unicode range)
  const tamilPattern = /[\u0B80-\u0BFF]/;
  if (tamilPattern.test(normalized)) return 'ta';
  
  // Check for Bengali characters (Unicode range)
  const bengaliPattern = /[\u0980-\u09FF]/;
  if (bengaliPattern.test(normalized)) return 'bn';
  
  // Common Hindi words
  const hindiWords = ['नमस्ते', 'धन्यवाद', 'हां', 'नहीं', 'अच्छा', 'ठीक'];
  const hasHindiWords = hindiWords.some(word => normalized.includes(word));
  if (hasHindiWords) return 'hi';
  
  // Common Tamil words
  const tamilWords = ['வணக்கம்', 'நன்றி', 'ஆம்', 'இல்லை', 'சரி'];
  const hasTamilWords = tamilWords.some(word => normalized.includes(word));
  if (hasTamilWords) return 'ta';
  
  // Common Bengali words
  const bengaliWords = ['নমস্কার', 'ধন্যবাদ', 'হ্যাঁ', 'না', 'ভালো'];
  const hasBengaliWords = bengaliWords.some(word => normalized.includes(word));
  if (hasBengaliWords) return 'bn';
  
  // Default to English if no match
  return 'en';
};

/**
 * Checks if a command in any language matches a given intent
 */
export const matchesIntent = (
  text: string, 
  intentPhrases: Record<string, string[]>
): boolean => {
  const normalizedText = normalizeText(text);
  
  // Check each language's phrases
  for (const [_, phrases] of Object.entries(intentPhrases)) {
    for (const phrase of phrases) {
      if (normalizedText.includes(normalizeText(phrase))) {
        return true;
      }
      
      // Check similarity (for typos or slight variations)
      if (calculateSimilarity(normalizedText, phrase) > 0.7) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Extract entities from text (for simple named entity recognition)
 * This is a very simplified version - in production use a proper NER system
 */
export interface ExtractedEntity {
  type: 'specialty' | 'date' | 'time' | 'symptom';
  value: string;
}

export const extractEntities = (text: string): ExtractedEntity[] => {
  const entities: ExtractedEntity[] = [];
  const normalized = normalizeText(text);
  
  // Detect specialties
  const specialties = {
    'en': ['cardiology', 'heart', 'cardiac', 'dermatology', 'skin', 'neurology', 'brain', 'nerve', 'orthopedics', 'bone', 'joint', 'pediatrics', 'children', 'child', 'psychiatry', 'mental health'],
    'hi': ['हृदय रोग', 'कार्डियोलॉजी', 'त्वचा', 'डर्मेटोलॉजी', 'न्यूरोलॉजी', 'मस्तिष्क', 'ऑर्थोपेडिक्स', 'हड्डी', 'जोड़', 'बच्चों का डॉक्टर', 'मनोचिकित्सा'],
    'ta': ['இதய மருத்துவம்', 'தோல் மருத்துவம்', 'நரம்பியல்', 'எலும்பியல்', 'குழந்தை மருத்துவம்', 'மனநல மருத்துவம்'],
    'bn': ['কার্ডিওলজি', 'হার্ট', 'ত্বক', 'ডার্মাটোলজি', 'নিউরোলজি', 'মস্তিষ্ক', 'অর্থোপেডিক্স', 'হাড়', 'শিশু রোগ', 'মনোরোগ']
  };
  
  // Map of specialty keywords to actual specialty
  const specialtyMap: Record<string, string> = {
    'heart': 'cardiology',
    'cardiac': 'cardiology',
    'skin': 'dermatology',
    'brain': 'neurology',
    'nerve': 'neurology',
    'bone': 'orthopedics',
    'joint': 'orthopedics',
    'children': 'pediatrics',
    'child': 'pediatrics',
    'mental health': 'psychiatry',
    'हृदय': 'cardiology',
    'त्वचा': 'dermatology',
    'மூளை': 'neurology',
    'எலும்பு': 'orthopedics',
    'குழந்தை': 'pediatrics',
    'হার্ট': 'cardiology',
    'ত্বক': 'dermatology',
    'মস্তিষ্ক': 'neurology',
    'হাড়': 'orthopedics',
    'শিশু': 'pediatrics'
  };
  
  // Check for specialties
  for (const [lang, specialtyTerms] of Object.entries(specialties)) {
    for (const term of specialtyTerms) {
      if (normalized.includes(normalizeText(term))) {
        const mappedSpecialty = specialtyMap[term] || term;
        entities.push({ type: 'specialty', value: mappedSpecialty });
      }
    }
  }
  
  // Very simple date detection
  const datePatterns = {
    'en': ['today', 'tomorrow', 'next week', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    'hi': ['आज', 'कल', 'अगले हफ्ते', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'],
    'ta': ['இன்று', 'நாளை', 'அடுத்த வாரம்', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி', 'ஞாயிறு'],
    'bn': ['আজ', 'আগামীকাল', 'আগামী সপ্তাহ', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার', 'রবিবার']
  };
  
  for (const [_, dateTerms] of Object.entries(datePatterns)) {
    for (const term of dateTerms) {
      if (normalized.includes(normalizeText(term))) {
        entities.push({ type: 'date', value: term });
      }
    }
  }
  
  // Simple time detection
  const timePatterns = {
    'en': ['morning', 'afternoon', 'evening', 'night'],
    'hi': ['सुबह', 'दोपहर', 'शाम', 'रात'],
    'ta': ['காலை', 'மதியம்', 'மாலை', 'இரவு'],
    'bn': ['সকাল', 'দুপুর', 'বিকাল', 'রাত']
  };
  
  for (const [_, timeTerms] of Object.entries(timePatterns)) {
    for (const term of timeTerms) {
      if (normalized.includes(normalizeText(term))) {
        entities.push({ type: 'time', value: term });
      }
    }
  }
  
  // Basic symptom detection (simplified)
  const symptoms = {
    'en': ['fever', 'headache', 'pain', 'cough', 'cold', 'sore throat', 'stomach pain', 'back pain'],
    'hi': ['बुखार', 'सिरदर्द', 'दर्द', 'खांसी', 'जुकाम', 'गले में दर्द', 'पेट दर्द', 'पीठ दर्द'],
    'ta': ['காய்ச்சல்', 'தலைவலி', 'வலி', 'இருமல்', 'சளி', 'தொண்டை வலி', 'வயிற்று வலி', 'முதுகு வலி'],
    'bn': ['জ্বর', 'মাথা ব্যথা', 'ব্যথা', 'কাশি', 'সর্দি', 'গলা ব্যথা', 'পেট ব্যথা', 'পিঠ ব্যথা']
  };
  
  for (const [_, symptomTerms] of Object.entries(symptoms)) {
    for (const term of symptomTerms) {
      if (normalized.includes(normalizeText(term))) {
        entities.push({ type: 'symptom', value: term });
      }
    }
  }
  
  return entities;
};
