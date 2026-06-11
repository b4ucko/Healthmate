
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IWholesaler extends Document {
  user: mongoose.Types.ObjectId | IUser['_id'];
  phone?: string;
  address?: string;
  licenseNumber?: string;
  businessType?: string;
  companySize?: string;
  yearEstablished?: string;
  about?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WholesalerSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String },
    address: { type: String },
    licenseNumber: { type: String },
    businessType: { type: String },
    companySize: { type: String },
    yearEstablished: { type: String },
    about: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Wholesaler || mongoose.model<IWholesaler>('Wholesaler', WholesalerSchema);
