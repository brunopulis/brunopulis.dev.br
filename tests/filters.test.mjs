import { describe, it, expect } from 'vitest';
import { FA_ICONS, faIcon, i18n, pt, en } from '../src/_data/filters.js';

describe('faIcon', () => {
  it('mapeia nomes conhecidos para classes Font Awesome', () => {
    expect(faIcon('fast-forward')).toBe('fa-forward');
    expect(faIcon('file-text')).toBe('fa-file-lines');
    expect(faIcon('book-open')).toBe('fa-book-open');
    expect(faIcon('users')).toBe('fa-users');
    expect(faIcon('presentation')).toBe('fa-presentation-screen');
    expect(faIcon('shield-check')).toBe('fa-shield-halved');
    expect(faIcon('arrow-right')).toBe('fa-arrow-right');
  });

  it('retorna fa-circle para nomes desconhecidos', () => {
    expect(faIcon('nao-existe')).toBe('fa-circle');
  });

  it('retorna fa-circle para undefined/null/vazio', () => {
    expect(faIcon(undefined)).toBe('fa-circle');
    expect(faIcon(null)).toBe('fa-circle');
    expect(faIcon('')).toBe('fa-circle');
  });

  it('todos os mapeamentos apontam para nomes não vazios', () => {
    for (const className of Object.values(FA_ICONS)) {
      expect(className).toMatch(/^fa-/);
    }
  });
});

describe('i18n', () => {
  it('resolve chave aninhada em pt (padrão)', () => {
    expect(i18n('nav.servicos', 'pt')).toBe(pt.nav.servicos);
    expect(i18n('hero.ctaServices', 'pt')).toBe(pt.hero.ctaServices);
  });

  it('resolve chave aninhada em en', () => {
    expect(i18n('nav.portfolio', 'en')).toBe(en.nav.portfolio);
    expect(i18n('hero.ctaServices', 'en')).toBe(en.hero.ctaServices);
  });

  it('locale desconhecido cai para pt', () => {
    expect(i18n('nav.sobre', 'fr')).toBe(pt.nav.sobre);
  });

  it('retorna a própria chave quando ela não existe', () => {
    expect(i18n('chave.que.nao.existe', 'pt')).toBe('chave.que.nao.existe');
  });

  it('retorna a própria chave para blob vazio', () => {
    expect(i18n('', 'pt')).toBe('');
  });
});

describe('i18n data integrity (pt/en)', () => {
  const leafKeys = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([k, v]) => {
      const next = prefix ? `${prefix}.${k}` : k;
      return v && typeof v === 'object' && !Array.isArray(v) ? leafKeys(v, next) : [next];
    });

  const ptKeys = leafKeys(pt).sort();
  const enKeys = leafKeys(en).sort();

  it('pt e en têm o mesmo conjunto de chaves aninhadas', () => {
    expect(enKeys).toEqual(ptKeys);
  });
});
