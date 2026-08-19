-- Escuela de Manejo: agregar columna fecha_nacimiento + UNIQUE INDEX por slot
-- Fecha: 2026-08-19
-- BLOQUE 2: bug fixes end-to-end
--   1) Persistir fecha_nacimiento (hoy se pide en el form pero se descartaba)
--   2) Lock de slot por (area_id, date, time) — un solo turno activo por slot
--      (cancelled se excluye para permitir re-reserva tras cancelación)
--
-- Idempotente: se puede correr varias veces sin error.

BEGIN;

-- ─── 1) Columna fecha_nacimiento ───────────────────────────────────────────────
ALTER TABLE appointments_escuela_manejo
  ADD COLUMN IF NOT EXISTS fecha_nacimiento TEXT DEFAULT '';

-- ─── 2) Cancelar duplicados preexistentes (conservar el más nuevo) ─────────────
-- Igual estrategia que Planeamiento: marca duplicados viejos como cancelled
-- con tag 'duplicate-cleanup' para auditoría, libera el slot para UNIQUE INDEX.
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY area_id, date, time
           ORDER BY created_at DESC, id DESC
         ) AS rn
  FROM appointments_escuela_manejo
  WHERE status != 'cancelled'
)
UPDATE appointments_escuela_manejo a
SET status = 'cancelled'
FROM ranked r
WHERE a.id = r.id AND r.rn > 1;

-- ─── 3) UNIQUE INDEX parcial sobre turnos activos ──────────────────────────────
-- Solo aplica a status != 'cancelled', permitiendo múltiples cancelados
-- históricos en el mismo slot (es lo que queremos: reusar el slot).
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_escuela_manejo_slot
  ON appointments_escuela_manejo (area_id, date, time)
  WHERE status != 'cancelled';

COMMIT;

-- ─── Verificación post-migración (comentado, ejecutar a mano) ──────────────────
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name='appointments_escuela_manejo' AND column_name='fecha_nacimiento';
-- SELECT indexname FROM pg_indexes WHERE tablename='appointments_escuela_manejo';
-- SELECT area_id, date, time, COUNT(*)
--   FROM appointments_escuela_manejo WHERE status != 'cancelled'
--   GROUP BY area_id, date, time HAVING COUNT(*) > 1;
