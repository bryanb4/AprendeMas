-- Migración: verificación de correo por token
-- Ejecutar con: psql -U postgres -d app1 -f database/migracion_verificacion.sql

ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_token TEXT,
  ADD COLUMN IF NOT EXISTS token_created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();

-- Los usuarios que ya existían quedan verificados para no bloquearlos
UPDATE public.usuarios SET email_verified = true WHERE email_verified = false AND verification_token IS NULL;
