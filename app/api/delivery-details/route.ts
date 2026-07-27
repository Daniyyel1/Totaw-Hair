import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { dbConnect } from "@/app/lib/mongo";
import DeliveryModel from "@/app/model/delivery-model";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const details = await DeliveryModel.findOne({
      userId: session.user.id,
    });

    return NextResponse.json({ data: details ?? null }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to fetch delivery details" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fullName, phone, address, city, state } = body;

    if (!fullName || !phone || !address || !city || !state) {
      return NextResponse.json(
        { message: "Please fill out all delivery fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    const details = await DeliveryModel.findOneAndUpdate(
      { userId: session.user.id },
      { userId: session.user.id, fullName, phone, address, city, state },
      { upsert: true, new: true },
    );

    return NextResponse.json({ data: details }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to save delivery details" },
      { status: 500 },
    );
  }
}