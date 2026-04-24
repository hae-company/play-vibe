import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

// 좋아요 수 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const count = (await redis.get<number>(`likes:${id}`)) ?? 0;
  return NextResponse.json({ count });
}

// 좋아요 토글
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action } = await req.json();

  let count: number;
  if (action === "unlike") {
    count = await redis.decr(`likes:${id}`);
    if (count < 0) {
      await redis.set(`likes:${id}`, 0);
      count = 0;
    }
  } else {
    count = await redis.incr(`likes:${id}`);
  }

  return NextResponse.json({ count });
}
