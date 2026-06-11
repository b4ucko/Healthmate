
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const leadershipTeam = [
  {
    name: "Dr. Aisha Patel",
    role: "Founder & CEO",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Dr. Aisha Patel founded HealthMate with a mission to bridge healthcare gaps using technology. With over 15 years of experience as a physician and healthcare administrator, she brings deep industry insight and a passion for improving patient outcomes."
  },
  {
    name: "Raj Singh",
    role: "Chief Technology Officer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Raj leads HealthMate's engineering efforts, bringing 12+ years of experience building scalable healthcare platforms. He previously led technology teams at major health tech companies and holds multiple patents in healthcare data systems."
  },
  {
    name: "Sarah Johnson",
    role: "Chief Medical Officer",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Dr. Johnson oversees all medical aspects of the HealthMate platform, ensuring clinical accuracy and efficacy. With a background in internal medicine and digital health, she works to maintain the highest standards of care across all services."
  },
  {
    name: "Michael Chen",
    role: "Chief Operating Officer",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    bio: "Michael manages day-to-day operations at HealthMate, optimizing service delivery and business processes. His background in healthcare operations and business development helps scale our impact while maintaining quality."
  }
];

const milestones = [
  {
    year: "2018",
    title: "HealthMate Founded",
    description: "Founded with a vision to democratize healthcare access through technology."
  },
  {
    year: "2019",
    title: "Initial Launch",
    description: "Launched our first telemedicine platform serving 3 metropolitan areas."
  },
  {
    year: "2020",
    title: "COVID-19 Response",
    description: "Rapidly scaled remote consultation services, helping over 50,000 patients during the pandemic."
  },
  {
    year: "2021",
    title: "Series A Funding",
    description: "Secured $15M in Series A funding to expand services and reach."
  },
  {
    year: "2022",
    title: "National Expansion",
    description: "Extended services to 15 states and integrated with 250+ healthcare providers."
  },
  {
    year: "2023",
    title: "International Launch",
    description: "Began operations in Southeast Asia, bringing our platform to millions more patients."
  }
];

const partners = [
  {
    name: "National Healthcare Network",
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 80' width='150' height='80'><rect width='150' height='80' rx='8' fill='%230f172a'/><path d='M35 40 H49 M42 33 V47' stroke='%2338bdf8' stroke-width='4' stroke-linecap='round'/><text x='65' y='46' fill='%23f8fafc' font-family='system-ui, sans-serif' font-weight='bold' font-size='18'>NHN</text></svg>"
  },
  {
    name: "MediTech Solutions",
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 80' width='150' height='80'><rect width='150' height='80' rx='8' fill='%230f172a'/><path d='M28 40 Q34 25 38 40 T48 40' fill='none' stroke='%2334d399' stroke-width='3' stroke-linecap='round'/><text x='60' y='46' fill='%23f8fafc' font-family='system-ui, sans-serif' font-weight='bold' font-size='15'>MediTech</text></svg>"
  },
  {
    name: "Health Innovations Labs",
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 80' width='150' height='80'><rect width='150' height='80' rx='8' fill='%230f172a'/><circle cx='36' cy='40' r='10' fill='none' stroke='%23a855f7' stroke-width='3'/><path d='M31 35 L41 45' stroke='%23a855f7' stroke-width='2'/><text x='60' y='46' fill='%23f8fafc' font-family='system-ui, sans-serif' font-weight='bold' font-size='18'>HIL</text></svg>"
  },
  {
    name: "Global Health Initiative",
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 80' width='150' height='80'><rect width='150' height='80' rx='8' fill='%230f172a'/><circle cx='36' cy='40' r='12' fill='none' stroke='%2306b6d4' stroke-width='2'/><path d='M24 40 H48 M36 28 V52' stroke='%2306b6d4' stroke-width='1.5'/><text x='60' y='46' fill='%23f8fafc' font-family='system-ui, sans-serif' font-weight='bold' font-size='18'>GHI</text></svg>"
  }
];

const About = () => {
  return (
    <Layout>
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Mission</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Making quality healthcare accessible to everyone, anywhere, anytime.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg mb-4">
                  At HealthMate, we're driven by a simple belief: healthcare should be accessible to everyone. We're using technology to remove barriers and connect patients with the care they need.
                </p>
                <p className="text-lg mb-6">
                  Founded by healthcare professionals, our platform bridges gaps in healthcare delivery through innovative digital solutions. We're not just building an app—we're building a healthier future.
                </p>
                <div className="space-x-4">
                  <Button>Our Services</Button>
                  <Button variant="outline">Join Our Team</Button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop" 
                  alt="Healthcare professionals" 
                  className="w-full h-auto object-cover max-h-[350px]"
                />
              </div>
            </div>
          </div>
          
          {/* Our Story Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            
            <Card className="bg-muted">
              <CardContent className="py-8">
                <div className="space-y-8">
                  <div className="text-center max-w-3xl mx-auto">
                    <h3 className="text-2xl font-medium mb-4">A Personal Journey to Healthcare Innovation</h3>
                    <p className="text-lg">
                      HealthMate was born from a personal experience of our founder, Dr. Aisha Patel, who witnessed firsthand the challenges of healthcare access in rural communities. After seeing her own grandmother struggle to get timely medical care due to distance and mobility issues, she set out to create a solution that would bring quality healthcare to everyone.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                    <div>
                      <p className="mb-4">
                        Starting with a small team of doctors and engineers in 2018, we built our first telemedicine platform to connect patients with doctors remotely. What began as a simple solution grew rapidly, especially during the pandemic when remote healthcare became essential.
                      </p>
                      <p>
                        Today, HealthMate serves millions of patients across the country and beyond, offering not just virtual consultations but a comprehensive ecosystem of healthcare services—from appointment booking to medicine delivery and health monitoring. Our journey continues as we explore new ways to make healthcare more accessible, affordable, and effective.
                      </p>
                    </div>
                    <div className="space-y-4">
                      {milestones.slice(0, 4).map((milestone, index) => (
                        <div key={index} className="flex">
                          <div className="mr-4 bg-health-blue text-white px-3 py-1 rounded font-medium w-16 text-center">
                            {milestone.year}
                          </div>
                          <div>
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="link" className="px-0">View full timeline</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Leadership Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Leadership</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {leadershipTeam.map((leader, index) => (
                <Card key={index} className="overflow-hidden h-full flex flex-col">
                  <div className="aspect-w-3 aspect-h-2">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="flex-grow flex flex-col justify-between py-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg">{leader.name}</h3>
                      <p className="text-muted-foreground">{leader.role}</p>
                    </div>
                    <p className="text-sm line-clamp-6">{leader.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Our Values & Impact Section */}
          <section className="mb-20">
            <Tabs defaultValue="values" className="w-full">
              <div className="text-center mb-8">
                <TabsList>
                  <TabsTrigger value="values">Our Values</TabsTrigger>
                  <TabsTrigger value="impact">Our Impact</TabsTrigger>
                  <TabsTrigger value="partners">Our Partners</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="values">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-blue-50 dark:bg-blue-950/20 text-slate-800 dark:text-slate-200">
                    <CardContent className="pt-8">
                      <h3 className="text-xl font-bold mb-4 text-health-blue dark:text-blue-400">Patient-Centered</h3>
                      <p>
                        We design every aspect of our service around patient needs and experiences. Every decision starts with the question: "How does this improve care for our patients?"
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200">
                    <CardContent className="pt-8">
                      <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">Accessibility</h3>
                      <p>
                        We believe quality healthcare should be available to everyone. We work tirelessly to remove financial, geographic, and technological barriers to care.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 dark:bg-purple-950/20 text-slate-800 dark:text-slate-200">
                    <CardContent className="pt-8">
                      <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-400">Innovation</h3>
                      <p>
                        We embrace new technologies and approaches to solve healthcare's most pressing challenges. We're not afraid to rethink established systems.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="impact">
                <Card>
                  <CardContent className="pt-8 px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 text-center">
                      <div>
                        <h3 className="text-4xl font-bold text-health-blue">2.5M+</h3>
                        <p className="text-muted-foreground">Patients Served</p>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-health-blue">500+</h3>
                        <p className="text-muted-foreground">Healthcare Providers</p>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-health-blue">30%</h3>
                        <p className="text-muted-foreground">Cost Reduction for Patients</p>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-health-blue">200+</h3>
                        <p className="text-muted-foreground">Rural Communities Reached</p>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-health-blue">15</h3>
                        <p className="text-muted-foreground">States Covered</p>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-health-blue">98%</h3>
                        <p className="text-muted-foreground">Patient Satisfaction</p>
                      </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                      <Button>Read Impact Stories</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="partners">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium mb-2">Strategic Partners</h3>
                  <p className="text-muted-foreground">
                    We collaborate with leading healthcare organizations to extend our reach and impact.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  {partners.map((partner, index) => (
                    <Card key={index} className="flex items-center justify-center p-6 h-24">
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-h-full max-w-full"
                      />
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button variant="outline">Become a Partner</Button>
                </div>
              </TabsContent>
            </Tabs>
          </section>
          
          {/* Contact Section */}
          <section>
            <Card className="bg-health-light-blue dark:bg-slate-900 border border-border text-slate-800 dark:text-slate-200">
              <CardContent className="pt-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                    <p className="mb-6">
                      Have questions about HealthMate? Want to explore partnership opportunities? We'd love to hear from you.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">General Inquiries</h4>
                        <p className="text-muted-foreground">info@healthmate.example.com</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Press</h4>
                        <p className="text-muted-foreground">press@healthmate.example.com</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Careers</h4>
                        <p className="text-muted-foreground">careers@healthmate.example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Office Locations</h2>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Headquarters</h4>
                        <p className="text-muted-foreground">
                          123 Healthcare Avenue<br />
                          Bangalore, Karnataka 560001<br />
                          India
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Regional Office</h4>
                        <p className="text-muted-foreground">
                          456 Innovation Street<br />
                          Mumbai, Maharashtra 400001<br />
                          India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
