
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Baby, Calendar, Clock, CalendarRange, Phone, MessageSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const pregnancySpecialists = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Obstetrics & Gynecology",
    experience: "15 years",
    availability: "Mon, Wed, Fri",
    patients: 1200,
    image: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    id: 2,
    name: "Dr. Anjali Gupta",
    specialization: "Maternal-Fetal Medicine",
    experience: "12 years",
    availability: "Tue, Thu, Sat",
    patients: 980,
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 3,
    name: "Dr. Neha Patel",
    specialization: "Obstetrics & Gynecology",
    experience: "10 years",
    availability: "Mon, Tue, Thu",
    patients: 850,
    image: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    id: 4,
    name: "Dr. Sarah Johnson",
    specialization: "High-Risk Pregnancy",
    experience: "14 years",
    availability: "Wed, Fri, Sat",
    patients: 1050,
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const priorityTimeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "1:00 PM", "2:00 PM"
];

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 18 && Number(val) <= 60, {
    message: "Age must be between 18 and 60.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  pregnancyWeek: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 9, {
    message: "Pregnancy Month must be between 1 and 9.",
  }),
  appointmentType: z.enum(["regular", "emergency", "followup"], {
    required_error: "Please select an appointment type.",
  }),
});

const PregnancyCare = () => {
  const { userInfo } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: userInfo?.name || "",
      age: userInfo?.age || "",
      phone: userInfo?.phone || "",
      pregnancyWeek: "",
      appointmentType: "regular",
    },
  });

  const handleBookAppointment = (values: z.infer<typeof FormSchema>) => {
    if (!date || !selectedDoctor || !selectedTimeSlot) {
      toast.error("Please select a date, doctor, and time slot");
      return;
    }
    
    const doctor = pregnancySpecialists.find(d => d.id === selectedDoctor);
    
    // Create new appointment
    const newAppointment = {
      id: `appointment-${Date.now()}`,
      doctorId: selectedDoctor.toString(),
      doctorName: doctor?.name,
      specialty: doctor?.specialization,
      patientId: userInfo?.id || `patient-${Date.now()}`,
      patientName: values.fullName,
      patientEmail: userInfo?.email || "patient@example.com",
      patientPhone: values.phone,
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTimeSlot,
      type: "in-person",
      status: 'pending',
      imageUrl: doctor?.image,
      reason: `Pregnancy care - Week ${values.pregnancyWeek} - ${values.appointmentType} appointment`,
      isPregnancyPriority: true,
      pregnancyWeek: values.pregnancyWeek,
      appointmentType: values.appointmentType,
      createdAt: new Date().toISOString()
    };
    
    // Get existing appointments
    const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    
    // Add new appointment
    localStorage.setItem('doctorAppointments', JSON.stringify([newAppointment, ...storedAppointments]));
    
    // Send SMS notification
    console.log(`Sending SMS notification to 9819428182: Priority pregnancy appointment booked with ${doctor?.name} on ${format(date, 'MMMM do, yyyy')} at ${selectedTimeSlot}`);
    
    toast.success("Your priority pregnancy appointment has been booked successfully!", {
      description: `We've notified our team about your appointment with ${doctor?.name} on ${format(date, 'MMMM do, yyyy')} at ${selectedTimeSlot}. SMS notification sent.`
    });
    
    form.reset();
    setDate(undefined);
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
  };

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('pregnancyCare.title')}</h1>
              <p className="text-muted-foreground max-w-2xl">
                {t('pregnancyCare.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby className="h-5 w-5 text-health-blue" />
                    {t('pregnancyCare.quickBooking')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleBookAppointment)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('pregnancyCare.fullName')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('pregnancyCare.enterFullName')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('pregnancyCare.age')}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t('pregnancyCare.enterAge')} 
                                  type="number" 
                                  min="0" 
                                  {...field} 
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('pregnancyCare.phoneNumber')}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="tel"
                                  maxLength={10}
                                  placeholder={t('pregnancyCare.enterPhone')}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); // allow only numbers
                                    field.onChange(value.slice(0, 10)); // restrict to 10 digits
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="pregnancyWeek"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('pregnancyCare.pregnancyWeek')}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t('pregnancyCare.currentWeek')} 
                                  type="number" 
                                  min="1" 
                                  max="9" 
                                  {...field} 
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, "");
                                    if (value && Number(value) > 9) value = "9";
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="appointmentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('pregnancyCare.appointmentType')}</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value}
                                className="flex flex-wrap gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="regular" id="regular" />
                                  <FormLabel htmlFor="regular" className="font-normal">{t('pregnancyCare.regularCheckup')}</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="emergency" id="emergency" />
                                  <FormLabel htmlFor="emergency" className="font-normal">{t('pregnancyCare.emergency')}</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="followup" id="followup" />
                                  <FormLabel htmlFor="followup" className="font-normal">{t('pregnancyCare.followUp')}</FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <FormLabel>{t('pregnancyCare.selectDate')}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>{t('pregnancyCare.pickDate')}</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <FormLabel>{t('pregnancyCare.priorityTimeSlots')}</FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {priorityTimeSlots.map(slot => (
                              <Button
                                key={slot}
                                type="button"
                                variant={selectedTimeSlot === slot ? "default" : "outline"}
                                className="text-xs h-9"
                                onClick={() => setSelectedTimeSlot(slot)}
                              >
                                <Clock className="mr-1 h-3 w-3" />
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={!date || !selectedDoctor || !selectedTimeSlot}
                      >
                        {t('pregnancyCare.bookPriorityAppointment')}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarRange className="h-5 w-5 text-health-blue" />
                      {t('pregnancyCare.chooseSpecialist')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pregnancySpecialists.map(doctor => (
                      <div 
                        key={doctor.id}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          selectedDoctor === doctor.id ? "border-health-blue bg-health-light-blue/20" : ""
                        )}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover" 
                          />
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                {doctor.experience}
                              </span>
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                                {doctor.patients}+ Patients
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm mt-2">Available: {doctor.availability}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="w-full flex items-center justify-center gap-1">
                             <Phone className="h-3 w-3" />
                            {t('pregnancyCare.call')}
                          </Button>
                          <Button size="sm" variant="outline" className="w-full flex items-center justify-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {t('pregnancyCare.chat')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('pregnancyCare.priorityBenefits')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">✓ {t('pregnancyCare.skipWaiting')}</p>
                    <p className="text-sm">✓ {t('pregnancyCare.sameDayAppointments')}</p>
                    <p className="text-sm">✓ {t('pregnancyCare.directSpecialist')}</p>
                    <p className="text-sm">✓ {t('pregnancyCare.support247')}</p>
                    <p className="text-sm">✓ {t('pregnancyCare.prenatalCare')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PregnancyCare;
