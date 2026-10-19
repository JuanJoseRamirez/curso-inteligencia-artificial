# Revisión de los capítulos 1–3

Revisión local, 19 de octubre de 2026. Sin publicación.

## Fuentes y correspondencias

La estructura sigue *Lecturas Introductorias a la Inteligencia Artificial*, Rubén Manrique y Daniel González, versión de trabajo 4, 2026 (archivo proporcionado: `libro-NOTerminadoVT5.pdf`). Las referencias AIMA corresponden a la cuarta edición global del libro proporcionado, no a la numeración estadounidense.

| Recorrido | Notas | AIMA global |
| --- | --- | --- |
| Enfoques, fundamentos, historia | 1.1–1.3 | 1.1–1.3 |
| Agentes, racionalidad, PEAS, entorno, arquitecturas | 1.4 | 2.1–2.4 |
| Formulación, estados y frontera | 2.1–2.2 | 3.1–3.3 |
| BFS, UCS, DFS, límite, iterativa, bidireccional | 2.3–2.4 | 3.4 |
| Heurísticas, Greedy, A*, propiedades | 3.1–3.4 | 3.5.1–3.5.2 |
| Contornos y A* ponderada | 3.5–3.6 | 3.5.3–3.5.4 |
| Relajaciones, dominancia y comparación | 3.7–3.8 | 3.6; complemento 3.5 |

Se preservan los dos almacenes distintos de las notas (figuras 2.1 y 3.1), y el árbol de profundización iterativa (figura 2.8). Los costos y estimaciones están definidos en `src/course/algorithms/search.ts`. Las preguntas, los contraejemplos y la cadena bidireccional son adaptaciones didácticas, no transcripciones de ejercicios del libro. No se distribuyen los PDF originales.

## Decisiones académicas

- BFS prueba meta al generar; UCS, Greedy, A* y ponderada, al extraer. El caso inicial que ya es meta tiene una instrucción independiente.
- La pila recibe sucesores en el orden indicado y extrae el último. El DLS recursivo recorre los hijos en el orden inverso para coincidir con esa pila. No se mezclan trazas recursivas e iterativas con distinto orden.
- La profundidad máxima permitida se comprueba antes de generar hijos fuera del límite. Una meta exactamente en el límite es válida. El pseudocódigo de las notas §2.3.4 comprueba la meta antes de rechazar profundidad mayor al límite; no se copia esa condición literalmente.
- El corte de DLS exige continuación sin ciclos. Una hoja agotada produce fracaso. La iterativa reinicia la búsqueda y acumula trabajo.
- DFS/DLS/IDDFS detectan ciclos del camino sin una tabla global de alcanzados. La reproducción sí guarda caminos copiados e instantáneas: su memoria no se presenta como la cota de una implementación con enlaces a padres.
- UCS/A* conservan mejores costos, omiten entradas antiguas y permiten reaperturas. Mejorar C en frontera en el almacén B no se presenta como una reapertura ya ocurrida.
- A* distingue admisibilidad, consistencia y condiciones de terminación. Las afirmaciones sobre contornos se enmarcan en heurísticas consistentes. No se promete un ahorro de tiempo o expansiones en todo ejemplo.
- El ejemplo bidireccional usa una cadena de costos unitarios y niveles completos; no generaliza su parada a costos distintos. Generar predecesores no exige una acción física inversa.
- Las relajaciones especifican acciones y unidades. Al permitir diagonales de costo 1, Manhattan y Euclídea dejan de ser admisibles para el desplazamiento usado.
- La simulación de aspiradora explicita que limpiar funciona y las habitaciones no se ensucian de nuevo. El agente no consulta el estado remoto.

## Presentación

Se conserva la lectura vertical con navegación lateral. Cada capítulo tiene resultados de aprendizaje y requisitos previos. Los ejemplos aparecen entre el criterio de decisión y el análisis de garantías; la comprobación final pide una aplicación y mantiene la solución oculta hasta abrirla. No se agregan puntuaciones, cuestionarios extensos ni una segunda navegación horizontal.

Los grafos iniciales tienen descripción textual de corredores. Se incorpora una cuadrícula para comparar distancias, pseudocódigo de agentes y una traza tabulada de búsqueda bidireccional. La tabla interactiva de heurísticas aparece solo en la lección de propiedades. Los controles del buscador permanecen accesibles al desplazarse dentro del ejemplo.

## Verificación y alcance pendiente

Verificados: tipos sin errores, 29 pruebas aprobadas (100 % de cobertura en los dos motores), compilación de las 28 páginas y sus fórmulas, enlaces y recursos internos válidos. Hay pruebas específicas de límites, ciclos, reaperturas, entradas obsoletas y retroceso de una mejora de A*.

El navegador integrado no accedió al servidor local (conexión rechazada y luego tiempo agotado). La revisión visual de las páginas modificadas en escritorio y móvil queda pendiente; la compilación y las pruebas de DOM no sustituyen esa inspección. Esta revisión tampoco equivale a aprobación académica por el profesor.
