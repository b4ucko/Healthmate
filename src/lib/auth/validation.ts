
import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
  userType: z.enum(['patient', 'doctor']),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  age: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int({ message: 'Age must be an integer' }).min(1, { message: 'Age must be at least 1' }).max(100, { message: 'Age must be at most 100' }).optional()
  ),
  gender: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialty: z.string().optional(),
  experience: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional()
});

export type FormValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;

export const wholesalerSignUpSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  licenseNumber: z.string().min(3, { message: 'License number is required' }),
  businessType: z.string().min(1, { message: 'Business type is required' }),
  companySize: z.string().min(1, { message: 'Company size is required' }),
  yearEstablished: z.string().min(1, { message: 'Year established is required' }),
  about: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type WholesalerFormValues = z.infer<typeof wholesalerSignUpSchema>;
