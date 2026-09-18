-- Progreso por tema: qué examen aprobó cada usuario
ALTER TABLE public.resultados
  ADD COLUMN IF NOT EXISTS tema_id integer REFERENCES public.temas(id),
  ADD COLUMN IF NOT EXISTS tipo character varying(20) NOT NULL DEFAULT 'evaluacion';
