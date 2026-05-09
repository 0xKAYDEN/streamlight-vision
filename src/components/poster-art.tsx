import type { Title } from "@/lib/catalog";

type Props = {
  title: Title;
  variant?: "poster" | "backdrop";
  className?: string;
};

/**
 * Cinematic art for a title. If the title has a posterUrl/backdropUrl, the
 * image is rendered with a tasteful overlay. Otherwise we fall back to a
 * pure-CSS gradient based on the title's brand hues.
 */
export function PosterArt({ title, variant = "poster", className }: Props) {
  const { hue, hue2, title: name, kind, year, posterUrl, backdropUrl } = title;
  const img = variant === "backdrop" ? (backdropUrl ?? posterUrl) : (posterUrl ?? backdropUrl);

  const fallbackBg = `radial-gradient(120% 80% at 20% 0%, oklch(0.55 0.22 ${hue} / 0.85), transparent 60%),
              radial-gradient(120% 80% at 100% 100%, oklch(0.45 0.22 ${hue2} / 0.85), transparent 60%),
              linear-gradient(160deg, oklch(0.18 0.04 ${hue}), oklch(0.1 0.03 ${hue2}))`;

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={img ? undefined : { backgroundImage: fallbackBg }}
    >
      {img && (
        <img
          src={img}
          alt={name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* color tint to keep the brand mood consistent over photo posters */}
      {img && (
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-70"
          style={{
            background: `linear-gradient(160deg, oklch(0.6 0.22 ${hue} / 0.6), oklch(0.4 0.22 ${hue2} / 0.6))`,
          }}
        />
      )}

      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* bright orb */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl opacity-40"
        style={{ background: `oklch(0.75 0.22 ${hue})` }}
      />

      {/* text */}
      <div className={`absolute inset-0 flex flex-col justify-end ${variant === "backdrop" ? "p-8" : "p-4"}`}>
        <div className="uppercase tracking-[0.25em] text-[10px] text-white/80 mb-1">
          {kind} · {year}
        </div>
        <div
          className={`font-semibold text-white drop-shadow-[0_2px_20px_oklch(0_0_0_/_0.7)] ${variant === "backdrop" ? "text-4xl md:text-6xl leading-tight" : "text-base leading-tight"}`}
          style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}
        >
          {name}
        </div>
      </div>

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
    </div>
  );
}
