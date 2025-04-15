// import './commands'
describe('Authentication', () => {
  it('should allow user to login', () => {
    cy.visit('/login-page');
    cy.login("verba@gmail.com", "Asdf1234567(");
    cy.url().should('include', '/footertabs/feed');
    cy.get('ion-title').should('contain', 'Hello');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login-page');
    cy.get('[data-cy=email-input]').type('invalid@example.com');
    cy.get('[data-cy=password-input]').type('wrongpassword');
    cy.get('[data-cy=login-button]').click();

    // Verify error toast appears
    cy.get('small').should('be.visible');
  });
});