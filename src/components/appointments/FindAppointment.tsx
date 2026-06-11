
import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarIcon, Check, User, Building } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Custom hook to fetch doctors data
const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate random doctors
        const specialties = ['Cardiologist', 'Dermatologist', 'Pulmonologist', 'Allergist', 'Neurologist', 'Orthopedist'];
        const locations = [
          'Medical Center, Building A',
          'Dermatology Clinic, Suite 200',
          'Respiratory Care Center',
          'Allergy & Asthma Center',
          'Neurology Institute',
          'Orthopedic Center'
        ];
        
        const generatedDoctors = Array.from({ length: 6 }, (_, i) => {
          const gender = Math.random() > 0.5 ? 'men' : 'women';
          const index = Math.floor(Math.random() * 70);
          const availableDays = [];
          
          // Randomly assign 2-5 available days per week
          for (let d = 1; d <= 5; d++) {
            if (Math.random() > 0.4) {
              availableDays.push(d);
            }
          }
          
          // Ensure at least 2 days are available
          if (availableDays.length < 2) {
            availableDays.push(Math.floor(Math.random() * 5) + 1);
          }
          
          return {
            id: (i + 1).toString(),
            name: `Dr. ${gender === 'men' ? 'John' : 'Sarah'} ${String.fromCharCode(65 + i)}`,
            specialty: specialties[i % specialties.length],
            avatar: `https://randomuser.me/api/portraits/${gender}/${index}.jpg`,
            availableDays: availableDays,
            location: locations[i % locations.length]
          };
        });
        
        setDoctors(generatedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  return { doctors, loading };
};

// Custom hook to fetch time slots
const useTimeSlots = (doctorId, selectedDate) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!doctorId || !selectedDate) {
      setSlots([]);
      return;
    }
    
    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call with doctorId and date
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const baseSlots = [
          '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
          '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
        ];
        
        // Use doctorId to generate different slots per doctor
        const doctorIndex = parseInt(doctorId);
        const startIndex = (doctorIndex * 2) % baseSlots.length;
        const slotsCount = 5 + (doctorIndex % 4); // 5-8 slots per doctor
        
        // Generate slots with availability based on date
        const generatedSlots = baseSlots
          .slice(startIndex, startIndex + slotsCount)
          .map(slot => {
            // Make slots less available for dates further in the future
            const daysAhead = Math.floor((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const availabilityFactor = 0.3 + (0.05 * daysAhead);
            
            return {
              time: slot,
              available: Math.random() > availabilityFactor
            };
          });
        
        setSlots(generatedSlots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast.error("Failed to load time slots");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, [doctorId, selectedDate]);
  
  return { slots, loading };
};

const FindAppointment = () => {
  const { userInfo, isAuthenticated } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  
  const { doctors, loading: loadingDoctors } = useDoctors();
  const { slots: availableSlots, loading: loadingSlots } = useTimeSlots(selectedDoctor, selectedDate);
  
  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book an appointment");
      navigate('/sign-in');
      return;
    }
    
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast.error("Please select a doctor, date, and time slot");
      return;
    }
    
    const doctor = doctors.find(doc => doc.id === selectedDoctor);
    
    // Create appointment object
    const newAppointment = {
      id: `appointment-${Date.now()}`,
      doctorId: selectedDoctor,
      doctorName: doctor?.name,
      specialty: doctor?.specialty,
      patientId: userInfo?.id,
      patientName: userInfo?.name,
      patientEmail: userInfo?.email,
      patientPhone: "9819428182", // Set the target phone number
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedSlot,
      type: Math.random() > 0.5 ? 'video' : 'in-person',
      status: 'pending',
      imageUrl: doctor?.avatar,
      reason: "General checkup",
      createdAt: new Date().toISOString()
    };
    
    // Get existing appointments
    const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    
    // Add new appointment
    localStorage.setItem('doctorAppointments', JSON.stringify([newAppointment, ...storedAppointments]));
    
    // Send SMS notification (this will be logged in the console)
    console.log(`Sending SMS notification to 9819428182: New appointment booked with ${doctor?.name} on ${format(selectedDate, 'MMMM do, yyyy')} at ${selectedSlot}`);
    
    toast.success(
      `Appointment booked successfully!`,
      {
        description: `Your appointment with ${doctor?.name} is scheduled for ${format(selectedDate, 'MMMM do, yyyy')} at ${selectedSlot}. SMS notification sent to 9819428182.`
      }
    );
    
    // Reset form after booking
    setSelectedDoctor('');
    setSelectedDate(null);
    setSelectedSlot(null);
    
    // Redirect to appointments page
    setTimeout(() => {
      navigate('/appointments');
    }, 1500);
  };

  // Function to determine if a date should be disabled
  const isDateDisabled = (date) => {
    if (!selectedDoctor) return false;
    
    const doctor = doctors.find(doc => doc.id === selectedDoctor);
    if (!doctor) return true;
    
    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return !doctor.availableDays.includes(dayOfWeek) || date < today;
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-health-blue/20 shadow-md">
        <CardHeader className="bg-gradient-to-r from-health-light-blue to-health-medium-blue bg-opacity-30">
          <CardTitle>Find Available Appointments</CardTitle>
          <CardDescription>Select a doctor, date, and time to book your appointment</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Doctor</label>
              {loadingDoctors ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedDoctor} onValueChange={(value) => {
                  setSelectedDoctor(value);
                  setSelectedDate(null);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={doctor.avatar} alt={doctor.name} />
                            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{doctor.name} - {doctor.specialty}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {/* Date Selection - only shown after doctor selection */}
            {selectedDoctor && (
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Select Available Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={isDateDisabled}
                    />
                    <div className="p-3 border-t">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-health-blue mr-1"></span>
                        <span>Available days for selected doctor</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            {/* Time Slots - only shown after date selection */}
            {selectedDoctor && selectedDate && (
              <div>
                <label className="block text-sm font-medium mb-2">Available Time Slots</label>
                {loadingSlots ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Skeleton key={i} className="h-10 rounded-md" />
                    ))}
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedSlot === slot.time ? "default" : "outline"}
                        className={cn(
                          "flex items-center justify-center transition-all",
                          !slot.available && "opacity-50 cursor-not-allowed",
                          selectedSlot === slot.time && "bg-health-blue hover:bg-health-blue/90"
                        )}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {slot.time}
                        {selectedSlot === slot.time && (
                          <Check className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-health-red">No available slots for this date</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please select another date
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Doctor Information */}
            {selectedDoctor && (
              <div className="mt-6 border-t pt-4">
                {doctors.filter(doc => doc.id === selectedDoctor).map(doctor => (
                  <div key={doctor.id} className="flex items-start space-x-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h4 className="font-medium">{doctor.name}</h4>
                      <Badge className="doctor-badge">{doctor.specialty}</Badge>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="h-3.5 w-3.5 mr-1" />
                        {doctor.location}
                      </div>
                      
                      {selectedDate && (
                        <p className="text-sm text-health-blue flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Available on {format(selectedDate, "EEEE, MMMM do")}
                          {selectedSlot && <> at <span className="font-medium">{selectedSlot}</span></>}
                        </p>
                      )}
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Available on: </span>
                        {doctor.availableDays.map(day => {
                          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                          return (
                            <Badge key={day} variant="outline" className="mr-1 bg-health-light-blue/40">
                              {days[day]}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Book Appointment Button */}
            <Button 
              className="w-full mt-4 bg-health-blue hover:bg-health-blue/90 transition-colors" 
              disabled={!selectedDoctor || !selectedDate || !selectedSlot}
              onClick={handleBookAppointment}
            >
              {isAuthenticated ? 'Book Appointment' : 'Sign In to Book'}
            </Button>
            
            {!isAuthenticated && (
              <p className="text-sm text-center text-muted-foreground mt-2">
                You need to sign in to book an appointment
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FindAppointment;
