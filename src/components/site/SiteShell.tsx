import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { linksQuery } from "@/lib/portfolio";
import { useAuth } from "@/hooks/useAuth";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function SiteShell({ children }: { children: ReactNode }) {
  const { settings, copy } = useSiteConfig();
  const { data: links } = useQuery(linksQuery);
  const { isAdmin } = useAuth();

  const name = settings?.portfolio_name ?? "Portfólio";

  return (
    <div className="grain min-h-screen bg-background text-foreground">
      <a href="#conteudo" className="skip-link">
        {copy.skipLink}
      </a>

      <header className="sticky top-0 z-40 border-b-[length:var(--ds-border-width)] border-foreground bg-background/95 backdrop-blur">
        <nav
          aria-label="Navegação principal"
          className="ds-container flex flex-wrap items-center gap-x-md gap-y-sm py-sm"
        >
          <Link to="/" className="font-display text-fluid-lg uppercase tracking-tight">
            {name}
          </Link>
          <ul className="ml-auto flex flex-wrap items-center gap-sm text-fluid-sm font-medium">
            <li>
              <Link to="/" hash="projetos" className="ds-interactive inline-block hover:text-primary">
                {copy.navProjects}
              </Link>
            </li>
            <li>
              <Link to="/" hash="sobre" className="ds-interactive inline-block hover:text-primary">
                {copy.navAbout}
              </Link>
            </li>
            <li>
              <Link to="/" hash="contato" className="ds-interactive inline-block hover:text-primary">
                {copy.navContact}
              </Link>
            </li>
            <li>
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="ink-border hard-shadow-sm ds-interactive inline-block rounded-md bg-secondary px-sm py-xs font-bold text-secondary-foreground"
                >
                  {copy.navAdmin}
                </Link>
              ) : (
                <Link to="/auth" className="ds-interactive inline-block text-muted-foreground hover:text-primary">
                  {copy.navLogin}
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main id="conteudo">{children}</main>

      <footer className="mt-3xl border-t-[length:var(--ds-border-width)] border-foreground bg-foreground py-xl text-background">
        <div className="ds-container flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
          <p className="font-display text-fluid-xl uppercase">{name}</p>
          <ul className="flex flex-wrap gap-md text-fluid-sm">
            {(links ?? []).map((l) => (
              <li key={l.id}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-4"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
