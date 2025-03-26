describe('Login Page Frontend Validations', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should show both error messages, when logging in with invalid email and password', () => {
    let incorrectEmail = 'wrongemail.com';
    let incorrectPassword = 'bad123';

    cy.get('[data-cy="email_text_input"]').type(incorrectEmail);
    cy.get('[data-cy="password_text_input"]').type(incorrectPassword);

    cy.get('[data-cy="login_button"]').click();

    cy.get('[data-cy="email_text_input_container"]').should('have.css', '--after-content', '"Invalid email."');
    cy.get('[data-cy="password_text_input_container"]').should('have.css', '--after-content', '"Invalid password."');
  });

  it('should show a validation error for invalid email format', () => {
    let invalidEmail = 'nemjoemail.com';
    let validPassword = 'Nagyonbiztosjelszo123!';
    cy.get('[data-cy="email_text_input"]').type(invalidEmail);
    cy.get('[data-cy="password_text_input"]').type(validPassword);

    cy.get('[data-cy="login_button"]').click();

    cy.get('[data-cy="email_text_input"]').should('have.css', '--after-content', '"Invalid email."');
  });

  it('should show validation error if password is too short', () => {
    let validEmail = 'jo@email.com';
    let shortPassword = 'rov1!';
    cy.get('[data-cy="email_text_input"]').type(validEmail);
    cy.get('[data-cy="password_text_input"]').type(shortPassword);

    cy.get('[data-cy="login_button"]').click();

    cy.get('[data-cy="password_text_input"]').should('have.css', '--after-content', '"Invalid password."');
  });

  it("should show validation error if password doesn't include at least one uppercase letter", () => {
    let validEmail = 'jo@email.com';
    let invalidPassword = 'nincsbennenagybenu123!';
    cy.get('[data-cy="email_text_input"]').type(validEmail);
    cy.get('[data-cy="password_text_input"]').type(invalidPassword);

    cy.get('[data-cy="login_button"]').click();

    cy.get('[data-cy="password_text_input"]').should('have.css', '--after-content', '"Invalid password."');
  });

  it('should show a validation error if username or password is empty', () => {
    cy.get('[data-cy="login_button"]').click();

    cy.get('[data-cy="email_text_input_container"]').should('have.css', '--after-content', '"Email is required."');
    cy.get('[data-cy="password_text_input_container"]').should('have.css', '--after-content', '"Password is required."');
  });
});
