
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';
import { Card } from '@/components/ui/card';
import { Brain, HeartPulse, Activity, User, Moon, Droplet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HealthCondition {
  id: string;
  name: string;
  description: string;
  recommendation: string;
  icon: React.ReactNode;
}

const healthConditions: HealthCondition[] = [
  {
    id: 'hypertension',
    name: 'Hypertension Management',
    description: 'Our AI detected you might benefit from blood pressure monitoring.',
    recommendation: 'Regular blood pressure checks and consultation with a cardiologist are recommended.',
    icon: <HeartPulse className="h-10 w-10 text-red-500" />
  },
  {
    id: 'stress',
    name: 'Stress Management',
    description: 'Based on your recent activity patterns, stress management techniques may be beneficial.',
    recommendation: 'Consider yoga, meditation, or speaking with our mental wellness specialists.',
    icon: <Brain className="h-10 w-10 text-purple-500" />
  },
  {
    id: 'fitness',
    name: 'Fitness Improvement',
    description: 'Your activity levels suggest you could benefit from a personalized fitness plan.',
    recommendation: 'Schedule a consultation with our fitness experts for a tailored exercise regimen.',
    icon: <Activity className="h-10 w-10 text-green-500" />
  },
  {
    id: 'sleep',
    name: 'Sleep Quality Insights',
    description: 'Your logs indicate irregular resting patterns, which may impact recovery and immunity.',
    recommendation: 'Try establishing a consistent bedtime routine and avoiding screen time 1 hour before sleeping.',
    icon: <Moon className="h-10 w-10 text-indigo-500" />
  },
  {
    id: 'hydration',
    name: 'Hydration Optimization',
    description: 'Based on seasonal conditions and daily activity logs, your hydration levels are below average.',
    recommendation: 'Aim for 2.5 to 3 liters of water daily, and record it in our health journal.',
    icon: <Droplet className="h-10 w-10 text-blue-500" />
  }
];

const HealthRecommendation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<HealthCondition[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Simulating AI analysis and recommendation generation
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      
      try {
        // Simulating API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Shuffle and select exactly 4 recommendations to display side-by-side
        const shuffled = [...healthConditions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        setRecommendations(selected);
      } catch (error) {
        console.error("Error fetching health recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);
  
  const handleConsultation = (condition: string) => {
    if (isAuthenticated) {
      navigate('/doctors');
    } else {
      navigate('/sign-in');
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-pulse flex space-x-4 items-center">
          <Brain className="h-12 w-12 text-health-blue/50" />
          <div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-3 w-36 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
        <p className="text-muted-foreground">Analyzing health data for personalized recommendations...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Brain className="h-6 w-6 text-health-blue" />
        <h3 className="text-xl font-semibold">AI Health Insights</h3>
      </div>
      
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map(rec => (
            <GlassCard key={rec.id} className="overflow-hidden">
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  {rec.icon}
                  <div>
                    <h4 className="font-medium">{rec.name}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md mb-4 flex-grow">
                  <p className="text-sm">{rec.recommendation}</p>
                </div>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => handleConsultation(rec.id)}
                >
                  Consult a Specialist
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <User className="h-16 w-16 text-muted-foreground/30" />
            <div>
              <h4 className="text-lg font-medium mb-1">No Recommendations Yet</h4>
              <p className="text-muted-foreground">
                Complete your health profile or connect health devices to get personalized AI recommendations.
              </p>
            </div>
            <Button onClick={() => navigate('/user-profile')} className="mt-2">
              Complete Health Profile
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HealthRecommendation;
