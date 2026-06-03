# Casos de corrupción política · Chile

Sitio estático, sin dependencias, que registra los principales casos de corrupción política en Chile desde el retorno a la democracia. Pensado para desplegarse en GitHub Pages (o cualquier hosting estático: Netlify, Cloudflare Pages, Vercel).

## Stack

- HTML, CSS y JS vanilla. Cero frameworks.
- Datos en `casos.json` — fácil de editar sin tocar código.
- Google Fonts (Fraunces + Inter + JetBrains Mono). Sin trackers, sin analytics.

## Estructura

```
.
├── index.html      # Maquetado
├── styles.css      # Diseño editorial
├── app.js          # Render, filtros, búsqueda
├── casos.json      # Datos (editá acá para agregar/modificar casos)
└── README.md
```

## Cómo correr en local

Como el sitio hace `fetch` a `casos.json`, **no funciona abriendo `index.html` con doble click** (file://). Hay que servir los archivos:

```bash
# Python (viene preinstalado en macOS/Linux)
python3 -m http.server 8000

# o con Node
npx serve
```

Y abrir `http://localhost:8000`.

## Deploy en GitHub Pages

1. Crear repo en GitHub (ej. `casos-corrupcion-chile`).
2. Subir estos archivos al repo:
   ```bash
   git init
   git add .
   git commit -m "init: sitio casos de corrupción"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/casos-corrupcion-chile.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source**: seleccionar `main` y carpeta `/ (root)`.
4. En 1–2 minutos queda en `https://TU_USUARIO.github.io/casos-corrupcion-chile/`.

### Dominio propio (opcional)

Si querés usar un dominio tipo `casos.tudominio.cl`:

1. Crear un archivo `CNAME` en la raíz del repo con el dominio: `casos.tudominio.cl`.
2. En tu DNS, agregar un registro CNAME apuntando a `TU_USUARIO.github.io`.
3. En **Settings → Pages → Custom domain**, ingresar el dominio y activar HTTPS.

## Editar casos

Abrí `casos.json` y agregá un objeto al array. Estructura:

```json
{
  "id": "slug-unico",
  "nombre": "Caso X",
  "anio": 2024,
  "tipo": "Categoría general (financiamiento ilegal, malversación, etc.)",
  "sector": "derecha | centroizquierda | izquierda | transversal | institucional",
  "partidos": ["UDI", "RN"],
  "involucrados": ["Nombre Apellido", "Nombre Apellido"],
  "resumen": "Descripción de 2 a 4 oraciones.",
  "estado": "Estado procesal actual",
  "fuente": "https://url-de-la-fuente"
}
```

Después de editar el JSON, hacer commit y push — GitHub Pages se actualiza solo en ~1 minuto.

## Consideraciones editoriales

- Cada caso indica el **estado procesal** para distinguir entre formalizaciones, condenas, sobreseimientos e investigaciones en curso.
- Los sectores políticos están etiquetados con criterio amplio. Para casos como SQM (financiamiento transversal), el sector es `transversal`.
- Las fuentes citadas son Wikipedia, CIPER, El Mostrador, Infobae y medios establecidos. Conviene auditarlas y reemplazarlas con enlaces a fallos judiciales o reportajes de investigación originales cuando sea posible.
- En causas activas o sensibles, preferir lenguaje cauteloso (“investigado por”, “formalizado por”) y no afirmar culpabilidad si no hay condena firme.

## Licencia

MIT para el código. Los textos editoriales son responsabilidad de quien los publique.
