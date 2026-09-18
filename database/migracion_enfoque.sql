-- Enfoque del reactivo (teorica = comprensión literal del material,
-- practica = problema numérico/aplicado). Solo aplica a ejercicios y evaluación.
ALTER TABLE public.preguntas
  ADD COLUMN IF NOT EXISTS enfoque character varying(20) NOT NULL DEFAULT 'practica'
  CHECK (enfoque IN ('teorica', 'practica'));
