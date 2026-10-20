import katex from 'katex';
import { Fragment } from 'react';

export function mathCode(text: string): string {
  const symbols: Record<string, string> = { '←': '\\gets', '≥': '\\ge', '∈': '\\in', '−': '-' };
  return text.replace(/[←≥∈−]/g, symbol => `$${symbols[symbol]}$`);
}

/** Explicit $...$ delimiters keep prose and mathematical notation separate. */
export default function MathText({ text }: { text: string }) {
  return <>{text.split(/(\$[^$\n]+\$)/g).map((part, i) => part.startsWith('$') && part.endsWith('$')
    ? <span key={i} className="inline-math" dangerouslySetInnerHTML={{ __html: katex.renderToString(part.slice(1, -1), { throwOnError: true, output: 'htmlAndMathml' }) }} />
    : <Fragment key={i}>{part}</Fragment>)}</>;
}
