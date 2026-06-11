
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { normalizeText, matchesIntent, extractEntities, detectLanguage } from '@/utils/nlpUtils';

// Define common commands and their responses
export type CommandHandler = (transcript: string) => void;

interface UseVoiceAssistantProps {
  commands?: {
    [key: string]: CommandHandler;
  };
  onResult?: (transcript: string) => void;
  onListening?: (isListening: boolean) => void;
  lang?: string;
}

// Add TypeScript declarations for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Multi-language command map with expanded vocabulary for better NLP matching
const multilangCommands: Record<string, Record<string, string[]>> = {
  'book appointment': {
    'en': ['book appointment', 'schedule appointment', 'make appointment', 'doctor appointment', 'new appointment', 'get appointment'],
    'hi': ['अपॉइंटमेंट बुक करें', 'अपॉइंटमेंट शेड्यूल करें', 'डॉक्टर अपॉइंटमेंट', 'नया अपॉइंटमेंट'],
    'ta': ['சந்திப்பை முன்பதிவு செய்', 'அபாய்ண்ட்மெண்ட் புக்', 'மருத்துவர் சந்திப்பு', 'புதிய சந்திப்பு']
  },
  'find doctor': {
    'en': ['find doctor', 'find a doctor', 'search doctor', 'looking for doctor', 'need doctor', 'available doctors'],
    'hi': ['डॉक्टर खोजें', 'डॉक्टर ढूंढें', 'डॉक्टर की तलाश', 'डॉक्टरों की सूची'],
    'ta': ['மருத்துவரை கண்டுபிடி', 'டாக்டரை தேடு', 'மருத்துவர் தேவை', 'கிடைக்கும் மருத்துவர்கள்']
  },
  'emergency': {
    'en': ['emergency', 'urgent care', 'emergency help', 'medical emergency', 'need help immediately'],
    'hi': ['आपातकाल', 'आपात सेवा', 'अर्जेंट केयर', 'मेडिकल इमरजेंसी', 'तुरंत मदद चाहिए'],
    'ta': ['அவசர நிலை', 'அவசர உதவி', 'மருத்துவ அவசரம்', 'உடனடி உதவி தேவை']
  },
  'emergency appointment': {
    'en': ['emergency appointment', 'urgent appointment', 'immediate appointment', 'urgent doctor visit'],
    'hi': ['आपातकालीन अपॉइंटमेंट', 'अर्जेंट अपॉइंटमेंट', 'तत्काल अपॉइंटमेंट'],
    'ta': ['அவசர சந்திப்பு', 'அவசர அபாய்ண்ட்மெண்ட்', 'உடனடி சந்திப்பு']
  },
  'pharmacy': {
    'en': ['pharmacy', 'medicine', 'drug store', 'buy medicine', 'order medicine', 'prescription'],
    'hi': ['फार्मेसी', 'दवा', 'मेडिसिन', 'दवा ख़रीदें', 'दवा ऑर्डर करें'],
    'ta': ['மருந்தகம்', 'மருந்து', 'மருந்து வாங்க', 'மருந்து ஆர்டர்']
  },
  'blood services': {
    'en': ['blood bank', 'blood donation', 'donate blood', 'blood services', 'blood test'],
    'hi': ['ब्लड बैंक', 'रक्तदान', 'खून दान', 'रक्त सेवाएं', 'ब्लड टेस्ट'],
    'ta': ['இரத்த வங்கி', 'இரத்த தானம்', 'இரத்த சேவைகள்', 'இரத்த பரிசோதனை']
  }
};

const useVoiceAssistant = ({ commands = {}, onResult, onListening, lang: providedLang }: UseVoiceAssistantProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { language } = useLanguage();
  
  // Map language codes to speech recognition language codes
  const getRecognitionLang = useCallback(() => {
    if (providedLang) return providedLang;
    
    switch (language) {
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'bn': return 'bn-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      default: return 'en-IN';
    }
  }, [language, providedLang]);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognitionImpl();
    
    // Configure recognition
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = getRecognitionLang();
    
    // Set up event handlers
    recognitionInstance.onstart = () => {
      setIsListening(true);
      if (onListening) onListening(true);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
      if (onListening) onListening(false);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (onListening) onListening(false);
      
      // Show error toast
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice features.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Voice recognition error",
          description: "There was a problem with the voice assistant.",
          variant: "destructive"
        });
      }
    };
    
    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptResult = event.results[current][0].transcript;
      setTranscript(transcriptResult);
      
      if (event.results[current].isFinal) {
        // Process commands
        processCommand(transcriptResult);
        
        // Call onResult callback if provided
        if (onResult) onResult(transcriptResult);
      }
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (isListening && recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [getRecognitionLang]);
  
  // Check if the text matches any multilingual command using NLP functions
  const matchesMultilangCommand = useCallback((text: string, commandKey: string): boolean => {
    // Get intent phrases from our command map
    const intentPhrases = multilangCommands[commandKey] || {};
    
    // Use our NLP matching function for intelligent matching
    return matchesIntent(text, intentPhrases);
  }, []);
  
  // Process voice commands with NLP capabilities
  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Detect language of the input text
    const detectedLang = detectLanguage(lowerText);
    console.log(`Detected language: ${detectedLang}`);
    
    // Extract entities from the text
    const entities = extractEntities(lowerText);
    console.log('Extracted entities:', entities);
    
    // Check for command matches in the explicit commands prop
    for (const [commandKey, handler] of Object.entries(commands)) {
      if (normalizeText(lowerText).includes(normalizeText(commandKey))) {
        handler(lowerText);
        return;
      }
    }
    
    // Multi-language command handling with NLP
    if (matchesMultilangCommand(lowerText, 'emergency appointment')) {
      toast({
        title: "Voice command recognized",
        description: "Navigating to emergency appointment booking...",
      });
      if (commands['emergency appointment']) {
        commands['emergency appointment'](lowerText);
      } else {
        window.location.href = '/emergency-appointment';
      }
    } else if (matchesMultilangCommand(lowerText, 'book appointment')) {
      toast({
        title: "Voice command recognized",
        description: "Navigating to appointment booking...",
      });
      // Scroll to appointment section if on homepage
      const appointmentSection = document.querySelector('#appointment-section');
      if (appointmentSection) {
        appointmentSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/appointments';
      }
    } else if (matchesMultilangCommand(lowerText, 'emergency')) {
      toast({
        title: "Voice command recognized",
        description: "Navigating to emergency services...",
      });
      if (commands['emergency']) {
        commands['emergency'](lowerText);
      } else {
        window.location.href = '/emergency';
      }
    } else if (matchesMultilangCommand(lowerText, 'find doctor')) {
      toast({
        title: "Voice command recognized",
        description: "Navigating to doctor search...",
      });
      if (commands['find doctor']) {
        commands['find doctor'](lowerText);
      } else {
        window.location.href = '/doctors';
      }
    } else if (matchesMultilangCommand(lowerText, 'pharmacy')) {
      toast({
        title: "Voice command recognized",
        description: "Navigating to pharmacy...",
      });
      if (commands['pharmacy']) {
        commands['pharmacy'](lowerText);
      } else {
        window.location.href = '/pharmacy';
      }
    } else if (matchesMultilangCommand(lowerText, 'blood services')) {
      toast({
        title: "Voice command recognized",
        description: "Navigating to blood services...",
      });
      window.location.href = '/blood-bank';
    } else {
      // Use extracted entities to determine what the user might be looking for
      const specialtyEntity = entities.find(e => e.type === 'specialty');
      if (specialtyEntity) {
        toast({
          title: "Looking for doctor specialty",
          description: `Searching for ${specialtyEntity.value} specialists...`,
        });
        window.location.href = `/doctors?specialty=${specialtyEntity.value}`;
        return;
      }
      
      // Fallback: No command matched
      toast({
        title: "I heard you say",
        description: text,
      });
    }
  }, [commands, matchesMultilangCommand]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        // Update language before starting
        recognition.lang = getRecognitionLang();
        setTranscript('');
        recognition.start();
        toast({
          title: "Voice assistant active",
          description: "Listening for commands...",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  }, [recognition, isListening, getRecognitionLang]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening
  };
};

export default useVoiceAssistant;
