/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    logout(): void;
    login(): void;
  }
}

Cypress.Commands.add('logout', () => {
  localStorage.clear();
  sessionStorage.clear();
  cy.visit('localhost:4200/');
});

Cypress.Commands.add('login', () => {
  cy.logout();

  // Wait for login form to appear
  cy.get('[data-cy="email_text_input"]', { timeout: 10000 }).should('be.visible');
  cy.get('[data-cy="password_text_input"]').should('be.visible');

  // Fill in the form
  cy.get('[data-cy="email_text_input"]').clear().type('huba.trifusz@gmail.com');
  cy.get('[data-cy="password_text_input"]').clear().type('Nagyjelszo123!', { log: false });
  cy.get('[data-cy="login_button"]').should('not.be.disabled').click();

  // Wait for successful login (example: check if dashboard is loaded or token exists)
  cy.url({ timeout: 10000 }).should('include', '/dashboard'); // or wherever you land after login
});
