import { NextResponse } from "next/server";
import { newsData } from "@/data/news";

export async function GET() {
  const response = NextResponse.json({
    success: true,
    count: newsData.length,
    data: newsData,
  });

  response.headers.set(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  return response;
}
