import mongoose, { Schema } from "mongoose";

interface CartItem {
  oil: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

interface ICart extends Document {
  userId: string;
  items: CartItem[];
  createdAt: Date;
}

const CartItemSchema = new Schema<CartItem>({
  oil: { type: mongoose.Schema.Types.ObjectId, ref: "Oil", required: true },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema<ICart>({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
