describe('Login Page Frontend Validations', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login'); // Adjust the route if needed
    cy.logout(); // Assuming you have a custom command for logout
  });

  it('should allow user to login with valid credentials', () => {
    cy.get('[data-cy="email_text_input"]').type('huba.trifusz@gmail.com');
    cy.get('[data-cy="password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="login_button"]').click();

    // You can assert redirection or success message here if you have one
    cy.url().should('not.include', '/login');
  });

  it('should show validation message if email is missing', () => {
    cy.get('[data-cy="password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="login_button"]').click();

    cy.get('app-validation-message').should('be.visible').and('contain.text', 'All fields are requried.'); // Adjust based on actual message
  });

  it('should show validation message if password is missing', () => {
    cy.get('[data-cy="email_text_input"]').type('huba.trifusz@gmail.com');
    cy.get('[data-cy="login_button"]').click();

    cy.get('app-validation-message').should('be.visible').and('contain.text', 'All fields are requried.'); // Adjust based on actual message
  });

  it('should toggle password visibility when clicking eye icon', () => {
    cy.get('[data-cy="password_text_input"]').type('TestPassword123!');
    cy.get('#toggle_password_icon').click();

    cy.get('[data-cy="password_text_input"]').should('have.attr', 'type', 'text'); // if it changes to text
  });

  it('should navigate to create account page', () => {
    cy.get('#redirect_to_create_account_button').click();
    cy.url().should('include', '/create-account');
  });

  it('should show validation message for invalid email format', () => {
    cy.get('[data-cy="email_text_input"]').type('invalidemail');
    cy.get('[data-cy="password_text_input"]').type('Nagyjelszo123!');
    cy.get('[data-cy="login_button"]').click();

    cy.get('app-validation-message').should('be.visible').and('contain.text', 'Please enter a valid email'); // Adjust to actual message
  });
});
