import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DoctorCard from '@/components/doctors/DoctorCard';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

import drArjunSharma from '@/assets/doctors/dr-arjun-sharma.jpg';
import drPriyaPatel from '@/assets/doctors/dr-priya-patel.jpg';
import drVikramMehra from '@/assets/doctors/dr-vikram-mehra.jpg';
import drNehaGupta from '@/assets/doctors/dr-neha-gupta.jpg';
import drRajeshIyer from '@/assets/doctors/dr-rajesh-iyer.jpg';
import drAnanyaChatterjee from '@/assets/doctors/dr-ananya-chatterjee.jpg';
import drSureshKumar from '@/assets/doctors/dr-suresh-kumar.jpg';
import drSanjayDesai from '@/assets/doctors/dr-sanjay-desai.jpg';
import drMeenakshiReddy from '@/assets/doctors/dr-meenakshi-reddy.jpg';
import drRaviVerma from '@/assets/doctors/dr-ravi-verma.jpg';

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const mockIndianCities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"];
    const randomCity = mockIndianCities[Math.floor(Math.random() * mockIndianCities.length)];
    setUserLocation(randomCity);
    
    const symptomParam = searchParams.get('symptom');
    if (symptomParam) {
      setSearchQuery(symptomParam);
      setSortBy('relevance');
    }
  }, [searchParams]);

  const specialties = [
    'All Specialties',
    'Cardiology (Heart)',
    'Dermatology (Skin)',
    'Neurology (Brain & Nerves)',
    'Pediatrics (Children)',
    'Orthopedics (Bones)',
    'Gynecology (Women\'s Health)',
    'Ophthalmology (Eye)',
    'Psychiatry (Mental Health)',
    'Ayurveda (Traditional Medicine)',
    'ENT (Ear, Nose & Throat)',
    'Dentistry (Teeth)',
    'Diabetology (Diabetes)',
  ];

  const specialtyMap: Record<string, string> = {
    'Cardiology (Heart)': 'Cardiology',
    'Dermatology (Skin)': 'Dermatology',
    'Neurology (Brain & Nerves)': 'Neurology',
    'Pediatrics (Children)': 'Pediatrics',
    'Orthopedics (Bones)': 'Orthopedics',
    'Gynecology (Women\'s Health)': 'Gynecology',
    'Ophthalmology (Eye)': 'Ophthalmology',
    'Psychiatry (Mental Health)': 'Psychiatry',
    'Ayurveda (Traditional Medicine)': 'Ayurveda',
    'ENT (Ear, Nose & Throat)': 'ENT',
    'Dentistry (Teeth)': 'Dentistry',
    'Diabetology (Diabetes)': 'Diabetology',
  };

  const doctors = [
    {
      id: '1',
      name: 'Dr. Arjun Sharma',
      specialty: 'Cardiology',
      specialtyLabel: 'Cardiology (Heart)',
      rating: 4.9,
      reviewCount: 124,
      experience: 12,
      availability: 'Available today',
      imageUrl: drArjunSharma,
      avatar: drArjunSharma,
      location: 'Apollo Hospital, Delhi',
      offersVirtual: true,
      bio: 'Dr. Sharma is a renowned cardiologist with expertise in interventional cardiology and cardiac electrophysiology. He specializes in treating complex cardiovascular conditions.',
      languages: ['English', 'Hindi', 'Punjabi'],
      education: 'MBBS, MD (Cardiology) - AIIMS Delhi',
      achievements: ['Published 15+ research papers in international journals', 'Recipient of Indian Medical Association Excellence Award 2019'],
      availableDays: [1, 2, 3, 4, 5]
    },
    {
      id: '2',
      name: 'Dr. Priya Patel',
      specialty: 'Dermatology',
      specialtyLabel: 'Dermatology (Skin)',
      rating: 4.7,
      reviewCount: 98,
      experience: 8,
      availability: 'Next available: Tomorrow',
      imageUrl: drPriyaPatel,
      avatar: drPriyaPatel,
      location: 'Fortis Hospital, Mumbai',
      offersVirtual: true,
      bio: 'Dr. Patel specializes in cosmetic dermatology and skincare. She is well-known for her gentle approach and expertise in treating various skin conditions.',
      languages: ['English', 'Hindi', 'Gujarati'],
      education: 'MBBS, MD (Dermatology) - KEM Hospital, Mumbai',
      achievements: ['Pioneered new treatment protocols for psoriasis', 'Guest lecturer at multiple international dermatology conferences'],
      availableDays: [0, 1, 2, 3, 4, 5]
    },
    {
      id: '3',
      name: 'Dr. Vikram Mehra',
      specialty: 'Pediatrics',
      specialtyLabel: 'Pediatrics (Children)',
      rating: 4.8,
      reviewCount: 156,
      experience: 15,
      availability: 'Available today',
      imageUrl: drVikramMehra,
      avatar: drVikramMehra,
      location: 'AIIMS, New Delhi',
      offersVirtual: false,
      bio: 'Dr. Mehra is a compassionate pediatrician with special focus on childhood development disorders and adolescent medicine.',
      languages: ['English', 'Hindi', 'Urdu'],
      education: 'MBBS, DCH, DNB (Pediatrics) - AIIMS Delhi',
      achievements: ['Recipient of Dr. B.C. Roy National Award', 'Developed vaccination awareness programs adopted across North India'],
      availableDays: [1, 3, 5]
    },
    {
      id: '4',
      name: 'Dr. Neha Gupta',
      specialty: 'Neurology',
      specialtyLabel: 'Neurology (Brain & Nerves)',
      rating: 4.6,
      reviewCount: 87,
      experience: 10,
      availability: 'Next available: Friday',
      imageUrl: drNehaGupta,
      avatar: drNehaGupta,
      location: 'Medanta Hospital, Gurugram',
      offersVirtual: true,
      bio: 'Dr. Gupta is a specialist in neurological disorders, stroke management and neuro-rehabilitation.',
      languages: ['English', 'Hindi'],
      education: 'MBBS, DM (Neurology) - PGIMER Chandigarh',
      achievements: ['Fellowship in Stroke Management - Johns Hopkins', 'Panel member of National Neurological Disorders Committee'],
      availableDays: [2, 4, 6]
    },
    {
      id: '5',
      name: 'Dr. Rajesh Iyer',
      specialty: 'Ayurveda',
      specialtyLabel: 'Ayurveda (Traditional Medicine)',
      rating: 4.8,
      reviewCount: 112,
      experience: 18,
      availability: 'Available today',
      imageUrl: drRajeshIyer,
      avatar: drRajeshIyer,
      location: 'Patanjali Ayurved Centre, Haridwar',
      offersVirtual: true,
      bio: 'Dr. Iyer practices traditional Ayurvedic medicine, specializing in chronic ailments, digestive disorders and rejuvenation therapies.',
      languages: ['English', 'Hindi', 'Sanskrit', 'Malayalam'],
      education: 'BAMS, MD (Ayurveda) - Gujarat Ayurved University',
      achievements: ['Author of bestselling book on Ayurvedic home remedies', 'Developed proprietary herbal formulations for diabetes management'],
      availableDays: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      id: '6',
      name: 'Dr. Ananya Chatterjee',
      specialty: 'Gynecology',
      specialtyLabel: 'Gynecology (Women\'s Health)',
      rating: 4.7,
      reviewCount: 143,
      experience: 14,
      availability: 'Next available: Tomorrow',
      imageUrl: drAnanyaChatterjee,
      avatar: drAnanyaChatterjee,
      location: 'Apollo Gleneagles Hospital, Kolkata',
      offersVirtual: true,
      bio: 'Dr. Chatterjee specializes in women\'s reproductive health, high-risk pregnancies, and fertility treatments.',
      languages: ['English', 'Hindi', 'Bengali'],
      education: 'MBBS, MS, DNB (Obstetrics & Gynecology) - Calcutta Medical College',
      achievements: ['Established affordable women\'s health clinic in rural Bengal', 'Pioneer in minimally invasive gynecological surgeries'],
      availableDays: [1, 2, 3, 4, 5]
    },
    {
      id: '7',
      name: 'Dr. Suresh Kumar',
      specialty: 'Orthopedics',
      specialtyLabel: 'Orthopedics (Bones)',
      rating: 4.9,
      reviewCount: 201,
      experience: 17,
      availability: 'Available today',
      imageUrl: drSureshKumar,
      avatar: drSureshKumar,
      location: 'KIMS Hospital, Hyderabad',
      offersVirtual: false,
      bio: 'Dr. Kumar is an expert in joint replacement surgery, sports injuries, and trauma care.',
      languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
      education: 'MBBS, MS (Ortho), Fellowship in Joint Replacement - UK',
      achievements: ['Performed over 2000 successful joint replacements', 'Developed innovative techniques for minimally invasive surgeries'],
      availableDays: [1, 2, 3, 4, 5]
    },
    {
      id: '8',
      name: 'Dr. Sanjay Desai',
      specialty: 'ENT',
      specialtyLabel: 'ENT (Ear, Nose & Throat)',
      rating: 4.6,
      reviewCount: 118,
      experience: 12,
      availability: 'Next available: Thursday',
      imageUrl: drSanjayDesai,
      avatar: drSanjayDesai,
      location: 'Ruby Hall Clinic, Pune',
      offersVirtual: true,
      bio: 'Dr. Desai is a renowned ENT surgeon specializing in cochlear implants and sinus surgeries.',
      languages: ['English', 'Hindi', 'Marathi'],
      education: 'MBBS, MS (ENT) - BJ Medical College, Pune',
      achievements: ['Pioneered endoscopic sinus surgeries in Western India', 'Conducted free hearing aid camps for underprivileged communities'],
      availableDays: [0, 2, 4]
    },
    {
      id: '9',
      name: 'Dr. Meenakshi Reddy',
      specialty: 'Ophthalmology',
      specialtyLabel: 'Ophthalmology (Eye)',
      rating: 4.8,
      reviewCount: 132,
      experience: 9,
      availability: 'Available today',
      imageUrl: drMeenakshiReddy,
      avatar: drMeenakshiReddy,
      location: 'LV Prasad Eye Institute, Hyderabad',
      offersVirtual: true,
      bio: 'Dr. Reddy specializes in cataract surgery, LASIK, and treatment of retinal diseases.',
      languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
      education: 'MBBS, MS (Ophthalmology) - Sankara Nethralaya, Chennai',
      achievements: ['Fellowship in Cornea and Refractive Surgery - USA', 'More than 10,000 successful eye surgeries'],
      availableDays: [1, 3, 5]
    },
    {
      id: '10',
      name: 'Dr. Ravi Verma',
      specialty: 'Diabetology',
      specialtyLabel: 'Diabetology (Diabetes)',
      rating: 4.7,
      reviewCount: 165,
      experience: 16,
      availability: 'Next available: Monday',
      imageUrl: drRaviVerma,
      avatar: drRaviVerma,
      location: 'Max Healthcare, Delhi',
      offersVirtual: true,
      bio: 'Dr. Verma is an endocrinologist specializing in diabetes management and metabolic disorders.',
      languages: ['English', 'Hindi'],
      education: 'MBBS, MD (Internal Medicine), DM (Endocrinology) - AIIMS Delhi',
      achievements: ['Developed the National Diabetes Management Protocol 2019', 'Published extensive research on diabetes in the South Asian population'],
      availableDays: [1, 2, 3, 4, 5]
    }
  ];

  const doctorsWithRelevance = doctors.map(doctor => {
    let relevance = 0;
    const queryLower = searchQuery.toLowerCase();
    
    if (queryLower) {
      if (doctor.name.toLowerCase().includes(queryLower)) relevance += 10;
      if (doctor.specialtyLabel?.toLowerCase().includes(queryLower) || doctor.specialty.toLowerCase().includes(queryLower)) relevance += 10;
      if (doctor.location.toLowerCase().includes(queryLower)) relevance += 5;
      
      if (
        (queryLower.match(/(headache|head|brain|nerve|neurolog)/) && doctor.specialty === 'Neurology') ||
        (queryLower.match(/(eye|vision|sight|ophthalmolog)/) && doctor.specialty === 'Ophthalmology') ||
        (queryLower.match(/(ear|nose|throat|cough|cold|ent)/) && doctor.specialty === 'ENT') ||
        (queryLower.match(/(tooth|teeth|dental|dentist)/) && doctor.specialty === 'Dentistry') ||
        (queryLower.match(/(skin|rash|acne|dermatolog)/) && doctor.specialty === 'Dermatology') ||
        (queryLower.match(/(heart|chest|cardiac|cardiolog)/) && doctor.specialty === 'Cardiology') ||
        (queryLower.match(/(bone|joint|back|knee|muscle|pain|orthopedic)/) && doctor.specialty === 'Orthopedics') ||
        (queryLower.match(/(stomach|fever|ayurveda)/) && doctor.specialty === 'Ayurveda') ||
        (queryLower.match(/(woman|pregnancy|period|gynecolog)/) && doctor.specialty === 'Gynecology') ||
        (queryLower.match(/(child|kid|baby|pediatric)/) && doctor.specialty === 'Pediatrics') ||
        (queryLower.match(/(sugar|diabetes|diabetolog)/) && doctor.specialty === 'Diabetology')
      ) {
        relevance += 20;
      }
    } else {
      relevance = 1;
    }
    
    return { ...doctor, relevance };
  });

  const filteredDoctors = doctorsWithRelevance.filter(doctor => {
    const matchesSearch = searchQuery === '' || doctor.relevance > 0;
    
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'All Specialties' || 
                             doctor.specialtyLabel === selectedSpecialty;
    
    const matchesLocation = !locationQuery || 
                           doctor.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'relevance' && searchQuery !== '') {
      return b.relevance - a.relevance;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'experience') {
      return b.experience - a.experience;
    } else if (sortBy === 'reviews') {
      return b.reviewCount - a.reviewCount;
    } else if (sortBy === 'location' && userLocation) {
      const aHasLocation = a.location.includes(userLocation);
      const bHasLocation = b.location.includes(userLocation);
      if (aHasLocation && !bHasLocation) return -1;
      if (!aHasLocation && bHasLocation) return 1;
    }
    return 0;
  });

  const handleSearch = () => {
    if (filteredDoctors.length > 0) {
      toast.success(`Found ${filteredDoctors.length} doctors matching your criteria.`);
    } else {
      toast.info("No doctors found. Try adjusting your search criteria.");
    }
  };

  const findNearbyDoctors = () => {
    if (userLocation) {
      setLocationQuery(userLocation);
      toast.success(`Finding doctors near ${userLocation}`);
    } else {
      toast.info("Location not available. Please enter your location manually.");
    }
  };

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('doctors.title')}</h1>
              <p className="text-muted-foreground max-w-2xl">
                {t('doctors.subtitle')}
              </p>
            </div>

            <div className="glass-card mb-8 animate-scale-in">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={t('doctors.searchPlaceholder')}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                </div>

                <div className="relative md:w-48">
                  <select
                    className="w-full appearance-none px-4 py-3 pl-10 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                </div>

                <div className="relative md:w-56">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('doctors.locationPlaceholder')}
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  </div>
                </div>

                <Button 
                  className="md:w-32 h-12 rounded-full bg-health-blue hover:bg-health-blue/90"
                  onClick={handleSearch}
                >
                  {t('common.search')}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  className="px-2 py-1 text-sm rounded border"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Most Experience</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="location">Nearest Location</option>
                </select>
              </div>
              
              {userLocation && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-sm"
                  onClick={findNearbyDoctors}
                >
                  <MapPin size={16} />
                  Find doctors near {userLocation}
                </Button>
              )}
            </div>

            <div className="space-y-6 animate-fade-in">
              {sortedDoctors.length > 0 ? (
                sortedDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No doctors found matching your criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery(''); 
                      setSelectedSpecialty('');
                      setLocationQuery('');
                      toast.success("Filters cleared!");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Doctors;
