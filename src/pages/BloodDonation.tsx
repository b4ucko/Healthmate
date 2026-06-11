
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import BloodDonorForm from '@/components/blood/BloodDonorForm';
import VoiceBloodDonationRequest from '@/components/blood/VoiceBloodDonationRequest';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BloodDonation = () => {
  const { t } = useLanguage();
  const { userInfo } = useAuth();
  
  // State for voice-controlled form fields
  const [bloodType, setBloodType] = useState<string>('');
  const [units, setUnits] = useState<string>('1');
  const [location, setLocation] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [requestDescription, setRequestDescription] = useState<string>('');
  
  const handleSubmitRequest = () => {
    if (!bloodType) {
      toast.error("Please select a blood type");
      return;
    }
    
    // Log blood request
    const newRequest = {
      id: `blood-req-${Date.now()}`,
      userId: userInfo?.id || 'guest',
      bloodType,
      units,
      location,
      requestDescription,
      isUrgent,
      createdAt: new Date().toISOString()
    };
    
    const storedRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    localStorage.setItem('bloodRequests', JSON.stringify([newRequest, ...storedRequests]));
    
    toast.success("Blood donation request submitted successfully");
    // Reset form
    setBloodType('');
    setUnits('1');
    setLocation('');
    setIsUrgent(false);
    setRequestDescription('');
  };
  
  return (
    <Layout>
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t('bloodDonation.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('bloodDonation.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-semibold mb-6">{t('bloodDonation.requestBlood')}</h2>
              
              <div className="mb-4 flex justify-between items-center">
                <p className="text-muted-foreground">{t('bloodDonation.requestFormDescription')}</p>
                
                {/* Add Voice Blood Donation Request component */}
                <VoiceBloodDonationRequest 
                  onBloodTypeSelect={setBloodType}
                  onLocationSelect={setLocation}
                  onUrgencySelect={setIsUrgent}
                  onRequestDescriptionUpdate={setRequestDescription}
                />
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('bloodDonation.bloodType')}
                    </label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border"
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                    >
                      <option value="">{t('bloodBank.selectBloodGroup')}</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('bloodDonation.units')}
                    </label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border"
                      value={units}
                      onChange={(e) => setUnits(e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('bloodDonation.location')}
                  </label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border"
                    placeholder={t('bloodDonation.enterHospital')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('bloodDonation.requestDescription')}
                  </label>
                  <textarea 
                    className="w-full px-4 py-2 rounded-lg border resize-none"
                    rows={3}
                    placeholder={t('bloodDonation.describeRequest')}
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="urgent" 
                    className="mr-2"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                  />
                  <label htmlFor="urgent" className="text-sm font-medium text-red-600">
                    {t('bloodDonation.markUrgent')}
                  </label>
                </div>
                
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium"
                  onClick={handleSubmitRequest}
                >
                  {t('bloodDonation.submitRequest')}
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">{t('bloodDonation.becomeDonor')}</h2>
              <p className="text-muted-foreground mb-6">{t('bloodDonation.donorFormDescription')}</p>
              <BloodDonorForm onSubmit={(data) => {
                // Log donor registration
                const newDonation = {
                  id: `blood-donor-${Date.now()}`,
                  userId: userInfo?.id || 'guest',
                  fullName: data.fullName,
                  age: data.age,
                  weight: data.weight,
                  bloodGroup: data.bloodGroup,
                  contactNumber: data.contactNumber,
                  createdAt: new Date().toISOString()
                };
                
                const storedDonations = JSON.parse(localStorage.getItem('bloodDonations') || '[]');
                localStorage.setItem('bloodDonations', JSON.stringify([newDonation, ...storedDonations]));
                
                toast.success("Thank you for registering as a blood donor!");
              }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BloodDonation;
