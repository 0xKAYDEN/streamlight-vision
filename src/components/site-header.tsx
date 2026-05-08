import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Zap, Globe } from "lucide-react";
import { useState } from "react";
import { useI18n, LANGUAGES, type Lang } from "@/lib/i18n";

export function SiteHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { t, lang, setLang } = useI18n();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/browse", search: { q: q || undefined } as never });
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="flex items-center gap-6 px-4 md:px-8 h-14">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid place-items-center size-7 rounded-md bg-gradient-brand shadow-glow">
            <Zap className="size-4 text-white fill-white" />
          </span>
          <span className="tracking-tight">
            Thunder<span className="text-gradient-brand">Stream</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">
            {t("nav.home")}
          </Link>
          <Link to="/browse" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">
            {t("nav.browse")}
          </Link>
          <Link to="/browse" search={{ kind: "series" } as never} className="hover:text-foreground transition">
            {t("nav.series")}
          </Link>
          <Link to="/browse" search={{ kind: "movie" } as never} className="hover:text-foreground transition">
            {t("nav.movies")}
          </Link>
          <Link to="/browse" search={{ kind: "anime" } as never} className="hover:text-foreground transition">
            {t("nav.anime")}
          </Link>
          <Link to="/admin" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">
            {t("nav.admin")}
          </Link>
        </nav>
        <form onSubmit={submit} className="ml-auto relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("nav.search")}
            className="w-full h-9 pl-9 pr-3 rounded-md bg-white/5 border border-white/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand/60 focus:bg-white/10 transition"
          />
        </form>
        <div className="relative">
          <Globe className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label={t("lang.label")}
            className="h-9 pl-7 pr-2 rounded-md bg-white/5 border border-white/10 text-xs hover:bg-white/10 focus:outline-none focus:border-brand/60 transition cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} · {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
