import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { TitleCard } from "@/components/title-card";
import { catalog, allGenres } from "@/lib/catalog";

const searchSchema = z.object({
  q: z.string().optional(),
  genre: z.string().optional(),
  kind: z.enum(["movie", "series", "anime", "documentary"]).optional(),
  year: z.coerce.number().optional(),
});

export const Route = createFileRoute("/browse")({
  validateSearch: searchSchema,
  component: Browse,
  head: () => ({
    meta: [
      { title: "Browse — ThunderStream" },
      { name: "description", content: "Discover movies, series, anime and documentaries on ThunderStream." },
    ],
  }),
});

function Browse() {
  const { q, genre, kind, year } = Route.useSearch();
  const navigate = Route.useNavigate();

  const results = useMemo(() => {
    const s = (q ?? "").trim().toLowerCase();
    return catalog.filter((t) => {
      if (s && !(t.title.toLowerCase().includes(s) || t.synopsis.toLowerCase().includes(s) || t.genres.some(g => g.toLowerCase().includes(s)))) return false;
      if (genre && !t.genres.includes(genre)) return false;
      if (kind && t.kind !== kind) return false;
      if (year && t.year !== year) return false;
      return true;
    });
  }, [q, genre, kind, year]);

  const update = (patch: Record<string, unknown>) =>
    navigate({ search: (old: Record<string, unknown>) => ({ ...old, ...patch }) as never });

  const years = Array.from(new Set(catalog.map((t) => t.year))).sort((a, b) => b - a);

  return (
    <div className="px-4 md:px-8 py-10">
      <div className="bg-gradient-hero absolute top-0 inset-x-0 h-80 -z-10" />
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
        Discover
      </h1>
      <p className="mt-2 text-muted-foreground">
        {results.length} title{results.length === 1 ? "" : "s"}{q ? ` matching "${q}"` : ""}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip active={!kind} onClick={() => update({ kind: undefined })}>All</FilterChip>
        {(["movie", "series", "anime", "documentary"] as const).map((k) => (
          <FilterChip key={k} active={kind === k} onClick={() => update({ kind: kind === k ? undefined : k })}>
            {k[0].toUpperCase() + k.slice(1)}
          </FilterChip>
        ))}
        <div className="w-px h-6 bg-white/10 mx-2 self-center" />
        <select
          value={genre ?? ""}
          onChange={(e) => update({ genre: e.target.value || undefined })}
          className="h-8 rounded-full bg-white/5 border border-white/10 px-3 text-xs"
        >
          <option value="">All genres</option>
          {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={year ?? ""}
          onChange={(e) => update({ year: e.target.value ? Number(e.target.value) : undefined })}
          className="h-8 rounded-full bg-white/5 border border-white/10 px-3 text-xs"
        >
          <option value="">All years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
        {results.map((t) => (
          <div key={t.id} className="w-full">
            <TitleCard title={t} />
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-20 text-center text-muted-foreground">
          No titles match your filters. Try clearing one.
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-full text-xs border transition ${
        active
          ? "bg-gradient-brand border-transparent text-white shadow-glow"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
