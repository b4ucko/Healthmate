import { useState } from 'react';
import { MapPin, Star, Clock, Phone, MessageSquare, Calendar, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import DoctorBookingModal from './DoctorBookingModal';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialtyLabel?: string;
  rating: number;
  reviewCount: number;
  experience: number;
  availability: string;
  imageUrl: string;
  location: string;
  offersVirtual: boolean;
  bio?: string;
  languages?: string[];
  education?: string;
  achievements?: string[];
  avatar: string;
  availableDays: number[];
}

interface DoctorCardProps {
  doctor: Doctor;
}

interface AppOption {
  name: string;
  icon: string;
  action: (app: string) => void;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  
  const callOptions: AppOption[] = [
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
    {
      name: "Zoom",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/1200px-Zoom_Communications_Logo.svg.png",
      action: (app: string) => handleCallWithApp(app)
    },
    {
      name: "Microsoft Teams",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/800px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png",
      action: (app: string) => handleCallWithApp(app)
    }
  ];
  
  const messageOptions: AppOption[] = [
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
    {
      name: "Email",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png",
      action: (app: string) => handleMessageWithApp(app)
    }
  ];
  
  const handleCallWithApp = (app: string) => {
    setShowCallDialog(false);
    
    const phoneNumber = Math.floor(9000000000 + Math.random() * 1000000000);
    
    if (app === "Phone App") {
      window.location.href = `tel:+91${phoneNumber}`;
    } else if (app === "WhatsApp Call") {
      window.open(`https://wa.me/91${phoneNumber}`, '_blank');
    } else if (app === "Zoom") {
      const meetingId = Math.floor(100000000000 + Math.random() * 900000000000);
      window.open(`https://zoom.us/j/${meetingId}`, '_blank');
    } else if (app === "Google Duo") {
      toast.success(`Opening Google Duo call with Dr. ${doctor.name}`, {
        description: "App will open if installed on your device",
      });
    } else if (app === "Microsoft Teams") {
      window.open("https://teams.microsoft.com/l/call/0/0?users=doctor@example.com", '_blank');
    } else {
      toast.success(`Starting a ${app} call with Dr. ${doctor.name}...`, {
        description: "Connecting to our secure calling system",
        action: {
          label: 'End Call',
          onClick: () => toast.info(`${app} call ended`)
        },
      });
    }
    
    console.log(`Calling notification to +91 9819428182 for doctor ${doctor.id} using ${app}`);
  };
  
  const handleMessageWithApp = (app: string) => {
    setShowMessageDialog(false);
    
    const phoneNumber = Math.floor(9000000000 + Math.random() * 1000000000);
    
    if (app === "SMS") {
      window.location.href = `sms:+91${phoneNumber}?body=Hello Dr. ${doctor.name}, I would like to schedule a consultation.`;
    } else if (app === "WhatsApp") {
      window.open(`https://wa.me/91${phoneNumber}?text=Hello Dr. ${doctor.name}, I would like to schedule a consultation.`, '_blank');
    } else if (app === "Telegram") {
      toast.success(`Opening Telegram to message Dr. ${doctor.name}`, {
        description: "App will open if installed on your device",
      });
    } else if (app === "Email") {
      const email = `dr.${doctor.name.toLowerCase().replace(/\s+/g, '.')}@healthmate.com`;
      window.location.href = `mailto:${email}?subject=Appointment Request&body=Hello Dr. ${doctor.name}, I would like to schedule a consultation.`;
    } else {
      toast.success(`Opening chat with Dr. ${doctor.name} using ${app}`, {
        description: "Loading secure messaging system",
        action: {
          label: 'Go to Chat',
          onClick: () => console.log(`Navigate to ${app} chat`)
        },
      });
    }
    
    console.log(`Message notification to +91 9819428182 for doctor ${doctor.id} using ${app}`);
  };

  const bookingDoctor = {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    location: doctor.location,
    avatar: doctor.imageUrl,
    availableDays: [0, 1, 2, 3, 4]
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-44 h-48 md:h-auto relative">
              <Avatar className="w-full h-full rounded-none md:rounded-l-lg overflow-hidden">
                <AvatarImage src={doctor.imageUrl} alt={doctor.name} className="object-cover w-full h-full" />
                <AvatarFallback className="text-2xl h-full">{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{doctor.name}</h3>
                  <p className="text-muted-foreground">{doctor.specialtyLabel || doctor.specialty}</p>
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium mr-1">{doctor.rating}</span>
                  <span className="text-muted-foreground">({doctor.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm">{doctor.experience} years exp.</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm truncate">{doctor.location}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <Badge variant="secondary" className="mr-2">
                  {doctor.availability}
                </Badge>
                {doctor.offersVirtual && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Virtual Visits
                  </Badge>
                )}
              </div>
              
              {isExpanded && (
                <div className="mt-2 space-y-3">
                  {doctor.bio && <p className="text-sm">{doctor.bio}</p>}
                  
                  {doctor.languages && (
                    <div>
                      <p className="text-sm font-medium">Languages</p>
                      <p className="text-sm text-muted-foreground">{doctor.languages.join(", ")}</p>
                    </div>
                  )}
                  
                  {doctor.education && (
                    <div>
                      <p className="text-sm font-medium">Education</p>
                      <p className="text-sm text-muted-foreground">{doctor.education}</p>
                    </div>
                  )}
                  
                  {doctor.achievements && (
                    <div>
                      <p className="text-sm font-medium">Achievements</p>
                      <ul className="list-disc pl-5">
                        {doctor.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-muted-foreground">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-auto pt-3">
                <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? "Show less" : "Show more"}
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowCallDialog(true)}>
                  <Phone className="h-3 w-3" />
                  Call
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowMessageDialog(true)}>
                  <MessageSquare className="h-3 w-3" />
                  Message
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Calendar className="h-3 w-3" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DoctorBookingModal 
        doctor={bookingDoctor} 
        open={showBookingModal} 
        onOpenChange={setShowBookingModal} 
      />
      
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select calling app</DialogTitle>
            <DialogDescription>
              Choose how you would like to call Dr. {doctor.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {callOptions.map((option, i) => (
              <button 
                key={i}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => option.action(option.name)}
              >
                <img src={option.icon} alt={option.name} className="w-12 h-12 mb-2 object-contain" />
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowCallDialog(false)}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select messaging app</DialogTitle>
            <DialogDescription>
              Choose how you would like to message Dr. {doctor.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {messageOptions.map((option, i) => (
              <button 
                key={i}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => option.action(option.name)}
              >
                <img src={option.icon} alt={option.name} className="w-12 h-12 mb-2 object-contain" />
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowMessageDialog(false)}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorCard;
