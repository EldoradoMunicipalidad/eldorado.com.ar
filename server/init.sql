-- Turnero Planeamiento - PostgreSQL schema
-- Run this once against Neon to initialize all tables

CREATE TABLE IF NOT EXISTS areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT 'bg-sky-500',
  icon TEXT DEFAULT 'assignmentIcon',
  active BOOLEAN DEFAULT true,
  days INTEGER[] DEFAULT '{1,2,3,4,5}',
  interval INTEGER DEFAULT 40,
  slots_per_day INTEGER DEFAULT 8,
  start_time TEXT DEFAULT '07:00',
  end_time TEXT DEFAULT '13:00'
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  area_id TEXT NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  max_per_day INTEGER DEFAULT 3,
  turnero_paused BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS admins (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL
);

-- Seed default config
INSERT INTO config (id, max_per_day, turnero_paused)
VALUES ('default', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Seed default admin (password: 'admin' → hash: '1j67nz')
INSERT INTO admins (username, password_hash)
VALUES ('admin', '1j67nz')
ON CONFLICT (username) DO NOTHING;

-- Seed default areas (7 áreas de Planeamiento)
INSERT INTO areas (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time) VALUES
('mesa-entradas', 'Mesa de Entrada', 'Ingreso y egreso de trámites, consultas generales y recepción de documentación.', 'bg-sky-500', 'inboxIcon', true, '{1,2,3,4,5}', 40, 10, '07:00', '13:00'),
('topografia', 'Depto. de Topografía', 'Levantamientos topográficos, planimetría y relevantamiento territorial.', 'bg-emerald-500', 'landscapeIcon', true, '{1,2,3,4,5}', 40, 10, '07:00', '13:00'),
('planeamiento', 'Depto. de Planeamiento', 'Planificación urbana, trazado de calles y ordenamiento territorial.', 'bg-violet-500', 'mapIcon', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('control-tecnico-obras', 'Depto. de Control Técnico de Obras Part.', 'Control técnico y aprobación de planos de obras privadas.', 'bg-amber-500', 'engineeringIcon', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('inspeccion-seguridad-urbana', 'Depto. de Insp. Seguridad Urbana y de Edificación', 'Inspección de seguridad urbana y condiciones de edificación.', 'bg-rose-500', 'securityIcon', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('inspecciones-obras', 'Depto. de Inspecciones de Obras Part.', 'Inspección y fiscalización de obras particulares en ejecución.', 'bg-cyan-500', 'construction', true, '{1,2,3,4,5}', 40, 8, '07:00', '13:00'),
('legislacion-urbana', 'Depto. de Legislación Urbana', 'Asesoramiento en normativa urbana, códigos de edificación y legislación municipal.', 'bg-yellow-500', 'gavelIcon', true, '{1,2,3,4,5}', 40, 6, '07:00', '13:00')
ON CONFLICT (id) DO NOTHING;
