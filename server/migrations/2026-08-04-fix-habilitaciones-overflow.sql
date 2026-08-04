-- Pre-inscripciones Comerciales (Habilitaciones) - PostgreSQL schema
-- Run once against Neon to create the table
-- v2 (2026-08-04): enlarged text fields to fix 500 errors on long emails, names, addresses
-- Reason: original schema used VARCHAR(255) for email/address fields. Real users
-- submitting forms with emails >255 chars or long DNIs/CUITs caused Postgres
-- "value too long for type character varying" → 500 Internal Server Error.

CREATE TABLE IF NOT EXISTS habilitaciones (
  id SERIAL PRIMARY KEY,
  tipo_persona VARCHAR(50) DEFAULT '',
  dni VARCHAR(50) DEFAULT '',
  cuit VARCHAR(50) DEFAULT '',
  apellido TEXT DEFAULT '',
  nombre TEXT DEFAULT '',
  domicilio TEXT DEFAULT '',
  email TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  seccion VARCHAR(50) DEFAULT '',
  manzana VARCHAR(50) DEFAULT '',
  parcela VARCHAR(50) DEFAULT '',
  direccion TEXT DEFAULT '',
  local_oficina TEXT DEFAULT '',
  barrio TEXT DEFAULT '',
  superficie_cubierta VARCHAR(100) DEFAULT '',
  superficie_semicubierta VARCHAR(100) DEFAULT '',
  superficie_total VARCHAR(100) DEFAULT '',
  georeferenciacion TEXT DEFAULT '',
  categoria TEXT DEFAULT '',
  sub_categoria TEXT DEFAULT '',
  actividad_principal TEXT DEFAULT '',
  actividad_secundaria TEXT DEFAULT '',
  otra_actividad TEXT DEFAULT '',
  archivos JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'pendiente',
  notas TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);