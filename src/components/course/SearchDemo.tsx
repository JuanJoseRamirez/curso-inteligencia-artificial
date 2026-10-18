import { useId, useMemo, useState } from 'react';
import { algorithmNames, depthTree, pseudocode, searchTrace, warehouseA, warehouseB } from '../../course/algorithms/search';
import type { Algorithm, Scenario } from '../../course/algorithms/search';

interface Props { algorithm: Algorithm; scenario: 'a' | 'b' | 'tree' }
export default function SearchDemo({ algorithm: initialAlgorithm, scenario: scenarioId }: Props) {
  const [algorithm, setAlgorithm] = useState(initialAlgorithm);
  const [index, setIndex] = useState(0);
  const [limit, setLimit] = useState(1);
  const id = useId().replace(/:/g, '');
  const scenario: Scenario = scenarioId === 'a' ? warehouseA : scenarioId === 'b' ? warehouseB : depthTree;
  const steps = useMemo(() => searchTrace(scenario, algorithm, limit), [scenario, algorithm, limit]);
  const step = steps[index]!;
  const informed = ['greedy', 'astar', 'weighted'].includes(algorithm);
  const priority = ['ucs', 'greedy', 'astar', 'weighted'].includes(algorithm);
  const stack = ['dfs', 'dls', 'iddfs'].includes(algorithm);
  const frontier = stack ? [...step.frontier].reverse() : step.frontier;
  const solution = step.solution?.path ?? [];
  const activePath = step.current?.path ?? [];
  const maxFrontier = Math.max(...steps.slice(0, index + 1).map(s => s.frontier.length));
  const changeAlgorithm = (value: Algorithm) => { setIndex(0); setAlgorithm(value); };
  return <section className="search-demo" aria-label={`Ejemplo paso a paso de ${algorithmNames[algorithm]}`}>
    <div className="section-caption"><span>Ejemplo guiado</span><span>{scenario.id === 'almacen-b' ? 'Notas · Figura 3.1' : scenarioId === 'tree' ? 'Notas · Figura 2.8' : 'Notas · Figura 2.1'}</span></div>
    <h2>{scenario.title}</h2>
    <p className="demo-context">{scenarioId === 'tree' ? 'Meta: 7. La raíz tiene profundidad 0. Se apilan los hijos en el orden mostrado; sale primero el último.' : 'El robot parte de O y debe llegar a M. Las flechas son corredores; los números indican costos de tránsito.'}</p>
    {initialAlgorithm === 'iddfs' && <div className="demo-options"><label>Procedimiento <select value={algorithm} onChange={e => changeAlgorithm(e.target.value as Algorithm)}><option value="iddfs">Profundización iterativa</option><option value="dls">Búsqueda limitada</option></select></label>{algorithm === 'dls' && <label>Límite <select value={limit} onChange={e => { setIndex(0); setLimit(Number(e.target.value)); }}>{[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}</select></label>}</div>}
    <div className="pseudocode"><div className="code-caption">Pseudocódigo · {algorithmNames[algorithm]}{algorithm === 'weighted' && ' · W = 2'}</div><ol>{pseudocode(algorithm).map(line => <li key={line.id} className={step.line === line.id ? 'active-line' : ''} aria-current={step.line === line.id ? 'step' : undefined}><code>{line.text}</code></li>)}</ol></div>
    <div className="graph-wrap">
      <svg className="course-graph" viewBox="0 0 510 310" role="img" aria-label={`${scenario.title}. ${step.message}`}>
        <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
        {Object.entries(scenario.graph).flatMap(([from, edges]) => edges.map(({ to, cost }) => {
          const [x, y] = scenario.positions[from]!, [tx, ty] = scenario.positions[to]!;
          const dx = tx - x, dy = ty - y, length = Math.hypot(dx, dy);
          const onSolution = solution.some((n, i) => n === from && solution[i + 1] === to);
          return <g key={`${from}-${to}`}><path className={`graph-edge${onSolution ? ' solution-edge' : ''}`} d={`M ${x + dx / length * 25} ${y + dy / length * 25} L ${tx - dx / length * 28} ${ty - dy / length * 28}`} markerEnd={`url(#${id}-arrow)`} /><text className="edge-cost" x={(x + tx) / 2} y={(y + ty) / 2 - 9} textAnchor="middle">{cost}</text></g>;
        }))}
        {Object.entries(scenario.positions).map(([node, [x, y]]) => {
          const state = solution.includes(node) ? 'solution' : step.current?.state === node ? 'current' : frontier.some(n => n.state === node) ? 'pending' : step.expanded.includes(node) ? 'explored' : 'unvisited';
          return <g key={node} className={`graph-node ${state}`} transform={`translate(${x},${y})`}><circle r="24" />{node === scenario.goal && <circle r="19" className="goal-ring" />}<text textAnchor="middle" dy="6">{node}</text>{informed && <text className="h-label" y="45" textAnchor="middle">h={scenario.h[node]}</text>}</g>;
        })}
      </svg>
    </div>
    <div className="graph-legend"><span className="legend-current">Actual</span><span className="legend-pending">En frontera</span><span className="legend-explored">Expandido</span><span>Doble círculo: meta</span></div>
    <div className="frontier-strip"><strong>{priority ? 'Cola de prioridad' : stack ? 'Pila · tope a la izquierda' : 'Cola · sale por la izquierda'}</strong><div>{frontier.length ? frontier.map((node, i) => <span className="queue-entry" key={`${node.path.join('-')}-${i}`}>{node.state}{priority && <small>{algorithm === 'ucs' ? `g=${node.g}` : algorithm === 'greedy' ? `h=${scenario.h[node.state] ?? 0}` : `f=${node.g + (algorithm === 'weighted' ? 2 : 1) * (scenario.h[node.state] ?? 0)}`}</small>}</span>) : <span className="quiet">Vacía</span>}</div></div>
    <div className="playback"><button type="button" disabled={index === 0} onClick={() => setIndex(n => n - 1)}>Anterior</button><button type="button" className="primary-button" disabled={index === steps.length - 1} onClick={() => setIndex(n => n + 1)}>Siguiente paso</button><button type="button" className="plain-button" onClick={() => setIndex(0)}>Reiniciar</button><span className="quiet">Paso {index + 1} de {steps.length}</span></div>
    <p className={`step-explanation ${step.status === 'success' ? 'success-explanation' : ''}`} aria-live="polite" aria-atomic="true">{step.message}</p>
    <dl className="state-values"><div><dt>Camino actual</dt><dd>{(step.solution?.path ?? activePath).join(' → ') || '—'}</dd></div>{step.current && <div><dt>Costo del camino</dt><dd>{step.solution?.g ?? step.current.g}</dd></div>}{informed && step.current && <div><dt>h / prioridad actual</dt><dd>{scenario.h[step.current.state] ?? 0} / {algorithm === 'greedy' ? scenario.h[step.current.state] ?? 0 : step.current.g + (algorithm === 'weighted' ? 2 : 1) * (scenario.h[step.current.state] ?? 0)}</dd></div>}{step.limit !== null && <div><dt>Límite de profundidad</dt><dd>{step.limit}</dd></div>}<div><dt>Expansiones iniciadas</dt><dd>{step.expansions}</dd></div><div><dt>Nodos generados</dt><dd>{step.generated}</dd></div><div><dt>Máximo de frontera</dt><dd>{maxFrontier}</dd></div></dl>
    <details className="technical-note"><summary>Orden y convenciones de esta ejecución</summary><p>Sucesores en el orden de las notas. En pilas se inserta de izquierda a derecha y sale el último; en prioridades se desempata por inserción. Una expansión se cuenta al comenzar a revisar sucesores; reconocer una meta no cuenta como expansión. Los generados incluyen la raíz, los descartados y la meta.</p><p>{stack ? 'Se detectan ciclos del camino, sin cerrar globalmente los estados.' : algorithm === 'bfs' || algorithm === 'greedy' ? 'Se registran estados al insertarlos. Greedy conserva el primer camino conocido.' : 'Se conservan mejores costos, se permiten reaperturas y se omiten entradas obsoletas. Estas entradas pueden permanecer visibles hasta extraerse.'} Las instantáneas de reproducción consumen memoria adicional; los contadores no miden bytes ni tiempo de cómputo.</p></details>
    <noscript>Para avanzar en el ejemplo se necesita JavaScript. El pseudocódigo y la explicación de la lección siguen disponibles sin él.</noscript>
  </section>;
}
