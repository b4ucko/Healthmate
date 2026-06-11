import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Mail, Phone, MessageSquare, Shield, HelpCircle, FileText, User } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "How do I book an appointment with a doctor?",
      answer: "You can book an appointment by navigating to the 'Doctors' page, choosing a specialist, filtering by specialty and location, and clicking 'Book Appointment'. Alternatively, you can use our built-in Voice Assistant to book an appointment hands-free by saying 'book appointment'.",
      category: "appointments"
    },
    {
      question: "What should I do in case of a medical emergency?",
      answer: "Navigate to the 'Emergency' section immediately. You can click 'Find Nearby Emergency Care' to locate the closest hospitals with real-time ETA and routing map guides. You can also click 'Call 911 Emergency Services' or book an instant emergency appointment without signing in.",
      category: "emergency"
    },
    {
      question: "How does the prescription scanning feature work?",
      answer: "In the 'Pharmacy' portal, click on the upload prescription option. Upload a photo or PDF of your doctor's prescription. Our intelligent system scans the text to extract medicine names and automatically recommends the matching products for your cart.",
      category: "pharmacy"
    },
    {
      question: "How do I register as a blood donor?",
      answer: "Go to 'Specialized Services' -> 'Blood Donation'. Scroll to the 'Become a Blood Donor' section and fill in your details including age, weight, contact details, and blood group. Please note that donors must be at least 18 years old and weigh over 50kg.",
      category: "blood"
    },
    {
      question: "What is Priority Pregnancy Care?",
      answer: "Priority Pregnancy Care is a specialized service for expectant mothers that grants direct access to Ob/Gyn and pediatric specialists, skips regular waiting lists, and provides same-day priority appointment booking.",
      category: "pregnancy"
    },
    {
      question: "How do I update my profile details?",
      answer: "Sign in to your account, click on your profile icon in the top-right corner of the Navbar, and select 'Profile'. Here, you can view and update your name, email, contact information, and check logs of your past activities.",
      category: "account"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <main className="min-h-screen">
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">How can we help you?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Search our help articles, browse frequently asked questions, or contact our support team.
            </p>
            <div className="relative max-w-xl mx-auto mb-12">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search FAQs, articles, and topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-full border-2 border-border/80 focus:border-health-blue shadow-sm"
              />
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FAQ Section */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-health-blue" />
                  Frequently Asked Questions
                </h2>
                
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`faq-${index}`}
                        className="bg-card border border-border/50 rounded-xl px-4 overflow-hidden shadow-sm"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-xl">
                    <p className="text-muted-foreground">No questions found matching your search.</p>
                  </div>
                )}
              </div>

              {/* Contact & Support Panel */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-health-blue" />
                  Contact Support
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center text-health-blue">
                        <Mail className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Email Support</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-4">Send us your queries and get a response within 24 hours.</p>
                      <a href="mailto:support@healthmate.com" className="text-health-blue font-semibold hover:underline">
                        support@healthmate.com
                      </a>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center text-health-blue">
                        <Phone className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Call Toll-Free</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-4">Speak directly with our customer care representatives (24/7).</p>
                      <a href="tel:18001234567" className="text-health-blue font-semibold hover:underline">
                        1-800-123-4567
                      </a>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center text-health-blue">
                        <Shield className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Security & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-4">Learn more about how we safeguard your data and clinical records.</p>
                      <Button variant="outline" size="sm" className="w-full rounded-full">
                        Trust Center
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Help;
