import { dbConnect } from "@/app/lib/mongo";
import oilsModel from "@/app/model/oils-model";
import { NextResponse } from "next/server";

interface RequestBody {
  reviewer: string;
  comment: string;
  rating: number;
}

interface Params {
  params: Promise<{ id: string }>;
}

export const POST = async (request: Request, { params }: Params) => {
  const { id } = await params;

  const { reviewer, comment, rating } = (await request.json()) as RequestBody;

  await dbConnect();

  try {
    const addReview = await oilsModel.findByIdAndUpdate(
      id,
      { $push: { reviews: { reviewer, comment, rating } } },
      { new: true },
    );

    if (!addReview) {
      return NextResponse.json(
        { success: false, message: "cannot add a review" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: addReview },
      { status: 201 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return new NextResponse(message, {
      status: 500,
    });
  }
};
