# Instrucciones: Revisar borradores de SaetaIA

## Contexto
Los borradores están en `content/noticias/*.json` con `"status": "draft"`.
Solo los que tengan `"status": "published"` aparecen en el sitio.

## Pasos

### 1. Listar borradores
Lee todos los archivos JSON de `content/noticias/` que tengan `status: "draft"`.
Muéstralos en una tabla con: título, categoría, fecha, fuente, resumen (50 chars).

### 2. Para cada borrador, ofrece:
- **[P] Publicar** — cambia `"status": "draft"` a `"status": "published"` y añade `"published_at": "<ISO datetime>"`
- **[R] Rechazar** — cambia `"status": "draft"` a `"status": "rejected"`
- **[V] Ver contenido** — muestra el campo `contenido` completo

### 3. Publicación en lote
Si el usuario dice "publica todos los de Investigación", filtra por `categoria === "Investigación"` y aplica la acción a todos.

### 4. Tras aprobar
Informa de cuántos se han publicado y recuerda:
```
✓ X noticias publicadas.
Para que aparezcan en el sitio:
  git add content/noticias/
  git commit -m "publish: noticias <fecha>"
  git push
```

### 5. Ejecutar ingest
Si el usuario pide "buscar noticias nuevas" o "ejecutar ingest", usa el servidor de desarrollo:
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer <INGEST_SECRET del .env.local>"
```

## Reglas
- No modifiques otros campos del JSON (id, slug, titulo, etc.)
- No publiques entradas con `status: "rejected"` a menos que el usuario lo pida explícitamente
- Si no existe `content/noticias/`, informa que no hay borradores todavía
