import { describe, expect, it } from 'vitest';
import { depthTree, pseudocode, searchTrace, warehouseA, warehouseB } from '../../src/course/algorithms/search';
import type { Algorithm, Scenario, SearchStep } from '../../src/course/algorithms/search';

const algorithms: Algorithm[] = ['bfs', 'ucs', 'dfs', 'dls', 'iddfs', 'greedy', 'astar', 'weighted'];
const last = (steps: readonly SearchStep[]) => steps[steps.length - 1]!;
const scenario = (graph: Scenario['graph'], h: Scenario['h'] = {}): Scenario => ({ id: 'test', title: 'Prueba', start: 'S', goal: 'G', graph, h, positions: {} });

describe('Search traces tied to the teaching scenarios', () => {
  it('BFS recognizes the goal on generation and leaves C and D pending', () => {
    const trace = searchTrace(warehouseA, 'bfs');
    expect(last(trace).solution).toMatchObject({ path: ['O', 'B', 'M'], g: 6, depth: 2 });
    expect(last(trace).current?.state).toBe('B');
    expect(last(trace).frontier.map(n => n.state)).toEqual(['C', 'D']);
    expect(trace.filter(s => s.line === 'pop').map(s => s.current?.state)).toEqual(['O', 'A', 'B']);
    expect(last(trace).expansions).toBe(3);
  });
  it('UCS minimizes cost while DFS follows stack insertion order', () => {
    expect(last(searchTrace(warehouseA, 'ucs')).solution).toMatchObject({ path: ['O', 'A', 'C', 'M'], g: 3 });
    expect(last(searchTrace(warehouseA, 'dfs')).solution?.path).toEqual(['O', 'B', 'M']);
  });
  it('Greedy and A* diverge; A* improves C without fabricated metrics', () => {
    expect(last(searchTrace(warehouseB, 'greedy')).solution?.g).toBe(13);
    const trace = searchTrace(warehouseB, 'astar');
    expect(last(trace).solution?.g).toBe(7);
    expect(trace.some(s => s.message.includes('costo 11 → 5'))).toBe(true);
    expect(last(searchTrace(warehouseB, 'weighted')).solution?.g).toBe(7);
  });
  it('never mutates scenario or earlier snapshots', () => {
    const before = JSON.stringify(warehouseA);
    const trace = searchTrace(warehouseA, 'ucs');
    expect(JSON.stringify(warehouseA)).toBe(before);
    expect(trace[0]?.frontier.map(n => n.state)).toEqual(['O']);
    expect(trace[0]?.expanded).toEqual([]);
  });
  it('links all operations to an actual pseudocode line', () => {
    for (const algorithm of algorithms) {
      const ids = pseudocode(algorithm).map(line => line.id);
      for (const step of searchTrace(warehouseA, algorithm)) expect(ids).toContain(step.line);
    }
  });
});

describe('Depth boundaries and finite termination', () => {
  it('depth-first variants do not retain a global reached-state table', () => {
    for (const algorithm of ['dfs', 'dls', 'iddfs'] as const) {
      for (const step of searchTrace(depthTree, algorithm)) expect(step.reached).toEqual([]);
    }
  });
  it('cuts at 0 and 1; accepts the goal exactly at 2', () => {
    expect(last(searchTrace(depthTree, 'dls', 0)).status).toBe('cutoff');
    expect(last(searchTrace(depthTree, 'dls', 1)).status).toBe('cutoff');
    expect(last(searchTrace(depthTree, 'dls', 2)).solution?.depth).toBe(2);
    for (const s of searchTrace(depthTree, 'dls', 1)) expect(s.current?.depth ?? 0).toBeLessThanOrEqual(1);
  });
  it('IDDFS resets per iteration and accumulates generation of roots', () => {
    const trace = searchTrace(depthTree, 'iddfs');
    expect(trace.filter(s => s.line === 'restart').map(s => s.limit)).toEqual([0, 1, 2]);
    expect(last(trace).solution?.depth).toBe(2);
    expect(trace.filter(s => s.line === 'init').map(s => s.frontier.map(n => n.state))).toEqual([['1'], ['1'], ['1']]);
    for (const s of trace.filter(s => s.line === 'restart')) { expect(s.current).toBeNull(); expect(s.frontier).toEqual([]); }
    expect(last(trace).generated).toBeGreaterThan(last(searchTrace(depthTree, 'dls', 2)).generated);
  });
  it('distinguishes an exhausted leaf and a cycle from cutoff', () => {
    const empty = scenario({});
    expect(last(searchTrace(empty, 'dls', 0)).status).toBe('failure');
    const cycle = scenario({ S: [{ to: 'S', cost: 1 }] });
    expect(last(searchTrace(cycle, 'dls', 0)).status).toBe('failure');
    expect(last(searchTrace(cycle, 'iddfs')).status).toBe('failure');
  });
  for (const algorithm of algorithms) {
    it(`${algorithm}: supports start=goal, missing adjacency and a finite cyclic no-solution graph`, () => {
      expect(last(searchTrace({ ...scenario({}), goal: 'S' }, algorithm)).solution?.g).toBe(0);
      expect(last(searchTrace(scenario({}), algorithm)).status).toBe('failure');
      const cycle = scenario({ S: [{ to: 'A', cost: 1 }], A: [{ to: 'S', cost: 1 }, { to: 'Z', cost: 1 }] });
      expect(last(searchTrace(cycle, algorithm, 4)).status).toBe('failure');
    });
  }
});

describe('Priority, duplicates and reopening', () => {
  it('reopens an expanded state with an admissible inconsistent heuristic', () => {
    const s = scenario({ S: [{ to: 'A', cost: 2 }, { to: 'B', cost: 2 }], A: [{ to: 'C', cost: 2 }], B: [{ to: 'C', cost: 1 }], C: [{ to: 'G', cost: 2 }], G: [] }, { S: 0, A: 0, B: 3, C: 0, G: 0 });
    const trace = searchTrace(s, 'astar');
    expect(trace.filter(t => t.line === 'expand' && t.current?.state === 'C')).toHaveLength(2);
    expect(last(trace).solution?.g).toBe(5);
  });
  it('skips stale entries and rejects equal or higher costs', () => {
    const s = scenario({ S: [{ to: 'A', cost: 1 }, { to: 'B', cost: 2 }], A: [{ to: 'C', cost: 6 }], B: [{ to: 'C', cost: 1 }, { to: 'A', cost: 1 }], C: [{ to: 'G', cost: 10 }], G: [] });
    const trace = searchTrace(s, 'ucs');
    expect(trace.some(t => t.message.includes('esta entrada tiene costo'))).toBe(true);
    expect(trace.some(t => t.line === 'seen')).toBe(true);
    expect(last(trace).solution?.g).toBe(13);
  });
  it('handles repeated discovery for BFS and Greedy and path cycles for DFS', () => {
    const s = scenario({ S: [{ to: 'A', cost: 1 }, { to: 'B', cost: 1 }], A: [{ to: 'S', cost: 1 }, { to: 'Z', cost: 1 }], B: [{ to: 'Z', cost: 1 }], Z: [] });
    for (const a of ['bfs', 'greedy', 'dfs'] as const) {
      expect(searchTrace(s, a).some(t => t.line === 'seen')).toBe(true);
    }
  });
  it('matches UCS with zero heuristic and insertion-order ties', () => {
    const s = scenario({ S: [{ to: 'A', cost: 1 }, { to: 'B', cost: 1 }], A: [{ to: 'G', cost: 2 }], B: [{ to: 'G', cost: 2 }], G: [] });
    expect(last(searchTrace(s, 'astar')).solution).toEqual(last(searchTrace(s, 'ucs')).solution);
    expect(last(searchTrace(s, 'ucs')).solution?.path).toEqual(['S', 'A', 'G']);
  });
  it('validates finite positive costs, finite nonnegative h and integer depth', () => {
    for (const cost of [-1, 0, NaN, Infinity]) expect(() => searchTrace(scenario({ S: [{ to: 'G', cost }] }), 'ucs')).toThrow();
    for (const h of [-1, NaN, Infinity]) expect(() => searchTrace(scenario({}, { S: h }), 'astar')).toThrow();
    for (const limit of [-1, 0.5, Infinity]) expect(() => searchTrace(warehouseA, 'dls', limit)).toThrow();
  });
});
