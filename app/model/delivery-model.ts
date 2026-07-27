import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryDetails extends Document {
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryDetailsSchema = new Schema<IDeliveryDetails>(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.DeliveryDetails ||
  mongoose.model<IDeliveryDetails>("DeliveryDetails", DeliveryDetailsSchema);