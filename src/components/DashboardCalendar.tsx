
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface CalendarEvent {
  date: Date;
  type: string;
  title: string;
}

const EventBadge = ({ type }: { type: string }) => {
  const getStyles = () => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-700";
      case "reminder":
        return "bg-amber-100 text-amber-700";
      case "task":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Badge className={cn("text-xs", getStyles())}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

const DashboardCalendar = () => {
  const { userInfo } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
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
          date: parse(`${appointment.date} ${appointment.time}`, 'yyyy-MM-dd h:mm a', new Date()),
          type: 'appointment',
          title: userInfo?.userType === 'doctor'
            ? `Patient: ${appointment.patientName}`
            : `Dr. ${appointment.doctorName}`,
          status: appointment.status
        }));

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

  // Group events by date for badge rendering
  const eventsByDate = events.reduce((acc, event) => {
    const dateStr = format(event.date, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Get selected day's events
  const selectedDayEvents = date
    ? eventsByDate[format(date, "yyyy-MM-dd")] || []
    : [];

  // Define dates with events for the modifier
  const getDatesWithEvents = () => {
    return Object.keys(eventsByDate).map(dateStr => new Date(dateStr));
  };

  // Create a custom day renderer using CSS instead of components prop
  const eventDates = getDatesWithEvents();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-health-blue" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-lg flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-health-blue" />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="flex flex-col items-center w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mx-auto border-0 p-1"
            modifiers={{
              hasEvent: eventDates
            }}
            modifiersClassNames={{
              hasEvent: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-health-blue after:rounded-full"
            }}
            footer={
              <div className="pt-2 flex justify-center w-full">
                {Object.keys(eventsByDate).length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full border border-border/40">
                    <span className="h-2 w-2 rounded-full bg-health-blue animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Event scheduled</span>
                  </div>
                )}
              </div>
            }
          />

          <div className="mt-2">
            <h3 className="text-sm font-medium mb-2">
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </h3>

            <div className="space-y-2">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">{event.title}</span>
                    <EventBadge type={event.type} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No events scheduled for this day
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;
