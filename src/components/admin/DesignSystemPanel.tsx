import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/portfolio";
import { Field, PrimaryButton, inputClass } from "@/components/admin/AdminShell";
import {
  PRESET_GROUPS,
  resolveTokens,
  applyTokens,
  type PresetGroupId,
  type DesignConfig,
} from "@/lib/design-system";
import { TONES, COPY_FIELDS, resolveCopy, type CopyKey, type CopyOverrides } from "@/lib/voice";

type SettingsRow = Record<string, unknown> & { id: string };

export function DesignSystemPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const settings = data as SettingsRow | null;
  const [form, setForm] = useState<DesignConfig>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setForm({
      theme_preset: settings["theme_preset"] as string,
      typography_preset: settings["typography_preset"] as string,
      grid_preset: settings["grid_preset"] as string,
      spacing_preset: settings["spacing_preset"] as string,
      border_preset: settings["border_preset"] as string,
      radius_preset: settings["radius_preset"] as string,
      shadow_preset: settings["shadow_preset"] as string,
      motion_preset: settings["motion_preset"] as string,
      accent_1: settings["accent_1"] as string,
      accent_2: settings["accent_2"] as string,
      accent_3: settings["accent_3"] as string,
    });
  }, [settings]);

  const tokens = useMemo(() => resolveTokens(form), [form]);

  // pré-visualização ao vivo no próprio painel
  useEffect(() => {
    applyTokens(tokens, document.documentElement);
  }, [tokens]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => typeof v === "string" && v),
    ) as Record<string, string>;
    const { error } = await supabase
      .from("portfolio_settings")
      .update(payload)
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
    <div className="space-y-lg">
      <section className="ink-border hard-shadow space-y-lg rounded-xl bg-background p-lg">
        <div>
          <h2 className="text-fluid-xl uppercase">Design system</h2>
          <p className="text-fluid-sm text-muted-foreground">
            Tudo aqui são tokens. As mudanças aparecem imediatamente na pré-visualização e valem
            para o portfólio inteiro depois de salvar.
          </p>
        </div>

        {(Object.keys(PRESET_GROUPS) as PresetGroupId[]).map((groupId) => {
          const group = PRESET_GROUPS[groupId];
          const current = (form[group.key as keyof DesignConfig] as string) ?? group.presets[0]!.id;
          return (
            <fieldset key={groupId} className="ink-border rounded-lg p-md">
              <legend className="px-xs text-fluid-xs font-bold uppercase tracking-widest">
                {group.label}
              </legend>
              <div className="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
                {group.presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={current === p.id}
                    onClick={() => setForm((f) => ({ ...f, [group.key]: p.id }))}
                    className={`ink-border ds-interactive rounded-lg p-sm text-left ${
                      current === p.id ? "hard-shadow-sm bg-secondary text-secondary-foreground" : "bg-card"
                    }`}
                  >
                    <span className="block text-fluid-sm font-bold">{p.label}</span>
                    <span className="block text-fluid-xs text-muted-foreground">
                      {p.description}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          );
        })}

        <fieldset className="ink-border rounded-lg p-md">
          <legend className="px-xs text-fluid-xs font-bold uppercase tracking-widest">
            Acentos personalizados
          </legend>
          <p className="mb-sm text-fluid-xs text-muted-foreground">
            Opcional: sobrescrevem as cores primária, secundária e de acento da paleta escolhida.
          </p>
          <div className="grid gap-md sm:grid-cols-3">
            {(["accent_1", "accent_2", "accent_3"] as const).map((k, i) => (
              <Field key={k} label={["Primária", "Secundária", "Acento"][i]!}>
                <input
                  type="color"
                  className="ink-border mt-1 h-10 w-full rounded-lg"
                  value={(form[k] as string) ?? "#000000"}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                />
              </Field>
            ))}
          </div>
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
    <section className="ink-border hard-shadow space-y-lg rounded-xl bg-background p-lg">
      <div>
        <h2 className="text-fluid-xl uppercase">Tom de voz</h2>
        <p className="text-fluid-sm text-muted-foreground">
          Escolha o tom base e, se quiser, reescreva qualquer texto da interface.
        </p>
      </div>

      <div className="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {TONES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={toneId === t.id}
            onClick={() => setToneId(t.id)}
            className={`ink-border ds-interactive rounded-lg p-sm text-left ${
              toneId === t.id ? "hard-shadow-sm bg-secondary text-secondary-foreground" : "bg-card"
            }`}
          >
            <span className="block text-fluid-sm font-bold">{t.label}</span>
            <span className="block text-fluid-xs text-muted-foreground">{t.description}</span>
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <fieldset key={g} className="ink-border rounded-lg p-md">
          <legend className="px-xs text-fluid-xs font-bold uppercase tracking-widest">{g}</legend>
          <div className="grid gap-md sm:grid-cols-2">
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
