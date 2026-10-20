import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';
import MathText, { mathCode } from '../../src/components/course/MathText';
import { chapters } from '../../src/course/content';

describe('Mathematical notation', () => {
  it('renders inline TeX accessibly while escaping ordinary text', () => {
    const html = renderToStaticMarkup(<MathText text={String.raw`Costo $g(n)+h(n)\le C^*$ <script>`} />);
    expect(html).toContain('class="katex"');
    expect(html).toContain('<math');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('$');
  });
  it('validates every lesson formula and keeps mathematical symbols out of prose', () => {
    const verify = (text: string) => {
      expect(text.split('$').length % 2, text).toBe(1);
      const plain = text.replace(/\$[^$\n]+\$/g, '');
      expect(plain, text).not.toMatch(/[≤≥ε∞√≈×⌊⌋∈−]/);
      expect(() => renderToStaticMarkup(<MathText text={text} />)).not.toThrow();
    };
    for (const chapter of chapters) for (const lesson of chapter.lessons) {
      [lesson.lead, lesson.question, lesson.answer, lesson.takeaway].forEach(verify);
      for (const section of lesson.sections) {
        [section.title, ...section.paragraphs].forEach(verify);
        if (section.table) [...section.table.headings, ...section.table.rows.flat()].forEach(verify);
        if (section.code) verify(mathCode(section.code));
        if (section.formula) {
          expect(() => katex.renderToString(section.formula, { throwOnError: true })).not.toThrow();
          expect(section.formula).not.toMatch(/[\x00-\x1f]/);
        }
      }
    }
  });
});
