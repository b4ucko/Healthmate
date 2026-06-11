
import React, { useState } from 'react';
import { Mic, MicOff, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useVoiceAssistant from '@/hooks/useVoiceAssistant';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceBloodDonationRequestProps {
  onBloodTypeSelect: (bloodType: string) => void;
  onLocationSelect: (location: string) => void;
  onUrgencySelect: (isUrgent: boolean) => void;
  onRequestDescriptionUpdate: (description: string) => void;
}

const VoiceBloodDonationRequest: React.FC<VoiceBloodDonationRequestProps> = ({
  onBloodTypeSelect,
  onLocationSelect,
  onUrgencySelect,
  onRequestDescriptionUpdate
}) => {
  const [isListening, setIsListening] = useState(false);
  const { language } = useLanguage();
  
  // Regex patterns for blood type detection
  const bloodTypePatterns = {
    'A+': /(?:blood type|blood group|type)?\s*A\s*\+/i,
    'A-': /(?:blood type|blood group|type)?\s*A\s*\-/i,
    'B+': /(?:blood type|blood group|type)?\s*B\s*\+/i,
    'B-': /(?:blood type|blood group|type)?\s*B\s*\-/i,
    'AB+': /(?:blood type|blood group|type)?\s*AB\s*\+/i,
    'AB-': /(?:blood type|blood group|type)?\s*AB\s*\-/i,
    'O+': /(?:blood type|blood group|type)?\s*O\s*\+/i,
    'O-': /(?:blood type|blood group|type)?\s*O\s*\-/i,
  };
  
  // Process voice input for blood donation request
  const processBloodRequest = (transcript: string) => {
    // Detect blood type
    for (const [bloodType, pattern] of Object.entries(bloodTypePatterns)) {
      if (pattern.test(transcript)) {
        onBloodTypeSelect(bloodType);
        toast.success(
          language === 'hi' ? `ब्लड टाइप: ${bloodType}` :
          language === 'ta' ? `இரத்த வகை: ${bloodType}` :
          `Blood type: ${bloodType}`
        );
        break;
      }
    }
    
    // Detect urgency
    if (transcript.includes('urgent') || 
        transcript.includes('emergency') || 
        transcript.includes('आपातकाल') || 
        transcript.includes('अर्जेंट') ||
        transcript.includes('அவசர')) {
      onUrgencySelect(true);
      toast.success(
        language === 'hi' ? 'आपातकालीन स्थिति चिह्नित की गई' :
        language === 'ta' ? 'அவசர நிலை குறிக்கப்பட்டது' :
        'Marked as urgent'
      );
    }
    
    // Extract location
    const locationPatterns = [
      /(?:in|at|near|location|area)\s+([A-Za-z\s]+)(?:hospital|center|centre)?/i,
      /([A-Za-z\s]+)(?:hospital|center|centre)/i,
      /(?:स्थान|में|पास)\s+([A-Za-zА-Яа-я\s]+)(?:अस्पताल|केंद्र)?/i,
      /(?:இடம்|அருகில்)\s+([A-Za-zА-Яа-я\s]+)(?:மருத்துவமனை|மையம்)?/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = transcript.match(pattern);
      if (match && match[1]) {
        const location = match[1].trim();
        if (location.length > 3) { // Avoid too short locations
          onLocationSelect(location);
          toast.success(
            language === 'hi' ? `स्थान: ${location}` :
            language === 'ta' ? `இடம்: ${location}` :
            `Location: ${location}`
          );
          break;
        }
      }
    }
    
    // Extract description of request
    const descriptionPatterns = [
      /(?:for|because|reason is|need blood for)\s+(.+)/i,
      /(?:के लिए|क्योंकि|कारण है|रक्त की आवश्यकता)\s+(.+)/i,
      /(?:காரணம்|தேவை|இரத்தம் தேவை)\s+(.+)/i
    ];
    
    for (const pattern of descriptionPatterns) {
      const match = transcript.match(pattern);
      if (match && match[1]) {
        const description = match[1].trim();
        if (description.length > 5) {
          onRequestDescriptionUpdate(description);
          break;
        }
      }
    }
  };
  
  // Voice assistant hook
  const { startListening, stopListening } = useVoiceAssistant({
    onResult: (transcript) => {
      console.log("Transcript:", transcript);
      processBloodRequest(transcript);
    },
    onListening: (listening) => {
      setIsListening(listening);
    }
  });
  
  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      
      // Show help toast
      toast.info(
        language === 'hi' ? 
          "कृपया ब्लड टाइप, स्थान और अपनी आवश्यकता का विवरण बताएं" :
        language === 'ta' ? 
          "இரத்த வகை, இடம் மற்றும் உங்கள் தேவையின் விவரங்களைக் கூறவும்" :
          "Please state the blood type, location and details of your requirement"
      );
    }
  };
  
  return (
    <Button
      onClick={handleVoiceCommand}
      variant={isListening ? "destructive" : "outline"}
      className="rounded-full flex items-center gap-2"
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {isListening ? 
        language === 'hi' ? 'रुकें...' : 
        language === 'ta' ? 'நிறுத்து...' : 
        'Stop...' : 
        <>
          <Droplet className="h-4 w-4 mr-1 text-red-500" />
          {language === 'hi' ? 'वॉइस से अनुरोध करें' : 
           language === 'ta' ? 'குரல் மூலம் கோரிக்கை' : 
           'Voice Request'}
        </>
      }
    </Button>
  );
};

export default VoiceBloodDonationRequest;
