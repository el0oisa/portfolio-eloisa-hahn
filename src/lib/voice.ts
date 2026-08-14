/**
 * UX WRITING — tom de voz configurável.
 * Nenhum texto de interface fica preso ao código: tudo passa por aqui.
 */

export type CopyKey =
  | "navProjects"
  | "navAbout"
  | "navContact"
  | "navAdmin"
  | "navLogin"
  | "skipLink"
  | "heroPrimaryCta"
  | "heroSecondaryCta"
  | "projectsTitle"
  | "filterAll"
  | "filterLabel"
  | "loading"
  | "emptyProjects"
  | "cardCta"
  | "aboutTitle"
  | "contactTitle"
  | "contactLead"
  | "whatsappCta"
  | "backHome"
  | "errorGeneric"
  | "saved";

export type Tone = {
  id: string;
  label: string;
  description: string;
  copy: Record<CopyKey, string>;
};

const base: Record<CopyKey, string> = {
  navProjects: "Projetos",
  navAbout: "Sobre",
  navContact: "Contato",
  navAdmin: "Admin",
  navLogin: "Entrar",
  skipLink: "Pular para o conteúdo",
  heroPrimaryCta: "Ver projetos",
  heroSecondaryCta: "Falar comigo",
  projectsTitle: "Projetos",
  filterAll: "Todos",
  filterLabel: "Filtrar projetos por categoria",
  loading: "Carregando projetos…",
  emptyProjects: "Nenhum projeto publicado ainda.",
  cardCta: "Ver projeto",
  aboutTitle: "Sobre",
  contactTitle: "Vamos conversar",
  contactLead: "Conte o que você quer criar.",
  whatsappCta: "WhatsApp",
  backHome: "Voltar ao início",
  errorGeneric: "Algo deu errado. Tente de novo.",
  saved: "Alterações salvas.",
};

function tone(id: string, label: string, description: string, over: Partial<Record<CopyKey, string>>): Tone {
  return { id, label, description, copy: { ...base, ...over } };
}

export const TONES: Tone[] = [
  tone("direto", "Direto", "Frases curtas, sem rodeio.", {}),
  tone("informal", "Informal", "Conversa de mesa de bar.", {
    heroPrimaryCta: "Dá uma olhada",
    heroSecondaryCta: "Chama aí",
    contactTitle: "Bora conversar?",
    contactLead: "Me conta a ideia — respondo rápido e sem formulário chato.",
    cardCta: "Espia esse",
    emptyProjects: "Ainda não tem nada por aqui. Volta já já.",
    errorGeneric: "Deu ruim aqui. Tenta de novo?",
    saved: "Salvo!",
  }),
  tone("poetico", "Poético", "Imagem antes da informação.", {
    projectsTitle: "Obras",
    heroPrimaryCta: "Percorrer o trabalho",
    heroSecondaryCta: "Deixar um recado",
    aboutTitle: "Quem escreve isto",
    contactTitle: "Fique um pouco",
    contactLead: "Escreva sobre o que ainda não existe. Eu leio com calma.",
    cardCta: "Entrar no projeto",
    emptyProjects: "O silêncio antes do primeiro traço.",
    loading: "Revelando…",
  }),
  tone("academico", "Acadêmico", "Preciso e referenciado.", {
    projectsTitle: "Trabalhos selecionados",
    heroPrimaryCta: "Consultar trabalhos",
    heroSecondaryCta: "Entrar em contato",
    aboutTitle: "Perfil",
    contactTitle: "Contato",
    contactLead: "Para propostas de colaboração, pesquisa ou consultoria.",
    cardCta: "Ler o estudo de caso",
    emptyProjects: "Nenhum trabalho publicado até o momento.",
  }),
  tone("experimental", "Experimental", "Rótulos deslocados de propósito.", {
    projectsTitle: "Evidências",
    heroPrimaryCta: "abrir_arquivo",
    heroSecondaryCta: "enviar_sinal",
    aboutTitle: "Notas de origem",
    contactTitle: "Canal aberto",
    contactLead: "transmita: ideia, prazo, ruído.",
    cardCta: "expandir",
    emptyProjects: "arquivo vazio — aguardando entrada",
    loading: "carregando fragmentos…",
  }),
  tone("divertido", "Divertido", "Leve, com piada no lugar certo.", {
    heroPrimaryCta: "Ver as coisas boas",
    heroSecondaryCta: "Puxar assunto",
    contactTitle: "Oi, tudo bem?",
    contactLead: "Manda a ideia — prometo não responder com jargão.",
    cardCta: "Bisbilhotar",
    emptyProjects: "Nada aqui ainda. Suspense.",
    errorGeneric: "Ops. Isso não era pra acontecer.",
  }),
  tone("profissional", "Profissional", "Claro e corporativo.", {
    projectsTitle: "Portfólio",
    heroPrimaryCta: "Ver portfólio",
    heroSecondaryCta: "Solicitar contato",
    contactTitle: "Vamos trabalhar juntos",
    contactLead: "Descreva seu projeto e retorno com uma proposta.",
    cardCta: "Ver detalhes",
    emptyProjects: "Nenhum projeto disponível no momento.",
  }),
  tone("provocativo", "Provocativo", "Direto ao ponto, com atrito.", {
    heroPrimaryCta: "Prova aqui",
    heroSecondaryCta: "Me desafie",
    contactTitle: "Traga um problema difícil",
    contactLead: "Briefing morno eu devolvo. O resto a gente resolve.",
    cardCta: "Ver como foi feito",
    emptyProjects: "Nada publicado. Ainda.",
  }),
  tone("acolhedor", "Acolhedor", "Perto, gentil, sem pressa.", {
    heroPrimaryCta: "Conhecer meu trabalho",
    heroSecondaryCta: "Vamos conversar",
    contactTitle: "Fico feliz em te ouvir",
    contactLead: "Sem compromisso: me conte sua ideia no seu tempo.",
    cardCta: "Ver com calma",
    emptyProjects: "Ainda estou organizando os projetos por aqui.",
    errorGeneric: "Algo falhou, mas dá pra tentar de novo.",
  }),
  tone("minimalista", "Minimalista", "Uma palavra basta.", {
    heroPrimaryCta: "Projetos",
    heroSecondaryCta: "Contato",
    contactTitle: "Contato",
    contactLead: "Escreva.",
    cardCta: "Abrir",
    emptyProjects: "Vazio.",
    loading: "…",
    saved: "Salvo.",
  }),
];

export type CopyOverrides = Partial<Record<CopyKey, string>>;

export function resolveCopy(
  toneId: string | null | undefined,
  overrides?: CopyOverrides | null,
): Record<CopyKey, string> {
  const t = TONES.find((x) => x.id === toneId) ?? TONES[0]!;
  const clean: CopyOverrides = {};
  for (const [k, v] of Object.entries(overrides ?? {})) {
    if (typeof v === "string" && v.trim()) clean[k as CopyKey] = v;
  }
  return { ...t.copy, ...clean };
}

export const COPY_FIELDS: { key: CopyKey; label: string; group: string }[] = [
  { key: "navProjects", label: "Menu · Projetos", group: "Navegação" },
  { key: "navAbout", label: "Menu · Sobre", group: "Navegação" },
  { key: "navContact", label: "Menu · Contato", group: "Navegação" },
  { key: "navLogin", label: "Menu · Entrar", group: "Navegação" },
  { key: "heroPrimaryCta", label: "CTA principal", group: "CTAs" },
  { key: "heroSecondaryCta", label: "CTA secundário", group: "CTAs" },
  { key: "cardCta", label: "CTA do card", group: "CTAs" },
  { key: "whatsappCta", label: "CTA WhatsApp", group: "CTAs" },
  { key: "projectsTitle", label: "Título dos projetos", group: "Seções" },
  { key: "aboutTitle", label: "Título do sobre", group: "Seções" },
  { key: "contactTitle", label: "Título do contato", group: "Seções" },
  { key: "contactLead", label: "Texto do contato", group: "Seções" },
  { key: "emptyProjects", label: "Estado vazio", group: "Mensagens" },
  { key: "loading", label: "Carregando", group: "Mensagens" },
  { key: "errorGeneric", label: "Erro genérico", group: "Mensagens" },
  { key: "saved", label: "Confirmação", group: "Mensagens" },
];
