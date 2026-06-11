
import { Mic, ArrowRight, Heart, Shield, Users, Star, Phone, MapPin, Clock, Stethoscope, Pill, Baby, Droplets, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Layout from '@/components/layout/Layout';
import VoiceAssistantChat from '@/components/voice/VoiceAssistantChat';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import HealthRecommendation from '@/components/ai/HealthRecommendation';
import { motion, type Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Index = () => {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const testimonials = [
    { quote: "The voice assistant made booking my appointment so easy. I just told it what I needed and when, and it handled everything!", author: "Priya Sharma", role: "Patient", rating: 5 },
    { quote: "As a doctor, I appreciate how the platform streamlines my schedule and makes it easy to connect with patients.", author: "Dr. Rajesh Gupta", role: "Cardiologist", rating: 5 },
    { quote: "The emergency feature helped me find immediate care when my son had an accident. It was a lifesaver!", author: "Vikram Patel", role: "Parent", rating: 5 },
    { quote: "Ordering medicines online with prescription scanning saved me so much time. Delivery was quick too!", author: "Anita Desai", role: "Regular Customer", rating: 4 },
    { quote: "The pregnancy care section provided invaluable guidance throughout my journey. Highly recommended!", author: "Meera Krishnan", role: "New Mother", rating: 5 },
    { quote: "Blood donation was seamless. The platform connected me with nearby camps and even sent reminders.", author: "Arjun Malhotra", role: "Blood Donor", rating: 5 },
  ];

  const stats = [
    { value: "50,000+", label: "Patients Served", icon: Users },
    { value: "1,000+", label: "Expert Doctors", icon: Stethoscope },
    { value: "24/7", label: "Emergency Support", icon: Phone },
    { value: "500+", label: "Cities Covered", icon: MapPin },
  ];

  const services = [
    { icon: Stethoscope, title: "Doctor Consultations", desc: "Connect with specialists across 30+ departments for in-person or video consultations.", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { icon: Pill, title: "Online Pharmacy", desc: "Order medicines with prescription scanning, get doorstep delivery with up to 25% off.", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    { icon: Droplets, title: "Blood Bank", desc: "Find blood donors near you or register as a donor. Save lives with a simple click.", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    { icon: Baby, title: "Pregnancy Care", desc: "Comprehensive prenatal and postnatal care with expert guidance at every step.", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
    { icon: Heart, title: "Health Checkups", desc: "Preventive health packages tailored to your age, gender, and medical history.", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
    { icon: Shield, title: "Emergency Services", desc: "One-tap emergency booking with nearest hospital routing and ambulance coordination.", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  ];

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/patient-dashboard' : '/sign-up');
  };

  return (
    <Layout>
      <main>
        <Hero />
        <Features />

        {/* Stats Section */}
        <section className="py-16 bg-primary text-primary-foreground overflow-hidden">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div key={i} className="text-center" variants={fadeUp} custom={i}>
                  <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-20 md:py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Comprehensive Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From consultations to emergencies, we provide end-to-end healthcare solutions designed for modern India.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow duration-300"
                  variants={scaleIn}
                  custom={i}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get started in 3 simple steps — healthcare made accessible for everyone.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-border" />
              {[
                { step: "01", title: "Create Your Account", desc: "Sign up in seconds with your phone number or email. Your health profile is securely stored." },
                { step: "02", title: "Choose a Service", desc: "Browse doctors, order medicines, book health checkups, or access emergency services." },
                { step: "03", title: "Get Care Delivered", desc: "Consult online or visit in-person. Get medicines delivered. Track everything from your dashboard." },
              ].map((item, i) => (
                <motion.div key={i} className="text-center" variants={fadeUp} custom={i}>
                  <motion.div
                    className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-6 relative z-10"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Health Recommendation */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.aiHealth.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.aiHealth.subtitle')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <HealthRecommendation />
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.testimonials.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.testimonials.subtitle')}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {testimonials.map((testimonial, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}>
                  <div className="glass-card h-full flex flex-col rounded-3xl p-8 border border-white/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white/80 dark:bg-card/80">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="italic text-muted-foreground mb-6 flex-1 leading-relaxed text-sm md:text-base">"{testimonial.quote}"</p>
                    <div className="mt-auto flex items-center gap-3 border-t pt-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{testimonial.author[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm md:text-base leading-none mb-1">{testimonial.author}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trust & Partners */}
        <motion.section
          className="py-16 bg-muted/30 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div className="text-center mb-12" variants={fadeUp}>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Trusted by Leading Institutions</h2>
              <p className="text-muted-foreground">We partner with top hospitals and healthcare providers across India</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {["AIIMS Delhi", "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare"].map((name, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-center p-6 rounded-xl border bg-card"
                  variants={scaleIn}
                  custom={i}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-lg font-semibold text-muted-foreground">{name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Health Tips */}
        <section className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Health Tips & Articles</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stay informed with expert-curated health content to help you live better.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {[
                { title: "10 Foods That Boost Your Immunity Naturally", category: "Nutrition", readTime: "5 min read", image: "/immunity-foods.png" },
                { title: "Understanding Diabetes: Prevention & Management", category: "Chronic Care", readTime: "8 min read", image: "/diabetes-management.png" },
                { title: "Mental Health: Signs You Shouldn't Ignore", category: "Wellness", readTime: "6 min read", image: "/mental-health.png" },
              ].map((article, i) => (
                <motion.div
                  key={i}
                  className="group rounded-3xl border bg-card overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                  variants={fadeUp}
                  custom={i}
                  onClick={() => navigate('/blogs')}
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{article.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base md:text-lg leading-snug group-hover:text-primary transition-colors">{article.title}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="outline" className="rounded-full" onClick={() => navigate('/blogs')}>
                View All Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div className="px-6 py-16 md:p-16 text-primary-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">{t('home.cta.title')}</h2>
                    <p className="text-lg opacity-90">{t('home.cta.subtitle')}</p>
                    <div className="pt-2 flex flex-wrap gap-4">
                      <Button
                        size="lg"
                        className="rounded-full bg-background text-foreground hover:bg-background/90"
                        onClick={handleGetStarted}
                      >
                        {t('common.getStarted')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full border border-white text-white hover:bg-white/15 bg-transparent hover:text-white transition-colors"
                        onClick={() => setAssistantOpen(true)}
                      >
                        <Mic className="mr-2 h-4 w-4" />
                        {t('common.voiceAssistant')}
                      </Button>
                    </div>
                  </motion.div>
                  <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent z-10" />
                    <img
                      src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      alt="Doctor with patient"
                      className="w-full h-full object-cover rounded-r-3xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <VoiceAssistantChat initialOpen={assistantOpen} />
    </Layout>
  );
};

export default Index;
