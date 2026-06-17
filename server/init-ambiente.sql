-- Turnero Ambiente - PostgreSQL schema
-- Tablas independientes para la Secretaría de Ambiente / Dirección de Ambiente

CREATE TABLE IF NOT EXISTS areas_ambiente (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT 'bg-emerald-500',
  icon TEXT DEFAULT 'naturePeopleIcon',
  active BOOLEAN DEFAULT true,
  days INTEGER[] DEFAULT '{1,2,3,4,5}',
  interval INTEGER DEFAULT 40,
  slots_per_day INTEGER DEFAULT 8,
  start_time TEXT DEFAULT '07:00',
  end_time TEXT DEFAULT '13:00'
);

CREATE TABLE IF NOT EXISTS appointments_ambiente (
  id TEXT PRIMARY KEY,
  area_id TEXT NOT NULL REFERENCES areas_ambiente(id) ON DELETE CASCADE,
  area_name TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  direccion TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','attended','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS config_ambiente (
  id TEXT PRIMARY KEY DEFAULT 'default',
  max_per_day INTEGER DEFAULT 3,
  turnero_paused BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS admins_ambiente (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  rol TEXT DEFAULT 'admin',
  nombre TEXT DEFAULT '',
  email TEXT DEFAULT ''
);

ALTER TABLE admins_ambiente ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'admin';
ALTER TABLE admins_ambiente ADD COLUMN IF NOT EXISTS nombre TEXT DEFAULT '';
ALTER TABLE admins_ambiente ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';

-- Seed default config
INSERT INTO config_ambiente (id, max_per_day, turnero_paused)
VALUES ('default', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Seed admin (user: admin / password: ambiente2025 → hash: simpleHash('ambiente2025'))
INSERT INTO admins_ambiente (username, password_hash)
VALUES ('admin', 'alwd3i')
ON CONFLICT (username) DO NOTHING;

-- Seed default areas de Ambiente
INSERT INTO areas_ambiente (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time) VALUES
('guardia-ambiental', 'Guardia Ambiental', 'Atención de denuncias ambientales, control de ruidos, quema ilegal y residuos peligrosos.', 'bg-emerald-500', 'naturePeopleIcon', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('arbolado', 'Área de Arbolado Urbano', 'Podas, extracciones, forestación y planificación del arbolado público.', 'bg-green-500', 'parkIcon', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('educacion-ambiental', 'Educación Ambiental', 'Programas educativos, talleres y campañas de concientización ambiental.', 'bg-teal-500', 'schoolIcon', true, '{1,2,3,4,5}', 40, 6, '07:00', '13:00'),
('residuos', 'Gestión de Residuos', 'Recolección diferenciada, puntos verdes, compostaje y disposición final.', 'bg-amber-500', 'deleteSweepIcon', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('higiene-urbana', 'Higiene Urbana', 'Control de microbasurales, limpieza de espacios públicos y desmalezado.', 'bg-lime-500', 'cleaningIcon', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('fauna-urbana', 'Fauna Urbana', 'Control de plagas, rescate de fauna silvestre y tenencia responsable.', 'bg-orange-500', 'petsIcon', true, '{1,2,3,4,5}', 40, 6, '07:00', '13:00')
ON CONFLICT (id) DO NOTHING;
