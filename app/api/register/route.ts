import { dbConnect } from "@/app/lib/mongo";
import verifyTokenModel from "@/app/model/verify-token-model";
import { CreateUser } from "@/app/queries/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

interface userInput {
  name: string;
  email: string;
  password: string;
}

function getDuplicateKeyField(e: unknown): string | null {
  if (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: unknown }).code === 11000
  ) {
    const message =
      e instanceof Error
        ? e.message
        : String((e as { message?: unknown }).message ?? "");
    const match = message.match(/index:\s*(\w+?)_\d*\s*dup key/);
    if (match) return match[1];

    // fallback: try dup key object directly from message
    const dupKeyMatch = message.match(/dup key:\s*\{\s*(\w+):/);
    if (dupKeyMatch) return dupKeyMatch[1];
  }
  return null;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: Request) => {
  const { name, email, password } = (await request.json()) as userInput;

  await dbConnect();

  const harshedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    password: harshedPassword,
    emailVerified: null,
  };

  // create verification token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  await verifyTokenModel.create({ email, token, expires });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Totaw <noreply@totaw.com.ng>",
    to: email,
    subject: "Verify your Totaw account",
    html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #FFC0CB;">Welcome to Totaw, ${name}!</h2>
          <p>Please confirm your email address to activate your account.</p>
          <a href="${verifyUrl}" style="display:inline-block;background:#FFC0CB;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">
            Verify Email
          </a>
          <p style="color:#888;font-size:12px;margin-top:20px;">
            This link expires in 24 hours.
          </p>
        </div>
      `,
  });

  try {
    await CreateUser(newUser);
  } catch (e) {
    const duplicateField = getDuplicateKeyField(e);
    if (duplicateField === "email") {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }

    if (duplicateField === "name") {
      return NextResponse.json(
        { message: "This name is already taken" },
        { status: 409 },
      );
    }

    const message = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "User created successfully" },
    { status: 201 },
  );
};
