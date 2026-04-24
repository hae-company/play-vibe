import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ status: "error", message: "url required" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    return NextResponse.json({
      status: res.ok ? "up" : "down",
      statusCode: res.status,
    });
  } catch {
    return NextResponse.json({ status: "down", statusCode: 0 });
  }
}
