import { dbConnect } from "@/app/lib/mongo";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import cartModel from "@/app/model/cart-model";




interface CartItem {
  oil: string; // or Types.ObjectId if you're using mongoose types directly
  quantity: number;
  price: number;
  // add any other fields your cart item actually has
}



// GET — fetch cart for logged in user
export const GET = async () => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await dbConnect();

  const cart = await cartModel.findOne({ userId: session.user?.id }).populate(
    "items.oil",
  );

  return NextResponse.json({ success: true, data: cart }, { status: 200 });
};

// POST — add item to cart
export const POST = async (request: Request) => {
  const session = await auth();


  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
   
  }
    
  await dbConnect();

  const { oilId, quantity } = await request.json();

  let cart = await cartModel.findOne({ userId: session.user?.id });

  if (!cart) {
    // create a new cart if user doesn't have one
    cart = await cartModel.create({
      userId: session.user?.id,
      items: [{ oil: oilId, quantity }],
    });
  } else {
    // check if book already in cart
    const existingItem = cart.items.find(
      (item: CartItem) => String(item.oil) === oilId,
    );

    if (existingItem) {
      existingItem.quantity += quantity; // increment quantity
    } else {
      cart.items.push({ oil: oilId, quantity }); // add new item
    }

    await cart.save();
  }

  return NextResponse.json({ success: true, data: cart }, { status: 201 });
};
