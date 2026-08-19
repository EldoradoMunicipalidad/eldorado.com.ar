# Server — Municipalidad de Eldorado

Backend Express + Postgres (Neon) + Cloudflare R2 para el sitio eldorado.gob.ar.

## Stack

- **Node 20 + Express 5** — API HTTP
- **Postgres (Neon)** — datos del CMS, turneros, admins
- **Multer** — multipart upload (memoria, no escribe a disco)
- **Cloudflare R2** — almacenamiento de imágenes del home (CDN edge-cache, egress 0)
- **bcrypt** — hash de passwords de admins

## Endpoints principales

| Ruta | Método | Descripción |
|---|---|---|
| `/api/home-content/` | GET | JSONB del home (carousel, tramites, info adicional). URLs R2 firmadas automáticamente. |
| `/api/home-content/` | PUT | Reemplaza el JSONB del home (admin) |
| `/api/home-content/upload` | POST | Sube imagen a R2, devuelve URL firmada (6 días) |
| `/api/home-content/r2-ping` | GET | Healthcheck R2 |
| `/api/escuela-manejo/...` | * | Turnero Escuela de Manejo |
| `/api/planeamiento/...` | * | Turnero Planeamiento |
| `/api/ambiente/...` | * | Turnero Ambiente |

## Cloudflare R2 — Home Content CMS

### Setup

1. **Bucket**: `sitiomunicipal` (creado en Cloudflare Dashboard)
2. **Env vars requeridas en Dokploy**:
   ```
   R2_ACCOUNT_ID=56e76507cd6dc6b879a728cc1718957e
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET_NAME=sitiomunicipal
   R2_ENDPOINT=https://56e76507cd6dc6b879a728cc1718957e.r2.cloudflarestorage.com
   ```
3. **API Token**: generado en Cloudflare Dashboard > R2 > Manage R2 API Tokens > Create API Token con permiso `Object Read & Write`.

### Flujo

```
Frontend (admin del home)
    │
    │  POST /api/home-content/upload (multipart, campo 'image')
    ▼
Backend (multer.memoryStorage → buffer)
    │
    │  uploadToR2({ buffer, contentType, keyPrefix, originalName })
    │  → genera key: 'home/{timestamp}-{random}-{filename}'
    │  → sube a R2 con Cache-Control: public, max-age=31536000, immutable
    │  → genera presigned URL (X-Amz-Signature) con expiresIn = 6 días
    ▼
Devuelve URL firmada al frontend
    │
    │  Frontend hace PUT /api/home-content/ con la URL en el JSONB
    ▼
Neon (page_content.home) — 4 KB total

Cuando el visitante carga el home:
    │
    │  GET /api/home-content/
    ▼
Backend lee page_content.home
    │
    │  signR2UrlsInContent() detecta cada key/URL de R2
    │  → genera nuevas presigned URLs (renueva expiración)
    ▼
Devuelve JSONB al frontend con URLs firmadas frescas
    │
    │  El browser hace GET a cada URL firmada
    ▼
R2 sirve la imagen (cacheada por Cloudflare CDN 1 año)
```

### Notas

- **Expiración**: AWS Signature V4 rechaza expiraciones > 7 días. Usamos 6 días para estar dentro del límite. El backend renueva la firma en cada GET del JSONB, así que el frontend no necesita preocuparse.
- **Bucket público**: NO se hace público en Cloudflare Dashboard. Las presigned URLs son el mecanismo de auth. Esto evita problemas con planes que limitan la opción de Public Access.
- **Costo**: $0.015/GB-mes de almacenamiento, $0 de egress.
- **Cache-Control**: el backend pone `public, max-age=31536000, immutable` en cada objeto. Las URLs firmadas se pueden cachear porque su contenido es único (key incluye timestamp).
- **Migración**: `server/scripts/migrate-base64-to-r2.cjs` migra el JSONB existente (base64 → URLs de R2). Idempotente.
- **Backup**: `server/scripts/backup-page-content.cjs` hace un dump del JSONB antes de cualquier migración. Excluido del repo por `.gitignore` (`server/backups/`).

## Postgres (Neon)

- Pool de conexiones en `server/db.cjs`. **No tiene fallback hardcodeado de DATABASE_URL**: si no está en env, tira error y sale (`process.exit(1)`). Los scripts durables en `scripts/` y `migrations/` deben recibir `DATABASE_URL` por env.
- Migraciones en `server/migrations/*.sql` con runners `.cjs` correspondientes.

## Turneros (escuela de manejo, planeamiento, ambiente)

- Lock físico de slots via UNIQUE INDEX parcial en la DB (`idx_appointments_*_slot` y `idx_appointments_*_dni_day`).
- Defense in depth: el backend valida `max_per_day` por DNI/día ANTES de INSERT, y la DB rechaza cualquier intento de duplicado con `23505`.
- Endpoint legacy sin validación eliminado (escuela de manejo).
