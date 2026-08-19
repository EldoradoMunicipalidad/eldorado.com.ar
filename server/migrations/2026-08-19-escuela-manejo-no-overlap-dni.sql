-- Escuela de Manejo: UNIQUE INDEX adicional para evitar 2+ turnos del mismo DNI el mismo día
-- Fecha: 2026-08-19
-- BLOQUE SIGUIENTE A: 2026-08-19-escuela-manejo-fixes.sql
--
-- Por qué:
--   El índice slot (area_id, date, time) protege que dos personas distintas se solapen
--   en el mismo horario. PERO no protege que el mismo alumno saque 2 turnos en el mismo
--   día (escenario del usuario: "los turnos jamas se deben sobreponer").
--
--   El backend ya validaba max_per_day en /appointments, pero el endpoint legacy
--   /appointments-json (sin auth) era un agujero — fue removido en el commit previo.
--   Ahora blindamos también a nivel DB para defensa en profundidad: este índice
--   rechaza físicamente cualquier intento de insertar un segundo turno del mismo
--   DNI en el mismo día, independientemente del código que lo intente.
--
-- Forma:
--   UNIQUE INDEX PARCIAL sobre (dni, date) WHERE status != 'cancelled'
--   (los 'cancelled' se ignoran — así un alumno puede volver a reservar en una fecha
--   si canceló el turno anterior)
--
-- Pasos:
--   1) Cancelar duplicados preexistentes (mantener el más reciente)
--   2) Crear el UNIQUE INDEX
--   3) Verificar

-- 1) Cancelar duplicados (mantener el más reciente)
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY dni, date ORDER BY created_at DESC) AS rn
  FROM appointments_escuela_manejo
  WHERE status != 'cancelled'
)
UPDATE appointments_escuela_manejo a
SET status = 'cancelled'
FROM ranked r
WHERE a.id = r.id AND r.rn > 1;

-- 2) UNIQUE INDEX parcial
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_escuela_manejo_dni_day
  ON appointments_escuela_manejo (dni, date)
  WHERE status != 'cancelled';

-- 3) Verificación
DO $$
DECLARE
  idx_count INTEGER;
  dup_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename = 'appointments_escuela_manejo'
    AND indexname = 'idx_appointments_escuela_manejo_dni_day';

  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT dni, date, COUNT(*) AS n
    FROM appointments_escuela_manejo
    WHERE status != 'cancelled'
    GROUP BY dni, date
    HAVING COUNT(*) > 1
  ) t;

  RAISE NOTICE 'idx_appointments_escuela_manejo_dni_day: %', CASE WHEN idx_count = 1 THEN 'OK' ELSE 'FALTA' END;
  RAISE NOTICE 'duplicados restantes: %', dup_count;
END
$$;
