import { dbConnect } from "@/app/lib/mongo";
import usersModel from "@/app/model/users-model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await dbConnect();

    const getAllUsers = await usersModel.find({});
    if (!getAllUsers) {
      return NextResponse.json(
        { success: false, message: "something went wrong" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "users found", success: true, data: getAllUsers },
      { status: 201 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return new NextResponse(message, {
      status: 500,
    });
  }
};
