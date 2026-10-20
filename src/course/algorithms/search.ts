/** Pure, finite-graph search traces. UI playback never mutates search state. */
export type Algorithm = 'bfs' | 'ucs' | 'dfs' | 'dls' | 'iddfs' | 'greedy' | 'astar' | 'weighted';
export interface Edge { readonly to: string; readonly cost: number }
export interface Scenario {
  readonly id: string; readonly title: string; readonly start: string; readonly goal: string;
  readonly graph: Readonly<Record<string, readonly Edge[]>>;
  readonly positions: Readonly<Record<string, readonly [number, number]>>;
  readonly h: Readonly<Record<string, number>>;
}
export interface SearchNode { readonly state: string; readonly path: readonly string[]; readonly g: number; readonly depth: number }
export interface SearchStep {
  readonly line: string; readonly message: string; readonly current: SearchNode | null;
  readonly frontier: readonly SearchNode[]; readonly expanded: readonly string[];
  readonly reached: readonly string[]; readonly solution: SearchNode | null;
  readonly status: 'running' | 'success' | 'failure' | 'cutoff';
  readonly limit: number | null; readonly expansions: number; readonly generated: number;
}
export interface CodeLine { readonly id: string; readonly text: string }
export const algorithmNames: Record<Algorithm, string> = {
  bfs: 'BFS', ucs: 'UCS', dfs: 'DFS', dls: 'Búsqueda limitada', iddfs: 'Profundización iterativa',
  greedy: 'Greedy', astar: 'A*', weighted: 'A* ponderada',
};

export const warehouseA: Scenario = {
  id: 'almacen-a', title: 'Red de distribución del almacén', start: 'O', goal: 'M',
  graph: { O: [{ to: 'A', cost: 1 }, { to: 'B', cost: 5 }], A: [{ to: 'C', cost: 1 }, { to: 'D', cost: 10 }], B: [{ to: 'M', cost: 1 }], C: [{ to: 'M', cost: 1 }], D: [{ to: 'M', cost: 2 }], M: [] },
  positions: { O: [48, 145], A: [172, 62], B: [172, 240], C: [300, 62], D: [300, 180], M: [440, 145] }, h: {},
};
export const warehouseB: Scenario = {
  id: 'almacen-b', title: 'Red de corredores con estimaciones', start: 'O', goal: 'M',
  graph: { O: [{ to: 'A', cost: 3 }, { to: 'B', cost: 5 }], A: [{ to: 'C', cost: 2 }], B: [{ to: 'C', cost: 6 }], C: [{ to: 'M', cost: 2 }], M: [] },
  positions: { O: [48, 145], A: [185, 65], B: [185, 230], C: [315, 145], M: [450, 145] }, h: { O: 6, A: 4, B: 1, C: 2, M: 0 },
};
export const depthTree: Scenario = {
  id: 'arbol', title: 'Árbol con meta a profundidad 2', start: '1', goal: '7',
  graph: { '1': [{ to: '2', cost: 1 }, { to: '3', cost: 1 }], '2': [{ to: '4', cost: 1 }, { to: '5', cost: 1 }], '3': [{ to: '6', cost: 1 }, { to: '7', cost: 1 }], '4': [], '5': [], '6': [], '7': [] },
  positions: { '1': [250, 45], '2': [135, 140], '3': [365, 140], '4': [65, 245], '5': [190, 245], '6': [310, 245], '7': [435, 245] }, h: {},
};

/** Pseudocode IDs correspond directly to emitted operations. */
export function pseudocode(algorithm: Algorithm): readonly CodeLine[] {
  const stack = ['dfs', 'dls', 'iddfs'].includes(algorithm);
  const limited = algorithm === 'dls' || algorithm === 'iddfs';
  const cost = ['ucs', 'astar', 'weighted'].includes(algorithm);
  const procedures: Record<Algorithm, string> = { bfs: 'BUSQUEDA-ANCHURA', ucs: 'COSTO-UNIFORME', dfs: 'BUSQUEDA-PROFUNDIDAD', dls: 'BUSQUEDA-LIMITADA', iddfs: 'BUSQUEDA-LIMITADA', greedy: 'BUSQUEDA-AVIDA', astar: 'A-ESTRELLA', weighted: 'A-ESTRELLA-PONDERADA' };
  const name = `${procedures[algorithm]}(problema${limited ? ', límite' : ''})`;
  const evaluation = algorithm === 'ucs' ? 'g(n)' : algorithm === 'greedy' ? 'h(n)' : algorithm === 'weighted' ? 'g(n)+2h(n)' : 'g(n)+h(n)';
  return [
    ...(algorithm === 'iddfs' ? [
      { id: 'ids-header', text: 'función PROFUNDIZACION-ITERATIVA(problema):' },
      { id: 'restart', text: '  para límite = 0, 1, 2, ...:' },
      { id: 'ids-call', text: '    resultado ← BUSQUEDA-LIMITADA(problema, límite)' },
      { id: 'ids-return', text: '    si resultado no es CORTE: devolver resultado' },
      { id: 'ids-end', text: '  fin para\n' },
    ] : []),
    { id: 'header', text: `función ${name}:` },
    { id: 'start', text: '  inicial ← problema.inicial' },
    ...(!stack && algorithm !== 'bfs' ? [{ id: 'priority', text: `  prioridad(n) = $${evaluation}$; empates por inserción` }] : []),
    { id: 'root', text: '  raíz ← nodo(inicial, camino=[inicial], costo=0, profundidad=0)' },
    { id: 'init', text: stack ? `  frontera ← pila con raíz${limited ? '\n  huboCorte ← falso' : ''}` : cost ? '  mejor ← mapa con valor por defecto infinito\n  mejor[inicial] ← 0; frontera ← cola de prioridad con raíz' : algorithm === 'greedy' ? '  frontera ← cola de prioridad con raíz; alcanzados ← {inicial}' : '  frontera ← cola FIFO con raíz; alcanzados ← {inicial}' },
    { id: 'initial-goal', text: '  si problema.ES-META(inicial): devolver raíz.camino' },
    { id: 'loop', text: '  mientras frontera no esté vacía:' },
    { id: 'pop', text: stack ? '    nodo ← extraer tope de frontera' : cost ? '    nodo ← extraer menor prioridad de frontera\n    si nodo.costo > mejor[nodo.estado]: continuar' : algorithm === 'greedy' ? '    nodo ← extraer menor prioridad de frontera' : '    nodo ← extraer primero de frontera' },
    ...(algorithm !== 'bfs' ? [{ id: 'goal', text: '    si problema.ES-META(nodo.estado): devolver nodo.camino' }] : []),
    ...(limited ? [{ id: 'cutoff', text: '    si nodo.profundidad = límite:\n      si existe sucesor fuera de nodo.camino:\n        huboCorte ← verdadero\n      continuar' }] : []),
    { id: 'expand', text: '    para cada hijo en EXPANDIR(problema, nodo), en el orden dado:' },
    { id: 'seen', text: stack ? '      si hijo.estado ∈ nodo.camino: continuar' : cost ? '      si hijo.costo ≥ mejor[hijo.estado]: continuar' : '      si hijo.estado ∈ alcanzados: continuar' },
    ...(algorithm === 'bfs' ? [{ id: 'goal', text: '      si problema.ES-META(hijo.estado): devolver hijo.camino' }] : []),
    { id: 'enqueue', text: stack ? '      apilar hijo en frontera' : cost ? '      mejor[hijo.estado] ← hijo.costo\n      insertar hijo en frontera por prioridad' : algorithm === 'bfs' ? '      añadir hijo.estado a alcanzados\n      añadir hijo al final de frontera' : '      añadir hijo.estado a alcanzados\n      insertar hijo en frontera por prioridad' },
    { id: 'finish', text: '    fin para' },
    { id: 'end-loop', text: '  fin mientras' },
    { id: 'fail', text: limited ? '  si huboCorte: devolver CORTE\n  devolver FRACASO' : '  devolver FRACASO' },
  ];
}

/** For UCS/A*, allow improved paths to expanded states; consistency is not assumed. */
export function searchTrace(scenario: Scenario, algorithm: Algorithm, depthLimit = 2): readonly SearchStep[] {
  for (const edges of Object.values(scenario.graph)) for (const edge of edges) {
    if (!Number.isFinite(edge.cost) || edge.cost <= 0) throw new Error('Los costos deben ser finitos y positivos.');
  }
  if (!Number.isInteger(depthLimit) || depthLimit < 0) throw new Error('El límite debe ser un entero no negativo.');
  for (const h of Object.values(scenario.h)) if (!Number.isFinite(h) || h < 0) throw new Error('La heurística debe ser finita y no negativa.');
  const root: SearchNode = { state: scenario.start, path: [scenario.start], g: 0, depth: 0 };
  const steps: SearchStep[] = [];
  const stack = ['dfs', 'dls', 'iddfs'].includes(algorithm);
  const costSearch = ['ucs', 'astar', 'weighted'].includes(algorithm);
  let expansions = 0, generated = 0;
  let frontier: SearchNode[] = [], expanded: string[] = [], reached = new Map<string, number>();
  let current: SearchNode | null = null;
  let limit: number | null = null;
  const priority = (node: SearchNode): number => {
    const h = scenario.h[node.state] ?? 0;
    if (algorithm === 'greedy') return h;
    if (algorithm === 'astar') return node.g + h;
    if (algorithm === 'weighted') return node.g + 2 * h;
    return node.g;
  };
  const record = (line: string, message: string, status: SearchStep['status'] = 'running', solution: SearchNode | null = null): void => {
    steps.push({ line, message, current, frontier: [...frontier], expanded: [...expanded], reached: [...reached.keys()], solution, status, limit, expansions, generated });
  };
  const run = (boundary: number | null): 'success' | 'failure' | 'cutoff' => {
    generated++;
    frontier = [root]; expanded = []; reached = stack ? new Map() : new Map([[root.state, 0]]); current = null; limit = boundary;
    record('init', `La frontera comienza con ${scenario.start}. Los corredores son dirigidos y sus números indican costos.`);
    if (scenario.start === scenario.goal) { current = root; record('initial-goal', 'El estado inicial ya es la meta. Camino vacío de acciones; costo 0.', 'success', root); return 'success'; }
    let cutoff = false;
    while (frontier.length) {
      if (costSearch || algorithm === 'greedy') frontier.sort((a, b) => priority(a) - priority(b));
      const node = stack ? frontier.pop()! : frontier.shift()!;
      current = node;
      if (costSearch && node.g > reached.get(node.state)!) { record('pop', `Se omite ${node.state}: esta entrada tiene costo ${node.g}, mayor que el mejor costo registrado.`); continue; }
      const reason = stack ? 'es el tope de la pila' : algorithm === 'bfs' ? 'es el primero de la cola' : `tiene la menor prioridad (${priority(node)})`;
      record('pop', `Se extrae ${node.state} porque ${reason}. Aún no se han generado sus sucesores.`);
      if (algorithm !== 'bfs' && node.state === scenario.goal) { record('goal', `Meta encontrada: ${node.path.join(' → ')}. ${node.depth} acciones; costo ${node.g}.`, 'success', node); return 'success'; }
      const edges = scenario.graph[node.state] ?? [];
      if (boundary !== null && node.depth === boundary) {
        const continuation = edges.some(edge => !node.path.includes(edge.to));
        cutoff ||= continuation;
        record('cutoff', continuation ? `Se alcanza el límite ${boundary} en ${node.state}. Hay continuación pendiente: corte.` : `${node.state} no tiene continuación sin ciclos. Esta rama termina en fracaso, no en corte.`);
        continue;
      }
      expansions++;
      record('expand', `Se revisan los sucesores de ${node.state} en el orden ${edges.map(edge => edge.to).join(', ') || '(sin sucesores)'}.`);
      for (const edge of edges) {
        const child: SearchNode = { state: edge.to, path: [...node.path, edge.to], g: node.g + edge.cost, depth: node.depth + 1 };
        generated++;
        const old = reached.get(child.state);
        if (stack ? node.path.includes(child.state) : costSearch ? old !== undefined && child.g >= old : old !== undefined) {
          record('seen', stack ? `Se descarta ${child.state}: crearía un ciclo en este camino.` : `Se descarta el camino a ${child.state}: ${costSearch ? 'no mejora su costo conocido' : 'el estado ya fue alcanzado'}.`);
          continue;
        }
        if (algorithm === 'bfs' && child.state === scenario.goal) { record('goal', `Al generar ${child.state} se reconoce la meta: ${child.path.join(' → ')}. ${child.depth} acciones; costo ${child.g}.`, 'success', child); return 'success'; }
        if (!stack) reached.set(child.state, child.g);
        frontier.push(child);
        if (costSearch || algorithm === 'greedy') frontier.sort((a, b) => priority(a) - priority(b));
        record('enqueue', costSearch && old !== undefined ? `Se mejora ${child.state}: costo ${old} → ${child.g}. Se conserva el nuevo padre y se permite reabrir el estado.` : `Se agrega ${child.state} ${stack ? 'al tope de la pila' : algorithm === 'bfs' ? 'al final de la cola' : 'a la cola de prioridad'}, con costo acumulado ${child.g}.`);
      }
      expanded.push(node.state);
      record('finish', `Termina la expansión de ${node.state}. La frontera conserva las alternativas pendientes.`);
    }
    const status = cutoff ? 'cutoff' : 'failure';
    record('fail', cutoff ? 'La iteración termina con corte: podría haber solución a mayor profundidad.' : 'Se agotaron todos los caminos permitidos sin encontrar la meta.', status);
    return status;
  };
  if (algorithm === 'iddfs') {
    // A finite graph with path-cycle checking has no simple path longer than |V|-1.
    const vertices = new Set([scenario.start, ...Object.keys(scenario.graph), ...Object.values(scenario.graph).flatMap(edges => edges.map(edge => edge.to))]);
    for (let depth = 0; depth <= vertices.size; depth++) {
      limit = depth; frontier = []; expanded = []; reached = new Map(); current = null;
      record('restart', `Nueva iteración con límite ${depth}. Se reinician frontera y alcanzados; los contadores acumulan el trabajo.`);
      if (run(depth) !== 'cutoff') break;
    }
  } else run(algorithm === 'dls' ? depthLimit : null);
  return steps;
}
