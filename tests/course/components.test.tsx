import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import SearchDemo from '../../src/components/course/SearchDemo';
import AgentDemo from '../../src/components/course/AgentDemo';
import HeuristicDemo from '../../src/components/course/HeuristicDemo';

afterEach(cleanup);
describe('Teaching interactions', () => {
  it('shows the A* improvement and restores the previous frontier on reverse', () => {
    const { container } = render(<SearchDemo algorithm="astar" scenario="b" />);
    const next = screen.getByRole('button', { name: 'Siguiente paso' });
    let guard = 100;
    while (!container.querySelector('.step-explanation')?.textContent?.includes('costo 11 → 5') && guard--) fireEvent.click(next);
    expect(guard).toBeGreaterThan(0);
    expect(container.querySelector('[aria-current="step"]')?.textContent).toContain('mejor[estado]');
    expect(container.querySelector('.frontier-strip')?.textContent).toContain('f=7');
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(container.querySelector('.frontier-strip')?.textContent).not.toContain('f=7');
    expect(container.querySelector('.frontier-strip')?.textContent).toContain('f=13');
  });
  it('steps, reverses and resets BFS without exposing a false solution', () => {
    render(<SearchDemo algorithm="bfs" scenario="a" />);
    const next = screen.getByRole('button', { name: 'Siguiente paso' });
    const previous = screen.getByRole('button', { name: 'Anterior' });
    expect((previous as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(next);
    expect(screen.getByText(/Aún no se han generado/)).toBeTruthy();
    fireEvent.click(previous);
    expect(screen.getByText(/La frontera comienza/)).toBeTruthy();
    let guard = 100;
    while (!(next as HTMLButtonElement).disabled && guard--) fireEvent.click(next);
    expect(guard).toBeGreaterThan(0);
    expect(screen.getByText(/Al generar M se reconoce la meta/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(screen.getByText(/La frontera comienza/)).toBeTruthy();
  });
  it('switches DLS/IDDFS and enforces a selected depth limit', () => {
    render(<SearchDemo algorithm="iddfs" scenario="tree" />);
    fireEvent.change(screen.getByLabelText('Procedimiento'), { target: { value: 'dls' } });
    fireEvent.change(screen.getByLabelText('Límite'), { target: { value: '0' } });
    const next = screen.getByRole('button', { name: 'Siguiente paso' });
    let guard = 30;
    while (!(next as HTMLButtonElement).disabled && guard--) fireEvent.click(next);
    expect(screen.getByText(/La iteración termina con corte/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Procedimiento'), { target: { value: 'iddfs' } });
    expect(screen.getByText(/Nueva iteración con límite 0/)).toBeTruthy();
  });
  it('updates the admissibility and consistency checks together', () => {
    render(<HeuristicDemo />);
    const table = screen.getByLabelText('Tabla heurística');
    fireEvent.change(table, { target: { value: 'over' } });
    expect(screen.getByText(/La tabla no es admisible/)).toBeTruthy();
    fireEvent.change(table, { target: { value: 'inconsistent' } });
    expect(screen.getByText(/La tabla es admisible:.*No es consistente/)).toBeTruthy();
    fireEvent.change(table, { target: { value: 'zero' } });
    expect(screen.getByText(/También es consistente/)).toBeTruthy();
  });
  it('resets agent playback when changing architecture', () => {
    render(<AgentDemo />);
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente paso' }));
    fireEvent.change(screen.getByLabelText('Arquitectura'), { target: { value: 'model' } });
    expect(screen.getByText('Recuerda: desconocida')).toBeTruthy();
    const next = screen.getByRole('button', { name: 'Siguiente paso' });
    let guard = 20;
    while (!(next as HTMLButtonElement).disabled && guard--) fireEvent.click(next);
    expect(screen.getByText('Esperar')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Anterior' }) as HTMLButtonElement).disabled).toBe(false);
  });
});
