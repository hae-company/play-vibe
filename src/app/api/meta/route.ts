import { NextRequest, NextResponse } from "next/server";

// URL에서 메타 정보 자동 수집
export async function POST(req: NextRequest) {
  const { url } = await req.json();

  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`
    );
    const data = await res.json();

    return NextResponse.json({
      title: data.data?.title ?? "",
      description: data.data?.description ?? "",
      image: data.data?.image?.url ?? "",
    });
  } catch {
    return NextResponse.json({ title: "", description: "", image: "" });
  }
}
