describe('Create Account Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/create-account');
  });

  it('should create an account with valid input', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: { message: 'Account created successfully' },
    }).as('registerRequest');

    cy.get('[data-cy="first_name_text_input"]').type('John');
    cy.get('[data-cy="last_name_text_input"]').type('Doe');
    cy.get('[data-cy="email_text_input"]').type('john.doe@example.com');
    cy.get('[data-cy="password_text_input"]').type('SecurePassword123!');
    cy.get('[data-cy="confirm_password_text_input"]').type('SecurePassword123!');
    cy.get('[data-cy="create_account_button"]').click();

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
  });

  it('should show validation error when fields are empty', () => {
    cy.get('[data-cy="create_account_button"]').click();

    cy.get('app-validation-message').should('be.visible').and('contain.text', 'All fields are requried.'); // Adjust message to match yours
  });

  it('should show error when email is invalid', () => {
    cy.get('[data-cy="email_text_input"]').type('invalid-email');
    cy.get('[data-cy="create_account_button"]').click();

    cy.get('app-validation-message').should('be.visible').and('contain.text', 'All fields are requried.'); // Adjust as needed
  });

  it('should show error when passwords do not match', () => {
    cy.get('[data-cy="first_name_text_input"]').type('Anna');
    cy.get('[data-cy="last_name_text_input"]').type('Smith');
    cy.get('[data-cy="email_text_input"]').type('anna.smith@example.com');
    cy.get('[data-cy="password_text_input"]').type('Password123!');
    cy.get('[data-cy="confirm_password_text_input"]').type('DifferentPassword456!');
    cy.get('[data-cy="create_account_button"]').click();

    cy.get('app-validation-message').should('be.visible').and('contain.text', 'Password and Confirm Password do not match');
  });

  it('should toggle password visibility', () => {
    cy.get('[data-cy="password_text_input"]').type('Password123!');
    cy.get('.toggle_password_icon').first().click();

    cy.get('[data-cy="password_text_input"]').should('have.attr', 'type', 'text');
  });

  it('should navigate back to login page', () => {
    cy.get('#return_button').click();
    cy.url().should('include', '/login');
  });
});
