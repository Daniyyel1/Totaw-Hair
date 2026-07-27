import { dbConnect } from "@/app/lib/mongo";
import OrderModel from "@/app/model/order-model";
import CartModel from "@/app/model/cart-model";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (request: Request) => {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  // verify the webhook is genuinely from Paystack
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  const expected = Buffer.from(hash);
  const received = Buffer.from(signature);

  // timingSafeEqual throws if buffer lengths differ, so guard first
  const isValid =
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received);

  if (!isValid) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  await dbConnect();

  try {
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      // mark order as paid (idempotent: safe even if called more than once
      // for the same reference, e.g. on Paystack retry)
      const order = await OrderModel.findOneAndUpdate(
        { paystackReference: reference, status: { $ne: "paid" } },
        { status: "paid" },
        { new: true }
      );

      // clear the user's cart only when this call actually transitioned
      // the order to paid, so a retry doesn't re-clear an already-emptied cart
      if (order) {
        await CartModel.findOneAndUpdate(
          { userId: order.userId },
          { $set: { items: [] } }
        );
      }
    }

    // acknowledge receipt regardless of whether the event type was handled,
    // so Paystack doesn't keep retrying events you don't care about
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Paystack webhook processing error:", err);
    // return 200 anyway if you'd rather not have Paystack retry on your
    // own bugs — otherwise 500 triggers their retry schedule
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
};