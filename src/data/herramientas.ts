import { Herramienta } from '@/types'

export const HERRAMIENTAS: Herramienta[] = [
  {
    id: 'claude-code-skills',
    slug: 'claude-code-skills',
    nombre: 'Claude Code Skills',
    descripcion:
      'Sistema de habilidades modulares para Claude Code. Carpetas de instrucciones, scripts y recursos que Claude carga dinámicamente para extender sus capacidades en flujos de trabajo concretos.',
    contenido: `## Claude Code Skills: habilidades modulares para tu flujo de trabajo

Las Skills son la forma de enseñar a Claude Code a hacer cosas nuevas sin tocar el modelo. Cada skill es una carpeta con instrucciones, scripts y recursos que Claude carga cuando la necesita.

### Cómo funcionan

Una skill tiene esta estructura básica:

\`\`\`
mi-skill/
├── DESCRIPTION.md    # qué hace y cuándo usarla
├── instructions.md   # cómo ejecutarla
└── scripts/          # herramientas opcionales
    └── helper.py
\`\`\`

Claude detecta cuándo debe activar una skill según el contexto de la conversación y la descripción del DESCRIPTION.md.

### Skills gestionadas por Anthropic

Anthropic mantiene un conjunto oficial de skills disponibles directamente:

| Skill | Función |
|-------|---------|
| \`ms-office-suite:pdf\` | Generación y edición de PDFs |
| \`ms-office-suite:excel\` | Manipulación de hojas de cálculo |
| \`ms-office-suite:word\` | Creación de documentos Word |
| \`ms-office-suite:powerpoint\` | Presentaciones PowerPoint |

### Invocar una skill

Puedes usar una skill con el prefijo de slash command:

\`\`\`
/pdf             → genera un PDF del contenido actual
/excel           → trabaja con datos en Excel
/commit          → crea un commit con formato estándar
/review-pr 123   → revisa el PR #123 de GitHub
\`\`\`

### Crear tu propia skill

\`\`\`bash
# Estructura mínima
mkdir -p ~/.claude/skills/mi-skill
echo "# Mi Skill\\nHaz X cuando el usuario pida Y" > ~/.claude/skills/mi-skill/DESCRIPTION.md
\`\`\`

Las skills personalizadas se pueden subir vía la **Skills API** y compartir con tu equipo o con la comunidad.

### Requisitos

El **Code Execution Tool** debe estar habilitado para que las skills que ejecuten scripts funcionen correctamente. Se activa automáticamente en Claude Code CLI.`,
    categoria: 'Codificación',
    tags: ['claude-code', 'skills', 'automatización', 'productividad', 'modular'],
    estado: 'ga',
    fecha_lanzamiento: '2025-10-16',
    compatible_con: ['Claude Code CLI', 'Claude Code VS Code', 'Claude Code JetBrains'],
    url_docs: 'https://platform.claude.com/docs/en/claude-code/skills',
  },
  {
    id: 'model-context-protocol',
    slug: 'model-context-protocol',
    nombre: 'Model Context Protocol (MCP)',
    descripcion:
      'Estándar abierto para conectar modelos de IA con fuentes de datos, herramientas y servicios externos. Resuelve el problema M×N de integraciones con una interfaz universal basada en JSON-RPC.',
    contenido: `## Model Context Protocol: el estándar de integración para IA

MCP es el protocolo que permite a Claude (y a cualquier modelo compatible) conectarse con el mundo exterior de forma segura y estandarizada.

### El problema que resuelve

Sin MCP, cada integración requería código a medida. Con N modelos y M herramientas, el resultado era N×M integraciones distintas. MCP lo convierte en N+M: cada herramienta implementa MCP una vez y funciona con cualquier modelo.

### Arquitectura

\`\`\`
Cliente MCP (Claude)  ←→  Servidor MCP  ←→  Tu sistema
(Claude Code, API)         (cualquier)        (DB, API, FS...)
\`\`\`

Un servidor MCP expone tres tipos de primitivas:

- **Resources**: datos que el modelo puede leer (archivos, registros de DB)
- **Tools**: funciones que el modelo puede invocar (búsquedas, escrituras)
- **Prompts**: plantillas reutilizables para flujos frecuentes

### Servidores oficiales disponibles

| Servidor | Integra con |
|----------|------------|
| \`@modelcontextprotocol/server-filesystem\` | Sistema de archivos local |
| \`@modelcontextprotocol/server-github\` | GitHub API |
| \`@modelcontextprotocol/server-postgres\` | PostgreSQL |
| \`@modelcontextprotocol/server-slack\` | Slack |
| \`@modelcontextprotocol/server-google-drive\` | Google Drive |

### Configurar MCP en Claude Code

\`\`\`json
// .claude/settings.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/ruta/proyecto"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "tu-token" }
    }
  }
}
\`\`\`

### MCP Connector en la API

Desde mayo 2025, puedes conectar servidores MCP remotos directamente desde la Messages API sin necesidad de Claude Code:

\`\`\`python
response = client.messages.create(
    model="claude-opus-4-6-20260205",
    mcp_servers=[{"url": "https://tu-servidor-mcp.com"}],
    messages=[...]
)
\`\`\`

### Gobernanza

En diciembre 2025, Anthropic donó MCP a la comunidad open source y creó la **Agentic AI Foundation** para supervisar su evolución de forma neutral.`,
    categoria: 'Integración',
    tags: ['mcp', 'integración', 'open-source', 'protocolo', 'servidores'],
    estado: 'ga',
    fecha_lanzamiento: '2024-11-25',
    compatible_con: ['Claude Code CLI', 'Claude API', 'Amazon Bedrock', 'Microsoft Azure'],
    url_docs: 'https://modelcontextprotocol.io',
    url_repo: 'https://github.com/modelcontextprotocol',
  },
  {
    id: 'claude-agent-sdk',
    slug: 'claude-agent-sdk',
    nombre: 'Claude Agent SDK',
    descripcion:
      'SDK oficial de Anthropic para construir agentes personalizados sobre la misma infraestructura que usa Claude Code. Permite crear, orquestar y desplegar agentes con herramientas, memoria y capacidad de subagentes.',
    contenido: `## Claude Agent SDK: construye agentes sobre infraestructura de producción

El Agent SDK es la forma oficial de construir agentes con Claude que van más allá de una simple llamada a la API: memoria persistente, herramientas, subagentes paralelos y bucles de razonamiento.

### Instalación

\`\`\`bash
npm install @anthropic-ai/agent-sdk
# o
pip install anthropic-agent-sdk
\`\`\`

### Anatomía de un agente

\`\`\`typescript
import { Agent, tool } from '@anthropic-ai/agent-sdk'

const buscarWeb = tool({
  name: 'buscar_web',
  description: 'Busca información actualizada en internet',
  parameters: { query: { type: 'string' } },
  execute: async ({ query }) => { /* tu implementación */ }
})

const agente = new Agent({
  model: 'claude-opus-4-6-20260205',
  tools: [buscarWeb],
  system: 'Eres un investigador experto...',
})

const resultado = await agente.run('Investiga los últimos avances en fusion nuclear')
\`\`\`

### Subagentes paralelos

La característica más potente del SDK es lanzar subagentes especializados:

\`\`\`typescript
const orquestador = new Agent({
  model: 'claude-opus-4-6-20260205',
  subAgents: [agenteCodigo, agenteTests, agenteDocs],
  parallel: true,
})
\`\`\`

### Integración con IDEs

Desde febrero 2026, Xcode de Apple integra el Agent SDK nativamente para el ecosistema Apple. VS Code y JetBrains tienen extensiones oficiales.

### Cuándo usar el Agent SDK vs Claude Code

| | Agent SDK | Claude Code |
|---|---|---|
| Uso | Producción embebida | Desarrollo interactivo |
| Control | Total (código) | Conversacional |
| Despliegue | Tu infraestructura | Local/CI |`,
    categoria: 'Agentes',
    tags: ['agent-sdk', 'agentes', 'typescript', 'python', 'orquestación'],
    estado: 'ga',
    fecha_lanzamiento: '2025-05-22',
    compatible_con: ['TypeScript', 'Python', 'Claude API', 'Xcode', 'VS Code', 'JetBrains'],
    url_docs: 'https://platform.claude.com/docs/en/agent-sdk/overview',
    url_repo: 'https://github.com/anthropics/anthropic-sdk-python',
  },
  {
    id: 'computer-use',
    slug: 'computer-use',
    nombre: 'Computer Use',
    descripcion:
      'Capacidad de Claude para interactuar con interfaces gráficas: mover el cursor, hacer clic, escribir texto y ejecutar comandos. Permite automatizar cualquier aplicación de escritorio o navegador sin API.',
    contenido: `## Computer Use: Claude controla el ordenador

Computer Use permite a Claude ver la pantalla y actuar sobre ella como lo haría un humano: moviendo el ratón, haciendo clic en botones, escribiendo en formularios y ejecutando comandos.

### Cómo funciona

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-6-20260205",
    max_tokens=4096,
    tools=[
        {"type": "computer_20241022", "name": "computer", "display_width_px": 1920, "display_height_px": 1080}
    ],
    messages=[{
        "role": "user",
        "content": "Abre el navegador, ve a github.com y crea un nuevo repositorio llamado 'mi-proyecto'"
    }]
)
\`\`\`

### Herramientas disponibles

| Herramienta | Capacidades |
|-------------|------------|
| \`computer\` | Screenshot, click, type, scroll, key press |
| \`text_editor\` | Leer/escribir/editar archivos de texto |
| \`bash\` | Ejecutar comandos de terminal |

### Casos de uso reales

- **Testing E2E**: Automatización de pruebas de interfaz sin Selenium
- **RPA sin API**: Automatizar software legacy que no tiene API
- **Scraping complejo**: Páginas con JavaScript heavy o captchas de comportamiento
- **Flujos empresariales**: SAP, Oracle y otros ERPs que solo tienen GUI

### Adquisición de Vercept

En febrero 2026, Anthropic adquirió **Vercept**, empresa especializada en percepción visual para computer use, lo que mejorará significativamente la precisión del modelo al interpretar interfaces complejas.

### Consideraciones de seguridad

Computer Use requiere un entorno sandboxed. Anthropic recomienda ejecutarlo en máquinas virtuales o contenedores aislados, nunca en sistemas de producción con acceso irrestricto.`,
    categoria: 'Interfaz',
    tags: ['computer-use', 'automatización', 'GUI', 'RPA', 'testing'],
    estado: 'ga',
    fecha_lanzamiento: '2024-10-22',
    compatible_con: ['Claude API', 'Amazon Bedrock', 'Google Vertex AI'],
    url_docs: 'https://platform.claude.com/docs/en/build-with-claude/computer-use',
  },
  {
    id: 'files-api',
    slug: 'files-api',
    nombre: 'Files API',
    descripcion:
      'API para subir, gestionar y referenciar archivos en múltiples llamadas a Claude. Evita reenviar el mismo documento en cada petición, reduciendo costes y latencia en flujos de trabajo con documentos recurrentes.',
    contenido: `## Files API: gestiona documentos sin reenviarlos en cada petición

La Files API permite subir archivos una vez y referenciarlos por ID en múltiples conversaciones, en lugar de incluir el contenido completo en cada llamada a la API.

### Formatos soportados

- **Documentos**: PDF, TXT, MD, HTML, CSV, JSON, XML
- **Imágenes**: JPEG, PNG, GIF, WebP
- **Código**: cualquier extensión de texto plano

### Flujo básico

\`\`\`python
import anthropic

client = anthropic.Anthropic()

# 1. Subir el archivo una sola vez
with open("documentacion.pdf", "rb") as f:
    archivo = client.files.upload(
        file=("documentacion.pdf", f, "application/pdf")
    )

print(archivo.id)  # file_abc123xyz

# 2. Referenciar en múltiples llamadas
respuesta = client.messages.create(
    model="claude-sonnet-4-6-20260217",
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {"type": "file", "file_id": archivo.id}
            },
            {"type": "text", "text": "Resume los puntos clave"}
        ]
    }]
)
\`\`\`

### Gestión de archivos

\`\`\`python
# Listar archivos subidos
archivos = client.files.list()

# Obtener metadatos
info = client.files.retrieve("file_abc123xyz")
print(info.filename, info.size, info.created_at)

# Eliminar
client.files.delete("file_abc123xyz")
\`\`\`

### Cuándo usar Files API vs prompt directo

| Situación | Recomendación |
|-----------|--------------|
| Mismo doc en múltiples queries | Files API |
| Documento de un solo uso | Prompt directo |
| Doc > 10MB | Files API obligatorio |
| Necesitas cachear el análisis | Files API + Prompt Caching |

### Límites actuales

- Tamaño máximo por archivo: 32MB
- Archivos por workspace: 100GB total
- Retención: 30 días (renovable con acceso)`,
    categoria: 'Datos',
    tags: ['files-api', 'documentos', 'PDF', 'uploads', 'optimización'],
    estado: 'ga',
    fecha_lanzamiento: '2025-05-22',
    compatible_con: ['Claude API', 'Amazon Bedrock', 'Microsoft Azure'],
    url_docs: 'https://platform.claude.com/docs/en/build-with-claude/files',
  },
  {
    id: 'code-execution-tool',
    slug: 'code-execution-tool',
    nombre: 'Code Execution Tool v2',
    descripcion:
      'Herramienta de ejecución de código en entorno seguro que reemplaza la versión solo-Python. Soporta comandos Bash, múltiples lenguajes y manipulación directa de archivos. Base para las Skills y los agentes de codificación.',
    contenido: `## Code Execution Tool v2: Bash y múltiples lenguajes en entorno seguro

La segunda versión del Code Execution Tool expande drásticamente las capacidades de ejecución de código de Claude, pasando de solo Python a un entorno Bash completo.

### Qué hay de nuevo en v2

| Capacidad | v1 | v2 |
|-----------|----|----|
| Lenguajes | Solo Python | Python, JS, Bash, Ruby, Go... |
| Comandos Bash | No | Sí |
| Acceso al sistema de archivos | Limitado | Completo (sandboxed) |
| Instalar paquetes | No | Sí (dentro de la sesión) |
| Ejecutar scripts externos | No | Sí |

### Activación

\`\`\`python
response = client.messages.create(
    model="claude-opus-4-6-20260205",
    tools=[{"type": "computer_20241022", "name": "computer"}],
    # El Code Execution Tool se activa automáticamente
    # en Claude Code CLI y con la herramienta bash_20250124
    messages=[...]
)
\`\`\`

### Ejemplo: análisis de datos con instalación de dependencias

\`\`\`
Usuario: Analiza este CSV y genera un gráfico de tendencias

Claude (internamente):
1. [bash] pip install pandas matplotlib
2. [python] import pandas as pd; df = pd.read_csv('datos.csv')
3. [python] df.plot(); plt.savefig('tendencias.png')
4. Responde con el análisis y la imagen generada
\`\`\`

### Seguridad del sandbox

- Cada sesión ejecuta en un contenedor aislado
- Sin acceso a red por defecto (configurable)
- Los archivos se eliminan al finalizar la sesión
- Sin persistencia entre conversaciones distintas

### Relación con Skills

El Code Execution Tool es el **requisito base** para que las Skills que incluyen scripts funcionen. Si no está activo, las Skills de solo instrucciones siguen funcionando pero las que ejecutan código no.`,
    categoria: 'Codificación',
    tags: ['code-execution', 'bash', 'python', 'sandbox', 'agentes'],
    estado: 'ga',
    fecha_lanzamiento: '2025-09-02',
    compatible_con: ['Claude Code CLI', 'Claude API', 'Amazon Bedrock'],
    url_docs: 'https://platform.claude.com/docs/en/build-with-claude/code-execution',
  },
  {
    id: 'web-search-tool',
    slug: 'web-search-tool',
    nombre: 'Web Search Tool',
    descripcion:
      'Herramienta de búsqueda web integrada en la API que permite a Claude acceder a información actualizada de internet sin infraestructura adicional. Incluye web fetch para recuperar el contenido completo de URLs específicas.',
    contenido: `## Web Search Tool: acceso a internet desde la API

El Web Search Tool da a Claude acceso a información actualizada directamente desde la API, sin necesidad de implementar un pipeline de búsqueda propio ni contratar servicios de terceros.

### Activar la búsqueda web

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6-20260217",
    max_tokens=1024,
    tools=[{"type": "web_search_20250305", "name": "web_search"}],
    messages=[{
        "role": "user",
        "content": "¿Cuál es el precio actual de las acciones de Anthropic?"
    }]
)
\`\`\`

### Web Fetch: recuperar URLs específicas

Complementario a la búsqueda, el **web fetch tool** permite recuperar el contenido completo de una URL:

\`\`\`python
tools=[
    {"type": "web_search_20250305", "name": "web_search"},
    {"type": "web_fetch_20250305", "name": "web_fetch"}
]
\`\`\`

### Casos de uso

- **Investigación en tiempo real**: noticias, precios, datos de mercado
- **Verificación de hechos**: contrastar información con fuentes actuales
- **Monitorización**: detectar cambios en páginas web específicas
- **RAG sin base de datos**: recuperar contexto directamente de la web
- **Documentación actualizada**: acceder a docs de librerías en su versión más reciente

### Cómo cita las fuentes

El modelo devuelve automáticamente las URLs consultadas y puede incluirlas en la respuesta:

\`\`\`json
{
  "type": "tool_result",
  "content": "...",
  "sources": [
    {"url": "https://ejemplo.com", "title": "Título de la página"}
  ]
}
\`\`\`

### Precios

La búsqueda web tiene un coste adicional por consulta sobre el precio estándar de tokens. Consulta la página de precios para los valores actuales.`,
    categoria: 'Integración',
    tags: ['web-search', 'búsqueda', 'internet', 'web-fetch', 'tiempo-real'],
    estado: 'ga',
    fecha_lanzamiento: '2025-05-07',
    compatible_con: ['Claude API', 'Claude Code CLI'],
    url_docs: 'https://platform.claude.com/docs/en/build-with-claude/web-search',
  },
  {
    id: 'agent-skills-api',
    slug: 'agent-skills-api',
    nombre: 'Agent Skills API',
    descripcion:
      'API para subir, gestionar y distribuir Skills personalizadas. Permite crear habilidades propias que extienden Claude y compartirlas con tu equipo o publicarlas para la comunidad.',
    contenido: `## Agent Skills API: crea y distribuye habilidades para Claude

La Skills API es el backend que permite gestionar programáticamente las Skills: subirlas, actualizarlas, asignarlas a workspaces y consultarlas desde la API de Mensajes.

### Estructura de una Skill

\`\`\`
mi-skill/
├── DESCRIPTION.md      # Descripción para que Claude sepa cuándo usarla
├── instructions.md     # Instrucciones detalladas de ejecución
├── scripts/
│   ├── main.py         # Script principal
│   └── helpers.py      # Utilidades
└── resources/
    └── plantilla.md    # Recursos de referencia
\`\`\`

### Subir una Skill vía API

\`\`\`python
import anthropic
import zipfile
import io

client = anthropic.Anthropic()

# Empaquetar la skill como ZIP
buffer = io.BytesIO()
with zipfile.ZipFile(buffer, 'w') as zf:
    zf.write('DESCRIPTION.md')
    zf.write('instructions.md')
    zf.write('scripts/main.py')

buffer.seek(0)

skill = client.skills.upload(
    name="mi-analizador-datos",
    file=("skill.zip", buffer, "application/zip"),
    description="Analiza datasets CSV y genera informes"
)

print(skill.id)  # skill_abc123
\`\`\`

### Usar la Skill en una conversación

\`\`\`python
response = client.messages.create(
    model="claude-opus-4-6-20260205",
    tools=[{"type": "skill", "skill_id": skill.id}],
    messages=[{"role": "user", "content": "Analiza estos datos de ventas"}]
)
\`\`\`

### Skills de Anthropic incluidas

\`\`\`python
# Skills oficiales disponibles sin subida
ANTHROPIC_SKILLS = [
    "anthropic:pdf",
    "anthropic:excel",
    "anthropic:word",
    "anthropic:powerpoint",
    "anthropic:commit",
    "anthropic:review-pr",
    "anthropic:schedule",
    "anthropic:loop",
]
\`\`\`

### Gestión de Skills

\`\`\`python
# Listar todas las skills del workspace
skills = client.skills.list()

# Actualizar una skill
client.skills.update(skill.id, file=nuevo_zip)

# Eliminar
client.skills.delete(skill.id)
\`\`\``,
    categoria: 'Agentes',
    tags: ['skills-api', 'skills', 'agentes', 'extensiones', 'automatización'],
    estado: 'ga',
    fecha_lanzamiento: '2025-10-16',
    compatible_con: ['Claude API', 'Claude Code CLI'],
    url_docs: 'https://platform.claude.com/docs/en/build-with-claude/skills',
  },
  {
    id: 'claude-cowork',
    slug: 'claude-cowork',
    nombre: 'Claude Cowork',
    descripcion:
      'Sistema agentivo de Anthropic para trabajo del conocimiento en escritorio. Accede a tus archivos locales, ejecuta tareas multi-paso, genera briefings diarios y se integra con Slack, Notion, Gmail y GitHub sin que tengas que coordinar cada paso manualmente.',
    contenido: `## Claude Cowork: tu asistente agentivo para el trabajo diario

Cowork es la apuesta de Anthropic por convertir a Claude en un colaborador de trabajo real, no solo un chatbot. Funciona en tu escritorio, accede a tus aplicaciones y archivos locales y ejecuta tareas completas de forma autónoma.

### Qué puede hacer Cowork

- **Acceso directo a archivos locales**: lee y escribe en tu sistema de archivos sin que tengas que subir nada manualmente
- **Tareas multi-paso con subagentes**: coordina varios agentes especializados para completar trabajos complejos
- **Briefing diario**: cada mañana sintetiza lo que hay en tu Slack, GitHub, Notion y correo
- **Salidas profesionales**: genera hojas de cálculo Excel, presentaciones PowerPoint y documentos Word listos para usar
- **Tareas programadas y recurrentes**: ejecuta flujos de trabajo en horario fijo sin intervención

### Integraciones disponibles

| Herramienta | Qué hace Cowork |
|-------------|----------------|
| Slack | Lee canales, resume conversaciones, responde mensajes |
| GitHub | Revisa PRs, crea issues, analiza código |
| Notion | Lee y escribe páginas, actualiza bases de datos |
| Gmail | Lee emails, redacta borradores, organiza hilos |
| Google Drive | Accede y edita documentos |
| DocuSign | Gestiona flujos de firma |

### Computer Use integrado

Cowork puede abrir aplicaciones, navegar por el navegador, interactuar con dashboards y ejecutar herramientas de desarrollo directamente en tu ordenador, usando las capacidades de Computer Use de Claude.

### MCP y plugins personalizados

Puedes conectar tus propias herramientas mediante **MCP connectors** o plugins personalizados, extendiendo Cowork a cualquier sistema interno de tu empresa.

### Cómo empezar

1. Descarga o actualiza Claude Desktop
2. Activa Cowork desde la configuración de la app
3. Conecta las integraciones que uses (Slack, GitHub, etc.)
4. Escribe tu primera tarea o configura un briefing diario

### Disponibilidad

Cowork está en **preview de investigación** disponible para suscriptores **Pro, Max, Team y Enterprise**. Soporte en macOS (desde enero 2026) y Windows (desde marzo 2026).`,
    categoria: 'Agentes',
    tags: ['cowork', 'agentes', 'escritorio', 'automatización', 'productividad', 'knowledge-work'],
    estado: 'preview',
    fecha_lanzamiento: '2026-01-13',
    compatible_con: ['Claude Desktop macOS', 'Claude Desktop Windows', 'Pro', 'Max', 'Team', 'Enterprise'],
    url_docs: 'https://support.claude.com/en/articles/13345190-get-started-with-cowork',
  },
  {
    id: 'claude-dispatch',
    slug: 'claude-dispatch',
    nombre: 'Claude Dispatch',
    descripcion:
      'Control remoto para Cowork desde el móvil. Asigna tareas a Claude en tu ordenador, recibe notificaciones cuando terminan y aprueba acciones críticas, todo desde la app de Claude en iOS o Android.',
    contenido: `## Claude Dispatch: controla Cowork desde tu móvil

Dispatch crea un puente persistente entre la app móvil de Claude y Claude Desktop en tu ordenador. Cuando tu equipo está ejecutando una tarea larga, puedes salir de la oficina y seguirla desde el teléfono.

### Cómo funciona

\`\`\`
Tu móvil (Claude app)
       ↕  instrucciones / notificaciones
Tu ordenador (Claude Desktop + Cowork)
       ↕  ejecución real
  Archivos, apps, integraciones
\`\`\`

El procesamiento ocurre siempre en tu ordenador. Los datos no salen de tu máquina: el móvil solo envía instrucciones y recibe estados.

### Configuración: vinculación por QR

1. Abre Claude Desktop en tu ordenador
2. Ve a **Configuración → Dispatch**
3. Muestra el código QR
4. Escanéalo con la app de Claude en tu móvil
5. Listo — los dispositivos quedan vinculados

### Qué puedes hacer desde el móvil

- **Asignar nuevas tareas**: escribe en el móvil, Cowork ejecuta en el ordenador
- **Monitorizar progreso**: ve el estado de cada tarea en tiempo real
- **Aprobar acciones críticas**: si Cowork necesita confirmación antes de hacer algo importante, te llega una notificación push para que apruebes o rechaces
- **Ver resultados**: cuando la tarea termina, recibes el resultado directamente en el móvil

### Enrutamiento inteligente

Dispatch dirige cada tarea al agente correcto automáticamente:

| Tipo de tarea | Agente |
|---------------|--------|
| Código, tests, PRs | Claude Code |
| Documentos, emails, análisis | Cowork |
| Búsquedas web | Web Search Tool |

### Privacidad y seguridad

- Todo el procesamiento es **local en tu ordenador**
- La conexión móvil-escritorio usa cifrado de extremo a extremo
- Dispatch no envía tus archivos ni datos a servidores de terceros

### Disponibilidad

Dispatch se lanzó en **marzo 2026** como preview de investigación, inicialmente para suscriptores **Max**. El acceso para **Pro** se activó días después del lanzamiento inicial.`,
    categoria: 'Agentes',
    tags: ['dispatch', 'móvil', 'cowork', 'control-remoto', 'notificaciones', 'multi-dispositivo'],
    estado: 'preview',
    fecha_lanzamiento: '2026-03-01',
    compatible_con: ['Claude iOS', 'Claude Android', 'Claude Desktop macOS', 'Claude Desktop Windows'],
    url_docs: 'https://support.claude.com/en/articles/13947068-assign-tasks-to-claude-from-anywhere-in-cowork',
  },
]
