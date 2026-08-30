Cypress.on('uncaught:exception', (err) => {
  if (err && err.message && /loading CSS/i.test(err.message)) {
    return false;
  }
});
