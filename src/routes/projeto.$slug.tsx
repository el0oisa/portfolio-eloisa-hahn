import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { projectBySlugQuery, categoriesQuery, youtubeId } from "@/lib/portfolio";

export const Route = createFileRoute("/projeto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Projeto ${params.slug} — Portfólio Autoral` },
      {
        name: "description",
        content: "Estudo de caso completo: contexto, processo, imagens, vídeos e áudio do projeto.",
      },
      { property: "og:title", content: `Projeto ${params.slug} — Portfólio Autoral` },
      {
        property: "og:description",
        content: "Estudo de caso completo: contexto, processo, imagens, vídeos e áudio.",
      },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery(projectBySlugQuery(slug));
  const { data: categories } = useQuery(categoriesQuery);

  const project = data?.project;
  const cat = categories?.find((c) => c.id === project?.category_id);

  return (
    <SiteShell>
      <article className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <Link to="/" hash="projetos" className="text-sm font-bold text-primary">
            ← Todos os projetos
          </Link>

          {isLoading ? (
            <p className="mt-8 text-muted-foreground">Carregando…</p>
          ) : !project ? (
            <p className="mt-8 text-muted-foreground">Projeto não encontrado.</p>
          ) : (
            <>
              <p
                className="sticker ink-border mt-6 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                style={{ backgroundColor: cat?.color ?? "var(--brand-2)", color: "var(--paper)" }}
              >
                {cat?.name ?? "Projeto"}
              </p>
              <h1 className="mt-5 text-4xl uppercase sm:text-6xl">{project.title}</h1>
              <p className="mt-4 text-xl text-muted-foreground">{project.summary}</p>

              <dl className="mt-6 flex flex-wrap gap-6 border-y-[3px] border-foreground py-4 text-sm">
                {project.client ? (
                  <div>
                    <dt className="font-bold uppercase tracking-widest">Cliente</dt>
                    <dd>{project.client}</dd>
                  </div>
                ) : null}
                {project.year ? (
                  <div>
                    <dt className="font-bold uppercase tracking-widest">Ano</dt>
                    <dd>{project.year}</dd>
                  </div>
                ) : null}
              </dl>

              {project.cover_url ? (
                <img
                  src={project.cover_url}
                  alt={`Imagem principal do projeto ${project.title}`}
                  className="ink-border hard-shadow mt-8 w-full rounded-xl"
                />
              ) : null}

              <div className="mt-10 space-y-10">
                {(data?.blocks ?? []).map((b) => {
                  if (b.block_type === "quote") {
                    return (
                      <blockquote
                        key={b.id}
                        className="ink-border hard-shadow rounded-xl bg-secondary p-6 font-display text-2xl uppercase text-secondary-foreground"
                      >
                        {b.content}
                      </blockquote>
                    );
                  }
                  if (b.block_type === "image" && b.url) {
                    return (
                      <figure key={b.id}>
                        <img
                          src={b.url}
                          alt={b.title || `Imagem do projeto ${project.title}`}
                          loading="lazy"
                          className="ink-border w-full rounded-xl"
                        />
                        {b.content ? (
                          <figcaption className="mt-2 text-sm text-muted-foreground">
                            {b.content}
                          </figcaption>
                        ) : null}
                      </figure>
                    );
                  }
                  if (b.block_type === "youtube" && youtubeId(b.url)) {
                    return (
                      <div key={b.id}>
                        {b.title ? <h2 className="mb-3 text-2xl uppercase">{b.title}</h2> : null}
                        <div className="ink-border aspect-video w-full overflow-hidden rounded-xl">
                          <iframe
                            className="h-full w-full"
                            src={`https://www.youtube.com/embed/${youtubeId(b.url)}`}
                            title={b.title || "Vídeo do projeto"}
                            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    );
                  }
                  if (b.block_type === "audio" && b.url) {
                    return (
                      <div key={b.id} className="ink-border rounded-xl bg-card p-5">
                        {b.title ? <h2 className="mb-3 text-xl uppercase">{b.title}</h2> : null}
                        <audio controls src={b.url} className="w-full">
                          Seu navegador não suporta áudio.
                        </audio>
                      </div>
                    );
                  }
                  return (
                    <section key={b.id}>
                      {b.title ? <h2 className="mb-3 text-2xl uppercase">{b.title}</h2> : null}
                      <p className="whitespace-pre-line text-lg">{b.content}</p>
                    </section>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
