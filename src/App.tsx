
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./providers/ThemeProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useInitializeDoctors } from "./utils/initializeUsers";
import Index from "./pages/Index";
import Doctors from "./pages/Doctors";
import Emergency from "./pages/Emergency";
import EmergencyAppointment from "./pages/EmergencyAppointment";
import Pharmacy from "./pages/Pharmacy";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import BloodBank from "./pages/BloodBank";
import BloodDonation from "./pages/BloodDonation";
import PregnancyCare from "./pages/PregnancyCare";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Blogs from "./pages/Blogs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import Accessibility from "./pages/Accessibility";
import UserProfile from "./pages/UserProfile";
import VoiceAssistantChat from "./components/voice/VoiceAssistantChat";
import DoctorPatientChat from "./components/chat/DoctorPatientChat";
import WholesaleDashboard from "./pages/WholesaleDashboard";
import Appointments from "./pages/Appointments";
import { useAuth } from "./contexts/AuthContext";
import ScrollToTop from "./components/layout/ScrollToTop";

// Create the query client outside of the component
const queryClient = new QueryClient();

// Chat wrapper component to conditionally show chat based on user type
const ChatWrapper = () => {
  const { isAuthenticated, userInfo } = useAuth();

  if (!isAuthenticated) return null;

  // Show different chat based on user type
  if (userInfo?.userType === 'doctor') {
    return <DoctorPatientChat initialOpen={false} patientName="Current Patient" />;
  }

  if (userInfo?.userType === 'patient') {
    return <DoctorPatientChat initialOpen={false} doctorName="Your Doctor" />;
  }

  return null;
};

const AppContent = () => {
  // Initialize doctor accounts
  useInitializeDoctors();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency-appointment" element={<EmergencyAppointment />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/blood-bank" element={<BloodBank />} />
        <Route path="/blood-donation" element={<BloodDonation />} />
        <Route path="/pregnancy-care" element={<PregnancyCare />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/wholesale-dashboard" element={<WholesaleDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <VoiceAssistantChat initialOpen={false} />
      <ChatWrapper />
    </>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="healthmate-theme">
    <LanguageProvider>
      <TooltipProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <Sonner />
            <AppContent />
          </QueryClientProvider>
        </AuthProvider>
      </TooltipProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
