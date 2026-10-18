export interface AgentStep {
  readonly position: 0 | 1; readonly rooms: readonly [boolean, boolean];
  readonly belief: readonly [boolean | null, boolean | null];
  readonly percept: string; readonly action: string; readonly reason: string;
}
/** Dirty=true. The agent receives only its local room status, never the other room. */
export function vacuumTrace(model: boolean): readonly AgentStep[] {
  let position: 0 | 1 = 0;
  const rooms: [boolean, boolean] = [true, true];
  const belief: [boolean | null, boolean | null] = [null, null];
  const steps: AgentStep[] = [];
  for (let tick = 0; tick < 8; tick++) {
    const dirty = rooms[position];
    if (model) belief[position] = dirty;
    const stop = model && belief[0] === false && belief[1] === false;
    const action = dirty ? 'Limpiar' : stop ? 'Esperar' : position === 0 ? 'Mover a B' : 'Mover a A';
    steps.push({ position, rooms: [...rooms], belief: [...belief], percept: `[${position === 0 ? 'A' : 'B'}, ${dirty ? 'sucia' : 'limpia'}]`, action,
      reason: dirty ? 'La habitación actual está sucia: se aplica la regla de limpiar.' : stop ? 'El modelo registra ambas habitaciones limpias. Puede detenerse sin consultar la habitación remota.' : 'La habitación actual está limpia. El reflejo de movimiento lleva a la otra habitación.' });
    if (stop) break;
    if (dirty) rooms[position] = false; else position = position === 0 ? 1 : 0;
  }
  return steps;
}
