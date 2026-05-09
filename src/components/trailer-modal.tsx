import { X } from "lucide-react";
import { useEffect } from "react";

function toEmbed(url: string): string {
  // Convert common YouTube watch/share URLs to /embed/ form, leave others as-is.
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    /* ignore */
  }
  return url;
}

export function TrailerModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isVideoFile = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
  const embed = toEmbed(url);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-glow bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute top-3 right-3 z-10 size-9 grid place-items-center rounded-full bg-black/60 hover:bg-black/80 border border-white/10 transition"
        >
          <X className="size-4" />
        </button>
        {isVideoFile ? (
          <video src={url} controls autoPlay className="absolute inset-0 w-full h-full" />
        ) : (
          <iframe
            src={embed}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
