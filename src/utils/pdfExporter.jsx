// Genera PDFs para el panel admin de Pre-Inscripcion Comercial.
// - exportListadoPDF: tabla resumen de todas las solicitudes filtradas
// - exportSolicitudPDF: ficha individual completa con todos los datos y archivos adjuntos
//
// Usa jsPDF + jspdf-autotable.
// Formato: A4, margenes 15mm, header institucional, footer con numero de pagina.

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const COLOR_PRIMARY = [14, 165, 233]   // sky-500
const COLOR_DARK = [15, 23, 42]        // slate-900
const COLOR_GRAY = [100, 116, 139]     // slate-500
const COLOR_LIGHT = [241, 245, 249]    // slate-100

// ─── Helpers internos ───────────────────────────────────────────────
function addHeader(doc, title, subtitle) {
    const pageWidth = doc.internal.pageSize.getWidth()

    // Barra superior azul
    doc.setFillColor(...COLOR_PRIMARY)
    doc.rect(0, 0, pageWidth, 22, 'F')

    // Texto blanco en la barra
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Municipalidad de la Ciudad de Eldorado', 15, 11)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Direccion de Habilitaciones Comerciales', 15, 17)

    // Subtitulo (zona del documento)
    doc.setTextColor(...COLOR_DARK)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(title, 15, 32)

    if (subtitle) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(...COLOR_GRAY)
        doc.text(subtitle, 15, 38)
    }

    // Linea separadora
    doc.setDrawColor(...COLOR_PRIMARY)
    doc.setLineWidth(0.5)
    doc.line(15, 42, pageWidth - 15, 42)
}

function addFooter(doc, extra = '') {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const page = doc.internal.getNumberOfPages()

    for (let i = 1; i <= page; i++) {
        doc.setPage(i)

        // Linea separadora
        doc.setDrawColor(...COLOR_LIGHT)
        doc.setLineWidth(0.3)
        doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15)

        // Pie de pagina
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLOR_GRAY)
        const fecha = new Date().toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
        doc.text(`Generado: ${fecha}`, 15, pageHeight - 10)
        if (extra) {
            doc.text(extra, pageWidth / 2, pageHeight - 10, { align: 'center' })
        }
        doc.text(`Pag. ${i} de ${page}`, pageWidth - 15, pageHeight - 10, { align: 'right' })
    }
}

function nombreSolicitante(item) {
    if (item.tipo_persona === 'juridica') {
        return item.razon_social || item.apellido || '(sin razon social)'
    }
    return `${item.nombre || ''} ${item.apellido || ''}`.trim() || '(sin nombre)'
}

function fmtFecha(iso) {
    if (!iso) return '-'
    try {
        return new Date(iso).toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    } catch {
        return iso
    }
}

function fmtTipoPersona(t) {
    if (t === 'fisica') return 'Fisica'
    if (t === 'juridica') return 'Juridica'
    return t || '-'
}

// ─── 1. Listado general de pre-inscripciones ────────────────────────
export function exportListadoPDF(solicitudes, filtros = {}) {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    const total = solicitudes.length
    const filtrosStr = []
    if (filtros.status && filtros.status !== 'todos') filtrosStr.push(`Estado: ${filtros.status}`)
    if (filtros.search) filtrosStr.push(`Busqueda: "${filtros.search}"`)
    if (filtros.dateFrom) filtrosStr.push(`Desde: ${filtros.dateFrom}`)
    if (filtros.dateTo) filtrosStr.push(`Hasta: ${filtros.dateTo}`)
    const subtitle = filtrosStr.length
        ? `Listado de pre-inscripciones comerciales (${filtrosStr.join(' | ')})`
        : `Listado completo de pre-inscripciones comerciales`

    addHeader(doc, 'Listado de Pre-Inscripciones Comerciales', subtitle)

    // Tabla con autoTable
    const headers = [
        'ID', 'Fecha', 'Tipo', 'Solicitante', 'DNI / CUIT', 'Email', 'Telefono',
        'Direccion', 'Local', 'Categoria', 'Actividad', 'Estado',
    ]

    const body = solicitudes.map((s) => [
        `#${s.id}`,
        fmtFecha(s.created_at || s.fecha),
        fmtTipoPersona(s.tipo_persona),
        nombreSolicitante(s),
        s.dni || s.cuit || '-',
        s.email || '-',
        s.telefono || '-',
        s.direccion || '-',
        s.local_oficina || '-',
        s.categoria || '-',
        (s.actividad_principal || '-').substring(0, 40) + ((s.actividad_principal || '').length > 40 ? '...' : ''),
        s.status || '-',
    ])

    autoTable(doc, {
        startY: 48,
        head: [headers],
        body,
        theme: 'striped',
        headStyles: {
            fillColor: COLOR_PRIMARY,
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'center',
        },
        bodyStyles: {
            fontSize: 7,
            textColor: COLOR_DARK,
            cellPadding: 2,
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { halign: 'center', cellWidth: 12 },
            1: { cellWidth: 26 },
            2: { halign: 'center', cellWidth: 16 },
            3: { cellWidth: 36 },
            4: { cellWidth: 24 },
            5: { cellWidth: 36 },
            6: { cellWidth: 22 },
            7: { cellWidth: 38 },
            8: { cellWidth: 28 },
            9: { cellWidth: 22 },
            10: { cellWidth: 38 },
            11: { halign: 'center', cellWidth: 18 },
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
            // Header repetido en cada pagina
            if (data.pageNumber > 1) {
                addHeader(doc, 'Listado de Pre-Inscripciones Comerciales (cont.)', subtitle)
            }
        },
    })

    // Resumen al final
    const finalY = doc.lastAutoTable.finalY + 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...COLOR_DARK)
    doc.text(`Total de solicitudes: ${total}`, 15, finalY)

    addFooter(doc, 'Listado de Pre-Inscripciones')

    const filename = `preinscripciones_${new Date().toISOString().slice(0, 10)}.pdf`
    doc.save(filename)
}

// ─── 2. Ficha individual de una pre-inscripcion ──────────────────────
export function exportSolicitudPDF(solicitud) {
    if (!solicitud) return

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const s = solicitud
    const idLabel = `Solicitud #${s.id}`

    // Header
    const tipoTexto = s.tipo_persona === 'juridica' ? 'Persona Juridica' : 'Persona Fisica'
    addHeader(doc, idLabel, `Pre-Inscripcion Comercial - ${tipoTexto}`)

    // ─── Estado y notas arriba ──────────────────────────────────
    doc.setFillColor(...COLOR_LIGHT)
    doc.rect(15, 48, 180, 14, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...COLOR_DARK)
    doc.text('Estado:', 18, 54)

    doc.setFont('helvetica', 'normal')
    const statusLabel = {
        pendiente: 'PENDIENTE',
        en_revision: 'EN REVISION',
        finalizado: 'FINALIZADO',
    }[s.status] || s.status || '-'
    doc.text(statusLabel, 35, 54)

    doc.setFont('helvetica', 'bold')
    doc.text('Fecha:', 90, 54)
    doc.setFont('helvetica', 'normal')
    doc.text(fmtFecha(s.created_at || s.fecha), 105, 54)

    if (s.tipo_tramite) {
        doc.setFont('helvetica', 'bold')
        doc.text('Tramite:', 18, 59)
        doc.setFont('helvetica', 'normal')
        doc.text(s.tipo_tramite, 35, 59)
    }

    if (s.categoria) {
        doc.setFont('helvetica', 'bold')
        doc.text('Categoria:', 90, 59)
        doc.setFont('helvetica', 'normal')
        doc.text(`${s.categoria}${s.sub_categoria ? ' / ' + s.sub_categoria : ''}`, 110, 59)
    }

    // ─── Secciones de datos ─────────────────────────────────────
    let y = 72

    const addSection = (titulo, campos) => {
        if (y > 250) {
            doc.addPage()
            addHeader(doc, idLabel, `${tipoTexto} (cont.)`)
            y = 50
        }

        // Titulo de seccion
        doc.setFillColor(...COLOR_PRIMARY)
        doc.rect(15, y, 180, 7, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text(titulo, 18, y + 5)
        y += 10

        // Campos en formato label-valor
        const colWidth = 90
        const lineHeight = 6
        for (let i = 0; i < campos.length; i += 2) {
            const [label1, value1] = campos[i]
            const [label2, value2] = campos[i + 1] || [null, null]

            if (y > 265) {
                doc.addPage()
                addHeader(doc, idLabel, `${tipoTexto} (cont.)`)
                y = 50
            }

            // Columna izquierda
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(8)
            doc.setTextColor(...COLOR_GRAY)
            doc.text(label1, 18, y)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(...COLOR_DARK)
            const v1 = value1 || '-'
            doc.text(doc.splitTextToSize(v1, colWidth - 5), 18, y + 4)

            // Columna derecha
            if (label2) {
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(...COLOR_GRAY)
                doc.text(label2, 18 + colWidth, y)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(...COLOR_DARK)
                const v2 = value2 || '-'
                doc.text(doc.splitTextToSize(v2, colWidth - 5), 18 + colWidth, y + 4)
            }

            y += lineHeight + 4
        }

        y += 3
    }

    // ─── 1. Datos del solicitante ───────────────────────────────
    const camposSolicitante = []
    if (s.tipo_persona === 'juridica') {
        camposSolicitante.push(['Razon Social', s.razon_social || s.apellido || '-'])
        camposSolicitante.push(['CUIT', s.cuit || '-'])
        camposSolicitante.push(['Representante', s.nombre || '-'])
        if (s.dni) camposSolicitante.push(['DNI Representante', s.dni])
    } else {
        camposSolicitante.push(['Apellido y Nombre', `${s.apellido || ''} ${s.nombre || ''}`.trim() || '-'])
        camposSolicitante.push(['DNI', s.dni || '-'])
        if (s.cuit) camposSolicitante.push(['CUIT/CUIL', s.cuit])
    }
    camposSolicitante.push(['Domicilio Real', s.domicilio || '-'])
    camposSolicitante.push(['Email', s.email || '-'])
    camposSolicitante.push(['Telefono', s.telefono || '-'])
    addSection('1. Datos del Solicitante', camposSolicitante)

    // ─── 2. Ubicacion del local ─────────────────────────────────
    const camposUbicacion = [
        ['Direccion del Local', s.direccion || '-'],
        ['Barrio', s.barrio || '-'],
        ['Seccion / Manzana / Parcela', `${s.seccion || '-'} / ${s.manzana || '-'} / ${s.parcela || '-'}`],
        ['Local / Oficina', s.local_oficina || '-'],
        ['Propietario del Local', s.propietario_local || '-'],
        ['Sup. Cubierta (m2)', s.superficie_cubierta || '-'],
        ['Sup. Semicubierta (m2)', s.superficie_semicubierta || '-'],
        ['Sup. Total (m2)', s.superficie_total || '-'],
        ['Georeferenciacion', s.georeferenciacion || '-'],
    ]
    addSection('2. Ubicacion del Local', camposUbicacion)

    // ─── 3. Actividad comercial ─────────────────────────────────
    const camposActividad = [
        ['Actividad Principal', s.actividad_principal || '-'],
        ['Actividad Secundaria', s.actividad_secundaria || '-'],
        ['Otra Actividad', s.otra_actividad || '-'],
    ]
    addSection('3. Actividad Comercial', camposActividad)

    // ─── 4. Documentacion adjunta ────────────────────────────────
    const archivos = s.archivos || []
    if (archivos.length > 0) {
        if (y > 220) {
            doc.addPage()
            addHeader(doc, idLabel, `${tipoTexto} (cont.)`)
            y = 50
        }

        doc.setFillColor(...COLOR_PRIMARY)
        doc.rect(15, y, 180, 7, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('4. Documentacion Adjunta', 18, y + 5)
        y += 10

        autoTable(doc, {
            startY: y,
            head: [['#', 'Archivo', 'Tipo', 'Tamano']],
            body: archivos.map((a, i) => [
                i + 1,
                a.nombre || '-',
                a.tipo || '-',
                a.size ? `${Math.round(a.size / 1024)} KB` : '-',
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: COLOR_PRIMARY,
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold',
            },
            bodyStyles: {
                fontSize: 8,
                textColor: COLOR_DARK,
            },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: 15, right: 15 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: 95 },
                2: { cellWidth: 45 },
                3: { halign: 'right', cellWidth: 30 },
            },
        })
        y = doc.lastAutoTable.finalY + 8
    }

    // ─── 5. Notas internas ──────────────────────────────────────
    if (s.notas) {
        if (y > 220) {
            doc.addPage()
            addHeader(doc, idLabel, `${tipoTexto} (cont.)`)
            y = 50
        }

        doc.setFillColor(...COLOR_PRIMARY)
        doc.rect(15, y, 180, 7, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('5. Notas Internas', 18, y + 5)
        y += 10

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...COLOR_DARK)
        const lines = doc.splitTextToSize(s.notas, 175)
        doc.text(lines, 18, y)
    }

    addFooter(doc, idLabel)

    const filename = `preinscripcion_${s.id}_${(s.apellido || 'solicitud').replace(/\s+/g, '_')}.pdf`
    doc.save(filename)
}
