describe('Smoke — rotas principais', () => {
  const rotas = [
    { path: '/', title: /Página inicial|Bruno Pulis/ },
    { path: '/servicos/', title: /Serviços/ },
    { path: '/sobre/', title: /Sobre/ },
    { path: '/portfolio/', title: /Portfolio|Portfólio/ },
    { path: '/palestras/', title: /Palestras/ },
    { path: '/contato/', title: /Contato/ }
  ];

  rotas.forEach(({ path, title }) => {
    it(`carrega ${path} com título e conteúdo`, () => {
      cy.visit(path);
      cy.title().should('match', title);
      cy.get('h1').should('be.visible');
    });
  });

  it('página inicial expõe idioma pt-br', () => {
    cy.visit('/');
    cy.get('html').should('have.attr', 'lang', 'pt-br');
  });

  it('versão em inglês expõe o idioma en', () => {
    cy.visit('/en/');
    cy.get('html').should('have.attr', 'lang', 'en');
  });

  it('navegação principal está presente na página inicial', () => {
    cy.visit('/');
    cy.get('nav').first().should('be.visible');
  });

  it('imagens com link carregam sem erro de rede', () => {
    cy.intercept('**/*').as('resources');
    cy.visit('/');
    cy.wait('@resources').its('response.statusCode').should('be.oneOf', [200, 204, 301, 302]);
  });
});
