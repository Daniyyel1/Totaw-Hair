import { dbConnect } from "@/app/lib/mongo";
import OrderModel from "@/app/model/order-model";
import CartModel from "@/app/model/cart-model";
import { NextResponse } from "next/server";
import axios from "axios";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ success: false, message: "No reference provided" }, { status: 400 });
  }

  await dbConnect();

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    if (response.data.data.status === "success") {
      const order = await OrderModel.findOneAndUpdate(
        { paystackReference: reference },
        { status: "paid" },
        { new: true }
      );

      if (order) {
        await CartModel.findOneAndUpdate(
          { userId: order.userId },
          { $set: { items: [] } }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};