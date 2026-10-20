import MathText from './MathText';
import SvgMath from './SvgMath';
import { warehouseA, warehouseB } from '../../course/algorithms/search';

/** Static problem data remain readable before students start an execution. */
export default function ScenarioDiagram({ kind }: { kind: 'a' | 'b' | 'grid' }) {
  if (kind === 'grid') return <figure className="problem-figure"><svg viewBox="0 0 400 280" role="img" aria-label="Cuadrícula sin obstáculos: desde (0,0) hasta (4,4), ocho pasos cardinales o cuatro diagonales.">
    <defs><pattern id="lesson-grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="#dce2de" /></pattern></defs>
    <rect x="90" y="25" width="220" height="220" fill="url(#lesson-grid)" stroke="#dce2de" />
    <path d="M112 47H288V223" fill="none" stroke="#285b49" strokeWidth="3" />
    <path d="M112 47L288 223" fill="none" stroke="#98572b" strokeWidth="2" strokeDasharray="6 5" />
    <circle cx="112" cy="47" r="7" fill="#285b49" /><circle cx="288" cy="223" r="7" fill="#285b49" />
    <text x="75" y="22">Inicio</text><text x="238" y="270">Meta</text>
  </svg><figcaption>Sin obstáculos: 8 pasos cardinales. Con diagonales de costo 1: 4 pasos. La distancia euclídea es <MathText text={String.raw`$\sqrt{32}\approx 5{,}66$`} /> unidades de longitud.</figcaption></figure>;
  const scenario = kind === 'a' ? warehouseA : warehouseB;
  return <figure className="problem-figure"><svg className="course-graph" viewBox="0 0 510 310" role="img" aria-label={`${scenario.title}: origen O, meta M. Los corredores son dirigidos y llevan su costo.`}>
    <defs><marker id={`problem-arrow-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#788a80" /></marker></defs>
    {Object.entries(scenario.graph).flatMap(([from, edges]) => edges.map(({ to, cost }) => {
      const [x, y] = scenario.positions[from]!, [tx, ty] = scenario.positions[to]!;
      const dx = tx - x, dy = ty - y, length = Math.hypot(dx, dy);
      return <g key={`${from}-${to}`}><path className="graph-edge" d={`M${x + dx / length * 25} ${y + dy / length * 25}L${tx - dx / length * 28} ${ty - dy / length * 28}`} markerEnd={`url(#problem-arrow-${kind})`} /><SvgMath x={(x + tx) / 2} y={(y + ty) / 2 - 9} tex={String(cost)} width={44} /></g>;
    }))}
    {Object.entries(scenario.positions).map(([node, [x, y]]) => <g key={node} className="graph-node" transform={`translate(${x},${y})`}><circle r="24" />{node === scenario.goal && <circle r="19" className="goal-ring" />}<text textAnchor="middle" dy="6">{node}</text>{kind === 'b' && <SvgMath x={0} y={43} tex={`h=${scenario.h[node]}`} />}</g>)}
  </svg><figcaption>Adaptación de las notas, figura {kind === 'a' ? '2.1' : '3.1'}. Doble círculo: meta. {kind === 'b' && 'Los valores h estiman el costo restante hasta M.'}</figcaption><details><summary>Leer los corredores como texto</summary><ul>{Object.entries(scenario.graph).filter(([, edges]) => edges.length).map(([from, edges]) => <li key={from}>Desde {from}: {edges.map(e => `${e.to} (costo ${e.cost})`).join('; ')}.</li>)}</ul></details></figure>;
}
