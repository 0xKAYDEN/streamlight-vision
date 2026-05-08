import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Play, Plus, Star, Share2 } from "lucide-react";
import { PosterArt } from "@/components/poster-art";
import { TitleRow } from "@/components/title-row";
import { catalog, getTitle } from "@/lib/catalog";

export const Route = createFileRoute("/titles/$id")({
  loader: ({ params }) => {
    const title = getTitle(params.id);
    if (!title) throw notFound();
    return { title };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title.title} — ThunderStream` },
          { name: "description", content: loaderData.title.synopsis },
          { property: "og:title", content: loaderData.title.title },
          { property: "og:description", content: loaderData.title.tagline },
        ]
      : [],
  }),
  component: TitlePage,
  notFoundComponent: () => (
    <div className="px-8 py-20 text-center">
      <h1 className="text-3xl font-semibold">Title not found</h1>
      <Link to="/browse" className="mt-4 inline-block text-brand hover:underline">
        Browse the catalog
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-8 py-20 text-center text-muted-foreground">{error.message}</div>
  ),
});

function TitlePage() {
  const { title } = Route.useLoaderData();
  const similar = catalog.filter(
    (t) => t.id !== title.id && t.genres.some((g) => title.genres.includes(g))
  ).slice(0, 8);

  return (
    <div>
      {/* Hero backdrop */}
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
        <PosterArt title={title} variant="backdrop" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

        <div className="relative h-full flex items-end px-4 md:px-8 pb-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {title.kind} · {title.year} · {title.runtime}
            </div>
            <h1 className="mt-3 text-5xl md:text-7xl font-semibold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
              {title.title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground italic">{title.tagline}</p>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-brand text-brand" /> {title.rating.toFixed(1)}
              </span>
              <div className="flex flex-wrap gap-2">
                {title.genres.map((g: string) => (
                  <span key={g} className="rounded-full glass px-2.5 py-0.5 text-[11px]">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base text-muted-foreground">
              {title.synopsis}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <Link
                to="/watch/$id"
                params={{ id: title.id }}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-6 py-3 text-sm font-medium text-white shadow-glow hover:opacity-95 transition"
              >
                <Play className="size-4 fill-current" /> Play
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md glass px-5 py-3 text-sm hover:bg-white/10 transition">
                <Plus className="size-4" /> My list
              </button>
              <button className="size-11 grid place-items-center rounded-md glass hover:bg-white/10 transition">
                <Share2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Servers + cast */}
      <section className="px-4 md:px-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Streaming servers</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {title.servers.map((s, i) => (
                <Link
                  key={i}
                  to="/watch/$id"
                  params={{ id: title.id }}
                  className="group rounded-lg border border-white/10 bg-white/5 hover:border-brand/60 hover:bg-white/10 transition p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.label}</div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.type}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Quality: {s.quality}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Cast</h3>
            <div className="mt-2 text-sm">{title.cast.join(", ")}</div>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Details</h3>
            <dl className="mt-2 text-sm space-y-1">
              <div className="flex justify-between"><dt className="text-muted-foreground">Year</dt><dd>{title.year}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Runtime</dt><dd>{title.runtime}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd className="capitalize">{title.kind}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Rating</dt><dd>{title.rating.toFixed(1)} / 10</dd></div>
            </dl>
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <div className="mt-14">
          <TitleRow heading="More like this" titles={similar} />
        </div>
      )}
    </div>
  );
}
