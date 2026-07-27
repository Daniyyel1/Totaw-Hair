import { dbConnect } from "@/app/lib/mongo";
import oilsModel from "@/app/model/oils-model";
import { NextResponse } from "next/server";

interface Benefit {
  label: string;
  benefit: string;
}

interface Use {
  label: string;
  usage: string;
}

interface ProductsInfo {
  name: string;
  description: string;
  itemImage: string;
  price: number;
  benefits: Benefit[];
  use: Use[];
}

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export const POST = async (request: Request) => {
  const { name, description, itemImage, price, benefits, use } =
    (await request.json()) as ProductsInfo;

  if (itemImage) {
    if (!itemImage.startsWith("data:image/")) {
      return NextResponse.json(
        { message: "Invalid image format" },
        { status: 400 },
      );
    }

    // base64 string length roughly approximates byte size (~4/3 ratio)
    const approxBytes = itemImage.length * 0.75;
    if (approxBytes > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Image is too large" },
        { status: 400 },
      );
    }
  }

  try {
    await dbConnect();
    const addProduct = await oilsModel.insertOne({
      name,
      description,
      itemImage,
      price,
      benefits,
      use,
    });

    if (!addProduct) {
      return NextResponse.json(
        { message: "failed to upload item", success: false },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Item uploaded", success: true, data: addProduct },
      { status: 201 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return new NextResponse(message, {
      status: 500,
    });
  }
};
