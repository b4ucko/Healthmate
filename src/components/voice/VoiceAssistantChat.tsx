
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, X, Minimize, Maximize, Ambulance, Bot } from 'lucide-react';
import useVoiceAssistant from '@/hooks/useVoiceAssistant';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { extractEntities, detectLanguage } from '@/utils/nlpUtils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
}

interface VoiceAssistantChatProps {
  initialOpen?: boolean;
}

const VoiceAssistantChat: React.FC<VoiceAssistantChatProps> = ({ initialOpen = false }) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      content: language === 'hi' ? 'नमस्ते! मैं आपका हेल्थमेट सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?' :
               language === 'ta' ? 'வணக்கம்! நான் உங்கள் ஹெல்த்மேட் உதவியாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?' :
               'Namaste! I\'m your HealthMate assistant. How can I help you today?', 
      sender: 'assistant' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [awaitingAppointmentSymptom, setAwaitingAppointmentSymptom] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Update greeting when language changes
  useEffect(() => {
    const greetings = {
      'en': 'Namaste! I\'m your HealthMate assistant. How can I help you today?',
      'hi': 'नमस्ते! मैं आपका हेल्थमेट सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',
      'ta': 'வணக்கம்! நான் உங்கள் ஹெல்த்மேட் உதவியாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?'
    };
    
    setMessages(prev => {
      // Replace the first message with the translated greeting
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[0] = {
          ...newMessages[0],
          content: greetings[language as 'en' | 'hi' | 'ta'] || greetings['en']
        };
      }
      return newMessages;
    });
  }, [language]);
  
  const handleAppointmentRequest = () => {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
      navigate('/doctors');
    } else {
      navigate('/sign-in');
    }
  };

  const handleEmergencyAppointment = () => {
    navigate('/emergency-appointment');
  };

  // Generate assistant response based on language
  const getLocalizedResponse = (key: string) => {
    const responses = {
      'emergency_appointment': {
        'en': "I'll take you to our emergency appointment page right away.",
        'hi': "मैं आपको तुरंत हमारे आपातकालीन अपॉइंटमेंट पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை உடனடியாக எங்கள் அவசர சந்திப்பு பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'book_appointment': {
        'en': "I can help you book an appointment with a doctor. Would you like to schedule one now?",
        'hi': "मैं आपको डॉक्टर के साथ अपॉइंटमेंट बुक करने में मदद कर सकता हूँ। क्या आप अभी एक शेड्यूल करना चाहेंगे?",
        'ta': "நான் உங்களுக்கு ஒரு மருத்துவரிடம் சந்திப்பை முன்பதிவு செய்ய உதவ முடியும். இப்போது ஒன்றை திட்டமிட விரும்புகிறீர்களா?"
      },
      'emergency': {
        'en': "I'll redirect you to our emergency services page right away.",
        'hi': "मैं आपको तुरंत हमारे आपातकालीन सेवा पेज पर रीडायरेक्ट करूंगा।",
        'ta': "நான் உங்களை உடனடியாக எங்கள் அவசர சேவைகள் பக்கத்திற்கு வழிநடத்துகிறேன்."
      },
      'find_doctor': {
        'en': "I'll show you our doctors directory where you can find specialists.",
        'hi': "मैं आपको हमारी डॉक्टर्स डायरेक्टरी दिखाऊंगा जहां आप विशेषज्ञों को ढूंढ सकते हैं।",
        'ta': "நான் உங்களுக்கு எங்கள் மருத்துவர்கள் பட்டியலைக் காட்டுகிறேன், அங்கு நீங்கள் நிபுணர்களைக் கண்டறியலாம்."
      },
      'pharmacy': {
        'en': "I'll take you to our online pharmacy where you can order medicines.",
        'hi': "मैं आपको हमारी ऑनलाइन फार्मेसी पर ले जाऊंगा जहां आप दवाइयां ऑर्डर कर सकते हैं।",
        'ta': "நான் உங்களை எங்கள் ஆன்லைன் மருந்தகத்திற்கு அழைத்துச் செல்கிறேன், அங்கு நீங்கள் மருந்துகளை ஆர்டர் செய்யலாம்."
      },
      'blood_bank': {
        'en': "I'll take you to our blood bank page where you can find blood donors and availability.",
        'hi': "मैं आपको हमारे ब्लड बैंक पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை எங்கள் இரத்த வங்கி பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'blood_donation': {
        'en': "I'll take you to our blood donation page where you can register as a donor.",
        'hi': "मैं आपको हमारे रक्तदान पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை எங்கள் இரத்த தான பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'pregnancy_care': {
        'en': "I'll take you to our pregnancy care page with expert guidance and resources.",
        'hi': "मैं आपको हमारे गर्भावस्था देखभाल पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை எங்கள் கர்ப்பகால பராமரிப்பு பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'blogs': {
        'en': "I'll take you to our health blogs with useful articles and tips.",
        'hi': "मैं आपको हमारे स्वास्थ्य ब्लॉग पर ले जाऊंगा।",
        'ta': "நான் உங்களை எங்கள் சுகாதார வலைப்பதிவுகளுக்கு அழைத்துச் செல்கிறேன்."
      },
      'about': {
        'en': "I'll take you to our about page to learn more about HealthMate.",
        'hi': "मैं आपको हमारे बारे में पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை எங்கள் பற்றிய பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'dashboard': {
        'en': "I'll take you to your dashboard.",
        'hi': "मैं आपको आपके डैशबोर्ड पर ले जाऊंगा।",
        'ta': "நான் உங்களை உங்கள் டாஷ்போர்டுக்கு அழைத்துச் செல்கிறேன்."
      },
      'profile': {
        'en': "I'll take you to your profile page.",
        'hi': "मैं आपको आपकी प्रोफ़ाइल पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை உங்கள் சுயவிவர பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'signin': {
        'en': "I'll take you to the sign in page.",
        'hi': "मैं आपको साइन इन पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை உள்நுழைவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'signup': {
        'en': "I'll take you to the sign up page to create an account.",
        'hi': "मैं आपको साइन अप पेज पर ले जाऊंगा।",
        'ta': "நான் உங்களை பதிவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்."
      },
      'greeting': {
        'en': "Namaste! How can I assist with your healthcare needs today?",
        'hi': "नमस्ते! आज मैं आपकी स्वास्थ्य सेवा आवश्यकताओं में कैसे सहायता कर सकता हूँ?",
        'ta': "வணக்கம்! இன்று உங்கள் சுகாதார தேவைகளில் நான் எவ்வாறு உதவ முடியும்?"
      },
      'unknown': {
        'en': "I'm not sure how to help with that yet. Can you try asking about booking appointments, emergency appointments, finding doctors, or our pharmacy services?",
        'hi': "मुझे अभी तक यह नहीं पता कि इसमें कैसे मदद करूँ। क्या आप अपॉइंटमेंट बुकिंग, आपातकालीन अपॉइंटमेंट, डॉक्टर खोजने, या हमारी फार्मेसी सेवाओं के बारे में पूछने का प्रयास कर सकते हैं?",
        'ta': "இதற்கு எப்படி உதவுவது என்று எனக்கு இன்னும் தெரியவில்லை. சந்திப்புகளை முன்பதிவு செய்வது, அவசர சந்திப்புகள், மருத்துவர்களைக் கண்டறிதல் அல்லது எங்கள் மருந்தக சேவைகள் பற்றி கேட்க முயற்சிக்கலாமா?"
      }
    };
    
    return responses[key as keyof typeof responses]?.[language as 'en' | 'hi' | 'ta'] || responses[key as keyof typeof responses]?.['en'] || key;
  };

  // Process commands and add responses
  const processCommand = (command: string) => {
    // Add user message
    const userMessage: Message = { 
      id: Date.now().toString(), 
      content: command, 
      sender: 'user' 
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Detect language and extract entities with NLP
    const detectedLang = detectLanguage(command);
    const entities = extractEntities(command);
    console.log(`Detected language: ${detectedLang}, Entities:`, entities);
    
    // Generate response based on command
    let response = '';
    const cmdLower = command.toLowerCase();
    
    // Check for symptom related queries
    const bodyParts = ['eye', 'vision', 'sight', 'ear', 'nose', 'throat', 'chest', 'heart', 'tooth', 'teeth', 'dental', 'skin', 'rash', 'acne', 'brain', 'head', 'nerve', 'bone', 'joint', 'back', 'knee', 'muscle', 'woman', 'pregnancy', 'period', 'child', 'kid', 'baby', 'sugar', 'diabetes'];
    const generalSymptoms = ['headache', 'fever', 'cold', 'stomach ache', 'stomach pain', 'stomach', 'cough', 'pain'];
    const allSymptoms = [...generalSymptoms, ...bodyParts];
    const isSymptomRelated = entities.some(e => e.type === 'symptom') || allSymptoms.some(s => cmdLower.includes(s));
    
    // Process based on current state
    if (awaitingAppointmentSymptom) {
      if (cmdLower.includes('yes') || cmdLower.includes('yeah') || cmdLower.includes('sure') || cmdLower.includes('ok') || cmdLower.includes('yep') || cmdLower.includes('हां') || cmdLower.includes('ஆம்')) {
        response = `I'll take you to the doctors page to book an appointment for ${awaitingAppointmentSymptom}.`;
        setTimeout(() => {
          navigate(`/doctors?symptom=${encodeURIComponent(awaitingAppointmentSymptom)}`);
        }, 1500);
      } else {
        response = "Okay, take care! Let me know if you need anything else.";
      }
      setAwaitingAppointmentSymptom(null);
    } else if (isSymptomRelated) {
      const symptom = entities.find(e => e.type === 'symptom')?.value || 
                      (allSymptoms.find(s => cmdLower.includes(s)) || 'this health issue');
      
      let remedies: string[] = [];
      if (symptom.includes('headache') || symptom.includes('head') || symptom.includes('brain')) {
        remedies = ["1. Rest in a quiet, dark room.", "2. Apply a cold or warm compress to your head.", "3. Drink plenty of water and stay hydrated."];
      } else if (symptom.includes('fever')) {
        remedies = ["1. Get plenty of rest to help your body heal.", "2. Drink fluids like water or clear broths.", "3. Take a lukewarm bath to cool down."];
      } else if (symptom.includes('cough') || symptom.includes('cold') || symptom.includes('throat') || symptom.includes('ear') || symptom.includes('nose')) {
        remedies = ["1. Drink warm fluids like ginger tea or honey and warm water.", "2. Inhale steam to clear your nasal passages.", "3. Rest well and keep yourself warm."];
      } else if (symptom.includes('stomach')) {
        remedies = ["1. Drink plenty of clear fluids.", "2. Avoid solid, spicy, or heavy food for a few hours.", "3. Use a heating pad on your belly."];
      } else if (symptom.includes('eye') || symptom.includes('vision') || symptom.includes('sight')) {
        remedies = ["1. Use a cold compress over closed eyes.", "2. Avoid looking at bright screens.", "3. Do not rub your eyes."];
      } else if (symptom.includes('tooth') || symptom.includes('teeth') || symptom.includes('dental')) {
        remedies = ["1. Rinse your mouth with warm salt water.", "2. Apply a cold compress to the outside of your cheek.", "3. Avoid very hot or very cold foods."];
      } else if (symptom.includes('skin') || symptom.includes('rash') || symptom.includes('acne')) {
        remedies = ["1. Wash the area with gentle soap and water.", "2. Apply a cold compress or aloe vera gel.", "3. Avoid scratching the affected area."];
      } else if (symptom.includes('heart') || symptom.includes('chest')) {
        remedies = ["1. Sit down and rest immediately.", "2. Loosen any tight clothing.", "3. If pain persists, please seek emergency care immediately!"];
      } else if (symptom.includes('bone') || symptom.includes('joint') || symptom.includes('back') || symptom.includes('knee') || symptom.includes('muscle') || symptom.includes('pain')) {
        remedies = ["1. Rest the affected area.", "2. Apply an ice pack for 15-20 minutes.", "3. Elevate the affected body part if possible."];
      } else if (symptom.includes('pregnancy') || symptom.includes('period') || symptom.includes('woman')) {
        remedies = ["1. Use a warm heating pad for cramps.", "2. Stay hydrated with warm water.", "3. Get plenty of rest."];
      } else {
        remedies = ["1. Get plenty of rest and avoid stressful activities.", "2. Drink plenty of water to stay hydrated.", "3. Apply gentle heat or cold compresses if there is localized pain."];
      }

      setAwaitingAppointmentSymptom(symptom);

      // Send the sequence of messages one after another
      const intro = `I see you are facing issues with ${symptom}. Here are 3 home remedies you can try:`;
      const outro = `Would you like to book an appointment with a specialist doctor for this issue?`;

      setTimeout(() => setMessages(prev => [...prev, { id: Date.now().toString(), content: intro, sender: 'assistant' }]), 600);
      remedyLines(remedies);
      
      function remedyLines(lines: string[]) {
        lines.forEach((line, idx) => {
          setTimeout(() => setMessages(prev => [...prev, { id: Date.now() + idx + 1 + '', content: line, sender: 'assistant' }]), 600 + (idx + 1) * 1200);
        });
        setTimeout(() => setMessages(prev => [...prev, { id: Date.now() + 5 + '', content: outro, sender: 'assistant' }]), 600 + (lines.length + 1) * 1200);
      }
      
      return;
    } else if (cmdLower.includes('emergency appointment') || cmdLower.includes('urgent appointment') ||
        cmdLower.includes('आपातकालीन अपॉइंटमेंट') || cmdLower.includes('अर्जेंट अपॉइंटमेंट') ||
        cmdLower.includes('அவசர சந்திப்பு')) {
      response = getLocalizedResponse('emergency_appointment');
      setTimeout(() => {
        handleEmergencyAppointment();
      }, 1000);
    } else if (cmdLower.includes('book appointment') || cmdLower.includes('schedule appointment') ||
               cmdLower.includes('अपॉइंटमेंट बुक') || cmdLower.includes('अपॉइंटमेंट शेड्यूल') ||
               cmdLower.includes('சந்திப்பை முன்பதிவு')) {
      response = getLocalizedResponse('book_appointment');
      const appointmentSection = document.querySelector('#appointment-section');
      if (appointmentSection) {
        appointmentSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        setTimeout(() => {
          handleAppointmentRequest();
        }, 1000);
      }
    } else if (cmdLower.includes('emergency') || cmdLower.includes('urgent care') ||
               cmdLower.includes('आपातकाल') || cmdLower.includes('आपात सेवा') ||
               cmdLower.includes('அவசர நிலை')) {
      response = getLocalizedResponse('emergency');
      setTimeout(() => {
        navigate('/emergency');
      }, 1000);
    } else if (cmdLower.includes('find doctor') || cmdLower.includes('find a doctor') || cmdLower.includes('doctors') ||
               cmdLower.includes('डॉक्टर खोजें') || cmdLower.includes('डॉक्टर ढूंढें') ||
               cmdLower.includes('மருத்துவரை கண்டுபிடி')) {
      response = getLocalizedResponse('find_doctor');
      
      // Check if a specialty was mentioned and use it for navigation
      const specialtyEntity = entities.find(e => e.type === 'specialty');
      setTimeout(() => {
        if (specialtyEntity) {
          navigate(`/doctors?specialty=${specialtyEntity.value}`);
        } else {
          navigate('/doctors');
        }
      }, 1000);
    } else if (cmdLower.includes('medicines') || cmdLower.includes('pharmacy') || cmdLower.includes('drugs') ||
               cmdLower.includes('दवाइयां') || cmdLower.includes('फार्मेसी') ||
               cmdLower.includes('மருந்துகள்') || cmdLower.includes('மருந்தகம்')) {
      response = getLocalizedResponse('pharmacy');
      setTimeout(() => navigate('/pharmacy'), 1000);
    } else if (cmdLower.includes('blood bank') || cmdLower.includes('ब्लड बैंक') || cmdLower.includes('இரத்த வங்கி')) {
      response = getLocalizedResponse('blood_bank');
      setTimeout(() => navigate('/blood-bank'), 1000);
    } else if (cmdLower.includes('blood donat') || cmdLower.includes('donate blood') || cmdLower.includes('रक्तदान') || cmdLower.includes('இரத்த தானம்')) {
      response = getLocalizedResponse('blood_donation');
      setTimeout(() => navigate('/blood-donation'), 1000);
    } else if (cmdLower.includes('pregnan') || cmdLower.includes('maternity') || cmdLower.includes('गर्भावस्था') || cmdLower.includes('கர்ப்பம்')) {
      response = getLocalizedResponse('pregnancy_care');
      setTimeout(() => navigate('/pregnancy-care'), 1000);
    } else if (cmdLower.includes('blog') || cmdLower.includes('article') || cmdLower.includes('health tips') || cmdLower.includes('ब्लॉग') || cmdLower.includes('வலைப்பதிவு')) {
      response = getLocalizedResponse('blogs');
      setTimeout(() => navigate('/blogs'), 1000);
    } else if (cmdLower.includes('about') || cmdLower.includes('about us') || cmdLower.includes('हमारे बारे') || cmdLower.includes('பற்றி')) {
      response = getLocalizedResponse('about');
      setTimeout(() => navigate('/about'), 1000);
    } else if (cmdLower.includes('dashboard') || cmdLower.includes('my dashboard') || cmdLower.includes('डैशबोर्ड') || cmdLower.includes('டாஷ்போர்டு')) {
      response = getLocalizedResponse('dashboard');
      setTimeout(() => navigate('/patient-dashboard'), 1000);
    } else if (cmdLower.includes('profile') || cmdLower.includes('my profile') || cmdLower.includes('प्रोफ़ाइल') || cmdLower.includes('சுயவிவரம்')) {
      response = getLocalizedResponse('profile');
      setTimeout(() => navigate('/user-profile'), 1000);
    } else if (cmdLower.includes('sign up') || cmdLower.includes('register') || cmdLower.includes('create account') || cmdLower.includes('साइन अप') || cmdLower.includes('பதிவு')) {
      response = getLocalizedResponse('signup');
      setTimeout(() => navigate('/sign-up'), 1000);
    } else if (cmdLower.includes('sign in') || cmdLower.includes('login') || cmdLower.includes('log in') || cmdLower.includes('साइन इन') || cmdLower.includes('உள்நுழை')) {
      response = getLocalizedResponse('signin');
      setTimeout(() => navigate('/sign-in'), 1000);
    } else if (cmdLower.includes('hello') || cmdLower.includes('hi') || cmdLower.includes('namaste') ||
               cmdLower.includes('नमस्ते') || cmdLower.includes('வணக்கம்')) {
      response = getLocalizedResponse('greeting');
    } else {
      // Use NLP entity extraction for more intelligent responses
      if (entities.length > 0) {
        const specialtyEntity = entities.find(e => e.type === 'specialty');
        if (specialtyEntity) {
          response = `I've found information about ${specialtyEntity.value} doctors. Let me show you.`;
          setTimeout(() => {
            navigate(`/doctors?specialty=${specialtyEntity.value}`);
          }, 1000);
        } else {
          response = getLocalizedResponse('unknown');
        }
      } else {
        response = getLocalizedResponse('unknown');
      }
    }
    
    // Add assistant response
    setTimeout(() => {
      const assistantMessage: Message = { 
        id: Date.now().toString(), 
        content: response, 
        sender: 'assistant' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 600);
  };
  
  // Setup voice assistant
  const { isListening, transcript, startListening, stopListening } = useVoiceAssistant({
    commands: {
      'emergency appointment': () => handleEmergencyAppointment(),
      'urgent appointment': () => handleEmergencyAppointment(),
      'book appointment': () => handleAppointmentRequest(),
      'find doctor': () => navigate('/doctors'),
      'emergency': () => navigate('/emergency'),
      'pharmacy': () => navigate('/pharmacy')
    },
    onResult: (text) => {
      setInputValue(text);
      processCommand(text);
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      processCommand(inputValue);
      setInputValue('');
    }
  };
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  // Update chat button text based on language
  const getChatButtonText = () => {
    switch(language) {
      case 'hi': return 'वॉइस सहायक';
      case 'ta': return 'குரல் உதவியாளர்';
      default: return 'Voice Assistant';
    }
  };
  
  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-5 right-5 rounded-full p-3 z-50 bg-health-blue hover:bg-blue-600"
        size="icon"
        title={getChatButtonText()}
      >
        <Bot className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <Card className={`fixed bottom-5 right-5 w-80 md:w-96 shadow-lg z-50 transition-all duration-300 ${minimized ? 'h-16' : 'h-[70vh] max-h-[500px]'}`}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <h3 className="font-medium">
            {language === 'hi' ? 'हेल्थमेट सहायक' : 
             language === 'ta' ? 'ஹெல்த்மேட் உதவியாளர்' : 
             'HealthMate Assistant'}
          </h3>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!minimized && (
        <>
          <ScrollArea ref={scrollAreaRef} className="h-[calc(100%-120px)]">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.sender === 'user' 
                          ? 'bg-health-blue text-white' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isListening && (
                  <div className="flex justify-start">
                    <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 flex gap-2 items-center">
                      <span className="text-sm">
                        {language === 'hi' ? 'सुन रहा हूँ' : 
                         language === 'ta' ? 'கேட்கிறேன்' : 
                         'Listening'}
                      </span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </ScrollArea>
          
          <CardFooter className="p-3 pt-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder={language === 'hi' ? 'संदेश टाइप करें...' : 
                            language === 'ta' ? 'செய்தியை உள்ளிடவும்...' : 
                            'Type a message...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                className={`rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-health-blue hover:bg-blue-600'}`}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 
                       language === 'hi' ? 'सुनना बंद करें' : 
                       language === 'ta' ? 'கேட்பதை நிறுத்து' : 
                       'Stop listening' : 
                       language === 'hi' ? 'वॉइस इनपुट शुरू करें' : 
                       language === 'ta' ? 'குரல் உள்ளீடு தொடங்கவும்' : 
                       'Start voice input'}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full bg-health-blue hover:bg-blue-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default VoiceAssistantChat;
