const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const FONTS = [
  // Source Sans 3 — corpo (base/negrito/preto + itálicos)
  '@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2',
  '@fontsource/source-sans-3/files/source-sans-3-latin-400-italic.woff2',
  '@fontsource/source-sans-3/files/source-sans-3-latin-500-normal.woff2',
  '@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff2',
  '@fontsource/source-sans-3/files/source-sans-3-latin-700-italic.woff2',
  '@fontsource/source-sans-3/files/source-sans-3-latin-900-normal.woff2',
  // Noto Serif — display (títulos + itálicos)
  '@fontsource/noto-serif/files/noto-serif-latin-400-normal.woff2',
  '@fontsource/noto-serif/files/noto-serif-latin-400-italic.woff2',
  '@fontsource/noto-serif/files/noto-serif-latin-700-normal.woff2',
  '@fontsource/noto-serif/files/noto-serif-latin-700-italic.woff2',
  '@fontsource/noto-serif/files/noto-serif-latin-900-normal.woff2',
  '@fontsource/noto-serif/files/noto-serif-latin-900-italic.woff2',
];

const destDir = path.join(root, 'src', 'assets', 'fonts');
fs.mkdirSync(destDir, { recursive: true });

for (const rel of FONTS) {
  const src = path.join(root, 'node_modules', rel);
  if (!fs.existsSync(src)) {
    console.error(`Erro: fonte não encontrada — ${rel}`);
    process.exit(1);
  }
  const dest = path.join(destDir, path.basename(rel));
  fs.copyFileSync(src, dest);
  console.log(`✓ ${path.basename(rel)}`);
}

console.log(`Fontes copiadas para src/assets/fonts/ (${FONTS.length}).`);
