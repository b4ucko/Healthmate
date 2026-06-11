
import React from "react";
import { format } from "date-fns";
import { Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AppointmentCardProps {
  id: number;
  name: string;
  age: number;
  purpose?: string;
  specialty?: string;
  time: Date;
  avatar: string;
  location?: string;
  showActions?: boolean;
  isDoctor?: boolean;
}

const AppointmentCard = ({
  id,
  name,
  age,
  purpose,
  specialty,
  time,
  avatar,
  location,
  showActions = true,
  isDoctor = false,
}: AppointmentCardProps) => {
  return (
    <div key={id} className="flex items-start p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-10 w-10 border border-muted">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {isDoctor ? name : `${name}, ${age}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {isDoctor ? specialty : purpose}
          </p>
          {location && (
            <p className="text-xs text-muted-foreground">{location}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-medium">{format(time, "h:mm a")}</span>
        {showActions && (
          <div className="flex gap-1 mt-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
