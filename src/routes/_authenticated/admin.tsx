import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  AdminShell,
  Field,
  GhostButton,
  PrimaryButton,
  inputClass,
} from "@/components/admin/AdminShell";
import { DesignSystemPanel } from "@/components/admin/DesignSystemPanel";
import {
  settingsQuery,
  categoriesQuery,
  projectsQuery,
  linksQuery,
  slugify,
  uploadMedia,
  type Settings,
} from "@/lib/portfolio";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel de edição — Portfólio Autoral" },
      { name: "description", content: "Edite identidade, categorias, projetos e contatos." },
      { property: "og:title", content: "Painel de edição — Portfólio Autoral" },
      { property: "og:description", content: "Edite identidade, categorias, projetos e contatos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "identidade", label: "Identidade" },
  { id: "design", label: "Design & Voz" },
  { id: "categorias", label: "Categorias" },
  { id: "projetos", label: "Projetos" },
  { id: "links", label: "Links & Contato" },
] as const;

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("identidade");

  if (loading) {
    return (
      <AdminShell title="Carregando">
        <p className="text-muted-foreground">Verificando permissões…</p>
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell title="Sem acesso">
        <div className="ink-border rounded-xl bg-card p-6">
          <h1 className="text-2xl uppercase">Acesso restrito</h1>
          <p className="mt-2 text-muted-foreground">
            Sua conta não tem permissão de administrador deste portfólio.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Edição">
      <div role="tablist" aria-label="Seções do painel" className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`ink-border rounded-full px-4 py-1.5 text-sm font-bold ${
              tab === t.id ? "hard-shadow-sm bg-secondary text-secondary-foreground" : "bg-card"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "identidade" && <IdentityPanel />}
      {tab === "design" && <DesignSystemPanel />}
      {tab === "categorias" && <CategoriesPanel />}
      {tab === "projetos" && <ProjectsPanel />}
      {tab === "links" && <LinksPanel />}
    </AdminShell>
  );
}

function IdentityPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [form, setForm] = useState<Partial<Settings>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = (k: keyof Settings, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      const payload = {
        portfolio_name: form.portfolio_name ?? "",
        role_title: form.role_title ?? "",
        tagline: form.tagline ?? "",
        presentation: form.presentation ?? "",
        biography: form.biography ?? "",
        location: form.location ?? "",
        accent_1: form.accent_1 ?? "#FF4D6D",
        accent_2: form.accent_2 ?? "#FFD400",
        accent_3: form.accent_3 ?? "#3D5AFE",
      };
      const { error } = data
        ? await supabase.from("portfolio_settings").update(payload).eq("id", data.id)
        : await supabase.from("portfolio_settings").insert(payload);
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Identidade atualizada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="ink-border hard-shadow space-y-5 rounded-xl bg-background p-6">
      <h2 className="text-2xl uppercase">Identidade & textos</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome do portfólio">
          <input
            className={inputClass}
            value={form.portfolio_name ?? ""}
            onChange={(e) => set("portfolio_name", e.target.value)}
          />
        </Field>
        <Field label="Título / atuação">
          <input
            className={inputClass}
            value={form.role_title ?? ""}
            onChange={(e) => set("role_title", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Frase de impacto">
        <input
          className={inputClass}
          value={form.tagline ?? ""}
          onChange={(e) => set("tagline", e.target.value)}
        />
      </Field>
      <Field label="Apresentação">
        <textarea
          rows={3}
          className={inputClass}
          value={form.presentation ?? ""}
          onChange={(e) => set("presentation", e.target.value)}
        />
      </Field>
      <Field label="Biografia">
        <textarea
          rows={5}
          className={inputClass}
          value={form.biography ?? ""}
          onChange={(e) => set("biography", e.target.value)}
        />
      </Field>
      <Field label="Localização">
        <input
          className={inputClass}
          value={form.location ?? ""}
          onChange={(e) => set("location", e.target.value)}
        />
      </Field>

      <fieldset className="ink-border rounded-lg p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-widest">
          Cores do design system
        </legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["accent_1", "accent_2", "accent_3"] as const).map((k, i) => (
            <Field key={k} label={`Cor ${i + 1}`}>
              <input
                type="color"
                className="ink-border mt-1 h-10 w-full rounded-lg"
                value={form[k] ?? "#000000"}
                onChange={(e) => set(k, e.target.value)}
              />
            </Field>
          ))}
        </div>
      </fieldset>

      <PrimaryButton onClick={save} disabled={saving}>
        {saving ? "Salvando…" : "Salvar identidade"}
      </PrimaryButton>
    </section>
  );
}

function CategoriesPanel() {
  const qc = useQueryClient();
  const { data: categories } = useQuery(categoriesQuery);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FF4D6D");

  async function add() {
    if (!name.trim()) return;
    const { error } = await supabase.from("categories").insert({
      name,
      slug: slugify(name),
      color,
      sort_order: (categories?.length ?? 0) + 1,
    });
    if (error) { toast.error(error.message); return; }
    setName("");
    await qc.invalidateQueries({ queryKey: ["categories"] });
    toast.success("Categoria criada.");
  }

  async function remove(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: ["categories"] });
  }

  return (
    <section className="ink-border hard-shadow space-y-5 rounded-xl bg-background p-6">
      <h2 className="text-2xl uppercase">Categorias</h2>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Nova categoria">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Cor">
          <input
            type="color"
            className="ink-border mt-1 h-10 w-20 rounded-lg"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Field>
        <PrimaryButton onClick={add}>Adicionar</PrimaryButton>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(categories ?? []).map((c) => (
          <li key={c.id} className="ink-border flex items-center gap-3 rounded-lg bg-card p-3">
            <span
              aria-hidden="true"
              className="ink-border h-6 w-6 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            <span className="font-bold">{c.name}</span>
            <span className="ml-auto">
              <GhostButton onClick={() => remove(c.id)} aria-label={`Excluir ${c.name}`}>
                Excluir
              </GhostButton>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectsPanel() {
  const qc = useQueryClient();
  const { data: projects } = useQuery(projectsQuery({ all: true }));
  const { data: categories } = useQuery(categoriesQuery);
  const [title, setTitle] = useState("");

  async function create() {
    if (!title.trim()) return;
    const { error } = await supabase.from("projects").insert({
      title,
      slug: slugify(title),
      sort_order: (projects?.length ?? 0) + 1,
      published: false,
    });
    if (error) { toast.error(error.message); return; }
    setTitle("");
    await qc.invalidateQueries({ queryKey: ["projects"] });
    toast.success("Projeto criado como rascunho.");
  }

  async function togglePublished(id: string, published: boolean) {
    const { error } = await supabase.from("projects").update({ published }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: ["projects"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: ["projects"] });
  }

  return (
    <section className="ink-border hard-shadow space-y-5 rounded-xl bg-background p-6">
      <h2 className="text-2xl uppercase">Projetos</h2>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Novo projeto">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <PrimaryButton onClick={create}>Criar</PrimaryButton>
      </div>

      <ul className="space-y-3">
        {(projects ?? []).map((p) => (
          <li
            key={p.id}
            className="ink-border flex flex-wrap items-center gap-3 rounded-lg bg-card p-3"
          >
            <div>
              <p className="font-bold">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {categories?.find((c) => c.id === p.category_id)?.name ?? "Sem categoria"} ·{" "}
                {p.published ? "Publicado" : "Rascunho"}
              </p>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <GhostButton onClick={() => togglePublished(p.id, !p.published)}>
                {p.published ? "Despublicar" : "Publicar"}
              </GhostButton>
              <Link
                to="/editor/$id"
                params={{ id: p.id }}
                className="ink-border hard-shadow-sm rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
              >
                Editar
              </Link>
              <GhostButton onClick={() => remove(p.id)}>Excluir</GhostButton>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LinksPanel() {
  const qc = useQueryClient();
  const { data: links } = useQuery(linksQuery);
  const { data: settings } = useQuery(settingsQuery);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [whats, setWhats] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);

  useEffect(() => {
    if (settings) {
      setEmail(settings.email);
      setWhats(settings.whatsapp);
    }
  }, [settings]);

  async function saveContact() {
    if (!settings) return;
    const { error } = await supabase
      .from("portfolio_settings")
      .update({ email, whatsapp: whats })
      .eq("id", settings.id);
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: ["settings"] });
    toast.success("Contato atualizado.");
  }

  async function uploadAvatar(file: File) {
    if (!settings) return;
    setAvatarBusy(true);
    try {
      const url2 = await uploadMedia(file, "avatar");
      const { error } = await supabase
        .from("portfolio_settings")
        .update({ avatar_url: url2 })
        .eq("id", settings.id);
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Imagem atualizada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setAvatarBusy(false);
    }
  }

  async function addLink() {
    if (!label.trim() || !url.trim()) return;
    const { error } = await supabase
      .from("social_links")
      .insert({ label, url, sort_order: (links?.length ?? 0) + 1 });
    if (error) { toast.error(error.message); return; }
    setLabel("");
    setUrl("");
    await qc.invalidateQueries({ queryKey: ["social_links"] });
  }

  async function removeLink(id: string) {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: ["social_links"] });
  }

  return (
    <div className="space-y-6">
      <section className="ink-border hard-shadow space-y-4 rounded-xl bg-background p-6">
        <h2 className="text-2xl uppercase">Contato</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="WhatsApp" hint="Somente números, com DDI e DDD. Ex.: 5511999998888">
            <input
              className={inputClass}
              value={whats}
              onChange={(e) => setWhats(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Foto / imagem de perfil">
          <input
            type="file"
            accept="image/*"
            disabled={avatarBusy}
            className="mt-1 block text-sm"
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
          />
        </Field>
        <PrimaryButton onClick={saveContact}>Salvar contato</PrimaryButton>
      </section>

      <section className="ink-border hard-shadow space-y-4 rounded-xl bg-background p-6">
        <h2 className="text-2xl uppercase">Links externos</h2>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Nome">
            <input
              className={inputClass}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Field>
          <Field label="URL">
            <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} />
          </Field>
          <PrimaryButton onClick={addLink}>Adicionar</PrimaryButton>
        </div>
        <ul className="space-y-2">
          {(links ?? []).map((l) => (
            <li key={l.id} className="ink-border flex items-center gap-3 rounded-lg bg-card p-3">
              <span className="font-bold">{l.label}</span>
              <span className="truncate text-xs text-muted-foreground">{l.url}</span>
              <span className="ml-auto">
                <GhostButton onClick={() => removeLink(l.id)}>Excluir</GhostButton>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
