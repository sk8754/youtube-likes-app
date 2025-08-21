import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.livestreaming.findMany();
    // BigIntを文字列に変換
    const serializedData = data.map((item) => ({
      ...item,
      id: item.id.toString(),
      watchers: item.watchers?.toString(),
    }));
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
