import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react";
import {
  findTitle,
  upsertTitle,
  uniqueId,
  slugify,
} from "@/lib/catalog-store";
import {
  type Title,
  type StreamServer,
  type Subtitle,
  type Episode,
  SAMPLE_HLS,
  SAMPLE_MP4,
} from "@/lib/catalog";

export const Route = createFileRoute("/admin/titles/$id")({
  component: AdminTitleEditor,
});

const blank = (): Title => ({
  id: "",
  title: "",
  year: new Date().getFullYear(),
  rating: 7.5,
  runtime: "1h 30m",
  genres: [],
  kind: "movie",
  tagline: "",
  synopsis: "",
  cast: [],
  hue: 280,
  hue2: 240,
  trending: false,
  featured: false,
  servers: [
    { label: "Server 1 — Lightning", type: "hls", url: SAMPLE_HLS, quality: "Auto" },
  ],
  subtitles: [],
  episodes: [],
});

function AdminTitleEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [draft, setDraft] = useState<Title>(blank());
  const [loaded, setLoaded] = useState(false);
  const [genresStr, setGenresStr] = useState("");
  const [castStr, setCastStr] = useState("");

  useEffect(() => {
    if (isNew) {
      setDraft(blank());
      setGenresStr("");
      setCastStr("");
      setLoaded(true);
      return;
    }
    const t = findTitle(id);
    if (t) {
      setDraft({
        ...t,
        servers: [...t.servers],
        subtitles: t.subtitles ? [...t.subtitles] : [],
        episodes: t.episodes ? [...t.episodes] : [],
      });
      setGenresStr(t.genres.join(", "));
      setCastStr(t.cast.join(", "));
    }
    setLoaded(true);
  }, [id, isNew]);

  const set = <K extends keyof Title>(key: K, value: Title[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const valid = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  const save = () => {
    if (!valid) return;
    const finalId = isNew
      ? uniqueId(slugify(draft.title))
      : draft.id || uniqueId(slugify(draft.title));
    const toSave: Title = {
      ...draft,
      id: finalId,
      genres: genresStr.split(",").map((s) => s.trim()).filter(Boolean),
      cast: castStr.split(",").map((s) => s.trim()).filter(Boolean),
      servers: draft.servers.filter((s) => s.url.trim()),
      subtitles: (draft.subtitles ?? []).filter((s) => s.src.trim()),
      episodes: (draft.episodes ?? []).filter((e) => e.title.trim()),
    };
    upsertTitle(toSave);
    navigate({ to: "/admin" });
  };

  if (!loaded) return null;

  if (!isNew && !findTitle(id)) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <p className="text-muted-foreground">Title not found.</p>
        <Link to="/admin" className="mt-4 inline-block text-brand hover:underline">Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h2 className="text-xl font-semibold">{isNew ? "New title" : `Editing · ${draft.title || "Untitled"}`}</h2>
        <div className="ml-auto flex items-center gap-2">
          {!isNew && (
            <Link
              to="/titles/$id"
              params={{ id: draft.id }}
              className="inline-flex items-center gap-2 rounded-md glass px-3 py-2 text-xs hover:bg-white/10 transition"
            >
              <Eye className="size-3.5" /> View
            </Link>
          )}
          <button
            onClick={save}
            disabled={!valid}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow disabled:opacity-40 hover:opacity-95 transition"
          >
            <Save className="size-4" /> Save
          </button>
        </div>
      </div>

      <Section title="Basics">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title">
            <TextInput value={draft.title} onChange={(v) => set("title", v)} placeholder="Neon Horizon" />
          </Field>
          <Field label="Tagline">
            <TextInput value={draft.tagline} onChange={(v) => set("tagline", v)} placeholder="The future has a frequency." />
          </Field>
          <Field label="Kind">
            <select
              value={draft.kind}
              onChange={(e) => set("kind", e.target.value as Title["kind"])}
              className="h-9 w-full rounded-md bg-white/5 border border-white/10 px-3 text-sm"
            >
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="anime">Anime</option>
              <option value="documentary">Documentary</option>
            </select>
          </Field>
          <Field label="Year">
            <TextInput
              type="number"
              value={String(draft.year)}
              onChange={(v) => set("year", Number(v) || 0)}
            />
          </Field>
          <Field label="Runtime">
            <TextInput value={draft.runtime} onChange={(v) => set("runtime", v)} placeholder="2h 14m or S1 · 8 ep" />
          </Field>
          <Field label="Rating (0–10)">
            <TextInput
              type="number"
              value={String(draft.rating)}
              onChange={(v) => set("rating", Number(v) || 0)}
            />
          </Field>
          <Field label="Genres (comma-separated)">
            <TextInput value={genresStr} onChange={setGenresStr} placeholder="Sci-Fi, Thriller" />
          </Field>
          <Field label="Cast (comma-separated)">
            <TextInput value={castStr} onChange={setCastStr} placeholder="Aria Chen, Marcus Vale" />
          </Field>
          <Field label="Hue (200–320)">
            <TextInput type="number" value={String(draft.hue)} onChange={(v) => set("hue", Number(v) || 280)} />
          </Field>
          <Field label="Hue 2 (200–320)">
            <TextInput type="number" value={String(draft.hue2)} onChange={(v) => set("hue2", Number(v) || 240)} />
          </Field>
          <Field label="Synopsis" full>
            <textarea
              value={draft.synopsis}
              onChange={(e) => set("synopsis", e.target.value)}
              rows={4}
              className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm"
              placeholder="Short pitch describing the title…"
            />
          </Field>
          <div className="flex items-center gap-6">
            <Toggle label="Featured" value={!!draft.featured} onChange={(v) => set("featured", v)} />
            <Toggle label="Trending" value={!!draft.trending} onChange={(v) => set("trending", v)} />
          </div>
        </div>
      </Section>

      <Section
        title="Streaming servers"
        action={
          <button
            onClick={() =>
              set("servers", [
                ...draft.servers,
                { label: `Server ${draft.servers.length + 1}`, type: "hls", url: "", quality: "Auto" },
              ])
            }
            className="inline-flex items-center gap-1.5 rounded-md glass px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
          >
            <Plus className="size-3.5" /> Add server
          </button>
        }
      >
        <div className="space-y-2">
          {draft.servers.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <div className="col-span-3">
                <TextInput
                  value={s.label}
                  onChange={(v) => updateArr(draft.servers, i, { ...s, label: v }, (a) => set("servers", a))}
                  placeholder="Label"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={s.type}
                  onChange={(e) =>
                    updateArr(
                      draft.servers,
                      i,
                      { ...s, type: e.target.value as StreamServer["type"] },
                      (a) => set("servers", a),
                    )
                  }
                  className="h-9 w-full rounded-md bg-white/5 border border-white/10 px-2 text-sm"
                >
                  <option value="hls">HLS (.m3u8)</option>
                  <option value="mp4">MP4</option>
                </select>
              </div>
              <div className="col-span-5">
                <TextInput
                  value={s.url}
                  onChange={(v) => updateArr(draft.servers, i, { ...s, url: v }, (a) => set("servers", a))}
                  placeholder="https://example.com/stream.m3u8"
                />
              </div>
              <div className="col-span-1">
                <TextInput
                  value={s.quality ?? ""}
                  onChange={(v) => updateArr(draft.servers, i, { ...s, quality: v }, (a) => set("servers", a))}
                  placeholder="1080p"
                />
              </div>
              <div className="col-span-1 flex justify-end gap-1">
                <button
                  title="Insert sample"
                  onClick={() =>
                    updateArr(
                      draft.servers,
                      i,
                      { ...s, url: s.type === "hls" ? SAMPLE_HLS : SAMPLE_MP4 },
                      (a) => set("servers", a),
                    )
                  }
                  className="rounded-md glass px-2 py-1.5 text-[10px] hover:bg-white/10 transition"
                >
                  Sample
                </button>
                <IconBtn onClick={() => set("servers", draft.servers.filter((_, j) => j !== i))}>
                  <Trash2 className="size-3.5" />
                </IconBtn>
              </div>
            </div>
          ))}
          {draft.servers.length === 0 && (
            <div className="text-xs text-muted-foreground p-3">No servers yet.</div>
          )}
        </div>
      </Section>

      <Section
        title="Subtitle tracks"
        action={
          <button
            onClick={() =>
              set("subtitles", [
                ...(draft.subtitles ?? []),
                { label: "English", srclang: "en", src: "" },
              ])
            }
            className="inline-flex items-center gap-1.5 rounded-md glass px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
          >
            <Plus className="size-3.5" /> Add subtitle
          </button>
        }
      >
        <div className="space-y-2">
          {(draft.subtitles ?? []).map((sub, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <div className="col-span-3">
                <TextInput
                  value={sub.label}
                  onChange={(v) =>
                    set("subtitles", updateArrPure(draft.subtitles ?? [], i, { ...sub, label: v }))
                  }
                  placeholder="English"
                />
              </div>
              <div className="col-span-2">
                <TextInput
                  value={sub.srclang}
                  onChange={(v) =>
                    set("subtitles", updateArrPure(draft.subtitles ?? [], i, { ...sub, srclang: v }))
                  }
                  placeholder="en"
                />
              </div>
              <div className="col-span-6">
                <TextInput
                  value={sub.src}
                  onChange={(v) =>
                    set("subtitles", updateArrPure(draft.subtitles ?? [], i, { ...sub, src: v }))
                  }
                  placeholder="https://example.com/captions.vtt"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <IconBtn onClick={() => set("subtitles", (draft.subtitles ?? []).filter((_, j) => j !== i))}>
                  <Trash2 className="size-3.5" />
                </IconBtn>
              </div>
            </div>
          ))}
          {(draft.subtitles?.length ?? 0) === 0 && (
            <div className="text-xs text-muted-foreground p-3">No subtitles yet.</div>
          )}
        </div>
      </Section>

      {(draft.kind === "series" || draft.kind === "anime" || draft.kind === "documentary") && (
        <Section
          title="Episodes"
          action={
            <button
              onClick={() => {
                const next = (draft.episodes ?? []).length + 1;
                set("episodes", [
                  ...(draft.episodes ?? []),
                  {
                    id: `ep-${Date.now()}`,
                    season: 1,
                    number: next,
                    title: `Episode ${next}`,
                    runtime: "45m",
                    synopsis: "",
                    servers: [],
                    subtitles: [],
                  },
                ]);
              }}
              className="inline-flex items-center gap-1.5 rounded-md glass px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
            >
              <Plus className="size-3.5" /> Add episode
            </button>
          }
        >
          <div className="space-y-2">
            {(draft.episodes ?? []).map((ep, i) => (
              <EpisodeRow
                key={ep.id}
                ep={ep}
                onChange={(next) => set("episodes", updateArrPure(draft.episodes ?? [], i, next))}
                onRemove={() => set("episodes", (draft.episodes ?? []).filter((_, j) => j !== i))}
              />
            ))}
            {(draft.episodes?.length ?? 0) === 0 && (
              <div className="text-xs text-muted-foreground p-3">No episodes yet.</div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}

function updateArr<T>(arr: T[], i: number, val: T, setter: (next: T[]) => void) {
  setter(arr.map((x, j) => (j === i ? val : x)));
}
function updateArrPure<T>(arr: T[], i: number, val: T): T[] {
  return arr.map((x, j) => (j === i ? val : x));
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
        <div className="ml-auto">{action}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-md bg-white/5 border border-white/10 px-3 text-sm focus:outline-none focus:border-brand/60 focus:bg-white/10 transition"
    />
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
      <span
        onClick={() => onChange(!value)}
        className={`relative h-5 w-9 rounded-full transition ${value ? "bg-gradient-brand" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-muted-foreground">{label}</span>
    </label>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-red-500/20 bg-red-500/10 text-red-300 px-2 py-1.5 hover:bg-red-500/20 transition"
    >
      {children}
    </button>
  );
}

function EpisodeRow({
  ep,
  onChange,
  onRemove,
}: {
  ep: Episode;
  onChange: (next: Episode) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof Episode>(k: K, v: Episode[K]) => onChange({ ...ep, [k]: v });

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="grid grid-cols-12 gap-2 items-center p-3">
        <div className="col-span-1">
          <TextInput type="number" value={String(ep.season)} onChange={(v) => set("season", Number(v) || 1)} />
        </div>
        <div className="col-span-1">
          <TextInput type="number" value={String(ep.number)} onChange={(v) => set("number", Number(v) || 1)} />
        </div>
        <div className="col-span-5">
          <TextInput value={ep.title} onChange={(v) => set("title", v)} placeholder="Episode title" />
        </div>
        <div className="col-span-2">
          <TextInput value={ep.runtime ?? ""} onChange={(v) => set("runtime", v)} placeholder="45m" />
        </div>
        <div className="col-span-3 flex justify-end gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-md glass px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
          >
            {open ? "Hide" : "Details"}
          </button>
          <IconBtn onClick={onRemove}>
            <Trash2 className="size-3.5" />
          </IconBtn>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/5 p-3 space-y-3">
          <textarea
            value={ep.synopsis ?? ""}
            onChange={(e) => set("synopsis", e.target.value)}
            rows={2}
            placeholder="Episode synopsis…"
            className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm"
          />
          <ServersMini
            servers={ep.servers ?? []}
            onChange={(next) => set("servers", next)}
          />
          <SubsMini
            subs={ep.subtitles ?? []}
            onChange={(next) => set("subtitles", next)}
          />
        </div>
      )}
    </div>
  );
}

function ServersMini({
  servers,
  onChange,
}: {
  servers: StreamServer[];
  onChange: (next: StreamServer[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Episode servers</span>
        <button
          onClick={() => onChange([...servers, { label: `Server ${servers.length + 1}`, type: "hls", url: "" }])}
          className="ml-auto text-xs rounded-md glass px-2 py-1 hover:bg-white/10 transition"
        >
          + Add
        </button>
      </div>
      <div className="space-y-1.5">
        {servers.map((s, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-3">
              <TextInput value={s.label} onChange={(v) => onChange(updateArrPure(servers, i, { ...s, label: v }))} />
            </div>
            <div className="col-span-2">
              <select
                value={s.type}
                onChange={(e) => onChange(updateArrPure(servers, i, { ...s, type: e.target.value as StreamServer["type"] }))}
                className="h-9 w-full rounded-md bg-white/5 border border-white/10 px-2 text-sm"
              >
                <option value="hls">HLS</option>
                <option value="mp4">MP4</option>
              </select>
            </div>
            <div className="col-span-6">
              <TextInput value={s.url} onChange={(v) => onChange(updateArrPure(servers, i, { ...s, url: v }))} placeholder="URL" />
            </div>
            <div className="col-span-1 flex justify-end">
              <IconBtn onClick={() => onChange(servers.filter((_, j) => j !== i))}>
                <Trash2 className="size-3.5" />
              </IconBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubsMini({
  subs,
  onChange,
}: {
  subs: Subtitle[];
  onChange: (next: Subtitle[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Episode subtitles</span>
        <button
          onClick={() => onChange([...subs, { label: "English", srclang: "en", src: "" }])}
          className="ml-auto text-xs rounded-md glass px-2 py-1 hover:bg-white/10 transition"
        >
          + Add
        </button>
      </div>
      <div className="space-y-1.5">
        {subs.map((s, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-3">
              <TextInput value={s.label} onChange={(v) => onChange(updateArrPure(subs, i, { ...s, label: v }))} />
            </div>
            <div className="col-span-2">
              <TextInput value={s.srclang} onChange={(v) => onChange(updateArrPure(subs, i, { ...s, srclang: v }))} />
            </div>
            <div className="col-span-6">
              <TextInput value={s.src} onChange={(v) => onChange(updateArrPure(subs, i, { ...s, src: v }))} placeholder=".vtt URL" />
            </div>
            <div className="col-span-1 flex justify-end">
              <IconBtn onClick={() => onChange(subs.filter((_, j) => j !== i))}>
                <Trash2 className="size-3.5" />
              </IconBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
