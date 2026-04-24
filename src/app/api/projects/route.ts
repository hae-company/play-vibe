import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import type { Project } from "@/data/projects";

const PROJECTS_KEY = "projects";

// 프로젝트 목록 조회
export async function GET() {
  const projects = await redis.get<Project[]>(PROJECTS_KEY);
  return NextResponse.json(projects ?? []);
}

// 프로젝트 추가
export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project: Project = await req.json();
  const projects = (await redis.get<Project[]>(PROJECTS_KEY)) ?? [];

  project.id = crypto.randomUUID();
  project.createdAt = new Date().toISOString().split("T")[0];
  projects.unshift(project);

  await redis.set(PROJECTS_KEY, projects);
  return NextResponse.json(project);
}

// 프로젝트 수정
export async function PUT(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated: Project = await req.json();
  const projects = (await redis.get<Project[]>(PROJECTS_KEY)) ?? [];
  const idx = projects.findIndex((p) => p.id === updated.id);

  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  projects[idx] = updated;
  await redis.set(PROJECTS_KEY, projects);
  return NextResponse.json(updated);
}

// 프로젝트 삭제
export async function DELETE(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const projects = (await redis.get<Project[]>(PROJECTS_KEY)) ?? [];
  const filtered = projects.filter((p) => p.id !== id);

  await redis.set(PROJECTS_KEY, filtered);
  return NextResponse.json({ ok: true });
}
