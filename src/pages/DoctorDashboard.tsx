import { useState, useEffect } from 'react';
import { Calendar, Users, ClipboardList, Clock, Phone, Video, MessageSquare, Mail } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getAppointmentsByDoctorId } from '@/lib/database/mongodb/services';
import DashboardUpcomingEvents from '@/components/DashboardUpcomingEvents';
import DashboardCalendar from '@/components/DashboardCalendar';

interface PatientAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  createdAt: string;
  imageUrl?: string;
}

const defaultDoctorInfo = {
  name: 'Dr. Rajesh Kumar',
  specialty: 'Cardiologist',
  experience: '15+ years',
  patients: 1245,
  appointments: 8,
  avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
};

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [patientAppointments, setPatientAppointments] = useState<PatientAppointment[]>([]);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);
  const { userInfo } = useAuth();
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const doctorInfo = {
    ...defaultDoctorInfo,
    name: userInfo?.name || defaultDoctorInfo.name,
    specialty: userInfo?.specialty || defaultDoctorInfo.specialty,
    experience: userInfo?.experience || defaultDoctorInfo.experience,
    avatar: userInfo?.avatar || defaultDoctorInfo.avatar,
    id: userInfo?.id || 'doctor-1',
  };

  const callOptions = [
    {
      name: "WhatsApp Call",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png",
      action: (app: string) => handleCallWithApp(app)
    },
    {
      name: "Phone App",
      icon: "/placeholder.svg",
      action: (app: string) => handleCallWithApp(app)
    },
    {
      name: "Google Duo",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Duo_icon_%282018-2020%29.svg/512px-Google_Duo_icon_%282018-2020%29.svg.png",
      action: (app: string) => handleCallWithApp(app)
    },
  ];
  
  const messageOptions = [
    {
      name: "WhatsApp",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png",
      action: (app: string) => handleMessageWithApp(app)
    },
    {
      name: "SMS",
      icon: "/placeholder.svg",
      action: (app: string) => handleMessageWithApp(app)
    },
    {
      name: "Telegram",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png",
      action: (app: string) => handleMessageWithApp(app)
    },
  ];

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      setLoading(true);
      try {
        const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
        
        const doctorAppointments = storedAppointments.filter(
          (appointment: any) => appointment.doctorId === doctorInfo.id
        );
        
        const typedAppointments: PatientAppointment[] = doctorAppointments.map((appointment: any) => ({
          ...appointment,
          status: appointment.status as PatientAppointment['status']
        }));
        
        setPatientAppointments(typedAppointments);
        
        const today = new Date().toISOString().split('T')[0];
        const todaysAppts = typedAppointments.filter(
          appt => appt.date === today && appt.status === 'approved'
        );
        
        const formattedTodayAppointments = todaysAppts.map(appt => ({
          id: appt.id,
          patientName: appt.patientName,
          age: calculateAge(appt.patientEmail),
          purpose: appt.reason || 'General checkup',
          time: new Date(`${appt.date}T${appt.time}`),
          status: 'upcoming',
          avatar: appt.imageUrl || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70)}.jpg`
        }));
        
        setTodayAppointments(formattedTodayAppointments);
        
        const patientSet = new Set();
        const uniquePatients = [];
        
        for (const appt of typedAppointments) {
          if (!patientSet.has(appt.patientName) && appt.status !== 'cancelled') {
            patientSet.add(appt.patientName);
            uniquePatients.push({
              id: `patient-${uniquePatients.length + 1}`,
              name: appt.patientName,
              age: calculateAge(appt.patientEmail),
              lastVisit: new Date(appt.date),
              condition: appt.reason || 'General checkup',
              avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70)}.jpg`
            });
          }
        }
        
        setRecentPatients(uniquePatients.slice(0, 3));
        
        if (typedAppointments.length > 0) {
          const pendingCount = typedAppointments.filter(app => app.status === 'pending').length;
          if (pendingCount > 0) {
            toast.info(`You have ${pendingCount} new appointment request${pendingCount > 1 ? 's' : ''}`);
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setPatientAppointments([]);
        setTodayAppointments([]);
        setRecentPatients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctorAppointments();
    
    const intervalId = setInterval(fetchDoctorAppointments, 30000);
    
    return () => clearInterval(intervalId);
  }, [doctorInfo.id]);

  const calculateAge = (email: string) => {
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 25 + (hash % 40);
  };

  const handleAppointmentAction = (appointmentId: string, action: 'approve' | 'decline') => {
    const updatedAppointments = patientAppointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          status: action === 'approve' ? 'approved' as const : 'cancelled' as const
        };
      }
      return appointment;
    });
    
    setPatientAppointments(updatedAppointments);
    
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    
    const updatedAllAppointments = allAppointments.map((appointment: any) => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          status: action === 'approve' ? 'approved' : 'cancelled'
        };
      }
      return appointment;
    });
    
    localStorage.setItem('doctorAppointments', JSON.stringify(updatedAllAppointments));
    
    const appointment = patientAppointments.find(app => app.id === appointmentId);
    if (appointment) {
      console.log(`Sending notification to patient ${appointment.patientName} (${appointment.patientPhone}) about ${action === 'approve' ? 'approved' : 'declined'} appointment`);
    }
    
    toast.success(`Appointment ${action === 'approve' ? 'approved' : 'declined'} successfully`);
  };

  const handleCallWithApp = (app: string) => {
    setShowCallDialog(false);
    const patientName = selectedAppointment?.patientName || "patient";
    
    toast.success(`Calling ${patientName} using ${app}...`, {
      description: "Connecting to our secure calling system",
      action: {
        label: 'End Call',
        onClick: () => toast.info(`${app} call ended`)
      },
    });
    
    console.log(`Calling notification to +91 9819428182 for patient using ${app}`);
  };
  
  const handleMessageWithApp = (app: string) => {
    setShowMessageDialog(false);
    const patientName = selectedAppointment?.patientName || "patient";
    
    toast.success(`Opening chat with ${patientName} using ${app}`, {
      description: "Loading secure messaging system",
      action: {
        label: 'Go to Chat',
        onClick: () => console.log(`Navigate to ${app} chat`)
      },
    });
    
    console.log(`Message notification to +91 9819428182 for patient using ${app}`);
  };

  const openCallDialog = (appointment?: PatientAppointment) => {
    setSelectedAppointment(appointment || null);
    setShowCallDialog(true);
  };

  const openMessageDialog = (appointment?: PatientAppointment) => {
    setSelectedAppointment(appointment || null);
    setShowMessageDialog(true);
  };

  const pendingAppointments = patientAppointments.filter(
    appointment => appointment.status === 'pending'
  );

  const approvedAppointments = patientAppointments.filter(
    appointment => appointment.status === 'approved'
  );

  return (
    <Layout>
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="h-16 w-16 mr-4 border-2 border-health-blue">
                <AvatarImage src={doctorInfo.avatar} alt={doctorInfo.name} />
                <AvatarFallback>{doctorInfo.name.split(' ')[0].charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{doctorInfo.name}</h1>
                <p className="text-muted-foreground">
                  {doctorInfo.specialty} • {doctorInfo.experience} Experience
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-health-blue" />
                      Total Patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold">{recentPatients.length || 0}</div>
                      <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">
                        {pendingAppointments.length > 0 ? `+${pendingAppointments.length} pending` : 'No new patients'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {approvedAppointments.length} active appointments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-health-blue" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold">{todayAppointments.length}</div>
                      <div className="ml-2 flex gap-1">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          {todayAppointments.filter(a => a.status === 'upcoming').length} upcoming
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {todayAppointments.length > 0 
                        ? `Next appointment: ${format(todayAppointments[0].time, 'h:mm a')}`
                        : 'No appointments scheduled today'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ClipboardList className="h-5 w-5 mr-2 text-health-blue" />
                      Pending Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                          Prescription refills
                        </span>
                        <span className="font-medium">{Math.floor(Math.random() * 10)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                          Appointment requests
                        </span>
                        <span className="font-medium">{pendingAppointments.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                          Messages to respond
                        </span>
                        <span className="font-medium">{Math.floor(Math.random() * 7)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {pendingAppointments.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-yellow-800">
                      <Calendar className="h-5 w-5 mr-2 text-yellow-600" />
                      New Appointment Requests
                    </CardTitle>
                    <CardDescription className="text-yellow-700">
                      The following patients have requested appointments with you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-white rounded-lg border border-yellow-200">
                          <div>
                            <h3 className="font-medium">{appointment.patientName}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="bg-blue-50">
                                {new Date(appointment.date).toLocaleDateString()}
                              </Badge>
                              <Badge variant="outline" className="bg-green-50">
                                {appointment.time}
                              </Badge>
                            </div>
                            <p className="text-xs mt-2">
                              Contact: {appointment.patientEmail} | {appointment.patientPhone}
                            </p>
                          </div>
                          <div className="flex gap-2 self-end sm:self-center">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleAppointmentAction(appointment.id, 'decline')}
                            >
                              Decline
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                            >
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-health-blue" />
                      Today's Appointments
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(), 'EEEE, MMMM do, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayAppointments.length > 0 ? (
                        todayAppointments.slice(0, 3).map(appointment => (
                          <div key={appointment.id} className="flex items-start p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-10 w-10 border border-muted">
                                <AvatarImage src={appointment.avatar} alt={appointment.patientName} />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patientName}, {appointment.age}</p>
                                <p className="text-sm text-muted-foreground">{appointment.purpose}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => openCallDialog()}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => openMessageDialog()}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                          <h3 className="font-medium mb-1">No appointments today</h3>
                          <p className="text-muted-foreground mb-4">You don't have any appointments scheduled for today.</p>
                        </div>
                      )}
                      {todayAppointments.length > 3 && (
                        <Button variant="outline" className="w-full">View All {todayAppointments.length} Appointments</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-health-blue" />
                      Recent Patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPatients.length > 0 ? (
                        recentPatients.map(patient => (
                          <div key={patient.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-muted">
                                <AvatarImage src={patient.avatar} alt={patient.name} />
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{patient.name}, {patient.age}</p>
                                <p className="text-sm text-muted-foreground">{patient.condition}</p>
                                <p className="text-xs text-muted-foreground">Last visit: {format(patient.lastVisit, 'MMM d, yyyy')}</p>
                              </div>
                            </div>
                            <Button size="sm">View File</Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                          <h3 className="font-medium mb-1">No patients yet</h3>
                          <p className="text-muted-foreground mb-4">You don't have any patients yet.</p>
                        </div>
                      )}
                      {recentPatients.length > 0 && (
                        <Button variant="outline" className="w-full">View All Patients</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>Manage your upcoming patient appointments</CardDescription>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button variant="outline">Filter</Button>
                    <Button>+ New Appointment</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {approvedAppointments.length > 0 && (
                    <div className="space-y-6 mb-8">
                      <h3 className="font-medium text-lg">Approved Patient Requests</h3>
                      <div className="space-y-4">
                        {approvedAppointments
                          .filter(appointment => appointment.status === 'approved')
                          .map((appointment) => (
                            <div key={appointment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg border-green-200 bg-green-50">
                              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <div className="flex flex-col items-center px-4 py-2 bg-white rounded-lg min-w-16 text-center">
                                  <span className="text-sm font-medium">{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                  <span className="text-2xl font-bold">{new Date(appointment.date).getDate()}</span>
                                  <span className="text-sm">{appointment.time}</span>
                                </div>
                                <div>
                                  <h3 className="font-medium">{appointment.patientName}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.reason.substring(0, 50)}...</p>
                                  <p className="text-xs mt-1">Contact: {appointment.patientPhone}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full sm:w-auto"
                                  onClick={() => openCallDialog(appointment)}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full sm:w-auto"
                                  onClick={() => openMessageDialog(appointment)}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                                <Button size="sm" className="w-full sm:w-auto">View Details</Button>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <h3 className="font-medium text-lg">Today, {format(new Date(), 'MMMM do')}</h3>
                    <div className="space-y-4">
                      {todayAppointments.length > 0 ? (
                        todayAppointments.map(appointment => (
                          <div key={appointment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                              <div className="flex flex-col items-center px-4 py-2 bg-blue-50 rounded-lg min-w-16 text-center">
                                <span className="text-sm font-medium">{format(appointment.time, 'MMM')}</span>
                                <span className="text-2xl font-bold">{format(appointment.time, 'd')}</span>
                                <span className="text-sm">{format(appointment.time, 'h:mm a')}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border border-muted">
                                  <AvatarImage src={appointment.avatar} alt={appointment.patientName} />
                                  <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{appointment.patientName}, {appointment.age}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.purpose}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full sm:w-auto"
                                onClick={() => openCallDialog()}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full sm:w-auto"
                                onClick={() => openMessageDialog()}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button size="sm" className="w-full sm:w-auto">View Details</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border rounded-lg p-4 text-center">
                          <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                          <h3 className="font-medium mb-1">No appointments today</h3>
                          <p className="text-sm text-muted-foreground mb-4">You don't have any appointments scheduled for today.</p>
                          <Button>Schedule an Appointment</Button>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-lg pt-4">Tomorrow, {format(new Date(new Date().setDate(new Date().getDate() + 1)), 'MMMM do')}</h3>
                    <div className="border rounded-lg p-4 text-center">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="font-medium mb-1">No appointments scheduled</h3>
                      <p className="text-sm text-muted-foreground mb-4">You have no appointments scheduled for tomorrow.</p>
                      <Button>Schedule an Appointment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="patients">
              
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Patient Records</CardTitle>
                    <CardDescription>Manage your patient list and medical records</CardDescription>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button variant="outline">Filter</Button>
                    <Button>+ Add Patient</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentPatients.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...recentPatients, ...recentPatients].slice(0, 6).map((patient, index) => (
                          <div key={`${patient.id}-${index}`} className="border rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-14 w-14 border border-muted">
                                <AvatarImage src={patient.avatar} alt={patient.name} />
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{patient.name}</h3>
                                <p className="text-sm text-muted-foreground">{patient.age} years old</p>
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Condition</span>
                                <span className="text-sm font-medium">{patient.condition}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Last Visit</span>
                                <span className="text-sm font-medium">{format(patient.lastVisit, 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Next Appointment</span>
                                <span className="text-sm font-medium">-</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="w-full">View Records</Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-auto"
                                onClick={() => {
                                  setSelectedAppointment(null);
                                  openCallDialog();
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-auto"
                                onClick={() => {
                                  setSelectedAppointment(null);
                                  openMessageDialog();
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No patients yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          You don't have any patients yet. As patients book appointments with you, they'll appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="records">
              
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Manage patient medical records and history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <ClipboardList className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No medical records yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      You don't have any medical records stored yet. When you add records for patients, they'll appear here.
                    </p>
                    <Button>Add New Record</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Call Patient</DialogTitle>
            <DialogDescription>
              Choose how you would like to call {selectedAppointment?.patientName || "the patient"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {callOptions.map((option) => (
              <div 
                key={option.name}
                className="flex flex-col items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-accent"
                onClick={() => option.action(option.name)}
              >
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10">
                  <img src={option.icon} alt={option.name} className="h-8 w-8 object-contain" />
                </div>
                <span className="text-sm font-medium">{option.name}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message Patient</DialogTitle>
            <DialogDescription>
              Choose how you would like to message {selectedAppointment?.patientName || "the patient"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {messageOptions.map((option) => (
              <div 
                key={option.name}
                className="flex flex-col items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-accent"
                onClick={() => option.action(option.name)}
              >
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10">
                  <img src={option.icon} alt={option.name} className="h-8 w-8 object-contain" />
                </div>
                <span className="text-sm font-medium">{option.name}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DoctorDashboard;
