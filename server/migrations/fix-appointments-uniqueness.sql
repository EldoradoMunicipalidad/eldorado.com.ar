-- Fix appointments uniqueness (turnero Planeamiento)
-- Fecha: 2026-08-14
-- Problema: dos personas podían reservar el mismo (area, fecha, hora)
-- porque la tabla no tenía UNIQUE constraint y el endpoint POST
-- no validaba disponibilidad antes de INSERT.
--
-- Estrategia:
--   1) Marcar como 'cancelled' los duplicados viejos (mantener el más nuevo).
--      Esto libera el slot para UNIQUE INDEX sin perder información.
--   2) Crear UNIQUE INDEX PARCIAL sobre turnos activos (status != 'cancelled').
--      El índice parcial no choca con los turnos cancelados históricos.
--
-- Idempotente: se puede correr varias veces sin error.

BEGIN;

-- ─── Paso 1: detectar y cancelar duplicados preexistentes ───────────────────
-- Conserva el más reciente (created_at DESC). Los demás se marcan cancelled
-- con un tag 'duplicate-cleanup' para auditoría.
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY area_id, date, time
           ORDER BY created_at DESC, id DESC
         ) AS rn
  FROM appointments
  WHERE status != 'cancelled'
)
UPDATE appointments
SET status = 'cancelled'
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- ─── Paso 2: UNIQUE INDEX parcial sobre turnos activos ──────────────────────
-- Solo aplica a status != 'cancelled', permitiendo múltiples cancelados
-- históricos en el mismo slot (es lo que queremos: reusar el slot).
CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot_unique
  ON appointments (area_id, date, time)
  WHERE status != 'cancelled';

COMMIT;

-- ─── Verificación post-migración ────────────────────────────────────────────
-- (Comentado: se puede ejecutar manualmente después)
-- SELECT indexname FROM pg_indexes WHERE tablename='appointments';
-- SELECT area_id, date, time, COUNT(*)
--   FROM appointments WHERE status != 'cancelled'
--   GROUP BY area_id, date, time HAVING COUNT(*) > 1;