#!/usr/bin/env node

const assert = require('assert')
const {
  buildMessages,
  compactValue,
  formatDynamicContext,
} = require('../server/uruService.cjs')

const source = {
  title: 'Contenido público',
  description: 'Información vigente del municipio',
  password: 'no debe aparecer',
  nested: {
    token: 'no debe aparecer',
    value: 'dato permitido',
  },
  image: 'data:image/png;base64,secret',
}

const compacted = compactValue(source)
assert.strictEqual(compacted.password, undefined)
assert.strictEqual(compacted.nested.token, undefined)
assert.strictEqual(compacted.nested.value, 'dato permitido')
assert.strictEqual(compacted.image, '[recurso multimedia omitido]')

const context = formatDynamicContext(
  [{ page_id: 'home', content: source, updated_at: '2026-09-02T12:00:00.000Z' }],
  [{ codigo: 'L-001', descripcion: 'Convocatoria vigente', pdf_key: 'privado.pdf' }]
)

assert.match(context, /Contenido público/)
assert.match(context, /Convocatoria vigente/)
assert.doesNotMatch(context, /no debe aparecer|secret|privado\.pdf/)

const contextWithTurner = formatDynamicContext([], [], [{
  servicio: 'Planeamiento',
  ruta: '/gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento/turnero',
  estado: 'activo',
  limitePorDni: 3,
}])
assert.match(contextWithTurner, /ESTADO DINÁMICO DE TURNEROS/)
assert.match(contextWithTurner, /Planeamiento/)
assert.match(contextWithTurner, /activo/)

const messages = buildMessages({
  question: '¿Qué hay disponible?',
  context,
  history: [],
  page: '/gobierno-abierto/licitaciones',
})

assert.strictEqual(messages.at(-1).role, 'user')
assert.strictEqual(messages.at(-1).content, '¿Qué hay disponible?')
assert.match(messages[1].content, /Información de contexto del sitio municipal/)

process.env.MINIMAX_API_KEY = ''

Promise.resolve()
  .then(() => require('../server/uruService.cjs').askUru({ question: 'prueba' }))
  .then(() => {
    throw new Error('Se esperaba que URU rechazara la petición sin MINIMAX_API_KEY')
  })
  .catch((error) => {
    assert.strictEqual(error.code, 'MISSING_MINIMAX_API_KEY')
    console.log('✅ URU context smoke test passed')
  })
