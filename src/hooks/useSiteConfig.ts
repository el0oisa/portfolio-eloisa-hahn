import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/portfolio";
import { applyTokens, resolveTokens } from "@/lib/design-system";
import { resolveCopy, type CopyOverrides } from "@/lib/voice";

/**
 * Aplica os tokens do design system em <html> e devolve os textos
 * já resolvidos pelo tom de voz configurado.
 */
export function useSiteConfig() {
  const { data: settings } = useQuery(settingsQuery);

  const tokens = useMemo(() => resolveTokens(settings), [settings]);

  const copy = useMemo(
    () =>
      resolveCopy(
        (settings as { tone_preset?: string } | null | undefined)?.tone_preset,
        (settings as { copy_overrides?: CopyOverrides } | null | undefined)?.copy_overrides,
      ),
    [settings],
  );

  useEffect(() => {
    applyTokens(tokens, document.documentElement);
  }, [tokens]);

  return { settings, copy, tokens };
}
