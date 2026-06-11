
import React from 'react';
import { format } from 'date-fns';
import { CalendarClock, User, ClipboardList, Image } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Press release data
const pressReleases = [
  {
    id: 1,
    title: 'HealthMate Secures $10M Series A Funding to Expand Digital Healthcare Services',
    content: 'HealthMate, the leading healthcare platform in the country, announced today that it has secured $10 million in Series A funding led by Innovation Ventures with participation from Healthcare Growth Partners and several strategic investors.',
    date: '2025-02-15',
    category: 'Company News',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  },
  {
    id: 2,
    title: 'HealthMate Partners with National Medical Association to Improve Rural Healthcare Access',
    content: 'In a significant move to address healthcare disparities, HealthMate has formed a strategic partnership with the National Medical Association to bring telemedicine services to underserved rural communities.',
    date: '2025-01-30',
    category: 'Partnerships',
    image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
  },
  {
    id: 3,
    title: "HealthMate's Mobile App Surpasses 1 Million Downloads",
    content: 'HealthMate announced today that its mobile application has reached a significant milestone of 1 million downloads, reflecting growing patient preferences for digital healthcare solutions and remote consultations.',
    date: '2024-12-10',
    category: 'Product Updates',
    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  },
  {
    id: 4,
    title: 'HealthMate Launches Innovative AI-Powered Diagnostic Tool',
    content: 'HealthMate has announced the launch of its AI-powered diagnostic assistant that helps healthcare professionals make more accurate diagnoses and treatment recommendations, using advanced machine learning algorithms.',
    date: '2024-11-18',
    category: 'Product Launches',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 5,
    title: 'HealthMate CEO Named Among Top 50 Healthcare Leaders',
    content: 'The CEO of HealthMate has been recognized as one of the Top 50 Healthcare Leaders by Healthcare Innovation Magazine for pioneering efforts in making healthcare more accessible through technological innovation.',
    date: '2024-10-25',
    category: 'Awards',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
  },
];

// Media resources
const mediaResources = [
  {
    id: 1,
    title: 'Company Logo Package',
    type: 'image',
    description: 'Official HealthMate logo in various formats (PNG, SVG, JPG) for media usage.',
  },
  {
    id: 2,
    title: 'Executive Headshots',
    type: 'image',
    description: "Professional headshots of HealthMate's executive team for media purposes.",
  },
  {
    id: 3,
    title: 'Product Screenshots',
    type: 'image',
    description: "High-resolution screenshots of HealthMate's mobile and web applications.",
  },
  {
    id: 4,
    title: 'Brand Guidelines',
    type: 'document',
    description: 'Official brand guidelines including color codes, typography, and usage rules.',
  },
  {
    id: 5,
    title: 'Company Fact Sheet',
    type: 'document',
    description: 'Company overview, mission, vision, key statistics, and leadership information.',
  },
  {
    id: 6,
    title: 'Promotional Videos',
    type: 'video',
    description: "Collection of promotional videos showcasing HealthMate's services and patient testimonials.",
  },
];

const Press = () => {
  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Press & Media Resources</h1>
              <p className="text-muted-foreground max-w-2xl">
                Get the latest news, press releases, and media resources from HealthMate
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Press Releases</h2>
                <div className="space-y-8">
                  {pressReleases.map((release) => (
                    <Card key={release.id} className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-48 md:h-full">
                          <img 
                            src={release.image} 
                            alt={release.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 md:col-span-2">
                          <Badge className="mb-2">{release.category}</Badge>
                          <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                          <p className="text-muted-foreground mb-4">{release.content}</p>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <CalendarClock className="h-4 w-4 mr-1" />
                            {format(new Date(release.date), 'MMMM d, yyyy')}
                          </div>
                          <Button>Read Full Release</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-muted rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Media Contact</h2>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Press Inquiries</h4>
                      <p className="text-muted-foreground">press@healthmate.com</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Media Relations</h4>
                      <p className="text-muted-foreground">+91 123 456 7890</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Spokesperson</h4>
                      <p className="text-muted-foreground">Aarav Patel, Director of Communications</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-4">Media Resources</h2>
                <div className="space-y-4">
                  {mediaResources.map((resource) => (
                    <Card key={resource.id} className="p-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-health-blue mr-4 flex-shrink-0">
                          {resource.type === 'document' && (
                            <ClipboardList className="h-5 w-5" />
                          )}
                          {resource.type === 'image' && (
                            <Image className="h-5 w-5" />
                          )}
                          {resource.type === 'video' && (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-md">{resource.title}</h4>
                          <p className="text-muted-foreground text-sm">{resource.description}</p>
                          <Button variant="link" className="p-0 h-auto mt-1 text-health-blue">
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Subscribe to our press list to receive the latest news and updates from HealthMate directly in your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Press;
