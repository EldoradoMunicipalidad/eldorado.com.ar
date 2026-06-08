-- Pre-inscripciones Comerciales (Habilitaciones) - PostgreSQL schema
-- Run once against Neon to create the table

CREATE TABLE IF NOT EXISTS habilitaciones (
  id SERIAL PRIMARY KEY,
  tipo_persona VARCHAR(20) DEFAULT '',
  dni VARCHAR(20) DEFAULT '',
  cuit VARCHAR(20) DEFAULT '',
  apellido VARCHAR(255) DEFAULT '',
  nombre VARCHAR(255) DEFAULT '',
  domicilio TEXT DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  telefono VARCHAR(50) DEFAULT '',
  seccion VARCHAR(50) DEFAULT '',
  manzana VARCHAR(50) DEFAULT '',
  parcela VARCHAR(50) DEFAULT '',
  direccion TEXT DEFAULT '',
  local_oficina VARCHAR(255) DEFAULT '',
  barrio VARCHAR(255) DEFAULT '',
  superficie_cubierta VARCHAR(50) DEFAULT '',
  superficie_semicubierta VARCHAR(50) DEFAULT '',
  superficie_total VARCHAR(50) DEFAULT '',
  georeferenciacion TEXT DEFAULT '',
  categoria VARCHAR(100) DEFAULT '',
  sub_categoria VARCHAR(100) DEFAULT '',
  actividad_principal TEXT DEFAULT '',
  actividad_secundaria TEXT DEFAULT '',
  otra_actividad TEXT DEFAULT '',
  archivos JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'pendiente',
  notas TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
