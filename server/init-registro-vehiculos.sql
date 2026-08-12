-- Registro de Vehículos - PostgreSQL schema
-- Tablas independientes para el registro de Colectivos y Transporte Especializado
-- de la Dirección de Tránsito y Transporte

-- ─── COLECTIVOS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehiculos_colectivos (
  id SERIAL PRIMARY KEY,
  tipo_vehiculo TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  patente TEXT NOT NULL UNIQUE,
  titular TEXT NOT NULL,
  asientos INTEGER,
  largo TEXT,
  ano_fabricacion INTEGER,
  tipo_motor TEXT,
  tipo_combustible TEXT,
  vencimiento_vtv DATE,
  numero_poliza TEXT,
  vencimiento_poliza DATE,
  fecha_registro TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRANSPORTE ESPECIALIZADO ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehiculos_especializados (
  id SERIAL PRIMARY KEY,
  apellido TEXT NOT NULL,
  dni TEXT NOT NULL,
  dominio TEXT NOT NULL UNIQUE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  observaciones TEXT,
  licencia TEXT NOT NULL,
  resolucion TEXT NOT NULL,
  fecha_resolucion DATE NOT NULL,
  tipo_servicio TEXT NOT NULL,
  parada TEXT,
  fecha_vto_vtv DATE,
  fecha_vto_seguro DATE,
  numero_poliza TEXT,
  fecha_habilitacion DATE,
  empresa TEXT NOT NULL,
  propietario TEXT NOT NULL,
  direccion TEXT NOT NULL,
  movil TEXT,
  telefono TEXT,
  fecha_registro TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ADMINS DEL MÓDULO ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins_registro_vehiculos (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  rol TEXT DEFAULT 'admin',
  nombre TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTA: NO se siembra ningún admin por defecto.
-- El primer admin debe crearse manualmente (idealmente con bcrypt hash).
-- Mantener 'Usuario1'/'unoUsuario' era un riesgo crítico de seguridad.

-- ─── CONFIG GENERAL ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS config_registro_vehiculos (
  id TEXT PRIMARY KEY DEFAULT 'default',
  modulo_pausado BOOLEAN DEFAULT false,
  permitir_publico BOOLEAN DEFAULT true,
  notas TEXT DEFAULT ''
);

INSERT INTO config_registro_vehiculos (id, modulo_pausado, permitir_publico)
VALUES ('default', false, true)
ON CONFLICT (id) DO NOTHING;
