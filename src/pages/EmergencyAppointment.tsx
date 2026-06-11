
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Ambulance, Calendar, Clock, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/GlassCard';
import Layout from '@/components/layout/Layout';

const EmergencyAppointment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Emergency appointment request submitted', {
        description: 'A healthcare professional will contact you shortly',
      });
      setIsSubmitting(false);
      navigate('/emergency');
    }, 1500);
  };

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-health-red/10 flex items-center justify-center mr-3">
                  <Ambulance className="h-5 w-5 text-health-red" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Emergency Appointment</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Request an immediate appointment without signing in. For life-threatening emergencies, please call 911.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main form */}
              <div className="md:col-span-2">
                <GlassCard highlight="top" className="animate-scale-in">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                          Your Name <span className="text-health-red">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Phone Number <span className="text-health-red">*</span>
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-sm font-medium">
                        Your Location <span className="text-health-red">*</span>
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter your address or area"
                        required
                      />
                    </div>

                    <div className="pt-4 flex justify-center">
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto px-8 py-6 h-auto rounded-full bg-health-red hover:bg-health-red/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Request Emergency Appointment'}
                      </Button>
                    </div>
                  </form>
                </GlassCard>
              </div>

              {/* Side info */}
              <div className="space-y-6">
                <GlassCard className="bg-health-blue/5 animate-slide-up">
                  <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center mr-3">
                        <Phone className="h-4 w-4 text-health-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">24/7 Emergency Line</p>
                        <p className="text-lg font-bold text-health-blue">1-800-HEALTH</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center mr-3">
                        <Ambulance className="h-4 w-4 text-health-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ambulance</p>
                        <p className="text-lg font-bold text-health-blue">911</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="bg-health-green/5 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <h3 className="text-lg font-medium mb-4">What to Expect</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex">
                      <Clock className="h-5 w-5 text-health-green mr-2 flex-shrink-0" />
                      <span>Quick response within 15-30 minutes</span>
                    </li>
                    <li className="flex">
                      <Phone className="h-5 w-5 text-health-green mr-2 flex-shrink-0" />
                      <span>A healthcare professional will call you</span>
                    </li>
                    <li className="flex">
                      <User className="h-5 w-5 text-health-green mr-2 flex-shrink-0" />
                      <span>Assessment of your condition</span>
                    </li>
                    <li className="flex">
                      <Calendar className="h-5 w-5 text-health-green mr-2 flex-shrink-0" />
                      <span>Immediate appointment scheduling</span>
                    </li>
                    <li className="flex">
                      <MapPin className="h-5 w-5 text-health-green mr-2 flex-shrink-0" />
                      <span>Directions to nearest facility if needed</span>
                    </li>
                  </ul>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default EmergencyAppointment;
