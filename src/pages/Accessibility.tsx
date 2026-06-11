import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Mic, Languages, Accessibility as AccessibilityIcon, MessageSquare, Laptop } from 'lucide-react';

const Accessibility = () => {
  const features = [
    {
      icon: <Mic className="h-6 w-6 text-health-blue" />,
      title: "Intelligent Voice Assistant Navigation",
      content: "Expectant mothers, patients with physical limitations, or senior citizens can operate key actions of the platform (booking appointments, pharmacy shopping, dialing support) entirely via voice inputs."
    },
    {
      icon: <Languages className="h-6 w-6 text-health-blue" />,
      title: "Comprehensive Multi-Language Switching",
      content: "To support diverse linguistic profiles in India, the application offers immediate localization into English, Hindi, Bengali, Tamil, and Marathi. Google Translate auto-translation acts as a supplementary layer."
    },
    {
      icon: <Laptop className="h-6 w-6 text-health-blue" />,
      title: "Keyboard Navigation and Focus States",
      content: "All buttons, input forms, dialog modals, and select dropdowns contain clean focus rings (`focus-visible:ring-2`) and support standard keyboard tab structures for screen-reader readability."
    },
    {
      icon: <AccessibilityIcon className="h-6 w-6 text-health-blue" />,
      title: "Optimized Visual Hierarchy & Contrast",
      content: "Components have been updated with WCAG-compliant color schemes (high-contrast blue, sky accents, and deep navy-slate backgrounds in dark mode) to enhance visibility for visually impaired patients."
    }
  ];

  return (
    <Layout>
      <main className="min-h-screen">
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
              <AccessibilityIcon className="h-10 w-10 text-health-blue animate-pulse-slow" />
              Accessibility Commitment
            </h1>
            <p className="text-lg text-muted-foreground">
              Making healthcare information and digital consultations accessible to everyone.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">Last Updated: June 10, 2026</p>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="border-border/50 shadow-md">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start gap-4 p-4 bg-health-blue/5 rounded-xl border border-health-blue/10">
                  <CheckCircle className="h-6 w-6 text-health-blue flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    At HealthMate, we are dedicated to fostering digital inclusion. We continuously audit our styles, components, and interactive voice tools to meet Web Content Accessibility Guidelines (WCAG) 2.1 level AA standards.
                  </p>
                </div>

                <div className="space-y-8 pt-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-border/50 text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <MessageSquare className="h-4 w-4 text-health-blue" />
                    Encountered an accessibility barrier? Send feedback to{' '}
                    <a href="mailto:accessibility@healthmate.com" className="text-health-blue font-semibold hover:underline">
                      accessibility@healthmate.com
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

export default Accessibility;
