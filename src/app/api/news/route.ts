import { NextResponse } from "next/server";
import { getNews } from "@/services/newsService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const news = await getNews();

    const response = NextResponse.json({
      success: true,
      count: news.length,
      data: news,
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        count: 0,
        data: [],
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
