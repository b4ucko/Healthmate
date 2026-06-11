
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientInfoCard from '@/components/PatientInfoCard';
import HealthMetricsCard from '@/components/HealthMetricsCard';
import QuickActionsCard from '@/components/QuickActionsCard';
import MedicationsCard from '@/components/MedicationsCard';
import NotificationsCard from '@/components/NotificationsCard';
import DashboardUpcomingEvents from '@/components/DashboardUpcomingEvents';
import DashboardCalendar from '@/components/DashboardCalendar';
import HealthRecommendation from '@/components/ai/HealthRecommendation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate, useNavigate } from 'react-router-dom';
import AppointmentList from '@/components/appointment/AppointmentList';
import { getOrdersByUserId, updateOrderStatus } from '@/lib/database/mongodb/services';
import { Package, ShoppingBag, Truck, CheckCircle, Droplet, Baby, Activity, Heart, Search, MapPin, Calendar, Clock, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';

const PatientDashboard = () => {
  const { isAuthenticated, userInfo } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders for this patient
    const fetchOrders = async () => {
      if (!userInfo?.id) return;
      
      try {
        const userOrders = await getOrdersByUserId(userInfo.id);
        setOrders(userOrders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };
    
    fetchOrders();
  }, [userInfo]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'cancelled');
      setOrders((prevOrders: any) => 
        prevOrders.map((order: any) => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'returned');
      setOrders((prevOrders: any) => 
        prevOrders.map((order: any) => 
          order.id === orderId ? { ...order, status: 'returned' } : order
        )
      );
      toast.success("Return request submitted successfully");
    } catch (error) {
      console.error("Error returning order:", error);
      toast.error("Failed to return order");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (userInfo?.userType !== 'patient') {
    if (userInfo?.userType === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (userInfo?.userType === 'wholesaler') {
      return <Navigate to="/wholesale-dashboard" replace />;
    }
  }

  const [healthMetrics, setHealthMetrics] = useState(() => {
    const saved = localStorage.getItem('healthMetrics');
    return saved ? JSON.parse(saved) : [];
  });

  const [patientInfo, setPatientInfo] = useState(() => {
    const saved = localStorage.getItem('patientInfo');
    return saved ? JSON.parse(saved) : { height: "", weight: "", allergies: [], conditions: [] };
  });

  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved).map((m: any) => ({
      ...m, 
      startDate: new Date(m.startDate), 
      endDate: new Date(m.endDate)
    })) : [];
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('healthMetrics', JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  useEffect(() => {
    localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
  }, [patientInfo]);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  // Specialized Services logs
  const [bloodRequests, setBloodRequests] = useState([]);
  const [bloodDonations, setBloodDonations] = useState([]);
  const [bloodBankChecks, setBloodBankChecks] = useState([]);
  const [bloodBankRequests, setBloodBankRequests] = useState([]);
  const [pregnancyAppointments, setPregnancyAppointments] = useState([]);

  useEffect(() => {
    if (!userInfo?.id) return;

    const uId = userInfo.id;

    // Load Blood Requests
    const storedBloodReqs = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    const userBloodReqs = storedBloodReqs.filter((item: any) => item.userId === uId);
    setBloodRequests(userBloodReqs);

    // Load Blood Donations
    const storedBloodDons = JSON.parse(localStorage.getItem('bloodDonations') || '[]');
    const userBloodDons = storedBloodDons.filter((item: any) => item.userId === uId);
    setBloodDonations(userBloodDons);

    // Load Blood Bank Checks
    const storedBankChecks = JSON.parse(localStorage.getItem('bloodBankChecks') || '[]');
    const userBankChecks = storedBankChecks.filter((item: any) => item.userId === uId);
    setBloodBankChecks(userBankChecks);

    // Load Blood Bank Requests
    const storedBankReqs = JSON.parse(localStorage.getItem('bloodBankRequests') || '[]');
    const userBankReqs = storedBankReqs.filter((item: any) => item.userId === uId);
    setBloodBankRequests(userBankReqs);

    // Load Pregnancy Priority Appointments
    const storedApts = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    const userPregnancyApts = storedApts.filter((item: any) => 
      (item.patientId === uId || item.patientEmail === userInfo.email) && item.isPregnancyPriority === true
    );
    setPregnancyAppointments(userPregnancyApts);
  }, [userInfo]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Package className="h-5 w-5 text-amber-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'returned':
        return <RotateCcw className="h-5 w-5 text-slate-500" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t('patientDashboard.title')}</h1>
              <p className="text-muted-foreground">
                {t('patientDashboard.welcomeBack')}, {userInfo?.name || 'Patient'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PatientInfoCard patientInfo={patientInfo} onUpdate={setPatientInfo} />
                <HealthMetricsCard metrics={healthMetrics} onUpdate={setHealthMetrics} />
                <QuickActionsCard />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AppointmentList />
                <MedicationsCard medications={medications} onUpdate={setMedications} />
              </div>
            </div>
            
            <div className="space-y-6">
              <NotificationsCard notifications={notifications} />
              <DashboardCalendar />
            </div>
          </div>

          {/* Orders Card (Full Width) */}
          <div className="my-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t('patientDashboard.recentOrders')}</CardTitle>
                    <CardDescription>{t('patientDashboard.ordersDescription')}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/pharmacy')}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t('patientDashboard.shopPharmacy')}
                  </Button>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin h-8 w-8 border-4 border-health-blue border-t-transparent rounded-full"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              {getStatusIcon(order.status)}
                              <div className="ml-3">
                                <h4 className="font-medium">Order #{order.id.substring(order.id.lastIndexOf('-') + 1)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(order.createdAt), 'PPP')}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 
                              order.status === 'processing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                              order.status === 'returned' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mt-3">
                            <p className="text-sm font-medium">{t('patientDashboard.items')}:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {order.items?.slice(0, 4).map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{item.name}</span>
                                  <span>x{item.quantity}</span>
                                </div>
                              ))}
                              {(order.items?.length || 0) > 4 && (
                                <div className="text-sm text-muted-foreground">
                                  +{order.items.length - 4} {t('patientDashboard.moreItems')}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-3 border-t">
                            <div>
                              <div className="text-sm font-medium">{t('patientDashboard.totalAmount')}:</div>
                              <div className="font-bold text-lg">₹{order.totalAmount?.toFixed(2) || '0.00'}</div>
                            </div>
                            <div className="flex gap-2">
                              {order.status === 'processing' && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="rounded-full"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Cancel Order
                                </Button>
                              )}
                              {order.status === 'completed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="rounded-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 border-amber-200"
                                  onClick={() => handleReturnOrder(order.id)}
                                >
                                  Return Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">{t('patientDashboard.noOrders')}</h3>
                      <p className="text-muted-foreground mb-4">{t('patientDashboard.noOrdersDesc')}</p>
                      <Button onClick={() => navigate('/pharmacy')}>
                        {t('patientDashboard.shopMedications')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          <div className="space-y-6">
            {/* Specialized Services Tracker */}
            <Card className="overflow-hidden border border-health-light-blue/20 shadow-md">
                <CardHeader className="bg-gradient-to-r from-health-light-blue/10 via-transparent to-red-50/10">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-health-blue animate-pulse" />
                    <CardTitle>{t('patientDashboard.specialServices.title')}</CardTitle>
                  </div>
                  <CardDescription>{t('patientDashboard.specialServices.desc')}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="blood" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="blood" className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-red-500" />
                        {t('patientDashboard.specialServices.bloodTab')}
                      </TabsTrigger>
                      <TabsTrigger value="pregnancy" className="flex items-center gap-2">
                        <Baby className="h-4 w-4 text-pink-500" />
                        {t('patientDashboard.specialServices.pregnancyTab')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="blood" className="space-y-6">
                      {/* Blood Services Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-red-500 text-white shadow-sm">
                            <Heart className="h-5 w-5 fill-current" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">{t('patientDashboard.specialServices.totalDonations')}</p>
                            <h4 className="text-2xl font-bold text-red-600 dark:text-red-400">{bloodDonations.length}</h4>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-orange-500 text-white shadow-sm">
                            <Droplet className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">{t('patientDashboard.specialServices.totalRequests')}</p>
                            <h4 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {bloodRequests.length + bloodBankRequests.length}
                            </h4>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-blue-500 text-white shadow-sm">
                            <Search className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">{t('patientDashboard.specialServices.totalChecks')}</p>
                            <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bloodBankChecks.length}</h4>
                          </div>
                        </div>
                      </div>

                      {/* Blood Logs List */}
                      <div className="space-y-4">
                        {/* Donor Registrations */}
                        {bloodDonations.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                              <Heart className="h-4 w-4 text-red-500" />
                              {t('patientDashboard.specialServices.donations')}
                            </h4>
                            <div className="space-y-2">
                              {bloodDonations.map((donation: any) => (
                                <div key={donation.id} className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-all flex justify-between items-center">
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                      {t('patientDashboard.specialServices.donatedOn')} {format(new Date(donation.createdAt), 'PPP')}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                      <span>Donor: {donation.fullName}</span>
                                      <span>•</span>
                                      <span>Blood Group: {donation.bloodGroup}</span>
                                      <span>•</span>
                                      <span>Contact: {donation.contactNumber}</span>
                                    </div>
                                  </div>
                                  <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 rounded-full text-xs font-bold shadow-sm">
                                    {donation.bloodGroup}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Requests & Bank Requests */}
                        {(bloodRequests.length > 0 || bloodBankRequests.length > 0) && (
                          <div className="space-y-2 pt-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                              <Droplet className="h-4 w-4 text-orange-500" />
                              {t('patientDashboard.specialServices.requests')}
                            </h4>
                            <div className="space-y-2">
                              {/* Direct Requests */}
                              {bloodRequests.map((req: any) => (
                                <div key={req.id} className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-all flex flex-wrap justify-between items-center gap-2">
                                  <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium">
                                      {t('patientDashboard.specialServices.requestedOn')} {format(new Date(req.createdAt), 'PPP')}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                      <span>Hospital: {req.location || 'Not Specified'}</span>
                                      <span>•</span>
                                      <span>Units: {req.units}</span>
                                      {req.requestDescription && (
                                        <>
                                          <span>•</span>
                                          <span className="italic">"{req.requestDescription}"</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {req.isUrgent && (
                                      <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                        {t('patientDashboard.specialServices.urgent')}
                                      </span>
                                    )}
                                    <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold">
                                      {req.bloodType} (x{req.units})
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {/* Bank Requests */}
                              {bloodBankRequests.map((req: any) => (
                                <div key={req.id} className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-all flex flex-wrap justify-between items-center gap-2">
                                  <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium">
                                      Requested from {req.bloodBankName}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                      <span>Purpose: {req.purpose || 'Not Specified'}</span>
                                      <span>•</span>
                                      <span>Units: {req.units}</span>
                                      <span>•</span>
                                      <span>Date: {format(new Date(req.createdAt), 'PPP')}</span>
                                    </div>
                                  </div>
                                  <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold">
                                    {req.bloodGroup} (x{req.units})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Availability Checks */}
                        {bloodBankChecks.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                              <Search className="h-4 w-4 text-blue-500" />
                              {t('patientDashboard.specialServices.bankActivity')}
                            </h4>
                            <div className="space-y-2">
                              {bloodBankChecks.map((check: any) => (
                                <div key={check.id} className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-all flex justify-between items-center text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>Checked availability at <strong className="font-semibold">{check.bloodBankName}</strong></span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(check.createdAt), 'p, PPP')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {bloodDonations.length === 0 && bloodRequests.length === 0 && bloodBankRequests.length === 0 && bloodBankChecks.length === 0 && (
                          <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
                            <Droplet className="mx-auto h-10 w-10 text-muted-foreground/60 mb-2 animate-bounce" />
                            <p className="text-muted-foreground font-medium">{t('patientDashboard.specialServices.noDonations')}</p>
                            <p className="text-xs text-muted-foreground/75 mt-1">Submit blood requests or register as donor to see logs here.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="pregnancy" className="space-y-6">
                      {/* Pregnancy Stats */}
                      <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-pink-500 text-white shadow-sm">
                          <Baby className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">{t('patientDashboard.specialServices.pregnancyBookings')}</p>
                          <h4 className="text-2xl font-bold text-pink-600 dark:text-pink-400">{pregnancyAppointments.length}</h4>
                        </div>
                      </div>

                      {/* Pregnancy Appointments Log */}
                      <div className="space-y-3">
                        {pregnancyAppointments.length > 0 ? (
                          pregnancyAppointments.map((apt: any) => (
                            <div key={apt.id} className="p-4 rounded-xl border bg-card hover:bg-pink-50/5 dark:hover:bg-pink-950/5 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="flex items-start gap-3">
                                {apt.imageUrl ? (
                                  <img src={apt.imageUrl} alt={apt.doctorName} className="w-12 h-12 rounded-full object-cover border-2 border-pink-100" />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">
                                    {apt.doctorName?.split(' ').slice(-1)[0]?.[0] || 'D'}
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-sm">{apt.doctorName}</p>
                                  <p className="text-xs text-muted-foreground mb-1">{apt.specialty}</p>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5 text-pink-400" />
                                      {format(new Date(apt.date), 'PPP')} at {apt.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto justify-between border-t sm:border-0 pt-2 sm:pt-0">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  apt.appointmentType === 'emergency' ? 'bg-red-100 text-red-800' :
                                  apt.appointmentType === 'followup' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {apt.appointmentType}
                                </span>
                                <span className="text-xs font-semibold text-pink-700 bg-pink-50 dark:bg-pink-950/40 px-2.5 py-1 rounded-full border border-pink-200/50">
                                  {t('patientDashboard.specialServices.month')} {apt.pregnancyWeek}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
                            <Baby className="mx-auto h-10 w-10 text-pink-400 mb-2 animate-bounce" />
                            <p className="text-muted-foreground font-medium">{t('patientDashboard.specialServices.noPregnancy')}</p>
                            <p className="text-xs text-muted-foreground/75 mt-1">Book priority pregnancy appointments to see them here.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <HealthRecommendation />
            </div>
          </div>
      </main>
    </Layout>
  );
};

export default PatientDashboard;
