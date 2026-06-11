
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CalendarClock, MapPin, Briefcase, Search, Filter, Star, Building, Clock, ArrowRight } from 'lucide-react';

const jobListings = [
  {
    id: 1,
    title: 'Senior Medical Officer',
    department: 'Medical',
    location: 'Delhi, India',
    type: 'Full-time',
    salary: '₹15,00,000 - ₹18,00,000 per annum',
    posted: '2025-03-15',
    description: 'We are seeking an experienced Senior Medical Officer to join our growing healthcare team. The ideal candidate will have extensive experience in general medicine and be passionate about patient care.',
    requirements: [
      'MBBS with MD/MS degree from a recognized institution',
      'Minimum 8 years of clinical experience',
      'Valid medical license',
      'Excellent communication skills',
      'Experience with electronic health records'
    ],
    featured: true
  },
  {
    id: 2,
    title: 'Health Informatics Specialist',
    department: 'IT',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹12,00,000 - ₹16,00,000 per annum',
    posted: '2025-03-28',
    description: 'Join our innovative Health IT team to develop and maintain healthcare information systems. You will help bridge the gap between clinical and technical aspects of our organization.',
    requirements: [
      'Bachelor\'s degree in Health Informatics or related field',
      'Minimum 5 years of experience in healthcare IT',
      'Knowledge of HL7, FHIR, and other healthcare data standards',
      'Experience with EHR implementation and optimization',
      'Strong analytical and problem-solving skills'
    ],
    featured: true
  },
  {
    id: 3,
    title: 'Clinical Pharmacist',
    department: 'Pharmacy',
    location: 'Mumbai, India',
    type: 'Full-time',
    salary: '₹10,00,000 - ₹14,00,000 per annum',
    posted: '2025-04-02',
    description: 'We are looking for a qualified Clinical Pharmacist to join our healthcare team. You will be responsible for ensuring safe and effective medication use, providing clinical pharmacy services, and participating in patient care rounds.',
    requirements: [
      'Pharm.D. or B.Pharm with M.Pharm from an accredited institution',
      'Minimum 3 years of hospital pharmacy experience',
      'Knowledge of pharmacotherapy and medication management',
      'Valid pharmacy license',
      'Strong communication and teamwork skills'
    ],
    featured: false
  },
  {
    id: 4,
    title: 'Telemedicine Coordinator',
    department: 'Telemedicine',
    location: 'Remote, India',
    type: 'Full-time',
    salary: '₹8,00,000 - ₹12,00,000 per annum',
    posted: '2025-04-05',
    description: 'Help us expand our telemedicine services by coordinating virtual appointments, assisting patients with technical setup, and ensuring a smooth experience for both patients and healthcare providers.',
    requirements: [
      'Bachelor\'s degree in Healthcare Administration or related field',
      'Experience with telemedicine platforms and video conferencing',
      'Strong technical troubleshooting skills',
      'Excellent customer service and communication abilities',
      'Knowledge of healthcare operations'
    ],
    featured: false
  },
  {
    id: 5,
    title: 'Medical Content Writer',
    department: 'Marketing',
    location: 'Hybrid - Hyderabad, India',
    type: 'Part-time',
    salary: '₹6,00,000 - ₹8,00,000 per annum',
    posted: '2025-04-08',
    description: 'Create engaging and accurate medical content for our website, blog, patient education materials, and social media. The ideal candidate will have a strong background in healthcare and excellent writing skills.',
    requirements: [
      'Bachelor\'s degree in Medical, Life Sciences, or relevant field',
      'Proven experience in medical writing or healthcare content creation',
      'Ability to simplify complex medical concepts for general audience',
      'SEO knowledge and familiarity with content management systems',
      'Portfolio of published medical content'
    ],
    featured: false
  },
  {
    id: 6,
    title: 'Healthcare Data Analyst',
    department: 'Analytics',
    location: 'Pune, India',
    type: 'Full-time',
    salary: '₹10,00,000 - ₹15,00,000 per annum',
    posted: '2025-04-01',
    description: 'Join our analytics team to analyze healthcare data, generate insights, and help improve patient outcomes. You will work with large datasets to identify trends and make data-driven recommendations.',
    requirements: [
      'Bachelor\'s or Master\'s degree in Statistics, Data Science, or related field',
      'Minimum 3 years of experience in healthcare data analysis',
      'Proficiency in SQL, Python, R, and data visualization tools',
      'Experience with healthcare databases and claims data',
      'Strong analytical and problem-solving skills'
    ],
    featured: true
  }
];

const departments = [
  'All Departments',
  'Medical',
  'IT',
  'Pharmacy',
  'Telemedicine',
  'Marketing',
  'Analytics',
  'Nursing',
  'Administration'
];

const locations = [
  'All Locations',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Remote',
  'Hybrid'
];

const Careers = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState('All Departments');
  const [selectedLocation, setSelectedLocation] = React.useState('All Locations');

  // Filter job listings based on search, department and location
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      selectedDepartment === 'All Departments' || 
      job.department === selectedDepartment;
    
    const matchesLocation = 
      selectedLocation === 'All Locations' || 
      job.location.includes(selectedLocation);
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // Sort jobs to show featured ones first
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* Hero section */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Join Our Healthcare Revolution</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                At HealthMate, we're on a mission to transform healthcare. Join our team of passionate 
                professionals dedicated to making quality healthcare accessible to all.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="rounded-full px-8" size="lg">View Open Positions</Button>
                <Button variant="outline" className="rounded-full px-8" size="lg">Our Benefits</Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-none">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">500+</p>
                  <p className="text-muted-foreground">Healthcare Professionals</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border-none">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">20+</p>
                  <p className="text-muted-foreground">Locations</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 border-none">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">4.8/5</p>
                  <p className="text-muted-foreground">Employee Satisfaction</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border-none">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">15+</p>
                  <p className="text-muted-foreground">Awards Won</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and filters */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Current Openings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative col-span-1 md:col-span-3">
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
                
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('All Departments');
                  setSelectedLocation('All Locations');
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Job listings */}
            <div className="space-y-6 mb-12">
              {sortedJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-bold mr-3">{job.title}</h3>
                            {job.featured && (
                              <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.department}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center">
                              <CalendarClock className="h-4 w-4 mr-1" />
                              Posted: {new Date(job.posted).toLocaleDateString('en-US', {
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <Button className="mt-4 md:mt-0 gap-2">
                          Apply Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="mb-4 text-sm text-muted-foreground">{job.description}</p>
                      
                      <div>
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                        <p className="font-medium">{job.salary}</p>
                        <Button variant="ghost" size="sm" className="gap-1">
                          View Details
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Empty state */}
            {sortedJobs.length === 0 && (
              <div className="text-center py-16 border rounded-lg">
                <h3 className="text-xl font-medium mb-2">No job openings found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDepartment('All Departments');
                    setSelectedLocation('All Locations');
                  }}
                >
                  View All Jobs
                </Button>
              </div>
            )}
            
            {/* Benefits section */}
            <div className="pt-8 pb-4 border-t">
              <h2 className="text-2xl font-bold mb-6">Why Join HealthMate?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Growth Opportunities</h3>
                    <p className="text-muted-foreground text-sm">
                      Continuous learning, mentorship programs, and clear career progression paths
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Competitive Benefits</h3>
                    <p className="text-muted-foreground text-sm">
                      Comprehensive health coverage, retirement plans, and generous paid time off
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Work-Life Balance</h3>
                    <p className="text-muted-foreground text-sm">
                      Flexible work arrangements, wellness programs, and respect for personal time
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-health-light-blue to-health-blue rounded-xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Don't see a position that fits?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <Button variant="secondary" size="lg">Submit Your Resume</Button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Careers;
