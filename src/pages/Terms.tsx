import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, ShieldCheck, AlertTriangle, RefreshCw, UserCheck, HelpCircle } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      icon: <UserCheck className="h-6 w-6 text-health-blue" />,
      title: "1. Account Terms and Verification",
      content: "Users must register with verified contact details. Patients are responsible for ensuring all health queries, profiles, and prescriptions submitted are accurate. Unauthorized or impersonated doctor/wholesaler registrations are strictly prohibited."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-health-blue" />,
      title: "2. Medical Disclaimer (Critical)",
      content: "HealthMate's AI health recommendations, chat portals, and blog articles are for informational purposes only. They DO NOT constitute professional medical advice, diagnoses, or treatment plans. Always consult with a licensed physician for clinical concerns."
    },
    {
      icon: <Scale className="h-6 w-6 text-health-blue" />,
      title: "3. Emergency Services Limitations",
      content: "Our Emergency Finder provides hospital locations, ETA routing, and phone numbers. However, HealthMate is not a logistics provider and does not directly operate ambulance dispatch systems. We are not liable for hospital admittance or vehicle dispatch delays."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-health-blue" />,
      title: "4. Appointments and Prescriptions",
      content: "Doctor bookings are subject to specialist availability. Prescription validation for pharmacy orders is conducted before delivery. Orders containing restricted drugs require a signed medical prescription from a registered doctor."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-health-blue" />,
      title: "5. Intellectual Property & Brand Usage",
      content: "All source code, design elements, vector graphics, and the official HealthMate logo waves are copyrighted. Unauthorized redistribution, cloning, or commercial use of our digital assets is strictly forbidden."
    }
  ];

  return (
    <Layout>
      <main className="min-h-screen">
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
              <Scale className="h-10 w-10 text-health-blue animate-pulse-slow" />
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Please review the terms, limitations, and user agreements for using the HealthMate platform.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">Last Updated: June 10, 2026</p>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="border-border/50 shadow-md">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start gap-4 p-4 bg-health-blue/5 rounded-xl border border-health-blue/10">
                  <HelpCircle className="h-6 w-6 text-health-blue flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By accessing or using HealthMate, you agree to comply with our Terms of Service. If you do not agree with any clause (including our medical disclaimer), please refrain from accessing the platform.
                  </p>
                </div>

                <div className="space-y-8 pt-4">
                  {sections.map((section, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center flex-shrink-0">
                        {section.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-border/50 text-center">
                  <p className="text-xs text-muted-foreground">
                    Have questions regarding our Terms of Service? Send inquiries to{' '}
                    <a href="mailto:legal@healthmate.com" className="text-health-blue font-semibold hover:underline">
                      legal@healthmate.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Terms;
