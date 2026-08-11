// Validadores de datos personales para Pre-Inscripcion Comercial.
// Usados en frontend (form publico + admin) y backend (POST /api/habilitaciones).
// Reglas:
// - DNI: 7-8 digitos, no empieza con 0 ni 9
// - CUIT: 11 digitos con prefijo valido (20, 23, 24, 27, 30, 33, 34) y digito verificador modulo 11
// - Email: regex basica
// - Telefono: 8-15 digitos (con o sin + Codigo Pais)

const PREFIX_CUIT_VALIDOS = ['20', '23', '24', '27', '30', '33', '34']

// ─── DNI ────────────────────────────────────────────────────────────
// Persona fisica: 7 u 8 digitos. No empieza con 0 (no valido) ni 9 (DNI extranjero).
// Acepta DNI con o sin puntos. Si viene con puntos, los removemos.
export function validarDNI(value) {
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

// ─── CUIT ───────────────────────────────────────────────────────────
// Acepta 11 digitos con o sin guiones (formato 20-12345678-5).
// Valida prefijo y digito verificador con el algoritmo modulo 11 que usa AFIP/ARCA.
export function validarCUIT(value) {
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
    // Algoritmo modulo 11 AFIP
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    let suma = 0
    for (let i = 0; i < 10; i++) {
        suma += parseInt(str[i]) * multiplicadores[i]
    }
    const resto = suma % 11
    let digitoEsperado = 11 - resto
    if (digitoEsperado === 11) digitoEsperado = 0
    if (digitoEsperado === 10) digitoEsperado = 9  // caso especial
    const digitoReal = parseInt(str[10])
    if (digitoEsperado !== digitoReal) {
        return { ok: false, error: `Digito verificador invalido (se esperaba ${digitoEsperado}, se encontro ${digitoReal})` }
    }
    return { ok: true, clean: str }
}

// ─── Email ──────────────────────────────────────────────────────────
export function validarEmail(value) {
    if (value === null || value === undefined) {
        return { ok: false, error: 'Email requerido' }
    }
    const str = String(value).trim().toLowerCase()
    if (str === '') {
        return { ok: false, error: 'Email requerido' }
    }
    // Regex basica: usuario@dominio.tld
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(str)) {
        return { ok: false, error: 'Email invalido' }
    }
    if (str.length > 254) {
        return { ok: false, error: 'Email demasiado largo' }
    }
    return { ok: true, clean: str }
}

// ─── Telefono ───────────────────────────────────────────────────────
// Acepta 8-15 digitos (E.164). Acepta +, (), -, espacios.
export function validarTelefono(value) {
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
