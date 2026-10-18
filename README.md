# Inteligencia artificial — guía del curso

Proyecto independiente con los tres capítulos iniciales del curso: introducción y agentes, búsqueda sin información y búsqueda con información. Usa Astro, React, TypeScript y KaTeX. No depende del clon de AIMA Visualizations ni importa sus capítulos.

## Desarrollo

Requiere Node.js 22.12 o superior y npm.

```sh
npm ci
npm run dev -- --port 4322
```

Abrir la dirección local que muestre Astro. La portada está en `/`; las lecciones tienen rutas por capítulo. El fork anterior puede seguir ejecutándose en otro puerto.

```sh
npm run check:types
npm run test:coverage
npm run build
npm run preview -- --port 4322
```

## Estructura

- `src/course/content.ts`: capítulos, lecciones y correspondencias con las lecturas.
- `src/course/algorithms/`: motores puros de búsqueda y agentes.
- `src/components/course/`: ejemplos interactivos.
- `src/layouts/CourseLayout.astro` y `src/styles/course.css`: navegación y presentación.
- `src/pages/`: portada, páginas de temas y referencias.
- `tests/course/`: pruebas de algoritmos e interacciones.

## GitHub Pages

El workflow valida tipos, pruebas y compilación antes de publicar. En GitHub seleccionar **Settings → Pages → Source: GitHub Actions**. No se utiliza una rama `gh-pages` ni Jekyll.

El nombre del propietario y del repositorio se obtienen de `GITHUB_REPOSITORY` durante la compilación en Actions. No hay que escribir el usuario en la configuración. La URL normal es `https://USUARIO.github.io/REPOSITORIO/`.

Para otro alojamiento, se pueden establecer `SITE_URL` (origen) y `BASE_PATH` (ruta base). En desarrollo se utiliza `/`. Un repositorio de usuario `USUARIO.github.io` debe configurar `BASE_PATH=/`.

## Materiales y atribución

Las notas de Rubén Manrique y Daniel González, *Lecturas Introductorias a la Inteligencia Artificial*, versión de trabajo 4 (2026), guían el contenido y sus escenarios. Las adaptaciones educativas de ese material conservan su licencia CC BY-NC 4.0. No se incluyen los PDF originales ni materiales de evaluación.

AIMA, 4.ª edición global, es referencia complementaria. La base del proyecto anterior procede de AIMA Visualizations de Sebastian Urrea (MIT). Véanse `LICENSE`, `NOTICE.md` y la página de referencias para separar las licencias del código y de los contenidos.
