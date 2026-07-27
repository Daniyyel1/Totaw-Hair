// import { auth } from "@/app/auth"
// import { dbConnect } from "@/app/lib/mongo";
// import orderModel from "@/app/model/order-model";
// import { NextResponse } from "next/server";


// export const GET = async()=>{

//  const session = await auth();

 
//     if(!session){
//         return NextResponse.json({success:false, message:'unathorized'}, {status:500});
//     }

//     await dbConnect();

//     const orders = await orderModel.find({userId: session?.user.id}).populate("items.oil",);

//     return NextResponse.json({success:true, data:orders}, {status:200})
 

// }

// app/api/orders/route.ts
import { dbConnect } from "@/app/lib/mongo";
import OrderModel from "@/app/model/order-model";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const orders = await OrderModel.find({ status: "paid" })
    .populate("items.oil")
    .sort({ createdAt: -1 });

  return NextResponse.json({ data: orders }, { status: 200 });
}