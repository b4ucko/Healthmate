
import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Helper component for event type badges
const Badge = ({ event }: { event: string }) => {
  const getStyles = () => {
    switch (event) {
      case "appointment":
        return "bg-blue-100 text-blue-700";
      case "meeting":
        return "bg-purple-100 text-purple-700";
      case "task":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStyles()}`}>
      {event.charAt(0).toUpperCase() + event.slice(1)}
    </span>
  );
};

const DashboardUpcomingEvents = () => {
  const { userInfo } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserAppointments = async () => {
      setLoading(true);
      try {
        const storedAppointments = localStorage.getItem('doctorAppointments');
        if (!storedAppointments) {
          setEvents([]);
          return;
        }
        
        const allAppointments = JSON.parse(storedAppointments);
        let userAppointments = [];
        
        if (userInfo?.userType === 'doctor') {
          userAppointments = allAppointments.filter(
            (appointment: any) => appointment.doctorId === userInfo.id && 
            appointment.status !== 'canceled'
          );
        } else {
          userAppointments = allAppointments.filter(
            (appointment: any) => (appointment.patientId === userInfo?.id || 
            appointment.patientEmail === userInfo?.email) && 
            appointment.status !== 'canceled'
          );
        }
        
        // Convert to event format
        const formattedEvents = userAppointments.map((appointment: any) => ({
          id: appointment.id,
          title: userInfo?.userType === 'doctor' 
            ? `Patient: ${appointment.patientName}` 
            : `Dr. ${appointment.doctorName}`,
          date: parse(`${appointment.date} ${appointment.time}`, 'yyyy-MM-dd h:mm a', new Date()),
          type: 'appointment',
          status: appointment.status
        }));
        
        // Sort by date
        formattedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userInfo?.id) {
      fetchUserAppointments();
    }
  }, [userInfo]);
  
  // Filter for upcoming events only
  const upcomingEvents = events.filter(event => {
    const now = new Date();
    return event.date > now;
  }).slice(0, 3); // Show only next 3 events
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
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
        ) : (
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      <span className="text-xs font-medium">{format(event.date, "MMM")}</span>
                      <span className="text-lg font-bold">{format(event.date, "d")}</span>
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{format(event.date, "h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                  <Badge event={event.type} />
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No upcoming events</p>
              </div>
            )}
            {events.length > 3 && (
              <Button variant="outline" className="w-full">View All Events</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardUpcomingEvents;
