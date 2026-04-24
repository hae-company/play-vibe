"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  projectId: string;
  initialCount?: number;
}

export function LikeButton({ projectId, initialCount = 0 }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`liked:${projectId}`);
    if (stored === "true") setLiked(true);
  }, [projectId]);

  useEffect(() => {
    fetch(`/api/likes/${projectId}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, [projectId]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);

    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => prev + (newLiked ? 1 : -1));
    localStorage.setItem(`liked:${projectId}`, String(newLiked));

    try {
      const res = await fetch(`/api/likes/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newLiked ? "like" : "unlike" }),
      });
      const data = await res.json();
      setCount(data.count);
    } catch {
      setLiked(!newLiked);
      setCount((prev) => prev + (newLiked ? -1 : 1));
      localStorage.setItem(`liked:${projectId}`, String(!newLiked));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={cn("gap-1.5", liked && "text-red-500 hover:text-red-600")}
    >
      <Heart
        className={cn("h-4 w-4", liked && "fill-current")}
      />
      <span className="text-xs tabular-nums">{count}</span>
    </Button>
  );
}
