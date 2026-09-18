-- Módulo 3 (Master-Worker IA) + roles + banco de preguntas
-- Ejecutar: psql -U postgres -d app1 -f database/migracion_preguntas.sql

-- 1) Rol de usuario (alumno | admin)
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS rol character varying(20) NOT NULL DEFAULT 'alumno';

-- 2) Banco de preguntas generadas por IA y validadas por el admin
CREATE TABLE IF NOT EXISTS public.preguntas (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  materia_id integer REFERENCES public.materias(id),
  tema_id integer REFERENCES public.temas(id),
  nivel integer NOT NULL DEFAULT 800,
  tipo character varying(20) NOT NULL DEFAULT 'ejercicios'
    CHECK (tipo IN ('evaluacion', 'simulacion', 'ejercicios')),
  pregunta text NOT NULL,
  opciones jsonb NOT NULL DEFAULT '[]'::jsonb,
  respuesta_correcta text NOT NULL,
  explicacion text,
  status character varying(20) NOT NULL DEFAULT 'pending_review',
  rating integer NOT NULL DEFAULT 800,
  created_by integer REFERENCES public.usuarios(id),
  created_at timestamp without time zone DEFAULT NOW()
);

-- 3) Seed de materias (las 4 del Dashboard)
INSERT INTO public.materias (id, nombre, descripcion, icon) VALUES
  (1, 'Aritmética', 'Numeración y Operaciones.', '🧮'),
  (2, 'Álgebra', 'Ecuaciones y funciones.', '🔣'),
  (3, 'Geometría y Medición', 'Figuras y ángulos.', '🔷'),
  (4, 'Estadística y Probabilidad', 'Datos y azar.', '📊')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  icon = EXCLUDED.icon;

-- 4) Seed de temas (los mismos que muestran las páginas de estudio:
--    AritmeticaPage.secciones, AlgebraPage.secciones, temasGeometria,
--    temasEstadistica)
INSERT INTO public.temas (id, materia_id, nombre) VALUES
  (1, 1, 'Números Reales'),
  (2, 1, 'Potencias Enteras Positivas y Leyes de Exponentes'),
  (3, 1, 'Raíz Cuadrada'),
  (4, 1, 'Operaciones y Jerarquía'),
  (5, 1, 'Operaciones con fracciones'),
  (6, 2, 'Expresiones algebraicas con una variable'),
  (7, 2, 'Tipo de expresiones'),
  (8, 2, 'Ecuaciones'),
  (9, 2, 'Inecuaciones en una variable'),
  (10, 2, 'Ecuaciones lineales en varias variables'),
  (11, 2, 'Sistema de ecuaciones con 2 variables (2x2)'),
  (12, 2, 'Polinomios'),
  (13, 2, 'Multiplicación y división de polinomios'),
  (14, 2, 'Factorización de polinomios'),
  (15, 2, 'Factorización parte 2'),
  (16, 2, 'Factorización parte 3'),
  (17, 2, 'Expresiones algebraicas racionales o fracciones algebraicas'),
  (18, 2, 'Suma y resta de expresiones algebraicas racionales'),
  (19, 2, 'Multiplicación y división de expresiones algebraicas racionales'),
  (20, 2, 'Ecuaciones cuadráticas'),
  (21, 2, 'Plano cartesiano'),
  (22, 2, 'Funciones y sus gráficas'),
  (23, 2, 'Sistemas de ecuaciones lineales en dos variables'),
  (24, 3, 'Ángulos y triángulos'),
  (25, 3, 'Rectas paralelas cortadas por una secante'),
  (26, 3, 'Congruencia y semejanza'),
  (27, 3, 'Teorema de Pitágoras y triángulos especiales'),
  (28, 3, 'Círculos'),
  (29, 3, 'Sólidos'),
  (30, 3, 'Perímetro, área y volumen'),
  (31, 4, 'Tablas y gráficas'),
  (32, 4, 'Medidas de tendencia central de datos'),
  (33, 4, 'Probabilidad de un evento'),
  (34, 4, 'Espacio muestral')
ON CONFLICT (id) DO UPDATE SET
  materia_id = EXCLUDED.materia_id,
  nombre = EXCLUDED.nombre;

SELECT setval('public.materias_id_seq', (SELECT MAX(id) FROM public.materias));
SELECT setval('public.temas_id_seq', (SELECT MAX(id) FROM public.temas));
