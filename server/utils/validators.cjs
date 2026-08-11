// Validadores de datos personales para Pre-Inscripcion Comercial (CommonJS).
// Usados en el backend (Express router: habilitaciones.cjs).

const PREFIX_CUIT_VALIDOS = ['20', '23', '24', '27', '30', '33', '34']

function validarDNI(value) {
  if (value === null || value === undefined) {
    return { ok: false, error: 'DNI requerido' }
  }
  const str = String(value).trim().replace(/\./g, '').replace(/\s/g, '')
  if (str === '') {
    return { ok: false, error: 'DNI requerido' }
  }
  if (!/^\d+$/.test(str)) {
    return { ok: false, error: 'DNI solo puede tener numeros' }
  }
  if (str.length < 7 || str.length > 8) {
    return { ok: false, error: 'DNI debe tener 7 u 8 digitos' }
  }
  if (str.startsWith('0')) {
    return { ok: false, error: 'DNI no puede empezar con 0' }
  }
  if (str.startsWith('9')) {
    return { ok: false, error: 'DNI no puede empezar con 9 (DNI extranjero requiere otro campo)' }
  }
  return { ok: true, clean: str }
}

function validarCUIT(value) {
  if (value === null || value === undefined) {
    return { ok: false, error: 'CUIT requerido' }
  }
  const str = String(value).trim().replace(/-/g, '').replace(/\s/g, '').replace(/\./g, '')
  if (str === '') {
    return { ok: false, error: 'CUIT requerido' }
  }
  if (!/^\d+$/.test(str)) {
    return { ok: false, error: 'CUIT solo puede tener numeros' }
  }
  if (str.length !== 11) {
    return { ok: false, error: 'CUIT debe tener 11 digitos (con o sin guiones)' }
  }
  const prefix = str.substring(0, 2)
  if (!PREFIX_CUIT_VALIDOS.includes(prefix)) {
    return { ok: false, error: `Prefijo ${prefix} invalido (validos: ${PREFIX_CUIT_VALIDOS.join(', ')})` }
  }
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  let suma = 0
  for (let i = 0; i < 10; i++) {
    suma += parseInt(str[i]) * multiplicadores[i]
  }
  const resto = suma % 11
  let digitoEsperado = 11 - resto
  if (digitoEsperado === 11) digitoEsperado = 0
  if (digitoEsperado === 10) digitoEsperado = 9
  const digitoReal = parseInt(str[10])
  if (digitoEsperado !== digitoReal) {
    return { ok: false, error: `Digito verificador invalido (se esperaba ${digitoEsperado}, se encontro ${digitoReal})` }
  }
  return { ok: true, clean: str }
}

function validarEmail(value) {
  if (value === null || value === undefined) {
    return { ok: false, error: 'Email requerido' }
  }
  const str = String(value).trim().toLowerCase()
  if (str === '') {
    return { ok: false, error: 'Email requerido' }
  }
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(str)) {
    return { ok: false, error: 'Email invalido' }
  }
  if (str.length > 254) {
    return { ok: false, error: 'Email demasiado largo' }
  }
  return { ok: true, clean: str }
}

function validarTelefono(value) {
  if (value === null || value === undefined) {
    return { ok: false, error: 'Telefono requerido' }
  }
  const str = String(value).trim()
  if (str === '') {
    return { ok: false, error: 'Telefono requerido' }
  }
  const digits = str.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) {
    return { ok: false, error: 'Telefono debe tener entre 8 y 15 digitos' }
  }
  return { ok: true, clean: digits }
}

module.exports = {
  validarDNI,
  validarCUIT,
  validarEmail,
  validarTelefono,
}
