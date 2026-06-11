
import { Phone, Ambulance, HeartPulse, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';
import EmergencyFinder from '@/components/emergency/EmergencyFinder';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { toast } from 'sonner';
import FirstAidGuideDialog from '@/components/emergency/FirstAidGuideDialog';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const firstAidGuides = [
  {
    title: 'Chest Pain',
    steps: [
      'Have the person sit down, rest, and try to keep calm.',
      'Loosen any tight clothing.',
      'Ask if the person takes any chest pain medication.',
      'If the pain persists for more than a few minutes, call emergency services immediately.',
    ],
  },
  {
    title: 'Choking',
    steps: [
      'Stand behind the person and slightly to one side.',
      'Support their chest with one hand and lean them forward.',
      'Give up to 5 sharp blows between their shoulder blades with the heel of your hand.',
      'If back blows don\'t help, give abdominal thrusts.',
    ],
  },
  {
    title: 'Severe Bleeding',
    steps: [
      'Apply direct pressure on the wound with a clean cloth or bandage.',
      'If blood soaks through, add more material on top and continue pressing.',
      'Elevate the wound above the heart if possible.',
      'Keep pressure applied until emergency help arrives.',
    ],
  },
];

const Emergency = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showFirstAidGuide, setShowFirstAidGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const handlePhoneCall = (phoneNumber: string, serviceName: string) => {
    // Use the tel: protocol to open the device's phone app
    window.location.href = `tel:${phoneNumber}`;
    toast.success(`Calling ${serviceName}...`);
  };

  const handleViewGuide = (guideTitle: string) => {
    setSelectedGuide(guideTitle);
    setShowFirstAidGuide(true);
  };

  const handleEmergencyAppointment = () => {
    navigate('/emergency-appointment');
  };

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-health-red/10 flex items-center justify-center mr-3">
                  <Ambulance className="h-5 w-5 text-health-red" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{t('emergency.title')}</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {t('emergency.subtitle')}
              </p>
            </div>

            {/* Emergency appointment banner */}
            <div className="mb-6 animate-pulse">
              <GlassCard className="bg-health-red/10 border border-health-red/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-health-red/20 flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-health-red" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{t('emergency.urgentAttention')}</h2>
                      <p className="text-muted-foreground">{t('emergency.urgentSubtitle')}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleEmergencyAppointment}
                    className="bg-health-red hover:bg-health-red/90 rounded-full px-6"
                  >
                    {t('emergency.bookEmergency')}
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* Emergency Services */}
            <div className="mb-12 animate-scale-in">
              <EmergencyFinder />
            </div>

            {/* Emergency contacts */}
            <div className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">{t('emergency.emergencyContacts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="bg-health-red/10">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-health-red/20 flex items-center justify-center">
                      <Ambulance className="h-5 w-5 text-health-red" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium">{t('emergency.ambulance')}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{t('emergency.ambulanceDesc')}</p>
                  <Button 
                    className="w-full rounded-full bg-health-red hover:bg-health-red/90"
                    onClick={() => handlePhoneCall('911', 'Ambulance Services')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call 911
                  </Button>
                </GlassCard>

                <GlassCard className="bg-health-blue/10">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-health-blue/20 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-health-blue" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium">{t('emergency.nurseLine')}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{t('emergency.nurseLineDesc')}</p>
                  <Button 
                    className="w-full rounded-full bg-health-blue hover:bg-health-blue/90"
                    onClick={() => handlePhoneCall('1-800-868-7710', 'Nurse Line')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Nurse Line
                  </Button>
                </GlassCard>

                <GlassCard className="bg-health-green/10">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-health-green/20 flex items-center justify-center">
                      <HeartPulse className="h-5 w-5 text-health-green" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium">{t('emergency.poisonControl')}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{t('emergency.poisonControlDesc')}</p>
                  <Button 
                    className="w-full rounded-full bg-health-green hover:bg-health-green/90"
                    onClick={() => handlePhoneCall('1-800-222-1222', 'Poison Control')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Poison Control
                  </Button>
                </GlassCard>
              </div>
            </div>

            {/* First Aid Guides */}
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">{t('emergency.firstAidGuides')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {firstAidGuides.map((guide, index) => (
                  <GlassCard key={index} variant="hover" className="animate-slide-up flex flex-col h-full" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex-grow">
                      <h3 className="text-xl font-medium mb-4">{guide.title}</h3>
                      <ol className="list-decimal pl-5 space-y-2 mb-6">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-full mt-auto"
                      onClick={() => handleViewGuide(guide.title)}
                    >
                      {t('emergency.viewDetailedGuide')}
                    </Button>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* First Aid Guide Modal */}
      <FirstAidGuideDialog 
        open={showFirstAidGuide} 
        onOpenChange={setShowFirstAidGuide} 
      />
    </Layout>
  );
};

export default Emergency;
