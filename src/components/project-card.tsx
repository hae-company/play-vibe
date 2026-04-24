"use client";

import { ExternalLink, Code } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AutoThumbnail } from "@/components/auto-thumbnail";
import { LikeButton } from "@/components/like-button";
import { HealthBadge } from "@/components/health-badge";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      {project.url && <AutoThumbnail url={project.url} alt={project.title} />}
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {project.category}
          </Badge>
          {project.url && <HealthBadge url={project.url} />}
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter className="mt-auto gap-2">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Demo
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Code className="mr-1.5 h-3.5 w-3.5" />
            Code
          </a>
        )}
        <span className="ml-auto flex items-center gap-1">
          <LikeButton projectId={project.id} />
        </span>
      </CardFooter>
    </Card>
  );
}
