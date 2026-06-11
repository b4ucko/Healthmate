
import { useState } from 'react';
import { ArrowRight, Mic, Calendar, Activity, PlusCircle, Clock, Ambulance } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import useVoiceAssistant from '@/hooks/useVoiceAssistant';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const commands = {
    'emergency appointment': () => navigate('/emergency-appointment'),
    'urgent appointment': () => navigate('/emergency-appointment'),
    'book appointment': () => navigate('/doctors'),
    'find doctor': () => navigate('/doctors'),
    'emergency': () => navigate('/emergency'),
    'pharmacy': () => navigate('/pharmacy'),
    'sign in': () => navigate('/sign-in'),
    'sign up': () => navigate('/sign-up'),
  };
  
  const { isListening, startListening } = useVoiceAssistant({ 
    commands,
    onListening: (listening) => console.log('Voice assistant listening:', listening)
  });

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-health-light-blue/30 to-transparent -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-balance">
                {t('home.hero.heading')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg text-balance">
                {t('home.hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <Button 
                className="rounded-full h-12 px-6 bg-health-blue hover:bg-health-blue/90 shadow-md flex-1 sm:flex-none"
                onClick={() => navigate('/doctors')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('home.hero.ctaMain')}
              </Button>
              <Button 
                variant="outline" 
                className={`rounded-full h-12 px-6 border-2 flex-1 sm:flex-none ${isListening ? 'border-health-red animate-pulse' : 'border-health-blue'}`}
                onClick={startListening}
              >
                <Mic className={`w-4 h-4 mr-2 ${isListening ? 'text-health-red' : 'text-health-blue'}`} />
                {isListening ? t('home.hero.listening') : t('home.hero.voiceAssistant')}
              </Button>
              <Button 
                className="rounded-full h-12 px-6 bg-health-red hover:bg-health-red/90 shadow-md flex-1 sm:flex-none"
                onClick={() => navigate('/emergency-appointment')}
              >
                <Ambulance className="w-4 h-4 mr-2" />
                {t('home.hero.emergencyAppointment')}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">1000+</span> {t('home.hero.doctorsAvailable')}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 animate-scale-in">
              <div className="space-y-4 lg:space-y-6">
                <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/60 shadow-glass flex items-start gap-4 min-h-[120px]">
                  <div className="w-12 h-12 rounded-full bg-health-light-blue flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-health-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{t('home.hero.quickScheduling')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('home.hero.quickSchedulingDesc')}</p>
                  </div>
                </div>
                
                <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/60 shadow-glass flex items-start gap-4 min-h-[120px]">
                  <div className="w-12 h-12 rounded-full bg-health-red/20 flex items-center justify-center flex-shrink-0">
                    <Ambulance className="w-6 h-6 text-health-red" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{t('home.hero.emergencyAssistance')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('home.hero.emergencyAssistanceDesc')}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 lg:space-y-6 md:mt-12">
                <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/60 shadow-glass flex items-start gap-4 min-h-[120px]">
                  <div className="w-12 h-12 rounded-full bg-health-light-blue flex items-center justify-center flex-shrink-0">
                    <Mic className="w-6 h-6 text-health-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{t('home.hero.voiceAssistantCard')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('home.hero.voiceAssistantCardDesc')}</p>
                  </div>
                </div>
                
                <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/60 shadow-glass flex items-start gap-4 min-h-[120px]">
                  <div className="w-12 h-12 rounded-full bg-health-light-blue flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-health-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{t('home.hero.support247')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('home.hero.support247Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-health-blue/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-health-green/10 rounded-full blur-xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-health-blue/10 rounded-full blur-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
