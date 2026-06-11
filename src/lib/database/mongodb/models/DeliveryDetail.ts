
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IDeliveryDetail extends Document {
  user: mongoose.Types.ObjectId | IUser['_id'];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  deliveryInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryDetailSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryInstructions: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.DeliveryDetail || mongoose.model<IDeliveryDetail>('DeliveryDetail', DeliveryDetailSchema);
