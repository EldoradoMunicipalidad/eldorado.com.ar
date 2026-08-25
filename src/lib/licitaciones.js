// Licitaciones — API pública (lectura sin auth)
// La página /gobierno-abierto/licitaciones consume estos datos.
// En caso de falla de la API, el consumidor debe hacer fallback a
// src/data/GobiernoAbierto/licitacionesData.js (array hardcodeado legacy).

const API = '/api/licitaciones'

// ─── Get licitaciones (público) ──────────────────────────────────────
// Devuelve { items: [...] } o lanza error si la API falla.
// El consumidor decide cómo manejar el error (ej: fallback a legacy).
export async function getLicitaciones() {
  const res = await fetch(`${API}`)
  if (!res.ok) {
    throw new Error(`getLicitaciones: HTTP ${res.status}`)
  }
  return await res.json()
}