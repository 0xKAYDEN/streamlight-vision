import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Info, Star } from "lucide-react";
import { PosterArt } from "./poster-art";
import { useI18n } from "@/lib/i18n";
import type { Title } from "@/lib/catalog";

export function Hero({ titles }: { titles: Title[] }) {
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (titles.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % titles.length), 7000);
    return () => clearInterval(t);
  }, [titles.length]);

  const active = titles[idx];
  if (!active) return null;

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {titles.map((t, i) => (
        <div
          key={t.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <PosterArt title={t} variant="backdrop" className="absolute inset-0" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />

      <div className="relative h-full flex items-end">
        <div className="px-4 md:px-8 pb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
            <span className="size-1.5 rounded-full bg-brand animate-pulse" />
            {t("hero.featured")} · {active.kind}
          </div>
          <h1
            className="text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            {active.title}
          </h1>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground italic">
            {active.tagline}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground">
              <Star className="size-3.5 fill-brand text-brand" />
              {active.rating.toFixed(1)}
            </span>
            <span>{active.year}</span>
            <span>{active.runtime}</span>
            <span>{active.genres.join(" · ")}</span>
          </div>
          <p className="mt-4 text-base text-muted-foreground max-w-xl line-clamp-3">
            {active.synopsis}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              to="/watch/$id"
              params={{ id: active.id }}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-95 transition"
            >
              <Play className="size-4 fill-current" /> {t("hero.play")}
            </Link>
            <Link
              to="/titles/$id"
              params={{ id: active.id }}
              className="inline-flex items-center gap-2 rounded-md glass px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition"
            >
              <Info className="size-4" /> {t("hero.info")}
            </Link>
          </div>

          <div className="mt-8 flex gap-1.5">
            {titles.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1 rounded-full transition-all ${
                  i === idx ? "w-8 bg-brand" : "w-4 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
