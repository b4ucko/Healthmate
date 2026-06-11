
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Edit2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HealthMetric {
  name: string;
  value: string;
  percentage: number;
  color: "green" | "amber" | "red";
}

interface HealthMetricsCardProps {
  metrics: HealthMetric[];
  onUpdate?: (metrics: HealthMetric[]) => void;
}

const HealthMetricsCard = ({ metrics, onUpdate }: HealthMetricsCardProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<HealthMetric[]>(metrics || []);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormData(metrics || []);
    }
    setOpen(newOpen);
  };

  const handleMetricChange = (index: number, field: string, value: any) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleAddMetric = () => {
    setFormData([...formData, { name: "", value: "", percentage: 50, color: "green" }]);
  };

  const handleRemoveMetric = (index: number) => {
    const updated = [...formData];
    updated.splice(index, 1);
    setFormData(updated);
  };

  const handleSave = () => {
    if (onUpdate) {
      // filter out empty metrics
      onUpdate(formData.filter(m => m.name.trim() !== ""));
    }
    setOpen(false);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "green": return "bg-green-100 after:bg-green-500";
      case "amber": return "bg-amber-100 after:bg-amber-500";
      case "red": return "bg-red-100 after:bg-red-500";
      default: return "bg-green-100 after:bg-green-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 mr-2 text-health-blue" />
          Health Metrics
        </CardTitle>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Health Metrics</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {formData.map((metric, index) => (
                <div key={index} className="grid gap-3 p-3 border rounded-md relative">
                  <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-red-500 hover:text-red-700" onClick={() => handleRemoveMetric(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid gap-2 pr-6">
                    <Label>Metric Name</Label>
                    <Input value={metric.name} onChange={(e) => handleMetricChange(index, "name", e.target.value)} placeholder="e.g. Blood Pressure" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Value</Label>
                      <Input value={metric.value} onChange={(e) => handleMetricChange(index, "value", e.target.value)} placeholder="e.g. 120/80 mmHg" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Status Color</Label>
                      <Select value={metric.color} onValueChange={(val) => handleMetricChange(index, "color", val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green">Green (Good)</SelectItem>
                          <SelectItem value="amber">Amber (Warning)</SelectItem>
                          <SelectItem value="red">Red (Alert)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddMetric} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Metric
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!metrics || metrics.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <span className="italic">No metrics added yet.</span>
            </div>
          ) : (
            metrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className="text-sm font-medium">{metric.value}</span>
                </div>
                <div className={`h-2 ${getColorClass(metric.color)} rounded-full overflow-hidden relative`}>
                  <div
                    className={`h-full after:absolute after:inset-y-0 after:left-0 after:rounded-full bg-current opacity-20`}
                    style={{ width: `${metric.percentage || 50}%` }}
                  ></div>
                  <div
                    className={`h-full absolute inset-y-0 left-0 rounded-full`}
                    style={{ width: `${metric.percentage || 50}%`, backgroundColor: 'currentColor' }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;
