import MathText from './MathText';
import { useState } from 'react';

const nodes = ['O', 'A', 'B', 'C', 'M'] as const;
const optimal = { O: 7, A: 4, B: 8, C: 2, M: 0 };
const tables = {
  notes: { O: 6, A: 4, B: 1, C: 2, M: 0 },
  zero: { O: 0, A: 0, B: 0, C: 0, M: 0 },
  over: { O: 9, A: 4, B: 1, C: 2, M: 0 },
  inconsistent: { O: 7, A: 0, B: 1, C: 2, M: 0 },
};
const edges = [{ from: 'O', to: 'A', cost: 3 }, { from: 'O', to: 'B', cost: 5 }, { from: 'A', to: 'C', cost: 2 }, { from: 'B', to: 'C', cost: 6 }, { from: 'C', to: 'M', cost: 2 }] as const;
export default function HeuristicDemo() {
  const [mode, setMode] = useState<keyof typeof tables>('notes');
  const h = tables[mode];
  const admissible = nodes.every(n => h[n] <= optimal[n]);
  const consistent = edges.every(e => h[e.from] <= e.cost + h[e.to]);
  return <section className="heuristic-demo"><div className="section-caption"><span>Ejemplo · Propiedades heurísticas</span><span>Almacén B · Meta M</span></div><h2>Admisibilidad y consistencia en el almacén</h2><label>Tabla heurística <select value={mode} onChange={e => setMode(e.target.value as keyof typeof tables)}><option value="notes">Ejemplo de las notas</option><option value="zero">Heurística cero</option><option value="over">Una sobreestimación</option><option value="inconsistent">Admisible e inconsistente</option></select></label><div className="table-scroll"><table><thead><tr><th>Estado</th><th><MathText text="$h$" /></th><th><MathText text="$h^*$" /> real</th><th>¿No sobreestima?</th></tr></thead><tbody>{nodes.map(n => <tr key={n}><th scope="row">{n}</th><td><MathText text={`$${h[n]}$`} /></td><td><MathText text={`$${optimal[n]}$`} /></td><td>{h[n] <= optimal[n] ? 'Sí' : 'No'}</td></tr>)}</tbody></table></div><p className="step-explanation" aria-live="polite">{admissible ? 'La tabla es admisible: ningún valor supera el costo óptimo restante.' : 'La tabla no es admisible: sobreestima el costo restante desde O.'} {consistent ? 'También es consistente en todas las aristas.' : 'No es consistente: al menos una arista viola la desigualdad local.'}</p><details><summary>Ver comprobación de consistencia por arista</summary><div className="table-scroll"><table><thead><tr><th>Arista</th><th>Comprobación</th><th>Resultado</th></tr></thead><tbody>{edges.map(e => <tr key={`${e.from}-${e.to}`}><td><MathText text={String.raw`$${e.from}\to ${e.to}$`} /></td><td><MathText text={String.raw`$${h[e.from]}\le ${e.cost}+${h[e.to]}$`} /></td><td>{h[e.from] <= e.cost + h[e.to] ? 'Cumple' : 'No cumple'}</td></tr>)}</tbody></table></div></details><p className="quiet">Los costos óptimos restantes son los de esta red dirigida: C–M cuesta 2, A–C–M cuesta 4, B–C–M cuesta 8 y O–A–C–M cuesta 7.</p></section>;
}
