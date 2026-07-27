
// import { dbConnect } from "@/app/lib/mongo";
// import CartModel from "@/app/model/cart-model";
// import OrderModel from "@/app/model/order-model";
// import { auth } from "@/app/auth";
// import { NextResponse } from "next/server";
// import axios from "axios";

// interface PopulatedOil {
//   _id: string;
//   price: number;
// }

// interface CartItem {
//   oil: PopulatedOil;
//   quantity: number;
// }

// export const POST = async () => {
//   const session = await auth();

//   if (!session) {
//     return NextResponse.json(
//       { success: false, message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   await dbConnect();

//   const cart = await CartModel.findOne({ userId: session.user?.id }).populate(
//     "items.oil"
//   );

//   if (!cart || cart.items.length === 0) {
//     return NextResponse.json(
//       { success: false, message: "Cart is empty" },
//       { status: 400 }
//     );
//   }

//   const total = cart.items.reduce(
//     (sum: number, item: CartItem) => sum + item.oil.price * item.quantity,
//     0
//   );

//   try {
//     // initialize Paystack transaction
//     const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         email: session.user?.email,
//         amount: Math.round(total * 100), // Paystack uses kobo (cents)
//         currency: "NGN", // change to "USD" if your Paystack account supports it
//         callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
//         metadata: {
//           userId: session.user?.id,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { reference, authorization_url } = response.data.data;

//     // create a pending order in MongoDB
//     await OrderModel.create({
//       userId: session.user?.id,
//       items: cart.items.map((item: CartItem) => ({
//         oil: item.oil._id,
//         quantity: item.quantity,
//         price: item.oil.price,
//       })),
//       total,
//       paystackReference: reference,
//       status: "pending",
//     });

//     return NextResponse.json(
//       { success: true, url: authorization_url },
//       { status: 200 }
//     );
//   } catch (e: unknown) {
//     const isAxiosError = axios.isAxiosError(e);
//     const errorDetails = isAxiosError ? e.response?.data : undefined;
//     const errorMessage = e instanceof Error ? e.message : "Unknown error";

//     console.error("Paystack error:", errorDetails || errorMessage);
//     console.error("Full error:", e);

//     return NextResponse.json(
//       { success: false, message: "Failed to initialize payment" },
//       { status: 500 }
//     );
//   }
// };

import { dbConnect } from "@/app/lib/mongo";
import CartModel from "@/app/model/cart-model";
import OrderModel from "@/app/model/order-model";
import DeliveryModel from "@/app/model/delivery-model";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";
import axios from "axios";

interface PopulatedOil {
  _id: string;
  price: number;
}

interface CartItem {
  oil: PopulatedOil;
  quantity: number;
}

export const POST = async () => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  const cart = await CartModel.findOne({ userId: session.user?.id }).populate(
    "items.oil"
  );

  if (!cart || cart.items.length === 0) {
    return NextResponse.json(
      { success: false, message: "Cart is empty" },
      { status: 400 }
    );
  }

  const deliveryDetails = await DeliveryModel.findOne({
    userId: session.user?.id,
  });

  if (!deliveryDetails) {
    return NextResponse.json(
      {
        success: false,
        message: "Please add your delivery details before checking out",
      },
      { status: 400 }
    );
  }

  const total = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.oil.price * item.quantity,
    0
  );

  try {
    // initialize Paystack transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: session.user?.email,
        amount: Math.round(total * 100), // Paystack uses kobo (cents)
        currency: "NGN", // change to "USD" if your Paystack account supports it
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        metadata: {
          userId: session.user?.id,
          deliveryDetails: {
            fullName: deliveryDetails.fullName,
            phone: deliveryDetails.phone,
            address: deliveryDetails.address,
            city: deliveryDetails.city,
            state: deliveryDetails.state,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { reference, authorization_url } = response.data.data;

    // create a pending order in MongoDB
    await OrderModel.create({
      userId: session.user?.id,
      items: cart.items.map((item: CartItem) => ({
        oil: item.oil._id,
        quantity: item.quantity,
        price: item.oil.price,
      })),
      total,
      paystackReference: reference,
      status: "pending",
      deliveryDetails: {
        fullName: deliveryDetails.fullName,
        phone: deliveryDetails.phone,
        address: deliveryDetails.address,
        city: deliveryDetails.city,
        state: deliveryDetails.state,
      },
    });

    return NextResponse.json(
      { success: true, url: authorization_url },
      { status: 200 }
    );
  } catch (e: unknown) {
    const isAxiosError = axios.isAxiosError(e);
    const errorDetails = isAxiosError ? e.response?.data : undefined;
    const errorMessage = e instanceof Error ? e.message : "Unknown error";

    console.error("Paystack error:", errorDetails || errorMessage);
    console.error("Full error:", e);

    return NextResponse.json(
      { success: false, message: "Failed to initialize payment" },
      { status: 500 }
    );
  }
};