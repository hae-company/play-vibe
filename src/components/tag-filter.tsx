"use client";

import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  categories: readonly string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      <Badge
        variant={selected === null ? "default" : "outline"}
        className="shrink-0 cursor-pointer"
        onClick={() => onSelect(null)}
      >
        전체
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat}
          variant={selected === cat ? "default" : "outline"}
          className="shrink-0 cursor-pointer"
          onClick={() => onSelect(selected === cat ? null : cat)}
        >
          {cat}
        </Badge>
      ))}
    </div>
  );
}
