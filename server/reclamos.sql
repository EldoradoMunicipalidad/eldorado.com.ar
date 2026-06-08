-- Reclamos Ciudadanos - PostgreSQL schema
-- Run once against Neon

CREATE TABLE IF NOT EXISTS reclamos_categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  icono VARCHAR(100) DEFAULT 'AlertCircle',
  color VARCHAR(20) DEFAULT '#3b82f6',
  activa BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reclamos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  categoria VARCHAR(255) DEFAULT '',
  titulo VARCHAR(500) NOT NULL DEFAULT '',
  descripcion TEXT DEFAULT '',
  direccion TEXT DEFAULT '',
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  fotos JSONB DEFAULT '[]'::jsonb,
  email VARCHAR(255) DEFAULT '',
  telefono VARCHAR(50) DEFAULT '',
  nombre VARCHAR(255) DEFAULT '',
  estado VARCHAR(30) DEFAULT 'pendiente',
  notas_internas TEXT DEFAULT '',
  respuesta_ciudadano TEXT DEFAULT '',
  respuesta_fecha TIMESTAMP DEFAULT NULL,
  asignado_a VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed default categories
INSERT INTO reclamos_categorias (nombre, icono, color, activa, orden)
SELECT * FROM (VALUES
  ('Alumbrado Público', 'Lightbulb', '#f59e0b', true, 1),
  ('Bache o Calle', 'TriangleAlert', '#ef4444', true, 2),
  ('Residuos y Limpieza', 'Trash2', '#10b981', true, 3),
  ('Veredas', 'Footprints', '#8b5cf6', true, 4),
  ('Tránsito y Señalización', 'TrafficCone', '#3b82f6', true, 5),
  ('Arbolado', 'Trees', '#22c55e', true, 6),
  ('Ruidos Molestos', 'VolumeX', '#ec4899', true, 7),
  ('Otro', 'AlertCircle', '#6b7280', true, 8)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM reclamos_categorias LIMIT 1);
