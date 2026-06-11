
import React from 'react';
import { CalendarClock, Clock, Search, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Heart Disease Risk Factors',
    excerpt: 'Learn about the common risk factors for heart disease and how to mitigate them through lifestyle changes and regular checkups.',
    image: '/heart-disease-risk.png',
    author: 'Dr. Arjun Sharma',
    authorRole: 'Cardiologist',
    date: '2025-03-15',
    readTime: '8 min read',
    category: 'Cardiology',
    tags: ['Heart Health', 'Prevention', 'Risk Factors']
  },
  {
    id: 2,
    title: 'The Benefits of Telemedicine for Rural Communities',
    excerpt: 'Telemedicine is bridging the healthcare gap for rural populations across India. Explore how virtual consultations are improving access to specialists.',
    image: '/telemedicine-rural.png',
    author: 'Dr. Neha Gupta',
    authorRole: 'Healthcare Policy Advisor',
    date: '2025-04-02',
    readTime: '6 min read',
    category: 'Telemedicine',
    tags: ['Rural Healthcare', 'Technology', 'Access']
  },
  {
    id: 3,
    title: 'Ayurvedic Remedies for Common Digestive Issues',
    excerpt: 'Traditional Ayurvedic approaches to treating digestive problems focus on holistic healing. Learn about effective remedies you can try at home.',
    image: '/immunity-foods.png',
    author: 'Dr. Rajesh Iyer',
    authorRole: 'Ayurvedic Practitioner',
    date: '2025-03-28',
    readTime: '10 min read',
    category: 'Ayurveda',
    tags: ['Digestive Health', 'Natural Remedies', 'Traditional Medicine']
  },
  {
    id: 4,
    title: 'Managing Diabetes During Festive Seasons',
    excerpt: 'Festive seasons bring challenges for diabetes management. Discover practical tips to enjoy celebrations while keeping your blood sugar in check.',
    image: '/diabetes-management.png',
    author: 'Dr. Ravi Verma',
    authorRole: 'Endocrinologist',
    date: '2025-04-05',
    readTime: '7 min read',
    category: 'Diabetes Care',
    tags: ['Diabetes', 'Festive Season', 'Diet Management']
  },
  {
    id: 5,
    title: 'Advances in Pediatric Care in India',
    excerpt: 'Recent advancements in pediatric healthcare are improving outcomes for children across India. Learn about new treatments and preventive care approaches.',
    image: '/pediatrician-care.png',
    author: 'Dr. Vikram Mehra',
    authorRole: 'Pediatric Specialist',
    date: '2025-03-20',
    readTime: '9 min read',
    category: 'Pediatrics',
    tags: ["Children's Health", 'Medical Innovations', 'Preventive Care']
  },
  {
    id: 6,
    title: "Women's Reproductive Health: Breaking Taboos",
    excerpt: "Open conversations about women's reproductive health are essential. This article addresses common concerns and emphasizes the importance of regular check-ups.",
    image: '/womens-health.png',
    author: 'Dr. Ananya Chatterjee',
    authorRole: 'Gynecologist',
    date: '2025-04-07',
    readTime: '11 min read',
    category: "Women's Health",
    tags: ['Reproductive Health', 'Awareness', "Women's Wellness"]
  }
];

const categories = [
  'All Categories',
  'Cardiology',
  'Telemedicine',
  'Ayurveda',
  'Diabetes Care',
  'Pediatrics',
  "Women's Health",
  'Mental Health',
  'Nutrition',
  'Fitness'
];

const Blogs = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');

  // Filter blog posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Health Insights Blog</h1>
              <p className="text-muted-foreground max-w-2xl">
                Expert articles, insights, and the latest research from our medical professionals
              </p>
            </div>

            {/* Search and filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
                
                <select
                  className="w-full md:w-60 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured post */}
            {filteredPosts.length > 0 && (
              <div className="mb-12 animate-fade-in">
                <div className="relative overflow-hidden rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="order-2 md:order-1 flex flex-col justify-center p-6 md:p-8">
                      <Badge className="w-fit mb-4">{filteredPosts[0].category}</Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">{filteredPosts[0].title}</h2>
                      <p className="text-muted-foreground mb-6">{filteredPosts[0].excerpt}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {filteredPosts[0].author}, {filteredPosts[0].authorRole}
                        </div>
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          {new Date(filteredPosts[0].date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {filteredPosts[0].readTime}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-6">
                        {filteredPosts[0].tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      
                      <Button className="w-fit">Read Article</Button>
                    </div>
                    <div className="order-1 md:order-2">
                      <img 
                        src={filteredPosts[0].image} 
                        alt={filteredPosts[0].title}
                        className="w-full h-full object-cover rounded-xl max-h-[400px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <div key={post.id} className="bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-300 animate-fade-in">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <Badge className="mb-2">{post.category}</Badge>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">Read More</Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                  }}
                >
                  View All Articles
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>Previous</Button>
                  <Button>1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Blogs;
