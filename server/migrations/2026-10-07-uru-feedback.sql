-- Valoraciones de URU. No se guardan preguntas, respuestas ni identificadores de usuario.
CREATE TABLE IF NOT EXISTS uru_feedback (
  id BIGSERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL CHECK (rating IN (-1, 1)),
  topic TEXT NOT NULL CHECK (topic IN ('general', 'tramites', 'turnos', 'reclamos', 'ambiente', 'preinscripcion', 'contacto')),
  page TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_uru_feedback_created_topic
  ON uru_feedback (created_at DESC, topic);
