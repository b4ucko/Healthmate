
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId | IUser['_id'];
  doctor?: mongoose.Types.ObjectId | IUser['_id'];
  recordDate: Date;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User' },
    recordDate: { type: Date, required: true },
    diagnosis: { type: String },
    prescription: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.MedicalRecord || mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
