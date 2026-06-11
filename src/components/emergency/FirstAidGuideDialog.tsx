
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Pill, Clipboard, Activity, AlarmClock, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import GlassCard from '../ui/GlassCard';

interface FirstAidGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FirstAidGuideDialog = ({ open, onOpenChange }: FirstAidGuideDialogProps) => {
  const [activeTab, setActiveTab] = useState('cardiac');

  const firstAidSections = {
    cardiac: {
      icon: <Heart className="h-5 w-5 text-health-red" />,
      title: "Cardiac Emergencies",
      guides: [
        {
          title: "Heart Attack",
          steps: [
            "Call emergency services immediately (911)",
            "Have the person sit or lie down in a comfortable position",
            "Loosen tight clothing",
            "If the person is not allergic to aspirin, have them chew one adult aspirin (325 mg) or four baby aspirins",
            "Monitor vital signs and be prepared to perform CPR if needed"
          ]
        },
        {
          title: "CPR (Adult)",
          steps: [
            "Ensure the scene is safe",
            "Check for responsiveness by tapping the person and shouting",
            "If unresponsive, call 911 immediately",
            "Place the person on their back on a firm surface",
            "Position your hands in the center of the chest (between the nipples)",
            "Push hard and fast (100-120 compressions per minute)",
            "Allow the chest to fully recoil between compressions",
            "Minimize interruptions in compressions"
          ]
        }
      ]
    },
    breathing: {
      icon: <Activity className="h-5 w-5 text-health-blue" />,
      title: "Breathing Problems",
      guides: [
        {
          title: "Choking (Conscious Adult)",
          steps: [
            "Stand behind the person and place one foot between their feet for stability",
            "Wrap your arms around their waist",
            "Make a fist with one hand and place it above the navel (belly button)",
            "Grasp your fist with your other hand",
            "Perform quick, upward abdominal thrusts until the object is expelled or the person becomes unconscious",
            "If the person becomes unconscious, lower them to the ground and begin CPR"
          ]
        },
        {
          title: "Asthma Attack",
          steps: [
            "Help the person sit upright",
            "Assist them in using their prescribed inhaler",
            "Encourage slow, deep breaths",
            "If symptoms worsen or don't improve within 5-10 minutes of using the inhaler, call emergency services",
            "Stay with the person and help them remain calm"
          ]
        }
      ]
    },
    bleeding: {
      icon: <AlertTriangle className="h-5 w-5 text-health-yellow" />,
      title: "Bleeding & Wounds",
      guides: [
        {
          title: "Severe Bleeding",
          steps: [
            "Apply direct pressure to the wound using a clean cloth or bandage",
            "If blood soaks through, add more material without removing the first layer",
            "If possible, elevate the wounded area above the heart",
            "Use pressure points (wrist, groin, or behind the knee) if direct pressure doesn't help",
            "Apply a tourniquet only as a last resort for life-threatening bleeding that can't be controlled by other means",
            "Call emergency services immediately"
          ]
        },
        {
          title: "Minor Wound Care",
          steps: [
            "Wash your hands with soap and water",
            "Clean the wound with clean water and mild soap",
            "Remove any debris or dirt",
            "Apply an antibiotic ointment",
            "Cover with a sterile bandage",
            "Change the dressing daily and watch for signs of infection"
          ]
        }
      ]
    },
    burns: {
      icon: <AlarmClock className="h-5 w-5 text-health-orange" />,
      title: "Burns",
      guides: [
        {
          title: "Minor Burns (First Degree)",
          steps: [
            "Cool the burn with cool (not cold) running water for 10-15 minutes",
            "Do not use ice, as it can damage the tissue",
            "Apply aloe vera gel or moisturizer",
            "Cover with a sterile, non-adhesive bandage",
            "Take over-the-counter pain relievers if needed"
          ]
        },
        {
          title: "Severe Burns",
          steps: [
            "Call emergency services immediately",
            "Do not remove burned clothing that's stuck to the skin",
            "Cover the area with a clean, dry sheet or bandage",
            "Elevate the burned body part above heart level if possible",
            "Monitor for signs of shock",
            "Do not immerse large severe burns in cold water",
            "Do not apply ointments, butter, or other home remedies"
          ]
        }
      ]
    },
    poisoning: {
      icon: <Pill className="h-5 w-5 text-health-purple" />,
      title: "Poisoning",
      guides: [
        {
          title: "Poison Ingestion",
          steps: [
            "Call Poison Control immediately (1-800-222-1222)",
            "Do not induce vomiting unless specifically instructed to do so by a medical professional",
            "If the person is unconscious, call 911",
            "Try to identify what was consumed and how much",
            "Follow the instructions provided by Poison Control or emergency services"
          ]
        },
        {
          title: "Carbon Monoxide Poisoning",
          steps: [
            "Move the person to fresh air immediately",
            "Call emergency services",
            "Begin CPR if the person is not breathing",
            "Open doors and windows if it's safe to do so",
            "Leave the building until emergency services arrive"
          ]
        }
      ]
    },
    fractures: {
      icon: <Clipboard className="h-5 w-5 text-health-green" />,
      title: "Fractures & Sprains",
      guides: [
        {
          title: "Suspected Fracture",
          steps: [
            "Stop any bleeding by applying pressure",
            "Immobilize the injured area - do not try to realign the bone",
            "Apply a cold pack wrapped in cloth to reduce swelling",
            "Treat for shock if necessary by laying the person flat with feet elevated",
            "Seek medical help immediately",
            "Do not move the person unless absolutely necessary"
          ]
        },
        {
          title: "Sprains",
          steps: [
            "Follow the RICE method:",
            "Rest - avoid using the injured area",
            "Ice - apply cold packs for 15-20 minutes, several times daily",
            "Compression - use an elastic bandage to reduce swelling",
            "Elevation - keep the injured area above heart level when possible",
            "Take over-the-counter pain medication if needed",
            "See a doctor if pain is severe or doesn't improve within 24-48 hours"
          ]
        }
      ]
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete First Aid Guide</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="cardiac" className="w-full mt-2 flex-grow flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="cardiac" className="flex flex-col items-center gap-1 h-auto py-2">
              <Heart className="h-5 w-5 text-health-red" />
              <span className="text-xs">Cardiac</span>
            </TabsTrigger>
            <TabsTrigger value="breathing" className="flex flex-col items-center gap-1 h-auto py-2">
              <Activity className="h-5 w-5 text-health-blue" />
              <span className="text-xs">Breathing</span>
            </TabsTrigger>
            <TabsTrigger value="bleeding" className="flex flex-col items-center gap-1 h-auto py-2">
              <AlertTriangle className="h-5 w-5 text-health-yellow" />
              <span className="text-xs">Bleeding</span>
            </TabsTrigger>
            <TabsTrigger value="burns" className="flex flex-col items-center gap-1 h-auto py-2">
              <AlarmClock className="h-5 w-5 text-health-orange" />
              <span className="text-xs">Burns</span>
            </TabsTrigger>
            <TabsTrigger value="poisoning" className="flex flex-col items-center gap-1 h-auto py-2">
              <Pill className="h-5 w-5 text-health-purple" />
              <span className="text-xs">Poisoning</span>
            </TabsTrigger>
            <TabsTrigger value="fractures" className="flex flex-col items-center gap-1 h-auto py-2">
              <Clipboard className="h-5 w-5 text-health-green" />
              <span className="text-xs">Fractures</span>
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(firstAidSections).map(([key, section]) => (
            <TabsContent key={key} value={key} className="flex-grow">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  
                  {section.guides.map((guide, index) => (
                    <GlassCard key={index} className="overflow-hidden">
                      <h3 className="text-lg font-medium mb-4">{guide.title}</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </GlassCard>
                  ))}
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="flex items-center text-amber-800">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>
                        <span className="font-medium">Important:</span> This guide is for informational purposes only. 
                        In case of a medical emergency, always call emergency services (911) immediately.
                      </span>
                    </p>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="flex justify-end pt-4">
                <Button onClick={() => onOpenChange(false)}>Close</Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FirstAidGuideDialog;
