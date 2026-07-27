// app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";

import verifyTokenModel from "@/app/model/verify-token-model";
import usersModel from "@/app/model/users-model";
import { dbConnect } from "@/app/lib/mongo";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await dbConnect();

    const verifyToken = await verifyTokenModel.findOne({ token });

    if (!verifyToken || verifyToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 },
      );
    }

    await usersModel.findOneAndUpdate(
      { email: verifyToken.email },
      { emailVerified: new Date() },
    );

    await verifyTokenModel.deleteOne({ token });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
