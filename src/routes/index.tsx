import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Hero } from "@/components/hero";
import { TitleRow } from "@/components/title-row";
import { useCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const catalog = useCatalog();
  const featured = useMemo(() => catalog.filter((t) => t.featured), [catalog]);
  const trending = useMemo(() => catalog.filter((t) => t.trending), [catalog]);
  const byKind = (k: string) => catalog.filter((t) => t.kind === k);
  const byGenre = (g: string) => catalog.filter((t) => t.genres.includes(g));

  return (
    <div className="relative">
      <Hero titles={featured.length ? featured : catalog.slice(0, 3)} />
      <div className="relative -mt-16 z-10 space-y-10 pb-10">
        <TitleRow heading="Trending now" titles={trending} />
        <TitleRow heading="Top picks for you" titles={[...catalog].sort((a, b) => b.rating - a.rating).slice(0, 8)} />
        <TitleRow heading="Series" titles={byKind("series")} />
        <TitleRow heading="Movies" titles={byKind("movie")} />
        <TitleRow heading="Anime" titles={byKind("anime")} />
        <TitleRow heading="Documentaries" titles={byKind("documentary")} />
        <TitleRow heading="Sci-Fi worlds" titles={byGenre("Sci-Fi")} />
      </div>
    </div>
  );
}
