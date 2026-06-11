
import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface DashboardMetricCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
  };
  subText?: string;
  className?: string;
  iconColor?: string;
}

const DashboardMetricCard = ({
  title,
  icon: Icon,
  value,
  badge,
  subText,
  className,
  iconColor = "text-health-blue"
}: DashboardMetricCardProps) => {
  const getBadgeClass = (variant = "default") => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "warning":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "danger":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "info":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default:
        return "bg-green-100 text-green-700 hover:bg-green-100";
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Icon className={cn("h-5 w-5 mr-2", iconColor)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="text-3xl font-bold">{value}</div>
          {badge && (
            <Badge className={cn("ml-2", getBadgeClass(badge.variant))}>
              {badge.text}
            </Badge>
          )}
        </div>
        {subText && (
          <p className="text-sm text-muted-foreground mt-1">{subText}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
