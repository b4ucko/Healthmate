
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Minimize, Maximize, Mic, MicOff, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import useVoiceAssistant from '@/hooks/useVoiceAssistant';

interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
}

interface DoctorPatientChatProps {
  doctorId?: string;
  patientId?: string;
  doctorName?: string;
  patientName?: string;
  initialOpen?: boolean;
}

const DoctorPatientChat: React.FC<DoctorPatientChatProps> = ({ 
  doctorId,
  patientId,
  doctorName = "Dr. Smith",
  patientName = "Patient",
  initialOpen = false
}) => {
  const { language } = useLanguage();
  const { userInfo } = useAuth();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const isDoctor = userInfo?.userType === 'doctor';
  const otherPartyName = isDoctor ? patientName : doctorName;
  
  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: 
        language === 'hi' ? `नमस्ते! मैं ${isDoctor ? patientName : doctorName} हूँ। कैसे मदद कर सकता हूँ?` :
        language === 'ta' ? `வணக்கம்! நான் ${isDoctor ? patientName : doctorName}. நான் எப்படி உதவ முடியும்?` :
        `Hello! This is ${isDoctor ? patientName : doctorName}. How can I help you today?`,
      sender: isDoctor ? 'patient' : 'doctor',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [isDoctor, doctorName, patientName, language]);
  
  // Voice assistant integration
  const { isListening, startListening, stopListening } = useVoiceAssistant({
    onResult: (transcript) => {
      setInputValue(transcript);
    }
  });
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: isDoctor ? 'doctor' : 'patient',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      
      // Simulate response (in a real app, this would come from a backend)
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateMockResponse(inputValue),
          sender: isDoctor ? 'patient' : 'doctor',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  };
  
  // Generate mock responses
  const generateMockResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Common medical inquiries and responses
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      return language === 'hi' ? 
        'अपॉइंटमेंट शेड्यूल करने के लिए आप अपॉइंटमेंट टैब का उपयोग कर सकते हैं या मुझे आपके लिए समय चुनने में मदद मिल सकती है।' :
        language === 'ta' ? 
        'சந்திப்பை அட்டவணையிட, நீங்கள் சந்திப்பு டேப்பைப் பயன்படுத்தலாம் அல்லது நான் உங்களுக்கு ஒரு நேரத்தைத் தேர்ந்தெடுக்க உதவ முடியும்.' :
        'To schedule an appointment, you can use the appointments tab or I can help you select a time.';
    } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
      return language === 'hi' ? 
        'आपके दर्द के बारे में सुनकर दुख हुआ। कृपया बताएं कि यह कब शुरू हुआ और क्या इसकी तीव्रता बढ़ी है या घटी है?' :
        language === 'ta' ? 
        'உங்கள் வலியைப் பற்றி கேட்க வருத்தமாக உள்ளது. தயவுசெய்து எப்போது தொடங்கியது என்பதையும், தீவிரம் அதிகரித்துள்ளதா அல்லது குறைந்துள்ளதா என்பதையும் எனக்குத் தெரியப்படுத்துங்கள்?' :
        'I\'m sorry to hear about your pain. Could you please let me know when it started and if the intensity has increased or decreased?';
    } else if (lowerMessage.includes('result') || lowerMessage.includes('test')) {
      return language === 'hi' ? 
        'आपके टेस्ट रिजल्ट आ गए हैं। मैं आपके साथ इसकी समीक्षा करने के लिए एक अपॉइंटमेंट शेड्यूल कर सकता हूं।' :
        language === 'ta' ? 
        'உங்கள் சோதனை முடிவுகள் வந்துவிட்டன. அவற்றை உங்களுடன் மதிப்பாய்வு செய்ய நான் ஒரு சந்திப்பை ஏற்பாடு செய்யலாம்.' :
        'Your test results have come in. I can schedule an appointment to review them with you.';
    } else if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
      return language === 'hi' ? 
        'आपकी दवा के बारे में कोई प्रश्न है? मैं आपके सवालों के जवाब देने में खुशी होगी।' :
        language === 'ta' ? 
        'உங்கள் மருந்துகளைப் பற்றி ஏதேனும் கேள்விகள் உள்ளதா? உங்கள் கேள்விகளுக்கு பதிலளிப்பதில் நான் மகிழ்ச்சியடைகிறேன்.' :
        'Do you have any questions about your medication? I\'d be happy to answer your questions.';
    }
    
    // Default response
    return language === 'hi' ? 
      'आपका संदेश मिल गया। मैं जल्द ही आपसे संपर्क करूंगा।' :
      language === 'ta' ? 
      'உங்கள் செய்தியைப் பெற்றேன். நான் விரைவில் உங்களுடன் தொடர்பு கொள்வேன்.' :
      'I\'ve received your message. I\'ll get back to you soon.';
  };
  
  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-5 right-5 rounded-full p-3 z-40 bg-health-blue hover:bg-blue-600"
        size="icon"
        title={language === 'hi' ? 'चैट खोलें' : language === 'ta' ? 'அரட்டையைத் திறக்கவும்' : 'Open Chat'}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <Card className={`fixed bottom-5 right-5 w-80 md:w-96 shadow-lg z-40 transition-all duration-300 ${minimized ? 'h-16' : 'h-[70vh] max-h-[500px]'}`}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <h3 className="font-medium">
            {language === 'hi' ? `${otherPartyName} के साथ चैट` : 
             language === 'ta' ? `${otherPartyName} உடன் அரட்டை` : 
             `Chat with ${otherPartyName}`}
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
                    className={`flex ${message.sender === (isDoctor ? 'doctor' : 'patient') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.sender === (isDoctor ? 'doctor' : 'patient') 
                          ? 'bg-health-blue text-white' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
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
                onClick={toggleVoiceInput}
                title={isListening ? 
                       language === 'hi' ? 'सुनना बंद करें' : 
                       language === 'ta' ? 'கேட்பதை நிறுத்து' : 
                       'Stop listening' : 
                       language === 'hi' ? 'वॉइस इनपुट शुरू करें' : 
                       language === 'ta' ? 'குரல் உள்ளீடு தொடங்கவும்' : 
                       'Start voice input'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
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

export default DoctorPatientChat;
