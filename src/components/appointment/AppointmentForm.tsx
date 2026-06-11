
import { useState } from 'react';
import { Calendar, Clock, MapPin, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassCard from '../ui/GlassCard';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceBookingButton from '@/components/voice/VoiceBookingButton';

const AppointmentForm = () => {
  const { t, language } = useLanguage();
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Gynecology',
    'Ophthalmology',
    'Psychiatry',
  ];

  return (
    <GlassCard className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('appointment.bookAppointment')}</h2>
        
        {/* Replace Mic button with VoiceBookingButton */}
        <VoiceBookingButton 
          onSpecialtySelect={setSelectedSpecialty}
          onDateSelect={setPreferredDate}
          onTimeSelect={setPreferredTime}
          onReasonUpdate={setReasonForVisit}
          onAppointmentTypeChange={setAppointmentType}
        />
      </div>

      <Tabs defaultValue="in-person" className="mb-6" value={appointmentType} onValueChange={setAppointmentType}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="in-person" className="rounded-full">
            <MapPin className="h-4 w-4 mr-2" />
            {t('appointment.inPersonVisit')}
          </TabsTrigger>
          <TabsTrigger value="virtual" className="rounded-full">
            <CalendarCheck className="h-4 w-4 mr-2" />
            {t('appointment.virtualConsultation')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in-person" className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'hi' ? 
              'व्यक्तिगत परीक्षण के लिए हेल्थकेयर प्रोवाइडर से उनके कार्यालय में मिलें।' :
              language === 'ta' ? 
              'நேரடி பரிசோதனைக்காக அவர்களின் அலுவலகத்தில் ஒரு சுகாதார வழங்குநரைப் பார்க்கவும்.' :
              'Visit a healthcare provider in their office for an in-person examination.'}
          </p>
        </TabsContent>
        <TabsContent value="virtual" className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'hi' ? 
              'कहीं से भी सुरक्षित वीडियो कॉल के माध्यम से हेल्थकेयर प्रोवाइडर से परामर्श करें।' :
              language === 'ta' ? 
              'எங்கிருந்தும் பாதுகாப்பான வீடியோ அழைப்பு மூலம் ஒரு சுகாதார வழங்குநருடன் ஆலோசனை செய்யுங்கள்.' :
              'Consult with a healthcare provider via secure video call from anywhere.'}
          </p>
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('appointment.selectSpecialty')}</label>
          <div className="grid grid-cols-2 gap-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                className={`text-xs sm:text-sm py-2.5 px-2 rounded-lg border transition-all ${
                  selectedSpecialty === specialty
                    ? 'bg-health-light-blue border-health-blue text-health-blue font-medium'
                    : 'bg-white border-border hover:border-health-blue dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('appointment.preferredDate')}</label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none dark:bg-gray-800 dark:border-gray-700"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">{t('appointment.preferredTime')}</label>
            <div className="relative">
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none dark:bg-gray-800 dark:border-gray-700"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('appointment.reasonForVisit')}</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none resize-none dark:bg-gray-800 dark:border-gray-700"
            rows={3}
            placeholder={language === 'hi' ? 
              'अपने लक्षणों या अपॉइंटमेंट के कारण का संक्षेप में वर्णन करें...' :
              language === 'ta' ?
              'உங்கள் அறிகுறிகள் அல்லது சந்திப்புக்கான காரணத்தை சுருக்கமாக விவரிக்கவும்...' :
              'Briefly describe your symptoms or reason for the appointment...'}
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
          ></textarea>
        </div>

        <Button className="w-full rounded-full h-12 bg-health-blue hover:bg-health-blue/90 shadow-md">
          {t('appointment.findAvailableAppointments')}
        </Button>
      </div>
    </GlassCard>
  );
};

export default AppointmentForm;
