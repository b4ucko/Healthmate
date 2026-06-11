
import React, { useState } from "react";
import { format } from "date-fns";
import { Pill, Edit2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  prescribedBy: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed";
}

interface MedicationsCardProps {
  medications: Medication[];
  title?: string;
  description?: string;
  onUpdate?: (data: Medication[]) => void;
}

const MedicationsCard = ({ 
  medications, 
  title = "Current Medications",
  description,
  onUpdate
}: MedicationsCardProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Medication[]>(medications || []);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormData(medications || []);
    }
    setOpen(newOpen);
  };

  const handleMedChange = (index: number, field: string, value: any) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleAddMed = () => {
    setFormData([
      ...formData, 
      { 
        id: Date.now(), 
        name: "", 
        dosage: "", 
        prescribedBy: "", 
        startDate: new Date(), 
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "active" 
      }
    ]);
  };

  const handleRemoveMed = (index: number) => {
    const updated = [...formData];
    updated.splice(index, 1);
    setFormData(updated);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData.filter(m => m.name.trim() !== ""));
    }
    setOpen(false);
  };

  const safeMedications = medications || [];
  const activeMeds = safeMedications.filter(med => med.status === "active");
  const completedMeds = safeMedications.filter(med => med.status === "completed");
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg flex items-center">
            <Pill className="h-5 w-5 mr-2 text-health-blue" />
            {title}
          </CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2">
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Medications</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {formData.map((med, index) => (
                <div key={med.id || index} className="grid gap-3 p-4 border rounded-md relative bg-muted/20">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700" onClick={() => handleRemoveMed(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2 pr-6">
                      <Label>Medication Name</Label>
                      <Input value={med.name} onChange={(e) => handleMedChange(index, "name", e.target.value)} placeholder="e.g. Lisinopril" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Select value={med.status} onValueChange={(val) => handleMedChange(index, "status", val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Dosage</Label>
                      <Input value={med.dosage} onChange={(e) => handleMedChange(index, "dosage", e.target.value)} placeholder="e.g. 10mg, once daily" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Prescribed By</Label>
                      <Input value={med.prescribedBy} onChange={(e) => handleMedChange(index, "prescribedBy", e.target.value)} placeholder="e.g. Dr. Smith" />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddMed} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Medication
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
          {activeMeds.length > 0 && (
            <>
              {activeMeds.map(med => (
                <div key={med.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Active</Badge>
                  </div>
                  <p className="text-sm mt-1">
                    {format(med.startDate, "MMM d")} - {format(med.endDate, "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </>
          )}
          
          {completedMeds.length > 0 && (
            <>
              <h3 className="font-medium text-md pt-2">Medication History</h3>
              {completedMeds.map(med => (
                <div key={med.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <p className="text-sm mt-1">
                    {format(med.startDate, "MMM d")} - {format(med.endDate, "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </>
          )}
          
          {safeMedications.length === 0 && (
            <div className="text-center py-6">
              <Pill className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm italic">No medications recorded.</p>
            </div>
          )}
          
          {safeMedications.length > 0 && (
            <Button variant="outline" className="w-full mt-2">View All Medications</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsCard;
