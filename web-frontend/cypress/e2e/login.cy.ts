describe('Login Page Frontend Validations', () => {
  beforeEach(() => {
    cy.logout();
  });

  it('should login', () => {
    cy.get('[data-cy="email_text_input"]').type('huba.trifusz@gmail.com');
    cy.get('[data-cy="password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="login_button"]').click();
  });

  it('should create an account', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: { message: 'Account created successfully' },
    }).as('registerRequest');

    cy.visit('localhost:4200/create-account');

    cy.get('[data-cy="first_name_text_input"]').type('Lajos');
    cy.get('[data-cy="last_name_text_input"]').type('Magyar');
    cy.get('[data-cy="email_text_input"]').type('test@gmail.com');
    cy.get('[data-cy="password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="confirm_password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="create_account_button"]').click();

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
  });

  it('should show an error when passwords do not match', () => {
    cy.visit('localhost:4200/create-account');

    cy.get('[data-cy="first_name_text_input"]').type('Lajos');
    cy.get('[data-cy="last_name_text_input"]').type('Magyar');
    cy.get('[data-cy="email_text_input"]').type('test@gmail.com');
    cy.get('[data-cy="password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="confirm_password_text_input"]').type('DifferentPassword123!');
    cy.get('[data-cy="create_account_button"]').click();

    cy.get('app-validation-message').should('be.visible').and('contain.text', 'Password and Confirm Password do not match.');
  });
});
