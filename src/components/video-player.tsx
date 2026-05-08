import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Server,
  ArrowLeft,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Title } from "@/lib/catalog";

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function VideoPlayer({ title }: { title: Title }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [serverIdx, setServerIdx] = useState(0);
  const [subIdx, setSubIdx] = useState<number>(-1);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fs, setFs] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [menu, setMenu] = useState<"none" | "server" | "subs">("none");
  const [loading, setLoading] = useState(true);

  const server = title.servers[serverIdx];

  // Load source
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !server) return;
    setLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (server.type === "hls") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = server.url;
      } else if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(server.url);
        hls.attachMedia(video);
        hlsRef.current = hls;
      } else {
        video.src = server.url;
      }
    } else {
      video.src = server.url;
    }

    // Restore progress
    const key = `ts-progress:${title.id}`;
    const saved = Number(localStorage.getItem(key) || 0);
    const onLoaded = () => {
      if (saved > 5 && saved < (video.duration || Infinity) - 10) {
        video.currentTime = saved;
      }
      setLoading(false);
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, [server, title.id]);

  // Save progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const id = setInterval(() => {
      if (!v.paused && v.currentTime > 0) {
        localStorage.setItem(`ts-progress:${title.id}`, String(v.currentTime));
      }
    }, 4000);
    return () => clearInterval(id);
  }, [title.id]);

  // Bind events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    const onDur = () => setDuration(v.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("durationchange", onDur);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("durationchange", onDur);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  // Subtitle tracks toggle
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tracks = v.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = i === subIdx ? "showing" : "hidden";
    }
  }, [subIdx, server]);

  // Keyboard shortcuts
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))
        return;
      if (e.key === " " || e.key.toLowerCase() === "k") {
        e.preventDefault();
        v.paused ? v.play() : v.pause();
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "l") {
        v.currentTime = Math.min(v.duration, v.currentTime + 10);
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "j") {
        v.currentTime = Math.max(0, v.currentTime - 10);
      } else if (e.key.toLowerCase() === "m") {
        v.muted = !v.muted;
        setMuted(v.muted);
      } else if (e.key.toLowerCase() === "f") {
        toggleFs();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleFs = async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setFs(true);
    } else {
      await document.exitFullscreen?.();
      setFs(false);
    }
  };

  // Auto-hide controls
  const hideTimer = useRef<number | null>(null);
  const ping = () => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playing) setShowControls(false);
    }, 2500);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={ping}
      onMouseLeave={() => playing && setShowControls(false)}
      className="relative w-full h-screen bg-black overflow-hidden select-none"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        playsInline
        crossOrigin="anonymous"
        onClick={() => {
          const v = videoRef.current!;
          v.paused ? v.play() : v.pause();
        }}
        onVolumeChange={(e) => {
          const v = e.currentTarget;
          setMuted(v.muted);
          setVolume(v.volume);
        }}
      >
        {title.subtitles?.map((s, i) => (
          <track
            key={i}
            kind="subtitles"
            label={s.label}
            srcLang={s.srclang}
            src={s.src}
            default={i === subIdx}
          />
        ))}
      </video>

      {loading && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="size-10 rounded-full border-2 border-white/20 border-t-brand animate-spin" />
        </div>
      )}

      {/* Top bar */}
      <div
        className={`absolute top-0 inset-x-0 p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/titles/$id"
            params={{ id: title.id }}
            className="grid place-items-center size-9 rounded-full glass hover:bg-white/15 transition"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-widest">
              Now playing
            </div>
            <div className="font-semibold">{title.title}</div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-black/85 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* progress */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => {
            const v = videoRef.current!;
            v.currentTime = Number(e.target.value);
          }}
          className="w-full h-1 accent-[oklch(0.66_0.22_285)] cursor-pointer"
        />
        <div className="mt-2 flex items-center gap-3 text-sm">
          <button
            onClick={() => {
              const v = videoRef.current!;
              v.paused ? v.play() : v.pause();
            }}
            className="size-10 grid place-items-center rounded-full bg-white text-black hover:scale-105 transition"
          >
            {playing ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
          </button>
          <button
            onClick={() => {
              const v = videoRef.current!;
              v.muted = !v.muted;
            }}
            className="size-9 grid place-items-center rounded-full glass hover:bg-white/15 transition"
          >
            {muted || volume === 0 ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = videoRef.current!;
              v.volume = Number(e.target.value);
              v.muted = false;
            }}
            className="w-24 accent-[oklch(0.66_0.22_285)]"
          />
          <div className="text-xs text-white/70 tabular-nums">
            {fmt(time)} / {fmt(duration)}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Server menu */}
            <div className="relative">
              <button
                onClick={() =>
                  setMenu((m) => (m === "server" ? "none" : "server"))
                }
                className="flex items-center gap-2 rounded-md glass px-3 h-9 text-xs hover:bg-white/15 transition"
              >
                <Server className="size-3.5" />
                <span className="hidden sm:inline">{server.label}</span>
                <span className="text-white/50">{server.quality}</span>
              </button>
              {menu === "server" && (
                <div className="absolute right-0 bottom-11 w-64 glass rounded-lg p-1 shadow-soft">
                  {title.servers.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setServerIdx(i);
                        setMenu("none");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs hover:bg-white/10 transition ${
                        i === serverIdx ? "bg-white/10 text-brand" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{s.label}</span>
                        <span className="text-white/50">{s.quality}</span>
                      </div>
                      <div className="text-[10px] uppercase text-white/40 mt-0.5">
                        {s.type}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subs */}
            {title.subtitles && title.subtitles.length > 0 && (
              <div className="relative">
                <button
                  onClick={() =>
                    setMenu((m) => (m === "subs" ? "none" : "subs"))
                  }
                  className={`size-9 grid place-items-center rounded-md glass hover:bg-white/15 transition ${
                    subIdx >= 0 ? "text-brand" : ""
                  }`}
                >
                  <Subtitles className="size-4" />
                </button>
                {menu === "subs" && (
                  <div className="absolute right-0 bottom-11 w-44 glass rounded-lg p-1 shadow-soft">
                    <button
                      onClick={() => {
                        setSubIdx(-1);
                        setMenu("none");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs hover:bg-white/10 ${
                        subIdx === -1 ? "text-brand" : ""
                      }`}
                    >
                      Off
                    </button>
                    {title.subtitles.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSubIdx(i);
                          setMenu("none");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs hover:bg-white/10 ${
                          subIdx === i ? "text-brand" : ""
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleFs}
              className="size-9 grid place-items-center rounded-md glass hover:bg-white/15 transition"
            >
              {fs ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            </button>
          </div>
        </div>
        <div className="mt-2 hidden md:block text-[10px] text-white/40 tracking-wider uppercase">
          Shortcuts: Space/K play · J/L ±10s · M mute · F fullscreen
        </div>
      </div>
    </div>
  );
}
