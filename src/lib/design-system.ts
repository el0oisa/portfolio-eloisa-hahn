/**
 * DESIGN SYSTEM AUTORAL — modo livre
 * ------------------------------------------------------------------
 * Não existem mais presets fechados. Toda decisão visual é um campo
 * individual dentro de `DesignConfig`, persistido como JSON em
 * `portfolio_settings.design_config`. Light e dark são configurados
 * separadamente. As fontes podem ser qualquer família do Google Fonts
 * (carregadas dinamicamente, sem lista fechada).
 */

import { ensureGoogleFontsLoaded, fontStack } from "@/lib/google-fonts";

export type TokenMap = Record<string, string>;

/* -------------------------------------------------------------- CORES */

export type ModeColors = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  focus: string;
  success: string;
  warning: string;
  error: string;
  /** Cor do texto sobre `primary`/`secondary`/`accent`. "auto" calcula contraste. */
  onPrimary: string;
  onSecondary: string;
  onAccent: string;
  /** Textura/imagem de fundo, independente por modo. */
  backgroundImageUrl?: string | null;
  backgroundImageOpacity: number; // 0–1
  backgroundImageSize: "cover" | "contain" | "repeat" | "auto";
  backgroundImageBlend:
    | "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "luminosity";
};

export const LIGHT_DEFAULTS: ModeColors = {
  background: "#f7f4ec",
  surface: "#ffffff",
  textPrimary: "#161329",
  textSecondary: "#565270",
  primary: "#e8365f",
  secondary: "#f5df66",
  accent: "#4b4ee0",
  border: "#161329",
  focus: "#4b4ee0",
  success: "#3f9d5b",
  warning: "#e0b23c",
  error: "#d43b3b",
  onPrimary: "auto",
  onSecondary: "auto",
  onAccent: "auto",
  backgroundImageUrl: null,
  backgroundImageOpacity: 0.15,
  backgroundImageSize: "cover",
  backgroundImageBlend: "normal",
};

export const DARK_DEFAULTS: ModeColors = {
  background: "#141225",
  surface: "#1e1c33",
  textPrimary: "#f6f4ec",
  textSecondary: "#bcb8d2",
  primary: "#ff6b8a",
  secondary: "#4a4720",
  accent: "#8d90ff",
  border: "rgba(255,255,255,0.3)",
  focus: "#8d90ff",
  success: "#5cc985",
  warning: "#e8c56a",
  error: "#ef6b6b",
  onPrimary: "auto",
  onSecondary: "auto",
  onAccent: "auto",
  backgroundImageUrl: null,
  backgroundImageOpacity: 0.15,
  backgroundImageSize: "cover",
  backgroundImageBlend: "normal",
};

/* ---------------------------------------------------------- TIPOGRAFIA */

export type TypographyConfig = {
  fontDisplay: string;
  fontBody: string;
  fontDisplayFallback: "sans" | "serif" | "mono";
  fontBodyFallback: "sans" | "serif" | "mono";
  displayWeight: number;
  bodyWeight: number;
  displayTrackingEm: number;
  bodyTrackingEm: number;
  displayLeading: number;
  bodyLeading: number;
  scaleRatio: number;
  baseFontSizePx: number;
};

export const TYPOGRAPHY_DEFAULTS: TypographyConfig = {
  fontDisplay: "Archivo Black",
  fontBody: "Space Grotesk",
  fontDisplayFallback: "sans",
  fontBodyFallback: "sans",
  displayWeight: 400,
  bodyWeight: 400,
  displayTrackingEm: -0.02,
  bodyTrackingEm: 0,
  displayLeading: 0.95,
  bodyLeading: 1.6,
  scaleRatio: 1.28,
  baseFontSizePx: 17,
};

/* -------------------------------------------------------------- LAYOUT */

export type LayoutConfig = {
  gridColumns: number;
  gridMaxWidthRem: number;
  gridGutterRem: number;
  gridMarginRem: number;
  gridOffsetRem: number;
  cardRatio: string; // ex: "4 / 3"
};

export const LAYOUT_DEFAULTS: LayoutConfig = {
  gridColumns: 3,
  gridMaxWidthRem: 72,
  gridGutterRem: 1.5,
  gridMarginRem: 1.5,
  gridOffsetRem: 0,
  cardRatio: "4 / 3",
};

export type SpacingConfig = {
  xsRem: number; smRem: number; mdRem: number; lgRem: number;
  xlRem: number; xl2Rem: number; xl3Rem: number;
};

export const SPACING_DEFAULTS: SpacingConfig = {
  xsRem: 0.25, smRem: 0.75, mdRem: 1, lgRem: 1.5, xlRem: 2.5, xl2Rem: 4, xl3Rem: 6,
};

export type BorderConfig = { widthPx: number; style: "solid" | "dashed" | "dotted" | "double" };
export const BORDER_DEFAULTS: BorderConfig = { widthPx: 3, style: "solid" };

export type RadiusConfig = { basePx: number; organic: string };
export const RADIUS_DEFAULTS: RadiusConfig = { basePx: 12, organic: "1rem" };

export type ShadowConfig = { sm: string; md: string; lg: string };
export const SHADOW_DEFAULTS: ShadowConfig = {
  sm: "3px 3px 0 0 var(--ds-border)",
  md: "6px 6px 0 0 var(--ds-border)",
  lg: "10px 10px 0 0 var(--ds-border)",
};

export type MotionConfig = {
  fastMs: number; normalMs: number; slowMs: number; delayMs: number;
  easing: string; liftPx: number; scale: number;
  respectReducedMotion: boolean;
};
export const MOTION_DEFAULTS: MotionConfig = {
  fastMs: 140, normalMs: 240, slowMs: 420, delayMs: 40,
  easing: "cubic-bezier(0.2, 0.9, 0.3, 1.2)", liftPx: 4, scale: 1.03,
  respectReducedMotion: true,
};

export type AccessibilityConfig = {
  focusRingWidthPx: number;
  focusRingColor: string; // hex ou "auto" (usa --ds-focus)
  underlineLinks: boolean;
  fontScaleMultiplier: number; // 0.85–1.4
  minBodyContrastWarning: boolean;
};
export const ACCESSIBILITY_DEFAULTS: AccessibilityConfig = {
  focusRingWidthPx: 3,
  focusRingColor: "auto",
  underlineLinks: false,
  fontScaleMultiplier: 1,
  minBodyContrastWarning: true,
};

/* --------------------------------------------------------------- TUDO */

export type DesignConfig = {
  light: ModeColors;
  dark: ModeColors;
  typography: TypographyConfig;
  layout: LayoutConfig;
  spacing: SpacingConfig;
  border: BorderConfig;
  radius: RadiusConfig;
  shadow: ShadowConfig;
  motion: MotionConfig;
  accessibility: AccessibilityConfig;
  colorModeDefault: "light" | "dark" | "system";
};

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  light: LIGHT_DEFAULTS,
  dark: DARK_DEFAULTS,
  typography: TYPOGRAPHY_DEFAULTS,
  layout: LAYOUT_DEFAULTS,
  spacing: SPACING_DEFAULTS,
  border: BORDER_DEFAULTS,
  radius: RADIUS_DEFAULTS,
  shadow: SHADOW_DEFAULTS,
  motion: MOTION_DEFAULTS,
  accessibility: ACCESSIBILITY_DEFAULTS,
  colorModeDefault: "system",
};

/** Faz merge raso + por grupo, protegendo contra JSON parcial vindo do banco. */
export function normalizeDesignConfig(raw: unknown): DesignConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<DesignConfig>;
  return {
    light: { ...LIGHT_DEFAULTS, ...(r.light ?? {}) },
    dark: { ...DARK_DEFAULTS, ...(r.dark ?? {}) },
    typography: { ...TYPOGRAPHY_DEFAULTS, ...(r.typography ?? {}) },
    layout: { ...LAYOUT_DEFAULTS, ...(r.layout ?? {}) },
    spacing: { ...SPACING_DEFAULTS, ...(r.spacing ?? {}) },
    border: { ...BORDER_DEFAULTS, ...(r.border ?? {}) },
    radius: { ...RADIUS_DEFAULTS, ...(r.radius ?? {}) },
    shadow: { ...SHADOW_DEFAULTS, ...(r.shadow ?? {}) },
    motion: { ...MOTION_DEFAULTS, ...(r.motion ?? {}) },
    accessibility: { ...ACCESSIBILITY_DEFAULTS, ...(r.accessibility ?? {}) },
    colorModeDefault: r.colorModeDefault ?? "system",
  };
}

/** Luminância relativa simples (sRGB) pra decidir texto preto/branco automático. */
function contrastColor(hex: string): string {
  const m = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return "#ffffff";
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.5 ? "#111111" : "#ffffff";
}

function resolveOn(value: string, base: string): string {
  return value === "auto" ? contrastColor(base) : value;
}

export type ColorMode = "light" | "dark";

/** Resolve o config inteiro num único mapa de CSS Custom Properties, para o modo dado. */
export function resolveTokens(config: DesignConfig, mode: ColorMode): TokenMap {
  const c = config.light && config.dark ? config : normalizeDesignConfig(config);
  const colors = mode === "dark" ? c.dark : c.light;
  const t = c.typography;
  const l = c.layout;
  const sp = c.spacing;
  const bd = c.border;
  const rd = c.radius;
  const sh = c.shadow;
  const mo = c.motion;
  const ax = c.accessibility;

  const reduceMotion =
    mo.respectReducedMotion &&
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const tokens: TokenMap = {
    // cores
    "--ds-background": colors.background,
    "--ds-surface": colors.surface,
    "--ds-text-primary": colors.textPrimary,
    "--ds-text-secondary": colors.textSecondary,
    "--ds-primary": colors.primary,
    "--ds-secondary": colors.secondary,
    "--ds-accent": colors.accent,
    "--ds-border": colors.border,
    "--ds-focus": colors.focus,
    "--ds-success": colors.success,
    "--ds-warning": colors.warning,
    "--ds-error": colors.error,
    "--ds-on-primary": resolveOn(colors.onPrimary, colors.primary),
    "--ds-on-secondary": resolveOn(colors.onSecondary, colors.secondary),
    "--ds-on-accent": resolveOn(colors.onAccent, colors.accent),
    "--ds-bg-image": colors.backgroundImageUrl ? `url("${colors.backgroundImageUrl}")` : "none",
    "--ds-bg-image-opacity": String(colors.backgroundImageOpacity),
    "--ds-bg-image-size": colors.backgroundImageSize === "repeat" ? "auto" : colors.backgroundImageSize,
    "--ds-bg-image-repeat": colors.backgroundImageSize === "repeat" ? "repeat" : "no-repeat",
    "--ds-bg-image-blend": colors.backgroundImageBlend,

    // tipografia
    "--ds-font-display": fontStack(t.fontDisplay, t.fontDisplayFallback),
    "--ds-font-body": fontStack(t.fontBody, t.fontBodyFallback),
    "--ds-display-weight": String(t.displayWeight),
    "--ds-body-weight": String(t.bodyWeight),
    "--ds-display-tracking": `${t.displayTrackingEm}em`,
    "--ds-body-tracking": `${t.bodyTrackingEm}em`,
    "--ds-display-leading": String(t.displayLeading),
    "--ds-body-leading": String(t.bodyLeading),
    "--ds-scale-ratio": String(t.scaleRatio),
    "--ds-font-scale": String(ax.fontScaleMultiplier),
    ...(() => {
      // Escala tipográfica calculada em JS (CSS não tem pow() portável) e
      // exposta já em rem, aplicando o multiplicador de acessibilidade.
      const base = t.baseFontSizePx * ax.fontScaleMultiplier;
      const step = (n: number) => `${((base * t.scaleRatio ** n) / 16).toFixed(3)}rem`;
      return {
        "--ds-text-xs": step(-1.15),
        "--ds-text-sm": step(-0.6),
        "--ds-text-base": step(0),
        "--ds-text-lg": step(1),
        "--ds-text-xl": step(2),
        "--ds-text-2xl": step(3),
        "--ds-text-3xl": step(4),
        "--ds-text-4xl": step(5),
      };
    })(),

    // layout / grid
    "--ds-grid-columns": String(l.gridColumns),
    "--ds-grid-max": `${l.gridMaxWidthRem}rem`,
    "--ds-grid-gutter": `${l.gridGutterRem}rem`,
    "--ds-grid-margin": `${l.gridMarginRem}rem`,
    "--ds-grid-offset": `${l.gridOffsetRem}rem`,
    "--ds-card-ratio": l.cardRatio,

    // espaçamento
    "--ds-space-xs": `${sp.xsRem}rem`,
    "--ds-space-sm": `${sp.smRem}rem`,
    "--ds-space-md": `${sp.mdRem}rem`,
    "--ds-space-lg": `${sp.lgRem}rem`,
    "--ds-space-xl": `${sp.xlRem}rem`,
    "--ds-space-2xl": `${sp.xl2Rem}rem`,
    "--ds-space-3xl": `${sp.xl3Rem}rem`,

    // borda / raio
    "--ds-border-width": `${bd.widthPx}px`,
    "--ds-border-style": bd.style,
    "--ds-radius-base": `${rd.basePx}px`,
    "--ds-radius-organic": rd.organic,

    // sombra
    "--ds-shadow-sm": sh.sm,
    "--ds-shadow-md": sh.md,
    "--ds-shadow-lg": sh.lg,

    // motion
    "--ds-motion-fast": reduceMotion ? "0ms" : `${mo.fastMs}ms`,
    "--ds-motion-normal": reduceMotion ? "0ms" : `${mo.normalMs}ms`,
    "--ds-motion-slow": reduceMotion ? "0ms" : `${mo.slowMs}ms`,
    "--ds-motion-delay": reduceMotion ? "0ms" : `${mo.delayMs}ms`,
    "--ds-motion-ease": mo.easing,
    "--ds-motion-lift": reduceMotion ? "0px" : `${mo.liftPx}px`,
    "--ds-motion-scale": reduceMotion ? "1" : String(mo.scale),

    // acessibilidade
    "--ds-focus-width": `${ax.focusRingWidthPx}px`,
    "--ds-focus-color": ax.focusRingColor === "auto" ? colors.focus : ax.focusRingColor,
    "--ds-link-decoration": ax.underlineLinks ? "underline" : "none",
  };

  return tokens;
}

/** Aplica os tokens no elemento raiz, alterna .dark e carrega as fontes escolhidas. */
export function applyDesign(config: DesignConfig, mode: ColorMode, el: HTMLElement = document.documentElement) {
  const c = normalizeDesignConfig(config);
  const tokens = resolveTokens(c, mode);
  for (const [k, v] of Object.entries(tokens)) el.style.setProperty(k, v);
  el.classList.toggle("dark", mode === "dark");
  el.style.colorScheme = mode;
  ensureGoogleFontsLoaded([c.typography.fontDisplay, c.typography.fontBody]);
}

/** Mantido por compatibilidade com chamadas antigas (aplica um TokenMap já resolvido). */
export function applyTokens(tokens: TokenMap, el: HTMLElement) {
  for (const [k, v] of Object.entries(tokens)) el.style.setProperty(k, v);
}

/* --------------------------------------------------- MODO DE COR ATUAL */

const MODE_STORAGE_KEY = "portfolio-color-mode";

export function getSystemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

export function getStoredColorMode(): ColorMode | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(MODE_STORAGE_KEY);
  return v === "light" || v === "dark" ? v : null;
}

export function setStoredColorMode(mode: ColorMode | "system") {
  if (typeof window === "undefined") return;
  if (mode === "system") window.localStorage.removeItem(MODE_STORAGE_KEY);
  else window.localStorage.setItem(MODE_STORAGE_KEY, mode);
}

export function resolveActiveMode(config: DesignConfig): ColorMode {
  const stored = getStoredColorMode();
  if (stored) return stored;
  if (config.colorModeDefault === "light" || config.colorModeDefault === "dark") {
    return config.colorModeDefault;
  }
  return getSystemPrefersDark() ? "dark" : "light";
}

/**
 * Simples estimativa de contraste (WCAG) entre duas cores hex, pra avisos no painel.
 * Retorna null se alguma cor não for hex simples (ex.: rgba/oklch já configurados).
 */
export function contrastRatio(hexA: string, hexB: string): number | null {
  const lum = (hex: string): number | null => {
    const m = hex.replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
    const r = parseInt(m.slice(0, 2), 16) / 255;
    const g = parseInt(m.slice(2, 4), 16) / 255;
    const b = parseInt(m.slice(4, 6), 16) / 255;
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const la = lum(hexA);
  const lb = lum(hexB);
  if (la === null || lb === null) return null;
  const lighter = Math.max(la, lb) + 0.05;
  const darker = Math.min(la, lb) + 0.05;
  return lighter / darker;
}
