-- Licitaciones municipales — tabla con soft delete
-- Fecha: 2026-08-25
--
-- Por qué:
--   Hasta hoy las licitaciones vivían en src/data/GobiernoAbierto/licitacionesData.js
--   (hardcoded) y los PDFs en public/licitaciones/. Eso obligaba a un commit + push +
--   redeploy de Dokploy (5-30 min) por cada pliego nuevo.
--
--   Esta tabla permite editar el contenido desde /admin/licitaciones, con upload
--   de PDFs a Cloudflare R2 (mismo bucket que Home CMS) y soft delete para auditoría.
--
-- Decisiones:
--   - codigo es único entre filas NO soft-deleted (se permite reusar el código de
--     una licitación eliminada si el operador decide republicarla con el mismo N°).
--   - pdf_key es el key de R2 (ej 'licitaciones/1724...-PLIEGO-...pdf'), no la URL.
--     El backend firma la URL fresca en cada GET (igual que Home CMS).
--   - fecha_publicacion es DATE (DD/MM/YYYY se deriva en el frontend).

CREATE TABLE IF NOT EXISTS licitaciones (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('publica','privada')),
  fecha_publicacion DATE NOT NULL,
  descripcion TEXT NOT NULL,
  pdf_key TEXT,
  pdf_filename TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- UNIQUE parcial: el código debe ser único entre licitaciones NO soft-deleted.
CREATE UNIQUE INDEX IF NOT EXISTS idx_licitaciones_codigo_active
  ON licitaciones (codigo)
  WHERE deleted_at IS NULL;

-- Orden por fecha descendente (es el orden natural de la página pública).
CREATE INDEX IF NOT EXISTS idx_licitaciones_fecha_desc
  ON licitaciones (fecha_publicacion DESC)
  WHERE deleted_at IS NULL;

-- Verificación
DO $$
DECLARE
  table_count INTEGER;
  idx_unique INTEGER;
  idx_fecha INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename = 'licitaciones';

  SELECT COUNT(*) INTO idx_unique
  FROM pg_indexes
  WHERE schemaname = 'public' AND tablename = 'licitaciones'
    AND indexname = 'idx_licitaciones_codigo_active';

  SELECT COUNT(*) INTO idx_fecha
  FROM pg_indexes
  WHERE schemaname = 'public' AND tablename = 'licitaciones'
    AND indexname = 'idx_licitaciones_fecha_desc';

  RAISE NOTICE 'tabla licitaciones: %', CASE WHEN table_count = 1 THEN 'OK' ELSE 'FALTA' END;
  RAISE NOTICE 'idx_licitaciones_codigo_active: %', CASE WHEN idx_unique = 1 THEN 'OK' ELSE 'FALTA' END;
  RAISE NOTICE 'idx_licitaciones_fecha_desc: %', CASE WHEN idx_fecha = 1 THEN 'OK' ELSE 'FALTA' END;
END
$$;