
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useVoiceAssistant from '@/hooks/useVoiceAssistant';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceBookingButtonProps {
  onSpecialtySelect: (specialty: string) => void;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onReasonUpdate: (reason: string) => void;
  onAppointmentTypeChange: (type: string) => void;
}

const VoiceBookingButton: React.FC<VoiceBookingButtonProps> = ({
  onSpecialtySelect,
  onDateSelect,
  onTimeSelect,
  onReasonUpdate,
  onAppointmentTypeChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  
  // Setup commands for the voice booking
  const commands = {
    // Specialty commands
    'cardiology': () => onSpecialtySelect('Cardiology'),
    'dermatology': () => onSpecialtySelect('Dermatology'),
    'neurology': () => onSpecialtySelect('Neurology'),
    'pediatrics': () => onSpecialtySelect('Pediatrics'),
    'orthopedics': () => onSpecialtySelect('Orthopedics'),
    'gynecology': () => onSpecialtySelect('Gynecology'),
    'ophthalmology': () => onSpecialtySelect('Ophthalmology'),
    'psychiatry': () => onSpecialtySelect('Psychiatry'),
    
    // Appointment type commands
    'virtual appointment': () => onAppointmentTypeChange('virtual'),
    'in person appointment': () => onAppointmentTypeChange('in-person'),
    
    // Hindi commands
    'हृदय रोग': () => onSpecialtySelect('Cardiology'),
    'त्वचा': () => onSpecialtySelect('Dermatology'),
    'न्यूरोलॉजी': () => onSpecialtySelect('Neurology'),
    'बच्चों का डॉक्टर': () => onSpecialtySelect('Pediatrics'),
    'वर्चुअल': () => onAppointmentTypeChange('virtual'),
    'व्यक्तिगत': () => onAppointmentTypeChange('in-person'),
    
    // Tamil commands
    'இதய மருத்துவம்': () => onSpecialtySelect('Cardiology'),
    'தோல் மருத்துவம்': () => onSpecialtySelect('Dermatology'),
    'நரம்பியல்': () => onSpecialtySelect('Neurology'),
    'குழந்தை மருத்துவம்': () => onSpecialtySelect('Pediatrics'),
    'மெய்நிகர்': () => onAppointmentTypeChange('virtual'),
    'நேரில்': () => onAppointmentTypeChange('in-person')
  };
  
  // Process dates from natural language
  const processDateCommand = (transcript: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Standard date detection
    if (transcript.includes('today')) {
      onDateSelect(today.toISOString().split('T')[0]);
    } else if (transcript.includes('tomorrow')) {
      onDateSelect(tomorrow.toISOString().split('T')[0]);
    }
    
    // Hindi terms
    if (transcript.includes('आज')) {
      onDateSelect(today.toISOString().split('T')[0]);
    } else if (transcript.includes('कल')) {
      onDateSelect(tomorrow.toISOString().split('T')[0]);
    }
    
    // Tamil terms
    if (transcript.includes('இன்று')) {
      onDateSelect(today.toISOString().split('T')[0]);
    } else if (transcript.includes('நாளை')) {
      onDateSelect(tomorrow.toISOString().split('T')[0]);
    }
    
    // Time processing
    if (transcript.includes('morning')) {
      onTimeSelect('09:00');
    } else if (transcript.includes('afternoon')) {
      onTimeSelect('14:00');
    } else if (transcript.includes('evening')) {
      onTimeSelect('18:00');
    }
    
    // Hindi time
    if (transcript.includes('सुबह')) {
      onTimeSelect('09:00');
    } else if (transcript.includes('दोपहर')) {
      onTimeSelect('14:00');
    } else if (transcript.includes('शाम')) {
      onTimeSelect('18:00');
    }
    
    // Tamil time
    if (transcript.includes('காலை')) {
      onTimeSelect('09:00');
    } else if (transcript.includes('மதியம்')) {
      onTimeSelect('14:00');
    } else if (transcript.includes('மாலை')) {
      onTimeSelect('18:00');
    }
  };
  
  // Extract reason for visit
  const extractReasonForVisit = (transcript: string) => {
    const reasonPhrases = ['reason for visit', 'visit for', 'reason is', 'because', 'symptoms are', 'problem is'];
    const hindiPhrases = ['कारण', 'समस्या', 'लक्षण'];
    const tamilPhrases = ['காரணம்', 'அறிகுறிகள்', 'பிரச்சனை'];
    
    const allPhrases = [...reasonPhrases, ...hindiPhrases, ...tamilPhrases];
    
    for (const phrase of allPhrases) {
      if (transcript.includes(phrase)) {
        const parts = transcript.split(phrase);
        if (parts.length > 1 && parts[1].trim()) {
          onReasonUpdate(parts[1].trim());
          return;
        }
      }
    }
  };
  
  const { isListening, startListening, stopListening } = useVoiceAssistant({
    commands,
    onResult: (transcript) => {
      // Process dates and times in the transcript
      processDateCommand(transcript);
      
      // Extract reason for visit
      extractReasonForVisit(transcript);
      
      // Show what was heard
      toast.info(
        language === 'hi' ? `मैंने सुना: ${transcript}` :
        language === 'ta' ? `நான் கேட்டது: ${transcript}` :
        `I heard: ${transcript}`
      );
    }
  });
  
  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setIsExpanded(true);
      
      // Show a help toast
      toast.info(
        language === 'hi' ? 
          "आप बोल सकते हैं: विशेषज्ञता, तारीख, समय, या अपॉइंटमेंट का कारण" :
        language === 'ta' ? 
          "நீங்கள் பேசலாம்: நிபுணத்துவம், தேதி, நேரம், அல்லது சந்திப்புக்கான காரணம்" :
          "You can say: specialty, date, time, or reason for appointment"
      );
    }
  };
  
  return (
    <div className="relative">
      <Button
        onClick={handleVoiceCommand}
        variant="outline"
        size="sm"
        className={`rounded-full flex items-center gap-2 ${isListening ? 'border-health-red text-health-red animate-pulse' : 'border-health-blue'}`}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {isExpanded ? (
          isListening ? 
            language === 'hi' ? 'बोलना बंद करें...' : 
            language === 'ta' ? 'பேச்சை நிறுத்து...' : 
            'Stop Speaking...' : 
            language === 'hi' ? 'वॉइस सहायक बंद' : 
            language === 'ta' ? 'குரல் உதவியாளர் நிறுத்து' : 
            'Voice Assistant Off'
        ) : (
          language === 'hi' ? 'वॉइस से बुक करें' : 
          language === 'ta' ? 'குரலால் முன்பதிவு செய்' : 
          'Book with Voice'
        )}
      </Button>
    </div>
  );
};

export default VoiceBookingButton;
