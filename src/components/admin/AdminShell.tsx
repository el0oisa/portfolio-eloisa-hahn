import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="grain min-h-screen bg-background">
      <header className="border-b-[3px] border-foreground bg-foreground px-4 py-3 text-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <span className="font-display text-lg uppercase">Painel · {title}</span>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link to="/" className="underline underline-offset-4">
              Ver portfólio
            </Link>
            <button type="button" onClick={signOut} className="underline underline-offset-4">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const inputClass = "ink-border mt-1 w-full rounded-lg bg-card px-3 py-2 text-sm";

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="ink-border hard-shadow-sm rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="ink-border rounded-lg bg-card px-3 py-2 text-sm font-bold disabled:opacity-60"
    >
      {children}
    </button>
  );
}
