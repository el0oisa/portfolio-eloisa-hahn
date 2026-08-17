import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha — Portfólio Autoral" },
      { name: "description", content: "Defina uma nova senha para acessar o painel do portfólio." },
      { property: "og:title", content: "Redefinir senha — Portfólio Autoral" },
      { property: "og:description", content: "Defina uma nova senha de administrador." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não conferem.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada!");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível atualizar a senha.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-background px-4">
      <div className="ink-border hard-shadow w-full max-w-md rounded-2xl bg-card p-8">
        <Link to="/auth" className="text-sm font-bold text-primary">
          ← Voltar ao login
        </Link>
        <h1 className="mt-4 text-3xl uppercase">Nova senha</h1>

        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Abra esta página pelo link enviado no e-mail de recuperação. Se você já clicou no link e
            está vendo esta mensagem, peça um novo e-mail na tela de login.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="new-password" className="text-sm font-bold uppercase tracking-widest">
                Nova senha
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ink-border mt-1 w-full rounded-lg bg-background px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="text-sm font-bold uppercase tracking-widest"
              >
                Confirmar senha
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="ink-border mt-1 w-full rounded-lg bg-background px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="ink-border hard-shadow-sm w-full rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Salvando…" : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
