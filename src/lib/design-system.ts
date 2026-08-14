/**
 * DESIGN SYSTEM AUTORAL
 * Nenhuma identidade é definitiva: tudo aqui é token.
 * Cada preset devolve um mapa de CSS Custom Properties aplicado em <html>.
 */

export type TokenMap = Record<string, string>;

export type Preset<T extends string = string> = {
  id: T;
  label: string;
  description: string;
  tokens: TokenMap;
};

/* ---------------------------------------------------------------- CORES */

export const COLOR_PRESETS: Preset[] = [
  {
    id: "vibrante",
    label: "Vibrante",
    description: "Riso, contraste alto, acentos elétricos.",
    tokens: {
      "--ds-background": "oklch(0.97 0.02 95)",
      "--ds-surface": "oklch(1 0 0)",
      "--ds-text-primary": "oklch(0.16 0.03 275)",
      "--ds-text-secondary": "oklch(0.45 0.03 275)",
      "--ds-primary": "oklch(0.65 0.24 15)",
      "--ds-secondary": "oklch(0.87 0.18 95)",
      "--ds-accent": "oklch(0.55 0.22 265)",
      "--ds-border": "oklch(0.16 0.03 275)",
      "--ds-focus": "oklch(0.55 0.22 265)",
    },
  },
  {
    id: "monocromatica",
    label: "Monocromática",
    description: "Preto, branco e um cinza que resolve tudo.",
    tokens: {
      "--ds-background": "oklch(0.98 0 0)",
      "--ds-surface": "oklch(1 0 0)",
      "--ds-text-primary": "oklch(0.15 0 0)",
      "--ds-text-secondary": "oklch(0.45 0 0)",
      "--ds-primary": "oklch(0.2 0 0)",
      "--ds-secondary": "oklch(0.88 0 0)",
      "--ds-accent": "oklch(0.45 0 0)",
      "--ds-border": "oklch(0.15 0 0)",
      "--ds-focus": "oklch(0.35 0 0)",
    },
  },
  {
    id: "pastel",
    label: "Pastel",
    description: "Suave, arejada, baixa saturação.",
    tokens: {
      "--ds-background": "oklch(0.98 0.02 330)",
      "--ds-surface": "oklch(0.99 0.01 330)",
      "--ds-text-primary": "oklch(0.28 0.05 300)",
      "--ds-text-secondary": "oklch(0.52 0.04 300)",
      "--ds-primary": "oklch(0.78 0.11 15)",
      "--ds-secondary": "oklch(0.88 0.09 180)",
      "--ds-accent": "oklch(0.82 0.1 280)",
      "--ds-border": "oklch(0.45 0.05 300)",
      "--ds-focus": "oklch(0.62 0.13 280)",
    },
  },
  {
    id: "brutalista",
    label: "Brutalista",
    description: "Papel cru, tinta chapada, zero decoração.",
    tokens: {
      "--ds-background": "oklch(0.95 0.03 100)",
      "--ds-surface": "oklch(0.99 0.01 100)",
      "--ds-text-primary": "oklch(0.12 0 0)",
      "--ds-text-secondary": "oklch(0.4 0 0)",
      "--ds-primary": "oklch(0.55 0.25 30)",
      "--ds-secondary": "oklch(0.9 0.2 100)",
      "--ds-accent": "oklch(0.12 0 0)",
      "--ds-border": "oklch(0.12 0 0)",
      "--ds-focus": "oklch(0.55 0.25 30)",
    },
  },
  {
    id: "minimalista",
    label: "Minimalista",
    description: "Branco, respiro, um único acento.",
    tokens: {
      "--ds-background": "oklch(1 0 0)",
      "--ds-surface": "oklch(0.985 0 0)",
      "--ds-text-primary": "oklch(0.2 0.01 260)",
      "--ds-text-secondary": "oklch(0.55 0.01 260)",
      "--ds-primary": "oklch(0.45 0.09 250)",
      "--ds-secondary": "oklch(0.94 0.01 260)",
      "--ds-accent": "oklch(0.6 0.08 200)",
      "--ds-border": "oklch(0.85 0.01 260)",
      "--ds-focus": "oklch(0.45 0.09 250)",
    },
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Papel jornal, tinta quente, ar de revista.",
    tokens: {
      "--ds-background": "oklch(0.96 0.015 85)",
      "--ds-surface": "oklch(0.99 0.01 85)",
      "--ds-text-primary": "oklch(0.2 0.02 40)",
      "--ds-text-secondary": "oklch(0.47 0.03 40)",
      "--ds-primary": "oklch(0.45 0.15 25)",
      "--ds-secondary": "oklch(0.88 0.06 75)",
      "--ds-accent": "oklch(0.38 0.09 200)",
      "--ds-border": "oklch(0.2 0.02 40)",
      "--ds-focus": "oklch(0.45 0.15 25)",
    },
  },
  {
    id: "tecnologica",
    label: "Tecnológica",
    description: "Escura, neon contido, terminal.",
    tokens: {
      "--ds-background": "oklch(0.17 0.02 260)",
      "--ds-surface": "oklch(0.22 0.03 260)",
      "--ds-text-primary": "oklch(0.96 0.01 260)",
      "--ds-text-secondary": "oklch(0.75 0.02 260)",
      "--ds-primary": "oklch(0.75 0.18 180)",
      "--ds-secondary": "oklch(0.3 0.05 260)",
      "--ds-accent": "oklch(0.7 0.2 300)",
      "--ds-border": "oklch(0.45 0.04 260)",
      "--ds-focus": "oklch(0.75 0.18 180)",
    },
  },
  {
    id: "organica",
    label: "Orgânica",
    description: "Terra, musgo, argila.",
    tokens: {
      "--ds-background": "oklch(0.95 0.02 90)",
      "--ds-surface": "oklch(0.98 0.015 90)",
      "--ds-text-primary": "oklch(0.25 0.04 130)",
      "--ds-text-secondary": "oklch(0.48 0.04 130)",
      "--ds-primary": "oklch(0.5 0.11 145)",
      "--ds-secondary": "oklch(0.85 0.07 80)",
      "--ds-accent": "oklch(0.58 0.13 45)",
      "--ds-border": "oklch(0.3 0.04 130)",
      "--ds-focus": "oklch(0.5 0.11 145)",
    },
  },
  {
    id: "retro",
    label: "Retrô",
    description: "Mostarda, laranja queimado, marrom.",
    tokens: {
      "--ds-background": "oklch(0.94 0.04 85)",
      "--ds-surface": "oklch(0.97 0.03 85)",
      "--ds-text-primary": "oklch(0.26 0.05 55)",
      "--ds-text-secondary": "oklch(0.48 0.05 55)",
      "--ds-primary": "oklch(0.6 0.16 45)",
      "--ds-secondary": "oklch(0.83 0.14 90)",
      "--ds-accent": "oklch(0.45 0.1 170)",
      "--ds-border": "oklch(0.26 0.05 55)",
      "--ds-focus": "oklch(0.6 0.16 45)",
    },
  },
  {
    id: "futurista",
    label: "Futurista",
    description: "Grafite frio com halo elétrico.",
    tokens: {
      "--ds-background": "oklch(0.14 0.02 285)",
      "--ds-surface": "oklch(0.2 0.03 285)",
      "--ds-text-primary": "oklch(0.97 0.01 285)",
      "--ds-text-secondary": "oklch(0.76 0.02 285)",
      "--ds-primary": "oklch(0.7 0.22 320)",
      "--ds-secondary": "oklch(0.28 0.05 285)",
      "--ds-accent": "oklch(0.78 0.17 210)",
      "--ds-border": "oklch(0.5 0.06 285)",
      "--ds-focus": "oklch(0.78 0.17 210)",
    },
  },
  {
    id: "maximalista",
    label: "Maximalista",
    description: "Muita cor, muito volume, sem pedir licença.",
    tokens: {
      "--ds-background": "oklch(0.95 0.06 320)",
      "--ds-surface": "oklch(0.99 0.03 320)",
      "--ds-text-primary": "oklch(0.18 0.05 300)",
      "--ds-text-secondary": "oklch(0.42 0.08 300)",
      "--ds-primary": "oklch(0.62 0.26 340)",
      "--ds-secondary": "oklch(0.85 0.2 110)",
      "--ds-accent": "oklch(0.6 0.24 260)",
      "--ds-border": "oklch(0.18 0.05 300)",
      "--ds-focus": "oklch(0.6 0.24 260)",
    },
  },
  {
    id: "experimental",
    label: "Experimental",
    description: "Combinações improváveis que funcionam.",
    tokens: {
      "--ds-background": "oklch(0.93 0.08 200)",
      "--ds-surface": "oklch(0.98 0.04 200)",
      "--ds-text-primary": "oklch(0.17 0.06 340)",
      "--ds-text-secondary": "oklch(0.44 0.07 340)",
      "--ds-primary": "oklch(0.55 0.25 350)",
      "--ds-secondary": "oklch(0.9 0.18 140)",
      "--ds-accent": "oklch(0.35 0.15 290)",
      "--ds-border": "oklch(0.17 0.06 340)",
      "--ds-focus": "oklch(0.55 0.25 350)",
    },
  },
];

/* ----------------------------------------------------------- TIPOGRAFIA */

export const TYPOGRAPHY_PRESETS: Preset[] = [
  {
    id: "grotesk",
    label: "Grotesk pesada",
    description: "Archivo Black + Space Grotesk.",
    tokens: {
      "--ds-font-display": '"Archivo Black", ui-sans-serif, system-ui, sans-serif',
      "--ds-font-body": '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
      "--ds-display-weight": "400",
      "--ds-body-weight": "400",
      "--ds-display-tracking": "-0.02em",
      "--ds-body-tracking": "0em",
      "--ds-display-leading": "0.95",
      "--ds-body-leading": "1.6",
      "--ds-scale-ratio": "1.28",
    },
  },
  {
    id: "editorial",
    label: "Editorial serifada",
    description: "Instrument Serif + Work Sans.",
    tokens: {
      "--ds-font-display": '"Instrument Serif", Georgia, serif',
      "--ds-font-body": '"Work Sans", ui-sans-serif, system-ui, sans-serif',
      "--ds-display-weight": "400",
      "--ds-body-weight": "400",
      "--ds-display-tracking": "-0.01em",
      "--ds-body-tracking": "0.005em",
      "--ds-display-leading": "1.02",
      "--ds-body-leading": "1.7",
      "--ds-scale-ratio": "1.25",
    },
  },
  {
    id: "neutra",
    label: "Neutra",
    description: "Uma família só, pesos diferentes.",
    tokens: {
      "--ds-font-display": '"Work Sans", ui-sans-serif, system-ui, sans-serif',
      "--ds-font-body": '"Work Sans", ui-sans-serif, system-ui, sans-serif',
      "--ds-display-weight": "700",
      "--ds-body-weight": "400",
      "--ds-display-tracking": "-0.015em",
      "--ds-body-tracking": "0em",
      "--ds-display-leading": "1.05",
      "--ds-body-leading": "1.65",
      "--ds-scale-ratio": "1.22",
    },
  },
  {
    id: "mono",
    label: "Mono técnica",
    description: "Space Mono nos títulos.",
    tokens: {
      "--ds-font-display": '"Space Mono", ui-monospace, monospace',
      "--ds-font-body": '"Work Sans", ui-sans-serif, system-ui, sans-serif',
      "--ds-display-weight": "700",
      "--ds-body-weight": "400",
      "--ds-display-tracking": "-0.03em",
      "--ds-body-tracking": "0.01em",
      "--ds-display-leading": "1.05",
      "--ds-body-leading": "1.65",
      "--ds-scale-ratio": "1.2",
    },
  },
];

/* ----------------------------------------------------------------- GRID */

export const GRID_PRESETS: Preset[] = [
  {
    id: "suico",
    label: "Suíço",
    description: "12 colunas, gutters regulares, tudo alinhado.",
    tokens: {
      "--ds-grid-columns": "3",
      "--ds-grid-max": "72rem",
      "--ds-grid-gutter": "var(--ds-space-lg)",
      "--ds-grid-margin": "var(--ds-space-lg)",
      "--ds-card-ratio": "4 / 3",
      "--ds-grid-offset": "0rem",
    },
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Duas colunas largas, cards altos.",
    tokens: {
      "--ds-grid-columns": "2",
      "--ds-grid-max": "64rem",
      "--ds-grid-gutter": "var(--ds-space-xl)",
      "--ds-grid-margin": "var(--ds-space-xl)",
      "--ds-card-ratio": "3 / 4",
      "--ds-grid-offset": "0rem",
    },
  },
  {
    id: "modular",
    label: "Modular",
    description: "Quatro módulos quadrados.",
    tokens: {
      "--ds-grid-columns": "4",
      "--ds-grid-max": "80rem",
      "--ds-grid-gutter": "var(--ds-space-md)",
      "--ds-grid-margin": "var(--ds-space-md)",
      "--ds-card-ratio": "1 / 1",
      "--ds-grid-offset": "0rem",
    },
  },
  {
    id: "assimetrico",
    label: "Assimétrico",
    description: "Três colunas com deslocamento controlado.",
    tokens: {
      "--ds-grid-columns": "3",
      "--ds-grid-max": "76rem",
      "--ds-grid-gutter": "var(--ds-space-lg)",
      "--ds-grid-margin": "var(--ds-space-2xl)",
      "--ds-card-ratio": "16 / 10",
      "--ds-grid-offset": "2rem",
    },
  },
];

/* ---------------------------------------------------------- ESPAÇAMENTO */

export const SPACING_PRESETS: Preset[] = [
  {
    id: "compacto",
    label: "Compacto",
    description: "Densidade alta, pouca pausa.",
    tokens: {
      "--ds-space-xs": "0.25rem",
      "--ds-space-sm": "0.5rem",
      "--ds-space-md": "0.75rem",
      "--ds-space-lg": "1.25rem",
      "--ds-space-xl": "2rem",
      "--ds-space-2xl": "3rem",
      "--ds-space-3xl": "4.5rem",
    },
  },
  {
    id: "normal",
    label: "Normal",
    description: "Escala equilibrada de 4px.",
    tokens: {
      "--ds-space-xs": "0.25rem",
      "--ds-space-sm": "0.75rem",
      "--ds-space-md": "1rem",
      "--ds-space-lg": "1.5rem",
      "--ds-space-xl": "2.5rem",
      "--ds-space-2xl": "4rem",
      "--ds-space-3xl": "6rem",
    },
  },
  {
    id: "arejado",
    label: "Arejado",
    description: "Muito respiro entre blocos.",
    tokens: {
      "--ds-space-xs": "0.375rem",
      "--ds-space-sm": "1rem",
      "--ds-space-md": "1.5rem",
      "--ds-space-lg": "2.25rem",
      "--ds-space-xl": "3.5rem",
      "--ds-space-2xl": "5.5rem",
      "--ds-space-3xl": "8rem",
    },
  },
];

/* ------------------------------------------------------- BORDA / RAIO */

export const BORDER_PRESETS: Preset[] = [
  {
    id: "sem",
    label: "Sem borda",
    description: "Separação por cor e espaço.",
    tokens: { "--ds-border-width": "0px", "--ds-border-style": "solid" },
  },
  {
    id: "fina",
    label: "Fina",
    description: "1px discreto.",
    tokens: { "--ds-border-width": "1px", "--ds-border-style": "solid" },
  },
  {
    id: "marcada",
    label: "Marcada",
    description: "3px de contorno.",
    tokens: { "--ds-border-width": "3px", "--ds-border-style": "solid" },
  },
  {
    id: "tracejada",
    label: "Tracejada",
    description: "2px tracejado, ar de maquete.",
    tokens: { "--ds-border-width": "2px", "--ds-border-style": "dashed" },
  },
];

export const RADIUS_PRESETS: Preset[] = [
  {
    id: "reto",
    label: "Reto",
    description: "Nada arredondado.",
    tokens: { "--ds-radius-base": "0rem", "--ds-radius-organic": "0rem" },
  },
  {
    id: "leve",
    label: "Levemente arredondado",
    description: "Cantos suaves.",
    tokens: { "--ds-radius-base": "0.375rem", "--ds-radius-organic": "0.5rem" },
  },
  {
    id: "media",
    label: "Médio",
    description: "Padrão do sistema.",
    tokens: { "--ds-radius-base": "0.75rem", "--ds-radius-organic": "1rem" },
  },
  {
    id: "muito",
    label: "Muito arredondado",
    description: "Pílulas por toda parte.",
    tokens: { "--ds-radius-base": "1.5rem", "--ds-radius-organic": "2rem" },
  },
  {
    id: "organico",
    label: "Orgânico",
    description: "Cantos irregulares, forma de seixo.",
    tokens: { "--ds-radius-base": "1.25rem", "--ds-radius-organic": "62% 38% 45% 55% / 48% 52% 48% 52%" },
  },
];

/* -------------------------------------------------------------- SOMBRAS */

export const SHADOW_PRESETS: Preset[] = [
  {
    id: "nenhuma",
    label: "Nenhuma",
    description: "Superfícies planas.",
    tokens: {
      "--ds-shadow-sm": "none",
      "--ds-shadow-md": "none",
      "--ds-shadow-lg": "none",
    },
  },
  {
    id: "suave",
    label: "Suave",
    description: "Elevação discreta e difusa.",
    tokens: {
      "--ds-shadow-sm": "0 1px 2px color-mix(in oklab, var(--ds-text-primary) 12%, transparent)",
      "--ds-shadow-md": "0 8px 20px -12px color-mix(in oklab, var(--ds-text-primary) 40%, transparent)",
      "--ds-shadow-lg": "0 24px 48px -28px color-mix(in oklab, var(--ds-text-primary) 55%, transparent)",
    },
  },
  {
    id: "dura",
    label: "Dura",
    description: "Deslocamento sólido, sem blur.",
    tokens: {
      "--ds-shadow-sm": "3px 3px 0 0 var(--ds-border)",
      "--ds-shadow-md": "6px 6px 0 0 var(--ds-border)",
      "--ds-shadow-lg": "10px 10px 0 0 var(--ds-border)",
    },
  },
];

/* --------------------------------------------------------------- MOTION */

export const MOTION_PRESETS: Preset[] = [
  {
    id: "nenhum",
    label: "Sem movimento",
    description: "Transições instantâneas.",
    tokens: {
      "--ds-motion-fast": "0ms",
      "--ds-motion-normal": "0ms",
      "--ds-motion-slow": "0ms",
      "--ds-motion-delay": "0ms",
      "--ds-motion-ease": "linear",
      "--ds-motion-lift": "0px",
      "--ds-motion-scale": "1",
    },
  },
  {
    id: "sutil",
    label: "Sutil",
    description: "Só o necessário para dar retorno.",
    tokens: {
      "--ds-motion-fast": "90ms",
      "--ds-motion-normal": "160ms",
      "--ds-motion-slow": "260ms",
      "--ds-motion-delay": "0ms",
      "--ds-motion-ease": "cubic-bezier(0.2, 0, 0, 1)",
      "--ds-motion-lift": "2px",
      "--ds-motion-scale": "1.01",
    },
  },
  {
    id: "normal",
    label: "Normal",
    description: "Feedback claro em hover, foco e reveal.",
    tokens: {
      "--ds-motion-fast": "140ms",
      "--ds-motion-normal": "240ms",
      "--ds-motion-slow": "420ms",
      "--ds-motion-delay": "40ms",
      "--ds-motion-ease": "cubic-bezier(0.2, 0.9, 0.3, 1.2)",
      "--ds-motion-lift": "4px",
      "--ds-motion-scale": "1.03",
    },
  },
  {
    id: "expressivo",
    label: "Expressivo",
    description: "Mais amplitude, sem travar a navegação.",
    tokens: {
      "--ds-motion-fast": "180ms",
      "--ds-motion-normal": "320ms",
      "--ds-motion-slow": "560ms",
      "--ds-motion-delay": "60ms",
      "--ds-motion-ease": "cubic-bezier(0.2, 1.1, 0.3, 1.35)",
      "--ds-motion-lift": "7px",
      "--ds-motion-scale": "1.05",
    },
  },
];

/* ------------------------------------------------------------ RESOLUÇÃO */

export const PRESET_GROUPS = {
  theme: { key: "theme_preset", label: "Paleta", presets: COLOR_PRESETS },
  typography: { key: "typography_preset", label: "Tipografia", presets: TYPOGRAPHY_PRESETS },
  grid: { key: "grid_preset", label: "Grid", presets: GRID_PRESETS },
  spacing: { key: "spacing_preset", label: "Espaçamento", presets: SPACING_PRESETS },
  border: { key: "border_preset", label: "Bordas", presets: BORDER_PRESETS },
  radius: { key: "radius_preset", label: "Border radius", presets: RADIUS_PRESETS },
  shadow: { key: "shadow_preset", label: "Sombras", presets: SHADOW_PRESETS },
  motion: { key: "motion_preset", label: "Movimento", presets: MOTION_PRESETS },
} as const;

export type PresetGroupId = keyof typeof PRESET_GROUPS;

function pick(list: Preset[], id: string | undefined | null): Preset {
  return list.find((p) => p.id === id) ?? list[0]!;
}

export type DesignConfig = {
  theme_preset?: string | null;
  typography_preset?: string | null;
  grid_preset?: string | null;
  spacing_preset?: string | null;
  border_preset?: string | null;
  radius_preset?: string | null;
  shadow_preset?: string | null;
  motion_preset?: string | null;
  /** Acentos personalizados sobrescrevem a paleta escolhida. */
  accent_1?: string | null;
  accent_2?: string | null;
  accent_3?: string | null;
};

/** Resolve todos os presets em um único mapa de CSS Custom Properties. */
export function resolveTokens(config: DesignConfig | null | undefined): TokenMap {
  const c = config ?? {};
  const tokens: TokenMap = {
    ...pick(SPACING_PRESETS, c.spacing_preset).tokens,
    ...pick(COLOR_PRESETS, c.theme_preset).tokens,
    ...pick(TYPOGRAPHY_PRESETS, c.typography_preset).tokens,
    ...pick(GRID_PRESETS, c.grid_preset).tokens,
    ...pick(BORDER_PRESETS, c.border_preset).tokens,
    ...pick(RADIUS_PRESETS, c.radius_preset).tokens,
    ...pick(SHADOW_PRESETS, c.shadow_preset).tokens,
    ...pick(MOTION_PRESETS, c.motion_preset).tokens,
  };

  if (c.accent_1) tokens["--ds-primary"] = c.accent_1;
  if (c.accent_2) tokens["--ds-secondary"] = c.accent_2;
  if (c.accent_3) {
    tokens["--ds-accent"] = c.accent_3;
    tokens["--ds-focus"] = c.accent_3;
  }

  return tokens;
}

/** Aplica os tokens no elemento raiz (client-side). */
export function applyTokens(tokens: TokenMap, el: HTMLElement) {
  for (const [k, v] of Object.entries(tokens)) el.style.setProperty(k, v);
}
