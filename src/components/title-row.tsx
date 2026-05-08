import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TitleCard } from "./title-card";
import type { Title } from "@/lib/catalog";

export function TitleRow({
  heading,
  titles,
}: {
  heading: string;
  titles: Title[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <div className="flex items-end justify-between mb-3 px-4 md:px-8">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">
          {heading}
        </h2>
        <div className="hidden md:flex gap-1">
          <button
            onClick={() => scroll(-1)}
            className="size-8 grid place-items-center rounded-full glass hover:bg-white/10 transition"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="size-8 grid place-items-center rounded-full glass hover:bg-white/10 transition"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-none px-4 md:px-8 pb-2"
      >
        {titles.map((t) => (
          <TitleCard key={t.id} title={t} />
        ))}
      </div>
    </section>
  );
}
