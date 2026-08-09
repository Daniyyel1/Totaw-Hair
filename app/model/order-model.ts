// app/model/order-model.ts
import mongoose, { Document, Schema } from "mongoose";

interface OrderItem {
  oil: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

interface IOrder extends Document {
  userId: string;
  items: OrderItem[];
  total: number;
  paystackReference: string;
  status: "pending" | "paid" | "failed";
  deliveryDetails?: DeliveryDetails;
  createdAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  oil: { type: mongoose.Schema.Types.ObjectId, ref: "Oil", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const DeliveryDetailsSchema = new Schema<DeliveryDetails>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  paystackReference: { type: String, required: true },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  deliveryDetails: { type: DeliveryDetailsSchema },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);