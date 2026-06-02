export const SECRETARIA_GOBIERNO = [
    {
        categoryTitle: "Depatamentos",
        id: "departamentos",
        cards: [
            {
                title: "Dirección de Tránsito y Transporte",
                description: "Regula y gestiona el tránsito y el transporte urbano",
                icon: "dirTransito",
                to: "/gobierno/secretaria-gobierno/transito-y-transporte",
                mision: "",
                funciones: [
                    {
                        icono: "mapIcon",
                        titulo: "Ordenamiento del Tránsito",
                        descripcion: "Optimizar la circulación, sentidos de calles y estacionamientos para garantizar un movimiento urbano fluido y seguro."
                    },
                    {
                        icono: "verifiedUserIcon",
                        titulo: "Control y Fiscalización",
                        descripcion: "Controlar el estricto cumplimiento de las normas de tránsito y asegurar la efectiva sanción de las infracciones en la vía pública."
                    },
                    {
                        icono: "directionsBusIcon",
                        titulo: "Regulación del Transporte",
                        descripcion: "Verificar reglamentaciones, recorridos y horarios del transporte público urbano y escolar, proponiendo mejoras operativas."
                    },
                    {
                        icono: "domainIcon",
                        titulo: "Gestión de Terminal de Ómnibus",
                        descripcion: "Planificar, ordenar y controlar el funcionamiento integral y todos los aspectos operativos de la Estación Terminal."
                    },
                    {
                        icono: "menuBookIcon",
                        titulo: "Educación Vial",
                        descripcion: "Desarrollar e implementar cursos de educación vial destinados a concientizar y mejorar la seguridad de los ciudadanos."
                    },
                    {
                        icono: "checkBoxIcon",
                        titulo: "Evaluación de Conductores",
                        descripcion: "Realizar las evaluaciones teóricas y prácticas necesarias para comprobar la capacidad de quienes solicitan la licencia de conducir."
                    },
                    {
                        icono: "assignmentIcon",
                        titulo: "Planificación Estratégica",
                        descripcion: "Coordinar y elaborar planes de acción a mediano y largo plazo que permitan optimizar el cumplimiento de la misión del sector."
                    }
                ],
                subcards: [{
                    title: "Centro de emisión de Licencias",
                    description: "Gestión de los recursos financieros de manera eficiente",
                    icon: "badgeIcon",
                    to: "/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias",
                    innerCards: [
                        {
                            title: "Turno Charla en Centro Emisión de Licencia",
                            description: "Solicita un turno para la charla informativa en el Centro de Emisión de Licencias.",
                            icon: "turnosZoonosisIcon",
                            to: "",
                        },
                        {
                            title: "Obtención Boleta CENAT",
                            description: "Información para obtener la boleta del Certificado Nacional de Antecedentes de Tránsito.",
                            icon: "descriptionIcon",
                            to: "",
                        },
                        {
                            title: "Licencia de conducir Principiantes (Menores de 17 años)",
                            description: "Trámite para obtener por primera vez la licencia de conducir para personas de 17 años.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Original y fotocopia del D.N.I.",
                                    "Inscribirse en el examen práctico.",
                                    "Certificado de Antecedentes Nacionales de Tránsito. Hacé Clic!",
                                    "Comprobante de pago del Certificado de Antecedentes Nacionales de Tránsito.",
                                    "Autorización del/los progenitores, firmada ante escribano o Juez de Paz."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "El trámite se realiza cuando se tramita la licencia de conducir por primera vez.",
                                    "Lo pueden realizar personas con 17 años de edad.",
                                    "Deberá contar con la autorización de uno o ambos progenitores y/o tutores legales, firmada ante escribano o autoridad policial.",
                                    "El trámite es estrictamente personal, no se admiten terceros.",
                                    "Si extravió su DNI presente constancia de DNI en trámite, denuncia de extravío y recibo de servicio a su nombre.",
                                    "El certificado de Antecedentes Nacionales de Tránsito se abona en PAGO FÁCIL o RAPIPAGO.",
                                    "La modalidad online está disponible para menores de edad (17 años)."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Curso teórico online o presencial.",
                                    "El curso se realiza por la plataforma Zoom.",
                                    "Una vez hecho el curso y aprobado el examen teórico, deberá aprobar el examen práctico para continuar con el trámite.",
                                    "El certificado médico tiene una validez de 30 días corridos.",
                                    "Presentarse con la siguiente documentación: Certificado de Antecedentes Nacionales de Tránsito (https://boletadepago.seguridadvial.gob.ar), Certificado de Salud (FUT), Examen Psicofísico, Autorización del/los progenitores firmada ante escribano o Juez de Paz, Constancia de CUIL (sólo en caso de que su D.N.I. no tenga el N° de CUIL), comprobante de pago emitido con su Nº de D.N.I. y certificado de antecedentes de tránsito ajustado por el Registro Nacional de Antecedentes de Tránsito."
                                ]
                            },
                            parrafo3: "Dirigido a:\nPersonas con 17 años de edad.\n\nTiempo estimado: 1 mes.",
                            to: "",
                        },
                        {
                            title: "Licencia de conducir Principiantes (Mayores de 18 años)",
                            description: "Permite la obtención de la licencia de conducir por primera vez.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Original y fotocopia del D.N.I.",
                                    "Inscribirse en el examen práctico.",
                                    "Certificado de Antecedentes Nacionales de Tránsito. Hacé Clic!",
                                    "Comprobante de pago del Certificado de Antecedentes Nacionales de Tránsito.",
                                    "Certificado de Salud (FUT).",
                                    "Examen Psicofísico, otorgado por médicos habilitados."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "El trámite se realiza cuando se tramita la licencia de conducir por primera vez.",
                                    "Lo pueden realizar personas mayores de 18 años de edad.",
                                    "Deberá tener domicilio actualizado en Eldorado (asentado en el D.N.I.).",
                                    "El trámite es estrictamente personal, no se admiten terceros.",
                                    "Si extravió su DNI presente constancia de DNI en trámite.",
                                    "Si ud. tuviera algún problema para realizar el curso virtual (problemas de acceso, imposibilidad de imprimir certificado, etc.) comuníquese con el Aula Virtual de la A.N.S.V. al teléfono 011-52952400 - interno 1100.",
                                    "Si durante el período de vigencia de su Licencia de Conducir realiza cambio de domicilio o cualquier otro cambio en su Documento Nacional de Identidad, ud. tiene 90 días para realizar el trámite de renovación de la Licencia de Conducir antes que ésta caduque."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Realizar curso teórico online o presencial (miércoles o jueves). Sacar turno previamente.",
                                    "Una vez aprobado el examen teórico, realizar el examen práctico.",
                                    "Deberá aprobar el examen práctico para continuar con el trámite.",
                                    "Acérquese con un certificado de grupo y factor sanguíneo.",
                                    "El certificado médico tiene una validez de 30 días corridos.",
                                    "Presentarse con la siguiente documentación: Certificado de Antecedentes Nacionales de Tránsito (https://boletadepago.seguridadvial.gob.ar), Certificado de Salud (FUT) y comprobante de pago emitido con su Nº de D.N.I."
                                ]
                            },
                            to: "",
                        },
                        {
                            title: "Ampliación de categoría Licencia de conducir Profesional",
                            description: "Requisitos y pasos para la ampliación de categoría de licencia de conducir profesional.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Original y fotocopia del D.N.I.",
                                    "Licencia actual a renovar.",
                                    "Certificado aptitud médica realizados por médicos habilitados por ANSV.",
                                    "Certificado de Antecedentes Nacionales de Tránsito. Clic acá.",
                                    "Comprobante de pago del Certificado de Antecedentes Nacionales de Tránsito.",
                                    "Si extravió la licencia: denuncia de extravío ante autoridad policial.",
                                    "Si su licencia es de otra ciudad o país y no ha sido emitida por la ANSV: Certificado de Legalidad.",
                                    "Si es categoría D: Certificado U.E.R. (http://www.dnrec.jus.gov.ar) (D1, D2, D3, D4)."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "A partir de la fecha de vencimiento de su licencia, ud. se encuentra inhabilitado para conducir.",
                                    "El trámite es estrictamente personal, no se admiten terceros.",
                                    "Deberá tener licencia de conducir profesional.",
                                    "Deberá tener domicilio actualizado.",
                                    "Si extravió su DNI presente constancia de DNI en trámite, denuncia de extravío y recibo de servicio a su nombre.",
                                    "El certificado de Antecedentes Nacionales de Tránsito se abona en PAGO FÁCIL o RAPIPAGO.",
                                    "Ante cualquier modificación realizada en el Documento Nacional de Identidad, ud. tiene 90 días para realizar el trámite de renovación de la Licencia de Conducir antes que ésta caduque.",
                                    "Realizar charla online o presencial."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Acuda al turno en la Dirección de Tránsito con la siguiente documentación: Original y fotocopia del D.N.I., licencia actual a renovar (si debe rendir examen teórico presente fotocopia), licencia a renovar o denuncia de extravío, comprobante de pago CENAT (https://boletacenat.safit.com.ar/), sólo categoría D certificado U.E.R., examen psicofísico y examen psicológico.",
                                    "Ud. debe rendir examen teórico-práctico cuando: a partir de los 65 años de edad; si pasaron 90 días desde el vencimiento de su licencia; si pasaron 90 días desde su cambio de domicilio o cualquier otro cambio en su Documento Nacional de Identidad; si su licencia es de otro país (consultar en la Dir. de Tránsito); si su licencia es de otra ciudad o país y no ha sido emitida por la ANSV deberá presentar certificado de legalidad; si quiere renovar a categoría D con licencia de otra jurisdicción nacional."
                                ]
                            },
                            parrafo3: "Puede realizar el trámite de lunes a viernes de 07:00 hs a 18:00 hs y los sábados de 07:00 hs a 11:30 hs (atención al contribuyente).\nPara entrega de licencias: de 07:00 hs a 11:30 hs y de 13:00 hs a 16:30 hs.",
                            to: "",
                        },
                        {
                            title: "Renovación de Licencia de conducir Profesional Categoría D de otra jurisdicción",
                            description: "Trámite para renovación de licencia de conducir profesional categoría D de otra jurisdicción.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "LNC con actualización de datos dentro de los 90 días.",
                                    "Licencia Provincial (REPAT): revalidar exámenes y curso teórico-práctico.",
                                    "Examen médico.",
                                    "Examen psicofísico.",
                                    "Certificado de antecedentes.",
                                    "Original y fotocopia del D.N.I.",
                                    "Original y fotocopia de su licencia actual."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "Pueden realizar el trámite personas mayores de 21 años y menores de 65 años, con mínimo un (1) año de antigüedad en la categoría B1.",
                                    "Los mayores de 65 años no podrán obtener la licencia profesional por primera vez (Ley Nacional N° 24449 Art. 20)."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Realizar curso teórico.",
                                    "Una vez hecho el curso y aprobado el examen teórico, realizar el examen práctico.",
                                    "Deberá aprobar el examen práctico para continuar con el trámite.",
                                    "El certificado médico tiene una validez de 30 días corridos.",
                                    "Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                                    "Certificado de antecedentes de tránsito: ajustado por el Registro Nacional de Antecedentes de Tránsito."
                                ]
                            },
                            parrafo3: "Dirigido a:\nPersonas con 17 años de edad.\n\nTiempo estimado: 1 mes.\n\nPresentarse con la siguiente documentación:\n- Certificado de Antecedentes Nacionales de Tránsito (https://boletadepago.seguridadvial.gob.ar).\n- Certificado de Salud (FUT).\n- Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                            to: "",
                        },
                        {
                            title: "Renovación Licencia de Conducir",
                            description: "Requisitos y pasos para renovar la licencia de conducir.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Original y fotocopia del D.N.I.",
                                    "Licencia actual a renovar.",
                                    "Certificado aptitud médica realizados por médicos habilitados por ANSV.",
                                    "Certificado de Antecedentes Nacionales de Tránsito. Clic acá.",
                                    "Comprobante de pago del Certificado de Antecedentes Nacionales de Tránsito.",
                                    "Si extravió la licencia: denuncia de extravío ante autoridad policial.",
                                    "Si su licencia es de otra ciudad o país y no ha sido emitida por la ANSV: Certificado de Legalidad.",
                                    "Si es categoría D: Certificado U.E.R. (http://www.dnrec.jus.gov.ar) (D1, D2, D3, D4)."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "A partir de la fecha de vencimiento de su licencia, ud. se encuentra inhabilitado para conducir.",
                                    "El trámite es estrictamente personal, no se admiten terceros.",
                                    "Deberá tener licencia de conducir profesional.",
                                    "Deberá tener domicilio actualizado.",
                                    "Si extravió su DNI presente constancia de DNI en trámite, denuncia de extravío y recibo de servicio a su nombre.",
                                    "El certificado de Antecedentes Nacionales de Tránsito se abona en PAGO FÁCIL o RAPIPAGO.",
                                    "Ante cualquier modificación realizada en el Documento Nacional de Identidad, ud. tiene 90 días para realizar el trámite de renovación de la Licencia de Conducir antes que ésta caduque.",
                                    "Realizar charla online presencial."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Acuda al turno en la Dirección de Tránsito con la siguiente documentación: Original y fotocopia del D.N.I., licencia actual a renovar (si debe rendir examen teórico presente fotocopia), licencia a renovar o denuncia de extravío, comprobante de pago CENAT (https://boletacenat.safit.com.ar/), sólo categoría D certificado U.E.R., examen psicofísico y examen psicológico.",
                                    "Ud. debe rendir examen teórico-práctico cuando: a partir de los 65 años de edad; si pasaron 90 días desde el vencimiento de su licencia; si pasaron 90 días desde su cambio de domicilio o cualquier otro cambio en su Documento Nacional de Identidad; si su licencia es de otro país (consultar en la Dir. de Tránsito); si su licencia es de otra ciudad o país y no ha sido emitida por la ANSV deberá presentar certificado de legalidad; si quiere renovar a categoría D con licencia de otra jurisdicción nacional."
                                ]
                            },
                            parrafo3: "Puede realizar el trámite de lunes a viernes de 07:00 hs a 18:00 hs y los sábados de 07:00 hs a 11:30 hs (atención al contribuyente).\nPara entrega de licencias: de 07:00 hs a 11:30 hs y de 13:00 hs a 16:30 hs.",
                            to: "",
                        },
                        {
                            title: "Ampliación de categoría - Licencia de conducir Particular - Autos y Motos",
                            description: "Requisitos y pasos para ampliar la categoría de licencias particulares de autos y motos.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Original y fotocopia del D.N.I.",
                                    "Original y fotocopia de su licencia actual."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "El trámite lo pueden realizar personas mayores de 18 años de edad.",
                                    "Deberá tener domicilio actualizado en Eldorado (asentado en el D.N.I.).",
                                    "El trámite es estrictamente personal, no se admiten terceros.",
                                    "Si extravió su DNI presente constancia de DNI en trámite, denuncia de extravío y recibo de servicio a su nombre.",
                                    "Si ud. tuviera algún problema para realizar el curso virtual (problemas de acceso, imposibilidad de imprimir certificado, etc.) comuníquese con el Aula Virtual de la A.N.S.V. al teléfono 011-52952400 - Interno: 1100."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Realizar el curso teórico online ingresando en el enlace correspondiente.",
                                    "Al finalizar, imprimir el certificado del curso y los certificados de género y estrellas amarillas.",
                                    "La mayor parte del curso se realiza en su casa, en el horario que le resulte más cómodo.",
                                    "Ver los tutoriales y leer ordenanzas municipales correspondientes a la categoría: Licencia A (cuadernillo categoría A) y Licencia B2 (cuadernillo categoría B2).",
                                    "Una vez hecho el curso y aprobado el examen teórico, deberá aprobar el examen práctico para continuar con el trámite.",
                                    "El certificado médico tiene una validez de 30 días corridos."
                                ]
                            },
                            parrafo3: "Documentación complementaria:\n- Certificado de Antecedentes Nacionales de Tránsito.\n- Certificado de Salud FUT (Formulario Único de Trámites).",
                            to: "",
                        },
                    ]
                },
                {
                    title: "Transporte",
                    description: "Asegura la eficiencia y efectividad de los procesos internos",
                    icon: "transitIcon",
                    to: "/gobierno/secretaria-gobierno/transito-y-transporte/transporte",
                    innerCards: [
                        {
                            title: "Habilitación de choferes para cualquier tipo de transporte",
                            description: "Trámite para obtener la habilitación como conductor en servicios de transporte público.",
                            icon: "personAddIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "LNC con actualización de datos dentro de los 90 días.",
                                    "Licencia Provincial (REPAT): revalidar exámenes y curso teórico-práctico.",
                                    "Examen médico.",
                                    "Examen psicofísico.",
                                    "Certificado de antecedentes.",
                                    "Original y fotocopia del D.N.I.",
                                    "Original y fotocopia de su licencia actual.",
                                ],
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "Pueden realizar el trámite personas mayores de 21 años y menores de 65 años, con mínimo un (1) año de antigüedad en la categoría B1.",
                                    "Los mayores de 65 años no podrán obtener la licencia profesional por primera vez (Ley Nacional N° 24449 Art. 20).",
                                ],
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Realizar curso teórico.",
                                    "Una vez hecho el curso y aprobado el examen teórico, realizar el examen práctico.",
                                    "Deberá aprobar el examen práctico para continuar con el trámite.",
                                    "El certificado médico tiene una validez de 30 días corridos.",
                                    "Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                                    "Certificado de antecedentes de tránsito: ajustado por el Registro Nacional de Antecedentes de Tránsito.",
                                ],
                            },
                            parrafo3: "Dirigido a: Personas con 17 años de edad.\nTiempo estimado: 1 mes.\n\nPresentarse con la siguiente documentación:\n- Certificado de Antecedentes Nacionales de Tránsito (https://boletadepago.seguridadvial.gob.ar).\n- Certificado de Salud (FUT).\n- Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                            to: "",
                        },
                        {
                            title: "Baja de habilitación para cualquier tipo de transporte",
                            description: "Procedimiento para dar de baja una habilitación de transporte existente.",
                            icon: "personRemoveIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "LNC con actualización de datos dentro de los 90 días.",
                                    "Licencia Provincial (REPAT): revalidar exámenes y curso teórico-práctico.",
                                    "Examen médico.",
                                    "Examen psicofísico.",
                                    "Certificado de antecedentes.",
                                    "Original y fotocopia del D.N.I.",
                                    "Original y fotocopia de su licencia actual."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "Pueden realizar el trámite personas mayores de 21 años y menores de 65 años, con mínimo un (1) año de antigüedad en la categoría B1.",
                                    "Los mayores de 65 años no podrán obtener la licencia profesional por primera vez (Ley Nacional N° 24449 Art. 20)."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Realizar curso teórico.",
                                    "Una vez hecho el curso y aprobado el examen teórico, realizar el examen práctico.",
                                    "Deberá aprobar el examen práctico para continuar con el trámite.",
                                    "El certificado médico tiene una validez de 30 días corridos.",
                                    "Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                                    "Certificado de antecedentes de tránsito: ajustado por el Registro Nacional de Antecedentes de Tránsito."
                                ]
                            },
                            parrafo3: "Dirigido a: Personas con 17 años de edad.\nTiempo estimado: 1 mes.\n\nPresentarse con la siguiente documentación:\n- Certificado de Antecedentes Nacionales de Tránsito (https://boletadepago.seguridadvial.gob.ar).\n- Certificado de Salud (FUT).\n- Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                            to: ""
                        },
                        {
                            title: "Baja de choferes habilitados en cualquier servicio de transporte",
                            description: "Permite solicitar y obtener la habilitación de choferes para Transporte de Cargas Generales.",
                            icon: "personRemoveIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Escanear en original.",
                                    "Fotocopia del D.N.I.",
                                    "Fotocopia de la licencia con la categoría correspondiente.",
                                    "Libre deuda del Juzgado Municipal de Faltas, el mismo puede ser descargado desde la ventanilla digital.",
                                    "Fotocopia Libreta Conductor profesional actualizada (licencia de conducir, seguro de vida, certificado de salud al día). Exclusivo Taxi, Especial Ocasional, Línea Regular, Turismo Alternativo y Escolar.",
                                    "Certificado de buena conducta (exclusivo Taxi).",
                                    "Fotocopia libreta sanitaria (exclusivo Sustancias Alimenticias).",
                                    "Certificado de Reincidencia (5 días de validez). Exclusivo Taxi, Especial Ocasional, Línea Regular, Turismo Alternativo y Escolar.",
                                    "Inscripción A.F.I.P. según ART. 2, inciso F, O.M. 5314/2017 (exclusivo Taxi)."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "El trámite lo puede realizar previo a que suba un nuevo chofer al vehículo habilitado con autorización del titular o apoderado.",
                                    "Se deberán dar cumplimiento a los artículos 8 de la ordenanza municipal Nº 1293 y su modificatoria 2181."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Descargar el formulario, completando todos sus campos, y enviar por correo electrónico a la Dirección de Transporte de la Municipalidad de Eldorado, adjuntando también la documentación requerida.",
                                    "Una vez presentada la TOTALIDAD de la documentación, se dará de alta al chofer de manera automática."
                                ]
                            },
                            parrafo3: "Formularios:\n- Solicitud de Habilitación de chofer para cualquier tipo de transporte.\n- Permite solicitar y obtener la habilitación de choferes para Transporte de Cargas Generales.",
                            to: "",
                        },
                        {
                            title: "Obtención de carnet de desinfección para conductor profesional",
                            description: "El trámite es para obtener o renovar la Libreta de Conductor Profesional, documento requerido para la habilitación de choferes para transporte de pasajeros.",
                            icon: "verifiedIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Formulario de solicitud.",
                                    "Certificado de salud (completando los estudios de la orden médica), el mismo debe renovarse cada año.",
                                    "Foto del D.N.I.",
                                    "Foto de la licencia.",
                                    "Foto de seguro y recibo de pagado.",
                                    "Libre de deudas del J.M.F.",
                                    "1 foto 4x4 (deberá presentarla al momento de retirar la libreta).",
                                    "Por extravío, presentar denuncia (se realiza en la Policía).",
                                    "Por duplicado, dejar la libreta anterior en la Dirección al momento de presentarse.",
                                    "Arancel de pago de libreta (método de pago a convenir)."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "La documentación debe enviarse por correo electrónico  **A definir**",
                                    "Ante cualquier duda o consulta, comunicarse al teléfono **A definir**."
                                ]
                            },
                            Lista3: {
                                titulo: "Formularios",
                                items: [
                                    "Solicitud de Libreta de Conductor Profesional.",
                                    "Órdenes médicas Transporte."
                                ]
                            },
                            parrafo3: "Validez:\nLa Libreta de Conductor Profesional no tiene vencimiento; sin embargo, los requisitos que poseen vencimiento deben actualizarse en la Dirección de Transporte.",
                            to: "",
                        },
                        {
                            title: "Renovación de habilitación de móvil para cualquier tipo de transporte",
                            description: "Información para renovar la habilitación de vehículos de transporte.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "LNC con actualización de datos dentro de los 90 días.",
                                    "Licencia Provincial (REPAT): revalidar exámenes y curso teórico-práctico.",
                                    "Examen médico.",
                                    "Examen psicofísico.",
                                    "Certificado de antecedentes.",
                                    "Original y fotocopia del D.N.I.",
                                    "Original y fotocopia de su licencia actual."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "Pueden realizar el trámite personas mayores de 21 años y menores de 65 años, con mínimo un (1) año de antigüedad en la categoría B1.",
                                    "Los mayores de 65 años no podrán obtener la licencia profesional por primera vez (Ley Nacional N° 24449 Art. 20)."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Realizar curso teórico.",
                                    "Una vez hecho el curso y aprobado el examen teórico, realizar el examen práctico.",
                                    "Deberá aprobar el examen práctico para continuar con el trámite.",
                                    "El certificado médico tiene una validez de 30 días corridos.",
                                    "Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                                    "Certificado de antecedentes de tránsito: ajustado por el Registro Nacional de Antecedentes de Tránsito."
                                ]
                            },
                            parrafo3: "Dirigido a: Personas con 17 años de edad.\nTiempo estimado: 1 mes.\n\nPresentarse con la siguiente documentación:\n- Certificado de Antecedentes Nacionales de Tránsito (https://boletadepago.seguridadvial.gob.ar).\n- Certificado de Salud (FUT).\n- Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                            to: "",
                        },
                        {
                            title: "Solicitud de habilitación en el servicio de transporte",
                            description: "Procedimiento para solicitar una nueva habilitación en servicios de transporte.",
                            icon: "assignmentIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "LNC con actualización de datos dentro de los 90 días.",
                                    "Licencia Provincial (REPAT): revalidar exámenes y curso teórico-práctico.",
                                    "Examen médico.",
                                    "Examen psicofísico.",
                                    "Certificado de antecedentes.",
                                    "Original y fotocopia del D.N.I.",
                                    "Original y fotocopia de su licencia actual."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "Pueden realizar el trámite personas mayores de 21 años y menores de 65 años, con mínimo un (1) año de antigüedad en la categoría B1.",
                                    "Los mayores de 65 años no podrán obtener la licencia profesional por primera vez (Ley Nacional N° 24449 Art. 20)."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Realizar curso teórico.",
                                    "Una vez hecho el curso y aprobado el examen teórico, realizar el examen práctico.",
                                    "Deberá aprobar el examen práctico para continuar con el trámite.",
                                    "El certificado médico tiene una validez de 30 días corridos.",
                                    "Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                                    "Certificado de antecedentes de tránsito: ajustado por el Registro Nacional de Antecedentes de Tránsito."
                                ]
                            },
                            parrafo3: "Dirigido a: Personas con 17 años de edad.\nTiempo estimado: 1 mes.\n\nPresentarse con la siguiente documentación:\n- Certificado de Antecedentes Nacionales de Tránsito (https://boletadepago.seguridadvial.gob.ar).\n- Certificado de Salud (FUT).\n- Sólo será válido el comprobante de pago emitido con su Nº de D.N.I.",
                            to: "",
                        },
                        {
                            title: "Transferencia de Licencia de taxi para nuevo titular",
                            description: "Los trámites de transferencia de licencia de Taxi consisten en dos partes: una correspondiente al Titular Actual y otra al Nuevo Titular, quien pretende adquirir el permiso para usufructuar la Licencia. Este trámite corresponde al Nuevo Titular.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Título del automotor.",
                                    "Póliza de seguro y último recibo actualizado.",
                                    "Inscripciones D.G.I., D.G.R. e Industria y Comercio.",
                                    "Libre deuda de Rentas, tasa actividad comercial y patente.",
                                    "Libre deuda de Juzgado Municipal de Faltas.",
                                    "D.N.I. con domicilio actualizado.",
                                    "Libreta Conductor Profesional actualizada.",
                                    "Licencia de conducir.",
                                    "Certificado de buena conducta.",
                                    "Certificado de Reincidencia (5 días de validez).",
                                    "Certificado de domicilio.",
                                    "Certificación de aportes ANSES (últimos 3 años)."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "Los requisitos se presentan de forma individual por correo electrónico o de forma presencial en la Mesa de Entradas de la Dirección de Transporte.",
                                    "Quienes pretendan efectuar este trámite deberán cumplir con todos los requisitos vistos en la O.M. Nº 5314 y no tener ningún impedimento legal que no permita innovar respecto a la Licencia."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Completar el formulario y enviarlo con la documentación requerida.",
                                    "También puede obtener un turno por ventanilla digital para la Dirección de Transporte y presentar la documentación."
                                ]
                            },
                            parrafo3: "Formularios:\n- Formulario Transferencia - Taxi (nuevo titular).\n\nUna vez aprobada la transferencia mediante decreto municipal, deberá presentar la siguiente documentación para dar continuidad al trámite:\n- R.T.O. como Transporte de Taxi (a partir de los 6 meses, O.M. 5500/18).\n- Planilla de horarios (se emite en la oficina).\n- Inspección ocular y control de reloj (se emite en la oficina).\n- Pago de arancel por habilitación (30 días hábiles a partir del inicio del trámite).",
                            to: "",
                        },
                        {
                            title: "Transferencia de Licencia de taxi actual titular",
                            description: "Los trámites de transferencia de licencia de Taxi consisten en dos partes: una correspondiente al Titular Actual y otra al Nuevo Titular, quien pretende adquirir el permiso para usufructuar la Licencia. Este trámite corresponde al Titular Actual.",
                            icon: "creditCardIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Certificación de firma del concesionario ante escribano.",
                                    "Libre deuda de Rentas, tasa actividad comercial y patente.",
                                    "Libre deuda de Juzgado Municipal de Faltas.",
                                    "Libre deuda de la asociación de Taxi (en caso de ser socio).",
                                    "Libro de actas y libreta (se deberá entregar en la Dirección).",
                                    "Certificación negativa de ANSES (últimos 3 años)."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "Los requisitos se presentan de forma individual por correo electrónico o de forma presencial en la Mesa de Entradas de la Dirección de Transporte.",
                                    "Quienes pretendan efectuar este trámite deberán cumplir con todos los requisitos vistos en la O.M. Nº 5314 y no tener ningún impedimento legal que no permita innovar respecto a la Licencia."
                                ]
                            },
                            Lista3: {
                                titulo: "Pasos",
                                items: [
                                    "Completar el formulario y enviarlo con la documentación requerida.",
                                    "También puede obtener un turno por ventanilla digital para la Dirección de Transporte y presentar la documentación.",
                                    "Una vez verificada la documentación, se emitirá la factura para abonar en la Dirección General de Rentas.",
                                    "La misma puede ser abonada por la ventanilla digital."
                                ]
                            },
                            parrafo3: "Formularios:\n- Formulario Transferencia - Taxi (actual titular).",
                            to: "",
                        },
                        {
                            title: "Cambio de unidad para cualquier servicio de transporte",
                            description: "Solicita el cambio de unidad de la habilitación anual de móviles para Transporte.",
                            icon: "busIcon",
                            Lista1: {
                                titulo: "Requisitos",
                                items: [
                                    "Los requisitos específicos para cada tipo de transporte se detallan en la segunda página del formulario a completar."
                                ]
                            },
                            Lista2: {
                                titulo: "Observaciones",
                                items: [
                                    "El trámite esta dirigido a todo persona o empresa que posea un vehículo habilitado (el cual no se halla dado de baja) y que desee remplazarlo por otro.",
                                    "Debe realizarlo previo al vencimiento de la habilitación (si la habilitación ya esta vencida deberá presentarse ante la Dirección de Transporte).",
                                    "Se deberá dar cumplimiento a las ordenanzas detalladas en el formulario de solicitud de cada tipo de servicio.",
                                    "Deberá corroborar que la categoría de la licencia conducir de los choferes corresponda con el vehículo a habilitar, en función del peso del vehículo. (ver categorías).",
                                    "La primera revisión del RTO deberá realizarse al año contando a partir de la fecha de patentamiento previo a la habilitación como tal (seis meses para Gas Licuado, Taxi, Remis y Alquiler).",
                                    "En el caso de que el móvil quiera ser utilizado fuera del ejido urbano deberá contar con la habilitación de Transporte Provincial (condicionante sólo para turismo alternativo)."
                                ]
                            },
                            to: "",
                        },
                    ]
                }
                ]
            },
            {
                title: "Dirección de Comunicación e Imagen Institucional",
                description: "Encargada de la difusión institucional y comunicación pública",
                icon: "dirComunicacion",
                to: "/gobierno/secretaria-gobierno/comunicacion-e-imagen-institucional",
                mision: "Gestionar la comunicación política e imagen pública del Gobierno Municipal, mediante la difusión de acciones de sistematización de la información, con el objetivo de producir mensajes orientados a mantener la fidelidad de su comunidad, garantizar sus funciones en todas las áreas que la competen y coordinar el trabajo en equipo de los Departamentos que correspondan a la misma.",
                funciones: [
                    {
                        icono: "fingerPrintIcon",
                        titulo: "Identidad y Estrategia",
                        descripcion: "Desarrollar el manual de identidad visual, definir las políticas comunicacionales y consolidar el posicionamiento institucional del municipio."
                    },
                    {
                        icono: "newsPaperIcon",
                        titulo: "Prensa y Relación con Medios",
                        descripcion: "Gestionar el contacto directo con periodistas, redactar boletines de prensa, centralizar contrataciones y brindar información oportuna y veraz."
                    },
                    {
                        icono: "shareIcon",
                        titulo: "Difusión y Medios Digitales",
                        descripcion: "Diseñar y coordinar campañas publicitarias, garantizando la difusión de actividades a través de redes sociales y medios alternativos."
                    },
                    {
                        icono: "micIcon",
                        titulo: "Protocolo y Eventos",
                        descripcion: "Organizar el ceremonial de los actos públicos, potenciar las relaciones públicas y realizar la cobertura periodística y fotográfica oficial."
                    },
                    {
                        icono: "pieChartIcon",
                        titulo: "Monitoreo y Opinión Pública",
                        descripcion: "Realizar estudios de percepción ciudadana y monitorear el impacto de las campañas de prensa para anticipar escenarios y tomar decisiones."
                    },
                    {
                        icono: "groupsIcon",
                        titulo: "Comunicación Interna",
                        descripcion: "Colaborar en esquemas de comunicación interna para fomentar la motivación, información e integración de todos los agentes municipales."
                    }
                ]
            },
            {
                title: "Dirección de Cultura y Educación",
                description: "Promueve el acceso a la cultura y la educación comunitaria",
                icon: "dirCultura",
                to: "/gobierno/secretaria-gobierno/cultura-y-educacion",
                mision: "Promover y desarrollar en la comunidad el progreso de la cultura en todos los órdenes y afianzar sus tradiciones autenticas, mediante la administración, apoyo, coordinación, orientación y control de actividades culturales, artísticas y comunicacionales en el ámbito municipal para poner los bienes de la cultura al alcance de todos.",
                funciones: [
                    {
                        icono: "festivalIcon",
                        titulo: "Eventos y Fomento Cultural",
                        descripcion: "Promover manifestaciones artísticas y organizar espectáculos, festivales y exposiciones que faciliten la expresión y el acceso cultural a toda la comunidad."
                    },
                    {
                        icono: "schoolIcon",
                        titulo: "Enseñanza y Capacitación",
                        descripcion: "Desarrollar la enseñanza de diversas disciplinas artísticas y artesanales, y coordinar el funcionamiento de la Escuela Municipal de Capacitación."
                    },
                    {
                        icono: "museumIcon",
                        titulo: "Patrimonio Histórico y Museo",
                        descripcion: "Preservar y acrecentar el acervo histórico, artístico y cultural del municipio, conservando e impulsando las actividades del Museo Municipal."
                    },
                    {
                        icono: "groupsIcon",
                        titulo: "Cultura Barrial e Inclusión",
                        descripcion: "Impulsar actividades descentralizadas en los barrios y coordinar acciones culturales conjuntas con escuelas y áreas de niñez y juventud."
                    },
                    {
                        icono: "localLibraryIcon",
                        titulo: "Cooperación y Bibliotecas",
                        descripcion: "Estimular la creación de bibliotecas populares y establecer convenios con organismos públicos y del sector privado para fortalecer el desarrollo cultural."
                    }
                ]
            },
            {
                title: "Dirección de Desarrollo e Integración Regional",
                description: "Impulsa el crecimiento económico y la integración territorial",
                icon: "dirDesarrolloAndIntegracion",
                to: "/gobierno/secretaria-gobierno/desarrollo-e-integracion-regional",
                mision: "Asistir al Intendente Municipal en todos aquellos aspectos referidos a la Integración Regional y sus consecuencias, fomentando la cooperación entre los Municipios zonales, regionales y fronterizos, con la participación e iniciativa de los Sectores Privados, Organismos No Gubernamentales y entes oficiales.",
                funciones: [
                    {
                        icono: "handshakeIcon",
                        titulo: "Coordinación Institucional y AGEDEL",
                        descripcion: "Articular programas de desarrollo con entidades públicas y privadas, ejerciendo la representación permanente del municipio ante la Agencia para el Desarrollo Económico de Eldorado (AGEDEL)."
                    },
                    {
                        icono: "storeFrontIcon",
                        titulo: "Asistencia a PyMEs y Producción",
                        descripcion: "Promover líneas de crédito, asistencia técnica y alternativas de comercialización para impulsar la producción local en conjunto con diversos sectores."
                    },
                    {
                        icono: "publicIcon",
                        titulo: "Integración Regional y MERCOSUR",
                        descripcion: "Participar, asesorar y proponer acciones estratégicas en el marco de entidades binacionales y multinacionales, enfocándose en el MERCOSUR."
                    },
                    {
                        icono: "construction",
                        titulo: "Gestión de Obras y Proyectos",
                        descripcion: "Formular y gestionar proyectos ante programas nacionales y provinciales orientados a la construcción de obras de interés comunitario, social y económico."
                    },
                    {
                        icono: "assignmentIcon",
                        titulo: "Articulación Interna e Informes",
                        descripcion: "Reportar los avances de gestiones y proyectos a la Intendencia y demás áreas municipales para garantizar una articulación institucional eficiente."
                    }
                ]
            },
            {
                title: "Dirección de Asuntos Jurídicos",
                description: "Brinda asesoramiento legal y resguarda el marco normativo",
                icon: "dirAsuntosJuridicos",
                to: "/gobierno/secretaria-gobierno/asuntos-juridicos",
                mision: "Asesorar legalmente a la Intendencia, Secretarios, Directores y demás dependencia del Departamento Ejecutivo Municipal",
                funciones: [
                    {
                        icono: "balanceIcon",
                        titulo: "Asesoramiento Legal Integral",
                        descripcion: "Brindar asistencia y asesoramiento jurídico a la Intendencia, el Concejo Deliberante y demás dependencias en cuestiones legales y de procedimiento."
                    },
                    {
                        icono: "editDocumentIcon",
                        titulo: "Redacción Normativa y Contratos",
                        descripcion: "Asesorar y participar activamente en la redacción de actos administrativos, proyectos de ordenanzas, convenios y contratos municipales."
                    },
                    {
                        icono: "factCheckIcon",
                        titulo: "Control de Legalidad y Dictámenes",
                        descripcion: "Elaborar informes previos a las decisiones administrativas y supervisar los dictámenes emitidos por los asesores legales del área."
                    },
                    {
                        icono: "ruleIcon",
                        titulo: "Evaluación Legal de Proyectos",
                        descripcion: "Coordinar la formulación de proyectos con otras áreas del municipio, garantizando su viabilidad y evaluando sus aspectos institucionales y jurídicos."
                    }
                ]
            },
            {
                title: "Dirección de la Juventud",
                description: "Diseña políticas y programas para jóvenes de la comunidad",
                icon: "dirJuventud",
                to: "/gobierno/secretaria-gobierno/juventud",
                mision: "La Dirección de la juventud tiene como objetivo acercar herramientas para que las y los jóvenes de nuestra ciudad sean sujetos de acción y de decisión política.",
                funciones: [
                    {
                        icono: "schoolIcon",
                        titulo: "Orientación y Asesoramiento Vocacional",
                        descripcion: "Brindar información gratuita sobre carreras, cursos y capacitación laboral mediante un banco de datos accesible para toda la comunidad."
                    },
                    {
                        icono: "ligthbulbIcon",
                        titulo: "Fomento al Emprendedurismo",
                        descripcion: "Gestionar apoyo técnico y financiamiento ante entidades públicas y privadas para impulsar proyectos y microemprendimientos liderados por jóvenes."
                    },
                    {
                        icono: "groupsIcon",
                        titulo: "Políticas y Programas Juveniles",
                        descripcion: "Definir, gestionar y evaluar el Programa Municipal de Juventud en coordinación con organismos gubernamentales y ONGs para mejorar la calidad de vida."
                    },
                    {
                        icono: "accionSocialIcon",
                        titulo: "Participación Ciudadana y Derechos",
                        descripcion: "Promover la responsabilidad social, organizar debates y asesorar a los jóvenes en la defensa de sus derechos, impulsando su participación activa."
                    },
                    {
                        icono: "manageSearchIcon",
                        titulo: "Registro e Investigación",
                        descripcion: "Implementar el Registro de Organizaciones Juveniles y realizar estudios o diagnósticos sobre problemáticas de la juventud para la toma de decisiones."
                    }
                ]
            },
            {
                title: "Dirección de Deportes y Recreación",
                description: "Fomenta el deporte, la actividad física y la recreación",
                icon: "dirDeportes",
                to: "/gobierno/secretaria-gobierno/deportes-y-recreacion",
                mision: "Cultivar una comunidad más unida y saludable, garantizando que todos los vecinos de Eldorado, sin importar su edad o habilidad, tengan acceso inclusivo a actividades deportivas y recreativas que mejoren su bienestar integral.",
                funciones: [
                    {
                        icono: "trophyIcon",
                        titulo: "Eventos y Competencias",
                        descripcion: "Coordinar torneos, campeonatos y encuentros de diversas disciplinas para fomentar la participación y el espíritu deportivo en la comunidad."
                    },
                    {
                        icono: "fitnessCenterIcon",
                        titulo: "Promoción del Deporte",
                        descripcion: "Impulsar programas de actividad física inclusivos para todas las edades, garantizando que cada ciudadano tenga la oportunidad de ejercitarse."
                    },
                    {
                        icono: "parkIcon",
                        titulo: "Recreación y Esparcimiento",
                        descripcion: "Organizar actividades recreativas, caminatas y juegos comunitarios para promover el disfrute saludable y activo del tiempo libre."
                    },
                    {
                        icono: "stadiumIcon",
                        titulo: "Infraestructura Deportiva",
                        descripcion: "Gestionar la creación, mejora y mantenimiento de espacios públicos como canchas, gimnasios y parques para facilitar la práctica deportiva."
                    },
                    {
                        icono: "sportsIcon",
                        titulo: "Deporte Escolar y Barrial",
                        descripcion: "Articular acciones con instituciones educativas y comisiones vecinales para descentralizar la actividad física y llevar el deporte a todos los sectores."
                    }
                ]
            },
            {
                title: "Dirección de Protección Civil",
                description: "Coordina acciones ante emergencias y protección ciudadana",
                icon: "dirProteccionCivil",
                to: "/gobierno/secretaria-gobierno/proteccion-civil",
                mision: "Asesorar y asistir al Titular del Departamento Ejecutivo Municipal en todo lo referente a planificación, organización, dirección y control de la protección civil en su jurisdicción territorial.",
                funciones: [
                    {
                        icono: "securityIcon",
                        titulo: "Prevención y Mitigación de Riesgos",
                        descripcion: "Coordinar acciones para prevenir o disminuir los efectos de eventos adversos, naturales o antrópicos, protegiendo a la población, sus bienes y el medio ambiente."
                    },
                    {
                        icono: "handshakeIcon",
                        titulo: "Articulación Interjurisdiccional",
                        descripcion: "Establecer acuerdos y alinear políticas de protección civil con organismos de defensa civil a nivel provincial y nacional para un abordaje conjunto."
                    },
                    {
                        icono: "ambulanceIcon",
                        titulo: "Respuesta ante el Cambio Climático",
                        descripcion: "Preparar e implementar asistencia directa, rápida y efectiva orientada especialmente a proteger y socorrer a las zonas más vulnerables de la ciudad."
                    },
                    {
                        icono: "policyIcon",
                        titulo: "Planificación y Junta Municipal",
                        descripcion: "Asesorar, planificar y controlar las medidas de emergencia locales a través de la Junta Municipal de Protección Civil junto al Ejecutivo."
                    }
                ]
            },
            {
                title: "Dirección de Recursos Humanos",
                description: "Gestiona el personal y fortalece la capacitación interna",
                icon: "dirRecursosHumanos",
                to: "/gobierno/secretaria-gobierno/recursos-humanos",
                mision: "Encargada de gestionar todo lo relacionado con el personal que trabaja en la municipalidad.",
                funciones: [
                    {
                        icono: "badgeIcon",
                        titulo: "Gestión y Selección de Personal",
                        descripcion: "Seleccionar, contratar y organizar al equipo de trabajo, garantizando que cada área municipal cuente con el perfil adecuado para sus tareas."
                    },
                    {
                        icono: "paymentIcon",
                        titulo: "Administración de Sueldos",
                        descripcion: "Gestionar eficientemente el pago de salarios, aguinaldos, licencias y demás beneficios correspondientes a los agentes municipales."
                    },
                    {
                        icono: "modelTrainingIcon",
                        titulo: "Capacitación y Desarrollo",
                        descripcion: "Implementar programas de formación continua para potenciar las habilidades, conocimientos y el crecimiento profesional de los empleados."
                    },
                    {
                        icono: "forumIcon",
                        titulo: "Asesoramiento y Clima Laboral",
                        descripcion: "Brindar contención y asesoría en materia de relaciones laborales, mediando y resolviendo de manera constructiva posibles conflictos internos."
                    },
                    {
                        icono: "trendingUpIcon",
                        titulo: "Carrera Administrativa",
                        descripcion: "Llevar un registro ordenado y transparente de las evaluaciones de desempeño, ascensos y traslados para asegurar el progreso del personal."
                    }
                ],
                subcards: [{
                    title: "Recibo de Sueldo Digital",
                    description: "Gestión de los recursos financieros de manera eficiente",
                    icon: "requestQuoteIcon",
                    to: "https://www.municipalidad.com/eldo/usuarios/login?redirectMisCuentas=True",
                }, {
                    title: "Estatuto del personal municipal",
                    description: "Asegura la eficiencia y efectividad de los procesos internos",
                    icon: "workSpacePremiumIcon",
                    to: "https://drive.google.com/file/d/1fDV6T-SflYn8dGlrKflfKngEyaaFlH25/preview",
                }]
            },
            {
                title: "Dirección de Turismo",
                description: "Promociona los atractivos turísticos del municipio",
                icon: "dirTurismo",
                to: "https://turismo.eldorado.gob.ar/"
            },
            {
                title: "Polo Académico",
                description: "Centro de formación académica y desarrollo educativo local",
                icon: "poloAcademico",
                to: "/gobierno/secretaria-gobierno/polo-academico",
                subcards: [{
                    title: "Programa de Becas Municipales",
                    description: "Inscribite haciendo clic aqui",
                    icon: "editDocumentIcon",
                    to: "https://docs.google.com/forms/d/e/1FAIpQLSfDI3GI-PZpTfiRfprHP8vlAqXiqGm_udeQNCJopZKrC1e1zQ/viewform",
                },
                {
                    title: "Programa de Albergues Estudiantiles",
                    description: "Inscribite haciendo clic aqui",
                    icon: "editDocumentIcon",
                    to: "https://docs.google.com/forms/d/e/1FAIpQLSfDI3GI-PZpTfiRfprHP8vlAqXiqGm_udeQNCJopZKrC1e1zQ/viewform",
                },
                {
                    title: "Programa de Residencias Estudiantiles",
                    description: "Inscribite haciendo clic aqui",
                    icon: "editDocumentIcon",
                    to: "https://docs.google.com/forms/d/e/1FAIpQLSfDI3GI-PZpTfiRfprHP8vlAqXiqGm_udeQNCJopZKrC1e1zQ/viewform",
                },
                {
                    title: "Programa de Becas Fotocopias",
                    description: "Inscribite haciendo clic aqui",
                    icon: "editDocumentIcon",
                    to: "https://docs.google.com/forms/d/e/1FAIpQLSfDI3GI-PZpTfiRfprHP8vlAqXiqGm_udeQNCJopZKrC1e1zQ/viewform",
                },
                {
                    title: "Programa de Orientacion Vocacional",
                    description: "Inscribite haciendo clic aqui",
                    icon: "editDocumentIcon",
                    to: "https://docs.google.com/forms/d/e/1FAIpQLSeWAvP1HaTi4ElG1w4urgJGx6JPE2JFn_J6vb6j-BWVMd53IQ/viewform",
                },
                {
                    title: "Solicitud de Tarjeta Universitaria",
                    description: "Inscribite haciendo clic aqui",
                    icon: "editDocumentIcon",
                    to: "https://docs.google.com/forms/d/e/1FAIpQLSfeaPIuoQi5l1JpzO7T8CakA7U4dOd-z5uR-OYVTu9jtgeFKQ/viewform",
                },
                {
                    title: "Pagina Oficial del Polo Académico",
                    description: "Mas información haciendo clic aqui",
                    icon: "editDocumentIcon",
                    to: "https://mediumturquoise-yak-mnl9x8oxvptdbwq2.builder-preview.com/",
                }
                ]

            },
            {
                title: "Parque Industrial",
                description: "Centro de formación académica y desarrollo educativo local",
                icon: "parqueIndustrial",
                to: "/gobierno/secretaria-gobierno/parque-industrial"
            },
            {
                title: "Departamento de diseño textil, reciclado y producción de indumentaria local",
                description: "Área destinada al desarrollo productivo y empresarial",
                icon: "dirDiseñoTextil",
                to: "/gobierno/secretaria-gobierno/diseno-textil-reciclado-y-produccion-local",
                mision: "Impulsar la innovación social y empoderar a la comunidad mediante la capacitación y producción textil sustentable, transformando materiales reciclados en artículos funcionales que promueven el desarrollo económico y la inclusión.",
                funciones: [
                    {
                        icono: "recyclingIcon",
                        titulo: "Producción Textil y Reciclaje",
                        descripcion: "Planificar, gestionar y supervisar la confección de artículos textiles utilizando materiales locales y reciclados, garantizando la calidad del producto final."
                    },
                    {
                        icono: "schoolIcon",
                        titulo: "Educación y Talleres Comunitarios",
                        descripcion: "Organizar programas, charlas y talleres orientados a fomentar habilidades en reciclado, confección y reutilización de materiales en la comunidad de Eldorado."
                    },
                    {
                        icono: "groupsIcon",
                        titulo: "Inclusión y Asistencia Social",
                        descripcion: "Fomentar la inclusión socioeconómica y desarrollar productos textiles específicamente destinados a asistir a los sectores más vulnerables de la ciudad."
                    },
                    {
                        icono: "handshakeIcon",
                        titulo: "Alianzas y Trabajo Articulado",
                        descripcion: "Promover convenios colaborativos con empresas locales u organizaciones, y articular proyectos conjuntos con otras áreas del municipio."
                    },
                    {
                        icono: "inventoryIcon",
                        titulo: "Gestión de Insumos y Patrimonio",
                        descripcion: "Administrar eficientemente los equipos de trabajo e insumos para la producción, resguardando los bienes patrimoniales del área."
                    }
                ]
            }
        ]
    }];

export const SECRETARIA_HACIENDA = [
    {
        categoryTitle: "Departamentos",
        id: "departamentos",
        cards: [
            {
                title: "Dirección de Rentas Generales",
                description: "Gestión de los recursos financieros de manera eficiente",
                icon: "dirRentasGenerales",
                to: "/gobierno/secretaria-hacienda/rentas-generales",
                mision: "La misión de la Dirección de Rentas Generales del municipio de Eldorado es garantizar una administración eficiente y transparente de los recursos fiscales, promoviendo el cumplimiento de las obligaciones tributarias de los ciudadanos y contribuyendo al desarrollo sostenible de la comunidad. Esta dirección se encarga de la recaudación de impuestos, tasas y contribuciones, así como de la implementación de políticas que incentiven la regularización y el fortalecimiento de la cultura tributaria. Además, busca facilitar la información y el acceso a los servicios relacionados con la gestión fiscal, estableciendo canales de comunicación que fortalezcan la confianza pública. A través de su labor, la Dirección de Rentas Generales se posiciona como un pilar fundamental en la promoción del bienestar económico y social de Eldorado.",
                funciones: [
                    {
                        icono: "paymentIcon",
                        titulo: "Emisión y Cobro de Tasas",
                        descripcion: "Gestionar la emisión, liquidación y cobro de tasas, derechos y contribuciones municipales de acuerdo a las ordenanzas fiscales vigentes."
                    },
                    {
                        icono: "supportAgentIcon",
                        titulo: "Atención al Contribuyente",
                        descripcion: "Brindar asesoramiento integral a los vecinos y comerciantes sobre sus obligaciones tributarias, planes de pago y estado de deuda."
                    },
                    {
                        icono: "searchIcon",
                        titulo: "Fiscalización y Control",
                        descripcion: "Ejecutar inspecciones y cruces de datos para detectar evasiones, regularizar comercios y asegurar el cumplimiento de las obligaciones fiscales."
                    },
                    {
                        icono: "accountBalanceWallet",
                        titulo: "Gestión de Morosidad",
                        descripcion: "Implementar estrategias de recupero de deudas, intimaciones y planes de regularización para optimizar los ingresos del municipio."
                    }
                ]
            },
            {
                title: "Dirección de Contabilidad General",
                description: "Administra y controla las finanzas institucionales",
                icon: "dirContabilidadGeneral",
                to: "/gobierno/secretaria-hacienda/contabilidad-general",
                mision: "La misión de la Secretaría de Contabilidad General de la Municipalidad de Eldorado es garantizar la transparencia y eficiencia en la gestión financiera del municipio. A través de la recopilación, registro y análisis de datos contables, la Secretaría busca asegurar que todos los recursos públicos se utilicen de manera adecuada y conforme a la legislación vigente. Además, promueve la rendición de cuentas hacia la ciudadanía, permitiendo un acceso claro y directo a la información financiera. Con un enfoque en la mejora continua, la Secretaría también se compromete a implementar buenas prácticas contables y a capacitar al personal, contribuyendo así al desarrollo y crecimiento del municipio en beneficio de sus habitantes.",
                funciones: [
                    {
                        icono: "accountBalanceIcon",
                        titulo: "Registración y Balances",
                        descripcion: "Llevar la contabilidad centralizada del municipio, elaborando los balances y estados financieros de acuerdo a las normativas vigentes."
                    },
                    {
                        icono: "requestQuoteIcon",
                        titulo: "Ejecución Presupuestaria",
                        descripcion: "Controlar y registrar la ejecución del presupuesto anual, asegurando que los gastos e ingresos se ajusten a las partidas aprobadas."
                    },
                    {
                        icono: "paymentIcon",
                        titulo: "Órdenes de Pago",
                        descripcion: "Verificar la documentación y emitir las órdenes de pago para proveedores, sueldos y servicios, garantizando la transparencia del gasto público."
                    },
                    {
                        icono: "inventoryIcon",
                        titulo: "Control Patrimonial",
                        descripcion: "Mantener actualizado el inventario general, fiscalizando las altas, bajas y transferencias de todos los bienes muebles e inmuebles."
                    }
                ]
            },
            {
                title: "Dirección de Control y Gestión",
                description: "Asegura la eficiencia y efectidad de los procesos internos",
                icon: "dirControlAndGestion",
                to: "/gobierno/secretaria-hacienda/control-y-gestion",
                mision: "La misión de la Dirección de Control y Gestión de la Municipalidad de Eldorado es asegurar la transparencia y la eficiencia en la administración municipal, promoviendo el uso responsable de los recursos públicos. Esta dirección se encarga de supervisar y evaluar los proyectos y programas implementados, garantizando que se alineen con los objetivos estratégicos de la municipalidad. Además, trabaja en la promoción de prácticas de rendición de cuentas y participa activamente en la capacitación del personal, generando un entorno de mejora continua. Su labor es fundamental para fomentar la confianza de la ciudadanía en las instituciones locales y contribuir al desarrollo sostenible de la comunidad. Mediante un control riguroso y una gestión adecuada, la dirección busca optimizar los servicios ofrecidos, beneficiando así a todos los habitantes de Eldorado.",
                funciones: [
                    {
                        icono: "factCheckIcon",
                        titulo: "Auditoría Interna",
                        descripcion: "Realizar controles periódicos en las distintas dependencias para garantizar el cumplimiento de los procedimientos administrativos y legales."
                    },
                    {
                        icono: "searchIcon",
                        titulo: "Monitoreo de Objetivos",
                        descripcion: "Diseñar e implementar tableros de control para evaluar el avance y cumplimiento de las metas establecidas por el Ejecutivo Municipal."
                    },
                    {
                        icono: "ruleIcon",
                        titulo: "Optimización de Procesos",
                        descripcion: "Identificar cuellos de botella burocráticos y proponer mejoras continuas para agilizar los trámites y servicios al ciudadano."
                    },
                    {
                        icono: "assignmentIcon",
                        titulo: "Informes de Gestión",
                        descripcion: "Elaborar reportes periódicos sobre el desempeño de las distintas áreas, brindando información clave para la toma de decisiones."
                    }
                ]
            },
        ]
    }];

export const SECRETARIA_ACCION_SOCIAL = [
    {
        categoryTitle: "Depatamentos",
        id: "departamentos",
        cards: [
            {
                title: "Dirección de Acción Social",
                description: "Asiste y acompaña a personas en situación vulnerable",
                icon: "dirAccionSocial",
                to: "/gobierno/secretaria-accion-social/accion-social",
                mision: "Desarrollar en la comunidad las acciones, que en el campo social, educativo y de otra índole, que signifique contribuir al bienestar del habitante a nivel barrial.",
                funciones: [
                    {
                        icono: "accionSocialIcon",
                        titulo: "Asistencia y Emergencias Sociales",
                        descripcion: "Organizar tareas de asistencia comunitaria, realizar estudios socioeconómicos y programar acciones rápidas ante emergencias sociales."
                    },
                    {
                        icono: "homeWorkIcon",
                        titulo: "Centros Comunitarios",
                        descripcion: "Promover, organizar y garantizar el funcionamiento de los Centros Comunitarios en estrecha coordinación con las Comisiones Vecinales."
                    },
                    {
                        icono: "healthAndSafetyIcon",
                        titulo: "Salud y Bienestar Integral",
                        descripcion: "Canalizar las necesidades de salud pública y estimular actividades orientadas a mejorar integralmente la calidad de vida de los vecinos."
                    },
                    {
                        icono: "schoolIcon",
                        titulo: "Capacitación Barrial",
                        descripcion: "Organizar e implementar cursos de educación técnica y capacitación directamente en los barrios para promover el desarrollo local."
                    },
                    {
                        icono: "handshakeIcon",
                        titulo: "Articulación Institucional",
                        descripcion: "Coordinar acciones sistematizadas con entidades públicas y privadas para optimizar la asistencia y el apoyo a la comunidad."
                    }
                ],
                subcards: [
                    {
                        title: "Departamento de Asistencia Social, Promoción Comunitaria y Asuntos Barriales",
                        description: "Brinda apoyo y acompañamiento a las personas y familias en situacion de vulnerabilidad social, promoviendo la inclusión y la equidad y el bienestar comunitario.",
                        icon: "familyIcon",
                        to: "/gobierno/secretaria-accion-social/accion-social/dto-asistencia-social",
                        mision: "Desarrollar y promover en la comunidad actividades sociales, comunitarias y de organización barrial.",
                        funciones: [
                            {
                                icono: "schoolIcon",
                                titulo: "Gestión de Becas Estudiantiles",
                                description: "Asignar, fiscalizar y mantener el registro actualizado de becas para los distintos niveles educativos según el régimen establecido."
                            },
                            {
                                icono: "accionSocialIcon",
                                titulo: "Ayudas Individuales y Sociales",
                                description: "Administrar ayudas directas y brindar asesoramiento integral a personas que enfrentan problemas sociales que no pueden resolver por medios propios."
                            },
                            {
                                icono: "emergencyIcon",
                                titulo: "Asistencia ante Siniestros",
                                description: "Organizar la logística y entrega de elementos de primera necesidad a familias de escasos recursos afectadas por siniestros o emergencias."
                            },
                            {
                                icono: "forumIcon",
                                titulo: "Vínculo y Diálogo Directo",
                                description: "Establecer canales de comunicación entre el Ejecutivo y vecinos, programando visitas barriales para mantener un diálogo directo con la comunidad."
                            },
                            {
                                icono: "factCheckIcon",
                                titulo: "Gestión de Peticiones",
                                description: "Recibir, registrar y agilizar las tramitaciones administrativas de las entidades vecinales para dar pronta solución a sus planteamientos."
                            },
                            {
                                icono: "groupsIcon",
                                titulo: "Coordinación Vecinal",
                                description: "Coordinar y asesorar el trabajo de las Comisiones Vecinales, Asociaciones de Calles y la Federación de Entidades Vecinales."
                            }
                        ]
                    },
                    {
                        title: "Departamento de Niñez, Adolescencia y Familia",
                        description: "Proteger y promover los derechos de los niños, adolescentes y sus familias. Garantizando su desarrollo integral en un entorno seguro y saludable.",
                        icon: "babyIcon",
                        to: "/gobierno/secretaria-accion-social/accion-social/dto-ninez-y-adolescencia",
                        mision: "Planificar y ejecutar acciones integrales de prevención, promoción y asistencia destinadas a familias en situación de vulnerabilidad, fortaleciendo el tejido comunitario y garantizando la defensa de los derechos de niños, niñas, adolescentes, personas con discapacidad y adultos mayores a través de políticas alimentarias y espacios de participación que promuevan la equidad social.",
                        funciones: [
                            {
                                icono: "nutritionIcon",
                                titulo: "Seguridad Alimentaria",
                                descripcion: "Formular y ejecutar políticas que garanticen el derecho a la alimentación, monitoreando el estado nutricional de la población y capacitando en nutrición y desarrollo infantil."
                            },
                            {
                                icono: "accessibleIcon",
                                titulo: "Inclusión y Discapacidad",
                                descripcion: "Impulsar acciones para el pleno desarrollo e integración de personas con discapacidad, trabajando en red con salud, educación y organizaciones no gubernamentales."
                            },
                            {
                                icono: "babyIcon",
                                titulo: "Protección de la Niñez",
                                descripcion: "Diseñar políticas de prevención, protección e integración social que aseguren el cumplimiento de los derechos fundamentales de niños, niñas y adolescentes en la comunidad."
                            },
                            {
                                icono: "elderlyIcon",
                                titulo: "Cuidado de la Tercera Edad",
                                descripcion: "Gestionar planes de asistencia para adultos mayores en vulnerabilidad, promoviendo espacios de encuentro, talleres recreativos y el intercambio generacional de saberes."
                            },
                            {
                                icono: "familyIcon",
                                titulo: "Fortalecimiento Familiar",
                                descripcion: "Implementar programas que asistan a las familias en situación de riesgo, fomentando su protagonismo y responsabilidad en el cuidado y nutrición dentro del hogar."
                            },
                            {
                                icono: "diversity3Icon",
                                titulo: "Participación Comunitaria",
                                descripcion: "Fortalecer a las organizaciones sociales propiciando espacios de participación y co-diseñando políticas públicas de niñez y familia junto a los vecinos e instituciones."
                            }
                        ]
                    },
                    {
                        title: "CIC",
                        description: "Promover el desarrollo integral de las personas y fortalecer los lazos comunitarios mediante la implementacion de programas sociales, educativos, sanitarios y culturales.",
                        icon: "helpClinicIcon",
                        to: "/gobierno/secretaria-accion-social/accion-social/cic",
                        mision: "Los Centros de Integración Comunitaria (CIC) de Eldorado funcionan como nodos estratégicos de proximidad, cuya misión es garantizar el acceso gratuito a la salud integral, la educación no formal y la tecnología, promoviendo la integración social y el desarrollo humano mediante una oferta descentralizada y participativa que responde a las necesidades específicas de los barrios Koch, Pinares, Oleaginosa y sus zonas de influencia.",
                        funciones: [
                            {
                                icono: "medicalServicesIcon",
                                titulo: "Atención Primaria de la Salud (APS)",
                                descripcion: "Prestación de servicios médicos gratuitos en especialidades como pediatría, ginecología, odontología y nutrición, incluyendo atención de 24 hs en el CIC Oleaginosa."
                            },
                            {
                                icono: "devicesIcon",
                                titulo: "Inclusión Digital y NAC",
                                descripcion: "Acceso a tecnología de última generación en el Núcleo de Acceso al Conocimiento (NAC) y Punto Digital, con cursos de computación y capacitaciones online gratuitas."
                            },
                            {
                                icono: "construction",
                                titulo: "Talleres de Oficios y Capacitación",
                                descripcion: "Dictado de cursos con salida laboral como peluquería, costura básica, pintura sobre tela y bordado chino para el desarrollo de habilidades socioproductivas."
                            },
                            {
                                icono: "sportsMartialArtsIcon",
                                titulo: "Cultura, Deporte y Recreación",
                                descripcion: "Coordinación de espacios de formación artística y física, incluyendo danzas folklóricas, árabes y Kung Fu, fomentando el bienestar integral de los vecinos."
                            },
                            {
                                icono: "theaterIcon",
                                titulo: "Espacios de Infancia y Cine",
                                descripcion: "Funcionamiento de micro-cines infantiles y actividades lúdicas diarias diseñadas para la contención y el sano esparcimiento de los niños y niñas del barrio."
                            },
                            {
                                icono: "cityIcon",
                                titulo: "Descentralización Territorial",
                                descripcion: "Gestión administrativa y atención comunitaria distribuida en los kilómetros 1, 7½, 8 y 18, facilitando el contacto directo del vecino con los servicios municipales."
                            }
                        ]
                    },
                    {
                        title: "Guarderias",
                        description: "Brindar cuidado, contencion y acompañamiento educativo a niños y niñas en sus primeras etapas de desarrollo.",
                        icon: "toyIcon",
                        to: "/gobierno/secretaria-accion-social/accion-social/guarderias",
                    },
                    {
                        title: "Centro de Día",
                        description: "Fomentar el bienestar físico, emocional y social de los participantes, fortaleciendo los vinculos comunitarios y el sentido de pertenencia.",
                        icon: "sunnyIcon",
                        to: "/gobierno/secretaria-accion-social/accion-social/centro-de-dia",
                        mision: "Brindar un espacio de contención, educación y rehabilitación integral para personas con discapacidad de todas las edades, garantizando una atención personalizada y de calidad a través de un equipo interdisciplinario que promueve la autonomía, la integración social y la mejora en la calidad de vida de los alumnos y sus familias en la ciudad de Eldorado.",
                        funciones: [
                            {
                                icono: "psychologyIcon",
                                titulo: "Abordaje Terapéutico",
                                descripcion: "Brindar atención especializada mediante psicólogos, kinesiólogos y nutricionistas para promover el desarrollo biopsicosocial de cada concurrente."
                            },
                            {
                                icono: "schoolIcon",
                                titulo: "Educación Especial",
                                descripcion: "Implementar programas pedagógicos adaptados liderados por maestras de educación especial para potenciar las capacidades cognitivas de alumnos de todas las edades."
                            },
                            {
                                icono: "healthAndSafetyIcon",
                                titulo: "Cuidado de la Salud",
                                descripcion: "Supervisar el bienestar físico de los concurrentes mediante servicios de enfermería y promotores de salud en un entorno seguro y controlado."
                            },
                            {
                                icono: "diversity3Icon",
                                titulo: "Acompañamiento Personalizado",
                                descripcion: "Proporcionar apoyo constante a través de acompañantes terapéuticos y auxiliares de sala que facilitan la integración y las actividades diarias."
                            },
                            {
                                icono: "localShippingIcon",
                                titulo: "Servicio de Traslado",
                                descripcion: "Coordinar y ejecutar el transporte diario de los concurrentes mediante un equipo de traslado especializado, garantizando el acceso a la institución."
                            },
                            {
                                icono: "groupsIcon",
                                titulo: "Contención y Socialización",
                                descripcion: "Organizar actividades en doble turno para más de 40 personas con discapacidad, fomentando la convivencia y el sentido de pertenencia grupal."
                            }
                        ]
                    }
                ]
            },
            {
                title: "Dirección de Niñez y Adolescencia",
                description: "Promueve los derechos de niños, niñas y adolescentes",
                icon: "dirNiñezAndAdoles",
                to: "/gobierno/secretaria-accion-social/ninez-y-adolescencia",
                mision: "Desde este espacio de trabajo construimos acciones de prevención, promoción y asistencia a las familias en situación de vulnerabilidad social.",
                funciones: [
                    {
                        icono: "babyIcon",
                        titulo: "Promoción y Prevención de Derechos",
                        descripcion: "Diseñar e implementar programas de prevención, protección e integración social para garantizar el pleno goce de los derechos y oportunidades equitativas."
                    },
                    {
                        icono: "healthAndSafetyIcon",
                        titulo: "Protección y Abordaje Integral",
                        descripcion: "Conformar equipos interdisciplinarios para verificar condiciones socioambientales, asistir a menores vulnerables y dar seguimiento a casos judicializados."
                    },
                    {
                        icono: "toyIcon",
                        titulo: "Espacios de Primera Infancia (EPIS)",
                        descripcion: "Coordinar la gestión y el funcionamiento integral de los cuatro EPIS locales: San Cayetano, Puerto Pinares, Manitos Traviesas y La Lagunita de la Alegría."
                    },
                    {
                        icono: "diversity3Icon",
                        titulo: "Trabajo en Red e Institucional",
                        descripcion: "Articular acciones con áreas de salud, educación, ONGs y organismos provinciales o nacionales (como SENNAF) para fortalecer la red de contención."
                    },
                    {
                        icono: "analitycsIcon",
                        titulo: "Relevamiento y Planificación",
                        descripcion: "Realizar diagnósticos continuos sobre las necesidades de la población infanto-juvenil para ejecutar y optimizar la planificación de la Dirección."
                    }
                ]
            },
            {
                title: "Dirección de Regularización Dominial de Tierras",
                description: "Facilita el acceso legal y seguro a la propiedad de la tierra",
                icon: "dirDominialDeTierras",
                to: null
            },
            {
                title: "Dirección de Adultos Mayores",
                description: "Promueve el bienestar y la inclusión de personas mayores",
                icon: "dirAdultosMayores",
                to: "/gobierno/secretaria-accion-social/adultos-mayores",
                mision: "Proteger, asistir y acompañar a las personas mayores de Eldorado, garantizando el pleno ejercicio de sus derechos, previniendo situaciones de vulnerabilidad y promoviendo su participación activa y cuidada en la comunidad.",
                funciones: [
                    {
                        icono: "elderlyIcon",
                        titulo: "Asistencia y Acompañamiento",
                        descripcion: "Detectar, acompañar y asistir activamente a los adultos mayores que se encuentren en situación de vulnerabilidad o con una red familiar frágil."
                    },
                    {
                        icono: "healthAndSafetyIcon",
                        titulo: "Promoción y Protección de Derechos",
                        descripcion: "Generar espacios de encuentro, prevenir el maltrato y la discriminación, y facilitar el acceso a beneficios sociales y previsionales."
                    },
                    {
                        icono: "groupsIcon",
                        titulo: "Consejo Asesor y Participación",
                        descripcion: "Coordinar un espacio consultivo ciudadano para impulsar recomendaciones, proyectos y políticas públicas que mejoren la calidad de vida en la tercera edad."
                    }
                ]
            },
            {
                title: "Relaciones con la comunidad",
                description: "Fortalece el vínculo entre la comunidad y el municipio",
                icon: "relacionesComunidad",
                to: null
            },
        ]
    }];

export const SECRETARIA_OBRAS_PUBLICAS = [
    {
        categoryTitle: "Depatamentos",
        id: "departamentos",
        cards: [
            {
                title: "Dirección de Obras Públicas",
                description: "Planifica y ejecuta proyectos de infraestructura urbana.",
                icon: "dirObrasPublicas",
                to: "/gobierno/secretaria-obras-publicas/obras-publicas",
                mision: "Asistir al Secretario de Obras y Servicios Públicos y al Departamento Ejecutivo en la conducción de todos los aspectos que hacen al desarrollo y ejecución del Plan de Obras Públicas.",
                funciones: [
                    {
                        icono: "engineeringIcon",
                        titulo: "Estudios y Proyectos",
                        descripcion: "Conducir y fiscalizar los estudios técnicos y proyectos que se desprenden del Plan de Obras a ejecutar en el municipio."
                    },
                    {
                        icono: "requestQuoteIcon",
                        titulo: "Presupuestos y Licitaciones",
                        descripcion: "Optimizar el uso de los recursos mediante el cálculo de cómputos e intervenir en los llamados a licitaciones y contrataciones."
                    },
                    {
                        icono: "construction",
                        titulo: "Ejecución de Obras Civiles y Viales",
                        descripcion: "Planificar y coordinar la ejecución en terreno de las obras de acuerdo a las prioridades establecidas por el Ejecutivo Municipal."
                    },
                    {
                        icono: "factCheckIcon",
                        titulo: "Control Técnico y Calidad",
                        descripcion: "Fiscalizar permanentemente y ejercer un control técnico integral para asegurar los máximos estándares de calidad en las obras realizadas."
                    }
                ],
                subcards: [
                    {
                        title: "Departamento de Producción y Materiales",
                        description: "Elabora y provee los materiales necesarios para la ejecucion y mantenimiento de las obras publicas municipales.",
                        icon: "construction",
                        to: "/gobierno/secretaria-obras-publicas/obras-publicas/dto-produccion-y-materiales",
                        mision: "Optimizar la ejecución de las obras municipales mediante la producción propia de insumos de hormigón y materiales de construcción, integrando una gestión administrativa rigurosa que garantice el control de recursos, el seguimiento técnico de los proyectos y la eficiencia operativa en las áreas de Obras y Servicios Públicos de Eldorado.",
                        funciones: [
                            {
                                icono: "precisionManufacturingIcon",
                                titulo: "Producción de Materiales e Insumos",
                                descripcion: "Fabricar y controlar la calidad de bloques para pavimento, losetas, tubos de alcantarilla y estructuras de hormigón para infraestructura urbana."
                            },
                            {
                                icono: "architectureIcon",
                                titulo: "Topografía y Relevamiento Técnico",
                                descripcion: "Ejecutar replanteos de obras, relevamientos de infraestructura existente y confeccionar la documentación técnica necesaria para el inicio de proyectos."
                            },
                            {
                                icono: "construction",
                                titulo: "Ejecución de Obras por Administración",
                                descripcion: "Llevar adelante la construcción de alcantarillas, refugios peatonales, bocas de tormenta y obras de arquitectura programadas por el municipio."
                            },
                            {
                                icono: "inventoryIcon",
                                titulo: "Logística y Control de Suministros",
                                descripcion: "Gestionar el depósito de materiales y fiscalizar el consumo de combustibles por tipo y destino para asegurar el uso eficiente de los recursos."
                            },
                            {
                                icono: "assignmentIcon",
                                titulo: "Gestión Administrativa y Licitaciones",
                                descripcion: "Elaborar pliegos de licitación, redactar notas oficiales y mantener el archivo documental de las direcciones de Obras y Servicios Públicos."
                            },
                            {
                                icono: "analitycsIcon",
                                titulo: "Control de Gestión y Monitoreo",
                                descripcion: "Supervisar el avance físico de las obras y el personal afectado, elaborando partes diarios e informes periódicos sobre el estado de las actividades."
                            }
                        ]
                    },
                    {
                        title: "Departamento de Ejecucion de Obras",
                        description: "Garantiza el desarrollo y mantenimiento de espacios y servicios públicos de calidad",
                        icon: "frontLoaderIcon",
                        to: "/gobierno/secretaria-obras-publicas/obras-publicas/dto-ejecucion-obras",
                        mision: "Garantizar la ejecución eficiente de obras de infraestructura vial y urbana, enfocándose en la construcción de soluciones pluviales y la puesta en valor de los espacios públicos, plazas y parques de la ciudad, asegurando entornos seguros y funcionales para el esparcimiento y la transitabilidad de los vecinos de Eldorado.",
                        funciones: [
                            {
                                icono: "addRoadIcon",
                                titulo: "Construcción de Cordón Cuneta",
                                descripcion: "Ejecución de obras de cordón cuneta para delimitar calzadas, organizar el flujo vehicular y mejorar la estética urbana de los barrios."
                            },
                            {
                                icono: "waterPumpIcon",
                                titulo: "Sistemas de Desagüe y Badenes",
                                descripcion: "Construcción de badenes de hormigón para facilitar el escurrimiento de aguas pluviales y proteger la integridad de las arterias viales."
                            },
                            {
                                icono: "parkIcon",
                                titulo: "Infraestructura de Plazas",
                                descripcion: "Desarrollo y mejora de la infraestructura básica en plazas y espacios verdes, asegurando que cuenten con senderos y equipamiento adecuado."
                            },
                            {
                                icono: "toyIcon",
                                titulo: "Mantenimiento de Juegos",
                                descripcion: "Inspección, reparación y puesta a punto de los juegos infantiles en espacios públicos para garantizar la seguridad de los niños."
                            },
                            {
                                icono: "construction",
                                titulo: "Mantenimiento Urbano General",
                                descripcion: "Atención constante de las reparaciones necesarias en la infraestructura de las plazas para evitar el deterioro de los espacios comunes."
                            },
                            {
                                icono: "engineeringIcon",
                                titulo: "Operatividad y Ejecución",
                                descripcion: "Coordinación de las cuadrillas de trabajo para el cumplimiento de las metas fijadas por la Dirección de Obras Públicas en todo el municipio."
                            }
                        ]
                    }
                ]

            },
            {
                title: "Dirección de Mantenimiento y Servicios",
                description: "Gestiona el mantenimiento de espacios y servicios municipales.",
                icon: "dirMantenimientoAndServicios",
                to: "/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios",
                mision: "Organizar, controlar y ejecutar las tareas que hacen al mantenimiento y conservación del Parque Vial y Automotor, así como las calles de tierra y caminos rurales.",
                funciones: [
                    {
                        icono: "carRepairIcon",
                        titulo: "Control del Parque Automotor",
                        descripcion: "Llevar un registro detallado del uso, kilometraje, consumo de combustible y mantenimiento preventivo de todos los vehículos y equipos viales municipales."
                    },
                    {
                        icono: "construction",
                        titulo: "Talleres y Supervisión Técnica",
                        descripcion: "Fiscalizar los trabajos internos de mecánica, electricidad y gomería, estableciendo normas de uso y capacitando constantemente a los operarios."
                    },
                    {
                        icono: "editRoadIcon",
                        titulo: "Conservación de Calles y Caminos",
                        descripcion: "Ejecutar el mantenimiento continuo, entoscado y perfilado de calles no pavimentadas, caminos rurales y toda vía pública de la jurisdicción."
                    },
                    {
                        icono: "localShippingIcon",
                        titulo: "Logística y Asistencia a Obras",
                        descripcion: "Proveer los materiales necesarios y asistir con equipos viales pesados para el movimiento de suelos en obras generales según el cronograma de trabajo."
                    }
                ],
                subcards: [
                    {
                        title: "Departamento de Limpieza y Servicios Generales",
                        description: "Encargado de mantener la limpieza, el orden y el correcto funcionamiento de los espacios publicos y edificios municipales.",
                        icon: "construction",
                        to: "/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-limpieza-y-servicios",
                        mision: "Mantener limpia la Ciudad y conservar los edificios públicos y las obras municipales.",
                        funciones: [
                            {
                                icono: "deleteSweepIcon",
                                titulo: "Gestión de Residuos",
                                descripcion: "Ejecutar la recolección domiciliaria bajo frecuencias establecidas y erradicar basurales clandestinos o elementos que perjudiquen la higiene urbana."
                            },
                            {
                                icono: "cleaningServicesIcon",
                                titulo: "Saneamiento de Vías Públicas",
                                descripcion: "Realizar la limpieza de calles y avenidas, servicios de riego y el mantenimiento de banquinas y veredas mediante tareas de macheteo."
                            },
                            {
                                icono: "waterDropIcon",
                                titulo: "Servicios Esenciales y Agua",
                                descripcion: "Atender la provisión de agua potable según la reglamentación y gestionar la prestación y fiscalización de los servicios atmosféricos."
                            },
                            {
                                icono: "homeRepairIcon",
                                titulo: "Mantenimiento de Edificios",
                                descripcion: "Coordinar trabajos de albañilería, pintura, electricidad, plomería y carpintería para la conservación integral de las dependencias municipales."
                            },
                            {
                                icono: "landscapeIcon",
                                titulo: "Intervención en Terrenos",
                                descripcion: "Llevar a cabo la limpieza de terrenos baldíos por cuenta de sus propietarios para evitar focos de infección y mantener el orden estético."
                            },
                            {
                                icono: "engineeringIcon",
                                titulo: "Operatividad General",
                                descripcion: "Implementar tareas extraordinarias de higiene y logística que garanticen la limpieza de la ciudad ante cualquier contingencia o necesidad."
                            }
                        ]
                    },
                    {
                        title: "Departamento de Parquizacion y Espacios Verdes",
                        description: "Se ocupa del diseño, mantenimiento y mejora de parques, plazas y areas verdes de la ciudad.",
                        icon: "construction",
                        to: "/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-parquizacion-y-espacios-verdes",
                        mision: "Organizar, conservar y equipar en relación a su uso y diseño los distintos espacios verdes de la comuna",
                        funciones: [
                            {
                                icono: "naturePeopleIcon",
                                titulo: "Planificación de Arbolado",
                                descripcion: "Diseñar y ejecutar planes de forestación en calles, plazas y parques, seleccionando las especies adecuadas para cada entorno urbano."
                            },
                            {
                                icono: "pottedPlantIcon",
                                titulo: "Producción en Vivero",
                                descripcion: "Organizar la producción propia de especies arbóreas y ornamentales en el Vivero Municipal para el autoabastecimiento de la ciudad."
                            },
                            {
                                icono: "parkIcon",
                                titulo: "Mantenimiento de Espacios",
                                descripcion: "Ejecutar tareas de embellecimiento, limpieza y remodelación de jardines y parques para garantizar espacios verdes de calidad."
                            },
                            {
                                icono: "contentCutIcon",
                                titulo: "Poda y Sanidad Forestal",
                                descripcion: "Conducir las podas de formación y corrección, además de realizar extracciones de ejemplares cuando sea estrictamente indispensable por seguridad."
                            },
                            {
                                icono: "attractionsIcon",
                                titulo: "Áreas de Recreación",
                                descripcion: "Instalar y mantener juegos infantiles y mobiliario urbano en las zonas destinadas al esparcimiento y la recreación familiar."
                            },
                            {
                                icono: "landscapeIcon",
                                titulo: "Diseño Paisajístico",
                                descripcion: "Ejecutar proyectos de remodelación y nuevos jardines municipales, integrando criterios estéticos y ambientales en el paisaje urbano."
                            }
                        ]
                    },
                    {
                        title: "Departamento de Poda y Arbolado Urbano",
                        description: "Gestiona las tareas de poda, ciudad y conservacion del arbolado urbano para mejorar la calidad ambiental.",
                        icon: "construction",
                        to: "/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-poda-y-arbolado",
                        mision: "Gestionar el patrimonio arbóreo urbano de Eldorado mediante el estricto cumplimiento de las normativas vigentes y el asesoramiento técnico forestal, garantizando la seguridad pública y la preservación ambiental a través de procesos transparentes de inspección, dictamen y ejecución profesional.",
                        funciones: [
                            {
                                icono: "gavelIcon",
                                titulo: "Marco Normativo Forestal",
                                description: "Velar por el cumplimiento de las ordenanzas 091/89, 088/10 y 212/2019 que regulan el manejo silvicultural y la protección del arbolado en zona urbana."
                            },
                            {
                                icono: "assignmentIcon",
                                titulo: "Gestión de Solicitudes",
                                description: "Tramitar los pedidos de apeo o poda iniciados por los vecinos, evaluando los motivos declarados y coordinando los requisitos administrativos correspondientes."
                            },
                            {
                                icono: "engineeringIcon",
                                titulo: "Inspección Técnica Especializada",
                                description: "Realizar visitas de campo a cargo de Ingenieros Forestales para evaluar el estado sanitario, estructural y la factibilidad técnica de cada intervención."
                            },
                            {
                                icono: "factCheckIcon",
                                titulo: "Evaluación y Dictamen",
                                description: "Elaborar informes técnicos vinculantes que sirven de herramienta para la aprobación o rechazo de las actividades de poda o extracción solicitadas."
                            },
                            {
                                icono: "campaignIcon",
                                titulo: "Notificación y Comunicación",
                                description: "Proceder al aviso formal del dictamen realizado, informando al contribuyente sobre la resolución técnica y los pasos a seguir para la actividad."
                            },
                            {
                                icono: "contentCutIcon",
                                titulo: "Ejecución y Seguridad",
                                description: "Coordinar las tareas de apeo y poda, supervisando seguros, limpieza de residuos y el cumplimiento de las normas de seguridad del operador."
                            }
                        ]
                    }
                ]
            },
            {
                title: "Dirección de Planeamiento",
                description: "Diseña estrategias de desarrollo urbano y territorial.",
                icon: "dirPlaneamiento",
                to: "/gobierno/secretaria-obras-publicas/planeamiento",
                mision: "Contribuir a optimizar la gestión de la Dirección organizando, supervisando y ejecutando las funciones administrativas-técnicas, siempre en concordancia con las Normativas Vigentes, a fin de que su labor sea eficaz en las distintas áreas de competencia de la Dirección, no comprendidas dentro de un Departamento.",
                funciones: [
                    {
                        icono: "mapIcon",
                        titulo: "Planos Digitalizados",
                        descripcion: "Confeccionar y mantener actualizados los planos generales digitalizados del municipio, incluyendo redes hídricas y mensuras."
                    },
                    {
                        icono: "shareLocationIcon",
                        titulo: "Zonificación y Trazado",
                        descripcion: "Diseñar los planos de zonificación urbana, secciones catastrales y establecer el trazado oficial de anchos de calles y avenidas."
                    },
                    {
                        icono: "cityIcon",
                        titulo: "Planimetría Barrial",
                        descripcion: "Elaborar y actualizar de manera permanente la planimetría específica y los planos de ubicación de los 104 barrios de la ciudad."
                    },
                    {
                        icono: "gridOnIcon",
                        titulo: "Catastro y Manzaneros",
                        descripcion: "Confeccionar y mantener al día los manzaneros catastrales para asegurar una correcta administración y división territorial."
                    },
                    {
                        icono: "architectureIcon",
                        titulo: "Expedientes de Construcción",
                        descripcion: "Registrar y controlar expedientes de obras privadas, verificando amojonamientos, numeración domiciliaria, superficies y medidas del terreno."
                    },
                    {
                        icono: "folderSharedIcon",
                        titulo: "Mensuras y Archivo Técnico",
                        descripcion: "Gestionar el ingreso y egreso de trámites varios, colaborar en la verificación técnica y organizar el archivo de los planos de mensura visados."
                    }
                ]
            },
            {
                title: "Planta Asfáltica",
                description: "Produce y suministra asfalto para obras viales locales",
                icon: "plantaAsfaltica",
                to: "/gobierno/secretaria-obras-publicas/planta-asfaltica"
            },
            {
                title: "Planta de Hormigón",
                description: "Elabora hormigón para la construcción de infraestructura pública.",
                icon: "plantaHormigon",
                to: "/gobierno/secretaria-obras-publicas/planta-hormigon"
            },
        ],
        accordionItems: [
            {
                title: 'Profesionales Listados',
                icon: 'badgeIcon',
                cards: [
                    {
                        title: 'Profesionales en Eldorado',
                        description: 'Listado de profesionales habilitados en Eldorado.',
                        to: 'https://docs.google.com/document/d/1UB5MPj5pGI9K8JJEHnCK8o3PR1H1mtSy/edit',
                        icon: 'groupsIcon'
                    },
                    {
                        title: 'Profesionales para Plan de Contingencia',
                        description: 'Listado de profesionales para plan de contingencia y seguridad contra incendio.',
                        to: 'https://docs.google.com/spreadsheets/d/1vBa8m1EVbHUJyoql1U0-oOWuRswZFjjC/edit?gid=55213740#gid=55213740',
                        icon: 'assignmentTurnedInIcon'
                    }
                ]
            },
            {
                title: 'Codigos y Ordenanzas',
                icon: 'gavelIcon',
                cards: [
                    {
                        title: 'Codigo de Edificacion',
                        description: 'Ordenanza Nro 164/2026 - Codigo de Edificacion.',
                        to: 'https://drive.google.com/file/d/18wZwMpc50d5JCh08x1_oKjRkBUypupTi/view',
                        icon: 'menuBookIcon'
                    }
                ]
            },
            {
                title: 'Autorizaciones y Formularios',
                icon: 'descriptionIcon',
                cards: [
                    {
                        title: 'Autorizacion Prearia de Energia Electrica',
                        description: 'Ordenanza Nro 165/2012 - Autorizacion precaria del servicio de energia electrica.',
                        to: 'https://drive.google.com/file/d/17fQxtK_PPDU_E3j8Di7miwSuogcQKgAG/view',
                        icon: 'boltIcon'
                    },
                    {
                        title: 'Dictamen 337/2021',
                        description: 'Dictamen sobre autorizacion precaria de energia electrica.',
                        to: 'https://drive.google.com/file/d/1FLge_VeFeOsh01WAfKfGuoC8zDCPMFzo/view',
                        icon: 'aprovationIcon'
                    },
                    {
                        title: 'Dictamen 530/2024',
                        description: 'Dictamen sobre autorizacion precaria de energia electrica.',
                        to: 'https://drive.google.com/file/d/1QEVfS8FRHSLW4QaOpJY_CnmygNJGhZRE/view',
                        icon: 'ruleIcon'
                    },
                    {
                        title: 'Formulario 1 - Requerimiento',
                        description: 'Formulario para autorizacion precaria del servicio de energia electrica.',
                        to: 'https://drive.google.com/file/d/1yJLblthqsMazyao2cYrCbtx0lCE8zQwr/view',
                        icon: 'descriptionIcon'
                    },
                    {
                        title: 'Autorizacion Modelo para Certificar Firma',
                        description: 'Modelo de autorizacion para certificar firmas.',
                        to: 'https://docs.google.com/document/d/1LEO_tv-c3Yc37D3Qa31iK9TsHoUFxrKH/edit',
                        icon: 'certificationAssignatureIcon'
                    },
                    {
                        title: 'Formulario Anexo - Firma',
                        description: 'Formulario anexo para certificacion de firmas.',
                        to: 'https://drive.google.com/file/d/1Fnk6bgkWZjBpu-smTOId0zaQ6BRe9DqV/view',
                        icon: 'editDocumentIcon'
                    }
                ]
            },
            {
                title: 'Planeamiento Urbano',
                icon: 'mapIcon',
                cards: [
                    {
                        title: 'Codigo de Planeamiento Urbano',
                        description: 'Ordenanza N°. 168/2023 - Aprueba codigo de planeamiento urbano 2023.',
                        to: 'https://drive.google.com/file/d/10_FqwFFqDGmzPF-96QeUAx02PWal9B7E/view',
                        icon: 'architectureIcon'
                    },
                    {
                        title: 'Anexo - Planilla de zonificacion',
                        description: 'Ordenanza N°. 169/2023 - Capitulos I, II y III.',
                        to: 'https://drive.google.com/file/d/1c-yUSrqLy79H9l2FI0wRsugaANwwgX_B/view',
                        icon: 'descriptionIcon'
                    },
                    {
                        title: 'Plan Urbano - Capitulos 1, 2 y 3',
                        description: 'Documento del Plan Urbano con lineamientos generales, diagnostico y objetivos estrategicos.',
                        to: 'https://drive.google.com/file/d/1p2pb47jCIM-uuLKAXTd6Dfpu-3bye1GZ/view',
                        icon: 'menuBookIcon'
                    },
                    {
                        title: 'Plan Urbano - Capitulo 4',
                        description: 'Capitulo especifico del Plan Urbano con disposiciones operativas y criterios de implementacion.',
                        to: 'https://drive.google.com/file/d/1LUc1XCQMaxWrwwARXkCbswPuR6y1tM1F/view',
                        icon: 'menuBookIcon'
                    }
                ]
            },
            {
                title: 'Aranceles y Requisitos',
                icon: 'requestQuoteIcon',
                cards: [
                    {
                        title: 'Aranceles y Tasas',
                        description: 'Aranceles, Tasas - Valor U.F. 604.00 - Desde 01/07/2025.',
                        to: 'https://docs.google.com/document/d/1LOcCIuGS5vl3oQoQniK-Pxgx9FBdChph/edit',
                        icon: 'paymentIcon'
                    },
                    {
                        title: 'Requisitos para Presentacion de Plano',
                        description: 'Requisitos para presentacion de planos ( 02/01/2025 ).',
                        to: 'https://docs.google.com/document/d/1B1TiYEWo5FaMigocWiCs0PN7hxTrdT14/edit?rtpof=true&sd=true&tab=t.0',
                        icon: 'ruleIcon'
                    }
                ]
            },
            {
                title: 'Zonificacion',
                icon: 'locationOnIcon',
                cards: [
                    {
                        title: 'Zonificacion con nombres de calles',
                        description: 'Zonificacion ( Noviembre 2024 ) con nombres de calles.',
                        to: 'https://drive.google.com/file/d/13Ap8iiNyyOSVlcpq7iVjOV6aZdTlChnU/view',
                        icon: 'dirTurismo'
                    },
                    {
                        title: 'Zonificacion con mapa base',
                        description: 'Zonificacion ( Noviembre 2023 ) con mapa base.',
                        to: 'https://drive.google.com/file/d/12OlFUgeDdmVJRVVaew2PjrLS1vjz1LFX/view',
                        icon: 'mapIcon'
                    }
                ]
            }
        ]
    }]

export const SECRETARIA_AMBIENTE = [
    {
        categoryTitle: "Departamentos",
        id: "departamentos",
        cards: [
            {
                title: "Dirección de Ambiente",
                description: "Promueve políticas para la protección del entorno natural.",
                icon: "dirAmbiente",
                to: "/gobierno/secretaria-de-ambiente/ambiente",
                mision: "Administrar, mantener y controlar los procesos de los departamentos a su cargo. Ejecutar programas de mejoramiento ambiental, bajo un enfoque de desarrollo sustentable y sostenible.",
                funciones: [
                    {
                        icono: "assignmentIcon",
                        titulo: "Plan Operativo Anual",
                        descripcion: "Dar seguimiento y garantizar la correcta ejecución de los objetivos y metas trazadas en el Plan Operativo Anual del sector."
                    },
                    {
                        icono: "naturePeopleIcon",
                        titulo: "Participación y Gestión",
                        descripcion: "Fomentar la corresponsabilidad y el involucramiento activo de los vecinos en las políticas de gestión ambiental del municipio."
                    },
                    {
                        icono: "parkIcon",
                        titulo: "Educación Ambiental",
                        descripcion: "Promover la concientización ciudadana a través de campañas y programas de educación y sensibilización sobre el cuidado de nuestro entorno natural."
                    }
                ],
                subcards: [
                    {
                        title: "Instructivos de Seguridad e Higiene",
                        description: "Guias practicas para seguridad y salud laboral",
                        icon: "quickReferenceIcon",
                        to: "https://drive.google.com/file/d/1mVC6pjX2k5qhmtQCg5TKFsm1VbkO_ORX/view",
                    }
                ],
            },
            {
                title: "Dirección de Bromatología, Veterinaria y Zoonosis",
                description: "Controla la sanidad alimentaria y el bienestar animal.",
                icon: "dirBromatologiaAndZoonosis",
                to: "/gobierno/secretaria-de-ambiente/bromatologia-y-zoonosis",
                mision: "Asegurar la inocuidad de los productos alimenticios y bebidas en fábricas, comercios, alimentos y vehículos de transporte, dentro del ejido municipal.",
                funciones: [
                    {
                        icono: "dirBromatologiaAndZoonosis",
                        titulo: "Sanidad Animal y Zoonosis",
                        descripcion: "Llevar a cabo campañas masivas de vacunación antirrábica, desparasitación y programas gratuitos de castración para el control poblacional."
                    },
                    {
                        icono: "storeFrontIcon",
                        titulo: "Inspecciones Bromatológicas",
                        descripcion: "Fiscalizar periódicamente comercios, supermercados y locales gastronómicos para asegurar el estricto cumplimiento de las normas de higiene."
                    },
                    {
                        icono: "scienceIcon",
                        titulo: "Análisis de Laboratorio",
                        descripcion: "Realizar estudios técnicos y microbiológicos de agua potable y alimentos para garantizar su aptitud y resguardar la salud pública local."
                    },
                    {
                        icono: "badgeIcon",
                        titulo: "Capacitación y Carnet Sanitario",
                        descripcion: "Dictar los cursos obligatorios de manipulación segura de alimentos y gestionar la emisión del Carnet Sanitario para trabajadores del rubro."
                    },
                    {
                        icono: "pestControlIcon",
                        titulo: "Control de Vectores y Plagas",
                        descripcion: "Planificar y ejecutar tareas de fumigación, descacharrizado y control de vectores transmisores de enfermedades en espacios públicos y barrios."
                    },
                    {
                        icono: "healthAndSafetyIcon",
                        titulo: "Bienestar y Tenencia Responsable",
                        descripcion: "Promover campañas de concientización ciudadana sobre el cuidado animal, fomentar la adopción y atender denuncias por maltrato."
                    }
                ],
                accordionGroups: [
                    {
                        title: "Tramites Bromatologia",
                        icon: "descriptionIcon",
                        description: "Informacion, requisitos y accesos directos para tramites del area.",
                        items: [
                            {
                                title: "Extravío del Carnet de Manipulador de Alimentos",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "A través de este trámite el vecino podrá informar al municipio el extravió del Carnet de Manipulador de Alimentos, para su posterior obtención del duplicado.",
                                    "En caso de extravío, robo o deterioro (tal que implique el reemplazo) del Carnet de Manipulador de Alimentos, se abonará el arancel correspondiente."
                                ],
                                requisitos: [
                                    "Certificado de Manipulador de Alimentos Seguros.",
                                    "Presentar en el Dpto de Bromatología la documentación requerida por el trámite."
                                ]
                            },
                            {
                                title: "Renovación del Carnet de Manipulador de Alimentos",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "A través de este trámite el vecino podrá renovar el Carnet de Manipulador de Alimentos.",
                                    "La misma es necesaria para todo personal de fábricas y comercios de alimentos, cualquiera fuera su índole o categoría, a los efectos de su admisión y permanencia en los mismos."
                                ],
                                requisitos: [
                                    "Rendir la renovación del curso de manipulación segura en alimentos."
                                ],
                                observaciones: [
                                    "Deberá realizar el trámite antes del vencimiento del Carnet de Manipulador de Alimentos, para evitar infracciones.",
                                    "Para renovación del Curso de Capacitación en Manipulación Segura de Alimentos, deberá renovar el exámen cada 3 años."
                                ]
                            },
                            {
                                title: "Obtención del Carnet de Manipulador de Alimentos",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "A través de este trámite el vecino podrá obtener el Carnet de Manipulador de Alimentos.",
                                    "El mismo es necesario para todo personal de fábricas y comercios de alimentos, cualquiera fuera su índole o categoría.",
                                    "Este carnet de manipulador de alimentos expedido por la Municipalidad de Eldorado, tiene vigencia en todo el territorio argentino, teniendo un único número identificador mediante el reconocimiento del SIFeGA que es un sistema de información con todos los integrantes del sistema nacional de control de alimentos."
                                ],
                                requisitos: [
                                    "Certificado del Curso de Capacitación en Manipulación Segura de Alimentos, emitido por capacitador registrado SIFeGA.",
                                    "Copia del D.N.I.: con domicilio actualizado.",
                                    "Una foto 4x4 (tipo carnet), para escanear para la entrega del carnet de manipulador de alimentos.",
                                    "Abonar la tasa correspondiente."
                                ]
                            },
                            {
                                title: "Inscripción para el Curso de Manipulación Segura de Alimentos",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "A través de este trámite el vecino podrá inscribirse en el Curso de Manipulación Segura de Alimentos.",
                                    "Para consultas deberá comunicarse al telefono 3751-302632 o al 3751-606091",
                                    "LUGAR: SALA DE CONFERENCIAS - MUNICIPALIDAD DE ELDORADO."
                                ],
                                ctaLabel: "Inscribirse Aqui",
                                to: "https://docs.google.com/forms/d/e/1FAIpQLSduVGGnLCQQHZtMfDwZUneXy4ZBG_sr2FvyJfGatzEVbvrPtw/viewform"
                            },
                            {
                                title: "Informe de habilitación Comercial para Rubros Alimenticios",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "El objetivo de este trámite es coordinar la visita con un auditor o inspector, a fin de realizar un informe del local, de acuerdo al rubro, si el mismo reúne los requisitos técnicos, higiénico-bromatológicos para ser habilitado."
                                ],
                                observaciones: [
                                    "Toda persona que cumpla funciones en el local comercial, deberá poseer Carnet de Manipulador de Alimentos.",
                                    "Se contactarán telefónicamente, para hacer efectiva la inspección, según la disponibilidad de auditores para desarrollar esa tarea."
                                ]
                            },
                            {
                                title: "Solicitud de Carnet de Vendedor Ambulante",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "Permite obtener el Carnet para ejercer actividad comercial como vendedor ambulante (fuera de locales habilitados y/o lugares de trabajo) dentro del ejido urbano de la ciudad de Eldorado."
                                ],
                                requisitos: [
                                    "Planilla de solicitud Carnet de Vendedor Ambulante.",
                                    "Fotos 4x4 (2 fotos- Se deberá entregar al momento de presentarse en la Dirección de Comercio e Industria).",
                                    "Libre Deuda del Juzgado Administrativo Municipal de Faltas del Titular",
                                    "Libre Deuda de Rentas Municipal sobre Tasa a la Actividad Comercial del Titular (el mismo se puede tramitar a través del correo electrónico , indicando los datos personales y el tramite a realizar)",
                                    "Inscripción en A.R.E.F (para venta ambulante- COD 525900)",
                                    "Inscripción en A.F.I.P.",
                                    "Original y copia de D.N.I. con domicilio actualizado.",
                                    "Carnet de Manipulador de Alimentos",
                                    "Informe del Dpto. Bromatología",
                                    "Abonar el arancel correspondiente."
                                ],
                                observaciones: [
                                    "El trámite debe ser realizado personalmente, para lo cual deberá solicitar un turno a La Dirección de Comercio e Industria a través de la Ventanilla Digital",
                                    "Los vendedores circularán permanentemente, estando autorizados a estacionar o detenerse en la vía pública el tiempo necesario para despachar su mercadería, quedándoles prohibido la permanencia por más tiempo del indicado o establecer parada fija en la misma (Ordenanza Municipal Nº 033/2016 y decreto reglamentario)"
                                ]
                            },
                            {
                                title: "Denuncias",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "Permite realizar denuncias relacionadas con la actividad comercial dentro del ejido urbano de la ciudad de Eldorado."
                                ],
                                ctaLabel: "Realizar Denuncia",
                                to: "https://docs.google.com/forms/d/e/1FAIpQLSddj1ZsQqdcYvalI1kcqBt3e30a-8Ffty2bj_wdRi9tEuN6_Q/viewform"
                            }
                        ]
                    },
                    {
                        title: "Tramites Zoonosis",
                        icon: "dirBromatologiaAndZoonosis",
                        description: "Informacion, requisitos y accesos directos para tramites del area.",
                        items: [
                            {
                                title: "Turnos Online",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "Permite solicitar turnos online para los servicios de Zoonosis, incluyendo vacunación antirrábica, desparasitación y castración.",
                                ],
                                ctaLabel: "Solicitar Turno",
                                to: "https://turnero-de-zoonosis-mxbm8vbvnjfy0w3k.builder-preview.com/"
                            },
                            {
                                title: "Esterilización Quirúrgica de Mascotas",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "Esterilización quirúrgica para el ADC (Animal Doméstico de Compañía) previa obtención del turno correspondiente.",
                                    "La esterilización quirúrgica evita: las crías no deseadas, el abandono, el aumento poblacional, las peleas por perras en celo, los tumores de mama o próstata, la transmisión de enfermedades venéreas."
                                ],
                                requisitos: [
                                    "El propietario debe ser mayor de edad.",
                                    "D.N.I. (original y copia) con domicilio actualizado",
                                    "El ADC requiere un ayuno previo de 12 hs. para alimentos sólidos y 8 hs. para alimentos líquidos.",
                                    "El día del turno llevar una manta para cubrir el ADC al retirarlo.",
                                    "Solicitar turno previo: telefónicamente al 430926 de lunes a viernes, de 06:30 a 12:30 hs o presencialmente en la Dirección de Zoonosis (calle Pionero Durian N° 263 km 5)."
                                ],
                                observaciones: [
                                    "Si no tuviera domicilio actualizado en DNI: presentar copia de un servicio o contrato de alquiler donde conste domicilio.",
                                    "Perros, perras y gatas a partir de 5 (cinco) meses de edad, gatos a partir de 8 (ocho) meses de edad, hasta 7 a 8 años de edad (mayores de esa edad, el propietario deberá concurrir con indicaciones/informe de su veterinario).",
                                    "El proceso quirúrgico consiste en la extirpación de los ovarios en las hembras (ovariotomía) y los testículos en los machos (orquiectomía).",
                                    "Para consultas puede enviar correo a munidtzoonosis@gmail.com"
                                ]
                            },
                            {
                                title: "Denuncia por mordedura de animal domestico de compañía o lesion compatible con ataque del animal",
                                icon: "articleShortcutIcon",
                                descripcion: [
                                    "Procedimiento que debe cumplirse para realizar la denuncia por que una persona o un animal haya sufrido mordedura de un Animal Doméstico de Compañía (perro o gato) o lesión compatible con ataque de ADC.",
                                ],
                                requisitos: [
                                    "La denuncia debe ser por escrito.",
                                    "Debe adjuntar certificado médico por mordedura de ADC",
                                    "Debe adjuntar certificado médico por lesión compatible con ataque de ADC",
                                ],
                                observaciones: [
                                    "Con certificado médico completar formulario: Denuncia por mordedura de ADC o lesión compatible con ataque de ADC.",
                                    "Sin certificado médico completar formulario: Formula Denuncia.",
                                    "Para consultas puede enviar correo a munidtzoonosis@gmail.com"
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: "Programas",
                description: "Iniciativas ambientales activas para la comunidad local.",
                icon: "dirDominialDeTierras",
                to: "/gobierno/secretaria-de-ambiente/programas",
                accordionGroups: [
                    {
                        title: "Gestion Integral de Residuos Solidos Urbanos (GIRSU)",
                        icon: "articleShortcutIcon",
                        descripcion: [
                            "Los residuos constituyen una problemática que afecta la salud de la población y el ambiente, que necesita soluciones de fondo, de decisiones y políticas públicas aplicadas a mitigarlas.",
                            "De ahí que Gestión integral de los Residuos Sólidos Urbanos constituye un tema de atención prioritaria para mejorar de la calidad de vida de la población, por lo que se lleva adelante el primer relevamiento de la tasa de generación y caracterización de los residuos en el ejido municipal. En forma paralela se implementa el programa de eliminación de microbasurales a cielo abierto con la participación de beneficiarios de programas sociales.",
                            "Se adjunta el programa."
                        ],
                        adjuntos: [
                            {
                                label: "Programa de Eliminación de Microbasurales Eldorado",
                                to: "https://drive.google.com/file/d/1NB6pTaGw6DYRPbccB7B2XBgQQO7VeWi-/view"
                            },
                            {
                                label: "Marco Normativo de residuos",
                                to: "https://drive.google.com/file/d/1iSD5_7v1YBb9G5wmlrMdr4Z5DzVvyf3X/view"
                            }
                        ]
                    },
                    {
                        title: "Educacion Ambiental PEACE",
                        icon: "articleShortcutIcon",
                        descripcion: [
                            "La Ciudad de Eldorado cuenta con un Programa de Educación Ambiental que define los lineamientos necesarios para territorializar la Educación Ambiental a través de procesos de gestión de corto, mediano y largo plazo enmarcados en las políticas provinciales y nacionales de Educación Ambiental.",
                            "De esta manera, el PEACE (Programa de Educación Ambiental de la Ciudad de Eldorado) precisa las bases conceptuales y metodológicas que orientarán las actuaciones en materia ambiental en el municipio, conservando la flexibilidad que exige el carácter dinámico de esta disciplina."
                        ],
                        adjuntos: [
                            {
                                label: "Programa PEACE",
                                to: "https://drive.google.com/file/d/1SGdr4IntCCcHVF4uS29av7GNVwwh3iLv/view"
                            },
                            {
                                label: "Proyecto de formación de Promotores",
                                to: "https://drive.google.com/file/d/1AI6DJ6jBFpB5PI91dtgJCvaC2ohWSXSd/view"
                            }
                        ],
                        destacado: "El PEACE incluirá actividades de promoción, concientización y preservación del medio ambiente llevadas adelante por medio de:",
                        actividades: [
                            {
                                titulo: "Medios de comunicación masiva",
                                items: [
                                    "Prensa",
                                    "Radio Difusión",
                                    "Televisión",
                                    "Internet",
                                    "Multimedia",
                                    "Redes sociales"
                                ]
                            },
                            {
                                titulo: "Campañas educativas trimestrales",
                                items: [
                                    "Charlas en escuelas"
                                ]
                            },
                            {
                                titulo: "Intervención en eventos",
                                items: [
                                    "Culturales",
                                    "Deportivos",
                                    "Sociales",
                                    "Otros"
                                ]
                            },
                            "Jornadas",
                            "Concursos",
                            {
                                titulo: "Trabajos comunitarios con",
                                items: [
                                    "Comisiones barriales",
                                    "Organizaciones sociales",
                                    "Entes gubernamentales",
                                    "Otros"
                                ]
                            }
                        ],
                        cierre: "En el marco de la educación ambiental se lleva adelante en conjunción con otras instituciones educativas del medio la formación de promotores ambientales pertenecientes al área municipal, al área educativa y a la comunidad en su conjunto."
                    },
                    {
                        title: "Programa de Consolidacion del Sistema de Gestion Ambiental",
                        icon: "articleShortcutIcon",
                        descripcion: [
                            "El sistema de gestión ambiental comprende acciones permanentes y continuas tendientes a incorporar y afianzar en la población, hábitos y prácticas que contribuyan al mejoramiento de la calidad de vida de todos y cada uno de los vecinos, y al cuidado de la salud propia y comunitaria. Incluye eventos de diversas índoles de acuerdo al calendario ambiental, como así también actuaciones e intervenciones de control, monitoreo y sanción si correspondiese.",
                            "En este programa se ubican las tareas específicas llevadas adelante por el equipo de control de vectores, promotores ambientales y por los inspectores del área de saneamiento ambiental."
                        ],
                        categorias: [
                            {
                                titulo: "Control de Vectores",
                                subtitulo: "Funciones",
                                items: [
                                    "Planificar, orientar y controlar acciones de lucha contra los vectores.",
                                    {
                                        label: "Control focal",
                                        texto: "Control de criaderos, educación sanitaria y preventiva, tratamiento biológico, químico, físico y mecánico."
                                    },
                                    {
                                        label: "Descacharrizado",
                                        texto: "Recolección de elementos en desuso, objetos inservibles y eliminación de criaderos solicitados por comisiones vecinales y posterior al trabajo de control focal. Eliminación de floreros y recipientes con agua en los cementerios del Municipio, y recolección de neumáticos y objetos inservibles en gomerías."
                                    },
                                    {
                                        label: "Fumigación",
                                        texto: "Rociado adulticida con máquina de niebla fría, aspersor manual y termoniebla en espacios públicos, e instituciones públicas y privadas."
                                    },
                                    {
                                        label: "Rociado espacial",
                                        texto: "Con máquina autoportante ULV de manera preventiva en barrios de nuestra ciudad."
                                    },
                                    {
                                        label: "Bloqueo",
                                        texto: "Ante un caso sospechoso reportado por el Hospital Samic, se realiza el bloqueo (control de focos, búsqueda de febriles, descacharrizado y rociado adulticida)."
                                    },
                                    {
                                        label: "Charlas en escuelas y en los barrios",
                                        texto: "Capacitación a alumnos de educación primaria, secundaria y en barrios solicitados por la comisión barrial sobre Dengue, Chikungunya, Zika, Fiebre Amarilla Urbana y ciclo de vida del mosquito Aedes aegypti."
                                    }
                                ]
                            },
                            {
                                titulo: "Inspección, seguridad e higiene",
                                descripcion: "La inspección sanitaria es el conjunto de actividades de prevención, tratamiento y control sanitario-epidemiológico que se realiza por el personal municipal, y que tiene como objetivo exigir el cumplimiento de las disposiciones jurídico-sanitarias."
                            },
                            {
                                titulo: "Fiesta local, Regional, Provincial y Nacional del Ambiente",
                                descripcion: "Se prevé la implementación de festejos, encuentros, jornadas, talleres, simposios, exposiciones y presentaciones artísticas relacionadas con la temática ambiental, etc. en el mes de junio",
                                destacado: "Trabajo en acciones continuas y programadas",
                                texto: "Eventos de acuerdo con el calendario ambiental, con la participación de instituciones, organizaciones y medios de comunicación."
                            }
                        ],
                        adjuntos: [
                            "Calendario ambiental"
                        ]
                    },
                    {
                        title: "Programa de Recuperacion de Espacios Verdes y Reservas",
                        icon: "articleShortcutIcon",
                        descripcion: [
                            "El Programa de Recuperación de Espacios Verdes y Reservas de la Ciudad de Eldorado tiene como objetivos:"
                        ],
                        actividades: [
                            "Fomentar el uso ordenado y planificado de los recursos para garantizar el aprovechamiento sostenible del patrimonio natural y evitar la pérdida de biodiversidad; teniendo en cuenta las necesidades económicas, sociales y culturales, así como las particularidades de nuestro ecosistema local.",
                            "Elaborar planes y programas de protección y conservación de la flora y la fauna del municipio, con la participación y consenso de la población.",
                            "Restaurar y mejorar la calidad de ecosistemas naturales y paisajísticos que hayan sufrido procesos de degradación y contaminación antrópica.",
                            "Promover medidas de gestión de riesgos que minimicen el impacto de los desastres naturales.",
                            "Apoyar el desarrollo de una ética que promueva la protección del patrimonio natural y la biodiversidad desde una perspectiva de equidad y solidaridad.",
                            "Conservar y valorar el Patrimonio Natural, la protección de la Biodiversidad, el uso sostenible de los recursos naturales, la prevención de la fragmentación de los hábitats, y el mantenimiento y restauración de la integridad de los ecosistemas."
                        ],
                        cierre: "Comprende acciones de recuperación de espacios verdes y ecoturísticos de forma participativa, promoviendo la mejora física de dichas áreas y la vinculación de los vecinos con su entorno. El objetivo es restablecer la cobertura forestal de los cauces de ríos y arroyos de las cuencas hídricas de la ciudad de Eldorado, a través del saneamiento del curso de agua y el suelo lindante y realizando plantaciones en áreas degradadas.",
                        categorias: [
                            {
                                titulo: "Reordenamiento territorial en áreas naturales protegidas",
                                items: [
                                    "Tratamiento de la intrusión: Trabajos conjuntos con planeamiento y Acción Social",
                                    "Turismo sustentable"
                                ]
                            },
                            {
                                titulo: "Formación de pulmones verdes en los barrios - Acción participativa"
                            },
                            {
                                titulo: "Creación de nuevas reservas naturales",
                                items: [
                                    "Municipales",
                                    "Privadas - Exentas de impuestos"
                                ]
                            }
                        ]
                    },
                    {
                        title: "Programa de Recuperacion de Cuencas Hidricas",
                        icon: "articleShortcutIcon",
                        descripcion: [
                            "Comprende la recuperación, restauración y el mantenimiento de los bosques protectores de ríos y arroyos que forman parte de las cuencas hídricas del municipio de Eldorado a partir de la eliminación de los impactos que los degradaban para alcanzar, a lo largo de un proceso prolongado en el tiempo, un funcionamiento natural y autosostenible."
                        ],
                        categorias: [
                            {
                                titulo: "Normativas - Recursos hídricos",
                                items: [
                                    "Recuperación de la franja protectora de ríos y arroyos",
                                    "Convenio con instituciones y organizaciones: FCF - EAE - ARAUCO - INTA - Otras."
                                ]
                            },
                            {
                                titulo: "Saneamiento de arroyos",
                                items: [
                                    "Análisis del agua: Convenios con CEEL - FCF"
                                ]
                            }
                        ]
                    },
                    {
                        title: "Programa de Consumo y Produccion Sostenible",
                        icon: "articleShortcutIcon",
                        categorias: [
                            {
                                items: [
                                    {
                                        label: "Trabajo conjunto con la Secretaría de la Producción y otras Instituciones: FCF- INTA- EAE- MECyT",
                                        items: [
                                            "Producción agroecológica",
                                            "Compost orgánico",
                                            "Podas"
                                        ]
                                    },
                                    "Trabajo con los comercios para el NO uso de bolsitas plásticas",
                                    {
                                        label: "Consumo racional de agua y energía",
                                        items: [
                                            "Campañas para la reducción del consumo indiscriminado de energía y agua",
                                            "Convenio con la CEEL"
                                        ]
                                    },
                                    {
                                        label: "Trabajo conjunto con el sector de la construcción",
                                        items: [
                                            "Disposición final de los residuos de la construcción",
                                            "Reutilización de escombros 1º etapa"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: "Calendario Ambiental",
                        icon: "articleShortcutIcon",
                        descripcion: [
                            "El Calendario Ambiental de la Ciudad de Eldorado es una herramienta que permite sistematizar y unificar las fechas alusivas a la conservación del ambiente y al uso sostenible de los recursos naturales que son priorizadas a lo largo del año. De esta manera, posibilita a las instituciones públicas y privadas, y a las organizaciones de la sociedad civil, organizar las actividades ambientales en torno a dichas fechas.",
                            "El calendario además es un recurso que contribuye a la difusión de la información, concientización y sensibilización de la sociedad respecto al ambiente."
                        ],
                        adjuntos: [
                            {
                                label: "Calendario Ambiental 2026"
                            }
                        ]
                    },
                    {
                        title: "Programa de Equilibrio Poblacional de Fauna Urbana ( Perros y Gatos )",
                        icon: "articleShortcutIcon",
                        categorias: [
                            {
                                titulo: "1) Fundamentación",
                                subtitulo: "Introducción",
                                descripcion: "Perros y gatos, domesticados hace miles de años, han perdido su capacidad natural de autorregular su población. Su reproducción descontrolada genera un grave excedente en las calles, afectando su bienestar, la salud pública y el medioambiente.",
                                texto: "La castración masiva es la solución más efectiva para controlar la sobrepoblación y prevenir problemas de salud pública. Este programa busca implementar esterilizaciones masivas, gratuitas, accesibles y continuas, generando beneficios tanto para los animales como para la comunidad.",
                                items: [
                                    {
                                        label: "Beneficios del programa",
                                        items: [
                                            "Control de enfermedades zoonóticas (rabia, leptospirosis, sarna, etc.).",
                                            "Reducción de accidentes de tránsito causados por animales sueltos.",
                                            "Disminución de animales abandonados y de problemas de conducta asociados a hormonas.",
                                            "Reducción de mordeduras y agresividad.",
                                            "Menor contaminación por residuos y heces.",
                                            "Mejora en la convivencia vecinal.",
                                            "Beneficios para la salud de los animales (menos tumores, infecciones y enfermedades)."
                                        ]
                                    },
                                    {
                                        label: "Situación actual",
                                        texto: "La sobrepoblación proviene principalmente de animales semi-domiciliados y domiciliados, que tienen altas tasas de reproducción y supervivencia. Las medidas tradicionales (matanza, refugios, anticonceptivos, etc.) han resultado ineficaces. La solución radica en atacar la raíz del problema: la reproducción descontrolada."
                                    }
                                ]
                            },
                            {
                                titulo: "2) Objetivo general",
                                descripcion: "Reducir la sobrepoblación de perros y gatos en el municipio de Eldorado."
                            },
                            {
                                titulo: "3) Objetivos específicos",
                                items: [
                                    "Controlar zoonosis.",
                                    "Mejorar la salud pública y ambiental.",
                                    "Reducir gastos en zoonosis.",
                                    "Promover políticas éticas, preventivas y efectivas.",
                                    "Educar a la comunidad sobre la responsabilidad animal."
                                ]
                            },
                            {
                                titulo: "4) Metodología",
                                items: [
                                    {
                                        label: "Estrategia principal",
                                        texto: "Implementar un programa de castraciones masivas, sistemáticas, gratuitas, tempranas, extendidas y abarcativas."
                                    },
                                    {
                                        label: "Características clave",
                                        items: [
                                            "Masivas: Esterilizar al menos el 10% de la población animal anualmente.",
                                            "Sistemáticas: Campañas continuas durante todo el año.",
                                            "Gratuitas: Asegurar acceso a toda la población.",
                                            "Tempranas: Castración antes del primer celo.",
                                            "Extendidas: Cobertura en todo el municipio, incluyendo zonas rurales.",
                                            "Abarcativas: Incluir animales de todas las edades, géneros, razas y clases sociales."
                                        ]
                                    },
                                    "El éxito del programa depende de la colaboración entre el estado, la comunidad y organizaciones no gubernamentales."
                                ]
                            },
                            {
                                titulo: "5) Resultados esperados",
                                items: [
                                    "Reducir la sobrepoblación animal y estabilizar su número.",
                                    "Mejorar la convivencia y la calidad de vida comunitaria.",
                                    "Promover una cultura de cuidado y respeto hacia los animales.",
                                    "Disminuir la incidencia de enfermedades zoonóticas, accidentes y mordeduras.",
                                    "Reducir los costos asociados al control de animales en situación de calle."
                                ]
                            },
                            {
                                titulo: "6) Ubicación",
                                descripcion: "Se implementará en áreas urbanas, periurbanas y rurales del municipio de Eldorado."
                            },
                            {
                                titulo: "7) Temporización",
                                descripcion: "Esterilizar al menos 4,500 animales al año (450 al mes)."
                            },
                            {
                                titulo: "8) Presupuesto",
                                items: [
                                    {
                                        label: "Recursos Humanos",
                                        items: [
                                            "Incorporar un veterinario y dos asistentes capacitados.",
                                            "Incrementar un 30% los sueldos actuales del personal."
                                        ]
                                    },
                                    {
                                        label: "Recursos Materiales",
                                        items: [
                                            "Insumos quirúrgicos: $2 por animal.",
                                            "Combustible: 150 litros de nafta al mes.",
                                            "Publicidad y folletos: $2,000 mensuales."
                                        ]
                                    }
                                ]
                            },
                            {
                                titulo: "9) Evaluación",
                                destacado: "Medir el impacto a través de:",
                                items: [
                                    "Registros de animales esterilizados.",
                                    "Reducción de denuncias por animales en la vía pública, mordeduras y camadas abandonadas.",
                                    "Disminución de enfermedades zoonóticas.",
                                    "Este programa fomenta la prevención, evitando soluciones costosas e ineficientes, y promueve una gestión ética y efectiva de la fauna urbana."
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: "Normativas",
                description: "Reglamentos que rigen la gestión ambiental municipal.",
                icon: "normativas",
                to: "/gobierno/secretaria-de-ambiente#normativas"
            },
            {
                title: "Denuncias",
                description: "Canal para reportar infracciones o daños ambientales.",
                icon: "denuncias",
                to: "https://docs.google.com/forms/d/e/1FAIpQLSdO71-osdOswv61StBU6EsqoHVYOmodt21BpOGksu3Y6EdUrA/viewform"
            },
            {
                title: "Observatorio Ambiental",
                description: "Monitorea y analiza indicadores del medio ambiente.",
                icon: "observatorioAmbiental",
                to: "/gobierno/secretaria-de-ambiente/observatorio-ambiental",
                funciones: [
                    {
                        icono: "inventoryIcon",
                        titulo: "Recopilación de Datos",
                        descripcion: "Reunir, clasificar e inventariar información científica y técnica sobre el ambiente y recursos naturales de la ciudad y la región."
                    },
                    {
                        icono: "monitoringIcon",
                        titulo: "Monitoreo e Indicadores",
                        descripcion: "Definir e implementar índices para el seguimiento constante del entorno y de los mecanismos de participación pública en la gestión ambiental."
                    },
                    {
                        icono: "groupWorkIcon",
                        titulo: "Red de Trabajo y Sinergia",
                        descripcion: "Articular la cooperación con especialistas y recursos humanos técnicos para promover una red de trabajo científico-técnica eficiente."
                    },
                    {
                        icono: "analitycsIcon",
                        titulo: "Gestión de Estadísticas e Información Geográfica",
                        descripcion: "Administrar datos ambientales del municipio, incluyendo saneamiento, control de vectores (índices LIRAa), inventario de gases de efecto invernadero y relevamiento de residuos (GIRSU)."
                    },
                    {
                        icono: "accountTreeIcon",
                        titulo: "Articulación Interinstitucional",
                        descripcion: "Coordinar con otras dependencias municipales y organismos externos con el objetivo de integrar de forma unificada los sistemas de información."
                    },
                    {
                        icono: "handshakeIcon",
                        titulo: "Convenios de Colaboración",
                        descripcion: "Suscribir acuerdos con universidades, centros de investigación, empresas y ONGs para potenciar y mejorar el alcance del Observatorio."
                    }
                ],
                subcards: [
                    {
                        title: "RESULTADOS 2024 Y PROYECCIONES 2025",
                        icon: "descriptionIcon",
                        to: "https://drive.google.com/file/d/1ElQfhXw6A551T03XVE5_F-FaICZxaC8l/preview",
                    },
                    
                ],
            },
            {
                title: "Licencia Ambiental",
                description: "Aviso de Proyecto - Documento obligatorio para todo tipo de proyecto de infraestructura.",
                icon: "licenciaAmbiental",
                to: "https://docs.google.com/forms/d/e/1FAIpQLSfYfVeNYX481eGMzwUVVYgevN8fQM1I_DaJTfoQleLygz5M0g/viewform"
            },
            {
                title: "Guía para la elaboración de Informes Ambientales",
                description: "Lineamientos conceptuales generales para la elaboración de Informes Ambientales.",
                icon: "guiaElaboracionInformesAmbientales",
                to: "https://drive.google.com/file/d/1rieVr-TrXupLnZXxvrUgJ-zi-kyoCkXD/preview"
            }
        ],
    }]

export const SECRETARIA_PRODUCCION = [
    {
        categoryTitle: "Depatamentos",
        id: "departamentos",
        cards: [
            {
                title: "Dirección de La Producción y Desarrollo Sostenible",
                description: "Fomenta la producción local con enfoque ambiental sostenible.",
                icon: "dirProduccionAndDesarrolloSostenible",
                to: "/gobierno/secretaria-de-produccion/produccion-y-desarrollo-sostenible",
                mision: "Desarrollar en la comunidad las acciones, que en el campo social, educativo y de otra índole, que signifique contribuir al bienestar del habitante a nivel barrial.",
                funciones: [
                    {
                        icono: "agricultureIcon",
                        titulo: "Apoyo a Productores Locales",
                        descripcion: "Asistir técnica y financieramente a productores agrícolas, forestales y ganaderos para mejorar su rendimiento y competitividad en la región."
                    },
                    {
                        icono: "storeFrontIcon",
                        titulo: "Desarrollo de PyMEs y Emprendedores",
                        descripcion: "Fomentar el crecimiento de pequeñas y medianas empresas locales mediante programas de asesoramiento, formalización y vinculación comercial."
                    },
                    {
                        icono: "eco",
                        titulo: "Agroecología y Sustentabilidad",
                        descripcion: "Promover prácticas productivas amigables con el medio ambiente, impulsando la transición hacia modelos agroecológicos y el uso racional de los recursos."
                    },
                    {
                        icono: "localMallIcon",
                        titulo: "Mercados y Ferias Locales",
                        descripcion: "Organizar y fortalecer espacios de comercialización directa, como ferias francas, para conectar directamente a los productores locales con los vecinos."
                    },
                    {
                        icono: "modelTrainingIcon",
                        titulo: "Capacitación Tecnológica",
                        descripcion: "Implementar programas de formación en nuevas tecnologías, agregado de valor en origen y procesos innovadores aplicados a la producción."
                    },
                    {
                        icono: "handshakeIcon",
                        titulo: "Articulación y Financiamiento",
                        descripcion: "Gestionar líneas de crédito, subsidios y programas ante organismos provinciales y nacionales para impulsar proyectos productivos sostenibles."
                    }
                ]
            },
            {
                title: "Dirección de Integración Productiva",
                description: "Promueve la articulación entre sectores para el desarrollo económico local.",
                icon: "dirIntegracionProductiva",
                to: "/gobierno/secretaria-de-produccion/integracion-productiva",
                mision: "Desarrollar en la comunidad las acciones, que en el campo social, educativo y de otra índole, que signifique contribuir al bienestar del habitante a nivel barrial.",
                funciones: [
                    {
                        icono: "factory",
                        titulo: "Agregado de Valor Local",
                        descripcion: "Fomentar la industrialización y el agregado de valor a las materias primas, fortaleciendo la competitividad de la industria maderera, agropecuaria y manufacturera."
                    },
                    {
                        icono: "groups",
                        titulo: "Fomento al Asociativismo",
                        descripcion: "Promover y consolidar la conformación de cooperativas, consorcios y redes productivas para mejorar la escala, los costos y la rentabilidad del sector."
                    },
                    {
                        icono: "trending_up",
                        titulo: "Vinculación Comercial",
                        descripcion: "Organizar rondas de negocios y facilitar estrategias para la inserción de los bienes y servicios producidos en la ciudad dentro de nuevos mercados."
                    },
                    {
                        icono: "lightbulb",
                        titulo: "Innovación Tecnológica",
                        descripcion: "Impulsar la modernización, la transformación digital y la incorporación de tecnologías eficientes en los procesos productivos de las empresas locales."
                    },
                    {
                        icono: "engineering",
                        titulo: "Capacitación Industrial",
                        descripcion: "Articular programas de formación especializada en oficios técnicos para adaptar el perfil laboral de los vecinos a las demandas actuales del sector privado."
                    },
                    {
                        icono: "business_center",
                        titulo: "Articulación Público-Privada",
                        descripcion: "Coordinar acciones conjuntas con cámaras empresariales, el Parque Industrial y entidades gubernamentales para potenciar todo el ecosistema productivo."
                    }
                ]
            },
        ]
    }]

export const EMPLEADO_MUNICIPAL = [
    {
        categoryTitle: "Herramientas",
        id: "herramientas",
        cards: [
            {
                title: "Obtencion de Recibo de Haberes",
                description: "Gestion de los recursos financieros de manera eficiente.",
                icon: "requestQuoteIcon",
                to: "https://www.municipalidad.com/eldo/usuarios/login?redirectMisCuentas=True",
                mision: "",
                funciones: [
                    
                ]
            },
            {
                title: "Estatuto Municipal",
                description: "Asegura la eficiencia y efectividad de los procesos internos.",
                icon: "accountBalanceIcon",
                to: "https://drive.google.com/file/d/1DBXXsnwcnnM2eYRqX6eOjRIxubt5ggfi/view",
                mision: "",
                funciones: [
                    
                ]
            }
        ]
    }];


