-- Migración: campo avatar para usuarios (Aprende+)
-- Ejecutar una vez en PostgreSQL:
--   psql -d <DB> -f database/add_avatar_column.sql
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT NULL;
