
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, UserCog, Shield, Bell, Settings, LogOut, LayoutDashboard, Phone, MapPin, Stethoscope, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserProfile = () => {
  const { userInfo, logout, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    address: userInfo?.address || '',
    specialty: userInfo?.specialty || '',
    experience: userInfo?.experience || '',
    age: userInfo?.age || '',
    gender: userInfo?.gender || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    updateUserInfo(formData);
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Successfully signed out!');
    navigate('/');
  };
  
  const handleNavigateToDashboard = () => {
    if (!userInfo) return;
    
    if (userInfo.userType === 'doctor') {
      navigate('/doctor-dashboard');
    } else if (userInfo.userType === 'wholesaler') {
      navigate('/wholesale-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
  };

  if (!userInfo) {
    navigate('/sign-in');
    return null;
  }

  const getDashboardText = () => {
    switch (userInfo.userType) {
      case 'doctor':
        return 'Doctor Dashboard';
      case 'wholesaler':
        return 'Wholesale Dashboard';
      default:
        return 'Patient Dashboard';
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-16 px-4 md:px-6 min-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-health-light-blue flex items-center justify-center mb-3">
                    <User className="h-12 w-12 text-health-blue" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{userInfo.name}</CardTitle>
                  <CardDescription className="text-sm capitalize">{userInfo.userType}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="flex flex-col space-y-1">
                  <Button 
                    variant="secondary"
                    className="justify-start mb-4" 
                    onClick={handleNavigateToDashboard}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {getDashboardText()}
                  </Button>
                  
                  <Button 
                    variant={activeTab === "profile" ? "secondary" : "ghost"} 
                    className="justify-start" 
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile Information
                  </Button>
                  <Button 
                    variant={activeTab === "security" ? "secondary" : "ghost"} 
                    className="justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Security Settings
                  </Button>
                  <Button 
                    variant={activeTab === "notifications" ? "secondary" : "ghost"} 
                    className="justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === "preferences" ? "secondary" : "ghost"} 
                    className="justify-start"
                    onClick={() => setActiveTab("preferences")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </Button>
                </nav>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              type="email"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              type="tel"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input 
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input 
                              id="age"
                              name="age"
                              value={formData.age}
                              onChange={handleInputChange}
                              type="number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select 
                              value={formData.gender}
                              onValueChange={(value) => handleSelectChange('gender', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {userInfo.userType === 'doctor' && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="specialty">Medical Specialty</Label>
                                <Input 
                                  id="specialty"
                                  name="specialty"
                                  value={formData.specialty}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Input 
                                  id="experience"
                                  name="experience"
                                  value={formData.experience}
                                  onChange={handleInputChange}
                                  type="number"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                          <div className="flex items-center p-3 rounded-md bg-muted">
                            <User className="mr-3 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{userInfo.name}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                          <div className="flex items-center p-3 rounded-md bg-muted">
                            <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{userInfo.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">User Type</p>
                          <div className="flex items-center p-3 rounded-md bg-muted">
                            <UserCog className="mr-3 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium capitalize">{userInfo.userType}</span>
                          </div>
                        </div>

                        {userInfo.phone && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                            <div className="flex items-center p-3 rounded-md bg-muted">
                              <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{userInfo.phone}</span>
                            </div>
                          </div>
                        )}

                        {userInfo.address && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Address</p>
                            <div className="flex items-center p-3 rounded-md bg-muted">
                              <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{userInfo.address}</span>
                            </div>
                          </div>
                        )}

                        {userInfo.age && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Age</p>
                            <div className="flex items-center p-3 rounded-md bg-muted">
                              <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{userInfo.age}</span>
                            </div>
                          </div>
                        )}

                        {userInfo.gender && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Gender</p>
                            <div className="flex items-center p-3 rounded-md bg-muted">
                              <User className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium capitalize">{userInfo.gender}</span>
                            </div>
                          </div>
                        )}

                        {userInfo.userType === 'doctor' && userInfo.specialty && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Specialty</p>
                            <div className="flex items-center p-3 rounded-md bg-muted">
                              <Stethoscope className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{userInfo.specialty}</span>
                            </div>
                          </div>
                        )}

                        {userInfo.userType === 'doctor' && userInfo.experience && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Years of Experience</p>
                            <div className="flex items-center p-3 rounded-md bg-muted">
                              <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{userInfo.experience}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {editMode ? (
                      <>
                        <Button variant="outline" className="mr-2" onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setEditMode(true)}>Edit Profile</Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your security preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Security settings like password change will be implemented in future updates.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Notification settings will be implemented in future updates.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your application experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      User preferences will be implemented in future updates.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
