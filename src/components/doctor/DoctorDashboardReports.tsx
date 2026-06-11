
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

// Custom hook for doctor reports data
const useDoctorReportsData = (doctorId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [appointmentTypeData, setAppointmentTypeData] = useState<any[]>([]);
  const [demographicsData, setDemographicsData] = useState({
    ageGroups: [
      { name: '0-18', percentage: 0 },
      { name: '19-35', percentage: 0 },
      { name: '36-50', percentage: 0 },
      { name: '51+', percentage: 0 }
    ],
    gender: { male: 0, female: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call with dynamic data
        // In a real application, these would be API calls

        // Generate appointments by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const generatedAppointments = months.map(month => ({
          month,
          appointments: Math.floor(Math.random() * 30) + 10
        }));

        // Generate review data
        const generatedReviews = [
          { name: '5 Stars', value: Math.floor(Math.random() * 50) + 30, color: '#22c55e' },
          { name: '4 Stars', value: Math.floor(Math.random() * 30) + 15, color: '#84cc16' },
          { name: '3 Stars', value: Math.floor(Math.random() * 20) + 5, color: '#facc15' },
          { name: '2 Stars', value: Math.floor(Math.random() * 15), color: '#f97316' },
          { name: '1 Star', value: Math.floor(Math.random() * 10), color: '#ef4444' },
        ];

        // Generate appointment types
        const generatedAppointmentTypes = [
          { name: 'In-person', value: Math.floor(Math.random() * 40) + 40, color: '#3b82f6' },
          { name: 'Video', value: Math.floor(Math.random() * 20) + 15, color: '#8b5cf6' },
          { name: 'Phone', value: Math.floor(Math.random() * 15) + 5, color: '#ec4899' },
        ];

        // Generate demographics data
        const generatedDemographics = {
          ageGroups: [
            { name: '0-18', percentage: Math.floor(Math.random() * 20) + 5 },
            { name: '19-35', percentage: Math.floor(Math.random() * 25) + 25 },
            { name: '36-50', percentage: Math.floor(Math.random() * 20) + 20 },
            { name: '51+', percentage: Math.floor(Math.random() * 20) + 10 }
          ],
          gender: { 
            male: Math.floor(Math.random() * 20) + 40, 
            female: 0 // Will be calculated after
          }
        };
        generatedDemographics.gender.female = 100 - generatedDemographics.gender.male;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setAppointmentData(generatedAppointments);
        setReviewData(generatedReviews);
        setAppointmentTypeData(generatedAppointmentTypes);
        setDemographicsData(generatedDemographics);
      } catch (error) {
        console.error("Error fetching doctor reports data:", error);
        // Fallback to empty data in case of error
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchData();
    }
  }, [doctorId]);

  return { loading, appointmentData, reviewData, appointmentTypeData, demographicsData };
};

const DoctorDashboardReports = () => {
  const { userInfo } = useAuth();
  const { loading, appointmentData, reviewData, appointmentTypeData, demographicsData } = useDoctorReportsData(userInfo?.id);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full bg-gray-200 rounded w-full animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointments by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} appointments`, 'Total']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Reviews</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} reviews`, '']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Types</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {appointmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Demographics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Age Groups</h4>
                {demographicsData.ageGroups.map((ageGroup, index) => (
                  <div className="space-y-2 mt-2" key={index}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{ageGroup.name}</span>
                      <span className="text-sm font-medium">{ageGroup.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${ageGroup.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Gender Distribution</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Male</span>
                      <span className="text-sm font-medium">{demographicsData.gender.male}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${demographicsData.gender.male}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Female</span>
                      <span className="text-sm font-medium">{demographicsData.gender.female}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-pink-600 h-2.5 rounded-full" 
                        style={{ width: `${demographicsData.gender.female}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboardReports;
