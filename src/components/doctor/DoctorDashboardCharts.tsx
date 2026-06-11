
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

// Data fetching hook for doctor charts
const useDoctorChartData = (doctorId: string | undefined) => {
  const [data, setData] = useState<Array<{ name: string; appointments: number; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call with random data
        // In a real app, this would fetch from an API endpoint
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const generatedData = days.map(day => ({
          name: day,
          appointments: Math.floor(Math.random() * 10) + 1,
          revenue: (Math.floor(Math.random() * 10) + 1) * 60, // $60 per appointment
        }));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setData(generatedData);
      } catch (error) {
        console.error("Error fetching doctor chart data:", error);
        // Fallback data in case of error
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchData();
    }
  }, [doctorId]);

  return { data, loading };
};

const DoctorDashboardCharts = () => {
  const { userInfo } = useAuth();
  const { data, loading } = useDoctorChartData(userInfo?.id);

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="appointments"
              stroke="#3b82f6"
              activeDot={{ r: 8 }}
              name="Appointments"
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981"
              name="Revenue ($)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DoctorDashboardCharts;
