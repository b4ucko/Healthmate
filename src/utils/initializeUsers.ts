
import { useEffect } from 'react';

// This function will initialize doctor users if they don't already exist
export const useInitializeDoctors = () => {
  useEffect(() => {
    const doctorsData = [
      {
        id: '1',
        name: 'Dr. Arjun Sharma',
        specialty: 'Cardiology',
        specialtyLabel: 'Cardiology (Heart)',
        email: 'dr.sharma@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        location: 'Apollo Hospital, Delhi',
        experience: '12',
        gender: 'male',
        availableDays: [1, 2, 3, 4, 5], // Monday to Friday
        isAvailable: true
      },
      {
        id: '2',
        name: 'Dr. Priya Patel',
        specialty: 'Dermatology',
        specialtyLabel: 'Dermatology (Skin)',
        email: 'dr.patel@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        location: 'Fortis Hospital, Mumbai',
        experience: '8',
        gender: 'female',
        availableDays: [2, 3, 5], // Tuesday, Wednesday, Friday
        isAvailable: true
      },
      {
        id: '3',
        name: 'Dr. Vikram Mehra',
        specialty: 'Pediatrics',
        specialtyLabel: 'Pediatrics (Children)',
        email: 'dr.mehra@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        location: 'AIIMS, New Delhi',
        experience: '15',
        gender: 'male',
        availableDays: [1, 3, 5, 6], // Monday, Wednesday, Friday, Saturday
        isAvailable: true
      },
      {
        id: '4',
        name: 'Dr. Neha Gupta',
        specialty: 'Neurology',
        specialtyLabel: 'Neurology (Brain & Nerves)',
        email: 'dr.gupta@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
        location: 'Medanta Hospital, Gurugram',
        experience: '10',
        gender: 'female',
        availableDays: [2, 4, 6], // Tuesday, Thursday, Saturday
        isAvailable: true
      },
      {
        id: '5',
        name: 'Dr. Rajesh Iyer',
        specialty: 'Ayurveda',
        specialtyLabel: 'Ayurveda (Traditional Medicine)',
        email: 'dr.iyer@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        location: 'Patanjali Ayurved Centre, Haridwar',
        experience: '18',
        gender: 'male',
        availableDays: [1, 3, 5, 7], // Monday, Wednesday, Friday, Sunday
        isAvailable: false
      },
      {
        id: '6',
        name: 'Dr. Kavita Reddy',
        specialty: 'Gynecology',
        specialtyLabel: 'Gynecology (Women\'s Health)',
        email: 'dr.reddy@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        location: 'Rainbow Children\'s Hospital, Hyderabad',
        experience: '14',
        gender: 'female',
        availableDays: [2, 4, 6], // Tuesday, Thursday, Saturday
        isAvailable: false
      },
      {
        id: '11',
        name: 'Dr. Amit Verma',
        specialty: 'Cardiology',
        specialtyLabel: 'Cardiology (Heart)',
        email: 'dr.verma@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Medanta Hospital, Gurugram',
        experience: '11',
        gender: 'male',
        availableDays: [1, 2, 3, 4, 5],
        isAvailable: true
      },
      {
        id: '12',
        name: 'Dr. Sunita Rao',
        specialty: 'Dermatology',
        specialtyLabel: 'Dermatology (Skin)',
        email: 'dr.rao@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Max Super Speciality Hospital, Saket',
        experience: '9',
        gender: 'female',
        availableDays: [1, 3, 5],
        isAvailable: true
      },
      {
        id: '13',
        name: 'Dr. Rohan Das',
        specialty: 'Pediatrics',
        specialtyLabel: 'Pediatrics (Children)',
        email: 'dr.das@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Manipal Hospital, Bangalore',
        experience: '14',
        gender: 'male',
        availableDays: [1, 2, 4, 5],
        isAvailable: true
      },
      {
        id: '14',
        name: 'Dr. Shalini Nair',
        specialty: 'Neurology',
        specialtyLabel: 'Neurology (Brain & Nerves)',
        email: 'dr.nair@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Aster CMI Hospital, Bangalore',
        experience: '11',
        gender: 'female',
        availableDays: [2, 3, 4],
        isAvailable: true
      },
      {
        id: '15',
        name: 'Dr. Sanjay Gupta',
        specialty: 'Orthopedics',
        specialtyLabel: 'Orthopedics (Bones)',
        email: 'dr.sanjaygupta@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Kokilaben Dhirubhai Ambani Hospital, Mumbai',
        experience: '13',
        gender: 'male',
        availableDays: [1, 2, 3, 5],
        isAvailable: true
      },
      {
        id: '16',
        name: 'Dr. Divya Joshi',
        specialty: 'Gynecology',
        specialtyLabel: 'Gynecology (Women\'s Health)',
        email: 'dr.joshi@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Nanavati Hospital, Mumbai',
        experience: '15',
        gender: 'female',
        availableDays: [1, 3, 4, 5],
        isAvailable: true
      },
      {
        id: '17',
        name: 'Dr. Vivek Saxena',
        specialty: 'Ophthalmology',
        specialtyLabel: 'Ophthalmology (Eye)',
        email: 'dr.saxena@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Eye Care Centre, Delhi',
        experience: '12',
        gender: 'male',
        availableDays: [1, 2, 4, 5],
        isAvailable: true
      },
      {
        id: '18',
        name: 'Dr. Nisha Kapoor',
        specialty: 'Psychiatry',
        specialtyLabel: 'Psychiatry (Mental Health)',
        email: 'dr.kapoor@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Fortis Hospital, Noida',
        experience: '10',
        gender: 'female',
        availableDays: [1, 2, 4],
        isAvailable: true
      },
      {
        id: '19',
        name: 'Dr. Anil Malhotra',
        specialty: 'Ayurveda',
        specialtyLabel: 'Ayurveda (Traditional Medicine)',
        email: 'dr.malhotra@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Kottakkal Arya Vaidya Sala, Delhi Branch',
        experience: '20',
        gender: 'male',
        availableDays: [1, 2, 3, 4, 5, 6],
        isAvailable: true
      },
      {
        id: '20',
        name: 'Dr. Preeti Sinha',
        specialty: 'Dentistry',
        specialtyLabel: 'Dentistry (Teeth)',
        email: 'dr.sinha@healthmate.example',
        password: 'doctor123',
        userType: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        location: 'Clove Dental, Delhi',
        experience: '8',
        gender: 'female',
        availableDays: [2, 3, 5, 6],
        isAvailable: true
      }
    ];

    // Initialize doctors if they don't exist
    const initializeDoctors = () => {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check which doctors need to be added
      const newDoctors = doctorsData.filter(doctor => 
        !existingUsers.some(user => user.email === doctor.email)
      );
      
      if (newDoctors.length > 0) {
        // Add the new doctors to existing users
        const updatedUsers = [...existingUsers, ...newDoctors];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Also save to a separate collection for easy access
        localStorage.setItem('doctors', JSON.stringify(doctorsData));
        
        console.log(`Initialized ${newDoctors.length} doctor accounts`);
        console.log('Doctor credentials:');
        doctorsData.forEach(doctor => {
          console.log(`${doctor.name}: Email - ${doctor.email}, Password - ${doctor.password}, Available: ${doctor.isAvailable ? 'Yes' : 'No'}`);
        });
      } else {
        // Still save the complete doctors data
        localStorage.setItem('doctors', JSON.stringify(doctorsData));
      }
    };

    initializeDoctors();
  }, []);
};

export const getDoctors = () => {
  const doctors = localStorage.getItem('doctors');
  return doctors ? JSON.parse(doctors) : [];
};

export default useInitializeDoctors;
