
import { useState } from 'react';
import { MapPin, Ambulance, Phone, AlertTriangle, HeartPulse, Timer, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '../ui/GlassCard';
import FirstAidGuideDialog from './FirstAidGuideDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Navi Mumbai area hospitals with locations
const naviMumbaiHospitals = [
  {
    name: 'Apollo Hospital',
    distance: '2.3 km',
    locality: 'Belapur CBD',
    eta: '8 minutes',
    coordinates: '19.023606,73.037593'
  },
  {
    name: 'Fortis Hospital',
    distance: '3.5 km',
    locality: 'Vashi',
    eta: '12 minutes',
    coordinates: '19.075983,72.991020'
  },
  {
    name: 'Hiranandani Hospital',
    distance: '4.7 km',
    locality: 'Kharghar',
    eta: '15 minutes',
    coordinates: '19.034857,73.069311'
  },
  {
    name: 'MGM Hospital',
    distance: '5.2 km',
    locality: 'Kamothe',
    eta: '18 minutes',
    coordinates: '19.008627,73.099144'
  },
  {
    name: 'Terna Speciality Hospital',
    distance: '6.1 km',
    locality: 'Nerul',
    eta: '22 minutes',
    coordinates: '19.036716,73.018269'
  }
];

const EmergencyFinder = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [foundHospitals, setFoundHospitals] = useState<Array<any>>([]);
  const [showFirstAidGuide, setShowFirstAidGuide] = useState(false);
  
  const handleFindNearby = () => {
    setIsSearching(true);
    // Simulate finding nearby hospitals
    setTimeout(() => {
      setIsSearching(false);
      // Show 2-3 random hospitals from our list
      const shuffled = [...naviMumbaiHospitals].sort(() => 0.5 - Math.random());
      setFoundHospitals(shuffled.slice(0, 3));
      toast.success(`Found ${shuffled.slice(0, 3).length} nearby hospitals in Navi Mumbai area`);
    }, 2000);
  };

  const handlePhoneCall = (phoneNumber: string, serviceName: string) => {
    // Use the tel: protocol to open the device's phone app
    window.location.href = `tel:${phoneNumber}`;
    console.log(`Calling ${serviceName} at ${phoneNumber}`);
  };

  const handleNavigate = (coordinates: string, hospitalName: string) => {
    // Open Google Maps with the hospital coordinates
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates}`, '_blank');
    toast.success(`Opening navigation to ${hospitalName}`);
  };

  const emergencyInstructions = [
    {
      icon: <HeartPulse className="h-5 w-5 text-health-red" />,
      title: "Check vital signs",
      description: "Monitor breathing, pulse, and level of consciousness"
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-health-yellow" />,
      title: "Clear the airway",
      description: "Ensure nothing is blocking the person's airway"
    },
    {
      icon: <Timer className="h-5 w-5 text-health-blue" />,
      title: "Control bleeding",
      description: "Apply direct pressure to any wounds with clean cloth"
    },
    {
      icon: <Phone className="h-5 w-5 text-health-blue" />,
      title: "Call emergency services",
      description: "Dial 911 immediately and describe the status clearly"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main emergency card */}
      <GlassCard highlight="top" className="lg:col-span-2 bg-gradient-to-br from-white/80 to-white/50 dark:from-white/10 dark:to-white/5">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-health-red/10 flex items-center justify-center">
            <Ambulance className="h-5 w-5 text-health-red" />
          </div>
          <h2 className="text-2xl font-bold">Emergency Assistance</h2>
        </div>

        <div className="space-y-6">
          <p className="text-muted-foreground">
            Need immediate medical attention? We'll connect you with the nearest available healthcare provider or emergency room.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-health-light-blue flex items-center justify-center mr-3">
                <MapPin className="h-4 w-4 text-health-blue" />
              </div>
              <div>
                <p className="text-sm font-medium">Use my current location</p>
                <p className="text-xs text-muted-foreground">Allow location access to find nearby help</p>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your address or pincode..."
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue focus:outline-none"
                  defaultValue="Navi Mumbai, Maharashtra"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 h-12 rounded-full bg-health-red hover:bg-health-red/90"
              onClick={handleFindNearby}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <span className="animate-pulse">Searching...</span>
                </>
              ) : (
                <>
                  <Ambulance className="mr-2 h-4 w-4" />
                  Find Nearby Emergency Care
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-full"
              onClick={() => handlePhoneCall('911', 'Emergency Services')}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call 911 Emergency Services
            </Button>
          </div>
          
          <Button 
            className="w-full h-12 rounded-full bg-health-blue hover:bg-health-blue/90"
            onClick={() => navigate('/emergency-appointment')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Emergency Appointment
          </Button>

          {foundHospitals.length > 0 && (
            <div className="mt-4 space-y-3 animate-fade-in">
              <h3 className="font-medium text-lg">Nearby hospitals in Navi Mumbai:</h3>
              {foundHospitals.map((hospital, index) => (
                <div key={index} className="p-4 bg-white/80 border border-health-green/20 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-health-green/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-health-green" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{hospital.name} ({hospital.distance} away)</p>
                      <p className="text-sm text-muted-foreground">{hospital.locality} • Estimated arrival: {hospital.eta}</p>
                    </div>
                    <Button 
                      className="ml-auto rounded-full bg-health-green hover:bg-health-green/90"
                      onClick={() => handleNavigate(hospital.coordinates, hospital.name)}
                    >
                      Navigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* First aid guidance */}
      <GlassCard className="lg:row-span-1 flex flex-col h-full">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-health-light-blue flex items-center justify-center">
            <HeartPulse className="h-4 w-4 text-health-blue" />
          </div>
          <h3 className="text-lg font-medium">First Aid Guidance</h3>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            {emergencyInstructions.map((instruction, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-white dark:bg-white/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                  {instruction.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground leading-none">{instruction.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{instruction.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 mt-6 border-t border-border/20">
            <Button 
              variant="ghost" 
              className="w-full text-health-blue hover:bg-health-blue/10 rounded-full h-11"
              onClick={() => setShowFirstAidGuide(true)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Complete First Aid Guide
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* First Aid Guide Dialog */}
      <FirstAidGuideDialog open={showFirstAidGuide} onOpenChange={setShowFirstAidGuide} />
    </div>
  );
};

export default EmergencyFinder;
