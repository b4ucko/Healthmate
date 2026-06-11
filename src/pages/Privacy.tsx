import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Info, FileText } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: <Info className="h-6 w-6 text-health-blue" />,
      title: "1. Information We Collect",
      content: "We collect information you provide directly, such as name, email, contact number, age, weight (for blood donation eligibility), and profile information. In addition, we process medical history and upload materials like doctor prescriptions for pharmacy services."
    },
    {
      icon: <Database className="h-6 w-6 text-health-blue" />,
      title: "2. How We Use Your Information",
      content: "Your data is used to match you with specialists, facilitate appointments, verify blood donor eligibility, route emergency care details, process pharmacy order checkouts, and deliver AI health insights tailored to your profile."
    },
    {
      icon: <Lock className="h-6 w-6 text-health-blue" />,
      title: "3. Data Security and Encryption",
      content: "All clinical documents, prescription uploads, and profile details are encrypted in transit and at rest. Access controls ensure only authorized personnel and designated healthcare specialists can view your diagnostic information."
    },
    {
      icon: <Eye className="h-6 w-6 text-health-blue" />,
      title: "4. Sharing of Information",
      content: "We only share medical details with chosen doctors, emergency services coordinators, or delivery personnel when required for order fulfillment. We do not sell or monetize patient diagnostic records to third-party advertisers."
    },
    {
      icon: <Shield className="h-6 w-6 text-health-blue" />,
      title: "5. Your Rights and Choices",
      content: "You retain the right to inspect your stored diagnostic files, update details via the Profile menu, configure localization preferences, or delete your user account and health logs at any time."
    }
  ];

  return (
    <Layout>
      <main className="min-h-screen">
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
              <Shield className="h-10 w-10 text-health-blue animate-pulse-slow" />
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn how we collect, store, and protect your personal and diagnostic information.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">Last Updated: June 10, 2026</p>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="border-border/50 shadow-md">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start gap-4 p-4 bg-health-blue/5 rounded-xl border border-health-blue/10">
                  <FileText className="h-6 w-6 text-health-blue flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    At HealthMate, your privacy is our primary concern. This policy details our commitment to securing clinical records, personal identifiers, and user queries across our desktop and mobile applications.
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
                    Have questions about our privacy practices? Contact our compliance officer at{' '}
                    <a href="mailto:privacy@healthmate.com" className="text-health-blue font-semibold hover:underline">
                      privacy@healthmate.com
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

export default Privacy;
