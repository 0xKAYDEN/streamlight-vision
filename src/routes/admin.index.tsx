import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Pencil, Trash2, Tv, Film, Sparkles, BookOpen, Search, Server, Subtitles, Database, Star,
} from "lucide-react";
import { useCatalog, deleteTitle } from "@/lib/catalog-store";
import type { Title } from "@/lib/catalog";
import { ActivityHeatmap } from "@/components/admin/activity-heatmap";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

const kindIcon = (k: Title["kind"]) =>
  k === "series" ? Tv : k === "anime" ? Sparkles : k === "documentary" ? BookOpen : Film;

function AdminIndex() {
  const catalog = useCatalog();
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState<"" | Title["kind"]>("");

  const stats = useMemo(() => {
    const servers = catalog.reduce((n, t) => n + t.servers.length + (t.episodes?.reduce((m, e) => m + (e.servers?.length ?? 0), 0) ?? 0), 0);
    const subs = catalog.reduce((n, t) => n + (t.subtitles?.length ?? 0) + (t.episodes?.reduce((m, e) => m + (e.subtitles?.length ?? 0), 0) ?? 0), 0);
    const episodes = catalog.reduce((n, t) => n + (t.episodes?.length ?? 0), 0);
    const avg = catalog.length ? catalog.reduce((n, t) => n + t.rating, 0) / catalog.length : 0;
    const byKind = catalog.reduce<Record<string, number>>((acc, t) => {
      acc[t.kind] = (acc[t.kind] ?? 0) + 1;
      return acc;
    }, {});
    return { servers, subs, episodes, avg, byKind };
  }, [catalog]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return catalog.filter((t) => {
      if (kindFilter && t.kind !== kindFilter) return false;
      if (!s) return true;
      return (
        t.title.toLowerCase().includes(s) ||
        t.tagline.toLowerCase().includes(s) ||
        t.genres.some((g) => g.toLowerCase().includes(s))
      );
    });
  }, [catalog, q, kindFilter]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Database} label="Titles" value={catalog.length} sub={`${stats.episodes} episodes`} />
        <StatCard icon={Server} label="Streaming servers" value={stats.servers} sub="HLS + MP4" />
        <StatCard icon={Subtitles} label="Subtitle tracks" value={stats.subs} sub="Across catalog" />
        <StatCard icon={Star} label="Avg rating" value={stats.avg.toFixed(1)} sub="Editorial mean" />
      </div>

      {/* Activity */}
      <ActivityHeatmap titles={catalog} />

      {/* Kind breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["movie", "series", "anime", "documentary"] as const).map((k) => {
          const Icon = kindIcon(k);
          return (
            <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-3">
              <div className="size-10 rounded-md bg-gradient-brand/20 grid place-items-center text-brand">
                <Icon className="size-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{k}</div>
                <div className="text-xl font-semibold tabular-nums">{stats.byKind[k] ?? 0}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Title list */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/5">
          <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Catalog</h3>
          <div className="relative ml-auto w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles, genres…"
              className="h-8 w-full pl-8 pr-3 rounded-md bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-brand/60 transition"
            />
          </div>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as "" | Title["kind"])}
            className="h-8 rounded-md bg-white/5 border border-white/10 px-2 text-xs"
          >
            <option value="">All kinds</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
            <option value="anime">Anime</option>
            <option value="documentary">Docs</option>
          </select>
        </div>

        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Kind</div>
          <div className="col-span-1">Year</div>
          <div className="col-span-2">Servers / Subs</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No titles match. Adjust filters or click <span className="text-foreground">New title</span>.
          </div>
        )}
        {filtered.map((t) => {
          const Icon = kindIcon(t.kind);
          return (
            <div
              key={t.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition"
            >
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div
                  className="size-10 rounded-md shrink-0"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.55 0.2 ${t.hue}), oklch(0.45 0.18 ${t.hue2}))`,
                  }}
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.tagline}</div>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-sm capitalize text-muted-foreground">
                <Icon className="size-3.5" /> {t.kind}
              </div>
              <div className="col-span-1 text-sm text-muted-foreground">{t.year}</div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {t.servers.length} servers · {(t.subtitles?.length ?? 0)} subs
                {t.episodes?.length ? ` · ${t.episodes.length} ep` : ""}
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Link
                  to="/admin/titles/$id"
                  params={{ id: t.id }}
                  className="inline-flex items-center gap-1.5 rounded-md glass px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
                >
                  <Pencil className="size-3.5" /> Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${t.title}"?`)) deleteTitle(t.id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 text-red-300 px-2.5 py-1.5 text-xs hover:bg-red-500/20 transition"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="size-3.5 text-brand" /> {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
