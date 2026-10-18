import { expect, it } from 'vitest';
import { vacuumTrace } from '../../src/course/algorithms/agents';

it('simple reflex observes only local dirt and keeps moving after cleaning', () => {
  const trace = vacuumTrace(false);
  expect(trace).toHaveLength(8);
  expect(trace[0]?.percept).toBe('[A, sucia]');
  expect(trace[0]?.action).toBe('Limpiar');
  expect(trace.every(s => s.belief.every(value => value === null))).toBe(true);
  expect(trace.slice(-3).every(s => s.rooms.every(dirty => !dirty))).toBe(true);
  expect(trace.slice(-3).every(s => s.action !== 'Esperar')).toBe(true);
});
it('model remembers observed rooms and stops only when both are known clean', () => {
  const trace = vacuumTrace(true);
  expect(trace[0]?.belief).toEqual([true, null]);
  expect(trace[1]?.belief).toEqual([false, null]);
  expect(trace[trace.length - 1]?.action).toBe('Esperar');
  expect(trace[trace.length - 1]?.belief).toEqual([false, false]);
  expect(vacuumTrace(true)).toEqual(trace);
});
