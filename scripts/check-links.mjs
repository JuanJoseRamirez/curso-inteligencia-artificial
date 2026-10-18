import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, relative, sep } from 'node:path';

const output = resolve('dist');
const [, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const base = (process.env.BASE_PATH || (repository ? `/${repository}` : '/')).replace(/\/$/, '');
const walk = folder => readdirSync(folder).flatMap(name => {
  const file = join(folder, name);
  return statSync(file).isDirectory() ? walk(file) : [file];
});
if (!existsSync(output)) throw new Error('Compila el proyecto antes de comprobar enlaces.');
const pages = walk(output).filter(file => file.endsWith('.html'));
const failures = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const pagePath = `/${relative(output, page).split(sep).join('/')}`;
  const sourceUrl = new URL(`${base}${pagePath}`, 'https://course.invalid');
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|data:|mailto:|javascript:)/.test(href)) continue;
    const path = decodeURIComponent(new URL(href, sourceUrl).pathname);
    if (base && !path.startsWith(`${base}/`)) { failures.push(`${pagePath}: fuera de la ruta base: ${href}`); continue; }
    const local = resolve(output, `.${path.slice(base.length)}`);
    if (local !== output && !local.startsWith(output + sep)) { failures.push(`${pagePath}: ruta fuera de dist`); continue; }
    if (!existsSync(local) && !existsSync(join(local, 'index.html'))) failures.push(`${pagePath}: ${href}`);
  }
  if (html.includes('Parcial 1 · Resolución de problemas')) failures.push(`${pagePath}: etiqueta de parcial retirada`);
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(`${pages.length} páginas: enlaces y recursos locales válidos para ${base || '/'}.`);
