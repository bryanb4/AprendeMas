# ExamenDone / Aprende+ — Plataforma de aprendizaje y simulación Piense II (UDG)

## Requisitos

- Node.js 18+ y npm
- PostgreSQL 14+ (puerto 5432, usuario `postgres`)

## Puesta en marcha (5 pasos)

### 1. Base de datos

```bash
createdb -U postgres app1
psql -U postgres -d app1 -f database/backup_completo.sql
```

`backup_completo.sql` trae TODO: tablas, materias, temas, banco de preguntas,
usuarios de prueba y migraciones ya aplicadas. (La contraseña del dump de
referencia es `ExamenDone2026*`; si usas otra, ajústala en el `.env`.)

### 2. Variables de entorno

```bash
copy .env.equipo .env
```

`.env.equipo` ya trae las keys del equipo (Gemini, Groq, Cerebras, Gmail).
⚠️ No hagas público el repo sin rotarlas.

El frontend usa `mi-proyecto/.env` (`VITE_API_URL=http://localhost:5000`), ya incluido.

### 3. Dependencias

```bash
npm install          # raíz (backend + master + worker)
cd mi-proyecto
npm install          # frontend
```

### 4. Levantar los 4 servicios (4 terminales)

```bash
# 1/4 backend API :5000 (desde la raíz)
node server.js

# 2/4 master coordinador :3001 (desde la raíz)
npm run master

# 3/4 worker IA (desde la raíz)
npm run worker

# 4/4 frontend :5173 (desde mi-proyecto/)
npm run dev
```

### 5. Entrar

- App: http://localhost:5173
- Admin: `proyectoqci5@gmail.com` / `Admin2026*` → entra directo al generador (`/adminIA`)
- Salud del backend: http://localhost:5000/api/health

## Estructura

- `server.js` — API Express (auth, perfil, resultados, exámenes)
- `master.js` / `worker-ia.js` — Módulo 3: Master-Worker con sockets (`:3001`)
- `mi-proyecto/` — frontend React + Vite con KaTeX
- `database/` — `backup_completo.sql` + migraciones
- `contenidos/` — material de estudio por tema (fuente para IA en ejercicios/evaluación)
- `scripts/` — `extraer_contenidos.js`, `generacion_masiva.js`

## Generar más preguntas (admin)

```bash
# Rellena hasta la meta por (tema, tipo, enfoque); reejecutable
node scripts/generacion_masiva.js <email-admin> <password>

# Solo mezcla de simulación 3 básico + 5 medio + 2 avanzado
node scripts/generacion_masiva.js <email-admin> <password> --mix-simulacion
```
