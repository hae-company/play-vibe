"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Status = "checking" | "up" | "down";

export function HealthBadge({ url }: { url: string }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    fetch(`/api/health?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status === "up" ? "up" : "down"))
      .catch(() => setStatus("down"));
  }, [url]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
        status === "checking" && "bg-muted text-muted-foreground",
        status === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        status === "down" && "bg-red-500/10 text-red-600 dark:text-red-400"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "checking" && "animate-pulse bg-muted-foreground",
          status === "up" && "bg-emerald-500",
          status === "down" && "bg-red-500"
        )}
      />
      {status === "checking" ? "확인 중" : status === "up" ? "정상" : "장애"}
    </span>
  );
}
