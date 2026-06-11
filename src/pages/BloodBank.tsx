
import { useState } from 'react';
import { Droplet, MapPin, Search, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';

const bloodBanks = [
  {
    id: 1,
    name: "City Central Blood Bank",
    address: "123 Main Street, Delhi",
    contact: "+91 98765 43210",
    bloodTypes: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    distance: "2.3 km"
  },
  {
    id: 2,
    name: "Lifeline Blood Center",
    address: "456 Park Avenue, Mumbai",
    contact: "+91 98765 12345",
    bloodTypes: ["A+", "B+", "O+", "AB+"],
    distance: "3.8 km"
  },
  {
    id: 3,
    name: "Red Cross Blood Bank",
    address: "789 Hospital Road, Bangalore",
    contact: "+91 98765 67890",
    bloodTypes: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    distance: "5.1 km"
  },
  {
    id: 4,
    name: "Memorial Hospital Blood Bank",
    address: "234 Health Avenue, Chennai",
    contact: "+91 98765 09876",
    bloodTypes: ["A+", "B+", "O+", "O-"],
    distance: "6.7 km"
  }
];

const bloodAvailability = {
  "A+": { status: "High", units: 45 },
  "A-": { status: "Medium", units: 22 },
  "B+": { status: "High", units: 38 },
  "B-": { status: "Low", units: 12 },
  "AB+": { status: "Medium", units: 18 },
  "AB-": { status: "Critical", units: 5 },
  "O+": { status: "High", units: 50 },
  "O-": { status: "Low", units: 15 }
};

interface RequestFormData {
  name: string;
  bloodGroup: string;
  units: number;
  contactNumber: string;
  purpose: string;
}

const BloodBank = () => {
  const { isAuthenticated, userInfo } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodBank, setSelectedBloodBank] = useState<number | null>(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("");
  const [requestUnits, setRequestUnits] = useState<number>(1);
  const [requestPurpose, setRequestPurpose] = useState<string>("");
  const [requestContact, setRequestContact] = useState<string>("");

  const filteredBloodBanks = bloodBanks.filter(bank => 
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    bank.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckAvailability = (id: number) => {
    setSelectedBloodBank(id);
    const bank = bloodBanks.find(b => b.id === id);
    
    // Log availability check
    const newCheck = {
      id: `blood-check-${Date.now()}`,
      userId: userInfo?.id || 'guest',
      bloodBankId: id,
      bloodBankName: bank?.name || `Blood Bank #${id}`,
      createdAt: new Date().toISOString()
    };
    
    const storedChecks = JSON.parse(localStorage.getItem('bloodBankChecks') || '[]');
    localStorage.setItem('bloodBankChecks', JSON.stringify([newCheck, ...storedChecks]));
    
    toast.success("Availability inquiry sent! The blood bank will contact you shortly.");
  };

  const handleBloodRequest = () => {
    if (!selectedBloodGroup) {
      toast.error("Please select a blood group");
      return;
    }

    const requestData: RequestFormData = {
      name: userInfo?.name || "Guest User",
      bloodGroup: selectedBloodGroup,
      units: requestUnits,
      contactNumber: requestContact,
      purpose: requestPurpose
    };

    // Log blood bank request
    const newBankRequest = {
      id: `blood-bank-req-${Date.now()}`,
      userId: userInfo?.id || 'guest',
      bloodBankId: selectedBloodBank,
      bloodBankName: bloodBanks.find(b => b.id === selectedBloodBank)?.name || "Blood Bank",
      bloodGroup: selectedBloodGroup,
      units: requestUnits,
      contactNumber: requestContact,
      purpose: requestPurpose,
      createdAt: new Date().toISOString()
    };
    
    const storedBankRequests = JSON.parse(localStorage.getItem('bloodBankRequests') || '[]');
    localStorage.setItem('bloodBankRequests', JSON.stringify([newBankRequest, ...storedBankRequests]));

    toast.success(`Blood request for ${requestUnits} units of ${selectedBloodGroup} submitted successfully!`);

    // Reset form
    setSelectedBloodGroup("");
    setRequestUnits(1);
    setRequestPurpose("");
    setRequestContact("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('bloodBank.title')}</h1>
              <p className="text-muted-foreground max-w-2xl">
                {t('bloodBank.subtitle')}
              </p>

              {isAuthenticated ? (
                <div className="mt-4 flex items-center text-health-blue">
                  <User className="mr-2 h-5 w-5" />
                  <span>{t('bloodBank.welcome')} {userInfo?.name}</span>
                </div>
              ) : (
                <p className="mt-4 text-health-red">
                  {t('bloodBank.signInPrompt')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t('bloodBank.searchPlaceholder')}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBloodBanks.map(bank => (
                    <Card key={bank.id} className="animate-fade-in">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Droplet className="h-5 w-5 text-health-red" />
                          {bank.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {bank.address} ({bank.distance})
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2 text-sm">Contact: {bank.contact}</p>
                        <div>
                          <p className="text-sm font-medium mb-1">{t('bloodBank.availableBloodTypes')}</p>
                          <div className="flex flex-wrap gap-2">
                            {bank.bloodTypes.map(type => (
                              <span 
                                key={type} 
                                className="px-2 py-1 bg-health-blue/10 border border-health-blue/30 text-health-blue rounded-full text-xs font-semibold"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => handleCheckAvailability(bank.id)}
                          variant="outline"
                        >
                          {t('bloodBank.checkAvailability')}
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="flex-1">{t('bloodBank.requestBlood')}</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                             <DialogHeader>
                              <DialogTitle>{t('bloodBank.requestBlood')}</DialogTitle>
                              <DialogDescription>
                                {t('bloodBank.purposePlaceholder')} - {bank.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="blood-group">{t('bloodBank.bloodGroup')}</Label>
                                <Select 
                                  value={selectedBloodGroup} 
                                  onValueChange={setSelectedBloodGroup}
                                >
                                  <SelectTrigger id="blood-group">
                                    <SelectValue placeholder={t('bloodBank.selectBloodGroup')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bank.bloodTypes.map(type => (
                                      <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="units">{t('bloodBank.unitsRequired')}</Label>
                                <Input 
                                  id="units" 
                                  type="number" 
                                  min="1" 
                                  max="10"
                                  value={requestUnits}
                                  onChange={(e) => setRequestUnits(parseInt(e.target.value))}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="contact">{t('bloodBank.contactNumber')}</Label>
                                <Input 
                                  id="contact" 
                                  placeholder={t('bloodBank.contactPlaceholder')}
                                  value={requestContact}
                                  onChange={(e) => setRequestContact(e.target.value)}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="purpose">{t('bloodBank.purpose')}</Label>
                                <Input 
                                  id="purpose" 
                                  placeholder={t('bloodBank.purposePlaceholder')}
                                  value={requestPurpose}
                                  onChange={(e) => setRequestPurpose(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button type="submit" onClick={handleBloodRequest}>{t('bloodBank.submitRequest')}</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('bloodBank.bloodAvailability')}</CardTitle>
                    <CardDescription>{t('bloodBank.currentStatus')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                         <TableHead>{t('bloodBank.bloodType')}</TableHead>
                          <TableHead>{t('bloodBank.status')}</TableHead>
                          <TableHead>{t('bloodBank.units')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(bloodAvailability).map(([type, data]) => (
                          <TableRow key={type}>
                            <TableCell className="font-medium">{type}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                                {data.status}
                              </span>
                            </TableCell>
                            <TableCell>{data.units}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('bloodBank.emergencyContacts')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{t('bloodBank.bloodBankHotline')}</p>
                      <p className="text-sm">+91 1800-1234-567</p>
                    </div>
                    <div>
                      <p className="font-medium">{t('bloodBank.ambulanceServices')}</p>
                      <p className="text-sm">108</p>
                    </div>
                    <div>
                      <p className="font-medium">{t('bloodBank.emergencyRoom')}</p>
                      <p className="text-sm">+91 1800-8765-432</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default BloodBank;
