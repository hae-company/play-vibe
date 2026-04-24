"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface AutoThumbnailProps {
  url: string;
  alt: string;
}

export function AutoThumbnail({ url, alt }: AutoThumbnailProps) {
  const [error, setError] = useState(false);

  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&screenshot.width=1280&screenshot.height=720&screenshot.type=png`;

  if (error) {
    return (
      <div className="relative w-full bg-muted" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-muted" style={{ paddingBottom: "56.25%" }}>
      <img
        src={screenshotUrl}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform hover:scale-105"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
