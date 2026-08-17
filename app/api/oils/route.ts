// import { dbConnect } from "@/app/lib/mongo";
// import oilsModel from "@/app/model/oils-model";
// import { NextResponse } from "next/server";

// export const GET = async () => {
//   await dbConnect();

//   try {
//     const oils = await oilsModel.find({});
//     if (!oils) {
//       return NextResponse.json({ success: false }, { status: 401 });
//     }
//     return NextResponse.json(
//       { message: "Oil fetched", success: true, data:oils },
//       { status: 201 },
//     );
//   } catch (e) {
//     const message = e instanceof Error ? e.message : "Internal Server Error";
//     return new NextResponse(message, {
//       status: 500,
//     });
//   }
// };


import { dbConnect } from "@/app/lib/mongo";
import oilsModel from "@/app/model/oils-model";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "4", 10));
    const search = searchParams.get("search")?.trim() || "";

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const [oils, total] = await Promise.all([
      oilsModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit),
      oilsModel.countDocuments(query),
    ]);

    if (!oils) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "Oil fetched",
        success: true,
        data: oils,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
      { status: 201 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return new NextResponse(message, {
      status: 500,
    });
  }
};