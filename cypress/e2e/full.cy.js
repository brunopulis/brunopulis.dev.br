const LOCALES = {
  '/': 'pt-br',
  '/en/': 'en'
};

describe('Suite E2E completa — páginas do site', () => {
  const rotas = [
    '/',
    '/servicos/',
    '/sobre/',
    '/portfolio/',
    '/palestras/',
    '/contato/',
    '/en/'
  ];

  rotas.forEach((path) => {
    it(`${path} — tem um único h1 visível`, () => {
      cy.visit(path);
      cy.get('h1').should('have.length', 1);
      cy.get('h1').should('be.visible');
    });
  });

  it('cada página expõe o idioma correto no <html lang>', () => {
    Object.entries(LOCALES).forEach(([path, lang]) => {
      cy.visit(path);
      cy.get('html').should('have.attr', 'lang', lang);
    });
  });

  it('hierarquia de títulos: não pula de h1 direto para h3+ no conteúdo', () => {
    rotas.forEach((path) => {
      cy.visit(path);
      cy.get('main h1, main h2, main h3').then(($heads) => {
        const levels = [...$heads].map((el) => parseInt(el.tagName[1], 10));
        expect(levels[0], `${path}: primeiro título deve ser h1`).to.equal(1);
        const hasEmptyGap = levels.some((lvl, i) => i > 0 && lvl - levels[i - 1] > 1);
        expect(hasEmptyGap, `${path}: não pode pular níveis de título`).to.equal(false);
      });
    });
  });

  it('links internos (mesmo domínio) não estão quebrados (sem 404)', () => {
    cy.visit('/');
    cy.get('a[href]').each(($a) => {
      const href = $a.attr('href') || '';
      if (!href.startsWith('/') || href.startsWith('//')) return;
      const url = href.split('#')[0].split('?')[0];
      if (!url || url === '/') return;
      cy.request({ url, failOnStatusCode: false }).then((res) => {
        expect(res.status, `${url}`).to.be.lessThan(400);
      });
    });
  });

  it('navegação principal fornece skip-link para o conteúdo', () => {
    cy.visit('/');
    cy.get('a.skip-link, a[href^="#conteudo"], a[href^="#main"]').first().should('exist');
  });
});
