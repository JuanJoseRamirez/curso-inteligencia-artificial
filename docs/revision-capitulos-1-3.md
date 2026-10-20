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

## Ajuste editorial — 20 de octubre de 2026

El usuario solicita presentar el contenido con una exposición cercana a las notas, conservando el diseño. Este ajuste sustituye el enfoque de guía dirigida descrito arriba:

- Se mantiene la secuencia de los tres capítulos y los ejemplos vinculados con sus definiciones y algoritmos.
- Se reescriben introducciones y títulos con una exposición directa de conceptos, propiedades y condiciones de aplicación.
- Se eliminan las conclusiones obligatorias y las preguntas repetidas en las 23 páginas. Se conservan nueve ejercicios seleccionados, con solución desplegable: PEAS, entornos, arquitecturas, formulación, UCS, profundización iterativa, A*, propiedades y diseño de heurísticas.
- Los resultados concretos de BFS y DFS se incorporan a la exposición del ejemplo, en lugar de depender de un cierre de estudio.
- La portada y los índices se presentan como contenido del curso; se eliminan las instrucciones generales de estudio y los bloques de objetivos por capítulo.
- Se conservan los supuestos de corrección, las referencias, KaTeX y las simulaciones paso a paso. No se realiza publicación como parte de este ajuste.

## Revisión de pseudocódigos — 20 de octubre de 2026

Contraste con notas §1.4.5, listings 2.1–2.5, §2.3.6, listing 3.1 y §3.3–3.6; AIMA global, figuras 2.8 (p. 67), 3.7 (p. 91), 3.9 (p. 95), 3.12 (p. 99), 3.14 (p. 101) y §3.5.

Se explicitan firmas, raíz, estructuras, selección, bucles y retornos. UCS/A* actualizan `mejor[hijo.estado]` y permiten mejoras posteriores a una expansión. La iterativa aparece como una función que llama a la limitada; la limitada distingue claramente el corte, las hojas agotadas y el final de la búsqueda. El estado del modelo del agente es persistente y cada llamada devuelve una única acción.

La bidireccional se desarrolla como una variante por niveles para costos unitarios. Recibe sucesores y predecesores, registra distancias y enlaces y reconstruye una secuencia en el sentido original sin duplicar el encuentro. No se presenta como una transcripción del mejor primero bidireccional de AIMA para costos generales.

Adaptaciones deliberadas: la limitada impide generar descendientes fuera del límite, en lugar de copiar literalmente la comprobación posterior a la meta de las fuentes; Greedy conserva la primera llegada por estado con heurística fija, conforme al efecto del listing 3.1 de las notas; el agente con modelo supone limpieza determinista y ausencia de nueva suciedad. Los caminos se muestran como secuencias de estados: `[inicial]` equivale a cero acciones cuando el inicio es meta. Las pruebas del motor no constituyen por sí solas una demostración formal del pseudocódigo.

Verificación adicional: 32 pruebas del proyecto aprobadas, con renderizado KaTeX de todos los pseudocódigos. Una transcripción ejecutable independiente del diseño bidireccional se contrastó con BFS en los 4.096 grafos dirigidos sin lazos de cuatro estados y todos sus pares inicio/meta (65.536 casos), verificando existencia, longitud mínima y sentido de cada transición. Esta comprobación de casos pequeños complementa la revisión del diseño; no es una prueba formal general ni una simulación bidireccional incorporada a la interfaz.
