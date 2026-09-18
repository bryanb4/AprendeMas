-- Historial de exámenes: intento, aciertos y total por examen
ALTER TABLE public.resultados
  ADD COLUMN IF NOT EXISTS intento integer,
  ADD COLUMN IF NOT EXISTS aciertos integer,
  ADD COLUMN IF NOT EXISTS total integer;
