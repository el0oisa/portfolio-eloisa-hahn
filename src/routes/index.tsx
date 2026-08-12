import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import {
  settingsQuery,
  categoriesQuery,
  projectsQuery,
  linksQuery,
  whatsappHref,
} from "@/lib/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfólio Autoral — projetos, ideias e processo" },
      {
        name: "description",
        content:
          "Portfólio pessoal autoral: projetos de identidade visual, editorial e audiovisual, com processo, textos e contato direto.",
      },
      { property: "og:title", content: "Portfólio Autoral — projetos, ideias e processo" },
      {
        property: "og:description",
        content: "Projetos de identidade visual, editorial e audiovisual, com processo e contato.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const { data: projects, isLoading } = useQuery(projectsQuery());
  const { data: links } = useQuery(linksQuery);
  const [filter, setFilter] = useState<string | null>(null);

  const list = (projects ?? []).filter((p) => !filter || p.category_id === filter);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-[3px] border-foreground px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="sticker ink-border hard-shadow-sm mb-6 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
            {settings?.role_title || "Portfólio autoral"}
          </p>
          <h1 className="pop-in max-w-4xl text-5xl uppercase sm:text-7xl lg:text-8xl">
            {settings?.portfolio_name ?? "Meu Portfólio"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-2xl">
            {settings?.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projetos"
              className="ink-border hard-shadow rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Ver projetos
            </a>
            <a
              href="#contato"
              className="ink-border hard-shadow rounded-lg bg-accent px-5 py-3 font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Falar comigo
            </a>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 rounded-full bg-secondary opacity-70 lg:block"
        />
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b-[3px] border-foreground bg-accent py-3 text-accent-foreground">
        <div className="marquee-track whitespace-nowrap font-display text-xl uppercase">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="px-6">
              {settings?.role_title || "Design autoral"} ✦
            </span>
          ))}
        </div>
      </div>

      {/* PROJETOS */}
      <section id="projetos" className="scroll-mt-24 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl uppercase sm:text-6xl">Projetos</h2>

          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar projetos por categoria"
          >
            <FilterChip active={filter === null} onClick={() => setFilter(null)}>
              Todos
            </FilterChip>
            {(categories ?? []).map((c) => (
              <FilterChip
                key={c.id}
                active={filter === c.id}
                onClick={() => setFilter(c.id)}
                color={c.color}
              >
                {c.name}
              </FilterChip>
            ))}
          </div>

          {isLoading ? (
            <p className="mt-10 text-muted-foreground">Carregando projetos…</p>
          ) : list.length === 0 ? (
            <p className="mt-10 text-muted-foreground">
              Nenhum projeto publicado ainda. Entre na área administrativa para cadastrar o
              primeiro.
            </p>
          ) : (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => {
                const cat = categories?.find((c) => c.id === p.category_id);
                return (
                  <li key={p.id}>
                    <Link
                      to="/projeto/$slug"
                      params={{ slug: p.slug }}
                      className="ink-border hard-shadow group flex h-full flex-col overflow-hidden rounded-xl bg-card transition-transform hover:-translate-y-1"
                      style={{ rotate: i % 3 === 1 ? "-0.7deg" : "0.5deg" }}
                    >
                      <div
                        className="aspect-[4/3] w-full border-b-[3px] border-foreground bg-muted"
                        style={{ backgroundColor: cat?.color ?? undefined }}
                      >
                        {p.cover_url ? (
                          <img
                            src={p.cover_url}
                            alt={`Capa do projeto ${p.title}`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {cat?.name ?? "Projeto"} · {p.year}
                        </span>
                        <h3 className="text-2xl uppercase">{p.title}</h3>
                        <p className="text-sm text-muted-foreground">{p.summary}</p>
                        <span className="mt-auto pt-3 text-sm font-bold text-primary">
                          Ver projeto →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-24 border-y-[3px] border-foreground bg-card px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-4xl uppercase sm:text-6xl">Sobre</h2>
            <p className="mt-6 text-xl">{settings?.presentation}</p>
            <p className="mt-4 whitespace-pre-line text-muted-foreground">{settings?.biography}</p>
          </div>
          <div className="ink-border hard-shadow h-fit rounded-xl bg-secondary p-6 text-secondary-foreground">
            <h3 className="text-xl uppercase">Onde me achar</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {settings?.location ? (
                <div>
                  <dt className="font-bold uppercase tracking-widest">Base</dt>
                  <dd>{settings.location}</dd>
                </div>
              ) : null}
              {settings?.email ? (
                <div>
                  <dt className="font-bold uppercase tracking-widest">E-mail</dt>
                  <dd>
                    <a className="underline underline-offset-4" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {(links ?? []).length > 0 ? (
                <div>
                  <dt className="font-bold uppercase tracking-widest">Links</dt>
                  <dd className="flex flex-wrap gap-3">
                    {(links ?? []).map((l) => (
                      <a
                        key={l.id}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline underline-offset-4"
                      >
                        {l.label}
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="scroll-mt-24 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl uppercase sm:text-6xl">Vamos conversar</h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Conta o que você quer criar. Respondo rápido e sem formulário chato.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {settings?.whatsapp ? (
              <a
                href={whatsappHref(settings.whatsapp)}
                target="_blank"
                rel="noreferrer noopener"
                className="ink-border hard-shadow rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
              >
                WhatsApp
              </a>
            ) : null}
            {settings?.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="ink-border hard-shadow rounded-lg bg-background px-5 py-3 font-bold"
              >
                {settings.email}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="ink-border rounded-full px-4 py-1.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: active ? (color ?? "var(--brand-1)") : "transparent",
        color: active ? "var(--paper)" : undefined,
        boxShadow: active ? "var(--shadow-hard-sm)" : undefined,
      }}
    >
      {children}
    </button>
  );
}
