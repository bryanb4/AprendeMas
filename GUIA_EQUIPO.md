# GUÍA DE INSTALACIÓN — Proyecto ExamenDone (Aprende+)

## 1. Lo que debes instalar

| Programa | Versión | Dónde |
|---|---|---|
| Node.js (+ npm) | 18 o superior | https://nodejs.org |
| PostgreSQL | 14 o superior | https://www.postgresql.org/download (marca la opción de agregar herramientas al PATH) |
| Git | cualquiera | https://git-scm.com |

Verifica con: `node --version`, `npm --version`, `psql --version`.
Anota la **contraseña del usuario `postgres`** que definas al instalar PostgreSQL — la usarás en los pasos 3 y 4.

## 2. Clonar el proyecto (rama correcta)

```bash
git clone -b fusion https://github.com/bryanb4/AprendeMas.git
cd AprendeMas
```

> ⚠️ Sin el `-b fusion` clonarás `master`, que está desactualizado.

## 3. Base de datos

Necesitas crear la base `app1` y cargarle el respaldo `database/backup_completo.sql`
(ya trae las 5 tablas con todo el contenido: materias, 34 temas, banco de
preguntas, usuarios de prueba). Tienes **dos caminos**, elige el que prefieras.
En ambos te pedirá **tu** contraseña de postgres.

### Opción A — pgAdmin (interfaz gráfica, recomendada)

1. Abre **pgAdmin** y conéctate a tu servidor local.
2. En el árbol de la izquierda: clic derecho en **Databases** → **Create** → **Database** → nombre: `app1` → **Save**.
3. Clic derecho en la nueva base **`app1`** → **Query Tool** (se abre el editor SQL).
4. En el Query Tool pulsa el icono de **carpeta "Open File"**, busca el archivo `database\backup_completo.sql` dentro de la carpeta que clonaste y dale **Select**.
5. Pulsa **F5** (o el botón ▶ Execute). Abajo debe decir *Query returned successfully*.
6. Comprueba: expande `app1 → Schemas → public → Tables`, clic derecho en `preguntas` → **View/Edit Data → First 100 Rows**. Debes ver cientos de filas.

> Nota: pgAdmin también tiene la opción "Restore...", pero esa es para respaldos en
> formato custom; como el nuestro es `.sql` plano, el camino correcto es el Query Tool.

### Opción B — terminal (comandos)

Desde cualquier terminal (más cómodo desde la carpeta clonada):

```bash
createdb -U postgres app1
psql -U postgres -d app1 -f database/backup_completo.sql
```

- `createdb` = crea la base vacía. `-U postgres` = conéctate como usuario postgres.
- `psql -d app1 -f ...` = ejecuta el archivo SQL dentro de la base `app1`.

En Windows, si dice que no reconoce `createdb`/`psql`, usa la ruta completa
(ajusta el número por tu versión de PostgreSQL):

```bash
"C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U postgres app1
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d app1 -f database\backup_completo.sql
```

Para comprobar por terminal:

```bash
psql -U postgres -d app1 -c "SELECT count(*) FROM preguntas;"
```

## 4. Variables de entorno (claves del equipo)

```bash
copy .env.equipo .env
```

El archivo `.env.equipo` ya trae JWT, Gmail y las 3 IAs. **Lo único que debes revisar** es esta línea, si tu contraseña de postgres es distinta:

```
DB_PASSWORD=tu_contraseña_de_postgres
```

El frontend (`mi-proyecto/.env`) ya viene configurado, no lo toques.

## 5. Dependencias (una sola vez)

```bash
npm install
cd mi-proyecto
npm install
cd ..
```

## 6. Arrancar (4 terminales, en este orden)

| # | Carpeta | Comando | Puerto | Señal de que está bien |
|---|---|---------|--------|------------------------|
| 1 | raíz | `node server.js` | 5000 | "Servidor corriendo en puerto 5000" |
| 2 | raíz | `npm run master` | 3001 | "Escuchando en puerto 3001" |
| 3 | raíz | `node worker-ia.js` (o `npm run worker`) | — | "Registro aceptado" |
| 4 | `mi-proyecto/` | `npm run dev` | 5173 | "ready" + "http://localhost:5173" |

## 7. Entrar y comprobar

- Web: http://localhost:5173 (primera vez con `Ctrl + Shift + R`)
- Admin: `proyectoqci5@gmail.com` / `Admin2026*` (entra directo al generador `/adminIA`)
- Salud del backend: http://localhost:5000/api/health → `"db":"up"`

## 8. Si algo falla

- Error 500 al entrar → revisa `DB_PASSWORD` en `.env` o que la BD se haya restaurado.
- Panel "Sin conexión" en admin → levanta master y worker, luego botón Reintentar.
- Puerto ocupado (`EADDRINUSE`) → cierra terminales viejas de node y reintenta.
- Correo de verificación ausente → el enlace sale en la consola del backend.
