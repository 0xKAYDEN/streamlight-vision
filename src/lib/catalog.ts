export type StreamServer = {
  label: string;
  type: "hls" | "mp4";
  url: string;
  quality?: string;
};

export type Subtitle = {
  label: string;
  srclang: string;
  src: string;
};

export type Episode = {
  id: string;
  season: number;
  number: number;
  title: string;
  runtime?: string;
  synopsis?: string;
  servers?: StreamServer[];
  subtitles?: Subtitle[];
};

export type Title = {
  id: string;
  title: string;
  year: number;
  rating: number; // 0-10
  runtime: string;
  genres: string[];
  kind: "movie" | "series" | "anime" | "documentary";
  tagline: string;
  synopsis: string;
  cast: string[];
  // Visual identity (gradient based, no external images required)
  hue: number; // 200-320
  hue2: number;
  trending?: boolean;
  featured?: boolean;
  servers: StreamServer[];
  subtitles?: Subtitle[];
  episodes?: Episode[];
  createdAt?: number;
  updatedAt?: number;
};

export const SAMPLE_HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
export const SAMPLE_MP4 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// Public sample streams — safe to use for demos.
const HLS_BIG = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const HLS_TOS = "https://test-streams.mux.dev/tos_ismc/main.m3u8";
const MP4_BBB =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const MP4_ED = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

const defaultServers: StreamServer[] = [
  { label: "Server 1 — Lightning", type: "hls", url: HLS_BIG, quality: "Auto" },
  { label: "Server 2 — HD", type: "hls", url: HLS_TOS, quality: "1080p" },
  { label: "Server 3 — Backup", type: "mp4", url: MP4_BBB, quality: "720p" },
  { label: "Server 4 — Mirror", type: "mp4", url: MP4_ED, quality: "720p" },
];

const defaultSubs: Subtitle[] = [
  // Sample WebVTT publicly hosted by W3C examples
  {
    label: "English",
    srclang: "en",
    src: "https://raw.githubusercontent.com/mozilla/vtt.js/master/tests/captions/captions.vtt",
  },
];

export const catalog: Title[] = [
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    year: 2025,
    rating: 8.7,
    runtime: "2h 14m",
    genres: ["Sci-Fi", "Thriller"],
    kind: "movie",
    tagline: "The future has a frequency.",
    synopsis:
      "In a city powered by dreams, a signal engineer discovers a frequency that rewrites memory — and someone is broadcasting from the other side.",
    cast: ["Aria Chen", "Marcus Vale", "Iyari Solène"],
    hue: 285,
    hue2: 250,
    featured: true,
    trending: true,
    servers: defaultServers,
    subtitles: defaultSubs,
  },
  {
    id: "ghost-circuit",
    title: "Ghost Circuit",
    year: 2024,
    rating: 8.2,
    runtime: "S1 · 8 ep",
    genres: ["Cyberpunk", "Drama"],
    kind: "series",
    tagline: "Every byte remembers.",
    synopsis:
      "A team of rogue analysts trace a sentient virus through the underbelly of a megacity that doesn't sleep.",
    cast: ["Kenji Mori", "Lila Ahmadi"],
    hue: 270,
    hue2: 220,
    trending: true,
    servers: defaultServers,
  },
  {
    id: "after-the-storm",
    title: "After the Storm",
    year: 2025,
    rating: 7.9,
    runtime: "1h 48m",
    genres: ["Drama"],
    kind: "movie",
    tagline: "Some silence is louder than thunder.",
    synopsis:
      "Two strangers shelter from a coastal blackout and uncover a shared history neither remembers signing up for.",
    cast: ["Noa Adler", "Sam Quint"],
    hue: 240,
    hue2: 290,
    servers: defaultServers,
  },
  {
    id: "obsidian-protocol",
    title: "Obsidian Protocol",
    year: 2023,
    rating: 8.5,
    runtime: "S2 · 10 ep",
    genres: ["Thriller", "Mystery"],
    kind: "series",
    tagline: "Trust the encryption, not the messenger.",
    synopsis:
      "An agent goes dark inside a financial cult that promises immortality — at the cost of identity.",
    cast: ["Ezra Vey", "Mira Khoury", "Tomás Reis"],
    hue: 295,
    hue2: 260,
    trending: true,
    servers: defaultServers,
  },
  {
    id: "skyline-bloom",
    title: "Skyline Bloom",
    year: 2024,
    rating: 8.0,
    runtime: "S1 · 12 ep",
    genres: ["Anime", "Adventure"],
    kind: "anime",
    tagline: "Where the sky meets the steel garden.",
    synopsis:
      "A botanist's apprentice climbs a city of clouds to find the seed that ended the last war.",
    cast: ["Hana Iida", "Ren Kuroda"],
    hue: 215,
    hue2: 285,
    servers: defaultServers,
  },
  {
    id: "the-last-broadcast",
    title: "The Last Broadcast",
    year: 2022,
    rating: 8.9,
    runtime: "1h 32m",
    genres: ["Documentary"],
    kind: "documentary",
    tagline: "The signal that ended the silent decade.",
    synopsis:
      "A look back at the engineers, pirates, and poets who kept the airwaves alive when everything else went dark.",
    cast: ["Featuring archival footage"],
    hue: 250,
    hue2: 230,
    servers: defaultServers,
  },
  {
    id: "violet-engine",
    title: "Violet Engine",
    year: 2025,
    rating: 7.6,
    runtime: "1h 58m",
    genres: ["Action", "Sci-Fi"],
    kind: "movie",
    tagline: "Built to outrun the future.",
    synopsis:
      "A street racer is recruited into a quantum league where every win rewrites her past.",
    cast: ["June Park", "Alessio Renn"],
    hue: 300,
    hue2: 270,
    trending: true,
    servers: defaultServers,
  },
  {
    id: "midnight-cartography",
    title: "Midnight Cartography",
    year: 2023,
    rating: 8.1,
    runtime: "S1 · 6 ep",
    genres: ["Mystery", "Drama"],
    kind: "series",
    tagline: "Maps drawn by people who never came back.",
    synopsis:
      "A reclusive cartographer inherits a library of impossible maps that lead to places no one remembers.",
    cast: ["Odette Marsh", "Idris Bay"],
    hue: 260,
    hue2: 220,
    servers: defaultServers,
  },
  {
    id: "halcyon-static",
    title: "Halcyon Static",
    year: 2024,
    rating: 7.4,
    runtime: "1h 41m",
    genres: ["Romance", "Sci-Fi"],
    kind: "movie",
    tagline: "Love at the edge of the signal.",
    synopsis:
      "Two researchers fall for each other across a delay no message can cross in time.",
    cast: ["Ines Vargas", "Theo Lin"],
    hue: 230,
    hue2: 290,
    servers: defaultServers,
  },
  {
    id: "thunder-protocol",
    title: "Thunder Protocol",
    year: 2025,
    rating: 9.1,
    runtime: "S1 · 8 ep",
    genres: ["Action", "Thriller"],
    kind: "series",
    tagline: "Strike first. Stream forever.",
    synopsis:
      "A black-ops team uses a leaked broadcast network to dismantle a syndicate hiding in plain sight.",
    cast: ["Cyrus Vale", "Anya Petrova", "Mateo Ruiz"],
    hue: 280,
    hue2: 240,
    trending: true,
    featured: true,
    servers: defaultServers,
  },
  {
    id: "paper-cities",
    title: "Paper Cities",
    year: 2022,
    rating: 7.8,
    runtime: "S1 · 10 ep",
    genres: ["Anime", "Slice of Life"],
    kind: "anime",
    tagline: "Folded skylines, unfolded hearts.",
    synopsis:
      "A teenage origamist discovers her creations are blueprints for a city that's slowly arriving.",
    cast: ["Mei Sato", "Hiro Tanaka"],
    hue: 220,
    hue2: 280,
    servers: defaultServers,
  },
  {
    id: "deep-field",
    title: "Deep Field",
    year: 2023,
    rating: 8.6,
    runtime: "1h 27m",
    genres: ["Documentary", "Science"],
    kind: "documentary",
    tagline: "A portrait of everything we can almost see.",
    synopsis:
      "Astronomers spend ten years aiming a telescope at a single dark patch of sky — and come back changed.",
    cast: ["Narrated by Aurelia Cross"],
    hue: 245,
    hue2: 270,
    servers: defaultServers,
  },
];

export const getTitle = (id: string) => catalog.find((t) => t.id === id);

export const featured = catalog.filter((t) => t.featured);
export const trending = catalog.filter((t) => t.trending);

export const byGenre = (genre: string) =>
  catalog.filter((t) => t.genres.includes(genre));

export const byKind = (kind: Title["kind"]) =>
  catalog.filter((t) => t.kind === kind);

export const search = (q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return catalog;
  return catalog.filter(
    (t) =>
      t.title.toLowerCase().includes(s) ||
      t.genres.some((g) => g.toLowerCase().includes(s)) ||
      t.synopsis.toLowerCase().includes(s)
  );
};

export const allGenres = Array.from(
  new Set(catalog.flatMap((t) => t.genres))
).sort();
