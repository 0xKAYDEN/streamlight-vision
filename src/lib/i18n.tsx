import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "es" | "fr" | "de" | "ja";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "ja", label: "日本語", flag: "JA" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.browse": "Browse",
  "nav.series": "Series",
  "nav.movies": "Movies",
  "nav.anime": "Anime",
  "nav.admin": "Admin",
  "nav.search": "Search titles, genres…",

  "hero.featured": "Featured",
  "hero.play": "Play now",
  "hero.info": "More info",

  "browse.heading": "Discover",
  "browse.count": "{n} title{s}{q}",
  "browse.matching": " matching \"{q}\"",
  "browse.all": "All",
  "browse.allGenres": "All genres",
  "browse.allYears": "All years",
  "browse.empty": "No titles match your filters. Try clearing one.",
  "kind.movie": "Movies",
  "kind.series": "Series",
  "kind.anime": "Anime",
  "kind.documentary": "Documentaries",

  "title.servers": "Streaming servers",
  "title.episodes": "Episodes",
  "title.cast": "Cast",
  "title.details": "Details",
  "title.year": "Year",
  "title.runtime": "Runtime",
  "title.type": "Type",
  "title.rating": "Rating",
  "title.play": "Play",
  "title.myList": "My list",
  "title.similar": "More like this",
  "title.notFound": "Title not found",
  "title.browseLink": "Browse the catalog",
  "title.quality": "Quality",

  "footer.tag": "Premium Streaming. Lightning Fast.",
  "footer.pricing": "Pricing",
  "footer.changelog": "Changelog",
  "footer.contact": "Contact",
  "footer.docs": "Docs",

  "lang.label": "Language",
};

const es: Dict = {
  "nav.home": "Inicio",
  "nav.browse": "Explorar",
  "nav.series": "Series",
  "nav.movies": "Películas",
  "nav.anime": "Anime",
  "nav.admin": "Administrar",
  "nav.search": "Buscar títulos, géneros…",

  "hero.featured": "Destacado",
  "hero.play": "Reproducir",
  "hero.info": "Más información",

  "browse.heading": "Descubre",
  "browse.count": "{n} título{s}{q}",
  "browse.matching": " que coinciden con \"{q}\"",
  "browse.all": "Todos",
  "browse.allGenres": "Todos los géneros",
  "browse.allYears": "Todos los años",
  "browse.empty": "Ningún título coincide con tus filtros.",
  "kind.movie": "Películas",
  "kind.series": "Series",
  "kind.anime": "Anime",
  "kind.documentary": "Documentales",

  "title.servers": "Servidores de transmisión",
  "title.episodes": "Episodios",
  "title.cast": "Reparto",
  "title.details": "Detalles",
  "title.year": "Año",
  "title.runtime": "Duración",
  "title.type": "Tipo",
  "title.rating": "Puntuación",
  "title.play": "Reproducir",
  "title.myList": "Mi lista",
  "title.similar": "Similares",
  "title.notFound": "Título no encontrado",
  "title.browseLink": "Explorar el catálogo",
  "title.quality": "Calidad",

  "footer.tag": "Streaming premium. Rápido como un rayo.",
  "footer.pricing": "Precios",
  "footer.changelog": "Novedades",
  "footer.contact": "Contacto",
  "footer.docs": "Docs",

  "lang.label": "Idioma",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.browse": "Parcourir",
  "nav.series": "Séries",
  "nav.movies": "Films",
  "nav.anime": "Anime",
  "nav.admin": "Admin",
  "nav.search": "Rechercher titres, genres…",

  "hero.featured": "À la une",
  "hero.play": "Lire",
  "hero.info": "Plus d'infos",

  "browse.heading": "Découvrir",
  "browse.count": "{n} titre{s}{q}",
  "browse.matching": " correspondant à \"{q}\"",
  "browse.all": "Tous",
  "browse.allGenres": "Tous les genres",
  "browse.allYears": "Toutes les années",
  "browse.empty": "Aucun titre ne correspond à vos filtres.",
  "kind.movie": "Films",
  "kind.series": "Séries",
  "kind.anime": "Anime",
  "kind.documentary": "Documentaires",

  "title.servers": "Serveurs de streaming",
  "title.episodes": "Épisodes",
  "title.cast": "Distribution",
  "title.details": "Détails",
  "title.year": "Année",
  "title.runtime": "Durée",
  "title.type": "Type",
  "title.rating": "Note",
  "title.play": "Lire",
  "title.myList": "Ma liste",
  "title.similar": "À voir aussi",
  "title.notFound": "Titre introuvable",
  "title.browseLink": "Parcourir le catalogue",
  "title.quality": "Qualité",

  "footer.tag": "Streaming premium. Rapide comme l'éclair.",
  "footer.pricing": "Tarifs",
  "footer.changelog": "Nouveautés",
  "footer.contact": "Contact",
  "footer.docs": "Docs",

  "lang.label": "Langue",
};

const de: Dict = {
  "nav.home": "Start",
  "nav.browse": "Entdecken",
  "nav.series": "Serien",
  "nav.movies": "Filme",
  "nav.anime": "Anime",
  "nav.admin": "Admin",
  "nav.search": "Titel, Genres suchen…",

  "hero.featured": "Empfohlen",
  "hero.play": "Abspielen",
  "hero.info": "Mehr Infos",

  "browse.heading": "Entdecken",
  "browse.count": "{n} Titel{s}{q}",
  "browse.matching": " passend zu \"{q}\"",
  "browse.all": "Alle",
  "browse.allGenres": "Alle Genres",
  "browse.allYears": "Alle Jahre",
  "browse.empty": "Keine Titel entsprechen deinen Filtern.",
  "kind.movie": "Filme",
  "kind.series": "Serien",
  "kind.anime": "Anime",
  "kind.documentary": "Dokus",

  "title.servers": "Streaming-Server",
  "title.episodes": "Episoden",
  "title.cast": "Besetzung",
  "title.details": "Details",
  "title.year": "Jahr",
  "title.runtime": "Laufzeit",
  "title.type": "Typ",
  "title.rating": "Bewertung",
  "title.play": "Abspielen",
  "title.myList": "Meine Liste",
  "title.similar": "Ähnliches",
  "title.notFound": "Titel nicht gefunden",
  "title.browseLink": "Katalog durchsuchen",
  "title.quality": "Qualität",

  "footer.tag": "Premium-Streaming. Blitzschnell.",
  "footer.pricing": "Preise",
  "footer.changelog": "Changelog",
  "footer.contact": "Kontakt",
  "footer.docs": "Docs",

  "lang.label": "Sprache",
};

const ja: Dict = {
  "nav.home": "ホーム",
  "nav.browse": "見つける",
  "nav.series": "シリーズ",
  "nav.movies": "映画",
  "nav.anime": "アニメ",
  "nav.admin": "管理",
  "nav.search": "タイトル・ジャンルを検索…",

  "hero.featured": "注目",
  "hero.play": "再生",
  "hero.info": "詳細",

  "browse.heading": "見つける",
  "browse.count": "{n}件{s}{q}",
  "browse.matching": "「{q}」に一致",
  "browse.all": "すべて",
  "browse.allGenres": "すべてのジャンル",
  "browse.allYears": "すべての年",
  "browse.empty": "条件に一致するタイトルがありません。",
  "kind.movie": "映画",
  "kind.series": "シリーズ",
  "kind.anime": "アニメ",
  "kind.documentary": "ドキュメンタリー",

  "title.servers": "ストリーミングサーバー",
  "title.episodes": "エピソード",
  "title.cast": "キャスト",
  "title.details": "詳細",
  "title.year": "年",
  "title.runtime": "長さ",
  "title.type": "種別",
  "title.rating": "評価",
  "title.play": "再生",
  "title.myList": "マイリスト",
  "title.similar": "関連作品",
  "title.notFound": "タイトルが見つかりません",
  "title.browseLink": "カタログを見る",
  "title.quality": "画質",

  "footer.tag": "プレミアム配信。雷のような速さ。",
  "footer.pricing": "料金",
  "footer.changelog": "更新履歴",
  "footer.contact": "お問い合わせ",
  "footer.docs": "ドキュメント",

  "lang.label": "言語",
};

const dictionaries: Record<Lang, Dict> = { en, es, fr, de, ja };

const KEY = "ts-lang-v1";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Lang | null;
      if (stored && dictionaries[stored]) {
        setLangState(stored);
      } else if (typeof navigator !== "undefined") {
        const nav = navigator.language.slice(0, 2) as Lang;
        if (dictionaries[nav]) setLangState(nav);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };

  const value = useMemo<Ctx>(() => {
    const dict = dictionaries[lang] ?? en;
    const t = (key: string, vars?: Record<string, string | number>) => {
      const raw = dict[key] ?? en[key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, k) =>
        vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
      );
    };
    return { lang, setLang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
