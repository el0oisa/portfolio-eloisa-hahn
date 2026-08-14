import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, MessageCircle, Mail, MapPin, Link2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { categoriesQuery, projectsQuery, linksQuery, whatsappHref } from "@/lib/portfolio";

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
  const { settings, copy } = useSiteConfig();
  const { data: categories } = useQuery(categoriesQuery);
  const { data: projects, isLoading } = useQuery(projectsQuery());
  const { data: links } = useQuery(linksQuery);
  const [filter, setFilter] = useState<string | null>(null);

  const list = (projects ?? []).filter((p) => !filter || p.category_id === filter);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-[length:var(--ds-border-width)] border-foreground py-ds-3xl">
        <div className="ds-container">
          <p className="sticker ink-border hard-shadow-sm mb-ds-lg inline-block rounded-full bg-secondary px-ds-md py-ds-xs text-fluid-xs font-bold uppercase tracking-widest text-secondary-foreground">
            {settings?.role_title || "Portfólio autoral"}
          </p>
          <h1 className="pop-in max-w-[56rem] text-fluid-4xl uppercase">
            {settings?.portfolio_name ?? "Meu Portfólio"}
          </h1>
          <p className="mt-ds-lg max-w-[42rem] text-fluid-lg text-muted-foreground">{settings?.tagline}</p>
          <div className="mt-ds-xl flex flex-wrap gap-ds-sm">
            <a
              href="#projetos"
              className="ink-border hard-shadow ds-interactive rounded-lg bg-primary px-ds-lg py-ds-sm font-bold text-primary-foreground"
            >
              {copy.heroPrimaryCta}
            </a>
            <a
              href="#contato"
              className="ink-border hard-shadow ds-interactive rounded-lg bg-accent px-ds-lg py-ds-sm font-bold text-accent-foreground"
            >
              {copy.heroSecondaryCta}
            </a>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 rounded-full bg-secondary opacity-70 lg:block"
        />
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b-[length:var(--ds-border-width)] border-foreground bg-accent py-ds-sm text-accent-foreground">
        <div className="marquee-track whitespace-nowrap font-display text-fluid-lg uppercase">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="px-ds-lg">
              {settings?.role_title || "Design autoral"} ✦
            </span>
          ))}
        </div>
      </div>

      {/* PROJETOS */}
      <section id="projetos" className="scroll-mt-24 py-ds-2xl">
        <div className="ds-container">
          <h2 className="text-fluid-3xl uppercase">{copy.projectsTitle}</h2>

          <div className="mt-ds-lg flex flex-wrap gap-ds-sm" role="group" aria-label={copy.filterLabel}>
            <FilterChip active={filter === null} onClick={() => setFilter(null)}>
              {copy.filterAll}
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
            <p className="mt-ds-xl text-muted-foreground">{copy.loading}</p>
          ) : list.length === 0 ? (
            <p className="mt-ds-xl text-muted-foreground">{copy.emptyProjects}</p>
          ) : (
            <ul className="ds-grid mt-ds-xl">
              {list.map((p) => {
                const cat = categories?.find((c) => c.id === p.category_id);
                return (
                  <li key={p.id} className="ds-grid-offset">
                    <Link
                      to="/projeto/$slug"
                      params={{ slug: p.slug }}
                      className="ink-border hard-shadow ds-interactive flex h-full flex-col overflow-hidden rounded-xl bg-card"
                    >
                      <div
                        className="ds-card-media w-full border-b-[length:var(--ds-border-width)] border-foreground bg-muted"
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
                      <div className="flex flex-1 flex-col gap-ds-xs p-ds-lg">
                        <span className="text-fluid-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {cat?.name ?? "Projeto"} · {p.year}
                        </span>
                        <h3 className="text-fluid-xl uppercase">{p.title}</h3>
                        <p className="text-fluid-sm text-muted-foreground">{p.summary}</p>
                        <span className="mt-auto inline-flex items-center gap-ds-xs pt-ds-sm text-fluid-sm font-bold text-primary">
                          {copy.cardCta}
                          <ArrowRight aria-hidden="true" className="h-4 w-4" />
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
      <section
        id="sobre"
        className="scroll-mt-24 border-y-[length:var(--ds-border-width)] border-foreground bg-card py-ds-2xl"
      >
        <div className="ds-container grid gap-ds-xl lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-fluid-3xl uppercase">{copy.aboutTitle}</h2>
            <p className="mt-ds-lg text-fluid-lg">{settings?.presentation}</p>
            <p className="mt-ds-md whitespace-pre-line text-muted-foreground">{settings?.biography}</p>
          </div>
          <div className="ink-border hard-shadow h-fit rounded-xl bg-secondary p-ds-lg text-secondary-foreground">
            <h3 className="text-fluid-lg uppercase">Onde me achar</h3>
            <dl className="mt-ds-md space-y-ds-sm text-fluid-sm">
              {settings?.location ? (
                <div>
                  <dt className="flex items-center gap-ds-xs font-bold uppercase tracking-widest">
                    <MapPin aria-hidden="true" className="h-4 w-4" /> Base
                  </dt>
                  <dd>{settings.location}</dd>
                </div>
              ) : null}
              {settings?.email ? (
                <div>
                  <dt className="flex items-center gap-ds-xs font-bold uppercase tracking-widest">
                    <Mail aria-hidden="true" className="h-4 w-4" /> E-mail
                  </dt>
                  <dd>
                    <a className="underline underline-offset-4" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {(links ?? []).length > 0 ? (
                <div>
                  <dt className="flex items-center gap-ds-xs font-bold uppercase tracking-widest">
                    <Link2 aria-hidden="true" className="h-4 w-4" /> Links
                  </dt>
                  <dd className="flex flex-wrap gap-ds-sm">
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
      <section id="contato" className="scroll-mt-24 py-ds-3xl">
        <div className="ds-container">
          <h2 className="text-fluid-3xl uppercase">{copy.contactTitle}</h2>
          <p className="mt-ds-md max-w-[36rem] text-fluid-lg text-muted-foreground">{copy.contactLead}</p>
          <div className="mt-ds-xl flex flex-wrap gap-ds-sm">
            {settings?.whatsapp ? (
              <a
                href={whatsappHref(settings.whatsapp)}
                target="_blank"
                rel="noreferrer noopener"
                className="ink-border hard-shadow ds-interactive inline-flex items-center gap-ds-xs rounded-lg bg-primary px-ds-lg py-ds-sm font-bold text-primary-foreground"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                {copy.whatsappCta}
              </a>
            ) : null}
            {settings?.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="ink-border hard-shadow ds-interactive inline-flex items-center gap-ds-xs rounded-lg bg-background px-ds-lg py-ds-sm font-bold"
              >
                <Mail aria-hidden="true" className="h-5 w-5" />
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
      className="ink-border ds-pressable rounded-full px-ds-md py-ds-xs text-fluid-sm font-bold"
      style={{
        backgroundColor: active ? (color ?? "var(--ds-primary)") : "transparent",
        color: active ? "var(--ds-background)" : undefined,
        boxShadow: active ? "var(--ds-shadow-sm)" : undefined,
      }}
    >
      {children}
    </button>
  );
}
