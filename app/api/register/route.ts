import { dbConnect } from "@/app/lib/mongo";
import { CreateUser } from "@/app/queries/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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

export const POST = async (request: Request) => {
  const { name, email, password,  } =
    (await request.json()) as userInput;

  await dbConnect();

  const harshedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    password: harshedPassword,
  };

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
