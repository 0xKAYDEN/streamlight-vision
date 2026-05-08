import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";
import { PosterArt } from "./poster-art";
import type { Title } from "@/lib/catalog";

export function TitleCard({ title }: { title: Title }) {
  return (
    <Link
      to="/titles/$id"
      params={{ id: title.id }}
      className="group relative block w-[180px] sm:w-[220px] shrink-0"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 group-hover:border-brand/60 group-hover:shadow-glow group-hover:-translate-y-1">
        <PosterArt title={title} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] text-white/90 backdrop-blur">
          <Star className="size-2.5 fill-current text-brand" />
          {title.rating.toFixed(1)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-white shadow-glow">
            <Play className="size-3 fill-current" /> Watch
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-sm font-medium truncate">{title.title}</div>
        <div className="text-[11px] text-muted-foreground shrink-0">
          {title.year}
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground truncate">
        {title.genres.join(" · ")}
      </div>
    </Link>
  );
}
