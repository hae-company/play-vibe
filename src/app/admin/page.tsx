"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Trash2, Eye, EyeOff, Link, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories, type Project, type Category } from "@/data/projects";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 새 프로젝트 폼
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "기타" as Category,
    url: "",
    github: "",
    published: true,
  });

  const headers = {
    "Content-Type": "application/json",
    "x-admin-password": password,
  };

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ title: "__auth_check__" }),
      });
      if (res.status === 401) {
        alert("비밀번호가 틀렸습니다");
      } else {
        // 인증 체크용 더미 삭제
        const created = await res.json();
        await fetch("/api/projects", {
          method: "DELETE",
          headers,
          body: JSON.stringify({ id: created.id }),
        });
        setAuthed(true);
        fetchProjects();
      }
    } finally {
      setLoading(false);
    }
  };

  // URL에서 메타 정보 자동 가져오기
  const autoFill = async () => {
    if (!form.url) return;
    setFetching(true);
    try {
      const res = await fetch("/api/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.url }),
      });
      const meta = await res.json();
      setForm((prev) => ({
        ...prev,
        title: meta.title || prev.title,
        description: meta.description || prev.description,
      }));
    } finally {
      setFetching(false);
    }
  };

  const addProject = async () => {
    if (!form.title) return alert("제목을 입력해주세요");
    setLoading(true);
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      setForm({
        title: "",
        description: "",
        category: "기타",
        url: "",
        github: "",
        published: true,
      });
      fetchProjects();
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (project: Project) => {
    await fetch("/api/projects", {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...project, published: !project.published }),
    });
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("정말 삭제할까요?")) return;
    await fetch("/api/projects", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    });
    fetchProjects();
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>관리자 로그인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              로그인
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">프로젝트 관리</h1>
        <ThemeToggle />
      </header>

      {/* 새 프로젝트 추가 폼 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5" />
            새 프로젝트 추가
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL + 자동 채우기 */}
          <div className="space-y-2">
            <Label>URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://my-app.vercel.app"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
              <Button
                variant="outline"
                onClick={autoFill}
                disabled={fetching || !form.url}
              >
                {fetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              URL 입력 후 지팡이 버튼을 누르면 제목/설명 자동 채우기
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>제목</Label>
              <Input
                placeholder="프로젝트 이름"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>카테고리</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as Category })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea
              placeholder="한 줄 설명"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>GitHub (선택)</Label>
            <Input
              placeholder="https://github.com/..."
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={form.published}
              onCheckedChange={(v) => setForm({ ...form, published: v })}
            />
            <Label>바로 공개</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addProject} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            추가하기
          </Button>
        </CardFooter>
      </Card>

      <Separator className="my-6" />

      {/* 프로젝트 목록 */}
      <h2 className="mb-4 text-lg font-semibold">
        등록된 프로젝트 ({projects.length})
      </h2>

      <div className="space-y-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={!project.published ? "opacity-60" : ""}
          >
            <CardContent className="flex items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{project.title}</span>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {project.category}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {project.description}
                </p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Link className="h-3 w-3" />
                    {project.url}
                  </a>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => togglePublished(project)}
                  title={project.published ? "비공개로 전환" : "공개로 전환"}
                >
                  {project.published ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteProject(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            아직 등록된 프로젝트가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
