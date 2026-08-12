
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.portfolio_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  portfolio_name text NOT NULL DEFAULT 'Meu Portfólio',
  role_title text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  presentation text NOT NULL DEFAULT '',
  biography text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  avatar_url text,
  accent_1 text NOT NULL DEFAULT '#FF4D6D',
  accent_2 text NOT NULL DEFAULT '#FFD400',
  accent_3 text NOT NULL DEFAULT '#3D5AFE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_settings TO authenticated;
GRANT ALL ON public.portfolio_settings TO service_role;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.portfolio_settings FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON public.portfolio_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_settings_updated BEFORE UPDATE ON public.portfolio_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "links public read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "links admin write" ON public.social_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '#FF4D6D',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text NOT NULL DEFAULT '',
  cover_url text,
  year text NOT NULL DEFAULT '',
  client text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects public read published" ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "projects admin read all" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "projects admin write" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.project_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  block_type text NOT NULL DEFAULT 'text',
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_blocks TO authenticated;
GRANT ALL ON public.project_blocks TO service_role;
ALTER TABLE public.project_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks public read" ON public.project_blocks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.published = true)
);
CREATE POLICY "blocks admin read all" ON public.project_blocks FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "blocks admin write" ON public.project_blocks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "media public read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media admin write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));

INSERT INTO public.portfolio_settings (portfolio_name, role_title, tagline, presentation, biography, email, whatsapp, location)
VALUES (
  'Estúdio Aurora',
  'Designer & Diretora de Arte',
  'Faço marcas barulhentas para gente que não quer passar despercebida.',
  'Trabalho na intersecção entre identidade visual, som e narrativa. Cada projeto começa com uma pergunta desconfortável e termina em algo que as pessoas querem tocar.',
  'Sou designer há 9 anos, passei por estúdios em São Paulo e Lisboa e hoje toco projetos autorais junto de marcas independentes, artistas e instituições culturais. Ensino tipografia experimental e coleciono discos riscados.',
  'ola@estudioaurora.com',
  '5511999998888',
  'São Paulo, Brasil'
);

INSERT INTO public.social_links (label, url, sort_order) VALUES
  ('Instagram','https://instagram.com',1),
  ('Behance','https://behance.net',2),
  ('LinkedIn','https://linkedin.com',3);

INSERT INTO public.categories (name, slug, description, color, sort_order) VALUES
  ('Identidade Visual','identidade','Marcas, sistemas gráficos e manuais.','#FF4D6D',1),
  ('Editorial','editorial','Livros, revistas e publicações independentes.','#3D5AFE',2),
  ('Som & Movimento','som','Trilhas, motion e experimentos audiovisuais.','#00C48C',3);

INSERT INTO public.projects (title, slug, summary, year, client, category_id, featured, sort_order)
VALUES
  ('Rádio Fantasma','radio-fantasma','Identidade sonora e visual para uma rádio noturna independente.','2025','Rádio Fantasma',(SELECT id FROM public.categories WHERE slug='som'),true,1),
  ('Manual Tipográfico Grito','manual-grito','Publicação experimental sobre tipografia de protesto na América Latina.','2024','Editora Grito',(SELECT id FROM public.categories WHERE slug='editorial'),true,2),
  ('Feira Caos','feira-caos','Sistema de identidade modular para uma feira de arte impressa.','2024','Feira Caos',(SELECT id FROM public.categories WHERE slug='identidade'),false,3);

INSERT INTO public.project_blocks (project_id, block_type, title, content, url, sort_order) VALUES
  ((SELECT id FROM public.projects WHERE slug='radio-fantasma'),'text','O desafio','A rádio existia só no som. Criamos um corpo visual que pulsa junto da programação noturna, com uma paleta que muda conforme o horário.','',1),
  ((SELECT id FROM public.projects WHERE slug='radio-fantasma'),'quote','','O design aqui não ilustra o som: ele responde ao som.','',2),
  ((SELECT id FROM public.projects WHERE slug='manual-grito'),'text','Processo','Três meses de arquivo, 120 cartazes digitalizados e uma grade tipográfica que aceita ruído.','',1);
