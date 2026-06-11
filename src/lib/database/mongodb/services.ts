
import User, { IUser } from './models/User';
import Wholesaler, { IWholesaler } from './models/Wholesaler';
import Appointment, { IAppointment } from './models/Appointment';
import MedicalRecord, { IMedicalRecord } from './models/MedicalRecord';
import DeliveryDetail, { IDeliveryDetail } from './models/DeliveryDetail';
import { UserFormData, WholesalerFormData } from '@/types/auth-types';

// Browser-compatible mock implementations
// In a real application, these would call fetch to a backend API

// SMS notification service
const sendSMSNotification = async (phoneNumber: string, message: string): Promise<boolean> => {
  console.log(`Mock SMS: Sending message to ${phoneNumber}:`, message);
  
  // In a real app, this would call an SMS gateway API
  // For now, we'll just log it
  
  // For the specific number in requirements
  if (phoneNumber === '9819428182' || phoneNumber === '+919819428182') {
    console.log('📱 SMS notification sent to target number 9819428182');
    return true;
  }
  
  return false;
};

// User services
export const createUser = async (userData: UserFormData): Promise<IUser> => {
  console.log('Mock: Creating user in MongoDB:', userData);
  // This would normally call a backend API
  return {
    _id: `mock-user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: userData.password, // In real app, never return password!
    userType: userData.userType,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any;
};

export const createWholesaler = async (wholesalerData: WholesalerFormData): Promise<IWholesaler> => {
  console.log('Mock: Creating wholesaler in MongoDB:', wholesalerData);
  // This would normally call a backend API
  const userId = `mock-user-${Date.now()}`;
  return {
    _id: `mock-wholesaler-${Date.now()}`,
    user: userId,
    phone: wholesalerData.phone,
    address: wholesalerData.address,
    licenseNumber: wholesalerData.licenseNumber,
    businessType: wholesalerData.businessType,
    companySize: wholesalerData.companySize,
    yearEstablished: wholesalerData.yearEstablished,
    about: wholesalerData.about,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any;
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  console.log('Mock: Getting user by email from MongoDB:', email);
  // This would normally call a backend API
  // Simulate not finding a user
  return null;
};

// Appointment services
export const createAppointment = async (appointmentData: any): Promise<IAppointment> => {
  console.log('Mock: Creating appointment in MongoDB:', appointmentData);
  
  // In a real app, this would save to MongoDB
  // For our mock implementation, we'll use localStorage
  
  // Get existing appointments
  const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
  
  // Create new appointment
  const newAppointment = {
    _id: `mock-appointment-${Date.now()}`,
    id: `appointment-${Date.now()}`,
    doctorId: appointmentData.doctorId,
    doctorName: appointmentData.doctorName,
    specialty: appointmentData.specialty,
    patientId: appointmentData.patientId,
    patientName: appointmentData.patientName,
    patientEmail: appointmentData.patientEmail,
    patientPhone: appointmentData.patientPhone || '+1234567890',
    date: appointmentData.date,
    time: appointmentData.time,
    status: appointmentData.status || 'pending',
    imageUrl: appointmentData.imageUrl,
    reason: appointmentData.reason || 'General consultation',
    createdAt: new Date().toISOString()
  };
  
  // Add to localStorage
  localStorage.setItem('doctorAppointments', JSON.stringify([newAppointment, ...storedAppointments]));
  
  // Send SMS notification for appointment booking
  await sendSMSNotification('9819428182', 
    `New appointment booked: ${appointmentData.patientName} with ${appointmentData.doctorName} on ${appointmentData.date} at ${appointmentData.time}`
  );
  
  // Return mock appointment for API compatibility
  return {
    _id: newAppointment._id,
    patient: appointmentData.patientId,
    doctor: appointmentData.doctorId,
    appointmentDate: new Date(appointmentData.date),
    appointmentTime: appointmentData.time,
    status: appointmentData.status || 'scheduled',
    notes: appointmentData.reason,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any;
};

export const getAppointmentsByPatientId = async (patientId: string): Promise<IAppointment[]> => {
  console.log('Mock: Getting appointments by patient ID from MongoDB:', patientId);
  
  // In a real app, this would query MongoDB
  // For our mock implementation, we'll use localStorage
  const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
  
  // Filter appointments by patientId
  const patientAppointments = storedAppointments.filter(
    (appointment: any) => appointment.patientId === patientId
  );
  
  // Convert to IAppointment format
  return patientAppointments.map((appointment: any) => ({
    _id: appointment._id || `mock-appointment-${Date.now()}`,
    patient: appointment.patientId,
    doctor: appointment.doctorId,
    appointmentDate: new Date(appointment.date),
    appointmentTime: appointment.time,
    status: appointment.status === 'pending' ? 'scheduled' : appointment.status,
    notes: appointment.reason,
    createdAt: new Date(appointment.createdAt),
    updatedAt: new Date(appointment.createdAt)
  })) as any;
};

export const getAppointmentsByDoctorId = async (doctorId: string): Promise<IAppointment[]> => {
  console.log('Mock: Getting appointments by doctor ID from MongoDB:', doctorId);
  
  // In a real app, this would query MongoDB
  // For our mock implementation, we'll use localStorage
  const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
  
  // Filter appointments by doctorId
  const doctorAppointments = storedAppointments.filter(
    (appointment: any) => appointment.doctorId === doctorId
  );
  
  // Convert to IAppointment format
  return doctorAppointments.map((appointment: any) => ({
    _id: appointment._id || `mock-appointment-${Date.now()}`,
    patient: appointment.patientId,
    doctor: appointment.doctorId,
    appointmentDate: new Date(appointment.date),
    appointmentTime: appointment.time,
    status: appointment.status === 'pending' ? 'scheduled' : appointment.status,
    notes: appointment.reason,
    createdAt: new Date(appointment.createdAt),
    updatedAt: new Date(appointment.createdAt)
  })) as any;
};

export const getDoctorAvailability = async (doctorId: string): Promise<boolean> => {
  console.log('Mock: Getting doctor availability from MongoDB:', doctorId);
  
  // In a real app, this would query MongoDB
  // For our mock implementation, we'll use localStorage
  const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
  const doctor = doctors.find((doc: any) => doc.id === doctorId);
  
  return doctor ? doctor.isAvailable : false;
};

// Function to update appointment status
export const updateAppointmentStatus = async (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled'): Promise<IAppointment | null> => {
  console.log(`Mock: Updating appointment ${appointmentId} status to ${status}`);
  
  const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
  const appointmentIndex = storedAppointments.findIndex((apt: any) => apt.id === appointmentId);
  
  if (appointmentIndex === -1) {
    return null;
  }
  
  const appointment = storedAppointments[appointmentIndex];
  appointment.status = status;
  
  storedAppointments[appointmentIndex] = appointment;
  localStorage.setItem('doctorAppointments', JSON.stringify(storedAppointments));
  
  // Send SMS notification about status change
  let message = '';
  if (status === 'scheduled') {
    message = `Your appointment with ${appointment.doctorName} has been scheduled for ${appointment.date} at ${appointment.time}`;
  } else if (status === 'completed') {
    message = `Your appointment with ${appointment.doctorName} has been completed. Thank you for visiting.`;
  } else if (status === 'cancelled') {
    message = `Your appointment with ${appointment.doctorName} scheduled for ${appointment.date} at ${appointment.time} has been cancelled.`;
  }
  
  await sendSMSNotification('9819428182', message);
  
  return {
    _id: appointment._id,
    patient: appointment.patientId,
    doctor: appointment.doctorId,
    appointmentDate: new Date(appointment.date),
    appointmentTime: appointment.time,
    status: status === 'cancelled' ? 'cancelled' : status,
    notes: appointment.reason,
    createdAt: new Date(appointment.createdAt),
    updatedAt: new Date()
  } as any;
};

// Medical Record services
export const createMedicalRecord = async (recordData: any): Promise<IMedicalRecord> => {
  console.log('Mock: Creating medical record in MongoDB:', recordData);
  // This would normally call a backend API
  return {
    _id: `mock-record-${Date.now()}`,
    patient: recordData.patientId,
    doctor: recordData.doctorId,
    recordDate: recordData.date,
    diagnosis: recordData.diagnosis,
    prescription: recordData.prescription,
    notes: recordData.notes,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any;
};

export const getMedicalRecordsByPatientId = async (patientId: string): Promise<IMedicalRecord[]> => {
  console.log('Mock: Getting medical records by patient ID from MongoDB:', patientId);
  // This would normally call a backend API
  return [];
};

// Delivery Details services
export const saveDeliveryDetails = async (deliveryData: any): Promise<IDeliveryDetail> => {
  console.log('Mock: Saving delivery details in MongoDB:', deliveryData);
  // This would normally call a backend API
  return {
    _id: `mock-delivery-${Date.now()}`,
    user: deliveryData.userId,
    address: deliveryData.address,
    city: deliveryData.city,
    state: deliveryData.state,
    zipCode: deliveryData.zipCode,
    phone: deliveryData.phone,
    deliveryInstructions: deliveryData.instructions,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any;
};

export const getDeliveryDetailsByUserId = async (userId: string): Promise<IDeliveryDetail | null> => {
  console.log('Mock: Getting delivery details by user ID from MongoDB:', userId);
  // This would normally call a backend API
  return null;
};

// Order services
export const createOrder = async (orderData: any): Promise<any> => {
  console.log('Mock: Creating order in MongoDB:', orderData);
  
  // Get existing orders
  const storedOrders = JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
  
  // Create new order
  const newOrder = {
    id: `order-${Date.now()}`,
    userId: orderData.userId,
    userName: orderData.userName,
    userType: orderData.userType,
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    status: 'processing',
    isWholesale: orderData.isWholesale || false,
    createdAt: new Date().toISOString()
  };
  
  // Add to localStorage
  localStorage.setItem('pharmacyOrders', JSON.stringify([newOrder, ...storedOrders]));
  
  return newOrder;
};

export const getOrdersByUserId = async (userId: string): Promise<any[]> => {
  console.log('Mock: Getting orders by user ID:', userId);
  
  const storedOrders = JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
  return storedOrders.filter((order: any) => order.userId === userId);
};

export const getWholesaleOrders = async (): Promise<any[]> => {
  console.log('Mock: Getting all wholesale orders');
  
  const storedOrders = JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
  return storedOrders.filter((order: any) => order.isWholesale === true);
};

export const getAllOrders = async (): Promise<any[]> => {
  console.log('Mock: Getting all orders');
  
  return JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
  console.log(`Mock: Updating order ${orderId} status to ${status}`);
  
  const storedOrders = JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
  const updatedOrders = storedOrders.map((order: any) => 
    order.id === orderId ? { ...order, status } : order
  );
  
  localStorage.setItem('pharmacyOrders', JSON.stringify(updatedOrders));
  
  return updatedOrders.find((order: any) => order.id === orderId);
};
