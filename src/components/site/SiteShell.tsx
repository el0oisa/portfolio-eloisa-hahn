import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { settingsQuery, linksQuery } from "@/lib/portfolio";
import { useAuth } from "@/hooks/useAuth";

export function SiteShell({ children }: { children: ReactNode }) {
  const { data: settings } = useQuery(settingsQuery);
  const { data: links } = useQuery(linksQuery);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-1", settings.accent_1);
    root.style.setProperty("--brand-2", settings.accent_2);
    root.style.setProperty("--brand-3", settings.accent_3);
  }, [settings]);

  const name = settings?.portfolio_name ?? "Portfólio";

  return (
    <div className="grain min-h-screen bg-background text-foreground">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-40 border-b-[3px] border-foreground bg-background/95 backdrop-blur">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
        >
          <Link to="/" className="font-display text-lg uppercase tracking-tight">
            {name}
          </Link>
          <ul className="ml-auto flex flex-wrap items-center gap-3 text-sm font-medium">
            <li>
              <Link to="/" hash="projetos" className="hover:text-primary">
                Projetos
              </Link>
            </li>
            <li>
              <Link to="/" hash="sobre" className="hover:text-primary">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/" hash="contato" className="hover:text-primary">
                Contato
              </Link>
            </li>
            <li>
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="ink-border hard-shadow-sm rounded-md bg-secondary px-3 py-1.5 font-bold text-secondary-foreground"
                >
                  Admin
                </Link>
              ) : (
                <Link to="/auth" className="text-muted-foreground hover:text-primary">
                  Entrar
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main id="conteudo">{children}</main>

      <footer className="mt-24 border-t-[3px] border-foreground bg-foreground px-4 py-10 text-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-display text-2xl uppercase">{name}</p>
          <ul className="flex flex-wrap gap-4 text-sm">
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
