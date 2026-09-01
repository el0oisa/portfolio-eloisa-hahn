import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/portfolio";
import {
  applyDesign,
  normalizeDesignConfig,
  resolveActiveMode,
  setStoredColorMode,
  type ColorMode,
} from "@/lib/design-system";
import { resolveCopy, type CopyOverrides } from "@/lib/voice";

/**
 * Aplica o DesignConfig (light/dark, tipografia, layout, motion,
 * acessibilidade) em <html> e devolve os textos já resolvidos pelo tom
 * de voz configurado, além do modo de cor ativo e um toggle.
 */
export function useSiteConfig() {
  const { data: settings } = useQuery(settingsQuery);

  const design = useMemo(
    () => normalizeDesignConfig((settings as { design_config?: unknown } | null | undefined)?.design_config),
    [settings],
  );

  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    setMode(resolveActiveMode(design));
  }, [design]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setMode(resolveActiveMode(design));
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [design]);

  useEffect(() => {
    applyDesign(design, mode);
  }, [design, mode]);

  const copy = useMemo(
    () =>
      resolveCopy(
        (settings as { tone_preset?: string } | null | undefined)?.tone_preset,
        (settings as { copy_overrides?: CopyOverrides } | null | undefined)?.copy_overrides,
      ),
    [settings],
  );

  function toggleMode() {
    const next: ColorMode = mode === "dark" ? "light" : "dark";
    setStoredColorMode(next);
    setMode(next);
  }

  return { settings, copy, design, mode, toggleMode };
}
