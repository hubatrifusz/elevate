describe('Login Page Frontend Validations', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should login', () => {
    localStorage.clear();
    sessionStorage.clear();

    cy.get('[data-cy="email_text_input"]').type('huba.trifusz@gmail.com');
    cy.get('[data-cy="password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="login_button"]').click();
  });
});
