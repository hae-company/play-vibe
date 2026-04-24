import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

// 여러 프로젝트의 좋아요 수를 한 번에 조회
export async function POST(req: NextRequest) {
  const { ids } = (await req.json()) as { ids: string[] };

  const pipeline = redis.pipeline();
  ids.forEach((id) => pipeline.get(`likes:${id}`));
  const results = await pipeline.exec();

  const counts: Record<string, number> = {};
  ids.forEach((id, i) => {
    counts[id] = (results[i] as number) ?? 0;
  });

  return NextResponse.json(counts);
}
