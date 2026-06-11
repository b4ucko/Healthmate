import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, X, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentForm from '@/components/appointment/AppointmentForm';
import GlassCard from '@/components/ui/GlassCard';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { parse } from 'date-fns';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'canceled';
  imageUrl: string;
  doctorId?: string;
  patientName?: string;
  patientId?: string;
}

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { userInfo, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to view and book appointments");
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    const loadAppointments = () => {
      try {
        const storedAppointments = localStorage.getItem('doctorAppointments');
        if (storedAppointments) {
          const parsedAppointments: any[] = JSON.parse(storedAppointments);
          
          let filteredAppointments = [];
          if (userInfo?.userType === 'doctor') {
            filteredAppointments = parsedAppointments.filter(apt => 
              apt.doctorId === userInfo.id || apt.doctorName === userInfo.name
            );
          } else if (userInfo?.userType === 'patient') {
            filteredAppointments = parsedAppointments.filter(apt => 
              apt.patientEmail === userInfo.email || apt.patientName === userInfo.name
            );
          }
          
          const formattedAppointments: Appointment[] = filteredAppointments.map(apt => ({
            id: apt.id,
            doctorName: apt.doctorName,
            specialty: apt.specialty || 'General Physician',
            date: apt.date,
            time: apt.time,
            type: apt.type || 'in-person',
            status: apt.status === 'canceled' ? 'canceled' : 
                   parse(`${apt.date} ${apt.time}`, 'yyyy-MM-dd h:mm a', new Date()) < new Date() ? 'completed' : 'upcoming',
            imageUrl: apt.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
            doctorId: apt.doctorId,
            patientName: apt.patientName,
            patientId: apt.patientId,
          }));
          
          setAppointments(formattedAppointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast.error('Failed to load appointments');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [userInfo, isAuthenticated]);

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  const cancelAppointment = (id: string) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === id ? {...apt, status: 'canceled' as const} : apt
    );
    
    setAppointments(updatedAppointments);
    
    const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    const appointmentToCancel = storedAppointments.find((apt: any) => apt.id === id);
    
    const updatedStoredAppointments = storedAppointments.map((apt: any) => 
      apt.id === id ? {...apt, status: 'canceled'} : apt
    );
    localStorage.setItem('doctorAppointments', JSON.stringify(updatedStoredAppointments));
    
    console.log(`Sending SMS notification to 9819428182: Your appointment with ${appointmentToCancel.doctorName} scheduled for ${appointmentToCancel.date} at ${appointmentToCancel.time} has been cancelled.`);
    
    toast.success('Appointment cancelled successfully. SMS notification sent.');
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setShowRescheduleDialog(true);
  };

  const handleReschedule = () => {
    if (!selectedAppointment || !newDate || !newTime) {
      toast.error('Please select a new date and time');
      return;
    }

    const updatedAppointments = appointments.map(apt => 
      apt.id === selectedAppointment.id 
        ? {...apt, date: newDate, time: newTime} 
        : apt
    );
    setAppointments(updatedAppointments);
    
    const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    const updatedStoredAppointments = storedAppointments.map((apt: any) => 
      apt.id === selectedAppointment.id 
        ? {...apt, date: newDate, time: newTime} 
        : apt
    );
    localStorage.setItem('doctorAppointments', JSON.stringify(updatedStoredAppointments));
    
    console.log(`Sending SMS notification to 9819428182: Your appointment with ${selectedAppointment.doctorName} has been rescheduled to ${newDate} at ${newTime}.`);
    
    toast.success(`Appointment rescheduled to ${newDate} at ${newTime}. SMS notification sent.`);
    setShowRescheduleDialog(false);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to view and book appointments.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/sign-in')}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => navigate('/sign-up')}>
                Create Account
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">My Appointments</h1>
              <p className="text-muted-foreground max-w-2xl">
                Manage your upcoming appointments and view past visits with healthcare providers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Tabs 
                  defaultValue="upcoming" 
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Past</TabsTrigger>
                    <TabsTrigger value="canceled">Canceled</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4 mt-6 animate-fade-in">
                    {loading ? (
                      <div className="text-center p-8">Loading appointments...</div>
                    ) : filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <GlassCard key={appointment.id} variant="hover" className="animate-slide-up">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={appointment.imageUrl} 
                                alt={appointment.doctorName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{appointment.doctorName}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-full"
                                    onClick={() => handleRescheduleClick(appointment)}
                                  >
                                    Reschedule
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-full text-health-red border-health-red hover:bg-health-red/10"
                                    onClick={() => cancelAppointment(appointment.id)}
                                  >
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                                <div className="flex items-center text-sm">
                                  <Calendar className="text-health-blue h-4 w-4 mr-1.5" />
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="text-health-blue h-4 w-4 mr-1.5" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center text-sm">
                                  {appointment.type === 'video' ? (
                                    <>
                                      <Video className="text-health-blue h-4 w-4 mr-1.5" />
                                      Video Consultation
                                    </>
                                  ) : (
                                    <>
                                      <User className="text-health-blue h-4 w-4 mr-1.5" />
                                      In-Person Visit
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  size="sm" 
                                  className="rounded-full bg-health-blue hover:bg-health-blue/90"
                                  onClick={() => window.open('tel:+1234567890')}
                                >
                                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                                  Call
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="rounded-full bg-health-blue hover:bg-health-blue/90"
                                  onClick={() => window.open('sms:+1234567890')}
                                >
                                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                                  Message
                                </Button>
                                {appointment.type === 'video' && (
                                  <Button 
                                    size="sm" 
                                    className="rounded-full bg-health-blue hover:bg-health-blue/90"
                                  >
                                    <Video className="h-3.5 w-3.5 mr-1.5" />
                                    Join Video
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white/60 dark:bg-white/5 rounded-lg shadow-sm border border-border/30">
                        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
                        <h3 className="mt-4 text-lg font-medium">No upcoming appointments</h3>
                        <p className="text-muted-foreground mt-1">
                          Schedule a new appointment to get started
                        </p>
                        <Button 
                          className="mt-4 rounded-full bg-health-blue hover:bg-health-blue/90"
                          onClick={() => navigate('/doctors')}
                        >
                          Find a Doctor
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-6 animate-fade-in">
                    {loading ? (
                      <div className="text-center p-8">Loading appointments...</div>
                    ) : filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <GlassCard key={appointment.id} variant="hover" className="animate-slide-up">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={appointment.imageUrl} 
                                alt={appointment.doctorName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{appointment.doctorName}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                                </div>
                                <div>
                                  <span className="inline-flex items-center rounded-full bg-health-light-blue text-health-blue px-2.5 py-0.5 text-xs font-medium">
                                    Completed
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                                <div className="flex items-center text-sm">
                                  <Calendar className="text-health-blue h-4 w-4 mr-1.5" />
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="text-health-blue h-4 w-4 mr-1.5" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center text-sm">
                                  {appointment.type === 'video' ? (
                                    <>
                                      <Video className="text-health-blue h-4 w-4 mr-1.5" />
                                      Video Consultation
                                    </>
                                  ) : (
                                    <>
                                      <User className="text-health-blue h-4 w-4 mr-1.5" />
                                      In-Person Visit
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-3 mt-4">
                                <Button variant="outline" size="sm" className="rounded-full">
                                  View Summary
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-full">
                                  Book Follow-up
                                </Button>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white/60 dark:bg-white/5 rounded-lg shadow-sm border border-border/30">
                        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
                        <h3 className="mt-4 text-lg font-medium">No past appointments</h3>
                        <p className="text-muted-foreground mt-1">
                          Your completed appointments will appear here
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="canceled" className="space-y-4 mt-6 animate-fade-in">
                    {loading ? (
                      <div className="text-center p-8">Loading appointments...</div>
                    ) : filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <GlassCard key={appointment.id} variant="hover" className="animate-slide-up">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={appointment.imageUrl} 
                                alt={appointment.doctorName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{appointment.doctorName}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                                </div>
                                <div>
                                  <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-xs font-medium">
                                    Canceled
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                                <div className="flex items-center text-sm">
                                  <Calendar className="text-health-blue h-4 w-4 mr-1.5" />
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="text-health-blue h-4 w-4 mr-1.5" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center text-sm">
                                  {appointment.type === 'video' ? (
                                    <>
                                      <Video className="text-health-blue h-4 w-4 mr-1.5" />
                                      Video Consultation
                                    </>
                                  ) : (
                                    <>
                                      <User className="text-health-blue h-4 w-4 mr-1.5" />
                                      In-Person Visit
                                    </>
                                  )}
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-4 rounded-full"
                                onClick={() => handleRescheduleClick(appointment)}
                              >
                                Reschedule Appointment
                              </Button>
                            </div>
                          </div>
                        </GlassCard>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white/60 dark:bg-white/5 rounded-lg shadow-sm border border-border/30">
                        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
                        <h3 className="mt-4 text-lg font-medium">No canceled appointments</h3>
                        <p className="text-muted-foreground mt-1">
                          Your canceled appointments will appear here
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold">Book a New Appointment</h2>
                <AppointmentForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Choose a new date and time for your appointment with {selectedAppointment?.doctorName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-date" className="text-right">
                Date
              </Label>
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="col-span-3"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-time" className="text-right">
                Time
              </Label>
              <select
                id="new-time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a time</option>
                {[
                  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
                ].map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule}>
              Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Appointments;
