// import { auth } from "@/app/auth";
// import { dbConnect } from "@/app/lib/mongo";
// import usersModel from "@/app/model/users-model";
// import { NextResponse } from "next/server";

// interface UserProfile {
//   profiLePicture: string;
//   bio: string;
//   telephone: string;
// }

// export const POST = async (req: Request) => {
//   const session = await auth();

//   if (!session?.user?.id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const { profiLePicture, bio, telephone } = (await req.json()) as UserProfile;

//   if (profiLePicture && !profiLePicture.startsWith("data:image/")) {
//     return NextResponse.json(
//       { message: "Invalid image format" },
//       { status: 400 },
//     );
//   }

//   await dbConnect();

//   try {
//     const updateProfile = await usersModel.findByIdAndUpdate(
//       session.user.id,
//       { $set: { profiLePicture, telephone, bio } },
//       { new: true },
//     );
//     if (!updateProfile) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized access" },
//         { status: 401 },
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Access granted", data: updateProfile },
//       { status: 201 },
//     );
//   } catch (e) {
//     const message = e instanceof Error ? e.message : "Internal Server Error";
//     return new NextResponse(message, {
//       status: 500,
//     });
//   }
// };

import { auth } from "@/app/auth";
import { dbConnect } from "@/app/lib/mongo";
import usersModel from "@/app/model/users-model";
import { NextResponse } from "next/server";

interface UserProfile {
  profilePicture: string;
  bio: string;
  telephone: string;
  name:string,
}

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export const POST = async (req: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    console.log("session.user.id", session?.user.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as UserProfile;
console.log("raw request body:", body);

const { profilePicture, bio, telephone, name } = body;

  if (profilePicture) {
    if (!profilePicture.startsWith("data:image/")) {
      return NextResponse.json(
        { message: "Invalid image format" },
        { status: 400 },
      );
    }

    // base64 string length roughly approximates byte size (~4/3 ratio)
    const approxBytes = profilePicture.length * 0.75;
    if (approxBytes > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Image is too large" },
        { status: 400 },
      );
    }
  }

  try {
    await dbConnect();

    const updateProfile = await usersModel.findByIdAndUpdate(
      session.user.id,
      { $set: { profilePicture, telephone, bio, name } },
      { new: true, runValidators: true },
    );

      console.log("updateProfile result:", updateProfile);

    if (!updateProfile) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Profile updated", data: updateProfile },
      { status: 201 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
};
