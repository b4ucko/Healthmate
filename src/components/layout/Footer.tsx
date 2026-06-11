
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, language, setLanguage } = useLanguage();
  
  const footerLinks = [
    {
      title: t('common.company'),
      links: [
        { name: t('common.home'), href: '/about' },
        { name: t('common.careers'), href: '/careers' },
        { name: t('common.press'), href: '/press' },
        { name: t('common.blog'), href: '/blogs' },
      ],
    },
    {
      title: t('common.services'),
      links: [
        { name: t('common.findDoctor'), href: '/doctors' },
        { name: t('common.emergencyCare'), href: '/emergency' },
        { name: t('common.onlineConsultation'), href: '/appointments' },
        { name: t('common.pharmacyDelivery'), href: '/pharmacy' },
      ],
    },
    {
      title: t('common.resources'),
      links: [
        { name: t('common.helpCenter'), href: '/help' },
        { name: t('common.privacy'), href: '/privacy' },
        { name: t('common.terms'), href: '/terms' },
        { name: t('common.accessibility'), href: '/accessibility' },
      ],
    },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <footer className="bg-slate-900 text-slate-100 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="HealthMate Logo" className="w-6 h-6 object-contain" />
              <span className="text-lg font-bold">HealthMate</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-medium">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 text-center md:text-left">
            &copy; {currentYear} HealthMate. {t('common.copyright')}.
          </p>
          <div className="flex items-center gap-4">
            <select
              className="text-sm bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-health-blue text-slate-100"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
              <option value="mr">मराठी</option>
              <option value="te">తెలుగు</option>
              <option value="bn">বাংলা</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
