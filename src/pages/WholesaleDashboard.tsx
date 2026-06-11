
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Truck, Package, ShoppingCart, Calendar, FileText, BarChart2, Box, DollarSign, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { medicines } from '@/components/pharmacy/PharmacyData';
import { getAllOrders, getWholesaleOrders, updateOrderStatus } from '@/lib/database/mongodb/services';
import { format } from 'date-fns';

const WholesaleDashboard = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getWholesaleOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.userType === 'wholesaler') {
      fetchOrders();
    }
  }, [userInfo]);

  if (!userInfo || userInfo.userType !== 'wholesaler') {
    // Redirect non-wholesale users
    setTimeout(() => {
      toast.error("Access denied. Wholesaler account required.");
      navigate('/sign-in');
    }, 100);
    return null;
  }

  // Filter products available to wholesalers
  const wholesaleProducts = medicines.filter(med => med.wholesalePrice || med.wholesaleOnly);

  // Process order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update the local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Order ${orderId} has been ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Calculate dashboard metrics
  const pendingOrders = orders.filter(order => order.status === 'processing');
  const totalOrders = orders.length;
  const revenue = orders.reduce((total, order) => total + (order.totalAmount || 0), 0);

  return (
    <Layout>
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {userInfo.name}</h1>
              <p className="text-muted-foreground">Manage your wholesale orders and inventory</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate('/pharmacy')}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Shop Products
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="catalog">Catalog</TabsTrigger>
              <TabsTrigger value="reports" className="hidden md:block">Reports</TabsTrigger>
              <TabsTrigger value="account" className="hidden md:block">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Orders</CardTitle>
                    <CardDescription>All time wholesale orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-health-blue mr-4" />
                      <span className="text-3xl font-bold">{totalOrders}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenue</CardTitle>
                    <CardDescription>All time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-500 mr-4" />
                      <span className="text-3xl font-bold">₹{revenue.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pending Shipments</CardTitle>
                    <CardDescription>Orders being processed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Truck className="h-8 w-8 text-amber-500 mr-4" />
                      <span className="text-3xl font-bold">{pendingOrders.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest wholesale orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-health-blue border-t-transparent rounded-full"></div>
                      </div>
                    ) : orders.length > 0 ? (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-muted-foreground">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(order => (
                            <tr key={order.id}>
                              <td className="py-2">{order.id}</td>
                              <td className="py-2">{format(new Date(order.createdAt), 'yyyy-MM-dd')}</td>
                              <td className="py-2">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8">
                        <Box className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                          When you receive orders, they will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("orders")}>
                      View All Orders
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Wholesale Exclusive Products</CardTitle>
                    <CardDescription>Products available for bulk ordering</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {wholesaleProducts.slice(0, 3).map(product => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden mr-3">
                              <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">₹{product.wholesalePrice} per unit</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Order</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/pharmacy')}>
                      Browse All Products
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and manage all your wholesale orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-health-blue border-t-transparent rounded-full"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-muted-foreground border-b">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Items</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id} className="border-b">
                              <td className="py-3">{order.id}</td>
                              <td className="py-3">{order.userName || 'N/A'}</td>
                              <td className="py-3">{format(new Date(order.createdAt), 'yyyy-MM-dd')}</td>
                              <td className="py-3">{order.items?.length || 0} items</td>
                              <td className="py-3">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex space-x-2">
                                  {order.status === 'processing' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8" 
                                      onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                    >
                                      <Truck className="h-3.5 w-3.5 mr-1" />
                                      Ship
                                    </Button>
                                  )}
                                  
                                  {order.status === 'shipped' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8" 
                                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                    >
                                      <Check className="h-3.5 w-3.5 mr-1" />
                                      Complete
                                    </Button>
                                  )}
                                  
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8"
                                    onClick={() => toast.info(`Order details for ${order.id}`)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Box className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your order history will appear here</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start placing wholesale orders to build your order history and track deliveries
                      </p>
                      <Button onClick={() => navigate('/pharmacy')}>
                        Shop Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="catalog">
              <Card>
                <CardHeader>
                  <CardTitle>Wholesale Catalog</CardTitle>
                  <CardDescription>Browse all products available for wholesale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wholesaleProducts.slice(0, 6).map(product => (
                      <div key={product.id} className="border rounded-lg p-4 flex flex-col">
                        <div className="h-40 mb-4 rounded overflow-hidden">
                          <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <p className="font-bold text-health-blue">₹{product.wholesalePrice}</p>
                            <p className="text-xs text-muted-foreground">Min Order: 10 units</p>
                          </div>
                          <Button size="sm">Order</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/pharmacy')}>
                    View Full Catalog
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>Track your purchase history and spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Purchase data will appear here</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      After making purchases, you'll be able to view reports on your spending patterns
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your wholesale account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Business Name</p>
                          <p className="font-medium">{userInfo.name}'s Pharmacy</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{userInfo.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Payment & Billing</h3>
                      <Button variant="outline">Update Payment Methods</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default WholesaleDashboard;
