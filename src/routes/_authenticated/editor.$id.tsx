import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AdminShell,
  Field,
  GhostButton,
  PrimaryButton,
  inputClass,
} from "@/components/admin/AdminShell";
import {
  BLOCK_TYPES,
  categoriesQuery,
  projectByIdQuery,
  slugify,
  uploadMedia,
  type Block,
  type Project,
} from "@/lib/portfolio";

export const Route = createFileRoute("/_authenticated/editor/$id")({
  head: () => ({
    meta: [
      { title: "Editor de projeto — Portfólio Autoral" },
      { name: "description", content: "Edite os detalhes e blocos de conteúdo do projeto." },
      { property: "og:title", content: "Editor de projeto — Portfólio Autoral" },
      { property: "og:description", content: "Edite os detalhes e blocos do projeto." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(projectByIdQuery(id));
  const { data: categories } = useQuery(categoriesQuery);
  const [form, setForm] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);

  useEffect(() => {
    if (data?.project) setForm(data.project);
  }, [data?.project]);

  const set = (k: keyof Project, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function saveProject() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title: form.title ?? "",
          slug: slugify(form.slug || form.title || "projeto"),
          summary: form.summary ?? "",
          year: form.year ?? "",
          client: form.client ?? "",
          category_id: form.category_id ?? null,
          featured: form.featured ?? false,
          published: form.published ?? false,
        })
        .eq("id", id);
      if (error) throw error;
      await qc.invalidateQueries();
      toast.success("Projeto salvo.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadCover(file: File) {
    setCoverBusy(true);
    try {
      const url = await uploadMedia(file, "covers");
      const { error } = await supabase.from("projects").update({ cover_url: url }).eq("id", id);
      if (error) throw error;
      await qc.invalidateQueries();
      toast.success("Capa atualizada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setCoverBusy(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Editor">
        <p className="text-muted-foreground">Carregando projeto…</p>
      </AdminShell>
    );
  }

  if (!data?.project) {
    return (
      <AdminShell title="Editor">
        <p className="text-muted-foreground">Projeto não encontrado.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={form.title ?? "Editor"}>
      <Link to="/admin" className="text-sm font-bold text-primary">
        ← Voltar ao painel
      </Link>

      <section className="ink-border hard-shadow mt-4 space-y-4 rounded-xl bg-background p-6">
        <h1 className="text-2xl uppercase">Dados do projeto</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título">
            <input
              className={inputClass}
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field label="Endereço (slug)">
            <input
              className={inputClass}
              value={form.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
            />
          </Field>
          <Field label="Ano">
            <input
              className={inputClass}
              value={form.year ?? ""}
              onChange={(e) => set("year", e.target.value)}
            />
          </Field>
          <Field label="Cliente">
            <input
              className={inputClass}
              value={form.client ?? ""}
              onChange={(e) => set("client", e.target.value)}
            />
          </Field>
          <Field label="Categoria">
            <select
              className={inputClass}
              value={form.category_id ?? ""}
              onChange={(e) => set("category_id", e.target.value || null)}
            >
              <option value="">Sem categoria</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Capa do projeto">
            <input
              type="file"
              accept="image/*"
              disabled={coverBusy}
              className="mt-1 block text-sm"
              onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
            />
          </Field>
        </div>
        <Field label="Resumo">
          <textarea
            rows={3}
            className={inputClass}
            value={form.summary ?? ""}
            onChange={(e) => set("summary", e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={Boolean(form.published)}
              onChange={(e) => set("published", e.target.checked)}
            />
            Publicado
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Destaque
          </label>
        </div>
        <PrimaryButton onClick={saveProject} disabled={saving}>
          {saving ? "Salvando…" : "Salvar projeto"}
        </PrimaryButton>
      </section>

      <BlocksEditor projectId={id} blocks={data.blocks} />
    </AdminShell>
  );
}

function BlocksEditor({ projectId, blocks }: { projectId: string; blocks: Block[] }) {
  const qc = useQueryClient();
  const [type, setType] = useState<string>("text");

  async function addBlock() {
    const { error } = await supabase.from("project_blocks").insert({
      project_id: projectId,
      block_type: type,
      sort_order: blocks.length + 1,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries();
  }

  return (
    <section className="ink-border hard-shadow mt-6 space-y-4 rounded-xl bg-background p-6">
      <h2 className="text-2xl uppercase">Blocos de conteúdo</h2>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Tipo de bloco">
          <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
            {BLOCK_TYPES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <PrimaryButton onClick={addBlock}>Adicionar bloco</PrimaryButton>
      </div>

      <ul className="space-y-4">
        {blocks.map((b, i) => (
          <BlockRow key={b.id} block={b} index={i} siblings={blocks} />
        ))}
      </ul>
    </section>
  );
}

function BlockRow({
  block,
  index,
  siblings,
}: {
  block: Block;
  index: number;
  siblings: Block[];
}) {
  const total = siblings.length;
  const qc = useQueryClient();
  const [local, setLocal] = useState(block);
  const [busy, setBusy] = useState(false);

  useEffect(() => setLocal(block), [block]);

  async function save(patch: Partial<Block> = {}) {
    const { error } = await supabase
      .from("project_blocks")
      .update({
        title: local.title,
        content: local.content,
        url: local.url,
        block_type: local.block_type,
        ...patch,
      })
      .eq("id", block.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries();
    toast.success("Bloco salvo.");
  }

  async function move(dir: -1 | 1) {
    const neighbor = siblings[index + dir];
    if (!neighbor) return;
    const [a, b] = [
      supabase
        .from("project_blocks")
        .update({ sort_order: neighbor.sort_order })
        .eq("id", block.id),
      supabase
        .from("project_blocks")
        .update({ sort_order: block.sort_order })
        .eq("id", neighbor.id),
    ];
    const [r1, r2] = await Promise.all([a, b]);
    const error = r1.error ?? r2.error;
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries();
  }

  async function remove() {
    const { error } = await supabase.from("project_blocks").delete().eq("id", block.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries();
  }

  async function upload(file: File) {
    setBusy(true);
    try {
      const url = await uploadMedia(file, local.block_type === "audio" ? "audio" : "images");
      setLocal((l) => ({ ...l, url }));
      await save({ url });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setBusy(false);
    }
  }

  const label = BLOCK_TYPES.find((t) => t.value === local.block_type)?.label ?? local.block_type;

  return (
    <li className="ink-border space-y-3 rounded-lg bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest">
          {index + 1}. {label}
        </span>
        <div className="ml-auto flex gap-2">
          <GhostButton onClick={() => move(-1)} disabled={index === 0} aria-label="Mover para cima">
            ↑
          </GhostButton>
          <GhostButton
            onClick={() => move(1)}
            disabled={index === total - 1}
            aria-label="Mover para baixo"
          >
            ↓
          </GhostButton>
          <GhostButton onClick={remove}>Excluir</GhostButton>
        </div>
      </div>

      <Field label="Título do bloco (opcional)">
        <input
          className={inputClass}
          value={local.title}
          onChange={(e) => setLocal({ ...local, title: e.target.value })}
        />
      </Field>

      {(local.block_type === "text" ||
        local.block_type === "quote" ||
        local.block_type === "image") && (
        <Field label={local.block_type === "image" ? "Legenda" : "Texto"}>
          <textarea
            rows={local.block_type === "text" ? 5 : 2}
            className={inputClass}
            value={local.content}
            onChange={(e) => setLocal({ ...local, content: e.target.value })}
          />
        </Field>
      )}

      {local.block_type === "youtube" && (
        <Field label="Link do YouTube">
          <input
            className={inputClass}
            value={local.url}
            onChange={(e) => setLocal({ ...local, url: e.target.value })}
          />
        </Field>
      )}

      {(local.block_type === "image" || local.block_type === "audio") && (
        <Field label={local.block_type === "image" ? "Arquivo de imagem" : "Arquivo de áudio"}>
          <input
            type="file"
            accept={local.block_type === "image" ? "image/*" : "audio/*"}
            disabled={busy}
            className="mt-1 block text-sm"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </Field>
      )}

      <PrimaryButton onClick={() => save()}>Salvar bloco</PrimaryButton>
    </li>
  );
}
