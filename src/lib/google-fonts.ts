/**
 * Google Fonts helper.
 *
 * Não dependemos de uma lista fechada: qualquer nome de família válido no
 * Google Fonts funciona, porque a URL da CSS2 API é montada dinamicamente.
 * A lista abaixo é só uma sugestão de partida pra busca/autocomplete no painel.
 */

export const GOOGLE_FONT_SUGGESTIONS: string[] = [
  // Sans
  "Inter", "Work Sans", "Space Grotesk", "Manrope", "Sora", "Outfit",
  "Plus Jakarta Sans", "DM Sans", "Epilogue", "Public Sans", "Figtree",
  "Urbanist", "Archivo", "Archivo Black", "Poppins", "Montserrat",
  "Rubik", "Karla", "Lexend", "Barlow", "IBM Plex Sans", "Nunito",
  "Nunito Sans", "Mulish", "Onest", "Geist",
  // Serif / Display
  "Playfair Display", "Instrument Serif", "Fraunces", "Lora", "Cormorant",
  "Cormorant Garamond", "Libre Baskerville", "Bitter", "PT Serif",
  "Crimson Pro", "Newsreader", "Source Serif 4", "Spectral", "DM Serif Display",
  "Petrona", "Zilla Slab",
  // Mono
  "Space Mono", "JetBrains Mono", "IBM Plex Mono", "Fira Code",
  "Roboto Mono", "Source Code Pro", "Azeret Mono",
  // Expressivo / display
  "Bebas Neue", "Anton", "Unbounded", "Syne", "Clash Display",
  "Big Shoulders Display", "Righteous", "Chivo", "Fraunces",
  "Grandstander", "Kalam", "Caveat", "Shrikhand",
];

const loadedLinkIds = new Set<string>();

/** Monta a URL da Google Fonts CSS2 API para uma lista de famílias. */
export function googleFontsHref(families: string[]): string {
  const unique = [...new Set(families.filter(Boolean))];
  const parts = unique.map(
    (f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@300;400;500;600;700;800;900`,
  );
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}

/** Injeta (ou atualiza) uma tag <link> que carrega as famílias pedidas. */
export function ensureGoogleFontsLoaded(families: string[], linkId = "ds-google-fonts") {
  if (typeof document === "undefined") return;
  const cleaned = [...new Set(families.filter(Boolean))];
  const cacheKey = cleaned.sort().join("|");
  if (loadedLinkIds.has(cacheKey)) return;

  let link = document.getElementById(linkId) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = googleFontsHref(cleaned);
  loadedLinkIds.add(cacheKey);
}

/** Nome da família "limpo" pronto pra usar em font-family CSS (com fallback). */
export function fontStack(family: string, fallback: "sans" | "serif" | "mono" = "sans") {
  const fallbacks = {
    sans: "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    mono: "ui-monospace, SFMono-Regular, monospace",
  }[fallback];
  return `"${family}", ${fallbacks}`;
}
