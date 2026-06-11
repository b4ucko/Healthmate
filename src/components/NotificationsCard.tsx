
import React, { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

interface NotificationsCardProps {
  notifications: Notification[];
}

const NotificationsCard = ({ notifications: initialNotifications }: NotificationsCardProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success("Notification marked as read");
  };
  
  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info("Notification dismissed");
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast.success("All notifications marked as read");
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2 text-health-blue" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-auto pr-1">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`
                  p-3 rounded-lg relative border-l-2
                  ${!notification.read ? 'bg-muted' : 'bg-transparent'}
                  ${notification.type === 'info' ? 'border-blue-500' : ''}
                  ${notification.type === 'warning' ? 'border-amber-500' : ''}
                  ${notification.type === 'success' ? 'border-green-500' : ''}
                  ${notification.type === 'error' ? 'border-red-500' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{notification.message}</p>
                <div className="flex justify-end mt-2 gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No new notifications</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
