# Plan — Módulo de Inteligencia de Reclamos

## Objetivo

Convertir los reclamos ciudadanos en información operativa para priorizar tareas, medir tiempos de respuesta y detectar problemas recurrentes por zona y categoría.

## Fases

1. **Base de medición (iniciada)**
   - Registrar cada cambio de estado y asignación.
   - Exponer métricas de volumen, estados, evolución y categorías.
   - Mostrar un resumen inicial dentro del panel administrativo.
2. **Operación y cumplimiento**
   - SLA por categoría y área.
   - Alertas de reclamos vencidos o sin asignar.
   - Rendimiento por responsable y dependencia.
3. **Análisis geográfico**
   - Mapa de calor por categoría.
   - Detección de calles/barrios con recurrencia.
   - Agrupación de reclamos cercanos.
4. **Inteligencia avanzada**
   - Detección de duplicados.
   - Clasificación y prioridad sugerida con IA.
   - Pronóstico de demanda y reportes ejecutivos.
5. **Transparencia y calidad**
   - Indicadores públicos anonimizados.
   - Encuesta de satisfacción al resolver.
   - Reglas de privacidad, retención y calidad de datos.

## Primer alcance implementado

- Tabla `reclamos_historial` para conservar la trazabilidad.
- Registro automático de creación y modificaciones administrativas.
- Endpoint autenticado `/api/reclamos/analytics`.
- Vista inicial en el panel administrativo con período configurable, volumen diario y ranking de categorías.

## Decisiones de medición

- Los tiempos de resolución se calculan desde el alta hasta la primera transición a `resuelto`.
- La información personal (`nombre`, `email`, `telefono`) no se incluye en las métricas agregadas.
- El período inicial por defecto es de 30 días.

## Próximo paso

Agregar SLA configurable e indicadores de reclamos atrasados, manteniendo el historial como fuente única para medir las etapas del proceso.
