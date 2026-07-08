import { dbConnect } from "@/app/lib/mongo";
import oilsModel from "@/app/model/oils-model";
import { NextResponse } from "next/server";

export const GET = async () => {
  await dbConnect();

  try {
    const oils = await oilsModel.find({});
    if (!oils) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Oil fetched", success: true, data:oils },
      { status: 201 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return new NextResponse(message, {
      status: 500,
    });
  }
};
