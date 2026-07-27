import { dbConnect } from "@/app/lib/mongo";
import OrderModel from "@/app/model/order-model";
import CartModel from "@/app/model/cart-model";
import { NextResponse } from "next/server";
import axios from "axios";

// how long an order can sit "pending" before we bother checking on it —
// gives the webhook/redirect a fair chance to land first
const STALE_THRESHOLD_MINUTES = 20;

export const GET = async (request: Request) => {
  // protect this route so randoms on the internet can't trigger it —
  // Vercel Cron sends this header automatically; for manual/other triggers,
  // set CRON_SECRET in your env and check it here too
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const staleTime = new Date(Date.now() - STALE_THRESHOLD_MINUTES * 60 * 1000);

  const staleOrders = await OrderModel.find({
    status: "pending",
    createdAt: { $lte: staleTime },
  });

  const results = {
    checked: staleOrders.length,
    markedPaid: 0,
    markedFailed: 0,
    errors: 0,
  };

  for (const order of staleOrders) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${order.paystackReference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const paystackStatus = response.data.data.status;

      if (paystackStatus === "success") {
        // paystack confirms this was actually paid — the webhook or redirect
        // must have failed to reach us, so reconcile it now
        order.status = "paid";
        await order.save();

        await CartModel.findOneAndUpdate(
          { userId: order.userId },
          { $set: { items: [] } }
        );

        results.markedPaid += 1;
      } else if (
        paystackStatus === "failed" ||
        paystackStatus === "abandoned"
      ) {
        // paystack confirms the customer was never successfully charged —
        // safe to close this order out
        order.status = "failed";
        await order.save();

        results.markedFailed += 1;
      }
      // any other status (e.g. still "pending" on Paystack's side too) —
      // leave it alone, it'll get picked up on the next run
    } catch (err) {
      console.error(
        `Reconciliation failed for order ${order._id} (ref ${order.paystackReference}):`,
        err
      );
      results.errors += 1;
    }
  }

  return NextResponse.json(results, { status: 200 });
};