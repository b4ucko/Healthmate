
// This is a mock model for use in browser environment
// In a real application, this would be a server-side mongoose model

export interface IUser {
  _id: string; // Updated to include _id property
  name: string;
  email: string;
  password: string;
  userType: 'patient' | 'doctor' | 'wholesaler';
  createdAt: Date;
  updatedAt: Date;
}

// Mock model for browser environment
const User = {
  // Mock methods that would typically be available on a mongoose model
  findOne: () => {
    console.log('Mock: User.findOne called');
    return {
      exec: () => Promise.resolve(null)
    };
  },
  
  find: () => {
    console.log('Mock: User.find called');
    return {
      populate: () => ({
        sort: () => ({
          exec: () => Promise.resolve([])
        })
      })
    };
  }
};

export default User;
