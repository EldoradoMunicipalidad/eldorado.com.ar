-- Turnero Escuela de Manejo - PostgreSQL schema
-- Tablas independientes para el turnero de la Escuela de Manejo (Centro de Emisión de Licencias)
-- Diferencias con planeamiento/ambiente:
--   * vehiculo_propio (bool): indica si el alumno tiene vehículo propio
--   * cantidad_clases (int 1..6): 6 clases por persona según reglamento
--   * archivo_url (text): URL al archivo subido con la documentación del alumno

CREATE TABLE IF NOT EXISTS areas_escuela_manejo (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT 'bg-rose-500',
  icon TEXT DEFAULT 'directionsCarIcon',
  active BOOLEAN DEFAULT true,
  days INTEGER[] DEFAULT '{1,2,3,4,5}',
  interval INTEGER DEFAULT 30,
  slots_per_day INTEGER DEFAULT 8,
  start_time TEXT DEFAULT '14:00',
  end_time TEXT DEFAULT '18:00'
);

CREATE TABLE IF NOT EXISTS appointments_escuela_manejo (
  id TEXT PRIMARY KEY,
  area_id TEXT NOT NULL REFERENCES areas_escuela_manejo(id) ON DELETE CASCADE,
  area_name TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT DEFAULT '',
  dni TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  direccion TEXT DEFAULT '',
  vehiculo_propio BOOLEAN DEFAULT false,
  cantidad_clases INTEGER DEFAULT 1 CHECK (cantidad_clases >= 1 AND cantidad_clases <= 6),
  archivo_url TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','attended','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS config_escuela_manejo (
  id TEXT PRIMARY KEY DEFAULT 'default',
  max_per_day INTEGER DEFAULT 1,
  turnero_paused BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS admins_escuela_manejo (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  rol TEXT DEFAULT 'admin',
  nombre TEXT DEFAULT '',
  email TEXT DEFAULT ''
);

ALTER TABLE admins_escuela_manejo ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'admin';
ALTER TABLE admins_escuela_manejo ADD COLUMN IF NOT EXISTS nombre TEXT DEFAULT '';
ALTER TABLE admins_escuela_manejo ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';

-- Seed default config
INSERT INTO config_escuela_manejo (id, max_per_day, turnero_paused)
VALUES ('default', 1, true)
ON CONFLICT (id) DO NOTHING;

-- NOTA: NO se siembra ningún admin por defecto.
-- El primer admin debe crearse manualmente (idealmente con bcrypt hash).
-- Mantener 'admin'/'admin' era un riesgo crítico de seguridad.

-- Seed área única: Autódromo km 4
INSERT INTO areas_escuela_manejo
  (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time)
VALUES
  (
    'autodromo-km4',
    'Escuela de Manejo — Autódromo km 4',
    'Práctica de manejo en el Autódromo km 4. 2 alumnos por hora, 14 a 18 hs, de lunes a viernes. 6 clases por persona.',
    'bg-rose-500',
    'directionsCarIcon',
    true,
    '{1,2,3,4,5}',
    30,
    8,
    '14:00',
    '18:00'
  )
ON CONFLICT (id) DO NOTHING;