import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash2, Tv, Film, Sparkles, BookOpen } from "lucide-react";
import { useCatalog, deleteTitle } from "@/lib/catalog-store";
import type { Title } from "@/lib/catalog";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

const kindIcon = (k: Title["kind"]) =>
  k === "series" ? Tv : k === "anime" ? Sparkles : k === "documentary" ? BookOpen : Film;

function AdminIndex() {
  const catalog = useCatalog();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5">
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Kind</div>
        <div className="col-span-1">Year</div>
        <div className="col-span-2">Servers / Subs</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {catalog.length === 0 && (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground">
          No titles yet. Click <span className="text-foreground">New title</span> to add one.
        </div>
      )}
      {catalog.map((t) => {
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
  );
}
