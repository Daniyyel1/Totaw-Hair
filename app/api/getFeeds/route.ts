import { dbConnect } from "@/app/lib/mongo";
import feedsModel from "@/app/model/feeds-model";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();

    const feeds = await feedsModel.find({}).sort({ _id: -1 });

    return NextResponse.json({ success: true, data: feeds }, { status: 201 });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return new NextResponse(message, { status: 500 });
  }
}