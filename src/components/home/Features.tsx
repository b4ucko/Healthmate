
import { ShieldCheck, Stethoscope, Clock4, Languages, CreditCard, PlusCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { useLanguage } from '@/contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Stethoscope className="w-6 h-6 text-health-blue" />,
      title: t('home.features.expertDoctors'),
      description: t('home.features.expertDoctorsDesc')
    },
    {
      icon: <PlusCircle className="w-6 h-6 text-health-green" />,
      title: t('home.features.emergencyCare'),
      description: t('home.features.emergencyCareDesc')
    },
    {
      icon: <Clock4 className="w-6 h-6 text-health-yellow" />,
      title: t('home.features.availability247'),
      description: t('home.features.availability247Desc')
    },
    {
      icon: <Languages className="w-6 h-6 text-health-blue" />,
      title: t('home.features.multiLanguage'),
      description: t('home.features.multiLanguageDesc')
    },
    {
      icon: <CreditCard className="w-6 h-6 text-health-blue" />,
      title: t('home.features.securePayments'),
      description: t('home.features.securePaymentsDesc')
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-health-green" />,
      title: t('home.features.privacyProtected'),
      description: t('home.features.privacyProtectedDesc')
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.features.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <GlassCard variant="hover" className="h-full">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
