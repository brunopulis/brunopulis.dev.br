import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCSS_ROOT = path.resolve(__dirname, '../src/assets/scss');

function readAllScss(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(readAllScss(full));
    else if (entry.name.endsWith('.scss')) files.push(fs.readFileSync(full, 'utf8'));
  }
  return files;
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

let declaredTokens;
let missing;

describe('tokens SCSS — integridade das custom properties', () => {
  beforeAll(() => {
    const sources = readAllScss(SCSS_ROOT).map(stripComments).join('\n');

    const declared = new Set();
    for (const m of sources.matchAll(/--(?<name>[\w-]+)\s*:/g)) declared.add(m.groups.name);

    // Só sinaliza var(--x) SEM fallback inline. var(--x, valor) é opcional por design.
    const usages = new Set();
    for (const m of sources.matchAll(/var\(\s*--(?<name>[\w-]+)(?<rest>[\s\S]{0,3})/g)) {
      const rest = m.groups.rest;
      const next = rest.match(/^\s*(.)/);
      if (!next || next[1] === ',') continue; // var(--x, fallback) — seguro por design
      usages.add(m.groups.name);
    }

    declaredTokens = declared;
    missing = [...usages].filter((name) => !declared.has(name)).sort();
  });

  it('declara os tokens de tipografia essenciais', () => {
    for (const name of [
      'line-height-flat',
      'line-height-compact',
      'line-height-base',
      'line-height-loose',
      'measure-compact',
      'measure-longform',
      'tracking',
      'tracking-compact',
      'text-decoration-color',
      'text-decoration-line',
      'text-decoration-style',
      'text-decoration-thickness'
    ]) {
      expect(declaredTokens.has(name), `falta declarar --${name}`).toBe(true);
    }
  });

  it('todo token referenciado por var(--x) é declarado em algum .scss', () => {
    expect(missing).toEqual([]);
  });
});
