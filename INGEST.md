# Pipeline de ingesta — SaetaIA

Sistema de ingesta diaria automática de noticias de Anthropic y GitHub.

---

## Arquitectura

```
Fuentes oficiales
  ├── anthropic.com/news        (sitemap → JSON-LD)
  ├── anthropic.com/research    (sitemap → JSON-LD)
  ├── github: anthropic-sdk-python  (GitHub Releases API)
  └── github: claude-code           (GitHub Releases API)
         ↓
  src/lib/ingest/runner.ts      ← orquestador
    ├── sources/*.ts            ← fetch + parse por fuente
    ├── normalizer.ts           ← RawItem → ContentEntry (slug, categoría, tags)
    ├── dedup.ts                ← deduplica por URL / slug / similitud de título
    └── store.ts                ← persiste como draft en content/noticias/
         ↓
  content/noticias/{slug}.json  ← fuente de verdad
  (status: "draft" | "published")
         ↓
  lib/noticias.ts               ← fusiona content/ + src/data/noticias.ts
         ↓
  Build estático de Next.js     ← solo entradas "published" son visibles
```

---

## Flujo editorial

```
1. Ingest detecta artículos nuevos → guarda como "draft"
2. Tú revisas content/noticias/*.json en VSCode
3. Cambias "status": "draft"  →  "status": "published"
4. git add content/noticias/  &&  git commit  &&  git push
5. Vercel redeploy automático → artículo visible en web
```

---

## Ejecución manual (local)

### Prerrequisitos

```bash
cp .env.example .env.local
# Edita .env.local y define INGEST_SECRET
```

### Opción A — via API route (recomendada)

```bash
# Con el servidor de desarrollo corriendo (npm run dev):
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer <tu-INGEST_SECRET>"
```

Respuesta de ejemplo:
```json
{
  "run_id": "550e8400-...",
  "started_at": "2026-03-28T07:00:00.000Z",
  "finished_at": "2026-03-28T07:00:45.312Z",
  "sources": {
    "anthropic-news":     { "fetched": 8, "new_draft": 2, "duplicate": 6 },
    "anthropic-research": { "fetched": 3, "new_draft": 1, "duplicate": 2 },
    "github-sdk-python":  { "fetched": 2, "new_draft": 0, "duplicate": 2 },
    "github-claude-code": { "fetched": 1, "new_draft": 1, "duplicate": 0 }
  },
  "total_new": 4,
  "total_errors": 0
}
```

### Ver borradores generados

```bash
ls content/noticias/
cat content/noticias/2026-03-claude-code-release.json
```

### Publicar un borrador

Edita el archivo JSON y cambia:
```json
{
  "status": "published"
}
```

O usa el endpoint (requiere implementación futura de `/api/publish`).

---

## Ejecución programada en Vercel

El archivo `vercel.json` configura un cron job diario a las 07:00 UTC:

```json
{
  "crons": [
    { "path": "/api/ingest", "schedule": "0 7 * * *" }
  ]
}
```

Vercel autentica el cron automáticamente con `CRON_SECRET` (lo inyecta él mismo).

### Requisitos adicionales para Vercel

Para que el pipeline pueda guardar artículos en Vercel (donde el filesystem es read-only),
necesita usar la **GitHub API** para commitear los archivos al repo:

1. Crea un **Personal Access Token** en GitHub:
   - `https://github.com/settings/tokens`
   - Permiso: `repo > contents` (read & write)

2. Añade en el dashboard de Vercel (Settings → Environment Variables):
   ```
   GITHUB_TOKEN   = ghp_xxxxxxxxxxxx
   GITHUB_REPO    = tu-usuario/saeta-ia
   GITHUB_BRANCH  = main
   CRON_SECRET    = (Vercel lo genera automáticamente)
   ```

3. Flujo en producción:
   ```
   Vercel Cron → GET /api/ingest → fetch fuentes → GitHub API crea content/noticias/*.json
   → Vercel detecta commit → redeploy → artículo visible (si status=published)
   ```

> **Fase 1** (recomendada): ejecuta el ingest localmente, revisa los drafts y haz push tú.
> **Fase 2**: configura GitHub Token en Vercel para ingesta completamente automática.

---

## Ampliar con nuevas fuentes

1. Crea `src/lib/sources/openai-news.ts` siguiendo la interfaz `Source`:

```typescript
import type { Source } from './types'

export const openaiNewsSource: Source = {
  id: 'openai-news',         // añadir también a SourceId en src/types/ingest.ts
  name: 'OpenAI News',
  baseUrl: 'https://openai.com',
  async fetch() {
    // tu lógica
  }
}
```

2. Registra en `src/lib/sources/index.ts`:

```typescript
import { openaiNewsSource } from './openai-news'
export const ALL_SOURCES: Source[] = [
  anthropicNewsSource,
  anthropicResearchSource,
  ...githubSources,
  openaiNewsSource,   // ← añadir aquí
]
```

3. Añade el nuevo `SourceId` en `src/types/ingest.ts`:

```typescript
export type SourceId =
  | 'anthropic-news'
  | 'anthropic-research'
  | 'github-sdk-python'
  | 'github-claude-code'
  | 'openai-news'    // ← nuevo
```

Fuentes candidatas para fase 2:
- `openai-news` — openai.com/news (sitemap similar a Anthropic)
- `deepmind-research` — deepmind.google/research/publications
- `meta-ai` — ai.meta.com/blog
- `mistral-news` — mistral.ai/news
- `github-openai-*` — GitHub Releases de SDKs de OpenAI

---

## Deduplicación

Tres niveles:
1. **URL exacta** — mismo artículo visto antes
2. **Slug exacto** — título muy similar ya normalizado
3. **Similitud de título** — Jaccard ≥ 0.65 sobre palabras ≥ 4 chars

El umbral se puede ajustar en `src/lib/ingest/dedup.ts`:
```typescript
const SIMILARITY_THRESHOLD = 0.65
```

---

## Archivos del sistema

| Archivo | Rol |
|---------|-----|
| `src/types/ingest.ts` | Tipos: ContentEntry, RawItem, RunLog, SourceId |
| `src/lib/sources/types.ts` | Interfaz Source |
| `src/lib/sources/utils.ts` | Helpers: parseSitemap, extractJsonLd, extractMeta |
| `src/lib/sources/anthropic-news.ts` | Fuente: noticias de Anthropic |
| `src/lib/sources/anthropic-research.ts` | Fuente: investigación de Anthropic |
| `src/lib/sources/github-releases.ts` | Fuente: GitHub Releases API |
| `src/lib/sources/index.ts` | Registro de todas las fuentes |
| `src/lib/ingest/normalizer.ts` | RawItem → ContentEntry (categoría, slug, tags) |
| `src/lib/ingest/dedup.ts` | Detección de duplicados |
| `src/lib/ingest/store.ts` | Persistencia (local FS / GitHub API) |
| `src/lib/ingest/runner.ts` | Orquestador del pipeline |
| `src/lib/ingest/index.ts` | Re-exports |
| `src/app/api/ingest/route.ts` | Endpoint HTTP |
| `src/lib/noticias.ts` | Ahora fusiona content/ + data/ |
| `content/noticias/` | Fuente de verdad (JSON por artículo) |
| `vercel.json` | Cron job diario 07:00 UTC |
| `.env.example` | Variables requeridas |
