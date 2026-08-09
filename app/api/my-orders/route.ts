// app/api/my-orders/route.ts
import { dbConnect } from "@/app/lib/mongo";
import OrderModel from "@/app/model/order-model";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const orders = await OrderModel.find({
    userId: session.user?.id,
    status: "paid",
  })
    .populate("items.oil")
    .sort({ createdAt: -1 });

  return NextResponse.json({ data: orders }, { status: 200 });
}