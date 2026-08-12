import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Área administrativa — Portfólio Autoral" },
      { name: "description", content: "Acesso restrito para editar os conteúdos do portfólio." },
      { property: "og:title", content: "Área administrativa — Portfólio Autoral" },
      { property: "og:description", content: "Acesso restrito para editar o portfólio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Conta criada!");
          navigate({ to: "/admin" });
        } else {
          toast.success("Confira seu e-mail para confirmar a conta.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível continuar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-background px-4">
      <div className="ink-border hard-shadow w-full max-w-md rounded-2xl bg-card p-8">
        <Link to="/" className="text-sm font-bold text-primary">
          ← Voltar ao portfólio
        </Link>
        <h1 className="mt-4 text-3xl uppercase">
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Área exclusiva de edição. Visitantes não precisam de login.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ink-border mt-1 w-full rounded-lg bg-background px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold uppercase tracking-widest">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ink-border mt-1 w-full rounded-lg bg-background px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="ink-border hard-shadow-sm w-full rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Aguarde…" : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm underline underline-offset-4"
        >
          {mode === "signin" ? "Ainda não tenho conta" : "Já tenho conta"}
        </button>
      </div>
    </div>
  );
}
