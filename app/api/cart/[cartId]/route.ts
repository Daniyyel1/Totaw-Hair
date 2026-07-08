import { dbConnect } from "@/app/lib/mongo";
import CartModel from "@/app/model/cart-model";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ cartId: string }>;
}

export const DELETE = async (request: Request, { params }: Params) => {
  const { cartId } = await params;
  const session = await auth();

  if (!session) {

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  const cart = await CartModel.findOneAndUpdate(
    { userId: session.user?.id },
    { $pull: { items: { _id: cartId } } },
    { new: true }
  );

  return NextResponse.json({ success: true, data: cart }, { status: 200 });
};

export const PATCH = async (request: Request, { params }: Params) => {
  const { cartId } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  const { quantity } = await request.json();

  const cart = await CartModel.findOneAndUpdate(
    { userId: session.user?.id, "items._id": cartId },
    { $set: { "items.$.quantity": quantity } },
    { new: true }
  );

  return NextResponse.json({ success: true, data: cart }, { status: 200 });
};

