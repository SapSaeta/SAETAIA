import { Noticia } from '@/types'

export const NOTICIAS: Noticia[] = [
  {
    id: 'economic-index-march-2026',
    slug: 'economic-index-march-2026',
    fecha: '2026-03-24',
    titulo: 'Anthropic Economic Index: Learning curves',
    resumen:
      'Quinto informe del Economic Index de Anthropic que estudia el uso de Claude en febrero de 2026. Analiza cómo las curvas de aprendizaje en el uso de IA están cambiando la productividad en distintas industrias, con nuevas métricas sobre la adopción y el impacto económico de Claude a escala.',
    contenido: `## Anthropic Economic Index: Informe de marzo 2026

El quinto informe del Economic Index de Anthropic analiza el uso real de Claude durante febrero de 2026, basándose en el marco de **primitivas económicas** desarrollado por el equipo de investigación.

### Curvas de aprendizaje en IA

El informe introduce el concepto de curvas de aprendizaje aplicado al uso de modelos de lenguaje:

- Los usuarios que llevan más tiempo usando Claude extraen significativamente más valor por sesión
- La productividad mejora de forma no lineal: los primeros 30 días son críticos
- Las organizaciones con programas de formación interna muestran adopción 3x más rápida

### Sectores con mayor impacto medido

| Sector | Incremento de productividad |
|--------|----------------------------|
| Desarrollo de software | +38% en tareas de codificación |
| Servicios legales | +29% en revisión de documentos |
| Marketing y contenidos | +44% en generación de borradores |
| Análisis financiero | +31% en síntesis de informes |

### Métricas de adopción

El informe destaca que el número de **casos de uso únicos** por organización sigue creciendo mes a mes, lo que sugiere que las empresas no están simplemente automatizando tareas existentes, sino descubriendo nuevas aplicaciones.

### Metodología

El Economic Index utiliza datos anonimizados y agregados de uso de la API, complementados con encuestas a usuarios empresariales. La metodología completa está disponible en el informe técnico adjunto.`,
    categoria: 'Investigación',
    tags: ['economic-index', 'productividad', 'métricas', 'investigación', 'adopción'],
    url_referencia: 'https://www.anthropic.com/research/economic-index-march-2026-report',
  },
  {
    id: 'anthropic-science-blog',
    slug: 'anthropic-science-blog',
    fecha: '2026-03-23',
    titulo: 'Introducing the Anthropic Science Blog',
    resumen:
      'Anthropic lanza su blog científico dedicado a investigación en IA y ciencia, colaboraciones y flujos de trabajo científicos prácticos. El blog cubre computación científica de larga duración con Claude Code, física teórica asistida por IA y la intersección entre inteligencia artificial y descubrimiento científico.',
    contenido: `## Anthropic Science Blog: IA al servicio de la ciencia

Anthropic lanza un espacio dedicado exclusivamente a la intersección entre inteligencia artificial y ciencia, con el objetivo de documentar cómo Claude está siendo usado en investigación de frontera.

### ¿Por qué un blog científico?

El blog nace de una necesidad real: los científicos que trabajan con Claude están descubriendo capacidades y limitaciones que no están documentadas en ningún otro lugar. El Science Blog busca:

- Publicar casos de uso reales de investigadores activos
- Compartir flujos de trabajo científicos reproducibles
- Documentar los límites actuales de la IA en investigación

### Áreas de cobertura

**Computación científica con Claude Code**
Workflows para simulaciones largas, análisis de datos experimentales y generación de código científico verificable.

**Física teórica**
Exploraciones sobre cómo Claude puede asistir en derivaciones matemáticas, revisión de pruebas y exploración de nuevas hipótesis.

**Biología y química**
Análisis de literatura científica, diseño de experimentos y síntesis de resultados de ensayos clínicos.

### Compromiso con la reproducibilidad

Todos los artículos del Science Blog incluirán los prompts utilizados, los modelos específicos y las limitaciones observadas, siguiendo los estándares de reproducibilidad científica.`,
    categoria: 'Investigación',
    tags: ['ciencia', 'blog', 'investigación', 'claude-code', 'física'],
    url_referencia: 'https://www.anthropic.com/research/introducing-anthropic-science',
  },
  {
    id: 'vibe-physics-ai-grad-student',
    slug: 'vibe-physics-ai-grad-student',
    fecha: '2026-03-23',
    titulo: 'Vibe physics: The AI grad student',
    resumen:
      'Investigación que demuestra cómo Claude puede supervisar cálculos de investigación en física teórica de principio a fin, funcionando como un asistente de posgrado virtual. El estudio explora las capacidades de Claude para razonar sobre matemáticas avanzadas, verificar derivaciones y proponer nuevas vías de investigación.',
    contenido: `## Vibe Physics: Claude como asistente de posgrado en física teórica

Una nueva publicación del Anthropic Science Blog documenta un experimento ambicioso: usar Claude para supervisar cálculos de física teórica de forma autónoma, desde el planteamiento del problema hasta la verificación de los resultados.

### El experimento

El equipo de investigación diseñó una serie de problemas de física teórica de dificultad creciente:

1. **Nivel básico**: Derivaciones estándar de mecánica cuántica
2. **Nivel intermedio**: Cálculos de teoría de campos
3. **Nivel avanzado**: Problemas abiertos en física de partículas

Claude fue instruido para trabajar como un estudiante de doctorado: planteando hipótesis, realizando cálculos paso a paso y verificando sus propios resultados.

### Resultados destacados

- Claude completó el **94% de las derivaciones de nivel básico** sin errores
- En nivel intermedio, identificó correctamente sus propios errores en el **78% de los casos**
- Para problemas avanzados, propuso **3 vías de investigación novedosas** que los revisores consideraron prometedoras

### Limitaciones identificadas

El estudio también documenta dónde falla Claude:
- Errores sistemáticos en ciertos tipos de integrales complejas
- Tendencia a sobre-simplificar en problemas con múltiples casos límite
- Dificultad para mantener la coherencia en derivaciones de más de 50 pasos

### Implicaciones

Este trabajo sugiere que la IA ya puede actuar como colaborador en investigación científica, aunque requiere supervisión humana experta para validar los resultados más avanzados.`,
    categoria: 'Investigación',
    tags: ['física', 'ciencia', 'agentes', 'matemáticas', 'investigación'],
    url_referencia: 'https://www.anthropic.com/research/vibe-physics',
  },
  {
    id: 'api-models-capability-fields',
    slug: 'api-models-capability-fields',
    fecha: '2026-03-18',
    titulo: 'Models API: nuevos campos de capacidades del modelo',
    resumen:
      'Los endpoints GET /v1/models y GET /v1/models/{model_id} ahora devuelven max_input_tokens, max_tokens y un objeto capabilities que permite descubrir qué soporta cada modelo de forma programática. Esta mejora facilita la selección dinámica de modelos según sus capacidades en aplicaciones agentivas.',
    contenido: `## Models API: descubrimiento de capacidades en tiempo real

Anthropic ha añadido campos de capacidad del modelo a la API de Modelos, permitiendo a los desarrolladores consultar programáticamente qué soporta cada modelo antes de usarlo.

### Nuevos campos disponibles

Los endpoints \`GET /v1/models\` y \`GET /v1/models/{model_id}\` ahora incluyen:

\`\`\`json
{
  "id": "claude-opus-4-6-20260205",
  "max_input_tokens": 1000000,
  "max_tokens": 32000,
  "capabilities": {
    "vision": true,
    "tool_use": true,
    "extended_thinking": true,
    "computer_use": true,
    "prompt_caching": true
  }
}
\`\`\`

### Caso de uso: selección dinámica de modelos

Antes de este cambio, los desarrolladores tenían que mantener tablas de capacidades hardcodeadas que se quedaban desactualizadas. Ahora es posible consultar en tiempo real:

\`\`\`python
import anthropic

client = anthropic.Anthropic()
models = client.models.list()

# Filtrar modelos que soporten extended thinking
thinking_models = [
    m for m in models.data
    if m.capabilities.get("extended_thinking")
]
\`\`\`

### Por qué importa para aplicaciones agentivas

En sistemas multi-agente donde diferentes tareas requieren diferentes capacidades, esta API permite routing inteligente: enviar tareas visuales a modelos con vision, tareas complejas a modelos con extended thinking, etc., sin hardcodear la lógica.

### Disponibilidad

El cambio está disponible desde el 18 de marzo de 2026 en todos los planes de la Claude API.`,
    categoria: 'API',
    tags: ['api', 'models-api', 'capabilities', 'developer', 'agentes'],
    url_referencia: 'https://platform.claude.com/docs/en/release-notes/overview',
  },
  {
    id: '81k-interviews-study',
    slug: '81k-interviews-study',
    fecha: '2026-03-18',
    titulo: 'What 81,000 people want from AI',
    resumen:
      'Anthropic publica los resultados del mayor estudio cualitativo multilingüe de su tipo, con participación de casi 81.000 personas de todo el mundo. El estudio explora las expectativas, necesidades y preocupaciones de usuarios de diversas culturas respecto a la IA, buscando informar el desarrollo responsable de Claude y la política pública.',
    contenido: `## 81.000 personas, 60 países, una pregunta: ¿qué quieren de la IA?

Anthropic publica el mayor estudio cualitativo multilingüe sobre expectativas y preocupaciones de usuarios respecto a la inteligencia artificial. El estudio, realizado a lo largo de 8 meses, recoge respuestas de 80.987 participantes en más de 60 países.

### Metodología

A diferencia de las encuestas tradicionales con opciones cerradas, este estudio utilizó **entrevistas abiertas** mediadas por IA:

- Cada participante respondió a preguntas abiertas sobre sus expectativas
- Las respuestas fueron analizadas con técnicas de NLP multilingüe
- Los temas emergentes se validaron con revisores humanos en cada región

### Hallazgos principales

**Lo que más valoran los usuarios**
- Honestidad sobre limitaciones (citado por el 73% de participantes)
- Capacidad de explicar el razonamiento
- Respeto por la autonomía en la toma de decisiones

**Las principales preocupaciones**
- Privacidad de los datos personales compartidos
- Dependencia excesiva en decisiones importantes
- Falta de transparencia sobre cómo funciona el modelo

**Diferencias culturales significativas**
- En Asia Oriental, la utilidad práctica es prioritaria sobre la explicabilidad
- En Europa, la privacidad supera a todas las demás preocupaciones
- En América Latina, el acceso equitativo es la demanda más frecuente

### Impacto en el desarrollo de Claude

Anthropic indica que estos hallazgos informarán directamente futuras actualizaciones de la constitución de Claude y las políticas de uso, especialmente en lo relativo a transparencia y comunicación de incertidumbre.`,
    categoria: 'Investigación',
    tags: ['investigación', 'usuarios', 'encuesta', 'política-pública', 'ética'],
    url_referencia: 'https://www.anthropic.com/81k-interviews',
  },
  {
    id: 'extended-thinking-display-field',
    slug: 'extended-thinking-display-field',
    fecha: '2026-03-16',
    titulo: 'Extended thinking: nuevo campo display para omitir el pensamiento',
    resumen:
      'Se lanza el campo display para el extended thinking, permitiendo omitir el contenido del pensamiento en las respuestas para un streaming más rápido. Con thinking.display: "omitted", las respuestas incluyen bloques de pensamiento vacíos pero con la firma signature preservada para continuidad en conversaciones multi-turno.',
    contenido: `## Extended Thinking: campo display para control del streaming

Anthropic añade el campo \`display\` al bloque de configuración de extended thinking, dando a los desarrolladores control granular sobre qué partes del proceso de razonamiento se transmiten al cliente.

### El problema que resuelve

Hasta ahora, activar extended thinking significaba recibir todo el contenido del proceso de razonamiento en el stream, lo que podía añadir cientos de tokens adicionales de latencia percibida antes de la respuesta final. Para aplicaciones donde el pensamiento interno no necesita mostrarse al usuario, esto era ineficiente.

### Cómo funciona

\`\`\`python
response = client.messages.create(
    model="claude-opus-4-6-20260205",
    thinking={
        "type": "adaptive",
        "display": "omitted"  # Nuevo campo
    },
    messages=[{"role": "user", "content": "Resuelve este problema..."}]
)

# El bloque de pensamiento llegará con 'thinking' vacío
# pero con 'signature' preservado
\`\`\`

### Estructura de la respuesta con display: "omitted"

\`\`\`json
{
  "type": "thinking",
  "thinking": "",
  "signature": "ErUB...Q=="
}
\`\`\`

La firma (\`signature\`) se preserva para garantizar la **continuidad en conversaciones multi-turno**: Claude puede retomar el hilo de razonamiento aunque el cliente no haya recibido el contenido del pensamiento.

### Facturación

Los tokens de pensamiento siguen facturándose de la misma forma independientemente del valor de \`display\`. El campo solo controla qué se transmite al cliente, no qué procesa el modelo.

### Disponibilidad

Disponible desde el 16 de marzo de 2026 para todos los modelos que soportan extended thinking.`,
    categoria: 'API',
    tags: ['extended-thinking', 'api', 'streaming', 'rendimiento', 'developer'],
    url_referencia: 'https://platform.claude.com/docs/en/release-notes/overview',
  },
  {
    id: '1m-context-window-ga',
    slug: '1m-context-window-ga',
    fecha: '2026-03-13',
    titulo: 'Ventana de contexto de 1M tokens en disponibilidad general',
    resumen:
      'La ventana de contexto de 1 millón de tokens pasa a disponibilidad general para Claude Opus 4.6 y Sonnet 4.6 a precios estándar, sin necesidad de cabecera beta. Las solicitudes de más de 200K tokens funcionan automáticamente. El límite de medios sube de 100 a 600 imágenes o páginas PDF por solicitud.',
    contenido: `## 1 millón de tokens: disponibilidad general para Opus 4.6 y Sonnet 4.6

Anthropic elimina la barrera beta para la ventana de contexto de 1 millón de tokens, pasando a disponibilidad general para Claude Opus 4.6 y Claude Sonnet 4.6 sin coste adicional ni configuración especial.

### ¿Qué cambia para los desarrolladores?

**Antes (beta)**
- Requería añadir cabecera \`anthropic-beta: interleaved-thinking-2025-05-14\`
- Acceso limitado y sujeto a cambios
- Precios premium para contextos largos

**Ahora (GA)**
- Sin cabeceras adicionales necesarias
- Solicitudes >200K tokens activadas automáticamente
- Precios estándar de entrada/salida

### Nuevo límite de medios

Con la ventana de 1M tokens activa, el límite de imágenes y páginas PDF por solicitud aumenta de 100 a **600 elementos**:

| Tipo de medio | Límite anterior | Límite nuevo |
|---------------|----------------|--------------|
| Imágenes | 100 | 600 |
| Páginas PDF | 100 | 600 |
| Documentos de texto | Sin cambios | Sin cambios |

### Casos de uso que se desbloquean

- **Repositorios de código completos**: Analizar bases de código de millones de líneas en una sola consulta
- **Libros y documentación extensa**: Procesar libros técnicos completos con sus ilustraciones
- **Auditorías legales**: Revisar contratos y documentación regulatoria de proyectos grandes
- **Análisis médico**: Historiales clínicos completos con imágenes diagnósticas

### Precios de contexto largo

Las solicitudes que superen los 200K tokens de entrada seguirán aplicando los precios de contexto largo establecidos. Consulta la página de precios para los valores actuales por modelo.`,
    categoria: 'API',
    tags: ['contexto-largo', '1M-tokens', 'opus-4-6', 'sonnet-4-6', 'GA'],
    url_referencia: 'https://platform.claude.com/docs/en/release-notes/overview',
  },
]
