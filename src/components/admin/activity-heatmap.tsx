import { useMemo } from "react";
import type { Title } from "@/lib/catalog";

const WEEKS = 26; // ~6 months
const DAY = 86400000;

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function ActivityHeatmap({ titles }: { titles: Title[] }) {
  const { cells, max, total } = useMemo(() => {
    const today = startOfDay(Date.now());
    // Align grid so the rightmost column ends today; columns are weeks (Sun..Sat)
    const todayDow = new Date(today).getDay();
    const start = today - (WEEKS * 7 - 1 - todayDow) * DAY;

    const counts = new Map<number, number>();
    for (const t of titles) {
      for (const ts of [t.createdAt, t.updatedAt]) {
        if (!ts) continue;
        const d = startOfDay(ts);
        if (d < start || d > today) continue;
        counts.set(d, (counts.get(d) ?? 0) + 1);
      }
    }

    const cells: { day: number; count: number }[] = [];
    let max = 0;
    let total = 0;
    for (let i = 0; i < WEEKS * 7; i++) {
      const day = start + i * DAY;
      const count = counts.get(day) ?? 0;
      if (count > max) max = count;
      total += count;
      cells.push({ day, count });
    }
    return { cells, max, total };
  }, [titles]);

  const level = (c: number) => {
    if (!c) return 0;
    if (max <= 1) return 4;
    const ratio = c / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  // Group by columns (weeks)
  const cols: { day: number; count: number }[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    cols.push(cells.slice(w * 7, w * 7 + 7));
  }

  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  cols.forEach((col, i) => {
    const m = new Date(col[0].day).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        col: i,
        label: new Date(col[0].day).toLocaleString(undefined, { month: "short" }),
      });
      lastMonth = m;
    }
  });

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Catalog activity</h3>
        <span className="text-xs text-muted-foreground">{total} edits · last 6 months</span>
        <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`size-2.5 rounded-[3px] ${cellClass(l)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-[3px] pl-6 text-[10px] text-muted-foreground mb-1">
            {cols.map((_, i) => {
              const m = monthLabels.find((x) => x.col === i);
              return (
                <div key={i} className="w-2.5 text-left">
                  {m ? m.label : ""}
                </div>
              );
            })}
          </div>
          <div className="flex gap-[3px]">
            <div className="flex flex-col gap-[3px] mr-1.5 text-[9px] text-muted-foreground">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                <div key={i} className="h-2.5 leading-[10px]">{d}</div>
              ))}
            </div>
            {cols.map((col, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {col.map((c) => (
                  <div
                    key={c.day}
                    title={`${new Date(c.day).toDateString()} — ${c.count} edit${c.count === 1 ? "" : "s"}`}
                    className={`size-2.5 rounded-[3px] ${cellClass(level(c.count))}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cellClass(level: number) {
  switch (level) {
    case 0: return "bg-white/[0.04] border border-white/[0.05]";
    case 1: return "bg-brand/25";
    case 2: return "bg-brand/45";
    case 3: return "bg-brand/70";
    case 4: return "bg-gradient-brand shadow-[0_0_8px_oklch(0.66_0.22_285_/_0.6)]";
    default: return "";
  }
}
