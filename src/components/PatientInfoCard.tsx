
import React, { useState } from "react";
import { User, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientInfo {
  height: string;
  weight: string;
  allergies: string[];
  conditions: string[];
}

interface PatientInfoCardProps {
  patientInfo: PatientInfo;
  onUpdate?: (data: PatientInfo) => void;
}

const PatientInfoCard = ({ patientInfo, onUpdate }: PatientInfoCardProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PatientInfo>(patientInfo);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormData(patientInfo);
    }
    setOpen(newOpen);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...formData,
        allergies: typeof formData.allergies === 'string' ? (formData.allergies as string).split(',').map(s => s.trim()).filter(Boolean) : formData.allergies,
        conditions: typeof formData.conditions === 'string' ? (formData.conditions as string).split(',').map(s => s.trim()).filter(Boolean) : formData.conditions,
      });
    }
    setOpen(false);
  };

  const allergiesList = Array.isArray(patientInfo.allergies) ? patientInfo.allergies : [];
  const conditionsList = Array.isArray(patientInfo.conditions) ? patientInfo.conditions : [];

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <User className="h-5 w-5 mr-2 text-health-blue" />
          Personal Information
        </CardTitle>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Personal Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} placeholder="e.g. 175 cm" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} placeholder="e.g. 70 kg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                <Input id="allergies" value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies} onChange={(e) => setFormData({...formData, allergies: e.target.value as any})} placeholder="e.g. Penicillin, Peanuts" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="conditions">Conditions (comma-separated)</Label>
                <Input id="conditions" value={Array.isArray(formData.conditions) ? formData.conditions.join(', ') : formData.conditions} onChange={(e) => setFormData({...formData, conditions: e.target.value as any})} placeholder="e.g. Hypertension, Asthma" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Height</span>
            <span className="text-sm font-medium">{patientInfo.height || <span className="text-muted-foreground italic">Not provided</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Weight</span>
            <span className="text-sm font-medium">{patientInfo.weight || <span className="text-muted-foreground italic">Not provided</span>}</span>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-muted-foreground text-sm">Allergies</span>
            <div className="flex flex-wrap gap-1">
              {allergiesList.length > 0 ? allergiesList.map(allergy => (
                <Badge key={allergy} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {allergy}
                </Badge>
              )) : <span className="text-sm text-muted-foreground italic">Not provided</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-muted-foreground text-sm">Conditions</span>
            <div className="flex flex-wrap gap-1">
              {conditionsList.length > 0 ? conditionsList.map(condition => (
                <Badge key={condition} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {condition}
                </Badge>
              )) : <span className="text-sm text-muted-foreground italic">Not provided</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
