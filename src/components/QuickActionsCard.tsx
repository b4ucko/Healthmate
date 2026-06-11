
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, FileText, UserPlus, MessageSquare, Phone, Video, Users, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ActionItem {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  color?: string;
}

interface QuickActionsCardProps {
  isDoctor?: boolean;
  actions?: ActionItem[];
}

const QuickActionsCard = ({ isDoctor = false, actions }: QuickActionsCardProps) => {
  const navigate = useNavigate();
  
  // Default actions based on user type with proper navigation
  const defaultActions: ActionItem[] = isDoctor ? [
    {
      icon: CalendarClock,
      title: "Schedule Appointment",
      onClick: () => navigate("/appointments"),
      color: "text-blue-500"
    },
    {
      icon: FileText,
      title: "Write Prescription",
      onClick: () => toast.info("Prescription feature will be available soon!"),
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Patient Records",
      onClick: () => navigate("/doctor-dashboard"),
      color: "text-amber-500"
    },
    {
      icon: UserPlus,
      title: "Add New Patient",
      onClick: () => toast.info("Add new patient feature will be available soon!"),
      color: "text-emerald-500"
    },
    {
      icon: MessageSquare,
      title: "Send Message",
      onClick: () => navigate("/chat"),
      color: "text-green-500"
    },
    {
      icon: SquarePen,
      title: "Write Note",
      onClick: () => toast.info("Notes feature will be available soon!"),
      color: "text-indigo-500"
    }
  ] : [
    {
      icon: CalendarClock,
      title: "Book Appointment",
      onClick: () => navigate("/appointments"),
      color: "text-blue-500"
    },
    {
      icon: Phone,
      title: "Contact Doctor",
      onClick: () => navigate("/doctors"),
      color: "text-purple-500"
    },
    {
      icon: Video,
      title: "Start Video Call",
      onClick: () => toast.info("Video call feature will be available soon!"),
      color: "text-amber-500"
    },
    {
      icon: FileText,
      title: "Request Records",
      onClick: () => toast.info("Medical records request has been submitted!"),
      color: "text-green-500"
    },
    {
      icon: MessageSquare,
      title: "Send Message",
      onClick: () => navigate("/chat"),
      color: "text-emerald-500"
    },
    {
      icon: SquarePen,
      title: "Upload Documents",
      onClick: () => navigate("/user-profile"),
      color: "text-indigo-500"
    }
  ];
  
  const displayActions = actions || defaultActions;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {displayActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-4 min-h-[100px] rounded-2xl border bg-card hover:bg-muted/30 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                onClick={action.onClick}
              >
                <Icon className={`h-6 w-6 mb-2.5 ${action.color || "text-primary"}`} />
                <span className="text-sm font-medium text-center leading-snug">{action.title}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
