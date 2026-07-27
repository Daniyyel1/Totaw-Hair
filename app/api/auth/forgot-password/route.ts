import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { dbConnect } from "@/app/lib/mongo";
import usersModel from "@/app/model/users-model";
import resetTokenModel from "@/app/model/reset-token-model";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await usersModel.findOne({ email });

    // Always return success even if user not found — avoids leaking which emails are registered
    if (!user) {
      return NextResponse.json({ message: "If that email exists, a reset link was sent." });
    }

    // Remove any existing tokens for this email
    await resetTokenModel.deleteMany({ email });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await resetTokenModel.create({ email, token, expires });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Totaw <noreply@totaw.com.ng>", // must be a verified domain in Resend
      to: email,
      subject: "Reset your Totaw password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #FFC0CB;">Reset your password</h2>
          <p>We received a request to reset your Totaw password. This link expires in 30 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#FFC0CB;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">
            Reset Password
          </a>
          <p style="color:#888;font-size:12px;margin-top:20px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "If that email exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}