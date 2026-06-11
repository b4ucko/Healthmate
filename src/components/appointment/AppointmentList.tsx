
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Video, User, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parse } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'canceled';
  imageUrl: string;
}

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = () => {
      setLoading(true);
      try {
        const storedAppointments = localStorage.getItem('doctorAppointments');
        if (storedAppointments) {
          const parsedAppointments: any[] = JSON.parse(storedAppointments);
          
          const userAppointments = parsedAppointments.filter(apt => 
            apt.patientId === userInfo?.id || apt.patientEmail === userInfo?.email
          ).filter(apt => apt.status !== 'canceled');
          
          const formattedAppointments: Appointment[] = userAppointments.map(apt => ({
            id: apt.id,
            doctorName: apt.doctorName,
            specialty: apt.specialty || 'General Physician',
            date: apt.date,
            time: apt.time,
            type: apt.type || 'in-person',
            status: apt.status === 'canceled' ? 'canceled' : 
                   parse(`${apt.date} ${apt.time}`, 'yyyy-MM-dd h:mm a', new Date()) < new Date() ? 'completed' : 'upcoming',
            imageUrl: apt.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d'
          }));
          
          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id) {
      loadAppointments();
    }
  }, [userInfo]);

  const cancelAppointment = (id: string) => {
    const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    const updatedAppointments = storedAppointments.map((apt: any) => 
      apt.id === id ? {...apt, status: 'canceled'} : apt
    );
    localStorage.setItem('doctorAppointments', JSON.stringify(updatedAppointments));
    
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    toast.success('Appointment cancelled successfully');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">My Appointments</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm text-health-blue"
          onClick={() => navigate('/appointments')}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <span className="text-xs font-medium">{format(new Date(appointment.date), "MMM")}</span>
                    <span className="text-lg font-bold">{format(new Date(appointment.date), "d")}</span>
                  </div>
                  <div>
                    <p className="font-medium">{appointment.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant={appointment.type === 'video' ? 'secondary' : 'outline'} className="mr-2">
                    {appointment.type === 'video' ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : (
                      <User className="h-3 w-3 mr-1" />
                    )}
                    {appointment.type === 'video' ? 'Video' : 'In-person'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-health-red hover:text-red-600 hover:bg-red-50"
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/doctors')}
            >
              Book an Appointment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentList;
