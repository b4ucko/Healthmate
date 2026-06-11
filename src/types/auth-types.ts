
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  userType: z.enum(["patient", "doctor", "wholesaler"]),
});

export type UserFormData = z.infer<typeof userSchema>;

export const wholesalerSchema = userSchema.extend({
  userType: z.literal("wholesaler"),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }).optional(),
  address: z.string().min(5, { message: "Please enter your business address" }).optional(),
  licenseNumber: z.string().min(3, { message: "Please enter a valid license number" }).optional(),
  businessType: z.string().optional(),
  companySize: z.string().optional(),
  yearEstablished: z.string().optional(),
  about: z.string().optional(),
});

export type WholesalerFormData = z.infer<typeof wholesalerSchema>;
