import { auth } from "@/app/auth";
import { dbConnect } from "@/app/lib/mongo";
import usersModel from "@/app/model/users-model";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    
  await dbConnect();
    const getUser = await usersModel.findById(session.user.id).select("-password").lean();
    if (!getUser) {
      return NextResponse.json(
        { success: false, message: "Unathorized" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Accessed", success: true, data: getUser },
      { status: 201 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return new NextResponse(message, {
      status: 500,
    });
  }
};
