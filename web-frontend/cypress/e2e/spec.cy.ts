describe('Login Page Frontend Validations', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should show validation message when fields are empty and form is submitted', () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="email_text_input"]').then((input) => {
      const emailInput = input[0] as HTMLInputElement;
      expect(emailInput.validity.valueMissing).to.be.true;
    });

    cy.get('input[name="password_text_input"]').then((input) => {
      const passwordInput = input[0] as HTMLInputElement;
      expect(passwordInput.validity.valueMissing).to.be.true;
    });
  });

  it('should show a validation error for invalid email format', () => {
    let invalidEmail = 'nemjoemail.com';
    let validPassword = 'Nagyonbiztosjelszo123!';
    cy.get('input[name="email_text_input"]').type(invalidEmail);
    cy.get('input[name="password_text_input"]').type(validPassword);

    cy.get('button[type="submit"]').click();

    cy.get('input[name="email_text_input"]').should('have.css', '--after-content', '"Invalid email."');
  });

  it('should show validation error if password is too short', () => {
    let validEmail = 'jo@email.com';
    let shortPassword = 'rov1!';
    cy.get('input[name="email_text_input"]').type(validEmail);
    cy.get('input[name="password_text_input"]').type(shortPassword);

    cy.get('button[type="submit"]').click();

    cy.get('input[name="password_text_input"]').should('have.css', '--after-content', '"Invalid password."');
  });

  it('should show validation error if password doesn\'t include at least one uppercase letter', () => {
    let validEmail = 'jo@email.com';
    let invalidPassword = 'nincsbennenagybenu123!';
    cy.get('input[name="email_text_input"]').type(validEmail);
    cy.get('input[name="password_text_input"]').type(invalidPassword);

    cy.get('button[type="submit"]').click();

    cy.get('input[name="password_text_input"]').should('have.css', '--after-content', '"Invalid password."');
  });

  it('should show a validation error if username or password is empty', () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="email_text_input"]').should('have.css', '--after-content', '"Email is required."');
    cy.get('input[name="password_text_input"]').should('have.css', '--after-content', '"Password is required."');

  });
});
