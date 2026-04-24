"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ProjectCard } from "@/components/project-card";
import { CategoryFilter } from "@/components/tag-filter";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories, type Project } from "@/data/projects";

const PAGE_SIZE = 6;

export default function Home() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setAllProjects(data))
      .finally(() => setInitialLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return allProjects
      .filter((p) => p.published)
      .filter((p) => {
        const matchesSearch =
          search === "" ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          selectedCategory === null || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
  }, [allProjects, search, selectedCategory]);

  // 필터 변경 시 보이는 개수 초기화
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, selectedCategory]);

  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    // 약간의 딜레이로 자연스러운 로딩 느낌
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
      setLoading(false);
    }, 300);
  }, [hasMore, loading, filtered.length]);

  // Intersection Observer로 무한스크롤
  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex items-start justify-between gap-4 sm:mb-10">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            hae.company Lab
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2 sm:text-base">
            쓸데없지만 진지하게, AI와 만든 실험들
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="프로젝트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="mt-3 sm:mt-4 overflow-x-auto scrollbar-hide">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <Separator className="my-5 sm:my-6" />

      {initialLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          검색 결과가 없습니다.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {hasMore && (
            <div
              ref={observerRef}
              className="flex justify-center py-8"
            >
              {loading && (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              )}
            </div>
          )}

          {!hasMore && filtered.length > PAGE_SIZE && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              모든 프로젝트를 불러왔습니다
            </p>
          )}
        </>
      )}

      <footer className="mt-12 pb-6 text-center text-sm text-muted-foreground sm:mt-16">
        Built with vibe coding
      </footer>
    </div>
  );
}
