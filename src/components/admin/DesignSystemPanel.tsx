import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, uploadMedia } from "@/lib/portfolio";
import { Field, PrimaryButton, GhostButton, inputClass } from "@/components/admin/AdminShell";
import {
  applyDesign,
  contrastRatio,
  normalizeDesignConfig,
  type ColorMode,
  type DesignConfig,
  type ModeColors,
} from "@/lib/design-system";
import { GOOGLE_FONT_SUGGESTIONS } from "@/lib/google-fonts";
import { TONES, COPY_FIELDS, resolveCopy, type CopyKey, type CopyOverrides } from "@/lib/voice";

type SettingsRow = Record<string, unknown> & { id: string };

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isHex = /^#([0-9a-fA-F]{6})$/.test(value);
  return (
    <Field label={label}>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          className="ink-border h-10 w-12 shrink-0 rounded-lg"
          value={isHex ? value : "#888888"}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className={inputClass + " mt-0"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000, rgba(...), auto"
        />
      </div>
    </Field>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={`${label} — ${value}${unit}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-primary"
      />
    </Field>
  );
}

function FontField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const listId = `fonts-${label.replace(/\s+/g, "-")}`;
  return (
    <Field label={label} hint="Digite qualquer fonte do Google Fonts — não precisa estar na lista.">
      <input
        list={listId}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id={listId}>
        {GOOGLE_FONT_SUGGESTIONS.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>
    </Field>
  );
}

export function DesignSystemPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const settings = data as SettingsRow | null;
  const [config, setConfig] = useState<DesignConfig>(() => normalizeDesignConfig(null));
  const [mode, setMode] = useState<ColorMode>("light");
  const [saving, setSaving] = useState(false);
  const [bgBusy, setBgBusy] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setConfig(normalizeDesignConfig(settings["design_config"]));
  }, [settings]);

  // pré-visualização ao vivo no próprio painel
  useEffect(() => {
    applyDesign(config, mode);
  }, [config, mode]);

  const colors = config[mode];

  function setColors(patch: Partial<ModeColors>) {
    setConfig((c) => ({ ...c, [mode]: { ...c[mode], ...patch } }));
  }

  const bodyContrast = useMemo(
    () => contrastRatio(colors.textPrimary, colors.background),
    [colors.textPrimary, colors.background],
  );

  async function uploadBackground(file: File) {
    setBgBusy(true);
    try {
      const url = await uploadMedia(file, "background");
      setColors({ backgroundImageUrl: url });
      toast.success("Imagem de fundo carregada. Lembre de salvar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setBgBusy(false);
    }
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("portfolio_settings")
      .update({ design_config: config as unknown as Record<string, unknown> })
      .eq("id", settings.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["settings"] });
    toast.success("Design system atualizado.");
  }

  return (
    <div className="space-y-ds-lg">
      <section className="ink-border hard-shadow space-y-ds-lg rounded-xl bg-background p-ds-lg">
        <div>
          <h2 className="text-fluid-xl uppercase">Design system</h2>
          <p className="text-fluid-sm text-muted-foreground">
            Tudo aqui é 100% livre — sem pacotes fechados. As mudanças aparecem na pré-visualização
            na hora; só valem pro site depois de "Salvar".
          </p>
        </div>

        {/* --------------------------------------------------------- MODO */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">
            Modo padrão do site
          </legend>
          <div className="flex flex-wrap gap-ds-sm">
            {(["light", "dark", "system"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={config.colorModeDefault === m}
                onClick={() => setConfig((c) => ({ ...c, colorModeDefault: m }))}
                className={`ink-border rounded-full px-4 py-1.5 text-sm font-bold ${
                  config.colorModeDefault === m
                    ? "hard-shadow-sm bg-secondary text-secondary-foreground"
                    : "bg-card"
                }`}
              >
                {m === "light" ? "Claro" : m === "dark" ? "Escuro" : "Seguir sistema"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-fluid-xs text-muted-foreground">
            A visitante ainda pode alternar manualmente com o botão no cabeçalho do site.
          </p>
        </fieldset>

        {/* ------------------------------------------------------- CORES */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">
            Cores — editando: {mode === "light" ? "modo claro" : "modo escuro"}
          </legend>
          <div className="mb-ds-md flex gap-ds-sm">
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`ink-border rounded-full px-4 py-1.5 text-sm font-bold ${
                  mode === m ? "hard-shadow-sm bg-secondary text-secondary-foreground" : "bg-card"
                }`}
              >
                {m === "light" ? "☀︎ Claro" : "☾ Escuro"}
              </button>
            ))}
          </div>

          <div className="grid gap-ds-md sm:grid-cols-2 lg:grid-cols-3">
            <ColorField label="Fundo" value={colors.background} onChange={(v) => setColors({ background: v })} />
            <ColorField label="Superfície (cards)" value={colors.surface} onChange={(v) => setColors({ surface: v })} />
            <ColorField label="Texto principal" value={colors.textPrimary} onChange={(v) => setColors({ textPrimary: v })} />
            <ColorField label="Texto secundário" value={colors.textSecondary} onChange={(v) => setColors({ textSecondary: v })} />
            <ColorField label="Primária" value={colors.primary} onChange={(v) => setColors({ primary: v })} />
            <ColorField label="Secundária" value={colors.secondary} onChange={(v) => setColors({ secondary: v })} />
            <ColorField label="Acento" value={colors.accent} onChange={(v) => setColors({ accent: v })} />
            <ColorField label="Borda" value={colors.border} onChange={(v) => setColors({ border: v })} />
            <ColorField label="Foco (teclado)" value={colors.focus} onChange={(v) => setColors({ focus: v })} />
            <ColorField label="Sucesso" value={colors.success} onChange={(v) => setColors({ success: v })} />
            <ColorField label="Aviso" value={colors.warning} onChange={(v) => setColors({ warning: v })} />
            <ColorField label="Erro" value={colors.error} onChange={(v) => setColors({ error: v })} />
          </div>

          <p
            className={`mt-ds-sm text-fluid-xs ${
              bodyContrast !== null && bodyContrast < 4.5 ? "text-destructive font-bold" : "text-muted-foreground"
            }`}
          >
            {bodyContrast === null
              ? "Contraste texto/fundo: não foi possível calcular (cor não está em hex)."
              : `Contraste texto principal × fundo: ${bodyContrast.toFixed(2)}:1 ${
                  bodyContrast < 4.5 ? "— abaixo do mínimo recomendado (4.5:1 para texto normal, WCAG AA)." : "✓ ok."
                }`}
          </p>

          <fieldset className="ink-border mt-ds-md rounded-lg p-ds-md">
            <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">
              Texto sobre cores (contraste automático)
            </legend>
            <div className="grid gap-ds-md sm:grid-cols-3">
              <ColorField label="Sobre a primária" value={colors.onPrimary} onChange={(v) => setColors({ onPrimary: v })} />
              <ColorField label="Sobre a secundária" value={colors.onSecondary} onChange={(v) => setColors({ onSecondary: v })} />
              <ColorField label="Sobre o acento" value={colors.onAccent} onChange={(v) => setColors({ onAccent: v })} />
            </div>
            <p className="mt-ds-xs text-fluid-xs text-muted-foreground">
              Deixe "auto" pra calcular preto/branco automaticamente pelo contraste, ou informe uma cor.
            </p>
          </fieldset>

          <fieldset className="ink-border mt-ds-md rounded-lg p-ds-md">
            <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">
              Textura / imagem de fundo ({mode === "light" ? "claro" : "escuro"})
            </legend>
            <div className="grid gap-ds-md sm:grid-cols-2">
              <Field label="Imagem">
                <input
                  type="file"
                  accept="image/*"
                  disabled={bgBusy}
                  className="mt-1 block text-sm"
                  onChange={(e) => e.target.files?.[0] && uploadBackground(e.target.files[0])}
                />
                {colors.backgroundImageUrl ? (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={colors.backgroundImageUrl}
                      alt=""
                      className="ink-border h-12 w-20 rounded object-cover"
                    />
                    <GhostButton type="button" onClick={() => setColors({ backgroundImageUrl: null })}>
                      Remover
                    </GhostButton>
                  </div>
                ) : null}
              </Field>
              <Field label="Modo de exibição">
                <select
                  className={inputClass}
                  value={colors.backgroundImageSize}
                  onChange={(e) => setColors({ backgroundImageSize: e.target.value as ModeColors["backgroundImageSize"] })}
                >
                  <option value="cover">Cobrir tela</option>
                  <option value="contain">Conter</option>
                  <option value="repeat">Repetir (padrão/textura)</option>
                  <option value="auto">Tamanho original</option>
                </select>
              </Field>
            </div>
            <div className="mt-ds-md grid gap-ds-md sm:grid-cols-2">
              <SliderField
                label="Opacidade"
                value={colors.backgroundImageOpacity}
                min={0}
                max={1}
                step={0.05}
                onChange={(v) => setColors({ backgroundImageOpacity: v })}
              />
              <Field label="Mistura com a cor de fundo">
                <select
                  className={inputClass}
                  value={colors.backgroundImageBlend}
                  onChange={(e) => setColors({ backgroundImageBlend: e.target.value as ModeColors["backgroundImageBlend"] })}
                >
                  {["normal", "multiply", "screen", "overlay", "soft-light", "luminosity"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>
        </fieldset>

        {/* -------------------------------------------------- TIPOGRAFIA */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">Tipografia</legend>
          <div className="grid gap-ds-md sm:grid-cols-2">
            <FontField
              label="Fonte de título"
              value={config.typography.fontDisplay}
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, fontDisplay: v } }))}
            />
            <FontField
              label="Fonte de corpo de texto"
              value={config.typography.fontBody}
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, fontBody: v } }))}
            />
          </div>
          <div className="mt-ds-md grid gap-ds-md sm:grid-cols-2 lg:grid-cols-4">
            <SliderField
              label="Peso do título"
              value={config.typography.displayWeight}
              min={100}
              max={900}
              step={100}
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, displayWeight: v } }))}
            />
            <SliderField
              label="Peso do corpo"
              value={config.typography.bodyWeight}
              min={100}
              max={900}
              step={100}
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, bodyWeight: v } }))}
            />
            <SliderField
              label="Espaçamento entre letras (título)"
              value={config.typography.displayTrackingEm}
              min={-0.05}
              max={0.1}
              step={0.005}
              unit="em"
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, displayTrackingEm: v } }))}
            />
            <SliderField
              label="Espaçamento entre letras (corpo)"
              value={config.typography.bodyTrackingEm}
              min={-0.05}
              max={0.1}
              step={0.005}
              unit="em"
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, bodyTrackingEm: v } }))}
            />
            <SliderField
              label="Altura de linha (título)"
              value={config.typography.displayLeading}
              min={0.8}
              max={1.6}
              step={0.01}
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, displayLeading: v } }))}
            />
            <SliderField
              label="Altura de linha (corpo)"
              value={config.typography.bodyLeading}
              min={1.1}
              max={2.2}
              step={0.01}
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, bodyLeading: v } }))}
            />
            <SliderField
              label="Proporção da escala (tamanho dos títulos)"
              value={config.typography.scaleRatio}
              min={1.05}
              max={1.7}
              step={0.01}
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, scaleRatio: v } }))}
            />
            <SliderField
              label="Tamanho base do corpo"
              value={config.typography.baseFontSizePx}
              min={13}
              max={22}
              step={0.5}
              unit="px"
              onChange={(v) => setConfig((c) => ({ ...c, typography: { ...c.typography, baseFontSizePx: v } }))}
            />
          </div>
        </fieldset>

        {/* ------------------------------------------------------ LAYOUT */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">Layout / grid</legend>
          <div className="grid gap-ds-md sm:grid-cols-2 lg:grid-cols-3">
            <SliderField
              label="Colunas da grade de projetos"
              value={config.layout.gridColumns}
              min={1}
              max={6}
              step={1}
              onChange={(v) => setConfig((c) => ({ ...c, layout: { ...c.layout, gridColumns: v } }))}
            />
            <SliderField
              label="Largura máxima do conteúdo"
              value={config.layout.gridMaxWidthRem}
              min={48}
              max={100}
              step={1}
              unit="rem"
              onChange={(v) => setConfig((c) => ({ ...c, layout: { ...c.layout, gridMaxWidthRem: v } }))}
            />
            <SliderField
              label="Espaço entre colunas (gutter)"
              value={config.layout.gridGutterRem}
              min={0}
              max={6}
              step={0.1}
              unit="rem"
              onChange={(v) => setConfig((c) => ({ ...c, layout: { ...c.layout, gridGutterRem: v } }))}
            />
            <SliderField
              label="Margem lateral"
              value={config.layout.gridMarginRem}
              min={0}
              max={6}
              step={0.1}
              unit="rem"
              onChange={(v) => setConfig((c) => ({ ...c, layout: { ...c.layout, gridMarginRem: v } }))}
            />
            <SliderField
              label="Deslocamento assimétrico"
              value={config.layout.gridOffsetRem}
              min={0}
              max={6}
              step={0.1}
              unit="rem"
              onChange={(v) => setConfig((c) => ({ ...c, layout: { ...c.layout, gridOffsetRem: v } }))}
            />
            <Field label="Proporção dos cards (largura / altura)">
              <input
                className={inputClass}
                value={config.layout.cardRatio}
                placeholder="4 / 3"
                onChange={(e) => setConfig((c) => ({ ...c, layout: { ...c.layout, cardRatio: e.target.value } }))}
              />
            </Field>
          </div>
        </fieldset>

        {/* -------------------------------------------------- ESPAÇAMENTO */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">Espaçamento</legend>
          <div className="grid gap-ds-md sm:grid-cols-2 lg:grid-cols-4">
            {([
              ["xsRem", "Extra pequeno"],
              ["smRem", "Pequeno"],
              ["mdRem", "Médio"],
              ["lgRem", "Grande"],
              ["xlRem", "Extra grande"],
              ["xl2Rem", "2x extra grande"],
              ["xl3Rem", "3x extra grande"],
            ] as const).map(([key, label]) => (
              <SliderField
                key={key}
                label={label}
                value={config.spacing[key]}
                min={0}
                max={key === "xl3Rem" ? 12 : 8}
                step={0.05}
                unit="rem"
                onChange={(v) => setConfig((c) => ({ ...c, spacing: { ...c.spacing, [key]: v } }))}
              />
            ))}
          </div>
        </fieldset>

        {/* --------------------------------------------- BORDA / RAIO */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">Bordas & cantos</legend>
          <div className="grid gap-ds-md sm:grid-cols-2 lg:grid-cols-4">
            <SliderField
              label="Espessura da borda"
              value={config.border.widthPx}
              min={0}
              max={8}
              step={1}
              unit="px"
              onChange={(v) => setConfig((c) => ({ ...c, border: { ...c.border, widthPx: v } }))}
            />
            <Field label="Estilo da borda">
              <select
                className={inputClass}
                value={config.border.style}
                onChange={(e) => setConfig((c) => ({ ...c, border: { ...c.border, style: e.target.value as typeof c.border.style } }))}
              >
                {["solid", "dashed", "dotted", "double"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <SliderField
              label="Raio dos cantos"
              value={config.radius.basePx}
              min={0}
              max={48}
              step={1}
              unit="px"
              onChange={(v) => setConfig((c) => ({ ...c, radius: { ...c.radius, basePx: v } }))}
            />
            <Field label="Raio orgânico (avatar/blob)">
              <input
                className={inputClass}
                value={config.radius.organic}
                placeholder="62% 38% 45% 55% / 48% 52% 48% 52%"
                onChange={(e) => setConfig((c) => ({ ...c, radius: { ...c.radius, organic: e.target.value } }))}
              />
            </Field>
          </div>
        </fieldset>

        {/* -------------------------------------------------------- SOMBRAS */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">Sombras</legend>
          <p className="mb-ds-sm text-fluid-xs text-muted-foreground">
            Valores em CSS <code>box-shadow</code>. Use "none" pra remover, ou algo como{" "}
            <code>6px 6px 0 0 var(--ds-border)</code> pra sombra dura, ou{" "}
            <code>0 8px 20px -12px rgba(0,0,0,.4)</code> pra sombra suave.
          </p>
          <div className="grid gap-ds-md sm:grid-cols-3">
            {(["sm", "md", "lg"] as const).map((k) => (
              <Field key={k} label={`Sombra ${k}`}>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={config.shadow[k]}
                  onChange={(e) => setConfig((c) => ({ ...c, shadow: { ...c.shadow, [k]: e.target.value } }))}
                />
              </Field>
            ))}
          </div>
        </fieldset>

        {/* --------------------------------------------------------- MOTION */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">Movimento / animação</legend>
          <div className="grid gap-ds-md sm:grid-cols-2 lg:grid-cols-3">
            <SliderField
              label="Duração rápida"
              value={config.motion.fastMs}
              min={0}
              max={600}
              step={10}
              unit="ms"
              onChange={(v) => setConfig((c) => ({ ...c, motion: { ...c.motion, fastMs: v } }))}
            />
            <SliderField
              label="Duração normal"
              value={config.motion.normalMs}
              min={0}
              max={900}
              step={10}
              unit="ms"
              onChange={(v) => setConfig((c) => ({ ...c, motion: { ...c.motion, normalMs: v } }))}
            />
            <SliderField
              label="Duração lenta"
              value={config.motion.slowMs}
              min={0}
              max={1500}
              step={10}
              unit="ms"
              onChange={(v) => setConfig((c) => ({ ...c, motion: { ...c.motion, slowMs: v } }))}
            />
            <SliderField
              label="Atraso (delay)"
              value={config.motion.delayMs}
              min={0}
              max={400}
              step={10}
              unit="ms"
              onChange={(v) => setConfig((c) => ({ ...c, motion: { ...c.motion, delayMs: v } }))}
            />
            <SliderField
              label="Elevação no hover"
              value={config.motion.liftPx}
              min={0}
              max={20}
              step={1}
              unit="px"
              onChange={(v) => setConfig((c) => ({ ...c, motion: { ...c.motion, liftPx: v } }))}
            />
            <SliderField
              label="Escala no hover"
              value={config.motion.scale}
              min={1}
              max={1.2}
              step={0.01}
              onChange={(v) => setConfig((c) => ({ ...c, motion: { ...c.motion, scale: v } }))}
            />
            <Field label="Curva de aceleração (easing)">
              <input
                className={inputClass}
                value={config.motion.easing}
                placeholder="cubic-bezier(0.2, 0.9, 0.3, 1.2)"
                onChange={(e) => setConfig((c) => ({ ...c, motion: { ...c.motion, easing: e.target.value } }))}
              />
            </Field>
          </div>
          <label className="mt-ds-sm flex items-center gap-2 text-fluid-sm">
            <input
              type="checkbox"
              checked={config.motion.respectReducedMotion}
              onChange={(e) => setConfig((c) => ({ ...c, motion: { ...c.motion, respectReducedMotion: e.target.checked } }))}
            />
            Respeitar "reduzir movimento" do sistema operacional da visitante
          </label>
        </fieldset>

        {/* ------------------------------------------------ ACESSIBILIDADE */}
        <fieldset className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">Acessibilidade</legend>
          <div className="grid gap-ds-md sm:grid-cols-2 lg:grid-cols-3">
            <SliderField
              label="Espessura do anel de foco (navegação por teclado)"
              value={config.accessibility.focusRingWidthPx}
              min={1}
              max={6}
              step={1}
              unit="px"
              onChange={(v) => setConfig((c) => ({ ...c, accessibility: { ...c.accessibility, focusRingWidthPx: v } }))}
            />
            <ColorField
              label="Cor do anel de foco"
              value={config.accessibility.focusRingColor}
              onChange={(v) => setConfig((c) => ({ ...c, accessibility: { ...c.accessibility, focusRingColor: v } }))}
            />
            <SliderField
              label="Escala geral da fonte"
              value={config.accessibility.fontScaleMultiplier}
              min={0.85}
              max={1.4}
              step={0.05}
              unit="×"
              onChange={(v) => setConfig((c) => ({ ...c, accessibility: { ...c.accessibility, fontScaleMultiplier: v } }))}
            />
          </div>
          <label className="mt-ds-sm flex items-center gap-2 text-fluid-sm">
            <input
              type="checkbox"
              checked={config.accessibility.underlineLinks}
              onChange={(e) => setConfig((c) => ({ ...c, accessibility: { ...c.accessibility, underlineLinks: e.target.checked } }))}
            />
            Sublinhar todos os links (ajuda quem não distingue cor com facilidade)
          </label>
        </fieldset>

        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? "Salvando…" : "Salvar design system"}
        </PrimaryButton>
      </section>

      <VoicePanel />
    </div>
  );
}
function VoicePanel() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const settings = data as SettingsRow | null;
  const [toneId, setToneId] = useState("direto");
  const [overrides, setOverrides] = useState<CopyOverrides>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setToneId((settings["tone_preset"] as string) ?? "direto");
    setOverrides(((settings["copy_overrides"] as CopyOverrides) ?? {}) as CopyOverrides);
  }, [settings]);

  const resolved = useMemo(() => resolveCopy(toneId, overrides), [toneId, overrides]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("portfolio_settings")
      .update({ tone_preset: toneId, copy_overrides: overrides })
      .eq("id", settings.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["settings"] });
    toast.success("Tom de voz atualizado.");
  }

  const groups = [...new Set(COPY_FIELDS.map((f) => f.group))];

  return (
    <section className="ink-border hard-shadow space-y-ds-lg rounded-xl bg-background p-ds-lg">
      <div>
        <h2 className="text-fluid-xl uppercase">Tom de voz</h2>
        <p className="text-fluid-sm text-muted-foreground">
          Escolha o tom base e, se quiser, reescreva qualquer texto da interface.
        </p>
      </div>

      <div className="grid gap-ds-sm sm:grid-cols-2 lg:grid-cols-3">
        {TONES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={toneId === t.id}
            onClick={() => setToneId(t.id)}
            className={`ink-border ds-interactive rounded-lg p-ds-sm text-left ${
              toneId === t.id ? "hard-shadow-sm bg-secondary text-secondary-foreground" : "bg-card"
            }`}
          >
            <span className="block text-fluid-sm font-bold">{t.label}</span>
            <span className="block text-fluid-xs text-muted-foreground">{t.description}</span>
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <fieldset key={g} className="ink-border rounded-lg p-ds-md">
          <legend className="px-ds-xs text-fluid-xs font-bold uppercase tracking-widest">{g}</legend>
          <div className="grid gap-ds-md sm:grid-cols-2">
            {COPY_FIELDS.filter((f) => f.group === g).map((f) => (
              <Field key={f.key} label={f.label}>
                <input
                  className={inputClass}
                  placeholder={resolved[f.key as CopyKey]}
                  value={overrides[f.key as CopyKey] ?? ""}
                  onChange={(e) =>
                    setOverrides((o) => ({ ...o, [f.key]: e.target.value || undefined }))
                  }
                />
              </Field>
            ))}
          </div>
        </fieldset>
      ))}

      <PrimaryButton onClick={save} disabled={saving}>
        {saving ? "Salvando…" : "Salvar tom de voz"}
      </PrimaryButton>
    </section>
  );
}
