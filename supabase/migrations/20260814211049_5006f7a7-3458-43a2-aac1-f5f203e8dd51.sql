ALTER TABLE public.portfolio_settings
  ADD COLUMN IF NOT EXISTS theme_preset text NOT NULL DEFAULT 'vibrante',
  ADD COLUMN IF NOT EXISTS typography_preset text NOT NULL DEFAULT 'grotesk',
  ADD COLUMN IF NOT EXISTS grid_preset text NOT NULL DEFAULT 'suico',
  ADD COLUMN IF NOT EXISTS spacing_preset text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS radius_preset text NOT NULL DEFAULT 'media',
  ADD COLUMN IF NOT EXISTS shadow_preset text NOT NULL DEFAULT 'dura',
  ADD COLUMN IF NOT EXISTS border_preset text NOT NULL DEFAULT 'marcada',
  ADD COLUMN IF NOT EXISTS motion_preset text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS tone_preset text NOT NULL DEFAULT 'direto',
  ADD COLUMN IF NOT EXISTS copy_overrides jsonb NOT NULL DEFAULT '{}'::jsonb;