import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Settings = Database["public"]["Tables"]["portfolio_settings"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Block = Database["public"]["Tables"]["project_blocks"]["Row"];
export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

export const BLOCK_TYPES = [
  { value: "text", label: "Texto" },
  { value: "quote", label: "Citação" },
  { value: "image", label: "Imagem" },
  { value: "youtube", label: "Vídeo do YouTube" },
  { value: "audio", label: "Áudio" },
] as const;

export const settingsQuery = {
  queryKey: ["settings"],
  queryFn: async (): Promise<Settings | null> => {
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

export const linksQuery = {
  queryKey: ["social_links"],
  queryFn: async (): Promise<SocialLink[]> => {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
};

export const categoriesQuery = {
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
};

export const projectsQuery = (opts: { all?: boolean } = {}) => ({
  queryKey: ["projects", opts.all ? "all" : "published"],
  queryFn: async (): Promise<Project[]> => {
    let q = supabase.from("projects").select("*").order("sort_order");
    if (!opts.all) q = q.eq("published", true);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },
});

export const projectBySlugQuery = (slug: string) => ({
  queryKey: ["project", slug],
  queryFn: async (): Promise<{ project: Project | null; blocks: Block[] }> => {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!project) return { project: null, blocks: [] };
    const { data: blocks, error: bErr } = await supabase
      .from("project_blocks")
      .select("*")
      .eq("project_id", project.id)
      .order("sort_order");
    if (bErr) throw bErr;
    return { project, blocks: blocks ?? [] };
  },
});

export const projectByIdQuery = (id: string) => ({
  queryKey: ["project-id", id],
  queryFn: async (): Promise<{ project: Project | null; blocks: Block[] }> => {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    const { data: blocks } = await supabase
      .from("project_blocks")
      .select("*")
      .eq("project_id", id)
      .order("sort_order");
    return { project, blocks: blocks ?? [] };
  },
});

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] ?? null;
}

export function whatsappHref(number: string, message = "Olá! Vi seu portfólio.") {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Uploads a file to the media bucket and returns a long-lived signed URL. */
export async function uploadMedia(file: File, folder = "uploads") {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  if (signErr) throw signErr;
  return data.signedUrl;
}
