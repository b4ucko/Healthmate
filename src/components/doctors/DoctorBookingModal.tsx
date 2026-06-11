
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  availableDays: number[];
  location: string;
}

interface DoctorBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor;
}

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
];

const DoctorBookingModal = ({ doctor, open, onOpenChange }: DoctorBookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState(1);
  const { isAuthenticated, userInfo } = useAuth();
  const navigate = useNavigate();

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !doctor.availableDays.includes(dayOfWeek) || date < today;
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    return timeSlots.map(time => ({
      time,
      available: Math.random() > 0.3
    }));
  };

  const availableTimeSlots = getAvailableTimeSlots();

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book an appointment");
      navigate('/sign-in');
      return;
    }
    
    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Please select a date and time slot");
      return;
    }
    
    const newAppointment = {
      id: `appointment-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      patientId: userInfo?.id || 'unknown',
      patientName: userInfo?.name || 'Patient',
      patientEmail: userInfo?.email || 'patient@example.com',
      patientPhone: userInfo?.phone || '+1234567890',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTimeSlot,
      type: Math.random() > 0.5 ? 'video' : 'in-person',
      status: 'pending',
      imageUrl: doctor.avatar,
      reason: notes || 'General consultation',
      createdAt: new Date().toISOString()
    };
    
    // Get existing appointments
    const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    
    // Add new appointment
    localStorage.setItem('doctorAppointments', JSON.stringify([newAppointment, ...storedAppointments]));
    
    toast.success(
      `Appointment request sent successfully!`,
      {
        description: `Your appointment with ${doctor.name} is pending confirmation.`
      }
    );
    
    onOpenChange(false);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setNotes('');
    setStep(1);
    
    setTimeout(() => {
      navigate('/appointments');
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && !selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (step === 2 && !selectedTimeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-health-light-blue to-health-medium-blue bg-opacity-30 p-6">
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Schedule your appointment with {doctor.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{doctor.name}</h3>
              <Badge>{doctor.specialty}</Badge>
              <p className="text-sm text-muted-foreground mt-1">{doctor.location}</p>
            </div>
          </div>
          
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium">Select a Date</h4>
              <Calendar 
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md border mx-auto"
              />
              <div className="text-sm text-muted-foreground text-center">
                <p>Available on days highlighted in blue</p>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium">Select a Time Slot</h4>
              {selectedDate && (
                <>
                  <p className="text-sm text-center">
                    {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {availableTimeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                        className={cn(
                          "flex items-center justify-center",
                          !slot.available && "opacity-50 cursor-not-allowed",
                          selectedTimeSlot === slot.time && "bg-health-blue hover:bg-health-blue/90"
                        )}
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {slot.time}
                        {selectedTimeSlot === slot.time && (
                          <Check className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium">Additional Information</h4>
              <div className="space-y-2">
                <label className="text-sm">Reason for visit (optional)</label>
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Please describe your symptoms or reason for the appointment"
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
                <div className="flex items-start">
                  <AlertCircle className="text-amber-500 h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Important Information</p>
                    <p className="text-amber-700 mt-1">
                      Your appointment request will be sent to the doctor for approval. 
                      You'll receive a notification once it's confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between p-6 bg-muted/50 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          
          {step < 3 ? (
            <Button onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorBookingModal;
