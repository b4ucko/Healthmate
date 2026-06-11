
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId | IUser['_id'];
  doctor: mongoose.Types.ObjectId | IUser['_id'];
  appointmentDate: Date;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'approved';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['scheduled', 'completed', 'cancelled', 'pending', 'approved'],
      default: 'scheduled'
    },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
