#!/usr/bin/env node

/*
 * Audita la cobertura de rutas públicas documentadas por URU.
 * No modifica archivos y puede ejecutarse localmente o en CI:
 *   npm run uru:audit
 *   node scripts/audit-uru-coverage.cjs --strict
 */

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const appSource = read('src/App.jsx')
const knowledgeSource = read('src/data/uruKnowledge.js')

const appRoutes = [...appSource.matchAll(/<Route\s+path\s*=\s*["']([^"']+)["']/g)]
  .map((match) => match[1])

const publicRoutes = [...new Set(appRoutes)]
  .filter((route) => route.startsWith('/'))
  .filter((route) => !route.startsWith('/admin'))
  .filter((route) => !route.startsWith('/xcsda'))
  .filter((route) => !route.includes('/admin'))
  .filter((route) => !route.endsWith('/setup'))
  .filter((route) => !route.includes(':'))
  .filter((route) => route !== '*')
  .sort()

const knownRoutes = [...knowledgeSource.matchAll(/^\s*-\s+(\/(?:[^\s:]+)?)/gm)]
  .map((match) => match[1])

const missing = publicRoutes.filter((route) => !knownRoutes.includes(route))
const stale = [...new Set(knownRoutes)].filter((route) => !publicRoutes.includes(route))

console.log('Rutas públicas declaradas: ' + publicRoutes.length)
console.log('Rutas mencionadas por URU: ' + new Set(knownRoutes).size)
console.log('Rutas públicas no documentadas: ' + missing.length)

if (missing.length) {
  console.log('\nFaltantes:')
  missing.forEach((route) => console.log('- ' + route))
}

if (stale.length) {
  console.log('\nRutas documentadas por URU que no coinciden con App.jsx:')
  stale.forEach((route) => console.log('- ' + route))
}

if (process.argv.includes('--strict') && (missing.length || stale.length)) {
  process.exitCode = 1
}
